# Security notes

The portfolio serves public resume-based portfolio content and has no login, database, upload, or contact-submission endpoint. Public users cannot supply glob patterns to the development tools.

Production controls include request-specific CSP script nonces, safe React text rendering, same-origin fonts, HTTPS-only social URL validation, restrictive response headers, and no shared caching of nonce-bearing HTML. See PROJECT_GUIDELINES.md for the OWASP Top 10:2025 mapping and future-feature requirements.

## Next.js security update — 23 October 2026

Next.js and its matching ESLint configuration are upgraded to 16.4.2, with the resolved versions recorded in `package-lock.json`. The reported image-optimization RCE ([GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw)), Server Actions denial of service ([GHSA-p3m5-59mp-jv5r](https://github.com/advisories/GHSA-p3m5-59mp-jv5r)), and typed-array cache RCE ([GHSA-673q-mjm6-r5xr](https://github.com/advisories/GHSA-673q-mjm6-r5xr)) affect Next.js through 16.4.0 and list 16.4.1 as patched. Deployments must rebuild from the updated lockfile to receive the fix.

## Development dependency advisory

As of 14 October 2026, `eslint-config-next` depends on `@next/eslint-plugin-next`, which uses `fast-glob` → `micromatch` → `braces`. The [braces advisory GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) reports stack exhaustion from deeply nested brace patterns and lists no patched version.

This dependency is used by lint tooling, not the portfolio request handler. The current lint command and configuration supply repository-controlled patterns; no visitor input reaches them. Keep CI configuration changes reviewed, do not expose linting as a public service, and do not run untrusted repository code with credentials. This assessment limits this project's exposure; it does not mean the dependency itself is fixed.

The full dependency audit remains visible in CI as a non-blocking report while this upstream issue has no fix. The production dependency audit is blocking. Review the full report for new advisories on every dependency update; this exception must not be used to dismiss unrelated findings. Remove this exception after the upstream dependency is patched or safely replaced. Do not downgrade Next.js tooling or force an incompatible dependency just to obtain a clean report.

## Production responsibilities

Before public deployment, review profile content and the public origin; configure TLS, host access, monitoring/alerts, and rollback. Verify actual security headers after the reverse proxy/CDN. No production monitoring service or hosting account is configured by this repository.
