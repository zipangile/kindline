'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { createClient } from '@/utils/supabase/server';

export async function uploadImage(formData: FormData) {
  await checkAdmin();
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const supabase = await createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `site-images/${fileName}`;

  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload image to Supabase');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function updateSiteImage(key: string, url: string, alt?: string) {
  await checkAdmin();

  await prisma.siteImage.upsert({
    where: { key },
    update: { url, alt },
    create: { key, url, alt },
  });

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/admin/images');
}
