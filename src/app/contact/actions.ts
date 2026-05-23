'use server';

import prisma from '@/lib/prisma';
import { sendContactNotification } from '@/lib/email';
import { revalidatePath } from 'next/cache';
import { isValidEmail, SECURITY_LIMITS } from '@/lib/security';

export async function submitContactForm(formData: FormData) {
  const firstName = (formData.get('firstName') as string || '').trim();
  const lastName = (formData.get('lastName') as string || '').trim();
  const email = (formData.get('email') as string || '').trim().toLowerCase();
  const message = (formData.get('message') as string || '').trim();

  // Security: Input validation and length limits
  if (!email || !message) {
    return { success: false, error: 'Email and message are required.' };
  }

  if (firstName.length > 100 || lastName.length > 100) {
    return { success: false, error: 'Name is too long (max 100 characters per field).' };
  }

  if (!isValidEmail(email)) {
    return { success: false, error: 'Invalid email address.' };
  }

  if (message.length > SECURITY_LIMITS.MESSAGE_MAX) {
    return { success: false, error: `Message is too long (max ${SECURITY_LIMITS.MESSAGE_MAX} characters).` };
  }

  const fullName = `${firstName} ${lastName}`.trim() || 'Anonymous';

  try {
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: fullName,
        email,
        message,
      },
    });

    await sendContactNotification({
      name: contactMessage.name,
      email: contactMessage.email,
      message: contactMessage.message,
    });

    revalidatePath('/admin/inbox');
    return { success: true };
  } catch (error) {
    console.error('Contact form submission error:', error);
    return { success: false, error: 'Failed to send message. Please try again later.' };
  }
}
