# Kindline client updates — 19 September 2026

This release branch starts from production-compatible commit
`f108141fc4379ddebf084422e9f34ff7f57634eb`. It does not replace `main` or
introduce the later organization/tier architecture and database changes.

## Included changes

- Explicit website-photo removal without restoring a default or deleting stored objects.
- Partner-logo management using existing SiteImage fields.
- Immediate image-only save/removal for existing news posts, bounded raster decoding,
  safe immutable uploads, and explicit rejection of animated PNG uploads.
- Readable, branded communication/newsletter templates, safe formatting, BCC privacy
  and provider-error handling.
- Corrected public contact information and Chibombo District service-area wording.
- Small donation suggestions in five currencies and a clearly labelled custom amount;
  existing payment routes and monthly choices remain unchanged.
- Consistent light-only presentation in either OS colour preference, responsive forms,
  locally scrollable accessible tables, keyboard focus, readable disabled states and
  Contact form pending feedback.

## Verification and limits

The reviewed source passed 23 focused tests, ESLint, TypeScript and a production
Next.js build. Independent desktop/mobile and light/dark-OS checks covered the
public presentation, synthetic protected views and held Contact requests. These
are not claims of real mail delivery, payment processing, every live account role,
screen-reader certification or full email-client dark-mode compatibility.

The PostgreSQL schema, authentication contracts and payment API implementation
remain production-compatible. No database migration, reset, seeding or tier
initialization is part of this release. Deployments use an immutable image and
skip release commands; image builds do not connect to the production database.
The 6 MB Server Action body allowance accommodates multipart overhead while
application uploads retain a validated 5 MiB file limit.

Production content settings are separate from Git. The requested Who We Serve
photo removal is an explicit `about_snapshot` empty-URL setting; original objects
remain stored. Older application images can resurrect their default image, so
visual state must be checked after any rollback. Fly volume snapshots do not
establish backup coverage for the external PostgreSQL database.
