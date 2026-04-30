'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin, getUserEmail } from '@/lib/auth-utils';
import { sendCommunicationEmail } from '@/lib/email';

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

  const recipient = formData.get('recipient') as string;
  const subject = formData.get('subject') as string;
  const content = formData.get('content') as string;

  if (!recipient || !subject || !content) {
    throw new Error('All fields are required.');
  }

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
