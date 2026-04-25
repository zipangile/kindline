import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference, clerkUserId } = body;

    const settings = await prisma.paymentSettings.findFirst();
    const secretKey = settings?.lencoSecret;
    const baseUrl = settings?.lencoBaseUrl || 'https://api.lenco.co/access/v2/';

    if (!secretKey) {
       return NextResponse.json({ error: 'Lenco gateway not configured' }, { status: 500 });
    }

    // Verify transaction with Lenco
    const response = await fetch(`${baseUrl}transactions/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Accept': 'application/json'
      }
    });

    const verificationData = await response.json();

    if (verificationData.status === true && verificationData.data.status === 'successful') {
      const { amount, currency, customer, reference: transactionId } = verificationData.data;

      await prisma.donation.create({
        data: {
          donorName: customer.fullName || 'Anonymous',
          donorEmail: customer.email,
          amount: amount,
          currency: currency,
          status: 'successful',
          gateway: 'lenco',
          transactionId: String(transactionId),
          clerkUserId: clerkUserId || null,
          type: 'one-time' // Lenco integration in this app is currently for one-time Kwacha donations
        }
      });

      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ verified: false }, { status: 400 });
  } catch (error) {
    console.error('Lenco payment verification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
