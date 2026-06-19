// Vercel Routing Middleware — language auto-detection for the home page.
//
// Runs ONLY on "/" (see config.matcher), before the CDN cache:
//   1. A returning visitor who made an explicit choice (the `locale` cookie, set
//      client-side in public/assets/ft8af.js) is honored.
//   2. Otherwise a first-time visitor is sent to the closest match for their
//      browser's Accept-Language.
//   3. English is served in place at "/", so it never redirects.
//
// Deep links (/features, /es, /es/features, …) are intentionally left untouched.

import { next } from '@vercel/functions';
import { LOCALES } from './src/data/site.mjs';

// Locale codes that have a build, derived from the single source of truth so the
// two can't drift. `en` lives at the site root; the rest under /<code>.
const SUPPORTED = new Set(LOCALES.map((l) => l.code));

export default function middleware(request) {
  const url = new URL(request.url);
  if (url.pathname !== '/') return next(); // defensive; matcher already scopes to "/"

  // 1) Explicit choice wins (cookie set when the visitor uses the language picker).
  const chosen = readCookie(request.headers.get('cookie'), 'locale');
  let target = SUPPORTED.has(chosen) ? chosen : null;

  // 2) Otherwise, the closest match to the browser's Accept-Language.
  if (!target) target = pickLocale(request.headers.get('accept-language'));

  // 3) English (or no supported match) is served in place — no redirect.
  if (!target || target === 'en') return next();

  url.pathname = '/' + target;
  return new Response(null, {
    status: 307, // temporary: "/" stays the canonical, indexable English URL
    headers: {
      Location: url.toString(),
      'Cache-Control': 'no-store', // the decision is per-visitor; never cache it
      Vary: 'Accept-Language, Cookie',
    },
  });
}

// Pick the highest-priority Accept-Language tag we have a build for ("fr-CH" → "fr").
function pickLocale(header) {
  if (!header) return null;
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      let q = 1;
      for (const p of params) {
        const m = /^q=([0-9.]+)$/.exec(p.trim());
        if (m) q = parseFloat(m[1]);
      }
      return { tag: tag.toLowerCase(), q };
    })
    .filter((x) => x.tag && x.tag !== '*')
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (SUPPORTED.has(tag)) return tag; // exact ("pt-br" won't match; "fr" will)
    const base = tag.split('-')[0]; // region fallback: "fr-CH" → "fr"
    if (SUPPORTED.has(base)) return base;
  }
  return null;
}

function readCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i === -1) continue;
    if (part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

export const config = { matcher: '/' };
