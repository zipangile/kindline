'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { sendVolunteerStatusEmail } from '@/lib/email';
import { isValidId } from '@/lib/security';

const ALLOWED_STATUSES = ['pending', 'approved', 'rejected'];

export async function approveVolunteer(id: string) {
  await checkAdmin('VOLUNTEER_COORD');
  if (!isValidId(id)) throw new Error('Invalid volunteer ID');

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
  if (!isValidId(id)) throw new Error('Invalid volunteer ID');

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
    if (!isValidId(id)) throw new Error('Invalid volunteer ID');

    const normalizedStatus = status.toLowerCase();

    if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
        throw new Error('Invalid status');
    }

    const volunteer = await prisma.volunteer.update({
      where: { id },
      data: { status: normalizedStatus },
    });

    if (volunteer && (normalizedStatus === 'approved' || normalizedStatus === 'rejected')) {
      await sendVolunteerStatusEmail(volunteer.email, volunteer.name, normalizedStatus as 'approved' | 'rejected');
    }

    revalidatePath('/admin/volunteers');
  }

  export async function deleteVolunteer(id: string) {
    await checkAdmin('VOLUNTEER_COORD');
    if (!isValidId(id)) throw new Error('Invalid volunteer ID');

    await prisma.volunteer.delete({
      where: { id },
    });
    revalidatePath('/admin/volunteers');
  }
