# Current content specification — Sreekese P S

Updated 18 October 2026 from the supplied `Sreekese_PS_React.pdf`. This section supersedes the original sample-content inventory below. The engineering, security, accessibility and testing standards still apply.

- Identity: Sreekese P S, Software Engineer, Thrissur, Kerala, India.
- Experience: seven years as stated in the resume; Fingent Global Solutions (May 2021–Present) and Techminds Mizago Technology (April 2019–May 2021). Do not imply seven years specifically in React.
- Projects: Netflix Clone, Offer Application and Youtube Clone, each a self-driven React.js project with the supplied external demo URL. Project dates, implementation details and outcome metrics are not supplied and must not be invented.
- Project filters: All (3), React.js (3), Movies (1), Offers (1), Video (1). Technical skills are listed separately in the About capabilities cards.
- Qualifications: all three education entries and four certifications from the resume.
- Contact: resume email, phone, GitHub and LinkedIn; show city/region only, not the residential street address.
- Remove sample notices, fictional employers, old identity metadata, unsupported availability and response-time promises from the running app.
- Live project links participate in dialog keyboard focus wrapping and open with noopener/noreferrer.

---

# Nila Varma portfolio — project requirements and engineering standards

Reviewed: 14 October 2026. Applies to the Next.js project in this folder.

This is the implementation specification and ongoing development guide. **MUST** means a release requirement; **SHOULD** means the default unless a documented tradeoff justifies another choice. Security controls reduce risk; this document does not certify OWASP compliance.

## 1. Source review and scope

| Source | What it supplies | How to use it |
| --- | --- | --- |
| `Nila Varma Folio.html` | Complete visual prototype, CSS, `CONFIG` content, six projects, seven skills, three services, four experience entries, and browser interactions | Primary design and behavior reference; migrate the behavior into React rather than embedding the HTML or its script |
| `Nila Varma Folio.md` | Navigation labels, section headings, selected-work CTA, toolbox instruction, initials, and contact response copy | Supporting content outline; it does not contain the dynamically generated profile or project details |

The HTML explicitly identifies its configuration as **sample content**. Preserve that distinction in the UI. Do not present supplied project results, availability, contact details, employers, or uptime as independently verified facts. The “six years” heading and dates beginning in 2019 may not agree with the current date; obtain owner-approved content before public release instead of silently inventing replacements.

The product is a responsive public portfolio for a full-stack developer and interface designer. Visitors should understand the person's skills, filter selected projects, read case-study facts, review experience, and make contact.

The baseline requires no accounts, database, CMS, payment service, uploads, analytics, or email delivery API. Project descriptions mentioning Postgres, WebGL, Python, or queues are portfolio content, not requirements to install those technologies in this application.

## 2. Functional requirements and acceptance criteria

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-01 | Identity and navigation | Nila Varma, NV initials, Work/About/Experience/Contact anchors, visible mobile navigation, and a skip link; anchor targets remain clear of the sticky header |
| FR-02 | Introduction | Availability, large responsive name, tagline, introduction, selected-work CTA, and contact CTA; primary text exists in server-rendered HTML |
| FR-03 | Toolbox | Seven skill buttons; pointer dragging and inertial release; click or keyboard activation filters projects; selecting the active toolbox skill resets to All; dragging does not accidentally select |
| FR-04 | Shared filtering | Toolbox and filter row share one state; selected controls expose `aria-pressed`; result count updates; All restores the original order; empty results offer recovery |
| FR-05 | Project grid | Six responsive cards with number, year, title, brief, tags, accessible open control, and deterministic SVG artwork |
| FR-06 | Case studies | A labelled native modal dialog shows project details and role/stack/result facts; previous/next and arrow keys wrap within the filtered subset; Escape, close button, and backdrop close; focus returns to the opener |
| FR-07 | About and services | Supplied statement, NV portrait motif, and Product engineering / Interface design / Design systems service descriptions and lists |
| FR-08 | Experience | Four chronological entries from the prototype with dates, role, organization, and description; sample status remains visible |
| FR-09 | Metrics and specialties | Four supplied metrics and a decorative specialties marquee; content remains readable without animation |
| FR-10 | Contact | Visible email, mailto link, copy button, honest success/failure status, supplied social profiles, footer credit, and two-day response copy |
| FR-11 | Theme | System preference by default, manual dark/light toggle, local preference persistence; storage failure must not break switching |
| FR-12 | Motion and responsive layout | Responsive grid, bounded skill chips, name reaction, scroll progress, reveal effects and timeline emphasis; system reduced-motion preferences disable decorative animation; no playback control is shown in the header |
| FR-13 | Metadata and resilience | Title, description, canonical/Open Graph metadata, icon, robots, sitemap, 404 and safe error UI; no external runtime font requests |

