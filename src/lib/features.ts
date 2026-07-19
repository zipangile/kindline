import prisma from './prisma';

export const FEATURES = {
  RECURRING_DONATIONS: ["PRO"],
  VOLUNTEER_MATCHING: ["PRO"],
  EMAIL_NOTIFICATIONS: ["GROWTH", "PRO"],
  BLOG: ["GROWTH", "PRO"],
  BLOG_FEATURED_PLACEMENT: ["PRO"],
  NEWSLETTER: ["GROWTH", "PRO"],
  DONOR_DASHBOARD: ["PRO"],
  VOLUNTEER_DASHBOARD: ["GROWTH", "PRO"],
  REPORTING_BASIC: ["GROWTH", "PRO"],
  REPORTING_FULL: ["PRO"],
  CUSTOM_DOMAIN: ["GROWTH", "PRO"],
} as const;

export type FeatureKey = keyof typeof FEATURES;

export const TIER_DEFAULTS: Record<string, { donationFeePercent: number; volunteerCap: number | null; newsletterSubCap: number | null; seatLimit: number | null }> = {
  STARTER: { donationFeePercent: 2.0, volunteerCap: 15, newsletterSubCap: 0, seatLimit: 1 },
  GROWTH:  { donationFeePercent: 1.5, volunteerCap: 50, newsletterSubCap: 500, seatLimit: 3 },
  PRO:     { donationFeePercent: 1.0, volunteerCap: null, newsletterSubCap: null, seatLimit: null },
};

export function hasFeature(
  org: { tier: string; featureOverrides?: unknown },
  key: FeatureKey,
  isSuperadmin = false
): boolean {
  if (isSuperadmin) return true;
  if (org.featureOverrides) {
    let overrides = org.featureOverrides as Record<string, unknown> | string | null;
    if (typeof overrides === 'string') {
      try {
        overrides = JSON.parse(overrides) as Record<string, unknown>;
      } catch {
        overrides = null;
      }
    }
    if (overrides && typeof overrides === 'object' && key in overrides) {
      return !!overrides[key];
    }
  }
  const allowedTiers = FEATURES[key];
  return (allowedTiers as readonly string[]).includes(org.tier);
}

export async function getOrganization() {
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
  return org;
}
