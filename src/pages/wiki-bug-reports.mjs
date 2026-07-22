// Wiki article: Reporting a bug.
// Prose is translated; viz mockups, shell commands and the GitHub issue template
// stay in English (they are copy-paste literals / illustrative app chrome).
const INFO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.5"/></svg>';

const TOC = ['what', 'unlock', 'share', 'fallback-files', 'fallback-adb', 'write', 'template', 'crash', 'privacy'];

export default {
  ns: 'wikiBug',
  route: 'wiki/bug-reports',
  out: 'wiki/bug-reports.html',
  styles: ['site', 'sections', 'wiki'],
  navActive: 'wiki',
  ogType: 'article',
  jsonld(t, ctx) {
    const base = 'https://ft8af.app' + (ctx.locale === 'en' ? '' : `/${ctx.locale}`);
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FT8AF', item: base + '/' },
        { '@type': 'ListItem', position: 2, name: t('common.nav.wiki'), item: base + '/wiki' },
        { '@type': 'ListItem', position: 3, name: t('wikiUsing.pager.nextTitle'), item: base + '/wiki/bug-reports' },
      ],
    }, null, 2);
  },
  main(t) {
    const toc = TOC.map((id, i) => `          <li><a href="#${id}">${t(`wikiBug.toc.items.${i}`)}</a></li>`).join('\n');
    const ul = (key, n) => [...Array(n)].map((_, i) => `          <li>${t(`${key}.${i}`)}</li>`).join('\n');
    const steps = (key, n) => [...Array(n)].map((_, i) => `          <li>${t(`${key}.${i}`)}</li>`).join('\n');
    const dl = (key, n) => [...Array(n)].map((_, i) => `          <dt>${t(`${key}.${i}.dt`)}</dt><dd>${t(`${key}.${i}.dd`)}</dd>`).join('\n');

    return `<header class="page-hero">
  <div class="wrap">
    <div class="eyebrow cyan reveal">${t('wikiBug.hero.eyebrow')}</div>
    <h1 class="reveal" data-delay="60">${t('wikiBug.hero.title')}</h1>
    <p class="lede reveal" data-delay="120">${t('wikiBug.hero.lede')}</p>
  </div>
</header>

<section class="section-sm" style="padding-top:8px">
  <div class="wrap">
    <div class="wiki-article">

      <aside class="wiki-toc">
        <div class="wiki-toc-title">${t('wikiBug.toc.title')}</div>
        <ol>
${toc}
        </ol>
      </aside>

      <article class="wiki-body">

        <div class="callout">
          ${INFO}
          <div>
            <h4>${t('wikiBug.webform.h')}</h4>
            <p>${t('wikiBug.webform.p')} <a href="/report">${t('wikiBug.webform.cta')}</a></p>
          </div>
        </div>

        <h2 id="what"><span class="step-num cyan">1</span>${t('wikiBug.s1.h')}</h2>
        <p>${t('wikiBug.s1.p1')}</p>
        <ul>
${ul('wikiBug.s1.ul', 5)}
        </ul>
        <p>${t('wikiBug.s1.p2')}</p>

        <h2 id="unlock"><span class="step-num cyan">2</span>${t('wikiBug.s2.h')}</h2>
        <p>${t('wikiBug.s2.p1')}</p>

        <ol class="wiki-steps cyan">
${steps('wikiBug.s2.steps', 5)}
        </ol>

        <figure class="wiki-fig cyan">
          <div class="viz" style="max-width:none">
            <div class="viz-head"><span>Settings · About</span><span class="live">Debug unlocked</span></div>
            <div class="viz-body" style="padding:0">
              <div class="set-row"><span class="set-l">FT8AF</span><span class="set-v mono">v1.2 · build 2026.06.02</span></div>
              <div class="set-row"><span class="set-l">FAQ &amp; Support</span><span class="set-v mono" style="color:var(--text-faint)">›</span></div>
              <div class="set-row last" style="background:rgba(92,214,232,0.06)"><span class="set-l" style="color:var(--signal)">Debug</span><span class="set-v mono" style="color:var(--signal)">View / share debug.log · ›</span></div>
            </div>
          </div>
          <figcaption>${t('wikiBug.s2.cap')}</figcaption>
        </figure>

        <h2 id="share"><span class="step-num cyan">3</span>${t('wikiBug.s3.h')}</h2>
        <p>${t('wikiBug.s3.p1')}</p>

        <figure class="wiki-fig cyan">
          <div class="viz" style="max-width:none">
            <div class="viz-head"><span>Debug · 412 lines</span><span class="live">Tailing</span></div>
            <div class="viz-body" style="padding:0">
              <div style="display:flex;gap:4px;padding:12px 14px;border-bottom:1px solid var(--border);font-family:var(--font-mono);font-size:12px">
                <span style="padding:6px 12px;border-radius:6px;background:var(--signal-soft);color:var(--signal);font-weight:600">Share</span>
                <span style="padding:6px 12px;border-radius:6px;color:var(--text-muted)">Clear</span>
                <span style="padding:6px 12px;border-radius:6px;color:var(--text-muted)">Logcat: OFF</span>
              </div>
              <pre style="margin:0;border:none;border-radius:0;background:var(--bg-app);padding:14px 16px;font-size:11.5px;line-height:1.55;color:var(--text);overflow:hidden"><code>13:42:01  USB attach: vid=10c4 pid=ea60
13:42:01  autoConnect attempt #1 &rarr; SUCCESS
13:42:02  CAT &gt; FE FE 94 E0 03 FD
13:42:02  CAT &lt; FE FE E0 94 03 00 74 04 00 14 FD
13:42:05  band &rarr; 20m, freq 14.074 MHz
13:42:18  decode: 14 messages in 64 ms
13:42:33  decode: 11 messages in 58 ms</code></pre>
            </div>
          </div>
          <figcaption>${t('wikiBug.s3.cap')}</figcaption>
        </figure>

        <p>${t('wikiBug.s3.p2')}</p>
        <dl class="wiki-dl">
${dl('wikiBug.s3.dl', 3)}
        </dl>

        <div class="callout">
          ${INFO}
          <div>
            <h4>${t('wikiBug.s3.callout.h')}</h4>
            <p>${t('wikiBug.s3.callout.p')}</p>
          </div>
        </div>

        <h2 id="fallback-files"><span class="step-num cyan">4</span>${t('wikiBug.s4.h')}</h2>
        <p>${t('wikiBug.s4.p1')}</p>
        <pre><code>/Android/data/radio.ks3ckc.ft8af/files/debug.log</code></pre>

        <ol class="wiki-steps cyan">
${steps('wikiBug.s4.steps', 4)}
        </ol>

        <div class="callout">
          ${INFO}
          <div>
            <h4>${t('wikiBug.s4.callout.h')}</h4>
            <p>${t('wikiBug.s4.callout.p')}</p>
          </div>
        </div>

        <h2 id="fallback-adb"><span class="step-num cyan">5</span>${t('wikiBug.s5.h')}</h2>
        <p>${t('wikiBug.s5.p1')}</p>
        <ol class="wiki-steps cyan">
          <li>${t('wikiBug.s5.steps.0')}</li>
          <li>${t('wikiBug.s5.steps.1')}</li>
          <li>${t('wikiBug.s5.steps.2')}
            <pre><code>adb devices -l</code></pre>
          </li>
          <li>${t('wikiBug.s5.steps.3')}
            <pre><code>adb pull /sdcard/Android/data/radio.ks3ckc.ft8af/files/debug.log .</code></pre>
            ${t('wikiBug.s5.steps3b')}
          </li>
        </ol>

        <h2 id="write"><span class="step-num cyan">6</span>${t('wikiBug.s6.h')}</h2>
        <p>${t('wikiBug.s6.p1')}</p>
        <ol class="wiki-steps cyan">
${steps('wikiBug.s6.steps', 5)}
        </ol>

        <h2 id="template"><span class="step-num cyan">7</span>${t('wikiBug.s7.h')}</h2>
        <p>${t('wikiBug.s7.p1')}</p>
        <pre><code>## What happened

(One or two sentences describing the bug)

## Steps to reproduce
1. (First thing you tapped)
2. (Second thing)
3. (...)

## Expected vs. actual

Expected: (what should have happened)
Actual:   (what did happen)

## Environment

- FT8AF version:   (Settings → About, or the release tag you installed)
- Source:          GitHub APK / Google Play / built from source
- Android version: (e.g. 14)
- Device:          (e.g. Pixel 8, Samsung S23, etc.)
- Radio:           (e.g. Yaesu FT-891 over USB-C)
- Cable:           (USB-C direct / OTG adapter / brand if relevant)

## Log

(Attach debug.log, or paste the last ~50 lines in a code block.)
</code></pre>

        <h2 id="crash"><span class="step-num cyan">8</span>${t('wikiBug.s8.h')}</h2>
        <p>${t('wikiBug.s8.p1')}</p>
        <ul>
          <li>${t('wikiBug.s8.ul0')}</li>
          <li>${t('wikiBug.s8.ul1')}
            <pre><code>adb logcat -d &gt; logcat.txt</code></pre>
            ${t('wikiBug.s8.ul1b')}
          </li>
        </ul>

        <h2 id="privacy"><span class="step-num cyan">9</span>${t('wikiBug.s9.h')}</h2>
        <p>${t('wikiBug.s9.p1')}</p>
        <pre><code>13:42:01 USB attach: vid=10c4 pid=ea60 (Silicon Labs CP210x)
13:42:01 autoConnect attempt #1 → SUCCESS
13:42:02 CAT &gt; FE FE 94 E0 03 FD
13:42:02 CAT &lt; FE FE E0 94 03 00 74 04 00 14 FD
13:42:05 band → 20m, freq 14.074 MHz</code></pre>
        <p>${t('wikiBug.s9.p2')}</p>
        <p>${t('wikiBug.s9.p3')}</p>

        <div class="callout amber">
          ${INFO}
          <div>
            <h4>${t('wikiBug.s9.callout.h')}</h4>
            <p>${t('wikiBug.s9.callout.p')}</p>
          </div>
        </div>

        <nav class="wiki-pager">
          <a href="/wiki/using" class="pg-prev">
            <span class="pg-label">${t('wikiBug.pager.prevLabel')}</span>
            <span class="pg-title">${t('wikiBug.pager.prevTitle')}</span>
          </a>
          <a href="https://github.com/patrickrb/FT8AF/issues/new" target="_blank" rel="noopener" class="pg-next">
            <span class="pg-label">${t('wikiBug.pager.nextLabel')}</span>
            <span class="pg-title">${t('wikiBug.pager.nextTitle')}</span>
          </a>
        </nav>

      </article>
    </div>
  </div>
</section>`;
  },
};
