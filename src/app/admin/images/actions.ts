'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';

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
