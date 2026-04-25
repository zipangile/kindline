'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createProgram(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const status = formData.get('status') as string;

  await prisma.program.create({
    data: {
      title,
      description,
      category,
      status,
    },
  });

  revalidatePath('/admin/programmes');
  revalidatePath('/programmes');
}

export async function updateProgramStatus(id: string, status: string) {
  await prisma.program.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin/programmes');
  revalidatePath('/programmes');
}

export async function deleteProgram(id: string) {
  await prisma.program.delete({
    where: { id },
  });

  revalidatePath('/admin/programmes');
  revalidatePath('/programmes');
}
