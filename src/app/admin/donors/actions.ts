'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
// @ts-expect-error flutterwave-node-v3 does not have types
import Flutterwave from 'flutterwave-node-v3';
import { checkAdmin } from '@/lib/auth-utils';
import { isValidId } from '@/lib/security';

export async function verifyDonation(id: string) {
  await checkAdmin('FINANCIAL_ADMIN');
  if (!isValidId(id)) throw new Error('Invalid donation ID');
  const donation = await prisma.donation.findUnique({
    where: { id },
  });

  if (!donation || !donation.transactionId) {
    throw new Error('Donation not found or no transaction ID');
  }

  const settings = await prisma.paymentSettings.findFirst();

  if (donation.gateway === 'flutterwave') {
    const secretKey = settings?.flutterwaveSecret || process.env.FLUTTERWAVE_SECRET_KEY;
    const publicKey = settings?.flutterwavePublic || process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;

    if (!secretKey) throw new Error('Flutterwave not configured');

    try {
      const flw = new Flutterwave(publicKey, secretKey);
      const verificationData = await flw.Transaction.verify({ id: donation.transactionId });

      if (verificationData.status === 'success' && verificationData.data.status === 'successful') {
        await prisma.donation.update({
          where: { id },
          data: { status: 'successful' },
        });
      } else {
         // Fallback to direct API
         const res = await fetch(`https://api.flutterwave.com/v3/transactions/${donation.transactionId}/verify`, {
            headers: {
                Authorization: `Bearer ${secretKey}`
            }
         });
         const data = await res.json();
         if (data.status === 'success' && data.data.status === 'successful') {
             await prisma.donation.update({
                 where: { id },
                 data: { status: 'successful' },
             });
         }
      }
    } catch (error) {
      console.error('Manual Flutterwave verification failed:', error);
    }
  } else if (donation.gateway === 'lenco') {
    const secretKey = process.env.LENCO_SECRET_KEY || settings?.lencoSecret;
    let baseUrl = process.env.LENCO_BASE_URL || settings?.lencoBaseUrl || 'https://api.lenco.co/access/v2/';
    if (!baseUrl.endsWith('/')) baseUrl += '/';

    if (!secretKey) throw new Error('Lenco not configured');

    try {
      const response = await fetch(`${baseUrl}collections/status/${donation.transactionId}`, {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.status === true && data.data.status === 'successful') {
        await prisma.donation.update({
          where: { id },
          data: { status: 'successful' },
        });
      }
    } catch (error) {
      console.error('Manual Lenco verification failed:', error);
    }
  }

  revalidatePath('/admin/donors');
  revalidatePath('/dashboard/friend');
}

export async function deleteDonation(id: string) {
    await checkAdmin('FINANCIAL_ADMIN');
    if (!isValidId(id)) throw new Error('Invalid donation ID');
    await prisma.donation.delete({
        where: { id }
    });
    revalidatePath('/admin/donors');
}
