'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { isSiteImageKey, PARTNER_KEY } from '@/lib/site-images';
import { IMAGE_MAX_BYTES, validateImageUrl } from '@/lib/image-validation';
import { prepareRasterUpload } from '@/lib/raster-upload';
import { ImageUploadError, imageUploadFailure, type ImageUploadResult } from '@/lib/image-upload-result';
import { isServerStorageCredential } from '@/lib/storage-credential';

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

export async function uploadImage(formData: FormData): Promise<ImageUploadResult> {
  // Auth redirects/errors are deliberately OUTSIDE the expected-upload-error boundary.
  await checkAdmin('CONTENT_EDITOR');
  const file = formData.get('file');
  if (!(file instanceof File) || !file.size) return imageUploadFailure('NO_FILE');

  // Security: File size and type validation
  const MAX_FILE_SIZE = IMAGE_MAX_BYTES;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (file.size > MAX_FILE_SIZE) {
    return imageUploadFailure('INPUT_TOO_LARGE');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return imageUploadFailure('UNSUPPORTED_TYPE');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey || !isServerStorageCredential(supabaseServiceKey)) {
    return imageUploadFailure('STORAGE_CONFIG');
  }

  try {
    const raster = await prepareRasterUpload(new Uint8Array(await file.arrayBuffer()), file.type);
    const { createClient } = await import('@supabase/supabase-js');
    // Use service role key to bypass RLS in this admin-only server action.
    const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });

    const fileName = `${crypto.randomUUID()}.${raster.extension}`;
    const filePath = `site-images/${fileName}`;
    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, raster.bytes, { contentType: raster.contentType, upsert: false });

    if (error) {
      // Fixed public messages only: provider errors can contain credentials or request details.
      const status = String(error.statusCode ?? '');
      if (status === '401' || status === '403' || /InvalidCompactJWS|invalid.*(?:jwt|api.?key)|unauthorized/i.test(error.message)) return imageUploadFailure('STORAGE_AUTH');
      if (status === '413' || error.message === 'Payload too large') return imageUploadFailure('STORAGE_REJECTED');
      return imageUploadFailure('STORAGE_UNAVAILABLE');
    }

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
    return { ok: true, url: validateImageUrl(publicUrl, false) };
  } catch (error) {
    if (error instanceof ImageUploadError) return imageUploadFailure(error.code, error.processedBytes);
    return imageUploadFailure('UPLOAD_FAILED');
  }
}
