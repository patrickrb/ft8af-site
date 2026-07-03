// Supported-radios page. The rig catalog lives in src/data/radios.mjs; this
// template just groups it by brand into chip rows. Model names are proper nouns
// (not translated); only the hero/intro/notes copy comes from the catalogs.
import { RADIO_GROUPS, RADIO_COUNT } from '../data/radios.mjs';

const GH_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.48A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>';
const INFO_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>';

export default {
  ns: 'radios',
  route: 'supported-radios',
  out: 'supported-radios.html',
  styles: ['site', 'sections'],
  navActive: 'radios',
  ogType: 'website',
  main(t) {
    const groups = RADIO_GROUPS.map((g) => {
      const chips = g.models
        .map((m) => `      <div class="lang-card"><span class="lang-native">${m}</span></div>`)
        .join('\n');
      return `    <div class="faq-cat-title">${g.brand} · ${g.models.length}</div>
    <div class="lang-grid">
${chips}
    </div>`;
    }).join('\n\n');

    const lede = t('radios.hero.lede').replace('{count}', RADIO_COUNT);
    const intro = t('radios.intro');

    return `<header class="page-hero">
  <div class="wrap">
    <div class="eyebrow reveal">${t('radios.hero.eyebrow')}</div>
    <h1 class="reveal" data-delay="60">${t('radios.hero.title')}</h1>
    <p class="lede reveal" data-delay="120">${lede}</p>
  </div>
</header>

<section class="section-sm" style="padding-top:24px;padding-bottom:40px">
  <div class="wrap reveal" style="max-width:820px">
    <p style="color:var(--text-muted);font-size:15.5px;line-height:1.7;margin:0 0 8px">${intro}</p>

${groups}

    <div class="callout amber" style="margin-top:44px">
      ${INFO_SVG}
      <div>
        <h4>${t('radios.notlisted.title')}</h4>
        <p>${t('radios.notlisted.body')}</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="section cta-band">
  <div class="wrap center">
    <h2 class="h-section reveal">${t('radios.cta.title')}</h2>
    <div class="hero-cta reveal" data-delay="80" style="justify-content:center;margin-top:30px">
      <a class="btn btn-primary btn-lg" href="/download">${t('common.btn.downloadFt8af')}</a>
      <a class="btn btn-ghost btn-lg" href="https://github.com/patrickrb/FT8AF/issues" target="_blank" rel="noopener">
        ${GH_SVG}
        ${t('radios.cta.request')}
      </a>
    </div>
  </div>
</section>`;
  },
};
