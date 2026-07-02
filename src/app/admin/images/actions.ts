'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { SECURITY_LIMITS, isValidId } from '@/lib/security';

export async function updateSiteImage(key: string, url: string, alt?: string) {
  await checkAdmin('CONTENT_EDITOR');

  if (!isValidId(key)) throw new Error('Invalid key format');

  // Security: Input validation and length limits
  if (url.length > SECURITY_LIMITS.URL) throw new Error('URL is too long');
  if (alt && alt.length > SECURITY_LIMITS.DESCRIPTION) throw new Error('Description is too long');

  // Security: Validate URL format (relative or https)
  if (!url.startsWith('/') && !url.startsWith('https://')) {
    throw new Error('Image URL must be a relative path starting with / or an absolute https:// link');
  }

  await prisma.siteImage.upsert({
    where: { key },
    update: { url, alt },
    create: { key, url, alt },
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
