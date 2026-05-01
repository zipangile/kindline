## 2025-05-15 - Timing-Safe Webhook Verification
**Vulnerability:** Timing attack vulnerability in webhook signature verification.
**Learning:** Using `!==` for signature comparison allows attackers to determine the signature character by character based on response time.
**Prevention:** Always use `crypto.timingSafeEqual` for comparing cryptographic signatures. Ensure buffers are same length before comparison to avoid runtime errors.

## 2025-05-15 - Accidental Admin Authorization
**Vulnerability:** Potential for unintended admin access if `ADMIN_EMAIL` environment variable is missing.
**Learning:** Comparison like `user.email === process.env.ADMIN_EMAIL` evaluates to `true` if both are undefined/null.
**Prevention:** Always verify that the configuration variable is truthy before comparing: `!!adminEmail && user.email === adminEmail`.
