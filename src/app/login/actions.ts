'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { isValidEmail, SECURITY_LIMITS } from '@/lib/security'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = (formData.get('email') as string || '').trim().toLowerCase();
  const password = formData.get('password') as string;

  // Security: Basic input validation
  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent('Email and password are required')}`);
  }

  if (email.length > SECURITY_LIMITS.EMAIL || !isValidEmail(email)) {
    redirect(`/login?error=${encodeURIComponent('Invalid email address')}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // Security: Use generic error message to prevent account enumeration
    redirect(`/login?error=${encodeURIComponent('Invalid login credentials')}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

import prisma from '@/lib/prisma'
import { sendNewVolunteerNotification } from '@/lib/email'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = (formData.get('email') as string || '').trim().toLowerCase();
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  // Security: Input validation and length limits
  if (!email || !password) {
    redirect(`/signup?error=${encodeURIComponent('Email and password are required')}${role ? `&role=${role}` : ''}`);
  }

  if (email.length > SECURITY_LIMITS.EMAIL || !isValidEmail(email)) {
    redirect(`/signup?error=${encodeURIComponent('Invalid email address')}${role ? `&role=${role}` : ''}`);
  }

  if (password.length < 6 || password.length > 100) {
    redirect(`/signup?error=${encodeURIComponent('Password must be between 6 and 100 characters')}${role ? `&role=${role}` : ''}`);
  }

  const isVolunteer = role === 'volunteer'

  const signupData: {
    email: string;
    password: string;
    options: {
      data: {
        role?: string;
        name?: string;
        phone?: string;
        location?: string;
        availability?: string;
        skills?: string;
        experience?: string;
        interests?: string;
      }
    }
  } = {
    email,
    password,
    options: {
      data: {}
    }
  }

  if (isVolunteer) {
    const name = (formData.get('name') as string || '').trim();
    const phone = (formData.get('phone') as string || '').trim();
    const location = (formData.get('location') as string || '').trim();
    const availability = (formData.get('availability') as string || '').trim();
    const skills = (formData.get('skills') as string || '').trim();
    const experience = (formData.get('experience') as string || '').trim();
    const interests = (formData.get('interests') as string || '').trim();

    // Security: Volunteer-specific validation
    if (!name) {
      redirect(`/signup?error=${encodeURIComponent('Name is required for volunteers')}&role=volunteer`);
    }

    if (name.length > SECURITY_LIMITS.NAME) throw new Error('Name is too long');
    if (phone.length > SECURITY_LIMITS.PHONE) throw new Error('Phone number is too long');
    if (location.length > SECURITY_LIMITS.LOCATION) throw new Error('Location is too long');
    if (availability.length > SECURITY_LIMITS.AVAILABILITY) throw new Error('Availability is too long');
    if (skills.length > SECURITY_LIMITS.SKILLS) throw new Error('Skills description is too long');
    if (experience.length > SECURITY_LIMITS.EXPERIENCE) throw new Error('Experience description is too long');
    if (interests.length > SECURITY_LIMITS.INTERESTS) throw new Error('Interests description is too long');

    signupData.options.data = {
      role: 'volunteer',
      name,
      phone,
      location,
      availability,
      skills,
      experience,
      interests,
    }
  }

  const { data: authData, error } = await supabase.auth.signUp(signupData)

  if (error) {
    // Security: Use generic error message to prevent information leakage
    redirect(`/signup?error=${encodeURIComponent('Signup failed. Please try again.')}${role ? `&role=${role}` : ''}`)
  }

  if (isVolunteer && authData.user) {
    try {
      const volunteer = await prisma.volunteer.create({
        data: {
          supabaseUserId: authData.user.id,
          name: signupData.options.data.name || 'Anonymous',
          email: email,
          phone: signupData.options.data.phone,
          location: signupData.options.data.location,
          availability: signupData.options.data.availability,
          skills: signupData.options.data.skills,
          experience: signupData.options.data.experience,
          interests: signupData.options.data.interests || '',
        },
      })

      await sendNewVolunteerNotification({
        name: volunteer.name,
        email: volunteer.email,
        skills: volunteer.skills
      });
    } catch (dbError) {
      console.error('Error creating volunteer record:', dbError)
      // We don't redirect here because the user is already created in Supabase
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
