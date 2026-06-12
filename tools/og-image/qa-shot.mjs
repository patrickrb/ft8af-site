// Ad-hoc QA screenshotter. Usage: node qa-shot.mjs <url> <outfile> [width] [fullPage]
import { chromium } from 'playwright-core';

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const [url, out, width = '1280', full = 'true'] = process.argv.slice(2);

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
const ctx = await browser.newContext({ viewport: { width: parseInt(width, 10), height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('pageerror', e => console.error('page error:', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('console err:', m.text()); });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts && document.fonts.ready);
await page.waitForTimeout(1800); // let reveal + canvases settle
await page.screenshot({ path: out, fullPage: full === 'true' });
await browser.close();
console.log('wrote', out);
