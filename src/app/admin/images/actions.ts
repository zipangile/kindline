'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { isSiteImageKey, PARTNER_KEY } from '@/lib/site-images';
import { IMAGE_MAX_BYTES, validateImageUrl } from '@/lib/image-validation';
import { prepareRasterUpload } from '@/lib/raster-upload';

export async function updateSiteImage(key: string, url: string, alt?: string) {
  await checkAdmin('CONTENT_EDITOR');
  if (typeof key !== 'string' || !isSiteImageKey(key)) throw new Error('Unknown image slot');
  if (alt !== undefined && typeof alt !== 'string') throw new Error('Invalid image description');
  alt = alt?.trim();
  if (alt && alt.length > 500) throw new Error('Description is too long');
  url = validateImageUrl(url);
  if (PARTNER_KEY.test(key) && url && !alt) throw new Error('Partner name is required');

  await prisma.siteImage.upsert({
    where: { key },
    update: { url, alt },
    create: { key, url, alt },
  });

  revalidatePath('/', 'layout');
  revalidatePath('/admin/images');
}

export async function removeSiteImage(key: string) {
  // Persist a tombstone rather than deleting: absence means use the original default.
  await updateSiteImage(key, '');
}

export async function uploadImage(formData: FormData) {
  await checkAdmin('CONTENT_EDITOR');
  const file = formData.get('file');
  if (!(file instanceof File) || !file.size) throw new Error('No image provided');

  // Security: File size and type validation
  const MAX_FILE_SIZE = IMAGE_MAX_BYTES;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.');
  }

  const raster = await prepareRasterUpload(new Uint8Array(await file.arrayBuffer()), file.type);
  const { createClient } = await import('@supabase/supabase-js');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for storage upload.');
  }

  // Use service role key to bypass RLS in this admin-only server action
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const fileExt = raster.extension;
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `site-images/${fileName}`;

  const { error } = await supabase.storage
    .from('images')
    .upload(filePath, raster.bytes, { contentType: raster.contentType, upsert: false });

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

  return validateImageUrl(publicUrl, false);
}
