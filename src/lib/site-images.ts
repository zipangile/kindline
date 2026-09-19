export const SITE_IMAGE_SLOTS = [
  { key: 'logo', label: 'Foundation Logo', fallback: '/logo.png' },
  { key: 'homepage_hero', label: 'Homepage Hero Image', fallback: '/images/child-development.jpg' },
  { key: 'about_snapshot', label: 'Who We Serve — Home and About', fallback: '/images/volunteers.jpg' },
  { key: 'donation_hero', label: 'Donation Page Hero', fallback: '' },
  { key: 'child_development', label: 'Child Development Section', fallback: '' },
  { key: 'wesap_group', label: 'WESAP Group Photo', fallback: '' },
  { key: 'volunteers_action', label: 'Volunteers in Action', fallback: '' },
  { key: 'volunteer_action', label: 'Volunteer Page Feature Image', fallback: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80' },
] as const;

export type SiteImageRecord = { key: string; url: string; alt: string | null };
export const PARTNER_KEY = /^partner_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function isSiteImageKey(key: string): boolean {
  return SITE_IMAGE_SLOTS.some(slot => slot.key === key) || PARTNER_KEY.test(key);
}

/** An existing empty URL is an explicit removal; a failed read must not resurrect defaults. */
export function resolveSiteImage(images: SiteImageRecord[] | null, key: string): string {
  if (images === null) return '';
  const saved = images.find(image => image.key === key);
  return saved ? saved.url : SITE_IMAGE_SLOTS.find(slot => slot.key === key)?.fallback ?? '';
}

export function partnerLogos(images: SiteImageRecord[]): SiteImageRecord[] {
  return images.filter(image => PARTNER_KEY.test(image.key) && image.url && image.alt?.trim()).sort((a, b) => a.key.localeCompare(b.key));
}
