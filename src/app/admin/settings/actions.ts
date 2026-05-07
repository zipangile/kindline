"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/lib/auth-utils";

export async function updatePaymentSettings(formData: FormData) {
  await checkAdmin("FINANCIAL_ADMIN");
  const flutterwaveSecret = formData.get("flutterwaveSecret") as string;
  const flutterwavePublic = formData.get("flutterwavePublic") as string;
  const flutterwaveEncrypt = formData.get("flutterwaveEncrypt") as string;
  const flutterwavePlanZMW = formData.get("flutterwavePlanZMW") as string;
  const flutterwavePlanUSD = formData.get("flutterwavePlanUSD") as string;
  const lencoSecret = formData.get("lencoSecret") as string;
  const lencoPublic = formData.get("lencoPublic") as string;
  const lencoSignatureKey = formData.get("lencoSignatureKey") as string;
  const lencoBaseUrl = formData.get("lencoBaseUrl") as string;
  const notificationEmail = formData.get("notificationEmail") as string;

  const settings = await prisma.paymentSettings.findFirst();

  if (settings) {
    await prisma.paymentSettings.update({
      where: { id: settings.id },
      data: {
        flutterwaveSecret,
        flutterwavePublic,
        flutterwaveEncrypt,
        flutterwavePlanZMW,
        flutterwavePlanUSD,
        lencoSecret,
        lencoPublic,
        lencoSignatureKey,
        lencoBaseUrl,
        notificationEmail,
      },
    });
  } else {
    await prisma.paymentSettings.create({
      data: {
        flutterwaveSecret,
        flutterwavePublic,
        flutterwaveEncrypt,
        flutterwavePlanZMW,
        flutterwavePlanUSD,
        lencoSecret,
        lencoPublic,
        lencoSignatureKey,
        lencoBaseUrl,
        notificationEmail,
      },
    });
  }

  revalidatePath("/admin/settings");
  revalidatePath("/get-involved");
  revalidatePath("/volunteer");
}
