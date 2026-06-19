#!/usr/bin/env node
// FT8AF static-site generator.
//
// Renders each page template once per locale into public/. English builds to the
// site root (preserving existing URLs); every other locale builds under /<locale>/.
// Page structure/markup lives in src/pages/*.mjs; all translatable copy lives in
// src/i18n/<locale>.json. Missing keys fall back to English, so a partial catalog
// still produces a complete page.
//
// No dependencies — run with `node build.mjs`.

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { LOCALES, SITE } from './src/data/site.mjs';
import { PAGES } from './src/pages/_registry.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'public');
const I18N = join(ROOT, 'src', 'i18n');

const LOCALE_CODES = LOCALES.map((l) => l.code);
const LOCALE_SET = new Set(LOCALE_CODES);

// ───────────────────────── catalogs ─────────────────────────

async function loadCatalogs() {
  const cats = {};
  for (const { code } of LOCALES) {
    try {
      cats[code] = JSON.parse(await readFile(join(I18N, `${code}.json`), 'utf8'));
    } catch {
      cats[code] = {}; // no catalog yet → falls back to English entirely
    }
  }
  return cats;
}

// Resolve a dotted key against an object.
function dig(obj, key) {
  return key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

// Build a translator for a locale: locale catalog first, English fallback, then
// the key itself (so a missing string is visible rather than blank).
function makeT(localeCat, enCat) {
  return (key) => {
    const v = dig(localeCat, key);
    if (v !== undefined && v !== null && v !== '') return v;
    const e = dig(enCat, key);
    if (e !== undefined) return e;
    return key;
  };
}

// ───────────────────────── URLs ─────────────────────────

// Root-relative path for a route in a locale. en home → "/", es home → "/es",
// en features → "/features", es features → "/es/features".
export function pagePath(route, locale) {
  const base = locale === 'en' ? '' : `/${locale}`;
  if (!route) return base || '/';
  return `${base}/${route}`;
}
export function pageUrl(route, locale) {
  return SITE + pagePath(route, locale);
}

// Rewrite English-style internal links (href="/features") to the current locale
// (href="/es/features"). Skips /assets (shared) and is a no-op for English.
// Run only over page chrome/body — never over the language switcher, whose links
// are already locale-final.
function localizeLinks(html, locale) {
  if (locale === 'en') return html;
  return html.replace(/href="\/(?!assets)([^"]*)"/g, (_m, rest) => {
    let tail = '';
    if (rest) tail = rest[0] === '#' ? rest : `/${rest}`;
    return `href="/${locale}${tail}"`;
  });
}

// ───────────────────────── partials ─────────────────────────

function navPartial(t, ctx) {
  const n = (route, key, active) =>
    `<a href="${route}"${active ? ' class="active"' : ''}>${t('common.nav.' + key)}</a>`;
  return `<nav class="nav">
  <div class="nav-inner">
    <a class="brand" href="/">
      <span class="mark"><img src="/assets/icon.svg" alt="" width="34" height="34" style="display:block" /></span>
      <span class="word">FT<b>8</b>AF</span>
    </a>
    <div class="nav-links">
      ${n('/', 'home', ctx.navActive === 'home')}
      ${n('/features', 'features', ctx.navActive === 'features')}
      ${n('/download', 'download', ctx.navActive === 'download')}
      ${n('/wiki', 'wiki', ctx.navActive === 'wiki')}
      ${n('/faq', 'faq', ctx.navActive === 'faq')}
      <a href="https://github.com/patrickrb/FT8AF" target="_blank" rel="noopener">${t('common.nav.github')}</a>
    </div>
    <div class="nav-cta">
      ${langSwitcher(t, ctx)}
      <a class="btn btn-ghost btn-sm" href="https://github.com/patrickrb/FT8AF" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.48A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>
        ${t('common.nav.star')}
      </a>
      <a class="btn btn-primary btn-sm" href="${ctx.getFreeHref || '/download'}">${t('common.nav.getFree')}</a>
    </div>
    <button class="nav-toggle" aria-label="${t('common.nav.menu')}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
    </button>
  </div>
  <div class="mobile-menu">
    <a href="/">${t('common.nav.home')}</a>
    <a href="/features">${t('common.nav.features')}</a>
    <a href="/download">${t('common.nav.download')}</a>
    <a href="/wiki">${t('common.nav.wiki')}</a>
    <a href="/faq">${t('common.nav.faq')}</a>
    <a href="https://github.com/patrickrb/FT8AF" target="_blank" rel="noopener">${t('common.nav.github')}</a>
  </div>
</nav>`;
}

