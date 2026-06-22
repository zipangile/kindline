import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendDonationEmails } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    const signature = request.headers.get('x-lenco-signature');

    const settings = await prisma.paymentSettings.findFirst();
    const signatureKey = process.env.LENCO_SIGNATURE_KEY || settings?.lencoSignatureKey;

    if (!signatureKey) {
      console.error('[Lenco Webhook] Lenco signature key not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    if (!signature) {
      console.error('[Lenco Webhook] Missing x-lenco-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Verify signature timing-safely
    const hash = crypto
      .createHmac('sha512', signatureKey)
      .update(bodyText)
      .digest('hex');

    try {
      if (!crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature))) {
        console.error('[Lenco Webhook] Invalid signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    } catch {
      console.error('[Lenco Webhook] Signature verification error (likely length mismatch)');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      console.error('[Lenco Webhook] Invalid payload format');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const { event, data } = payload;

    console.log(`[Lenco Webhook] Received event: ${event}`);

    if (event === 'collection.successful') {
      const { amount, currency, reference, mobileMoneyDetails, customer } = data;

      // Check if donation already exists to avoid duplicates
      const existingDonation = await prisma.donation.findUnique({
        where: { transactionId: String(reference) },
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
            donorPhone: customer?.phone || mobileMoneyDetails?.phone || null,
            amount: parseFloat(amount),
            currency: currency,
            status: 'successful',
            gateway: 'lenco',
            transactionId: String(reference),
            type: 'one-time',
          },
        });
        console.log(`[Lenco Webhook] Donation created for reference: ${reference}`);

        // Send transactional emails only for NEW donations
        if (finalDonation && finalDonation.donorEmail !== 'unknown@email.com') {
          sendDonationEmails({
            donorName: finalDonation.donorName,
            donorEmail: finalDonation.donorEmail,
            amount: finalDonation.amount,
            currency: finalDonation.currency,
            transactionId: finalDonation.transactionId!,
            gateway: 'lenco',
            supabaseUserId: finalDonation.supabaseUserId
          }).catch(e => console.error('[Lenco Webhook] Email sending failed:', e));

          // Add to subscribers
          await prisma.subscriber.upsert({
            where: { email: finalDonation.donorEmail },
            update: { status: 'active', name: finalDonation.donorName },
            create: { email: finalDonation.donorEmail, name: finalDonation.donorName },
          }).catch(e => console.error('[Lenco Webhook] Subscriber upsert failed:', e));
        }
      } else {
        console.log(`[Lenco Webhook] Donation already exists for reference: ${reference}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Lenco Webhook] Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
