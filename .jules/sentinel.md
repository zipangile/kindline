## 2025-05-15 - Hardcoded Admin Fallback & Webhook Timing Attacks
**Vulnerability:** Found a hardcoded email address (`sobhuxa@gmail.com`) used as a super-admin fallback in authentication logic and dashboard redirection. Also identified Lenco webhooks using standard string comparison for signature verification, vulnerable to timing attacks.
**Learning:** Hardcoded fallbacks are often left in during development for convenience but create significant security gaps if they persist in production. String comparisons for HMACs can leak information about the correct signature through execution time differences.
**Prevention:** Always use environment variables for administrative access controls. Ensure all cryptographic signature verifications use timing-safe comparison utilities like `crypto.timingSafeEqual`.

## 2025-05-15 - Information Leakage in Payment APIs
**Vulnerability:** The Lenco payment verification API was returning raw upstream error messages and the entire verification payload to the client, potentially exposing transaction details or system internals.
**Learning:** Detailed error messages from 3rd-party providers can reveal API structure, versioning, and internal state that attackers can exploit.
**Prevention:** Implement a boundary between internal/upstream data and client responses. Map upstream errors to generic, user-friendly messages and only return essential status fields to the frontend.