// Language switcher: a no-JS <details> dropdown listing every locale, each linking
// to the SAME route in that locale. Links are locale-final (never re-localized).
function langSwitcher(t, ctx) {
  const current = LOCALES.find((l) => l.code === ctx.locale);
  const items = LOCALES.map((l) => {
    const sel = l.code === ctx.locale ? ' aria-current="true"' : '';
    return `<a href="${pagePath(ctx.route, l.code)}" lang="${l.code}"${l.dir === 'rtl' ? ' dir="rtl"' : ''}${sel}>${l.native}</a>`;
  }).join('\n      ');
  return `<details class="lang-switch">
    <summary aria-label="${t('common.langLabel')}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" width="17" height="17"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>
      <span class="lang-cur">${current ? current.short : ctx.locale}</span>
    </summary>
    <div class="lang-menu">
      ${items}
    </div>
  </details>`;
}

function footerPartial(t) {
  const fl = (href, key, ext) =>
    `<a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${t('common.footer.links.' + key)}</a>`;
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-col">
        <a class="brand" href="/" style="margin-bottom:16px">
          <span class="mark"><img src="/assets/icon.svg" alt="" width="34" height="34" style="display:block" /></span>
          <span class="word">FT<b>8</b>AF</span>
        </a>
        <p style="color:var(--text-muted);font-size:14px;max-width:34ch;margin:0">${t('common.footer.tagline')}</p>
      </div>
      <div class="footer-col">
        <h4>${t('common.footer.product')}</h4>
        <a href="/features">${t('common.nav.features')}</a>
        <a href="/download">${t('common.nav.download')}</a>
        <a href="/wiki">${t('common.nav.wiki')}</a>
        <a href="/faq">${t('common.nav.faq')}</a>
        ${fl('https://play.google.com/store/apps/details?id=radio.ks3ckc.ft8af', 'googlePlay', true)}
      </div>
      <div class="footer-col">
        <h4>${t('common.footer.project')}</h4>
        ${fl('https://github.com/patrickrb/FT8AF', 'repo', true)}
        ${fl('https://github.com/patrickrb/FT8AF/releases', 'releases', true)}
        ${fl('https://github.com/patrickrb/FT8AF/issues', 'reportBug', true)}
        ${fl('https://github.com/N0BOY/FT8CN', 'originalFt8cn', true)}
      </div>
      <div class="footer-col">
        <h4>${t('common.footer.operators')}</h4>
        <a href="https://www.qrz.com/db/K1AF" target="_blank" rel="noopener">${t('common.footer.links.k1af')}</a>
        <a href="https://www.qrz.com/db/N0RC" target="_blank" rel="noopener">${t('common.footer.links.n0rc')}</a>
      </div>
      <div class="footer-col">
        <h4>${t('common.footer.community')}</h4>
        <a href="https://discord.gg/tz4spm5nWB" target="_blank" rel="noopener">${t('common.footer.links.discord')}</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>${t('common.footer.bottom')}</span>
      <span style="color:var(--accent)">73</span>
    </div>
  </div>
</footer>`;
}

// <head> with localized meta, OG/Twitter, hreflang alternates and optional JSON-LD.
function headPartial(t, ctx, page) {
  const url = pageUrl(ctx.route, ctx.locale);
  const og = LOCALES.find((l) => l.code === ctx.locale).og;
  const ogAlt = LOCALES.filter((l) => l.code !== ctx.locale)
    .map((l) => `<meta property="og:locale:alternate" content="${l.og}" />`)
    .join('\n');
  const hreflang = [
    ...LOCALES.map((l) => `<link rel="alternate" hreflang="${l.hreflang}" href="${pageUrl(ctx.route, l.code)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${pageUrl(ctx.route, 'en')}" />`,
  ].join('\n');
  const styles = page.styles
    .map((s) => `<link rel="stylesheet" href="/assets/${s}.css" />`)
    .join('\n');
  const title = t(`${page.ns}.meta.title`);
  const desc = t(`${page.ns}.meta.description`);
  const ogTitle = t(`${page.ns}.meta.ogTitle`);
  const ogDesc = t(`${page.ns}.meta.ogDescription`);
  const ogImageAlt = t('common.ogImageAlt');
  const jsonld = page.jsonld ? `\n<script type="application/ld+json">\n${page.jsonld(t, ctx)}\n</script>` : '';
  return `<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<link rel="canonical" href="${url}" />

<!-- Open Graph -->
<meta property="og:type" content="${page.ogType || 'website'}" />
<meta property="og:site_name" content="FT8AF" />
<meta property="og:locale" content="${og}" />
${ogAlt}
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${ogTitle}" />
<meta property="og:description" content="${ogDesc}" />
<meta property="og:image" content="https://ft8af.app/assets/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:alt" content="${ogImageAlt}" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${ogTitle}" />
<meta name="twitter:description" content="${ogDesc}" />
<meta name="twitter:image" content="https://ft8af.app/assets/og-image.png" />
<meta name="twitter:image:alt" content="${ogImageAlt}" />

<!-- Color tokens for browser/UI chrome -->
<meta name="theme-color" content="#07090f" />
<meta name="color-scheme" content="dark" />

<meta name="description" content="${desc}" />

<!-- Localized alternates -->
${hreflang}

<link rel="icon" type="image/svg+xml" href="/assets/icon.svg" />
${ctx.latin ? `<link rel="preload" href="/assets/fonts/geist-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/assets/fonts/geist-mono-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin />\n` : ''}${styles}
<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};</script>
<script defer src="/_vercel/insights/script.js"></script>${jsonld}
</head>`;
}

// ───────────────────────── document assembly ─────────────────────────

function renderPage(page, locale, catalogs) {
  const meta = LOCALES.find((l) => l.code === locale);
  const t = makeT(catalogs[locale] || {}, catalogs.en);
  const ctx = {
    locale,
    dir: meta.dir,
    route: page.route,
    navActive: page.navActive,
    latin: meta.latin,
    getFreeHref: page.getFreeHref,
  };

  // Chrome + body use English-style internal links, then get localized in one pass.
  // The language switcher is injected AFTER localization via a placeholder so its
  // already-final cross-locale links are never rewritten.
  const SWITCH = '<!--LANGSWITCH-->';
  const navWithToken = navPartial(t, ctx).replace(langSwitcher(t, ctx), SWITCH);
  let chrome = `<div class="bg-field"></div>

