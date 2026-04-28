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

export async function updateVolunteerStatus(id: string, status: string) {
  await checkAdmin();
  await prisma.volunteer.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin/volunteers');
}

export async function deleteVolunteer(id: string) {
  await checkAdmin();
  await prisma.volunteer.delete({
    where: { id },
  });
  revalidatePath('/admin/volunteers');
}
