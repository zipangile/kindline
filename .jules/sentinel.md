## 2025-05-15 - [Hardcoded Admin Fallback]
**Vulnerability:** Use of hardcoded email addresses as fallbacks for admin authorization in `src/lib/auth-utils.ts` and `src/app/dashboard/page.tsx`.
**Learning:** Hardcoded fallbacks provide a "backdoor" that bypasses environment variable configuration, which is especially dangerous if the fallback email is a common or personal one. In this codebase, the same fallback was used in multiple disparate files, increasing the maintenance burden and risk of oversight.
**Prevention:** Never use hardcoded strings as fallbacks for sensitive security checks. Always verify that the environment variable is both defined and truthy before performing equality comparisons to avoid `undefined === undefined` matches.
