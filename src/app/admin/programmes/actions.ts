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

export async function createProgram(formData: FormData) {
  await checkAdmin();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const status = formData.get('status') as string;

  await prisma.program.create({
    data: {
      title,
      description,
      category,
      status,
    },
  });

  revalidatePath('/admin/programmes');
  revalidatePath('/programmes');
}

export async function updateProgram(id: string, formData: FormData) {
  await checkAdmin();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const status = formData.get('status') as string;

  await prisma.program.update({
    where: { id },
    data: {
      title,
      description,
      category,
      status,
    },
  });

  revalidatePath('/admin/programmes');
  revalidatePath('/programmes');
}

export async function updateProgramStatus(id: string, status: string) {
  await checkAdmin();
  await prisma.program.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin/programmes');
  revalidatePath('/programmes');
}

export async function deleteProgram(id: string) {
  await checkAdmin();
  await prisma.program.delete({
    where: { id },
  });

  revalidatePath('/admin/programmes');
  revalidatePath('/programmes');
}
