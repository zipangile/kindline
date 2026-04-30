# Sentinel's Security Journal

## 2025-05-15 - Enforcing Email Verification for Administrative Access
**Vulnerability:** The `checkAdmin` authorization utility only verified the user's role/email but did not check if the email was actually confirmed in Supabase Auth.
**Learning:** In projects using third-party auth providers like Supabase, role-based access control (RBAC) must explicitly verify the `email_confirmed_at` field to prevent unverified accounts from accessing sensitive administrative functions if they happen to match a hardcoded email or role criteria.
**Prevention:** Always include a check for email verification status in centralized authorization helpers like `checkAdmin`.

## 2025-05-15 - Information Leakage in Payment Verification
**Vulnerability:** API routes for payment verification (Lenco) were returning raw verification data and detailed error messages/stack traces in responses.
**Learning:** Development-focused logging sometimes leaks into production responses, providing attackers with insights into backend logic, gateway configurations, and transaction metadata.
**Prevention:** Catch blocks and verification failure branches in API routes must return generic error messages. Use server-side logging for debugging instead of client-facing responses.