### Reference content inventory

| Project | Year | Filter tags | Artwork |
| --- | --- | --- | --- |
| Tidepool | 2026 | React, TypeScript, Node | Bars |
| Lantern | 2025 | React, TypeScript | Nodes |
| Cardamom | 2025 | Python, Postgres | Rings |
| Monsoon Atlas | 2024 | WebGL, TypeScript | Contours |
| Kiln | 2023 | Design systems, Node, TypeScript | Grid |
| Quiet Hours | 2022 | React, Node | Dial |

Expected counts: All 6; React 3; TypeScript 4; Node 3; Python 1; WebGL 1; Design systems 1; Postgres 1.

### Intentional implementation decisions

- Keep the supplied cool neutral palette, teal accent, rounded toolbox/cards, typographic hierarchy, and light/dark presentation. Fonts are installed locally through Fontsource.
- Render strings through JSX, with explicit markup for emphasis. Do not migrate the prototype's `innerHTML` templates.
- Use React state for filters and selected projects; refs for pointer motion and animation handles. Do not mutate React-owned content using document-wide HTML replacement.
- Display the metrics at their final values rather than counting from zero. Keep the About statement fully readable rather than progressively coloring low-contrast words.
- Keep the native cursor rather than a continuously animated cursor follower. Card interaction uses CSS hover instead of pointer-driven 3D tilt. These choices reduce continuous work and motion.
- Arrange toolbox chips in a wrapping layout before applying temporary drag transforms. Honor keyboard activation and reduced motion; resize resets positions.
- The implementation places metrics after selected work. The content and section anchors remain the same.
- All main copy and project summaries are readable without JavaScript. Filtering, dragging, copying, theme persistence, and modal details are enhancements that require JavaScript.

## 3. Architecture and project organization

Use the Next.js App Router, React, TypeScript strict mode, and a compatible supported Node.js runtime. Install compatible patched versions, commit `package-lock.json`, use `npm ci` in automation, and review upgrades rather than assuming a major version guarantees security.

```text
src/
  app/
    layout.tsx             # Metadata, locally served fonts, page shell
    page.tsx               # Server-rendered portfolio composition
    globals.css            # Reference tokens, responsive styles, motion rules
    error.tsx              # Safe retry UI
    not-found.tsx          # 404 recovery
    robots.ts, sitemap.ts, icon.svg
  components/
    header.tsx             # Navigation, system/manual theme
    work.tsx               # Filter and selection state boundary
    toolbox.tsx            # Pointer/keyboard skill controls
    project-art.tsx        # Deterministic SVG, no raw HTML injection
    project-dialog.tsx     # Native modal and filtered navigation
    contact.tsx            # Copy/email feedback
    motion.tsx             # Optional progressive visual effects
  data/portfolio.json      # Supplied sample content
  hooks/use-media-query.ts # SSR-safe media preference subscription
  lib/
    portfolio.ts           # Pure filtering, bounds, identity, URL helpers
    security.ts            # CSP construction
    site.ts                # Public origin configuration
  proxy.ts                 # Per-request CSP nonce and security headers
 tests/
  setup.ts
  unit/                    # Vitest and Testing Library
  e2e/                     # Playwright against production build
```

### Server/client boundaries

- MUST keep the root layout and page as Server Components. Add `use client` only where state, effects, event handlers, or browser APIs are needed.
- The Work component owns one filter state and shares it with the toolbox and grid. Do not maintain separate states that can drift.
- Pass serializable portfolio data to Client Components. Server-rendered introduction content can pass through a children slot.
- MUST avoid `window`, localStorage, random render output, and viewport checks in server rendering. Use stable server snapshots for media queries.
- Browser subscriptions, observers, timers, and animation frames MUST clean up on unmount and behave correctly in React Strict Mode.
- Keep business helpers pure and easy to test. Use stable project identifiers as keys.
- If future server-only modules contain credentials, mark the boundary with `server-only` and never import them into client modules.

### Rendering and caching tradeoff

This implementation uses a fresh CSP nonce per document request. The page calls `connection()` to opt into request rendering so Next.js can apply that nonce to framework scripts. This intentionally gives up fully static HTML caching; the small portfolio data stays local and needs no request-time API fetch.

