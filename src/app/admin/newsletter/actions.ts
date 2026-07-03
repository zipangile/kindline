'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { Resend } from 'resend';
import { isValidEmail, isValidId, sanitizeContent, SECURITY_LIMITS } from '@/lib/security';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function subscribe(formData: FormData) {
  const rawEmail = formData.get('email') as string;
  if (!rawEmail) return;

  const email = rawEmail.trim().toLowerCase();

  // Basic validation: length and regex
  if (email.length > SECURITY_LIMITS.EMAIL || !isValidEmail(email)) {
    console.error('Invalid email subscription attempt:', email);
    return;
  }

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
  const rawSubject = formData.get('subject') as string;
  const rawContent = formData.get('content') as string;

  // Security: Basic sanitization and length limits
  if (rawSubject.length > SECURITY_LIMITS.SUBJECT) {
    throw new Error('Subject is too long');
  }

  // Remove <script> tags to prevent basic XSS in email clients that might execute them
  const content = sanitizeContent(rawContent);
  const subject = rawSubject;

  const subscribers = await prisma.subscriber.findMany({
    where: { status: 'active' },
    select: { email: true },
  });

  const emails = subscribers.map(s => s.email);

  if (emails.length === 0) return;

  try {
    // Security: Use bcc to prevent PII leakage between subscribers
    await resend.emails.send({
      from: 'Kindline Care <updates@kindlinecare.org>',
      to: 'Kindline Care <updates@kindlinecare.org>',
      bcc: emails,
      subject: subject,
      html: content,
    });
  } catch (error) {
    console.error('Email sending error:', error);
  }
}

export async function deleteSubscriber(id: string) {
  await checkAdmin('CONTENT_EDITOR');
  if (!isValidId(id) || id.length > SECURITY_LIMITS.ID) throw new Error('Invalid ID format');
  await prisma.subscriber.delete({
    where: { id },
  });
  revalidatePath('/admin/newsletter');
}
