// Wiki article: Using the app.
// Prose (headings, paragraphs, lists, captions, callouts, steps, TOC, pager) is
// translated. The inline UI "mockups" (viz blocks) are illustrative app chrome and
// stay in English, consistent with the app screenshots.
const INFO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.5"/></svg>';

const TOC = ['install', 'identity', 'connect', 'decode', 'waterfall', 'call', 'qso', 'log', 'tips'];

export default {
  ns: 'wikiUsing',
  route: 'wiki/using',
  out: 'wiki/using.html',
  styles: ['site', 'sections', 'phone', 'wiki'],
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
        { '@type': 'ListItem', position: 3, name: t('wikiBug.pager.prevTitle'), item: base + '/wiki/using' },
      ],
    }, null, 2);
  },
  main(t) {
    const toc = TOC.map((id, i) => `          <li><a href="#${id}">${t(`wikiUsing.toc.items.${i}`)}</a></li>`).join('\n');
    const ul = (key, n) => [...Array(n)].map((_, i) => `          <li>${t(`${key}.${i}`)}</li>`).join('\n');
    const steps = (key, n) => [...Array(n)].map((_, i) => `          <li>${t(`${key}.${i}`)}</li>`).join('\n');
    const dl = (key, n) => [...Array(n)].map((_, i) => `          <dt>${t(`${key}.${i}.dt`)}</dt><dd>${t(`${key}.${i}.dd`)}</dd>`).join('\n');

    return `<header class="page-hero">
  <div class="wrap">
    <div class="eyebrow reveal">${t('wikiUsing.hero.eyebrow')}</div>
    <h1 class="reveal" data-delay="60">${t('wikiUsing.hero.title')}</h1>
    <p class="lede reveal" data-delay="120">${t('wikiUsing.hero.lede')}</p>
  </div>
</header>

<section class="section-sm" style="padding-top:8px">
  <div class="wrap">
    <div class="wiki-article">

      <aside class="wiki-toc">
        <div class="wiki-toc-title">${t('wikiUsing.toc.title')}</div>
        <ol>
${toc}
        </ol>
      </aside>

      <article class="wiki-body">

        <h2 id="install"><span class="step-num">1</span>${t('wikiUsing.s1.h')}</h2>
        <p>${t('wikiUsing.s1.p1')}</p>
        <p>${t('wikiUsing.s1.p2')}</p>
        <ul>
${ul('wikiUsing.s1.ul', 2)}
        </ul>

        <h2 id="identity"><span class="step-num">2</span>${t('wikiUsing.s2.h')}</h2>
        <p>${t('wikiUsing.s2.p1')}</p>

        <figure class="wiki-fig">
          <div class="viz" style="max-width:none">
            <div class="viz-head"><span>Settings · Operator</span><span class="live">Saved</span></div>
            <div class="viz-body" style="padding:0">
              <div class="set-row"><span class="set-l">Callsign</span><span class="set-v mono">K1AF</span></div>
              <div class="set-row"><span class="set-l">Grid square</span><span class="set-v mono">FN42hk</span></div>
              <div class="set-row"><span class="set-l">Power (W)</span><span class="set-v mono">50</span></div>
              <div class="set-row"><span class="set-l">Antenna</span><span class="set-v mono">Dipole · 20m</span></div>
              <div class="set-row"><span class="set-l">Audio frequency</span><span class="set-v mono">1500 Hz</span></div>
              <div class="set-row"><span class="set-l">TX delay</span><span class="set-v mono">400 ms</span></div>
              <div class="set-row last"><span class="set-l">Clock source</span><span class="set-v mono">Network (NTP)</span></div>
            </div>
          </div>
          <figcaption>${t('wikiUsing.s2.cap')}</figcaption>
        </figure>

        <dl class="wiki-dl">
${dl('wikiUsing.s2.dl', 4)}
        </dl>

        <h2 id="connect"><span class="step-num">3</span>${t('wikiUsing.s3.h')}</h2>
        <p>${t('wikiUsing.s3.p1')}</p>

        <figure class="wiki-fig">
          <div class="viz" style="max-width:none">
            <div class="viz-head"><span>USB CAT + Audio</span><span class="live">Connected</span></div>
            <div class="viz-body">
              <div class="usb-diag">
                <div class="usb-node">
                  <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10 18h4"/></svg></div>
                  <div class="nl"><b>FT8AF</b>Android</div>
                </div>
                <div class="usb-link">
                  <div class="wire"></div>
                  <span class="lbl">USB-C · CAT + Audio</span>
                </div>
                <div class="usb-node">
                  <div class="ic" style="color:var(--signal)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="8" cy="12" r="2.4"/><path d="M14 10h5M14 14h5"/></svg></div>
                  <div class="nl"><b>Your rig</b>IC-7300 · FT-891 · IC-705</div>
                </div>
              </div>
              <div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-family:var(--font-mono);font-size:11px">
                <div style="background:var(--bg-app);border:1px solid var(--border);border-radius:8px;padding:9px"><div style="color:var(--text-faint);font-size:9px;text-transform:uppercase;letter-spacing:.06em">Mode</div><div style="color:var(--text);margin-top:3px">DATA-USB</div></div>
                <div style="background:var(--bg-app);border:1px solid var(--border);border-radius:8px;padding:9px"><div style="color:var(--text-faint);font-size:9px;text-transform:uppercase;letter-spacing:.06em">BW</div><div style="color:var(--text);margin-top:3px">3000 Hz</div></div>
                <div style="background:var(--bg-app);border:1px solid var(--border);border-radius:8px;padding:9px"><div style="color:var(--text-faint);font-size:9px;text-transform:uppercase;letter-spacing:.06em">PTT</div><div style="color:var(--status-confirmed);margin-top:3px">CAT</div></div>
              </div>
            </div>
          </div>
          <figcaption>${t('wikiUsing.s3.cap')}</figcaption>
        </figure>

        <ol class="wiki-steps">
${steps('wikiUsing.s3.steps', 5)}
        </ol>

        <div class="callout">
          ${INFO}
          <div>
            <h4>${t('wikiUsing.s3.callout.h')}</h4>
            <p>${t('wikiUsing.s3.callout.p')}</p>
          </div>
        </div>

        <h2 id="decode"><span class="step-num">4</span>${t('wikiUsing.s4.h')}</h2>
        <p>${t('wikiUsing.s4.p1')}</p>

        <figure class="wiki-fig shot-phone">
          <img src="/assets/screens/app-decode.png" width="540" height="1200" alt="${t('wikiUsing.s4.alt')}" loading="lazy" />
          <figcaption>${t('wikiUsing.s4.cap')}</figcaption>
        </figure>

        <p>${t('wikiUsing.s4.p2')}</p>
        <dl class="wiki-dl">
${dl('wikiUsing.s4.dl', 5)}
        </dl>

        <h2 id="waterfall"><span class="step-num">5</span>${t('wikiUsing.s5.h')}</h2>
        <p>${t('wikiUsing.s5.p1')}</p>

        <figure class="wiki-fig">
          <div class="viz" style="max-width:none">
            <div class="viz-head"><span>20m · 14.074 MHz</span><span class="live">Live</span></div>
            <div class="viz-body" style="padding:12px">
              <div class="wf-axis"><span>0</span><span>500</span><span>1000</span><span>1500</span><span>2000</span><span>2500</span><span>3000</span></div>
              <canvas data-spectrum data-h="48" style="width:100%;display:block;border-radius:8px 8px 0 0"></canvas>
              <canvas data-waterfall data-h="260" style="width:100%;display:block;border-radius:0 0 8px 8px"></canvas>
            </div>
            <div class="wf-foot"><span>UTC 14:23:00 · period boundary</span><span>Decoded in 64 ms</span><span class="live" style="color:var(--signal)">● 14 signals</span></div>
          </div>
          <figcaption>${t('wikiUsing.s5.cap')}</figcaption>
        </figure>

        <p>${t('wikiUsing.s5.p2')}</p>

        <h2 id="call"><span class="step-num">6</span>${t('wikiUsing.s6.h')}</h2>
        <p>${t('wikiUsing.s6.p1')}</p>
        <ol class="wiki-steps">
${steps('wikiUsing.s6.steps', 2)}
        </ol>

        <p>${t('wikiUsing.s6.p2')}</p>

        <h2 id="qso"><span class="step-num">7</span>${t('wikiUsing.s7.h')}</h2>
        <p>${t('wikiUsing.s7.p1')}</p>

        <figure class="wiki-fig">
          <div class="viz" style="max-width:none">
            <div class="viz-head"><span>Active QSO · EA8DH</span><span class="live">Auto</span></div>
            <div class="viz-body">
              <div class="qseq">
                <div class="qstep done"><span class="num"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12l5 5 11-12"/></svg></span><div><div class="ql">Call</div><div class="qm"><span class="tx">TX</span> EA8DH K1AF FN42</div></div></div>
                <div class="qstep done"><span class="num"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12l5 5 11-12"/></svg></span><div><div class="ql">Report sent</div><div class="qm"><span class="tx">TX</span> EA8DH K1AF −09</div></div></div>
                <div class="qstep active"><span class="num">3</span><div><div class="ql">Roger report</div><div class="qm"><span class="rx">RX</span> K1AF EA8DH R−06</div></div></div>
                <div class="qstep pending"><span class="num">4</span><div><div class="ql">Confirm (RR73)</div></div></div>
                <div class="qstep pending"><span class="num">5</span><div><div class="ql">Logged &amp; uploaded</div></div></div>
              </div>
            </div>
          </div>
          <figcaption>${t('wikiUsing.s7.cap')}</figcaption>
        </figure>

        <p>${t('wikiUsing.s7.p2')}</p>

        <h2 id="log"><span class="step-num">8</span>${t('wikiUsing.s8.h')}</h2>
        <p>${t('wikiUsing.s8.p1')}</p>

        <figure class="wiki-fig">
          <div class="viz" style="max-width:none">
            <div class="viz-head"><span>Logbook · auto-upload</span><span class="live">Synced</span></div>
            <div class="viz-body" style="padding:6px 16px 12px">
              <div class="logrow">
                <span class="spill" style="color:var(--status-confirmed);background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.22)"><span class="d" style="background:var(--status-confirmed)"></span>QRZ</span>
                <div><div class="lc">DL7VEE <span style="color:var(--text-faint);font-weight:400;font-size:12px">JO62</span></div><div class="ld">Germany · 20m · FT8</div></div>
                <div class="lt">14:18<br />−18 / −09</div>
              </div>
              <div class="logrow">
                <span class="spill" style="color:var(--signal);background:rgba(92,214,232,.1);border:1px solid rgba(92,214,232,.22)"><span class="d" style="background:var(--signal)"></span>Cloud</span>
                <div><div class="lc">W3LPL <span style="color:var(--text-faint);font-weight:400;font-size:12px">FM19</span></div><div class="ld">Maryland · 20m · FT8</div></div>
                <div class="lt">14:02<br />−06 / −11</div>
              </div>
              <div class="logrow">
                <span class="spill" style="color:var(--status-confirmed);background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.22)"><span class="d" style="background:var(--status-confirmed)"></span>QRZ</span>
                <div><div class="lc">JA3YBK <span style="color:var(--text-faint);font-weight:400;font-size:12px">PM74</span></div><div class="ld">Japan · 15m · FT8</div></div>
                <div class="lt">13:45<br />−12 / −15</div>
              </div>
            </div>
          </div>
          <figcaption>${t('wikiUsing.s8.cap')}</figcaption>
        </figure>

        <h3>Cloudlog</h3>
        <p>${t('wikiUsing.s8.cloudlog')}</p>
        <h3>QRZ</h3>
        <p>${t('wikiUsing.s8.qrz')}</p>
        <p>${t('wikiUsing.s8.both')}</p>

        <h2 id="tips"><span class="step-num">9</span>${t('wikiUsing.s9.h')}</h2>
        <ul>
${ul('wikiUsing.s9.ul', 5)}
        </ul>

        <div class="callout amber">
          ${INFO}
          <div>
            <h4>${t('wikiUsing.s9.callout.h')}</h4>
            <p>${t('wikiUsing.s9.callout.p')}</p>
          </div>
        </div>

        <nav class="wiki-pager">
          <a href="/wiki" class="pg-prev">
            <span class="pg-label">${t('wikiUsing.pager.prevLabel')}</span>
            <span class="pg-title">${t('wikiUsing.pager.prevTitle')}</span>
          </a>
          <a href="/wiki/bug-reports" class="pg-next">
            <span class="pg-label">${t('wikiUsing.pager.nextLabel')}</span>
            <span class="pg-title">${t('wikiUsing.pager.nextTitle')}</span>
          </a>
        </nav>

      </article>
    </div>
  </div>
</section>`;
  },
};
