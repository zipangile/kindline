'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import { sanitizeContent } from '@/lib/security';

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
  if (!data.title || data.title.length > 200) throw new Error('Invalid title');
  if (!data.slug || data.slug.length > 200 || !/^[a-z0-9-]+$/.test(data.slug)) throw new Error('Invalid slug');
  if (!data.content || data.content.length > 20000) throw new Error('Content too long');
  if (data.excerpt && data.excerpt.length > 1000) throw new Error('Excerpt too long');
  if (data.category && data.category.length > 100) throw new Error('Category too long');
  if (data.image && data.image.length > 1000) throw new Error('Image URL too long');

  const sanitizedContent = sanitizeContent(data.content);

  await prisma.newsPost.create({
    data: {
      ...data,
      content: sanitizedContent,
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

  // Security: Input validation and length limits
  if (!data.title || data.title.length > 200) throw new Error('Invalid title');
  if (!data.slug || data.slug.length > 200 || !/^[a-z0-9-]+$/.test(data.slug)) throw new Error('Invalid slug');
  if (!data.content || data.content.length > 20000) throw new Error('Content too long');
  if (data.excerpt && data.excerpt.length > 1000) throw new Error('Excerpt too long');
  if (data.category && data.category.length > 100) throw new Error('Category too long');
  if (data.image && data.image.length > 1000) throw new Error('Image URL too long');

  const sanitizedContent = sanitizeContent(data.content);

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
      content: sanitizedContent,
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
