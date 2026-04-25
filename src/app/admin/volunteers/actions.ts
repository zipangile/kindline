'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateVolunteerStatus(id: string, status: string) {
  await prisma.volunteer.update({
    where: { id },
    data: { status },
  });
  revalidatePath('/admin/volunteers');
}

export async function deleteVolunteer(id: string) {
  await prisma.volunteer.delete({
    where: { id },
  });
  revalidatePath('/admin/volunteers');
}
