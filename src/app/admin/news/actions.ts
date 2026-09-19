'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import { sanitizeContent } from '@/lib/security';
import { validateImageUrl } from '@/lib/image-validation';

export async function updateNewsImage(id: string, image: string) {
  await checkAdmin('CONTENT_EDITOR');
  const url = validateImageUrl(image);
  const post = await prisma.newsPost.update({ where: { id }, data: { image: url || null } });
  revalidatePath('/news');
  revalidatePath(`/news/${post.slug}`);
  revalidatePath('/admin/news');
  revalidatePath(`/admin/news/edit/${id}`);
  return { image: post.image };
}

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
  if (data.title.length > 200) throw new Error('Title is too long');
  if (data.slug.length > 200) throw new Error('Slug is too long');
  if (data.category.length > 100) throw new Error('Category is too long');
  if (data.content.length > 20000) throw new Error('Content is too long');
  if (data.excerpt && data.excerpt.length > 500) throw new Error('Excerpt is too long');
  if (data.image && data.image.length > 500) throw new Error('Image URL is too long');

  const content = sanitizeContent(data.content);
  const excerpt = data.excerpt ? sanitizeContent(data.excerpt) : data.excerpt;

  await prisma.newsPost.create({
    data: {
      ...data,
      image: validateImageUrl(data.image ?? '') || null,
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

  // Security: Input validation and length limits
  if (data.title.length > 200) throw new Error('Title is too long');
  if (data.slug.length > 200) throw new Error('Slug is too long');
  if (data.category.length > 100) throw new Error('Category is too long');
  if (data.content.length > 20000) throw new Error('Content is too long');
  if (data.excerpt && data.excerpt.length > 500) throw new Error('Excerpt is too long');
  if (data.image && data.image.length > 500) throw new Error('Image URL is too long');

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
      image: validateImageUrl(data.image ?? '') || null,
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
