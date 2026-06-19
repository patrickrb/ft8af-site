// Features page.
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12l5 5 11-12"/></svg>';
const GH_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.48A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>';
const DISCORD_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>';

// Feature rows that use a screenshot. flip=row reversed. screenshot rows zip a
// known image + alt key with copy from the catalog.
function pointsList(t, rowKey) {
  return [0, 1, 2]
    .map((i) => `        <li>${CHECK}${t(`features.rows.${rowKey}.points.${i}`)}</li>`)
    .join('\n');
}
function copyBlock(t, rowKey, eyebrowCls) {
  const ec = eyebrowCls ? ` ${eyebrowCls}` : '';
  return `    <div class="frow-copy">
      <div class="eyebrow${ec}">${t(`features.rows.${rowKey}.eyebrow`)}</div>
      <h2>${t(`features.rows.${rowKey}.title`)}</h2>
      <p>${t(`features.rows.${rowKey}.body`)}</p>
      <ul class="feat-points">
${pointsList(t, rowKey)}
      </ul>
    </div>`;
}
function shotRow(t, rowKey, img, altKey, flip, eyebrowCls) {
  return `  <section class="frow${flip ? ' flip' : ''} reveal">
    <div class="frow-visual">
      <span class="shot-device"><img src="/assets/screens/${img}" width="540" height="1200" loading="lazy" alt="${t(altKey)}" /></span>
    </div>
${copyBlock(t, rowKey, eyebrowCls)}
  </section>`;
}

