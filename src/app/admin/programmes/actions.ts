'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { isValidId, sanitizeContent, SECURITY_LIMITS } from '@/lib/security';

const ALLOWED_STATUSES = ['live', 'archived'];

export async function createProgram(formData: FormData) {
  await checkAdmin('CONTENT_EDITOR');
  const title = (formData.get('title') as string || '').trim();
  const rawDescription = (formData.get('description') as string || '').trim();
  const category = (formData.get('category') as string || '').trim();
  const status = (formData.get('status') as string || '').trim().toLowerCase();
  const image = (formData.get('image') as string || '').trim();

  // Security: Input validation and length limits
  if (!title) throw new Error('Title is required');
  if (title.length > SECURITY_LIMITS.TITLE) throw new Error('Title is too long');
  if (category.length > SECURITY_LIMITS.CATEGORY) throw new Error('Category is too long');
  if (!ALLOWED_STATUSES.includes(status)) throw new Error('Invalid status');
  if (rawDescription.length > SECURITY_LIMITS.CONTENT_MEDIUM) throw new Error('Description is too long');
  if (image && image.length > SECURITY_LIMITS.URL) throw new Error('Image URL is too long');

  const description = sanitizeContent(rawDescription);

  await prisma.program.create({
    data: {
      title,
      description,
      category,
      status,
      image,
    },
  });

  revalidatePath('/admin/programmes');
  revalidatePath('/programmes');
}

export async function updateProgram(id: string, formData: FormData) {
  await checkAdmin('CONTENT_EDITOR');
  if (!isValidId(id) || id.length > SECURITY_LIMITS.ID) throw new Error('Invalid ID format');
  const title = (formData.get('title') as string || '').trim();
  const rawDescription = (formData.get('description') as string || '').trim();
  const category = (formData.get('category') as string || '').trim();
  const status = (formData.get('status') as string || '').trim().toLowerCase();
  const image = (formData.get('image') as string || '').trim();

  // Security: Input validation and length limits
  if (!title) throw new Error('Title is required');
  if (title.length > SECURITY_LIMITS.TITLE) throw new Error('Title is too long');
  if (category.length > SECURITY_LIMITS.CATEGORY) throw new Error('Category is too long');
  if (!ALLOWED_STATUSES.includes(status)) throw new Error('Invalid status');
  if (rawDescription.length > SECURITY_LIMITS.CONTENT_MEDIUM) throw new Error('Description is too long');
  if (image && image.length > SECURITY_LIMITS.URL) throw new Error('Image URL is too long');

  const description = sanitizeContent(rawDescription);

  await prisma.program.update({
    where: { id },
    data: {
      title,
      description,
      category,
      status,
      image,
    },
  });

  revalidatePath('/admin/programmes');
  revalidatePath('/programmes');
}

export async function updateProgramStatus(id: string, status: string) {
  await checkAdmin('CONTENT_EDITOR');
  if (!isValidId(id) || id.length > SECURITY_LIMITS.ID) throw new Error('Invalid ID format');
  const normalizedStatus = status.toLowerCase();

  if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
    throw new Error('Invalid status');
  }

  await prisma.program.update({
    where: { id },
    data: { status: normalizedStatus },
  });

  revalidatePath('/admin/programmes');
  revalidatePath('/programmes');
}

export async function deleteProgram(id: string) {
  await checkAdmin('CONTENT_EDITOR');
  if (!isValidId(id) || id.length > SECURITY_LIMITS.ID) throw new Error('Invalid ID format');
  await prisma.program.delete({
    where: { id },
  });

  revalidatePath('/admin/programmes');
  revalidatePath('/programmes');
}
