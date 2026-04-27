'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function registerVolunteer(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to volunteer');
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const skills = formData.get('skills') as string;
  const interests = formData.get('interests') as string;

  await prisma.volunteer.create({
    data: {
      supabaseUserId: user.id,
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
