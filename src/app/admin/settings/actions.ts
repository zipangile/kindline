'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL || 'sobhuxa@gmail.com';
  const isAdmin = user?.app_metadata?.role === 'admin' || user?.email === adminEmail;
  if (!isAdmin) {
    redirect('/login');
  }
}

export async function updatePaymentSettings(formData: FormData) {
  await checkAdmin();
  const flutterwaveSecret = formData.get('flutterwaveSecret') as string;
  const flutterwavePublic = formData.get('flutterwavePublic') as string;
  const flutterwaveEncrypt = formData.get('flutterwaveEncrypt') as string;
  const flutterwavePlanZMW = formData.get('flutterwavePlanZMW') as string;
  const flutterwavePlanUSD = formData.get('flutterwavePlanUSD') as string;
  const lencoSecret = formData.get('lencoSecret') as string;
  const lencoPublic = formData.get('lencoPublic') as string;
  const lencoBaseUrl = formData.get('lencoBaseUrl') as string;

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
        lencoBaseUrl,
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
        lencoBaseUrl,
      },
    });
  }

  revalidatePath('/admin/settings');
  revalidatePath('/get-involved');
  revalidatePath('/volunteer');
}
