# Sentinel's Journal

## 2025-05-15 - [CRITICAL] Robust Admin Email Comparison
**Vulnerability:** Accidental administrative access via `undefined === undefined` comparison.
**Learning:** When removing hardcoded fallbacks for environment variables (like `ADMIN_EMAIL`), simply changing `process.env.VAR || 'fallback'` to `process.env.VAR` can lead to a vulnerability if the variable is missing. In JavaScript, `undefined === undefined` is true, so if a user object has an undefined email and the admin variable is also undefined, the user might be granted admin rights.
**Prevention:** Always ensure the environment variable is truthy before using it in a comparison for authorization: `(adminEmail && user.email === adminEmail)`.
