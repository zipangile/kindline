"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/auth-utils";

export async function createProgram(formData: FormData) {
  await checkAdmin("CONTENT_EDITOR");
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const status = formData.get("status") as string;
  const image = formData.get("image") as string;

  await prisma.program.create({
    data: {
      title,
      description,
      category,
      status,
      image,
    },
  });

  revalidatePath("/admin/programmes");
  revalidatePath("/programmes");
}

export async function updateProgram(id: string, formData: FormData) {
  await checkAdmin("CONTENT_EDITOR");
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const status = formData.get("status") as string;
  const image = formData.get("image") as string;

  await prisma.program.update({
    where: { id },
    data: {
      title,
      description,
      category,
      status,
      image,
    },
  });

  revalidatePath("/admin/programmes");
  revalidatePath("/programmes");
}

export async function updateProgramStatus(id: string, status: string) {
  await checkAdmin("CONTENT_EDITOR");
  await prisma.program.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/programmes");
  revalidatePath("/programmes");
}

export async function deleteProgram(id: string) {
  await checkAdmin("CONTENT_EDITOR");
  await prisma.program.delete({
    where: { id },
  });

  revalidatePath("/admin/programmes");
  revalidatePath("/programmes");
}
