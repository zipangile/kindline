'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';

export async function approveVolunteer(id: string) {
  await checkAdmin('VOLUNTEER_COORD');
  await prisma.volunteer.update({
    where: { id },
    data: { status: 'approved' },
  });
  revalidatePath('/admin/volunteers');
}

export async function rejectVolunteer(id: string) {
  await checkAdmin('VOLUNTEER_COORD');
  await prisma.volunteer.update({
    where: { id },
    data: { status: 'rejected' },
  });
  revalidatePath('/admin/volunteers');
}

export async function updateVolunteerStatus(id: string, status: string) {
    await checkAdmin('VOLUNTEER_COORD');
    await prisma.volunteer.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/admin/volunteers');
  }

  export async function deleteVolunteer(id: string) {
    await checkAdmin('VOLUNTEER_COORD');
    await prisma.volunteer.delete({
      where: { id },
    });
    revalidatePath('/admin/volunteers');
  }
