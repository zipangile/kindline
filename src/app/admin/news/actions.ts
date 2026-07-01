'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import { sanitizeContent, SECURITY_LIMITS, isValidId } from '@/lib/security';

export async function createNewsPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  image?: string;
  published: boolean;
}) {
  await checkAdmin('CONTENT_EDITOR');

  // Security: Input validation and length limits
  if (data.title.length > SECURITY_LIMITS.TITLE) throw new Error('Title is too long');
  if (data.slug.length > SECURITY_LIMITS.SLUG) throw new Error('Slug is too long');
  if (data.category.length > SECURITY_LIMITS.CATEGORY) throw new Error('Category is too long');
  if (data.content.length > SECURITY_LIMITS.CONTENT_LONG) throw new Error('Content is too long');
  if (data.excerpt && data.excerpt.length > SECURITY_LIMITS.EXCERPT) throw new Error('Excerpt is too long');
  if (data.image && data.image.length > SECURITY_LIMITS.URL) throw new Error('Image URL is too long');

  const content = sanitizeContent(data.content);
  const excerpt = data.excerpt ? sanitizeContent(data.excerpt) : data.excerpt;

  await prisma.newsPost.create({
    data: {
      ...data,
      content,
      excerpt,
      publishedAt: data.published ? new Date() : null,
    },
  });

  revalidatePath('/news');
  revalidatePath(`/news/${data.slug}`);
  revalidatePath('/admin/news');
  redirect('/admin/news');
}

export async function updateNewsPost(id: string, data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  image?: string;
  published: boolean;
}) {
  await checkAdmin('CONTENT_EDITOR');

  // Security: ID validation
  if (!id || id.length > SECURITY_LIMITS.ID || !isValidId(id)) {
    throw new Error('Invalid news post ID');
  }

  // Security: Input validation and length limits
  if (data.title.length > SECURITY_LIMITS.TITLE) throw new Error('Title is too long');
  if (data.slug.length > SECURITY_LIMITS.SLUG) throw new Error('Slug is too long');
  if (data.category.length > SECURITY_LIMITS.CATEGORY) throw new Error('Category is too long');
  if (data.content.length > SECURITY_LIMITS.CONTENT_LONG) throw new Error('Content is too long');
  if (data.excerpt && data.excerpt.length > SECURITY_LIMITS.EXCERPT) throw new Error('Excerpt is too long');
  if (data.image && data.image.length > SECURITY_LIMITS.URL) throw new Error('Image URL is too long');

  const content = sanitizeContent(data.content);
  const excerpt = data.excerpt ? sanitizeContent(data.excerpt) : data.excerpt;

  const existing = await prisma.newsPost.findUnique({ where: { id } });

  let publishedAt = existing?.publishedAt;
  if (data.published && !existing?.published) {
    publishedAt = new Date();
  } else if (!data.published) {
    publishedAt = null;
  }

  await prisma.newsPost.update({
    where: { id },
    data: {
      ...data,
      content,
      excerpt,
      publishedAt,
    },
  });

  revalidatePath('/news');
  revalidatePath(`/news/${data.slug}`);
  if (existing && existing.slug !== data.slug) {
    revalidatePath(`/news/${existing.slug}`);
  }
  revalidatePath('/admin/news');
  redirect('/admin/news');
}

export async function deleteNewsPost(id: string) {
  await checkAdmin('CONTENT_EDITOR');

  // Security: ID validation
  if (!id || id.length > SECURITY_LIMITS.ID || !isValidId(id)) {
    throw new Error('Invalid news post ID');
  }

  const post = await prisma.newsPost.findUnique({ where: { id } });

  await prisma.newsPost.delete({
    where: { id },
  });

  revalidatePath('/news');
  if (post) {
    revalidatePath(`/news/${post.slug}`);
  }
  revalidatePath('/admin/news');
}
