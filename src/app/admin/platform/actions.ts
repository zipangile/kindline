'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireSuperadmin, getUserEmail } from '@/lib/auth-utils';

export async function updateOrganizationSettings(formData: FormData) {
  await requireSuperadmin();
  const actorEmail = await getUserEmail() || 'unknown@superadmin.com';

  const tier = formData.get('tier') as 'STARTER' | 'GROWTH' | 'PRO';
  const donationFeePercent = parseFloat(formData.get('donationFeePercent') as string || '2.0');
  const volunteerCapVal = formData.get('volunteerCap') as string;
  const volunteerCap = volunteerCapVal === 'null' || volunteerCapVal === '' ? null : parseInt(volunteerCapVal);
  const newsletterSubCapVal = formData.get('newsletterSubCap') as string;
  const newsletterSubCap = newsletterSubCapVal === 'null' || newsletterSubCapVal === '' ? null : parseInt(newsletterSubCapVal);
  const volunteerSignupFee = parseFloat(formData.get('volunteerSignupFee') as string || '0.0');

  // Collect features
  const featureOverrides: Record<string, boolean> = {};
  const featureKeys = [
    'RECURRING_DONATIONS', 'VOLUNTEER_MATCHING', 'EMAIL_NOTIFICATIONS',
    'BLOG', 'BLOG_FEATURED_PLACEMENT', 'NEWSLETTER', 'DONOR_DASHBOARD',
    'VOLUNTEER_DASHBOARD', 'REPORTING_BASIC', 'REPORTING_FULL', 'CUSTOM_DOMAIN'
  ];
  for (const key of featureKeys) {
    featureOverrides[key] = formData.get(`override_${key}`) === 'true';
  }

  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: "Kindline Care Foundation",
        tier: "STARTER",
        donationFeePercent: 2.0,
        volunteerCap: 15,
        newsletterSubCap: 0,
        volunteerSignupFee: 0.0,
      }
    });
  }

  const oldTier = org.tier;
  const oldFee = org.donationFeePercent.toString();
  const oldVolCap = org.volunteerCap?.toString() || 'null';
  const oldNewsCap = org.newsletterSubCap?.toString() || 'null';
  const oldSignupFee = org.volunteerSignupFee.toString();
  const oldOverrides = JSON.stringify(org.featureOverrides || {});

  // Update
  await prisma.organization.update({
    where: { id: org.id },
    data: {
      tier,
      donationFeePercent,
      volunteerCap,
      newsletterSubCap,
      volunteerSignupFee,
      featureOverrides: featureOverrides as unknown as object,
    }
  });

  // Log changes
  const logChange = async (field: string, oldVal: string, newVal: string) => {
    if (oldVal !== newVal) {
      await prisma.adminAuditLog.create({
        data: {
          actorId: actorEmail,
          orgId: org!.id,
          field,
          oldValue: oldVal,
          newValue: newVal,
        }
      });
    }
  };

  await logChange('tier', oldTier, tier);
  await logChange('donationFeePercent', oldFee, donationFeePercent.toString());
  await logChange('volunteerCap', oldVolCap, volunteerCap === null ? 'null' : volunteerCap.toString());
  await logChange('newsletterSubCap', oldNewsCap, newsletterSubCap === null ? 'null' : newsletterSubCap.toString());
  await logChange('volunteerSignupFee', oldSignupFee, volunteerSignupFee.toString());
  await logChange('featureOverrides', oldOverrides, JSON.stringify(featureOverrides));

  revalidatePath('/admin/platform');
  revalidatePath('/admin/settings');
  revalidatePath('/volunteer');
  revalidatePath('/get-involved');
}
