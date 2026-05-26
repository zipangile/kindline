'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { sanitizeContent, SECURITY_LIMITS } from '@/lib/security';

export async function createImpactStat(formData: FormData) {
  await checkAdmin('CONTENT_EDITOR');
  const label = (formData.get('label') as string || '').trim();
  const value = (formData.get('value') as string || '').trim();
  const description = (formData.get('description') as string || '').trim();
  const icon = (formData.get('icon') as string || '').trim();
  const order = parseInt(formData.get('order') as string || '0');

  // Security: Input validation and length limits
  if (label.length > SECURITY_LIMITS.LABEL) throw new Error('Label is too long');
  if (value.length > SECURITY_LIMITS.VALUE) throw new Error('Value is too long');
  if (description.length > SECURITY_LIMITS.DESCRIPTION) throw new Error('Description is too long');
  if (icon.length > SECURITY_LIMITS.ICON) throw new Error('Icon is too long');

  await prisma.impactStat.create({
    data: { label, value, description, icon, order },
  });

  revalidatePath('/admin/impact');
  revalidatePath('/');
  revalidatePath('/impact');
}

export async function updateImpactStat(id: string, formData: FormData) {
  await checkAdmin('CONTENT_EDITOR');
  const label = (formData.get('label') as string || '').trim();
  const value = (formData.get('value') as string || '').trim();
  const description = (formData.get('description') as string || '').trim();
  const icon = (formData.get('icon') as string || '').trim();
  const order = parseInt(formData.get('order') as string || '0');

  // Security: Input validation and length limits
  if (label.length > SECURITY_LIMITS.LABEL) throw new Error('Label is too long');
  if (value.length > SECURITY_LIMITS.VALUE) throw new Error('Value is too long');
  if (description.length > SECURITY_LIMITS.DESCRIPTION) throw new Error('Description is too long');
  if (icon.length > SECURITY_LIMITS.ICON) throw new Error('Icon is too long');

  await prisma.impactStat.update({
    where: { id },
    data: { label, value, description, icon, order },
  });

  revalidatePath('/admin/impact');
  revalidatePath('/');
  revalidatePath('/impact');
}

export async function deleteImpactStat(id: string) {
  await checkAdmin('CONTENT_EDITOR');
  await prisma.impactStat.delete({
    where: { id },
  });

  revalidatePath('/admin/impact');
  revalidatePath('/');
  revalidatePath('/impact');
}

export async function createImpactStory(formData: FormData) {
  await checkAdmin('CONTENT_EDITOR');
  const title = (formData.get('title') as string || '').trim();
  const rawContent = (formData.get('content') as string || '').trim();
  const category = (formData.get('category') as string || '').trim();
  const author = (formData.get('author') as string || '').trim();
  const authorRole = (formData.get('authorRole') as string || '').trim();
  const image = (formData.get('image') as string || '').trim();

  // Security: Input validation and length limits
  if (title.length > SECURITY_LIMITS.TITLE) throw new Error('Title is too long');
  if (rawContent.length > SECURITY_LIMITS.CONTENT_MEDIUM) throw new Error('Content is too long');
  if (category.length > SECURITY_LIMITS.CATEGORY) throw new Error('Category is too long');
  if (author.length > SECURITY_LIMITS.NAME) throw new Error('Author is too long');
  if (authorRole.length > SECURITY_LIMITS.NAME) throw new Error('Author role is too long');
  if (image && image.length > SECURITY_LIMITS.URL) throw new Error('Image URL is too long');

  const content = sanitizeContent(rawContent);

  await prisma.impactStory.create({
    data: { title, content, category, author, authorRole, image },
  });

  revalidatePath('/admin/impact');
  revalidatePath('/');
  revalidatePath('/impact');
}

export async function deleteImpactStory(id: string) {
  await checkAdmin('CONTENT_EDITOR');
  await prisma.impactStory.delete({
    where: { id },
  });

  revalidatePath('/admin/impact');
  revalidatePath('/');
  revalidatePath('/impact');
}