Do not deploy this build as `output: export` or cache nonce-bearing HTML at a shared CDN. Static assets retain framework-managed caching. If switching to static export, redesign CSP around compatible hashes/build output and verify the generated HTML; simply removing request rendering would break the nonce policy. See the [Next.js CSP guide](https://nextjs.org/docs/app/guides/content-security-policy).

## 4. OWASP Top 10 security requirements

Use the **2025 edition**, whose categories differ from 2021. The mapping below is project-specific engineering guidance, using the category names from the [official OWASP Top 10:2025](https://top10.owasp.org/2025/).

| Category | Controls for this project | Verification / future extension |
| --- | --- | --- |
| A01 Broken Access Control | No private records or privileged routes in the baseline. Repository and deployment access must remain restricted. | If admin/API features are added, authorize every server operation and object; test anonymous, wrong-role and cross-user requests. Frontend hiding and Proxy alone are not authorization. |
| A02 Security Misconfiguration | Request nonce CSP; no script `unsafe-inline` or production `unsafe-eval`; deny framing; nosniff; restricted permissions; no powered-by header. | Test actual production responses and nonce matching. Keep secrets out of public variables and artifacts. Verify HTTPS and HSTS on the selected host. |
| A03 Software Supply Chain Failures | Lockfile, reproducible installs, dependency auditing, minimal dependencies, reviewed updates, CI with read-only default permissions. | Audit development dependencies too; investigate advisory reachability and pin CI actions to reviewed commit SHAs before an organizational release. |
| A04 Cryptographic Failures | No credentials or sensitive personal records stored. Use HTTPS in production and host-managed TLS. | Keep future secrets in deployment secret storage, rotate them, and use established cryptographic libraries rather than custom crypto. |
| A05 Injection | JSX escaping, no raw HTML injection, no eval, safe HTTPS external URL validation, no SQL or shell execution from user input. | Test hostile markup and unsafe URL schemes. If adding forms/CMS data, validate at the server boundary and sanitize rich HTML with an allowlist. |
| A06 Insecure Design | Read-only public portfolio with a documented data flow; no unnecessary backend endpoints. Clipboard denial and missing browser features have usable fallbacks. | Threat-model new forms, uploads, webhooks and admin features before implementing them; define abuse limits and trust boundaries. |
| A07 Authentication Failures | No application authentication is required. Hosting/repository accounts should use MFA and least privilege. | If login is introduced, use a maintained identity provider, secure sessions and cookies, rate limiting, and server-side authorization. |
| A08 Software or Data Integrity Failures | Reviewed local content and lockfile, deterministic artwork, controlled build artifacts; no remote runtime scripts or executable CMS content. | Protect release branches, verify CI artifacts/provenance, and verify signatures for future incoming webhooks. |
| A09 Security Logging and Alerting Failures | No client logging of clipboard content or private browser state. Hosting must provide request/error visibility. | Production owner must configure alerts for error spikes, deployment failures and suspicious requests; redact credentials and define retention. Managed monitoring is not configured by this local project. |
| A10 Mishandling of Exceptional Conditions | Safe retry UI, 404 page, explicit clipboard failure, bounded motion, empty-result recovery, zero-result navigation guard and lifecycle cleanup. | Exercise failure paths. Future APIs require timeouts, bounded retries, validated request sizes, fail-closed authorization, and generic public errors with private diagnostic correlation. |

### Security policy details

- `script-src` uses a cryptographically generated request nonce and `strict-dynamic`. Production has no script `unsafe-eval` or `unsafe-inline`.
- `style-src` permits `unsafe-inline` to support pointer-driven transforms and React style attributes. This is an explicit narrower tradeoff; it does not allow inline scripts. A stricter style policy would require redesigning runtime styles.
- Fonts are same-origin. Artwork is generated as JSX SVG. No externally supplied SVG or HTML is injected.
- Use `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, and `form-action 'self'`.
- HSTS is emitted for HTTPS requests; production hosting must terminate TLS correctly and verify the effective request protocol. Do not enable preload or includeSubDomains without reviewing all affected subdomains.
- `SITE_URL` is a public origin for metadata; it is not a secret. Do not put secrets in `NEXT_PUBLIC_*` variables. Commit `.env.example`, never real environment files.
- The nonce header is overwritten by the application. Never trust a client-supplied nonce. Nonce-bearing HTML must not use shared caching.
- For future mutations: validate inputs on the server, authenticate and authorize, enforce CSRF/origin protections as applicable, impose request-size/rate limits, use parameterized queries, and prevent SSRF with a restricted outbound destination policy. None of these are replaced by client validation or a CSP.

## 5. Performance and optimization standards

The project follows the general Server Component, production-build and measurement workflow in the [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist). The following budgets are project targets, not measured results.

| Area | Project target / rule |
| --- | --- |
| LCP | At most 2.5 seconds at the 75th percentile of real visits |
| INP | At most 200 milliseconds at the 75th percentile |
| CLS | At most 0.1 at the 75th percentile |
| Lighthouse | Aim for at least 90 Performance and 95 Accessibility in an agreed mobile profile; automated scores do not replace manual checks |
| Client JavaScript | Track production bundle changes; investigate any unexplained increase over 10% from the first agreed baseline |
| Animation | Transform/opacity where practical; avoid permanent JS loops, stop inertial motion when settled, cancel work on unmount and respect reduced motion |
| Fonts | Serve selected Latin font assets locally, use font-display swap, include only needed styles; review layout shift and request count |
| Images | Current SVG art needs no raster request. For future photos use `next/image`, explicit dimensions and `sizes`; prioritize only the actual above-fold LCP image |

Additional rules:

1. Prefer local server-rendered content over fetching this fixed portfolio on every browser mount.
2. Keep Client Component boundaries focused; do not convert the entire app into a client component for one interactive element.
3. Introduce dynamic imports for genuinely heavy optional functionality only after measuring the bundle. Do not lazy-load essential hero copy.
4. Avoid expensive layout reads on each pointer event at larger scales. This small name effect is bounded; profile before extending it. Coalesce scroll updates with requestAnimationFrame.
5. Avoid loading animation, physics, charting, or state libraries when native browser features cover the requirement.
6. Use semantic content that remains available if enhancement code fails. Avoid hiding essential text until an observer fires.
7. Measure a production build, on mobile throttling and real devices. Record test environment and compare repeatable runs. Do not label local unit-test timing as a performance benchmark.
8. Add privacy-conscious real-user Web Vitals reporting only after choosing a destination, retention policy, and any necessary consent behavior.

## 6. Coding standards

- TypeScript `strict` MUST remain enabled; no unexplained `any`, non-null assertions or blanket lint/type suppression. Narrow unknown external inputs.
- Prefer named exports for reusable modules and default exports where Next.js requires them. Use PascalCase component names, camelCase helpers, and descriptive kebab-case files.
- Use readonly props/data when practical. Derive visible projects from source data; do not mutate configuration in components.
- Keep components responsible for one coherent interaction. Extract behavior when it has a separate lifecycle or is reusable, not merely to hit an arbitrary line count.
- Use semantic elements and actual buttons/anchors; provide accessible names. Avoid nested interactive elements and click-only divs.
- Prefer `unknown` plus validation for external content. Compile-time types do not validate network data.
- Do not store derived values in redundant state. Do not use effects for values that can be computed during render.
- Catch expected failures narrowly and expose useful user feedback. Avoid swallowing operational failures without diagnostics; logging must exclude secrets.
- Keep CSS tokens centralized, responsive breakpoints intentional, and keyboard focus visible. Avoid broad global overrides for component-local fixes.
- Format with Prettier and run ESLint directly. Do not assume `next build` runs lint or use the removed `next lint` command.
- Comments should explain decisions and constraints, not narrate obvious code. Document deviations and test limitations in the README.
- Before merging, review security, accessibility, dependency impact and actual behavior. A passing test suite does not establish complete security.

## 7. Accessibility requirements

Target WCAG 2.2 AA. Verify normal-text contrast, focus indicators, keyboard order, zoom and target sizes with real browser checks.

- One meaningful h1; consistent heading order and navigation landmarks; skip-to-content link.
- Project buttons and skill buttons work with keyboard activation; dragging always has a click/keyboard alternative.
- Use a real modal dialog with accessible title, focus containment, Escape, and focus restoration. A jsdom dialog stub cannot prove browser focus trapping.
- Announce filter counts and clipboard feedback through polite status regions; avoid repetitive announcements from decorative animation.
- Keep meaningful SVG labels. Mark decorative portrait/marquee content hidden from assistive technology.
- Honor reduced motion in both JavaScript and CSS. Keep a usable layout when browser storage or clipboard permissions are unavailable.
- Check desktop, small mobile, touch input, 200% zoom, dark/light modes and a screen reader. Automated accessibility checks cannot replace these checks.

## 8. Testing strategy and required cases

Use Vitest and React Testing Library for pure helpers and synchronous interactive components. Query visible roles/names, drive interactions with user-event, and assert outcomes. Avoid snapshots of large markup and tests that merely duplicate implementation. Use Playwright for browser semantics and the built Next.js app.

The [Next.js Vitest guide](https://nextjs.org/docs/app/guides/testing/vitest) notes that asynchronous Server Components need end-to-end coverage rather than direct Vitest rendering. Accordingly, this async page is exercised through the production server.

| ID | Cases | Layer |
| --- | --- | --- |
| UT-01 | All six projects, exact tag matches/counts/order, empty/unknown filters, no input mutation | Unit |
| UT-02 | Unique project IDs, known tags, required facts; whitespace-safe initials | Unit |
| UT-03 | Next/previous wraparound; one and zero project bounds | Unit |
| UT-04 | Clamp negative/overflow coordinates and containers smaller than a chip | Unit |
| UT-05 | Allow HTTPS URLs, reject JavaScript/data/http/credentials/invalid URLs | Unit |
| UT-06 | CSP nonce, prohibited script directives, production/development difference | Unit |
| CT-01 | Toolbox/filter row synchronize; toggle active skill back to All; keyboard activation | Component |
| CT-02 | Empty-state recovery and correct counts | Component |
| CT-03 | Open project; filtered previous/next; arrow keys; close; focus restoration; one-item controls | Component + browser |
| CT-04 | Click content stays open; backdrop/Escape closes; scroll lock released | Component + browser |
| CT-05 | Clipboard success, permission rejection, timed feedback cleanup, duplicate/in-flight request, unmount | Component |
| CT-06 | Malicious project text remains escaped text | Component |
| BR-01 | Production page renders and hydrates without page errors; navigation and no mobile overflow | Browser |
| BR-02 | Theme toggle persists after reload | Browser |
| BR-03 | Native Escape and opener focus restoration | Browser |
| BR-04 | Unique response nonces, nonce in HTML, nosniff and no-store headers | Integration |
| BR-05 | Content and email link available with JavaScript disabled | Browser |
| BR-06 | Reduced-motion preferences stop decorative animations | Browser |
| BR-07 | Dragging does not filter, clicks and keyboard do, dialog traps focus | Browser |

Coverage gates currently apply to the core behavioral modules listed in `vitest.config.mts`: filtering/helpers, CSP, Work, Contact and ProjectDialog. Minimums are 85% lines/statements/functions and 75% branches. This is **not whole-application coverage**; art, motion, theme and pointer layout also need browser verification. Add regression tests when changing these behaviors. Do not lower a gate just to pass a failing build.

Mocks should be limited to environment boundaries such as clipboard and jsdom dialog APIs. Never use a mocked dialog test as proof of native focus confinement. Browser projects include desktop Chromium and a mobile viewport; they do not establish Safari/Firefox compatibility.

## 9. Development, CI and release

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run test:coverage
npm run build
npx playwright install chromium
npm run test:e2e
npm run format:check
npm audit
```

Use Node 22.14 or a later compatible supported runtime. `npm run check` runs lint, type checking, unit coverage and the production build. `npm run test:e2e` starts the production server, so build first. Browser binaries are a separate installation. CI runs the gates and stores test reports on failure.

Release checklist:

- [ ] Confirm name, real email/social links, experience dates, availability, statistics and project claims; replace sample notices only after content approval.
- [ ] Set `SITE_URL` to the real HTTPS origin and verify canonical/sitemap output.
- [ ] Install from the lockfile and pass lint, TypeScript, formatting, unit coverage and production build.
- [ ] Run browser tests and manually verify keyboard, touch drag, screen reader, zoom and target browsers.
- [ ] Audit production and development dependencies and resolve applicable advisories.
- [ ] Verify effective CSP, unique nonce, TLS, HSTS and caching on the actual host.
- [ ] Measure and record production performance; fix regressions against agreed budgets.
- [ ] Configure host error monitoring, alerts, access policy, secret management and rollback.
- [ ] Deploy to a Node-compatible Next.js host; do not use static-only hosting with the current nonce architecture.
- [ ] Smoke-test deployed navigation, metadata, filters, dialog and contact actions. Retain a known-good deployment for rollback.

Local implementation and checks do not imply that hosting, production monitoring, real-user performance or a public deployment have been configured.
