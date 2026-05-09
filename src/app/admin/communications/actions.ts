'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin, getUserEmail } from '@/lib/auth-utils';
import { sendCommunicationEmail, sendVolunteerInvitation } from '@/lib/email';

export async function sendManualEmail(formData: FormData) {
  const adminEmail = await getUserEmail();
  await checkAdmin('CONTENT_EDITOR');

  const recipient = (formData.get('recipient') as string || '').trim().toLowerCase();
  const rawSubject = formData.get('subject') as string;
  const rawContent = formData.get('content') as string;

  if (!recipient || !rawSubject || !rawContent) {
    throw new Error('All fields are required.');
  }

  // Security: Basic sanitization and length limits
  if (recipient.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    throw new Error('Invalid recipient email');
  }

  if (rawSubject.length > 200) {
    throw new Error('Subject is too long');
  }

  const content = rawContent.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
  const subject = rawSubject;

  const result = await sendCommunicationEmail(recipient, subject, content);

  if (result?.success) {
    await prisma.communication.create({
      data: {
        recipient,
        subject,
        content,
        type: 'manual',
        sentBy: adminEmail,
      },
    });

    revalidatePath('/admin/communications');
  } else {
    throw new Error('Failed to send email.');
  }
}

export async function deleteCommunication(id: string) {
    await checkAdmin('CONTENT_EDITOR');
    await prisma.communication.delete({
      where: { id },
    });
    revalidatePath('/admin/communications');
  }

export async function sendVolunteerInvite(formData: FormData) {
  const adminEmail = await getUserEmail();
  await checkAdmin('VOLUNTEER_COORD');

  const recipient = formData.get('recipient') as string;
  const message = formData.get('message') as string;

  if (!recipient) {
    throw new Error('Recipient email is required.');
  }

  const result = await sendVolunteerInvitation(recipient, message);

  if (result?.success) {
    await prisma.communication.create({
      data: {
        recipient,
        subject: 'Volunteer Invitation',
        content: message || 'Standard volunteer invitation sent.',
        type: 'system',
        sentBy: adminEmail,
      },
    });

    revalidatePath('/admin/communications');
  } else {
    throw new Error('Failed to send invitation.');
  }
}
