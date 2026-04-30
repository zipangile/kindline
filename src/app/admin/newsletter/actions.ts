'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function subscribe(formData: FormData) {
  const email = formData.get('email') as string;
  if (!email || email.length > 254) return;

  try {
    await prisma.subscriber.upsert({
      where: { email },
      update: { status: 'active' },
      create: { email },
    });
  } catch (error) {
    console.error('Subscription error:', error);
  }
}

export async function sendNewsletter(formData: FormData) {
  await checkAdmin('CONTENT_EDITOR');
  const subject = formData.get('subject') as string;
  let content = formData.get('content') as string;

  // Basic sanitization: strip script tags
  content = content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, "");

  const subscribers = await prisma.subscriber.findMany({
    where: { status: 'active' },
    select: { email: true },
  });

  const emails = subscribers.map(s => s.email);

  if (emails.length === 0) return;

  try {
    await resend.emails.send({
      from: 'Kindline Care <updates@kindlinecare.org>',
      to: emails,
      subject: subject,
      html: content,
    });
  } catch (error) {
    console.error('Email sending error:', error);
  }
}

export async function deleteSubscriber(id: string) {
  await checkAdmin('CONTENT_EDITOR');
  await prisma.subscriber.delete({
    where: { id },
  });
  revalidatePath('/admin/newsletter');
}
