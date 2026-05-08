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
