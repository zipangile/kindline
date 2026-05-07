"use server";

import prisma from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function submitContactForm(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!email || !message) {
    return { success: false, error: "Email and message are required." };
  }

  const fullName = `${firstName} ${lastName}`.trim() || "Anonymous";

  try {
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: fullName,
        email,
        message,
      },
    });

    await sendContactNotification({
      name: contactMessage.name,
      email: contactMessage.email,
      message: contactMessage.message,
    });

    revalidatePath("/admin/inbox");
    return { success: true };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      error: "Failed to send message. Please try again later.",
    };
  }
}
