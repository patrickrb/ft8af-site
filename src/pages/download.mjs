// Download page.
const GH_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.48A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>';
const PLAY_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3.6 2.7 14.5 12 3.6 21.3a1 1 0 0 1-.6-.93V3.63a1 1 0 0 1 .6-.93Z"/><path d="m14.5 12 3.9-3.3 2.7 1.5a1.4 1.4 0 0 1 0 2.45l-2.7 1.5L14.5 12Z"/></svg>';
const DL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12M7 11l5 5 5-5M5 21h14"/></svg>';
const DESKTOP_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>';
const DISCORD_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>';

export default {
  ns: 'download',
  route: 'download',
  out: 'download.html',
  styles: ['site', 'sections', 'phone'],
  navActive: 'download',
  ogType: 'website',
  getFreeHref: '#get',
  main(t) {
    const li = (key, n, strong) =>
      [...Array(n)].map((_, i) => `          <li>${strong && i === 0 ? `<strong>${t(`${key}.${i}`)}</strong>` : t(`${key}.${i}`)}</li>`).join('\n');
    const steps = (key, n) =>
      [...Array(n)].map((_, i) => `          <li>${t(`${key}.${i}`)}</li>`).join('\n');
    const reqCards = [0, 1, 2, 3].map((i) => {
      const d = i ? ` data-delay="${i * 60}"` : '';
      return `      <div class="card req reveal"${d}><div class="rk">${t(`download.req.cards.${i}.k`)}</div><div class="rv">${t(`download.req.cards.${i}.v`)}</div><div class="rd">${t(`download.req.cards.${i}.d`)}</div></div>`;
    }).join('\n');

    return `<header class="page-hero">
  <div class="wrap">
    <div class="eyebrow reveal">${t('download.hero.eyebrow')}</div>
    <h1 class="reveal" data-delay="60">${t('download.hero.title')}</h1>
    <p class="lede reveal" data-delay="120">${t('download.hero.lede')}</p>
  </div>
</header>

<!-- TWO CARDS -->
<section class="section-sm" id="get" style="padding-top:32px">
  <div class="wrap">
    <div class="price-grid">
      <article class="card price reveal">
        <div class="price-top">
          <span class="pill cyan"><span class="dot" style="background:var(--signal)"></span>${t('download.free.tag')}</span>
          <div class="price-amt"><span class="mono">$0</span></div>
        </div>
        <h3>${t('download.free.title')}</h3>
        <p>${t('download.free.body')}</p>
        <ul class="price-list">
${li('download.free.li', 5)}
        </ul>
        <a class="btn btn-ghost btn-lg" style="width:100%" href="https://github.com/patrickrb/FT8AF/releases" target="_blank" rel="noopener">
          ${DL_SVG}
          ${t('download.free.cta')}
        </a>
      </article>
      <article class="card price featured reveal" data-delay="80">
        <span class="price-flag mono">${t('download.paid.flag')}</span>
        <div class="price-top">
          <span class="pill amber"><span class="dot" style="background:var(--accent)"></span>${t('download.paid.tag')}</span>
          <div class="price-amt"><span class="mono">$3.50</span><span class="price-per">${t('download.paid.per')}</span></div>
        </div>
        <h3>${t('download.paid.title')}</h3>
        <p>${t('download.paid.body')}</p>
        <ul class="price-list">
${li('download.paid.li', 5, true)}
        </ul>
        <a class="btn btn-primary btn-lg" style="width:100%" href="https://play.google.com/store/apps/details?id=radio.ks3ckc.ft8af" target="_blank" rel="noopener">
          ${PLAY_SVG}
          ${t('download.paid.cta')}
        </a>
      </article>
    </div>
    <div class="callout amber reveal" style="margin-top:24px;max-width:880px;margin-left:auto;margin-right:auto">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.5"/></svg>
      <div>
        <h4>${t('download.callout.title')}</h4>
        <p>${t('download.callout.body')}</p>
      </div>
    </div>
  </div>
</section>

<!-- INSTALL METHODS -->
<section class="section" style="padding-top:48px">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="eyebrow">${t('download.methods.eyebrow')}</div>
      <h2 class="h-section">${t('download.methods.title')}</h2>
    </div>
    <div class="method-grid">
      <article class="card method reveal">
        <div class="m-ic">${DL_SVG}</div>
        <h3>${t('download.method.sideload.title')}</h3>
        <div class="m-sub">${t('download.method.sideload.sub')}</div>
        <ol class="steps">
${steps('download.method.sideload.steps', 3)}
        </ol>
        <a class="btn btn-ghost" style="width:100%" href="https://github.com/patrickrb/FT8AF/releases" target="_blank" rel="noopener">${t('download.method.sideload.cta')}</a>
      </article>

      <article class="card method cyan reveal" data-delay="80">
        <div class="m-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12"/></svg></div>
        <h3>${t('download.method.build.title')}</h3>
        <div class="m-sub">${t('download.method.build.sub')}</div>
        <div class="codeblock"><span class="c-dim">${t('download.method.build.codeComment')}</span>
git clone <span class="c-amber">…/FT8AF</span>
cd FT8AF/ft8cn
./gradlew installDebug</div>
        <a class="btn btn-ghost" style="width:100%" href="https://github.com/patrickrb/FT8AF" target="_blank" rel="noopener">${t('download.method.build.cta')}</a>
      </article>

      <article class="card method reveal" data-delay="160">
        <div class="m-ic">${PLAY_SVG}</div>
        <h3>${t('download.method.play.title')}</h3>
        <div class="m-sub">${t('download.method.play.sub')}</div>
        <ol class="steps">
${steps('download.method.play.steps', 3)}
        </ol>
        <a class="btn btn-primary" style="width:100%" href="https://play.google.com/store/apps/details?id=radio.ks3ckc.ft8af" target="_blank" rel="noopener">${t('download.method.play.cta')}</a>
      </article>
    </div>
  </div>
</section>

<!-- REQUIREMENTS -->
<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="eyebrow cyan">${t('download.req.eyebrow')}</div>
      <h2 class="h-section">${t('download.req.title')}</h2>
    </div>
    <div class="req-grid">
${reqCards}
    </div>
    <div class="callout reveal" style="margin-top:24px">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 11a8 8 0 0 1 13.5-5.7M7 11a5 5 0 0 1 8.5-3.6"/><circle cx="4" cy="20" r="2"/><path d="M4 18V14"/></svg>
      <div>
        <h4>${t('download.reqCallout.title')}</h4>
        <p>${t('download.reqCallout.body')}</p>
      </div>
    </div>
  </div>
</section>

<!-- DESKTOP PREVIEW -->
<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="eyebrow cyan">${t('download.desktop.eyebrow')}</div>
      <h2 class="h-section">${t('download.desktop.title')}</h2>
    </div>
    <div class="callout reveal" style="max-width:880px">
      ${DESKTOP_SVG}
      <div>
        <p style="margin:0 0 10px">${t('download.desktop.body')}</p>
        <p style="margin:0 0 14px;font-size:13px;color:var(--text-faint)">${t('download.desktop.note')}</p>
        <a class="btn btn-ghost" href="https://github.com/patrickrb/FT8AF/releases?q=desktop&amp;expanded=true" target="_blank" rel="noopener">
          ${DL_SVG}
          ${t('download.desktop.cta')}
        </a>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="section cta-band">
  <div class="wrap center">
    <h2 class="h-section reveal">${t('download.cta.title')}</h2>
    <p class="lede mx-auto reveal" data-delay="60" style="text-align:center;margin-top:14px">${t('download.cta.lede')}</p>
    <div class="hero-cta reveal" data-delay="120" style="justify-content:center;margin-top:28px">
      <a class="btn btn-ghost btn-lg" href="https://github.com/patrickrb/FT8AF/releases" target="_blank" rel="noopener">
        ${DL_SVG}
        ${t('download.cta.freeApk')}
      </a>
      <a class="btn btn-primary btn-lg" href="https://play.google.com/store/apps/details?id=radio.ks3ckc.ft8af" target="_blank" rel="noopener">
        ${PLAY_SVG}
        ${t('download.cta.playBtn')}
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
