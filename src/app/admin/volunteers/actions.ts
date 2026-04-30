'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { sendVolunteerStatusEmail } from '@/lib/email';

export async function approveVolunteer(id: string) {
  await checkAdmin('VOLUNTEER_COORD');
  const volunteer = await prisma.volunteer.update({
    where: { id },
    data: { status: 'approved' },
  });

  if (volunteer) {
    await sendVolunteerStatusEmail(volunteer.email, volunteer.name, 'approved');
  }

  revalidatePath('/admin/volunteers');
}

export async function rejectVolunteer(id: string) {
  await checkAdmin('VOLUNTEER_COORD');
  const volunteer = await prisma.volunteer.update({
    where: { id },
    data: { status: 'rejected' },
  });

  if (volunteer) {
    await sendVolunteerStatusEmail(volunteer.email, volunteer.name, 'rejected');
  }

  revalidatePath('/admin/volunteers');
}

export async function updateVolunteerStatus(id: string, status: string) {
    await checkAdmin('VOLUNTEER_COORD');
    const volunteer = await prisma.volunteer.update({
      where: { id },
      data: { status },
    });

    if (volunteer && (status === 'approved' || status === 'rejected')) {
      await sendVolunteerStatusEmail(volunteer.email, volunteer.name, status as 'approved' | 'rejected');
    }

    revalidatePath('/admin/volunteers');
  }

  export async function deleteVolunteer(id: string) {
    await checkAdmin('VOLUNTEER_COORD');
    await prisma.volunteer.delete({
      where: { id },
    });
    revalidatePath('/admin/volunteers');
  }
