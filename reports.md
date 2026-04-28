# System Audit Report

This document outlines the findings from a comprehensive system audit. The issues identified span across type safety (TypeScript), code quality (ESLint), and general maintenance. 

## 1. Type Safety Issues (TypeScript)

The `npx tsc --noEmit` check returned several type errors, categorized as follows:

### 1.1. Prisma Schema and Client Desync
The Prisma schema (`prisma/schema.prisma`) contains fields that are not recognized by the generated Prisma client types. This causes numerous `Property does not exist` and `Object literal may only specify known properties` errors.
- **Missing properties reported**: `flutterwavePlanZMW`, `flutterwavePlanUSD`, `location`, `availability`, `experience`, `supabaseUserId`.
- **Affected files**: 
  - `src/app/admin/settings/actions.ts`
  - `src/app/admin/settings/page.tsx`
  - `src/app/admin/volunteers/page.tsx`
  - `src/app/api/payments/lenco/route.ts`
  - `src/app/api/payments/route.ts`
  - `src/app/dashboard/friend/page.tsx`
  - `src/app/dashboard/page.tsx`
  - `src/app/dashboard/volunteer/page.tsx`
  - `src/app/get-involved/page.tsx`
  - `src/app/login/actions.ts`
  - `src/app/volunteer/actions.ts`
- **Recommended Fix**: Run `npx prisma generate` to sync the generated TypeScript client with the `schema.prisma`.

### 1.2. Unresolved Modules & Dependencies
TypeScript cannot find module declarations for some external dependencies and internal files.
- **External Dependencies**: `@supabase/ssr` and `@supabase/supabase-js` are reported as not found.
  - **Affected files**: `src/app/volunteer/VolunteerForm.tsx`, `src/components/Header.tsx`, `src/utils/supabase/client.ts`, `src/utils/supabase/middleware.ts`, `src/utils/supabase/server.ts`.
  - **Recommended Fix**: Ensure dependencies are installed by running `npm install`. Check `tsconfig.json` module resolution settings if the issue persists.
- **Internal Paths**: Cannot find modules `../../../src/app/admin/programs/page.js` and `../../../src/app/programs/page.js` (reported in `.next/dev/types/validator.ts`).
  - **Recommended Fix**: Check for hardcoded `.js` extensions in imports or Next.js route configurations, and remove them or update them to `.tsx` references.

### 1.3. Implicit `any` Types
Several functions are missing explicit type definitions for their parameters, violating strict TypeScript checks (`TS7006` and `TS7031`).
- **Affected files**:
  - `src/components/Header.tsx`: `_event` and `session` parameters.
  - `src/utils/supabase/middleware.ts`: `cookiesToSet`, `name`, `value`, `options` parameters.
  - `src/utils/supabase/server.ts`: `cookiesToSet`, `name`, `value`, `options` parameters.
- **Recommended Fix**: Add explicit types to these parameters (e.g., using `@supabase/supabase-js` and `next/headers` types).

## 2. Code Quality & Linting Warnings (ESLint)

Running `npm run lint` highlighted several warnings:

### 2.1. Unoptimized Images
The standard HTML `<img>` tag is being used instead of the optimized Next.js `<Image />` component. This can result in slower Largest Contentful Paint (LCP) and higher bandwidth usage.
- **Affected files**:
  - `src/app/programmes/page.tsx` (line 155)
  - `src/app/volunteer/page.tsx` (line 48)
  - `src/components/Footer.tsx` (line 10)
  - `src/components/Header.tsx` (line 47)
- **Recommended Fix**: Replace `<img>` tags with `<Image />` from `next/image`.

### 2.2. Unused Variables and Imports
Variables and imports are declared but never used.
- **Affected files**:
  - `src/app/about/page.tsx`: `ChevronDown` is imported/defined but never used.
  - `src/utils/supabase/middleware.ts`: `options` is defined but never used.
- **Recommended Fix**: Remove the unused variables and imports to clean up the code.

## 3. Leftover Debugging Code

### 3.1. Console Logs
There are several `console.log` statements left in the production codebase that should be removed or replaced with proper server-side logging or user notifications.
- **Affected file**: `src/components/DonationForm.tsx`
  - line 64: `console.log("Lenco payment success", response);`
  - line 87: `console.log("Lenco window closed");`
  - line 127: `console.log("Payment completed!", data);`
  - line 150: `console.log("Payment closed");`
- **Recommended Fix**: Remove these `console.log` statements.

## 4. Development Environment Notes
- **PowerShell Execution Policies**: The local Windows environment has script execution disabled, which prevents scripts like `npm.ps1` and `npx.ps1` from running directly in PowerShell. Consider running `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` (if permitted) or configuring the default shell to circumvent this limitation for a smoother developer experience.
