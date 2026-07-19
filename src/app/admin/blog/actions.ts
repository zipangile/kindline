'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { checkAdmin } from '@/lib/auth-utils';
import { getOrganization, hasFeature } from '@/lib/features';

export async function createPost(formData: FormData) {
  await checkAdmin('CONTENT_EDITOR');
  const org = await getOrganization();

  if (!hasFeature(org, "BLOG")) {
    throw new Error("Blog & CMS features are locked on your current tier. Please upgrade!");
  }

  const title = (formData.get('title') as string || '').trim();
  const content = (formData.get('body') as string || '').trim();
  const type = formData.get('type') as 'STANDARD' | 'IMPACT_STORY';
  const published = formData.get('published') === 'true';
  const featured = formData.get('featured') === 'true';

  if (!title || !content) {
    throw new Error("Title and body are required");
  }

  // Generate slug
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // Enforce featured gate
  if (featured && !hasFeature(org, "BLOG_FEATURED_PLACEMENT")) {
    throw new Error("Featured placement is a premium PRO feature. Please upgrade to set featured posts.");
  }

  await prisma.post.create({
    data: {
      title,
      slug,
      body: content,
      type,
      featured,
      publishedAt: published ? new Date() : null,
    }
  });

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  revalidatePath('/impact');
}

export async function updatePost(id: string, formData: FormData) {
  await checkAdmin('CONTENT_EDITOR');
  const org = await getOrganization();

  if (!hasFeature(org, "BLOG")) {
    throw new Error("Blog & CMS features are locked on your current tier. Please upgrade!");
  }

  const title = (formData.get('title') as string || '').trim();
  const content = (formData.get('body') as string || '').trim();
  const type = formData.get('type') as 'STANDARD' | 'IMPACT_STORY';
  const published = formData.get('published') === 'true';
  const featured = formData.get('featured') === 'true';

  if (!title || !content) {
    throw new Error("Title and body are required");
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Post not found");
  }

  // Enforce featured gate
  if (featured && !hasFeature(org, "BLOG_FEATURED_PLACEMENT")) {
    throw new Error("Featured placement is a premium PRO feature. Please upgrade to set featured posts.");
  }

  let slug = existing.slug;
  if (existing.title !== title) {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    slug = baseSlug;
    let counter = 1;
    while (await prisma.post.findFirst({ where: { slug, id: { not: id } } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  const publishedAt = published
    ? (existing.publishedAt || new Date())
    : null;

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      body: content,
      type,
      featured,
      publishedAt,
    }
  });

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  revalidatePath('/impact');
}

export async function deletePost(id: string) {
  await checkAdmin('CONTENT_EDITOR');
  await prisma.post.delete({ where: { id } });

  revalidatePath('/blog');
  revalidatePath('/admin/blog');
  revalidatePath('/impact');
}
