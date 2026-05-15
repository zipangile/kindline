export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitizeContent(content: string): string {
  if (!content) return '';
  return content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
}
