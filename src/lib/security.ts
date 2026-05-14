/**
 * Sanitizes string content by removing <script> tags to prevent basic XSS.
 */
export function sanitizeContent(content: string): string {
  if (!content) return content;
  return content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
}

/**
 * Validates an email address using a standard regex.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
