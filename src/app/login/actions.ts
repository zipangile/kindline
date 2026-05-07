"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should use a validation library
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

import prisma from "@/lib/prisma";
import { sendNewVolunteerNotification } from "@/lib/email";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const isVolunteer = role === "volunteer";

  const signupData: {
    email: string;
    password: string;
    options: {
      data: {
        role?: string;
        name?: string;
        phone?: string;
        location?: string;
        availability?: string;
        skills?: string;
        experience?: string;
        interests?: string;
      };
    };
  } = {
    email,
    password,
    options: {
      data: {},
    },
  };

  if (isVolunteer) {
    signupData.options.data = {
      role: "volunteer",
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      location: formData.get("location") as string,
      availability: formData.get("availability") as string,
      skills: formData.get("skills") as string,
      experience: formData.get("experience") as string,
      interests: formData.get("interests") as string,
    };
  }

  const { data: authData, error } = await supabase.auth.signUp(signupData);

  if (error) {
    redirect(
      `/signup?error=${encodeURIComponent(error.message)}${role ? `&role=${role}` : ""}`,
    );
  }

  if (isVolunteer && authData.user) {
    try {
      const volunteer = await prisma.volunteer.create({
        data: {
          supabaseUserId: authData.user.id,
          name: signupData.options.data.name || "Anonymous",
          email: email,
          phone: signupData.options.data.phone,
          location: signupData.options.data.location,
          availability: signupData.options.data.availability,
          skills: signupData.options.data.skills,
          experience: signupData.options.data.experience,
          interests: signupData.options.data.interests || "",
        },
      });

      await sendNewVolunteerNotification({
        name: volunteer.name,
        email: volunteer.email,
        skills: volunteer.skills,
      });
    } catch (dbError) {
      console.error("Error creating volunteer record:", dbError);
      // We don't redirect here because the user is already created in Supabase
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
