"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/auth-utils";

export async function createImpactStat(formData: FormData) {
  await checkAdmin("CONTENT_EDITOR");
  const label = formData.get("label") as string;
  const value = formData.get("value") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const order = parseInt((formData.get("order") as string) || "0");

  await prisma.impactStat.create({
    data: { label, value, description, icon, order },
  });

  revalidatePath("/admin/impact");
  revalidatePath("/");
  revalidatePath("/impact");
}

export async function updateImpactStat(id: string, formData: FormData) {
  await checkAdmin("CONTENT_EDITOR");
  const label = formData.get("label") as string;
  const value = formData.get("value") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const order = parseInt((formData.get("order") as string) || "0");

  await prisma.impactStat.update({
    where: { id },
    data: { label, value, description, icon, order },
  });

  revalidatePath("/admin/impact");
  revalidatePath("/");
  revalidatePath("/impact");
}

export async function deleteImpactStat(id: string) {
  await checkAdmin("CONTENT_EDITOR");
  await prisma.impactStat.delete({
    where: { id },
  });

  revalidatePath("/admin/impact");
  revalidatePath("/");
  revalidatePath("/impact");
}

export async function createImpactStory(formData: FormData) {
  await checkAdmin("CONTENT_EDITOR");
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const author = formData.get("author") as string;
  const authorRole = formData.get("authorRole") as string;
  const image = formData.get("image") as string;

  await prisma.impactStory.create({
    data: { title, content, category, author, authorRole, image },
  });

  revalidatePath("/admin/impact");
  revalidatePath("/");
  revalidatePath("/impact");
}

export async function deleteImpactStory(id: string) {
  await checkAdmin("CONTENT_EDITOR");
  await prisma.impactStory.delete({
    where: { id },
  });

  revalidatePath("/admin/impact");
  revalidatePath("/");
  revalidatePath("/impact");
}
