// Home page.
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12l5 5 11-12"/></svg>';

// Feature-teaser cards: icon + accent live here, copy comes from the catalog.
const FEAT_ICONS = [
  { cls: 'amber', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19V9M9 19V5M14 19V11M19 19V7"/></svg>', delay: 0 },
  { cls: 'cyan', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg>', delay: 80 },
  { cls: 'amber', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="2"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13"/></svg>', delay: 160 },
  { cls: 'cyan', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z"/><path d="M9 9l2 2 4-4"/></svg>', delay: 40 },
  { cls: 'amber', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 11a8 8 0 0 1 13.5-5.7M7 11a5 5 0 0 1 8.5-3.6"/><circle cx="4" cy="20" r="2"/><path d="M4 18V14"/></svg>', delay: 120 },
  { cls: 'cyan', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19"/><path d="M9 8h6M9 12h4"/></svg>', delay: 200 },
  { cls: 'amber', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>', delay: 240 },
];

const GH_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.48A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>';
const PLAY_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3.6 2.7 14.5 12 3.6 21.3a1 1 0 0 1-.6-.93V3.63a1 1 0 0 1 .6-.93Z"/><path d="m14.5 12 3.9-3.3 2.7 1.5a1.4 1.4 0 0 1 0 2.45l-2.7 1.5L14.5 12Z"/></svg>';

function jsonld(t) {
  const meta = LOCALE_INLANG[t('__locale__')] || 'en-US';
  return `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ft8af.app#org",
      "name": "FT8AF",
      "url": "https://ft8af.app",
      "logo": "https://ft8af.app/assets/icon.svg",
      "sameAs": [
        "https://github.com/patrickrb/FT8AF",
        "https://discord.gg/tz4spm5nWB",
        "https://play.google.com/store/apps/details?id=radio.ks3ckc.ft8af"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://ft8af.app#website",
      "url": "https://ft8af.app",
      "name": "FT8AF",
      "publisher": {
        "@id": "https://ft8af.app#org"
      },
      "inLanguage": "${meta}"
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://ft8af.app#app",
      "name": "FT8AF",
      "applicationCategory": "UtilitiesApplication",
      "applicationSubCategory": "Amateur Radio",
      "operatingSystem": "Android 8.0 and later",
      "url": "https://ft8af.app",
      "downloadUrl": "https://github.com/patrickrb/FT8AF/releases",
      "softwareVersion": "1.x",
      "license": "https://www.gnu.org/licenses/gpl-3.0.html",
      "offers": [
        {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "name": "Free APK on GitHub"
        },
        {
          "@type": "Offer",
          "price": "3.50",
          "priceCurrency": "USD",
          "name": "Google Play"
        }
      ],
      "author": {
        "@id": "https://ft8af.app#org"
      },
      "description": ${JSON.stringify(t('index.appDescription'))},
      "screenshot": "https://ft8af.app/assets/og-image.png"
    }
  ]
}`;
}

// inLanguage tags for JSON-LD, keyed by locale.
const LOCALE_INLANG = {
  en: 'en-US', el: 'el-GR', es: 'es-ES', ja: 'ja-JP', fr: 'fr-FR', ru: 'ru-RU',
  zh: 'zh-CN', it: 'it-IT', pl: 'pl-PL', ko: 'ko-KR', nl: 'nl-NL', cs: 'cs-CZ',
  tr: 'tr-TR', id: 'id-ID', uk: 'uk-UA', ar: 'ar-AR',
};

export default {
  ns: 'index',
  route: '',
  out: 'index.html',
  styles: ['site', 'sections', 'phone'],
  navActive: 'home',
  ogType: 'website',
  jsonld: (t, ctx) => jsonld((k) => (k === '__locale__' ? ctx.locale : t(k))),
  main(t) {
    const featCards = FEAT_ICONS.map((ic, i) => {
      const d = ic.delay ? ` data-delay="${ic.delay}"` : '';
      return `      <article class="card feat reveal"${d}>
        <div class="feat-ic ${ic.cls}">${ic.svg}</div>
        <h3>${t(`index.features.cards.${i}.title`)}</h3>
        <p>${t(`index.features.cards.${i}.body`)}</p>
      </article>`;
    }).join('\n');

    return `<!-- ───────── HERO ───────── -->
<header class="hero section">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <div class="eyebrow">${t('index.hero.eyebrow')}</div>
      <h1 class="h-display">${t('index.hero.title')}</h1>
      <p class="lede" style="margin-top:22px">
        ${t('index.hero.lede')}
      </p>
      <div class="hero-cta">
        <a class="btn btn-primary btn-lg" href="/download">
          ${GH_SVG}
          ${t('index.hero.ctaGithub')}
        </a>
        <a class="btn btn-ghost btn-lg" href="https://play.google.com/store/apps/details?id=radio.ks3ckc.ft8af" target="_blank" rel="noopener">
          ${PLAY_SVG}
          ${t('index.hero.ctaPlay')}
        </a>
      </div>
      <div class="hero-meta">
        <span class="pill amber"><span class="dot" style="background:var(--accent)"></span>${t('index.hero.pillFree')}</span>
        <span class="hero-meta-sep">·</span>
        <span class="mono">GPL-3.0</span>
        <span class="hero-meta-sep">·</span>
        <span class="mono">${t('index.hero.pillFork')}</span>
      </div>
    </div>

    <!-- Phone + waterfall backdrop -->
    <div class="hero-device">
      <canvas class="hero-wf" data-waterfall data-h="520"></canvas>
      <div class="phone">
        <div class="phone-screen">
          <img class="phone-shot" src="/assets/screens/app-decode.png" alt="${t('index.hero.deviceAlt')}" />
        </div>
      </div>
    </div>
  </div>
</header>

<!-- ───────── TRUST STRIP ───────── -->
<section class="trust">
  <div class="wrap trust-inner">
    <div class="trust-item reveal"><span class="mono num">3</span><span class="lbl">${t('index.trust.modes')}</span></div>
    <div class="trust-item reveal" data-delay="60"><span class="mono num">75<span style="color:var(--text-faint)">+</span></span><span class="lbl">${t('index.trust.rigs')}</span></div>
    <div class="trust-item reveal" data-delay="120"><span class="mono num">POTA</span><span class="lbl">${t('index.trust.pota')}</span></div>
    <div class="trust-item reveal" data-delay="180"><span class="mono num">MAP</span><span class="lbl">${t('index.trust.map')}</span></div>
    <div class="trust-item reveal" data-delay="240"><span class="mono num">16</span><span class="lbl">${t('index.trust.langs')}</span></div>
  </div>
</section>

<!-- ───────── FEATURES TEASER ───────── -->
<section class="section" id="features">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="eyebrow">${t('index.features.eyebrow')}</div>
      <h2 class="h-section">${t('index.features.title')}</h2>
    </div>
    <div class="feat-grid">
${featCards}
    </div>
    <div class="center reveal" style="margin-top:44px">
      <a class="btn btn-ghost btn-lg" href="/features">${t('index.features.cta')}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </a>
    </div>
  </div>
</section>

<!-- ───────── PRICING ───────── -->
<section class="section" id="pricing" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head center reveal">
      <div class="eyebrow" style="justify-content:center">${t('index.pricing.eyebrow')}</div>
      <h2 class="h-section">${t('index.pricing.title')}</h2>
      <p class="lede mx-auto" style="margin-top:16px;text-align:center">${t('index.pricing.lede')}</p>
    </div>
    <div class="price-grid">
      <article class="card price reveal">
        <div class="price-top">
          <span class="pill cyan"><span class="dot" style="background:var(--signal)"></span>${t('index.pricing.free.tag')}</span>
          <div class="price-amt"><span class="mono">$0</span></div>
        </div>
        <h3>${t('index.pricing.free.title')}</h3>
        <p>${t('index.pricing.free.body')}</p>
        <ul class="price-list">
          <li>${t('index.pricing.free.li.0')}</li>
          <li>${t('index.pricing.free.li.1')}</li>
          <li>${t('index.pricing.free.li.2')}</li>
          <li>${t('index.pricing.free.li.3')}</li>
        </ul>
        <a class="btn btn-ghost btn-lg" style="width:100%" href="https://github.com/patrickrb/FT8AF" target="_blank" rel="noopener">
          ${GH_SVG}
          ${t('index.pricing.free.cta')}
        </a>
      </article>
      <article class="card price featured reveal" data-delay="80">
        <span class="price-flag mono">${t('index.pricing.paid.flag')}</span>
        <div class="price-top">
          <span class="pill amber"><span class="dot" style="background:var(--accent)"></span>${t('index.pricing.paid.tag')}</span>
          <div class="price-amt"><span class="mono">$3.50</span><span class="price-per">${t('index.pricing.paid.per')}</span></div>
        </div>
        <h3>${t('index.pricing.paid.title')}</h3>
        <p>${t('index.pricing.paid.body')}</p>
        <ul class="price-list">
          <li><strong>${t('index.pricing.paid.li.0')}</strong></li>
          <li>${t('index.pricing.paid.li.1')}</li>
          <li>${t('index.pricing.paid.li.2')}</li>
          <li>${t('index.pricing.paid.li.3')}</li>
        </ul>
        <a class="btn btn-primary btn-lg" style="width:100%" href="https://play.google.com/store/apps/details?id=radio.ks3ckc.ft8af" target="_blank" rel="noopener">
          ${PLAY_SVG}
          ${t('index.pricing.paid.cta')}
        </a>
      </article>
    </div>
    <p class="center mono price-note reveal">${t('index.pricing.note')} <a href="/faq" style="color:var(--signal)">${t('index.pricing.noteLink')}</a></p>
  </div>
</section>

<!-- ───────── ORIGIN STORY ───────── -->
<section class="section-sm story reveal">
  <div class="wrap story-inner">
    <div class="eyebrow cyan">${t('index.story.eyebrow')}</div>
    <p class="story-quote">
      ${t('index.story.quote')}
      <span style="color:var(--text-muted)">${t('index.story.quoteMuted')}</span>
    </p>
    <div class="story-by">
      <span class="mono">Patrick Burns · <a href="https://www.qrz.com/db/K1AF" target="_blank" rel="noopener" style="color:var(--accent)">K1AF</a></span>
      <span style="color:var(--text-dim)">·</span>
      <span class="mono">Reid · <a href="https://www.qrz.com/db/N0RC" target="_blank" rel="noopener" style="color:var(--accent)">N0RC</a></span>
    </div>
  </div>
</section>

<!-- ───────── CTA / EMAIL ───────── -->
<section class="section cta-band">
  <div class="wrap cta-grid">
    <div class="reveal">
      <div class="eyebrow">${t('index.cta.eyebrow')}</div>
      <h2 class="h-section">${t('index.cta.title')}</h2>
      <p class="lede" style="margin-top:14px">${t('index.cta.lede')}</p>
    </div>
    <div class="reveal" data-delay="80">
      <form class="signup card" data-signup>
        <div data-signup-fields class="signup-fields">
          <label class="signup-lbl mono">${t('index.cta.emailLabel')}</label>
          <div class="signup-row">
            <input type="email" required placeholder="${t('index.cta.emailPlaceholder')}" class="signup-input" />
            <button type="submit" class="btn btn-primary">${t('index.cta.submit')}</button>
          </div>
          <div class="signup-or">
            <span>${t('index.cta.or')}</span>
            <a href="https://github.com/patrickrb/FT8AF" target="_blank" rel="noopener">${t('index.cta.starRepo')}</a>
            <span>·</span>
            <a href="https://discord.gg/tz4spm5nWB" target="_blank" rel="noopener">${t('index.cta.joinDiscord')}</a>
          </div>
        </div>
        <div data-signup-done class="signup-done">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 12l5 5 11-12"/></svg>
          <span>${t('index.cta.done')} <span class="mono" style="color:var(--text-muted)">73!</span></span>
        </div>
      </form>
    </div>
  </div>
</section>`;
  },
};
