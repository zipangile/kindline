import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// @ts-expect-error flutterwave-node-v3 does not have types
import Flutterwave from 'flutterwave-node-v3';
import { sendDonationEmails } from '@/lib/email';
import { SECURITY_LIMITS } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transaction_id = body.transaction_id || body.id;
    console.log('[Flutterwave API] Received verification request for ID:', transaction_id);
    const status = body.status;

    // Security: Validate transaction_id to prevent injection
    if (!transaction_id || (typeof transaction_id !== 'string' && typeof transaction_id !== 'number') || String(transaction_id).length > SECURITY_LIMITS.SUPABASE_USER_ID || !/^[a-zA-Z0-9.:_/-]+$/.test(String(transaction_id))) {
      console.error('[Flutterwave API] Invalid transaction ID format:', transaction_id);
      return NextResponse.json({ error: 'Invalid transaction ID' }, { status: 400 });
    }

    const settings = await prisma.paymentSettings.findFirst();
    const secretKey = settings?.flutterwaveSecret || process.env.FLUTTERWAVE_SECRET_KEY;
    const publicKey = settings?.flutterwavePublic || process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;

    if (!secretKey) {
       return NextResponse.json({ error: 'Gateway not configured' }, { status: 500 });
    }

    if (status?.toLowerCase() === 'successful' || status?.toLowerCase() === 'success') {
      // Try v3 verification first (library handles this)
      try {
        const flw = new Flutterwave(publicKey, secretKey);
        const verificationData = await flw.Transaction.verify({ id: transaction_id });
        console.log('[Flutterwave API] v3 verification result:', verificationData?.status, verificationData?.data?.status);

        if (verificationData?.status === 'success' && verificationData?.data?.status?.toLowerCase() === 'successful') {
          const { amount, currency, customer, meta, tx_ref, id } = verificationData.data;

          if (!customer?.email) {
            console.error('[Flutterwave API] Missing customer email in verification data');
            return NextResponse.json({ verified: false, error: 'Missing customer data' }, { status: 400 });
          }

          // Check for existing donation to avoid duplicates and race conditions
          const existingDonation = await prisma.donation.findUnique({
            where: { transactionId: String(id) },
          });

          if (!existingDonation) {
            const donation = await prisma.donation.create({
              data: {
                donorName: customer.name || 'Anonymous',
                donorEmail: customer.email,
                amount: amount,
                currency: currency,
                status: 'successful',
                gateway: 'flutterwave',
                transactionId: String(id),
                supabaseUserId: meta?.supabaseUserId || null,
                type: tx_ref.includes('monthly') ? 'monthly' : 'one-time'
              }
            });

            // Add to subscribers for nurture sequence
            try {
              await prisma.subscriber.upsert({
                where: { email: customer.email },
                update: { status: 'active', name: customer.name },
                create: { email: customer.email, name: customer.name },
              });

              // Send transactional emails using shared utility
              await sendDonationEmails({
                donorName: donation.donorName,
                donorEmail: donation.donorEmail,
                amount: donation.amount,
                currency: donation.currency,
                transactionId: donation.transactionId!,
                gateway: 'flutterwave',
                supabaseUserId: donation.supabaseUserId
              });
            } catch (subError) {
              console.error('Nurture sequence error:', subError);
            }
          }

          return NextResponse.json({ verified: true });
        }
      } catch (v3Error) {
        console.error('Flutterwave v3 verification failed, attempting direct API call:', v3Error);

        // Fallback to direct API verification (useful for v4 or when SDK fails)
        const res = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
          headers: {
            Authorization: `Bearer ${secretKey}`
          }
        });

        const verificationData = await res.json();
        console.log('[Flutterwave API] direct verification result:', verificationData?.status, verificationData?.data?.status);

        if (verificationData?.status === 'success' && verificationData?.data?.status?.toLowerCase() === 'successful') {
          const { amount, currency, customer, meta, tx_ref, id } = verificationData.data;

          if (!customer?.email) {
            console.error('[Flutterwave API] Missing customer email in direct verification data');
            return NextResponse.json({ verified: false, error: 'Missing customer data' }, { status: 400 });
          }

          // Check for existing donation
          const existingDonation = await prisma.donation.findUnique({
            where: { transactionId: String(id) },
          });

          if (!existingDonation) {
            const donation = await prisma.donation.create({
              data: {
                donorName: customer.name || 'Anonymous',
                donorEmail: customer.email,
                amount: amount,
                currency: currency,
                status: 'successful',
                gateway: 'flutterwave',
                transactionId: String(id),
                supabaseUserId: meta?.supabaseUserId || null,
                type: (tx_ref && tx_ref.includes('monthly')) ? 'monthly' : 'one-time'
              }
            });

            // Add to subscribers for nurture sequence
            try {
              await prisma.subscriber.upsert({
                where: { email: customer.email },
                update: { status: 'active', name: customer.name },
                create: { email: customer.email, name: customer.name },
              });

              // Send transactional emails using shared utility
              await sendDonationEmails({
                donorName: donation.donorName,
                donorEmail: donation.donorEmail,
                amount: donation.amount,
                currency: donation.currency,
                transactionId: donation.transactionId!,
                gateway: 'flutterwave',
                supabaseUserId: donation.supabaseUserId
              });
            } catch (subError) {
              console.error('Nurture sequence error:', subError);
            }
          }

          return NextResponse.json({ verified: true });
        }
      }
    }

    return NextResponse.json({ verified: false }, { status: 400 });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
