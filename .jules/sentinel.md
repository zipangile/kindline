## 2025-05-15 - Hardcoded Admin Backdoors
**Vulnerability:** Found hardcoded admin email address (`sobhuxa@gmail.com`) used as a fallback for authorization in `src/lib/auth-utils.ts` and `src/app/dashboard/page.tsx`.
**Learning:** Hardcoded fallbacks in auth logic can persist unnoticed even when environment-based auth is implemented, creating a permanent bypass if the developer's email is known.
**Prevention:** Always use exclusive environment variable checks or database-backed roles for administrative access. Explicitly check for variable existence to avoid `undefined === undefined` matches.

## 2025-05-15 - Webhook Timing Side-Channels
**Vulnerability:** Lenco webhook signature verification used standard string comparison (`!==`).
**Learning:** HMAC signatures verified with non-constant-time comparisons are vulnerable to timing attacks, allowing attackers to guess the signature byte-by-byte.
**Prevention:** Use `crypto.timingSafeEqual` with `Buffer` for all cryptographic signature and token comparisons.
