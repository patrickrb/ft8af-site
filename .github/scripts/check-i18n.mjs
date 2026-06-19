// Localization coverage check for ft8af.app.
//
// Compares every locale catalog in src/i18n against en.json (the source of truth):
//   • prints a translation-coverage table per locale;
//   • FAILS on structural defects — unknown/extra keys, shape mismatches (a key that
//     is a string on one side and an object on the other), missing or stray catalog
//     files, or invalid JSON;
//   • WARNS on missing or verbatim strings. Missing keys fall back to English by
//     design (see build.mjs), so they don't fail the build unless you ask them to.
//
// Usage:
//   node .github/scripts/check-i18n.mjs           # report + fail on structural errors only
//   node .github/scripts/check-i18n.mjs --strict  # also fail if any locale is < 100% translated
//   node .github/scripts/check-i18n.mjs --min 80  # also fail if any locale is < 80% translated

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..');
const i18nDir = resolve(repoRoot, 'src', 'i18n');

const { LOCALES } = await import(new URL('../../src/data/site.mjs', import.meta.url).href);

// ───────────────────────── args ─────────────────────────
const argv = process.argv.slice(2);
const strict = argv.includes('--strict');
const minArg = argv.indexOf('--min');
const minCoverage = minArg >= 0 ? Number(argv[minArg + 1]) : strict ? 100 : 0;

// ───────────────────────── helpers ─────────────────────────

// Flatten a nested catalog into a Map of dotted leaf paths → value. Arrays are
// treated as leaves (the catalogs only use strings, but this keeps us honest).
function flatten(obj, prefix = '', out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out.set(key, v);
  }
  return out;
}

// Every intermediate (branch) path implied by a set of leaf paths. Used to tell a
// missing key apart from a shape mismatch: if en has leaf "a.b" but the locale only
// has "a.b.c", then "a.b" is a branch in the locale → the shapes disagree.
function branchPaths(leafKeys) {
  const s = new Set();
  for (const k of leafKeys) {
    const parts = k.split('.');
    for (let i = 1; i < parts.length; i++) s.add(parts.slice(0, i).join('.'));
  }
  return s;
}

function loadCatalog(file) {
  try {
    return { data: JSON.parse(readFileSync(file, 'utf8')), error: null };
  } catch (e) {
    return { data: null, error: e.message };
  }
}

const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);

// ───────────────────────── load source of truth ─────────────────────────
const codes = LOCALES.map((l) => l.code);
const enFile = resolve(i18nDir, 'en.json');

const errors = []; // structural problems → non-zero exit
const warnings = []; // missing/verbatim → reported, exit unaffected (unless --strict/--min)

if (!existsSync(enFile)) {
  console.error('FATAL: src/i18n/en.json (source of truth) is missing.');
  process.exit(1);
}
const enLoad = loadCatalog(enFile);
if (enLoad.error) {
  console.error(`FATAL: en.json is not valid JSON — ${enLoad.error}`);
  process.exit(1);
}
const en = flatten(enLoad.data);
const enKeys = [...en.keys()];
const enBranches = branchPaths(enKeys);
const total = enKeys.length;

// ───────────────────────── file-presence sanity ─────────────────────────
// Every declared locale must have a catalog; every catalog must be a declared locale.
for (const code of codes) {
  if (!existsSync(resolve(i18nDir, `${code}.json`))) {
    errors.push(`Locale "${code}" is declared in src/data/site.mjs but src/i18n/${code}.json is missing.`);
  }
}
for (const file of readdirSync(i18nDir).filter((f) => f.endsWith('.json'))) {
  const code = file.replace(/\.json$/, '');
  if (!codes.includes(code)) {
    errors.push(`src/i18n/${file} has no matching entry in the LOCALES registry (stray or misnamed catalog).`);
  }
}

// ───────────────────────── per-locale comparison ─────────────────────────
const rows = [];
for (const code of codes) {
  if (code === 'en') continue;
  const file = resolve(i18nDir, `${code}.json`);
  if (!existsSync(file)) continue; // already reported above

  const load = loadCatalog(file);
  if (load.error) {
    errors.push(`${code}.json is not valid JSON — ${load.error}`);
    continue;
  }
  const loc = flatten(load.data);
  const locBranches = branchPaths([...loc.keys()]);

  const missing = []; // in en, absent from locale → falls back to English
  const verbatim = []; // present but identical to English → untranslated (maybe intentional)
  const extra = []; // in locale, unknown to en → typo or stale key (error)
  const shape = []; // string-vs-object disagreement (error)

  for (const k of enKeys) {
    if (loc.has(k)) {
      if (loc.get(k) === en.get(k)) verbatim.push(k);
    } else if (locBranches.has(k)) {
      shape.push(`${k} (string in en, object in ${code})`);
    } else {
      missing.push(k);
    }
  }
  for (const k of loc.keys()) {
    if (en.has(k)) continue;
    if (enBranches.has(k)) shape.push(`${k} (object in en, string in ${code})`);
    else extra.push(k);
  }

  const translated = enKeys.filter((k) => loc.has(k) && loc.get(k) !== en.get(k)).length;
  const coverage = total ? (translated / total) * 100 : 100;

  rows.push({ code, coverage, translated, verbatim: verbatim.length, missing: missing.length, extra: extra.length, shape: shape.length, missingKeys: missing, extraKeys: extra, shapeKeys: shape });

  if (extra.length) errors.push(`${code}: ${extra.length} unknown key(s) not present in en.json (e.g. ${extra.slice(0, 3).join(', ')}).`);
  if (shape.length) errors.push(`${code}: ${shape.length} shape mismatch(es) vs en.json (e.g. ${shape.slice(0, 2).join('; ')}).`);
  if (missing.length) {
    warnings.push(`${code}: ${missing.length} key(s) missing — render in English (e.g. ${missing.slice(0, 3).join(', ')}).`);
  }
  if (coverage < minCoverage) {
    errors.push(`${code}: coverage ${coverage.toFixed(1)}% is below the required ${minCoverage}%.`);
  }
}

// ───────────────────────── report ─────────────────────────
rows.sort((a, b) => a.coverage - b.coverage);

console.log(`\nLocalization coverage vs en.json (${total} keys)\n`);
console.log(`  ${pad('locale', 8)}${padL('coverage', 9)}${padL('translated', 12)}${padL('verbatim', 10)}${padL('missing', 9)}${padL('extra', 7)}${padL('shape', 7)}`);
console.log(`  ${'─'.repeat(60)}`);
for (const r of rows) {
  const flag = r.extra || r.shape ? ' ✗' : r.coverage === 100 ? ' ✓' : '';
  console.log(
    `  ${pad(r.code, 8)}${padL(r.coverage.toFixed(1) + '%', 9)}${padL(r.translated, 12)}${padL(r.verbatim, 10)}${padL(r.missing, 9)}${padL(r.extra, 7)}${padL(r.shape, 7)}${flag}`,
  );
}

if (warnings.length) {
  console.log(`\nWarnings (non-fatal — these fall back to English):`);
  for (const w of warnings) console.log(`  • ${w}`);
}

if (errors.length) {
  console.log(`\nErrors (${errors.length}):`);
  for (const e of errors) console.log(`  ✗ ${e}`);
  console.error(`\nLocalization check FAILED.`);
  process.exit(1);
}

console.log(`\nLocalization check passed${strict || minCoverage ? ` (coverage gate: ${minCoverage}%)` : ' (structural)'}.`);
