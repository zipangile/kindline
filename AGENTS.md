<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deployment and PR Policy
Every change made should be followed by a deployment in addition to a Pull Request (PR).

## Recent Dashboard Updates
- **Admin Dashboard:** Updated the Overview page (`src/app/admin/page.tsx`) to include functional links for "Add New Programme" and "View Transactions", improving navigation.
- **Friend (Donor) Dashboard:** Added a "Navigation & Resources" section to `src/app/dashboard/friend/page.tsx`, providing donors with easy access to Programmes and Impact pages.
- **Dashboard Redirection:** Modified `src/app/dashboard/page.tsx` to redirect newly signed-in users without a role to `/get-involved` instead of the home page, guiding them towards engagement.
- **Clerk Integration:** Verified and prepared configuration for live Clerk keys and custom endpoints (`NEXT_PUBLIC_CLERK_FAPI`, `CLERK_API_URL`, `CLERK_JWT_KEY`).
