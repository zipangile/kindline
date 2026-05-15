'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin, getUserEmail } from '@/lib/auth-utils';
import { sendCommunicationEmail } from '@/lib/email';
import { isValidEmail, sanitizeContent } from '@/lib/security';

export async function markMessageAsRead(id: string) {
  await checkAdmin('CONTENT_EDITOR');
  await prisma.contactMessage.update({
    where: { id },
    data: { status: 'read' },
  });
  revalidatePath('/admin/inbox');
}

export async function deleteMessage(id: string) {
  await checkAdmin('CONTENT_EDITOR');
  await prisma.contactMessage.delete({
    where: { id },
  });
  revalidatePath('/admin/inbox');
}

export async function replyToMessage(id: string, formData: FormData) {
  const adminEmail = await getUserEmail();
  await checkAdmin('CONTENT_EDITOR');

  const recipient = (formData.get('recipient') as string || '').trim().toLowerCase();
  const rawSubject = (formData.get('subject') as string || '').trim();
  const rawContent = (formData.get('content') as string || '').trim();

  if (!recipient || !rawSubject || !rawContent) {
    throw new Error('All fields are required.');
  }

  // Security: Input validation and length limits
  if (recipient.length > 254 || !isValidEmail(recipient)) {
    throw new Error('Invalid recipient email address');
  }

  if (rawSubject.length > 200) {
    throw new Error('Subject is too long');
  }

  if (rawContent.length > 5000) {
    throw new Error('Content is too long');
  }

  const content = sanitizeContent(rawContent);
  const subject = rawSubject;

  const result = await sendCommunicationEmail(recipient, subject, content);

  if (result?.success) {
    await prisma.communication.create({
      data: {
        recipient,
        subject,
        content,
        type: 'reply',
        sentBy: adminEmail,
      },
    });

    await prisma.contactMessage.update({
      where: { id },
      data: { status: 'replied' },
    });

    revalidatePath('/admin/inbox');
  } else {
    throw new Error('Failed to send reply.');
  }
}
