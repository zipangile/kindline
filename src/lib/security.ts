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
  ICON: 100,
  VALUE: 50,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 100
};

export const SLUG_REGEX = /^[a-z0-9-]+$/;

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitizeContent(content: string): string {
  if (!content) return '';
  return content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
}
