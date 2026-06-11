'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { isValidEmail, SECURITY_LIMITS } from '@/lib/security';

export async function updatePaymentSettings(formData: FormData) {
  await checkAdmin('FINANCIAL_ADMIN');
  const flutterwaveSecret = formData.get('flutterwaveSecret') as string;
  const flutterwavePublic = formData.get('flutterwavePublic') as string;
  const flutterwaveEncrypt = formData.get('flutterwaveEncrypt') as string;
  const flutterwavePlanZMW = formData.get('flutterwavePlanZMW') as string;
  const flutterwavePlanUSD = formData.get('flutterwavePlanUSD') as string;
  const lencoSecret = formData.get('lencoSecret') as string;
  const lencoPublic = formData.get('lencoPublic') as string;
  const lencoSignatureKey = formData.get('lencoSignatureKey') as string;
  const lencoBaseUrl = formData.get('lencoBaseUrl') as string;
  const notificationEmail = formData.get('notificationEmail') as string;

  // Security: Input validation and length limits
  const fields = [
    flutterwaveSecret, flutterwavePublic, flutterwaveEncrypt,
    flutterwavePlanZMW, flutterwavePlanUSD, lencoSecret,
    lencoPublic, lencoSignatureKey, lencoBaseUrl
  ];

  for (const field of fields) {
    if (field && field.length > 500) {
      throw new Error('Configuration field too long (max 500 characters)');
    }
  }

  // Security: Validate Lenco Base URL to prevent SSRF or credential theft
  if (lencoBaseUrl) {
    try {
      const url = new URL(lencoBaseUrl);
      if (url.protocol !== 'https:') {
        throw new Error('Lenco Base URL must use HTTPS');
      }
      // Allow lenco.co and subdomains
      if (url.hostname !== 'lenco.co' && !url.hostname.endsWith('.lenco.co')) {
        throw new Error('Lenco Base URL must be a valid lenco.co domain');
      }
    } catch (e) {
      if (e instanceof Error && (e.message.includes('HTTPS') || e.message.includes('lenco.co'))) {
        throw e;
      }
      throw new Error('Invalid Lenco Base URL format');
    }
  }

  if (notificationEmail && (notificationEmail.length > SECURITY_LIMITS.EMAIL || !isValidEmail(notificationEmail))) {
    throw new Error('Invalid notification email');
  }

  const settings = await prisma.paymentSettings.findFirst();

  if (settings) {
    await prisma.paymentSettings.update({
      where: { id: settings.id },
      data: {
        flutterwaveSecret,
        flutterwavePublic,
        flutterwaveEncrypt,
        flutterwavePlanZMW,
        flutterwavePlanUSD,
        lencoSecret,
        lencoPublic,
        lencoSignatureKey,
        lencoBaseUrl,
        notificationEmail,
      },
    });
  } else {
    await prisma.paymentSettings.create({
      data: {
        flutterwaveSecret,
        flutterwavePublic,
        flutterwaveEncrypt,
        flutterwavePlanZMW,
        flutterwavePlanUSD,
        lencoSecret,
        lencoPublic,
        lencoSignatureKey,
        lencoBaseUrl,
        notificationEmail,
      },
    });
  }

  revalidatePath('/admin/settings');
  revalidatePath('/get-involved');
  revalidatePath('/volunteer');
}