${navWithToken}

${page.main(t, ctx)}

${footerPartial(t)}`;
  chrome = localizeLinks(chrome, locale).replace(SWITCH, langSwitcher(t, ctx));

  const head = headPartial(t, ctx, page);
  const dirAttr = meta.dir === 'rtl' ? ` dir="rtl"` : '';
  return `<!doctype html>
<html lang="${locale}"${dirAttr}>
${head}
<body>
${chrome}

<script src="/assets/ft8af.js" defer></script>
</body>
</html>
`;
}

// ───────────────────────── sitemap ─────────────────────────

function sitemap() {
  const urls = [];
  for (const page of PAGES) {
    const alts = LOCALES.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${pageUrl(page.route, l.code)}" />`
    ).join('\n');
    const xdefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(page.route, 'en')}" />`;
    for (const l of LOCALES) {
      urls.push(`  <url>
    <loc>${pageUrl(page.route, l.code)}</loc>
${alts}
${xdefault}
  </url>`);
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
}

// ───────────────────────── build ─────────────────────────

async function build() {
  const catalogs = await loadCatalogs();
  let count = 0;
  for (const page of PAGES) {
    for (const { code } of LOCALES) {
      const html = renderPage(page, code, catalogs);
      const sub = code === 'en' ? '' : code;
      const outPath = join(OUT, sub, page.out);
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, html, 'utf8');
      count++;
    }
  }
  await writeFile(join(OUT, 'sitemap.xml'), sitemap(), 'utf8');
  console.log(`Built ${count} pages across ${LOCALES.length} locales → public/`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
