'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function registerVolunteer(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('You must be signed in to volunteer');
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const skills = formData.get('skills') as string;
  const interests = formData.get('interests') as string;

  await prisma.volunteer.create({
    data: {
      clerkUserId: userId,
      name,
      email,
      phone,
      skills,
      interests,
    },
  });

  revalidatePath('/admin/volunteers');
  revalidatePath('/dashboard/volunteer');
  redirect('/dashboard/volunteer');
}
