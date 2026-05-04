## 2025-05-15 - [Auth Hardening & Webhook Protection]
**Vulnerability:** Hardcoded admin fallback email and timing-safe signature comparison missing in webhooks.
**Learning:** Hardcoded fallbacks in auth utilities can bypass environmental configuration, and standard string comparisons for cryptographic signatures are vulnerable to timing attacks.
**Prevention:** Always use environment variables for administrative access lists and `crypto.timingSafeEqual` for webhook verification. Enforce email confirmation for all elevated permissions.