export default {
  ns: 'features',
  route: 'features',
  out: 'features.html',
  styles: ['site', 'sections', 'phone'],
  navActive: 'features',
  ogType: 'website',
  main(t) {
    const stability = [
      { cls: '', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2 2 7l10 5 10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>', delay: 0 },
      { cls: 'cyan', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>', delay: 60 },
      { cls: '', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M16 8a5 5 0 0 1 0 8"/></svg>', delay: 120 },
      { cls: 'cyan', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 7h10M7 7l3-3M7 7l3 3M17 17H7M17 17l-3-3M17 17l-3 3"/></svg>', delay: 0 },
      { cls: '', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>', delay: 60 },
      { cls: 'cyan', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="2"/><path d="M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13"/></svg>', delay: 120 },
    ].map((c, i) => {
      const d = c.delay ? ` data-delay="${c.delay}"` : '';
      return `      <div class="mini${c.cls ? ' ' + c.cls : ''} reveal"${d}>${c.svg}<div><h4>${t(`features.stability.cards.${i}.h4`)}</h4><p>${t(`features.stability.cards.${i}.p`)}</p></div></div>`;
    }).join('\n');

    return `<!-- PAGE HERO -->
<header class="page-hero">
  <div class="wrap">
    <div class="eyebrow reveal">${t('features.hero.eyebrow')}</div>
    <h1 class="reveal" data-delay="60">${t('features.hero.title')}</h1>
    <p class="lede reveal" data-delay="120">${t('features.hero.lede')}</p>
  </div>
</header>

<div class="wrap">

  <!-- 1 · Waterfall -->
${shotRow(t, 'spectrum', 'app-waterfall.png', 'features.rows.spectrum.alt', false, '')}

  <!-- 2 · Modes -->
  <section class="frow flip reveal">
    <div class="frow-visual">
      <div class="viz">
        <div class="viz-head"><span>${t('features.viz.modes.head')}</span><span class="live">FT8</span></div>
        <div class="viz-body">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
            <div style="background:rgba(255,175,94,0.07);border:1px solid var(--border-amber);border-radius:12px;padding:13px 11px">
              <div style="font-family:var(--font-mono);font-size:15px;font-weight:600;color:var(--accent)">FT8</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:5px">${t('features.viz.modes.ft8slot')}</div>
              <div style="font-family:var(--font-mono);font-size:10.5px;color:var(--text-faint);margin-top:2px">to −24 dB</div>
            </div>
            <div style="background:var(--bg-app);border:1px solid var(--border-strong);border-radius:12px;padding:13px 11px">
              <div style="font-family:var(--font-mono);font-size:15px;font-weight:600;color:var(--text)">FT4</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:5px">${t('features.viz.modes.ft4slot')}</div>
              <div style="font-family:var(--font-mono);font-size:10.5px;color:var(--text-faint);margin-top:2px">${t('features.viz.modes.ft4note')}</div>
            </div>
            <div style="background:var(--bg-app);border:1px solid var(--border-strong);border-radius:12px;padding:13px 11px">
              <div style="font-family:var(--font-mono);font-size:15px;font-weight:600;color:var(--text)">FT2</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:5px">${t('features.viz.modes.ft2slot')}</div>
              <div style="font-family:var(--font-mono);font-size:10.5px;color:var(--signal);margin-top:2px">${t('features.viz.modes.ft2note')}</div>
            </div>
          </div>
          <div style="margin-top:12px;display:flex;align-items:center;gap:9px;background:var(--bg-app);border:1px solid var(--border);border-radius:10px;padding:10px 12px">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--signal)" stroke-width="1.7" style="width:18px;height:18px;flex-shrink:0"><path d="M3 11l18-5-5 18-4-8-9-5z"/></svg>
            <span style="font-size:12.5px;color:var(--text-muted)">${t('features.viz.modes.foxhound')}</span>
          </div>
        </div>
      </div>
    </div>
${copyBlock(t, 'modes', 'cyan')}
  </section>

  <!-- 3 · QSO monitor & hunting -->
${shotRow(t, 'qso', 'app-decode.png', 'features.rows.qso.alt', false, '')}

  <!-- 4 · Map -->
${shotRow(t, 'map', 'app-map.png', 'features.rows.map.alt', true, 'cyan')}

  <!-- 5 · POTA -->
${shotRow(t, 'pota', 'app-pota.png', 'features.rows.pota.alt', false, '')}

  <!-- 6 · USB CAT -->
  <section class="frow flip reveal">
    <div class="frow-visual">
      <div class="viz">
        <div class="viz-head"><span>${t('features.viz.usb.head')}</span><span class="live">${t('features.viz.usb.connected')}</span></div>
        <div class="viz-body">
          <div class="usb-diag">
            <div class="usb-node">
              <div class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M10 18h4"/></svg></div>
              <div class="nl"><b>FT8AF</b>Android</div>
            </div>
            <div class="usb-link">
              <div class="wire"></div>
              <span class="lbl">USB-C · CAT</span>
            </div>
            <div class="usb-node">
              <div class="ic" style="color:var(--signal)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="8" cy="12" r="2.4"/><path d="M14 10h5M14 14h5"/></svg></div>
              <div class="nl"><b>${t('features.viz.usb.yourRig')}</b>${t('features.viz.usb.rigCount')}</div>
            </div>
          </div>
          <div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-family:var(--font-mono);font-size:11px">
            <div style="background:var(--bg-app);border:1px solid var(--border);border-radius:8px;padding:9px"><div style="color:var(--text-faint);font-size:9px;text-transform:uppercase;letter-spacing:.06em">Mode</div><div style="color:var(--text);margin-top:3px">DATA-USB</div></div>
            <div style="background:var(--bg-app);border:1px solid var(--border);border-radius:8px;padding:9px"><div style="color:var(--text-faint);font-size:9px;text-transform:uppercase;letter-spacing:.06em">ALC</div><div style="color:var(--status-confirmed);margin-top:3px">Auto</div></div>
            <div style="background:var(--bg-app);border:1px solid var(--border);border-radius:8px;padding:9px"><div style="color:var(--text-faint);font-size:9px;text-transform:uppercase;letter-spacing:.06em">SWR</div><div style="color:var(--status-confirmed);margin-top:3px">OK</div></div>
          </div>
        </div>
      </div>
    </div>
${copyBlock(t, 'usb', 'cyan')}
  </section>

  <!-- 7 · Logging -->
${shotRow(t, 'logging', 'app-logbook.png', 'features.rows.logging.alt', false, '')}

  <!-- 8 · Material 3 -->
${shotRow(t, 'material', 'app-settings.png', 'features.rows.material.alt', true, 'cyan')}

  <!-- 9 · Languages -->
  <section class="frow reveal">
    <div class="frow-visual">
      <div class="viz">
        <div class="viz-head"><span>${t('features.viz.languages.head')}</span><span class="live">${t('features.viz.languages.count')}</span></div>
        <div class="viz-body">
          <div class="lang-grid">
            <div class="lang-card"><span class="lang-native">English</span><span class="lang-code">en</span></div>
            <div class="lang-card"><span class="lang-native">&Epsilon;&lambda;&lambda;&eta;&nu;&iota;&kappa;&#940;</span><span class="lang-code">el</span></div>
            <div class="lang-card"><span class="lang-native">Espa&ntilde;ol</span><span class="lang-code">es</span></div>
            <div class="lang-card"><span class="lang-native">&#26085;&#26412;&#35486;</span><span class="lang-code">ja</span></div>
            <div class="lang-card"><span class="lang-native">Fran&ccedil;ais</span><span class="lang-code">fr</span></div>
            <div class="lang-card"><span class="lang-native">&#1056;&#1091;&#1089;&#1089;&#1082;&#1080;&#1081;</span><span class="lang-code">ru</span></div>
            <div class="lang-card"><span class="lang-native">&#20013;&#25991;</span><span class="lang-code">zh</span></div>
            <div class="lang-card"><span class="lang-native">Italiano</span><span class="lang-code">it</span></div>
            <div class="lang-card"><span class="lang-native">Polski</span><span class="lang-code">pl</span></div>
            <div class="lang-card"><span class="lang-native">&#54620;&#44397;&#50612;</span><span class="lang-code">ko</span></div>
            <div class="lang-card"><span class="lang-native">Nederlands</span><span class="lang-code">nl</span></div>
            <div class="lang-card"><span class="lang-native">&#268;e&#353;tina</span><span class="lang-code">cs</span></div>
            <div class="lang-card"><span class="lang-native">T&uuml;rk&ccedil;e</span><span class="lang-code">tr</span></div>
            <div class="lang-card"><span class="lang-native">Bahasa Indonesia</span><span class="lang-code">id</span></div>
            <div class="lang-card"><span class="lang-native">&#1059;&#1082;&#1088;&#1072;&#1111;&#1085;&#1089;&#1100;&#1082;&#1072;</span><span class="lang-code">uk</span></div>
            <div class="lang-card"><span class="lang-native" lang="ar" dir="rtl">&#1575;&#1604;&#1593;&#1585;&#1576;&#1610;&#1577;</span><span class="lang-code">ar</span></div>
          </div>
        </div>
      </div>
    </div>
${copyBlock(t, 'languages', '')}
  </section>
</div>

<!-- MORE / STABILITY -->
<section class="section">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="eyebrow">${t('features.stability.eyebrow')}</div>
      <h2 class="h-section">${t('features.stability.title')}</h2>
      <p class="lede" style="margin-top:16px">${t('features.stability.lede')}</p>
    </div>
    <div class="mini-grid">
${stability}
    </div>
  </div>
</section>

<!-- CTA -->
<section class="section cta-band">
  <div class="wrap center">
    <h2 class="h-section reveal">${t('features.cta.title')}</h2>
    <div class="hero-cta reveal" data-delay="80" style="justify-content:center;margin-top:30px">
      <a class="btn btn-primary btn-lg" href="/download">${t('common.btn.downloadFt8af')}</a>
      <a class="btn btn-ghost btn-lg" href="https://github.com/patrickrb/FT8AF" target="_blank" rel="noopener">
        ${GH_SVG}
        ${t('common.btn.starGithub')}
      </a>
      <a class="btn btn-ghost btn-lg" href="https://discord.gg/tz4spm5nWB" target="_blank" rel="noopener">
        ${DISCORD_SVG}
        ${t('common.btn.joinDiscord')}
      </a>
    </div>
  </div>
</section>`;
  },
};
