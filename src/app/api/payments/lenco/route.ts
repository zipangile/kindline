import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendDonationEmails } from '@/lib/email';
import { SECURITY_LIMITS } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference, supabaseUserId, phone } = body;
    console.log('[Lenco API] Received verification request for reference:', reference);

    // Security: Validate reference to prevent injection or SSRF-like behavior
    if (!reference || typeof reference !== 'string' || reference.length > 100 || !/^[a-zA-Z0-9.:_/-]+$/.test(reference)) {
      console.error('[Lenco API] Invalid reference format:', reference);
      return NextResponse.json({ error: 'Invalid reference' }, { status: 400 });
    }

    // Security: Validate supabaseUserId and phone to prevent malformed data or injection
    if (supabaseUserId && (typeof supabaseUserId !== 'string' || supabaseUserId.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(supabaseUserId))) {
      console.error('[Lenco API] Invalid supabaseUserId format:', supabaseUserId);
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    if (phone && (typeof phone !== 'string' || phone.length > SECURITY_LIMITS.PHONE || !/^[0-9+\-\s]+$/.test(phone))) {
      console.error('[Lenco API] Invalid phone format:', phone);
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const settings = await prisma.paymentSettings.findFirst();
    const secretKey = process.env.LENCO_SECRET_KEY || settings?.lencoSecret;
    let baseUrl = process.env.LENCO_BASE_URL || settings?.lencoBaseUrl || 'https://api.lenco.co/access/v2/';
    if (!baseUrl.endsWith('/')) baseUrl += '/';

    if (!secretKey) {
       console.error('[Lenco API] Secret key not configured');
       return NextResponse.json({ error: 'Lenco gateway not configured' }, { status: 500 });
    }

    // Verify transaction with Lenco using the collections status endpoint
    console.log(`[Lenco API] Verifying reference: ${reference} against ${baseUrl}`);
    const response = await fetch(`${baseUrl}collections/status/${reference}`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Lenco API] Verification request failed: ${response.status}`, errorText);
      return NextResponse.json({ verified: false, error: 'Lenco verification request failed' }, { status: response.status });
    }

    const verificationData = await response.json();
    console.log(`[Lenco API] Verification data received status:`, verificationData?.status, verificationData?.data?.status);

    const isSuccess = verificationData.status === true || verificationData.status === 'success';
    if (isSuccess && verificationData.data && (verificationData.data.status?.toLowerCase() === 'successful' || verificationData.data.status?.toLowerCase() === 'success')) {
      const { amount, currency, customer, reference: transactionId, mobileMoneyDetails } = verificationData.data;

      if (!amount) {
        console.error('[Lenco API] Missing amount in verification data');
        return NextResponse.json({ verified: false, error: 'Missing payment amount' }, { status: 400 });
      }

      // Check for existing donation to avoid duplicates (could have been handled by webhook)
      const existingDonation = await prisma.donation.findUnique({
        where: { transactionId: String(transactionId) },
      });

      let finalDonation = existingDonation;

      if (!existingDonation) {
        let donorName = 'Anonymous';
        let donorEmail = 'unknown@email.com';

        if (customer) {
          donorName = (customer.fullName || `${customer.firstName || ''} ${customer.lastName || ''}`).trim() || 'Anonymous';
          donorEmail = customer.email || donorEmail;
        } else if (mobileMoneyDetails?.accountName) {
            donorName = mobileMoneyDetails.accountName;
        }

        finalDonation = await prisma.donation.create({
          data: {
            donorName,
            donorEmail,
            donorPhone: phone || customer?.phone || mobileMoneyDetails?.phone || null,
            amount: parseFloat(amount),
            currency: currency,
            status: 'successful',
            gateway: 'lenco',
            transactionId: String(transactionId),
            supabaseUserId: supabaseUserId || null,
            type: 'one-time'
          }
        });
        console.log(`[Lenco API] Donation record created: ${finalDonation.id}`);

        // Send transactional emails only for new donations
        if (finalDonation && finalDonation.donorEmail !== 'unknown@email.com') {
          // Trigger emails asynchronously
          sendDonationEmails({
            donorName: finalDonation.donorName,
            donorEmail: finalDonation.donorEmail,
            amount: finalDonation.amount,
            currency: finalDonation.currency,
            transactionId: finalDonation.transactionId!,
            gateway: 'lenco',
            supabaseUserId: finalDonation.supabaseUserId
          }).catch(e => console.error('[Lenco API] Email sending failed:', e));

          // Add to subscribers
          await prisma.subscriber.upsert({
            where: { email: finalDonation.donorEmail },
            update: { status: 'active', name: finalDonation.donorName },
            create: { email: finalDonation.donorEmail, name: finalDonation.donorName },
          }).catch(e => console.error('[Lenco API] Subscriber upsert failed:', e));
        }
      } else {
        // Update existing donation with user ID or phone if missing
        const updateData: Record<string, string> = {};
        if (supabaseUserId && !existingDonation.supabaseUserId) {
          updateData.supabaseUserId = supabaseUserId;
        }
        if ((phone || customer?.phone || mobileMoneyDetails?.phone) && !existingDonation.donorPhone) {
          updateData.donorPhone = phone || customer?.phone || mobileMoneyDetails?.phone;
        }

        if (Object.keys(updateData).length > 0) {
          finalDonation = await prisma.donation.update({
            where: { id: existingDonation.id },
            data: updateData
          });
          console.log(`[Lenco API] Donation record updated: ${finalDonation.id}`);
        }
      }

      return NextResponse.json({ verified: true });
    }

    console.warn(`[Lenco API] Verification failed or status not successful:`, JSON.stringify(verificationData));
    return NextResponse.json({ verified: false }, { status: 400 });
  } catch (error) {
    console.error('Lenco payment verification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
