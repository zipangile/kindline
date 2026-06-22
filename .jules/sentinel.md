## 2025-05-15 - Hardcoded Secrets and Fallback Emails
**Vulnerability:** Hardcoded Supabase keys, DB password, and Admin Email were present in `scripts/setup-fly.sh`. A hardcoded admin email fallback (`sobhuxa@gmail.com`) was used in authentication and dashboard logic.
**Learning:** Deployment scripts are common locations for secret leakage. Hardcoded fallbacks for sensitive roles (like admin) create a fixed target for attackers and bypass environment-based configuration.
**Prevention:** Use environment variables exclusively for secrets. Ensure scripts only contain generic placeholders (e.g., `YOUR_SECRET_HERE`).

## 2025-05-15 - Timing Attack on Webhook Signature
**Vulnerability:** Lenco webhook signature verification used standard string equality (`!==`), which is vulnerable to timing attacks.
**Learning:** Cryptographic comparisons must be timing-safe to prevent side-channel information leakage. `crypto.timingSafeEqual` throws an error if input lengths differ, which must be handled to prevent DoS or side-channel leakage through error responses.
**Prevention:** Always use `crypto.timingSafeEqual` for signature verification and wrap it in a `try...catch` to handle length mismatches safely.

## 2025-05-15 - Information Leakage in API Responses
**Vulnerability:** Payment verification API was returning raw `verificationData` from the gateway and internal error `details` (including stack traces/messages) in 400 and 500 responses.
**Learning:** Verbose error messages and raw gateway responses can leak architectural details or sensitive transaction metadata to clients.
**Prevention:** Return generic error messages to the client and log detailed information server-side only.

## 2025-05-15 - Missing Input Validation and Length Limits in Server Actions
**Vulnerability:** Multiple server actions (newsletter subscription, contact form, volunteer registration) lacked input validation and length limits, making the system vulnerable to malformed data, potential DoS through large payloads, and lack of data integrity.
**Learning:** Server actions in Next.js are public endpoints and must be treated with the same security rigor as traditional API routes. Relying on frontend validation is insufficient.
**Prevention:** Always implement server-side validation (regex, length checks) for all user-provided data in server actions before database operations.

## 2025-05-15 - Centralized Security Utilities for Server Actions
**Vulnerability:** Scattered and inconsistent input validation and sanitization across various server actions (News, Impact, Inbox, etc.) leading to potential XSS and data integrity issues.
**Learning:** Centralizing security logic ensures consistency and reduces the risk of overlooking validation in new features. Server actions must be hardened against both malicious input (XSS) and resource exhaustion (long strings).
**Prevention:** Use a centralized utility like `src/lib/security.ts` for common validation (email) and sanitization (script removal). Enforce strict length limits on all user-provided fields in server actions.

## 2025-05-15 - Unverified Email Admin Access
**Vulnerability:** Administrative authorization checks (`checkAdmin`, `getUserRole`) relied on email matching or metadata roles without verifying if the user's email was confirmed.
**Learning:** In Supabase (and many other providers), a user can sign up with any email. If authorization only checks the email string or metadata that might be pre-set, unverified users could potentially access restricted areas if they sign up with a known admin email.
**Prevention:** Always verify `user.email_confirmed_at` in authorization middleware or utility functions before granting elevated privileges.

## 2025-05-15 - Information Leakage and Account Enumeration in Auth Redirects
**Vulnerability:** Server actions for login and signup were redirecting back to the UI with raw Supabase error messages in query parameters.
**Learning:** Specific error messages like "User not found" or "Invalid password" allow attackers to enumerate valid email addresses. Technical details in errors can also leak internal architecture or configuration.
**Prevention:** Always use generic error messages (e.g., "Invalid login credentials") for authentication failures and ensure they are sanitized before being passed to redirect URLs.
