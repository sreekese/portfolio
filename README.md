# Sreekese P S — React.js portfolio

Personal portfolio populated from `Sreekese_PS_React.pdf` on 18 October 2026. Includes professional experience, three self-driven React.js projects and their supplied live-demo links, technical capabilities, education, certifications, email, phone and social profiles.

Edit `src/data/portfolio.json` to maintain the profile. The original Nila Varma files are retained only as historical design references. No project metrics, project dates, availability claims or per-project technologies beyond React.js have been invented. The home street address is intentionally not displayed.

The project explorer filters by React.js and project categories; the About cards contain the full technical skill set. Live-demo destinations come from the resume and have not been independently verified.

## Start locally

Requires Node.js 22.14 or later compatible release.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Set `SITE_URL` to the real HTTPS origin for deployment.

## Verify

```bash
npm run check
npm run format:check
npx playwright install chromium
npm run test:e2e
npm audit
```

`check` runs ESLint, TypeScript, Vitest coverage and a production build. Browser tests require the production build and start/stop their own server. If browser binaries are installed in a custom directory, use the same `PLAYWRIGHT_BROWSERS_PATH` when installing and running them.

Coverage reports are written to `coverage/`; browser reports to `playwright-report/`. Core-module coverage is explicitly scoped in `vitest.config.mts`; it is not a claim of whole-app coverage.

To use an installed Chrome browser instead, set `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/google-chrome` when running `npm run test:e2e`.

## Production

```bash
npm run build
npm run start
```

Deploy to a host supporting the Next.js Node runtime. Request-specific CSP nonces require dynamic page rendering and private, non-shared HTML caching. Do not configure static export. Font and framework assets are served locally. No application secrets are required.

Read [PROJECT_GUIDELINES.md](./PROJECT_GUIDELINES.md) for source requirements, the OWASP Top 10:2025 mapping, architecture decisions, performance targets, coding standards, test cases and release checklist. Read [VALIDATION.md](./VALIDATION.md) for the checks performed in this workspace and remaining verification limits.

See [SECURITY.md](./SECURITY.md) for the known upstream development-tool advisory and its exposure assessment. Production dependencies are audited separately.

The original HTML and Markdown files remain as supplied.

## Personal portraits

The About section uses your original photograph with a circular crop. The hero uses a transparent illustrated likeness with pointer-following tilt, a brief greeting animation, and keyboard/touch support. Motion honors system preferences and the Pause animations control. Assets and the built-in image-generation prompt are documented in [PORTRAIT_ASSETS.md](./docs/PORTRAIT_ASSETS.md).

Browser tests start their own production server on port 3100 and no longer reuse a development server on port 3000.

## Spoken introduction

Click the banner avatar or **Play introduction** to hear the intro; click again or use **Stop audio** to stop. Edit `spokenIntro` in `src/data/portfolio.json` to change the script. Speech uses the visitor’s browser voice (not a cloned voice), and a status message explains when playback is unsupported. No introduction transcript is displayed. The banner lazy-loads a full-body Three.js character that stands beside a desk, chair and laptop, and speaks when clicked. Its modeled likeness is stylized, with approximate mouth movement. A text status supports devices without WebGL; no alternate avatar appears during loading. The speaking motion respects reduced-motion settings independently of audio. The About portrait now uses the enhanced headshot without CSS enlargement.
