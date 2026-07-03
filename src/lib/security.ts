export const SECURITY_LIMITS = {
  EMAIL: 254,
  NAME: 200,
  TITLE: 200,
  SLUG: 200,
  CATEGORY: 100,
  STATUS: 50,
  SUBJECT: 200,
  MESSAGE: 5000,
  CONTENT_LONG: 20000,
  CONTENT_MEDIUM: 10000,
  CONTENT_SHORT: 1000,
  URL: 500,
  PHONE: 50,
  DESCRIPTION: 500,
  EXPERIENCE: 2000,
  LOCATION: 200,
  AVAILABILITY: 500,
  SKILLS: 1000,
  INTERESTS: 1000,
  LABEL: 100,
  VALUE: 100,
  ICON: 100,
  AUTHOR: 100,
  AUTHOR_ROLE: 100,
  EXCERPT: 500,
  CONFIG_FIELD: 500,
  ID: 100,
  SUPABASE_USER_ID: 100
};

export function isValidId(id: string): boolean {
  if (!id) return false;
  return /^[a-zA-Z0-9_.:\/-]+$/.test(id);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitizeContent(content: string): string {
  if (!content) return '';
  // Remove <script> tags, on* event handlers, and javascript: URIs
  return content
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
    .replace(/\bon\w+\s*=\s*(['"])[^'"]*\1/gim, "")
    .replace(/\bon\w+\s*=\s*[^\s>]+/gim, "")
    .replace(/href\s*=\s*(['"])javascript:[^'"]*\1/gim, 'href="#"')
    .replace(/href\s*=\s*javascript:[^\s>]+/gim, 'href="#"');
}
