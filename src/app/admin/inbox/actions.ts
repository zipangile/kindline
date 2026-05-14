'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin, getUserEmail } from '@/lib/auth-utils';
import { sendCommunicationEmail } from '@/lib/email';
import { sanitizeContent, isValidEmail } from '@/lib/security';

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
  const subject = (formData.get('subject') as string || '').trim();
  const content = (formData.get('content') as string || '').trim();

  if (!recipient || !subject || !content) {
    throw new Error('All fields are required.');
  }

  // Security: Input validation and length limits
  if (recipient.length > 254 || !isValidEmail(recipient)) {
    throw new Error('Invalid recipient email address');
  }

  if (subject.length > 200) {
    throw new Error('Subject is too long (max 200 characters)');
  }

  if (content.length > 10000) {
    throw new Error('Message is too long (max 10000 characters)');
  }

  const sanitizedContent = sanitizeContent(content);

  const result = await sendCommunicationEmail(recipient, subject, sanitizedContent);

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
