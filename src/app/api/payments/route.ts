import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transaction_id, tx_ref, status } = body;

    const settings = await prisma.paymentSettings.findFirst();
    const secretKey = settings?.flutterwaveSecret || process.env.FLUTTERWAVE_SECRET_KEY;

    if (!secretKey) {
       return NextResponse.json({ error: 'Gateway not configured' }, { status: 500 });
    }

    if (status === 'successful') {
      const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secretKey}`
        }
      });

      const verificationData = await response.json();

      if (verificationData.status === 'success' && verificationData.data.status === 'successful') {
        // Here you would typically log the donation in the database
        // For now, we'll just return success
        return NextResponse.json({ verified: true });
      }
    }

    return NextResponse.json({ verified: false }, { status: 400 });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
