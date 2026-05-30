'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { SECURITY_LIMITS } from '@/lib/security';

export async function updateSiteImage(key: string, url: string, alt?: string) {
  await checkAdmin('CONTENT_EDITOR');

  // Security: Input validation and length limits
  if (!url || (typeof url !== 'string')) throw new Error('Invalid URL');

  const trimmedUrl = url.trim();
  if (trimmedUrl.length > SECURITY_LIMITS.URL) throw new Error('URL is too long');

  // Only allow relative paths (starting with /) or absolute https links
  if (!trimmedUrl.startsWith('/') && !trimmedUrl.startsWith('https://')) {
    throw new Error('Invalid image URL format. Only relative paths or https:// links are allowed.');
  }

  if (alt && alt.length > SECURITY_LIMITS.DESCRIPTION) {
    throw new Error('Alt text (description) is too long');
  }

  await prisma.siteImage.upsert({
    where: { key },
    update: { url: trimmedUrl, alt },
    create: { key, url: trimmedUrl, alt },
  });

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/admin/images');
}

export async function uploadImage(formData: FormData) {
  await checkAdmin('CONTENT_EDITOR');
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  // Security: File size and type validation
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.');
  }

  const { createClient } = await import('@supabase/supabase-js');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for storage upload.');
  }

  // Use service role key to bypass RLS in this admin-only server action
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `site-images/${fileName}`;

  const { error } = await supabase.storage
    .from('images')
    .upload(filePath, file);

  if (error) {
    console.error('[uploadImage] Supabase storage error:', error);
    if (error.message === 'Bucket not found') {
      throw new Error('The Supabase storage bucket "images" was not found. Please ensure it is created in your Supabase project.');
    }
    throw new Error(`Failed to upload image to Supabase: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
}
