'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export async function registerVolunteer(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('You must be signed in to volunteer');
    }

    const name = (formData.get('name') as string || '').trim();
    const email = (formData.get('email') as string || '').trim().toLowerCase();
    const phone = (formData.get('phone') as string || '').trim();
    const skills = (formData.get('skills') as string || '').trim();
    const interests = (formData.get('interests') as string || '').trim();
    const availability = (formData.get('availability') as string || '').trim();
    const experience = (formData.get('experience') as string || '').trim();
    const location = (formData.get('location') as string || '').trim();

    // Security: Input validation and length limits
    if (!name || !email) {
      throw new Error('Name and email are required');
    }

    if (name.length > 200) throw new Error('Name is too long');
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email address');
    }
    if (phone.length > 50) throw new Error('Phone number is too long');
    if (skills.length > 1000) throw new Error('Skills description is too long');
    if (interests.length > 1000) throw new Error('Interests description is too long');
    if (availability.length > 500) throw new Error('Availability description is too long');
    if (experience.length > 2000) throw new Error('Experience description is too long');
    if (location.length > 200) throw new Error('Location is too long');

    await prisma.volunteer.create({
      data: {
        supabaseUserId: user.id,
        name,
        email,
        phone,
        skills,
        interests,
        availability,
        experience,
        location,
      },
    });

    revalidatePath('/admin/volunteers');
    revalidatePath('/dashboard/volunteer');
    redirect('/dashboard/volunteer');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error('Error in registerVolunteer:', error);
    throw error;
  }
}
