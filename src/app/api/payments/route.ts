import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// @ts-expect-error flutterwave-node-v3 does not have types
import Flutterwave from 'flutterwave-node-v3';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transaction_id, status } = body;

    const settings = await prisma.paymentSettings.findFirst();
    const secretKey = settings?.flutterwaveSecret || process.env.FLUTTERWAVE_SECRET_KEY;
    const publicKey = settings?.flutterwavePublic || process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;

    if (!secretKey) {
       return NextResponse.json({ error: 'Gateway not configured' }, { status: 500 });
    }

    if (status === 'successful') {
      // Try v3 verification first (library handles this)
      try {
        const flw = new Flutterwave(publicKey, secretKey);
        const verificationData = await flw.Transaction.verify({ id: transaction_id });

        if (verificationData.status === 'success' && verificationData.data.status === 'successful') {
          const { amount, currency, customer, meta, tx_ref, id } = verificationData.data;

          await prisma.donation.create({
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

            if (process.env.RESEND_API_KEY) {
              await resend.emails.send({
                from: 'Kindline Care <impact@kindlinecare.org>',
                to: customer.email,
                subject: 'Thank you for your life-changing gift',
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #8B438E;">Thank you, ${customer.name || 'Friend'}!</h1>
                    <p style="font-size: 16px; line-height: 1.6; color: #333;">
                      Your donation of <strong>${currency} ${amount}</strong> has been received and is already being put to work.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; color: #333;">
                      Because of your generosity, we can continue to provide education for orphans and economic tools for widows in Zambia.
                      In the coming weeks, we'll share stories of the specific lives you are helping to transform.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; color: #333;">
                      With gratitude,<br>
                      <strong>The Kindline Care Team</strong>
                    </p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999; text-align: center;">
                      You are receiving this because you made a donation to Kindline Care Foundation.
                    </p>
                  </div>
                `
              });
            }
          } catch (subError) {
            console.error('Nurture sequence error:', subError);
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

        if (verificationData.status === 'success' && verificationData.data.status === 'successful') {
          const { amount, currency, customer, meta, tx_ref, id } = verificationData.data;

          await prisma.donation.create({
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

            if (process.env.RESEND_API_KEY) {
              await resend.emails.send({
                from: 'Kindline Care <impact@kindlinecare.org>',
                to: customer.email,
                subject: 'Thank you for your life-changing gift',
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h1 style="color: #8B438E;">Thank you, ${customer.name || 'Friend'}!</h1>
                    <p style="font-size: 16px; line-height: 1.6; color: #333;">
                      Your donation of <strong>${currency} ${amount}</strong> has been received and is already being put to work.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; color: #333;">
                      Because of your generosity, we can continue to provide education for orphans and economic tools for widows in Zambia.
                      In the coming weeks, we'll share stories of the specific lives you are helping to transform.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; color: #333;">
                      With gratitude,<br>
                      <strong>The Kindline Care Team</strong>
                    </p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999; text-align: center;">
                      You are receiving this because you made a donation to Kindline Care Foundation.
                    </p>
                  </div>
                `
              });
            }
          } catch (subError) {
            console.error('Nurture sequence error:', subError);
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
