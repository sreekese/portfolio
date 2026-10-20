# 3D studio validation

The banner now has a full-body Three.js scene. Unit checks cover bounded walking, stopped speech poses and reduced motion. Browser checks cover successful WebGL rendering, introduction play/stop, reduced motion and a forced WebGL-unavailable fallback. Speech is mocked in browser tests, so actual voice quality remains device-dependent. The modeled likeness is stylized rather than exact.

## Earlier validation records

# Speaking avatar and portrait clarity — 19 October 2026

- New anime-style hero illustration and AI-enhanced 1254 × 1254 About portrait added. Original images retained. About image no longer uses the 1.8× CSS enlargement that amplified blur.
- Resume-based introduction starts only on an explicit click or keyboard activation. Stop/replay, unsupported-service status, startup timeout and cleanup are implemented. The visible transcript is removed; a layered SVG character blinks and animates its mouth during speech, with reduced-motion support.
- ESLint, TypeScript, formatting and production build passed.
- 38 unit/component tests passed, including eight speech lifecycle tests. Existing published coverage percentages remain scoped to the original core modules; the new speech hook has dedicated behavior tests.
- 24 browser checks passed across desktop and mobile Chrome. Speech API mocked for deterministic start/stop and failure-path verification; audible output and voice quality were not captured or validated.
- About and banner screenshot crops inspected. No public deployment performed.
- Current assets, exact generation prompts and browser speech limitations are documented in `docs/PORTRAIT_ASSETS.md`.

---

# Portrait update validation — 19 October 2026

- Original photo copied non-destructively to `src/assets/sreekese-photo.jpg`, cropped with CSS in About; illustrated hero asset saved as `src/assets/sreekese-avatar.png`.
- ESLint, TypeScript, formatting and production build passed. Existing unit/component suite: 30 tests passed.
- All 22 production browser checks passed in desktop and mobile Chrome, including image loading, keyboard greeting, feedback timeout, reduced motion and manual animation pause.
- Browser tests now use an isolated production server on port 3100, avoiding accidental reuse of a development server and its different CSP.
- Screenshot capture now scrolls to the lazy-loaded About image before recording previews. Close-up artifacts are written alongside the full-page screenshots.
- Illustration generation details and exact prompt: `docs/PORTRAIT_ASSETS.md`. No public deployment performed.

---

# Resume update validation — 18 October 2026

The running portfolio now uses Sreekese P S's supplied resume. The 14 October results below are retained as historical baseline results, not current content requirements.

- ESLint, strict TypeScript, Prettier and the production build: passed.
- Unit/component tests: 30 passed. The fixture now contains three actual projects instead of six sample projects; two obsolete filter parameter cases were removed.
- Core-module coverage: 98.90% lines, 95.95% statements, 97.05% functions, 85.24% branches.
- Browser suite: 18 passed across desktop and mobile layouts using installed Google Chrome. This verifies metadata, qualifications, phone/email links, demo-link destinations, filters, dialog focus, theme, motion preferences and security headers.
- An intermittent mobile overflow was reproduced deterministically by rotating the portrait to 45 degrees. Clipping the decorative SVG container fixes it; the new regression check passes.
- Desktop screenshot inspected. Browser screenshots are generated under `test-results/`.
- To use installed Chrome: `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/google-chrome npm run test:e2e`. The default configuration still supports Playwright-managed Chromium when this variable is absent.
- Demo URL destinations were checked against the supplied resume, not visited or independently validated. No public deployment or fresh dependency audit was performed for this content update.
- Safari, Firefox, real touch devices, screen-reader audits and field performance remain unverified.

---

# Validation results

Verified locally on 14 October 2026, using Node.js 22.14.0, Next.js 16.4.0, Vitest 5.0.4, and Playwright Chromium.

| Check | Result |
| --- | --- |
| ESLint | Passed |
| TypeScript strict checking | Passed |
| Prettier formatting | Passed |
| Production build | Passed; dynamic home route, static metadata routes and Proxy |
| Unit/component suite | 32 tests passed across 3 files |
| Browser/integration suite | 14 checks passed across desktop Chromium and a mobile Chromium viewport |
| Production dependency audit | 0 known vulnerabilities reported |
| Full dependency audit | 5 high-severity dependency entries, all tracing to the single unpatched development-only braces advisory documented in SECURITY.md |

## Coverage

Coverage applies only to the five explicitly selected core modules in `vitest.config.mts`: portfolio helpers, security policy, Contact, Work and ProjectDialog.

| Metric | Result |
| --- | --- |
| Lines | 98.88% |
| Statements | 95.91% |
| Functions | 97.05% |
| Branches | 84.74% |

These percentages do not describe all source files. HTML details are available in `coverage/index.html` after `npm run test:coverage`.

## Browser evidence

The suite exercised production rendering, filtering, modal navigation and keyboard focus, theme persistence, no-JavaScript content, mobile overflow, reduced motion, manual animation pause, drag-versus-click behavior, and request-specific CSP headers/nonces. Desktop and mobile full-page screenshots were generated in `test-results/portfolio-capture-responsive-reference-preview-*/portfolio.png`; the initial desktop/mobile layouts were visually inspected. Playwright's report is in `playwright-report/index.html`.

An initial browser test exposed focus leaving the modal on Tab. Explicit first/last-button focus wrapping was added, with a unit regression test and passing desktop/mobile browser checks.

The mobile project uses Chromium with an iPhone-sized viewport. It does not run Safari or a real iOS device. The drag check uses browser mouse events; native touch dragging still needs device verification.

## Environment and remaining limits

- The restricted sandbox returned empty output from a detached TypeScript subprocess. The production build completed successfully with the approved execution permissions. No TypeScript/build checks were disabled.
- Browser binaries were installed under `/tmp/bio-playwright`. To rerun in this workspace, use `PLAYWRIGHT_BROWSERS_PATH=/tmp/bio-playwright npm run test:e2e` after building. On another machine, `npx playwright install chromium` uses the usual browser cache.
- The local test server was managed and stopped by Playwright. Nothing has been publicly deployed.
- CI configuration is supplied but has not run on GitHub. It blocks production audit findings and reports the full development audit separately because of the documented upstream advisory.
- Lighthouse, field Core Web Vitals, screen-reader verification, real touch-device checks, Firefox/Safari coverage, hosted TLS/HSTS, and production monitoring have not been verified. Performance values in PROJECT_GUIDELINES.md are targets, not measured achievements.
- Source profile details, social destinations, metrics and experience claims remain sample content. Confirm them and set `SITE_URL` before public release.
