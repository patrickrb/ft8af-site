// One-shot renderer for the OG image. Run from this dir:
//   cd tools/og-image && npm install && node render.mjs
import path from 'node:path';
import url from 'node:url';
import { chromium } from 'playwright-core';

const here = path.dirname(url.fileURLToPath(import.meta.url));
const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const TEMPLATE = url.pathToFileURL(path.join(here, 'template.html')).toString();
const OUT = path.join(here, '..', '..', 'public', 'assets', 'og-image.png');

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('pageerror', e => console.error('page error:', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('console err:', m.text()); });
await page.goto(TEMPLATE, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(200);
await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log('wrote', OUT);
