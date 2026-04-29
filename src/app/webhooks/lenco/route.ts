import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    const signature = request.headers.get('x-lenco-signature');

    const settings = await prisma.paymentSettings.findFirst();
    const signatureKey = settings?.lencoSignatureKey || process.env.LENCO_SIGNATURE_KEY;

    if (!signatureKey) {
      console.error('[Lenco Webhook] Lenco signature key not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    if (!signature) {
      console.error('[Lenco Webhook] Missing x-lenco-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Verify signature
    const hash = crypto
      .createHmac('sha512', signatureKey)
      .update(bodyText)
      .digest('hex');

    console.log(`[Lenco Webhook] Signature verification: derived=${hash}, header=${signature}`);

    if (hash !== signature) {
      console.error('[Lenco Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    const { event, data } = payload;

    console.log(`[Lenco Webhook] Received event: ${event}`);

    if (event === 'collection.successful') {
      const { amount, currency, reference, lencoReference, mobileMoneyDetails, cardDetails, customer } = data;

      // Check if donation already exists to avoid duplicates
      const existingDonation = await prisma.donation.findUnique({
        where: { transactionId: String(reference) },
      });

      if (!existingDonation) {
        let donorName = 'Anonymous';
        let donorEmail = 'unknown@email.com';

        if (customer) {
          donorName = customer.fullName || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Anonymous';
          donorEmail = customer.email || donorEmail;
        } else if (mobileMoneyDetails?.accountName) {
            donorName = mobileMoneyDetails.accountName;
        }

        await prisma.donation.create({
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
