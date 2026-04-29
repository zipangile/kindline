import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference, supabaseUserId, phone } = body;

    const settings = await prisma.paymentSettings.findFirst();
    const secretKey = settings?.lencoSecret || process.env.LENCO_SECRET_KEY;
    let baseUrl = settings?.lencoBaseUrl || process.env.LENCO_BASE_URL || 'https://api.lenco.co/access/v2/';
    if (!baseUrl.endsWith('/')) baseUrl += '/';

    if (!secretKey) {
       return NextResponse.json({ error: 'Lenco gateway not configured' }, { status: 500 });
    }

    // Verify transaction with Lenco using the collections status endpoint
    console.log(`[Lenco API] Verifying reference: ${reference}`);
    const response = await fetch(`${baseUrl}collections/status/${reference}`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Lenco API] Verification request failed: ${response.status}`, errorText);
      return NextResponse.json({ verified: false, error: 'Lenco verification request failed' }, { status: response.status });
    }

    const verificationData = await response.json();
    console.log(`[Lenco API] Verification data:`, JSON.stringify(verificationData));

    if (verificationData.status === true && verificationData.data.status === 'successful') {
      const { amount, currency, customer, reference: transactionId, mobileMoneyDetails } = verificationData.data;

      // Check for existing donation to avoid duplicates (could have been handled by webhook)
      const existingDonation = await prisma.donation.findUnique({
        where: { transactionId: String(transactionId) },
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
      } else {
        // Update existing donation with user ID or phone if missing
        const updateData: any = {};
        if (supabaseUserId && !existingDonation.supabaseUserId) {
          updateData.supabaseUserId = supabaseUserId;
        }
        if ((phone || customer?.phone || mobileMoneyDetails?.phone) && !existingDonation.donorPhone) {
          updateData.donorPhone = phone || customer?.phone || mobileMoneyDetails?.phone;
        }

        if (Object.keys(updateData).length > 0) {
          await prisma.donation.update({
            where: { id: existingDonation.id },
            data: updateData
          });
        }
      }

      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ verified: false }, { status: 400 });
  } catch (error) {
    console.error('Lenco payment verification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
