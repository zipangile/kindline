"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function registerVolunteer(formData: FormData) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be signed in to volunteer");
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const skills = formData.get("skills") as string;
    const interests = formData.get("interests") as string;
    const availability = formData.get("availability") as string;
    const experience = formData.get("experience") as string;
    const location = formData.get("location") as string;

    await prisma.volunteer.create({
      data: {
        supabaseUserId: user.id,
        name,
        email,
        phone,
        skills,
        interests,
        availability,
        experience,
        location,
      },
    });

    revalidatePath("/admin/volunteers");
    revalidatePath("/dashboard/volunteer");
    redirect("/dashboard/volunteer");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error in registerVolunteer:", error);
    throw error;
  }
}
