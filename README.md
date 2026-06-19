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
public/assets/       # committed static assets (CSS, JS, fonts, screenshots)
public/**/*.html     # GENERATED — git-ignored, do not edit by hand
```

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

## Deploy

Vercel runs `node build.mjs` (`buildCommand` in `vercel.json`) and serves `public/`.
CI (`.github/workflows/ci.yml`) builds first, then validates JSON, links and HTML5.
