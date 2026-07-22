# ft8af.app

Marketing/help site for **FT8AF** — FT8/FT4/FT2 for Android.

The site is generated from templates + per-language message catalogs into static HTML
under `public/`, localized into 16 languages. English builds to the site root (so existing
URLs are unchanged); every other locale builds under `/<locale>/`.

## Develop

```sh
node build.mjs          # generate public/ (all locales) + sitemap.xml
python dev-server.py 8000   # serve public/ at http://127.0.0.1:8000 (clean URLs)
```

Open `/` for English, `/es`, `/ja`, `/ar` (right-to-left), etc. Re-run `node build.mjs`
after editing any template or catalog.

## Where things live

```
src/
  pages/*.mjs        # one template per route; structure/markup only
  pages/_registry.mjs# build/sitemap order
  partials/…         # (nav, footer, head, language switcher live in build.mjs)
  i18n/<locale>.json # translatable copy — en.json is the source of truth
  data/site.mjs      # locale registry (native names, og-locale, dir, font flag)
build.mjs            # the generator
api/report.js        # Vercel function backing the /report feedback form
api/_report-lib.js   # pure validation/email-building logic (unit-tested)
test/                # `node --test` suites (no framework, no deps)
public/assets/       # committed static assets (CSS, JS, fonts, screenshots)
public/**/*.html     # GENERATED — git-ignored, do not edit by hand
```

## Feedback form

`/report` (`src/pages/report.mjs`) is a web form for reporting a bug or requesting
a feature — an alternative to opening a GitHub issue. It posts a multipart
submission (with optional screenshots) to the `POST /api/report` Vercel function,
which validates it and sends **one email per submission** to `k1af@ft8af.app`.

Email delivery uses [Resend](https://resend.com); configure it with Vercel
environment variables:

- `RESEND_API_KEY` — **required** to send. Without it the endpoint returns a clear
  "not configured" response and the form shows its GitHub / email fallbacks.
- `REPORT_TO` — optional, defaults to `k1af@ft8af.app`.
- `REPORT_FROM` — optional, defaults to `FT8AF Feedback <feedback@ft8af.app>` (must
  be a verified Resend sender domain).

Run the backend tests with `npm test` (`node --test`).

## Editing copy

- Edit English in `src/i18n/en.json`, then mirror the change into the other catalogs.
- Any key missing from a locale catalog **falls back to English**, so a partial
  translation still renders a complete page.
- Check coverage with `npm run check:i18n` (also runs in CI). It compares every
  catalog to `en.json` and **fails on structural drift** — keys a locale has that
  `en.json` doesn't, or string-vs-object shape mismatches — while only *warning* about
  missing/verbatim strings (those fall back to English). Add `--strict` (or
  `--min <pct>`) to also gate on translation coverage.
- Values may contain inline HTML (`<a>`, `<strong>`, `<code>`); they are emitted raw, so
  keep them valid HTML fragments.
- Internal links are written English-style (`/features`) in templates and rewritten to the
  active locale (`/es/features`) at build time — don't hard-code locale prefixes.

### Do not translate

Brand `FT8AF`; callsigns (K1AF, N0RC, BG7YOZ, N0BOY); mode names FT8/FT4/FT2; ham jargon
(POTA, DXCC, QSO, CAT, SWR, ALC, PSKReporter, QRZ, Cloudlog, Wavelog, "73"); prices; the
app screenshots and the inline UI mockups; shell commands and the GitHub issue template.

## Language routing

`middleware.js` is Vercel Routing Middleware that runs **only on `/`**, before the
cache:

1. If the visitor has a `locale` cookie (set client-side in `public/assets/ft8af.js`
   whenever they view a page or use the picker), it's honored.
2. Otherwise their `Accept-Language` is matched to the closest built locale.
3. English is served in place at `/`; a non-English match gets a `307` to `/<locale>`.

Deep links (`/features`, `/es`, …) are never redirected. The redirect is per-visitor
(`Cache-Control: no-store`, `Vary: Accept-Language, Cookie`), so the static `/` and
`/<locale>` pages stay fully cacheable. The picker always wins — choosing English at
`/` sets `locale=en` and stops the redirect — so there's an escape hatch from any
auto-detected language. The middleware derives its locale list from
`src/data/site.mjs`, so there's nothing to keep in sync.

## Deploy

Vercel runs `node build.mjs` (`buildCommand` in `vercel.json`) and serves `public/`.
The Vercel project's **Root Directory** is the repo root (not `public/`) so the build
command runs at the root. `middleware.js` deploys automatically.
CI (`.github/workflows/ci.yml`) builds first, then validates JSON, links and HTML5.
