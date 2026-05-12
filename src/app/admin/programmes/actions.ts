'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';

export async function createProgram(formData: FormData) {
  await checkAdmin('CONTENT_EDITOR');
  const title = (formData.get('title') as string || '').trim();
  const description = (formData.get('description') as string || '').trim();
  const category = (formData.get('category') as string || '').trim();
  const status = (formData.get('status') as string || '').trim();
  const image = (formData.get('image') as string || '').trim();

  // Security: Input validation and length limits
  if (!title) throw new Error('Title is required');
  if (title.length > 200) throw new Error('Title is too long');
  if (category.length > 100) throw new Error('Category is too long');
  if (status.length > 50) throw new Error('Status is too long');
  if (description.length > 10000) throw new Error('Description is too long');
  if (image && image.length > 500) throw new Error('Image URL is too long');

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
  const title = (formData.get('title') as string || '').trim();
  const description = (formData.get('description') as string || '').trim();
  const category = (formData.get('category') as string || '').trim();
  const status = (formData.get('status') as string || '').trim();
  const image = (formData.get('image') as string || '').trim();

  // Security: Input validation and length limits
  if (!title) throw new Error('Title is required');
  if (title.length > 200) throw new Error('Title is too long');
  if (category.length > 100) throw new Error('Category is too long');
  if (status.length > 50) throw new Error('Status is too long');
  if (description.length > 10000) throw new Error('Description is too long');
  if (image && image.length > 500) throw new Error('Image URL is too long');

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

  if (status && status.length > 50) {
    throw new Error('Status is too long');
  }

  await prisma.program.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin/programmes');
  revalidatePath('/programmes');
}

export async function deleteProgram(id: string) {
  await checkAdmin('CONTENT_EDITOR');
  await prisma.program.delete({
    where: { id },
  });

  revalidatePath('/admin/programmes');
  revalidatePath('/programmes');
}
