/** Shape checks only, NOT signature/expiry/project authentication. Never repair or log supplied keys. */
export function isServerStorageCredential(value: string): boolean {
  if (!value || value.length > 8192 || /\s|["']/.test(value)) return false;
  // Modern Supabase server secret keys are opaque; public/publishable keys are not service credentials.
  if (/^sb_secret_[A-Za-z0-9_-]+$/.test(value)) return true;
  const parts = value.split('.');
  if (parts.length !== 3 || !parts.every(part => /^[A-Za-z0-9_-]+$/.test(part))) return false;
  try {
    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return header?.alg === 'HS256' && payload?.role === 'service_role';
  } catch { return false; }
}
