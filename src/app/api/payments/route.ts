import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
const Flutterwave = require('flutterwave-node-v3');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transaction_id, tx_ref, status } = body;

    const settings = await prisma.paymentSettings.findFirst();
    const secretKey = settings?.flutterwaveSecret || process.env.FLUTTERWAVE_SECRET_KEY;
    const publicKey = settings?.flutterwavePublic || process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;

    if (!secretKey) {
       return NextResponse.json({ error: 'Gateway not configured' }, { status: 500 });
    }

    if (status === 'successful') {
      const flw = new Flutterwave(publicKey, secretKey);
      const verificationData = await flw.Transaction.verify({ id: transaction_id });

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
