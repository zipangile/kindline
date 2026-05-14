'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { sanitizeContent } from '@/lib/security';

export async function createImpactStat(formData: FormData) {
  await checkAdmin('CONTENT_EDITOR');
  const label = formData.get('label') as string;
  const value = formData.get('value') as string;
  const description = formData.get('description') as string;
  const icon = formData.get('icon') as string;
  const order = parseInt(formData.get('order') as string || '0');

  // Security: Input validation and length limits
  if (!label || label.length > 100) throw new Error('Invalid label');
  if (!value || value.length > 50) throw new Error('Invalid value');
  if (description && description.length > 500) throw new Error('Description too long');
  if (icon && icon.length > 100) throw new Error('Icon name too long');

  await prisma.impactStat.create({
    data: { label, value, description, icon, order },
  });

  revalidatePath('/admin/impact');
  revalidatePath('/');
  revalidatePath('/impact');
}

export async function updateImpactStat(id: string, formData: FormData) {
  await checkAdmin('CONTENT_EDITOR');
  const label = formData.get('label') as string;
  const value = formData.get('value') as string;
  const description = formData.get('description') as string;
  const icon = formData.get('icon') as string;
  const order = parseInt(formData.get('order') as string || '0');

  // Security: Input validation and length limits
  if (!label || label.length > 100) throw new Error('Invalid label');
  if (!value || value.length > 50) throw new Error('Invalid value');
  if (description && description.length > 500) throw new Error('Description too long');
  if (icon && icon.length > 100) throw new Error('Icon name too long');

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
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const category = formData.get('category') as string;
  const author = formData.get('author') as string;
  const authorRole = formData.get('authorRole') as string;
  const image = formData.get('image') as string;

  // Security: Input validation and length limits
  if (!title || title.length > 200) throw new Error('Invalid title');
  if (!content || content.length > 10000) throw new Error('Content too long');
  if (category && category.length > 100) throw new Error('Category too long');
  if (author && author.length > 100) throw new Error('Author name too long');
  if (authorRole && authorRole.length > 100) throw new Error('Author role too long');
  if (image && image.length > 1000) throw new Error('Image URL too long');

  const sanitizedContent = sanitizeContent(content);

  await prisma.impactStory.create({
    data: { title, content: sanitizedContent, category, author, authorRole, image },
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
