"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export async function createNewsPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  image?: string;
  published: boolean;
}) {
  await checkAdmin("CONTENT_EDITOR");

  await prisma.newsPost.create({
    data: {
      ...data,
      publishedAt: data.published ? new Date() : null,
    },
  });

  revalidatePath("/news");
  revalidatePath(`/news/${data.slug}`);
  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function updateNewsPost(
  id: string,
  data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    category: string;
    image?: string;
    published: boolean;
  },
) {
  await checkAdmin("CONTENT_EDITOR");

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
      publishedAt,
    },
  });

  revalidatePath("/news");
  revalidatePath(`/news/${data.slug}`);
  if (existing && existing.slug !== data.slug) {
    revalidatePath(`/news/${existing.slug}`);
  }
  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function deleteNewsPost(id: string) {
  await checkAdmin("CONTENT_EDITOR");

  const post = await prisma.newsPost.findUnique({ where: { id } });

  await prisma.newsPost.delete({
    where: { id },
  });

  revalidatePath("/news");
  if (post) {
    revalidatePath(`/news/${post.slug}`);
  }
  revalidatePath("/admin/news");
}
