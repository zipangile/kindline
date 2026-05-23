export const SECURITY_LIMITS = {
  EMAIL_MAX: 254,
  NAME_MAX: 200,
  SUBJECT_MAX: 200,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 100,
  MESSAGE_MAX: 5000,
  URL_MAX: 500,
};

export function isValidEmail(email: string): boolean {
  if (!email || email.length > SECURITY_LIMITS.EMAIL_MAX) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitizeContent(content: string): string {
  if (!content) return '';
  return content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
}
