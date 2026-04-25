'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function registerVolunteer(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const skills = formData.get('skills') as string;
  const interests = formData.get('interests') as string;

  await prisma.volunteer.create({
    data: {
      name,
      email,
      phone,
      skills,
      interests,
    },
  });

  revalidatePath('/admin/volunteers');
}
