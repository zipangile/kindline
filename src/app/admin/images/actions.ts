"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/auth-utils";

export async function updateSiteImage(key: string, url: string, alt?: string) {
  await checkAdmin("CONTENT_EDITOR");

  await prisma.siteImage.upsert({
    where: { key },
    update: { url, alt },
    create: { key, url, alt },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/images");
}

export async function uploadImage(formData: FormData) {
  await checkAdmin("CONTENT_EDITOR");
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const { createClient } = await import("@supabase/supabase-js");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase environment variables for storage upload.",
    );
  }

  // Use service role key to bypass RLS in this admin-only server action
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `site-images/${fileName}`;

  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file);

  if (error) {
    console.error("[uploadImage] Supabase storage error:", error);
    if (error.message === "Bucket not found") {
      throw new Error(
        'The Supabase storage bucket "images" was not found. Please ensure it is created in your Supabase project.',
      );
    }
    throw new Error(`Failed to upload image to Supabase: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(filePath);

  return publicUrl;
}
