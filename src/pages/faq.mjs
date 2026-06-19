// FAQ page. One catalog entry per Q&A drives BOTH the visible accordion (HTML
// answer) and the JSON-LD FAQPage (answer with tags stripped to plain text).
const DISCORD_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>';

// Visible accordion grouping (category title key + ordered item ids).
const CATS = [
  { title: 'getting', ids: ['free', 'paid', 'playLink', 'install'] },
  { title: 'radios', ids: ['radios', 'cable', 'noRadio', 'bands'] },
  { title: 'modes', ids: ['modes', 'pota', 'map', 'logging'] },
  { title: 'project', ids: ['ft8cn', 'languages', 'who', 'contribute', 'updates'] },
];
// JSON-LD order (curated; omits the "map" item, matching the original page).
const JSONLD_ORDER = ['free', 'paid', 'playLink', 'install', 'radios', 'modes', 'pota', 'logging', 'cable', 'noRadio', 'bands', 'ft8cn', 'languages', 'who', 'contribute', 'updates'];

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export default {
  ns: 'faq',
  route: 'faq',
  out: 'faq.html',
  styles: ['site', 'sections'],
  navActive: 'faq',
  ogType: 'website',
  jsonld(t, ctx) {
    const base = 'https://ft8af.app' + (ctx.locale === 'en' ? '' : `/${ctx.locale}`) + '/faq';
    const mainEntity = JSONLD_ORDER.map((id) => ({
      '@type': 'Question',
      name: stripTags(t(`faq.items.${id}.q`)),
      acceptedAnswer: { '@type': 'Answer', text: stripTags(t(`faq.items.${id}.a`)) },
    }));
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${base}#faqpage`,
      mainEntity,
    }, null, 2);
  },
  main(t) {
    let first = true;
    const cats = CATS.map((cat) => {
      const items = cat.ids.map((id) => {
        const open = first ? ' open' : '';
        first = false;
        return `      <div class="faq-item${open}">
        <button class="faq-q">${t(`faq.items.${id}.q`)}<span class="fi"></span></button>
        <div class="faq-a"><div class="faq-a-inner">${t(`faq.items.${id}.a`)}</div></div>
      </div>`;
      }).join('\n');
      return `    <div class="faq-cat-title">${t(`faq.cats.${cat.title}`)}</div>
    <div class="faq-cats">
${items}
    </div>`;
    }).join('\n\n');

    return `<header class="page-hero">
  <div class="wrap">
    <div class="eyebrow reveal">${t('faq.hero.eyebrow')}</div>
    <h1 class="reveal" data-delay="60">${t('faq.hero.title')}</h1>
    <p class="lede reveal" data-delay="120">${t('faq.hero.lede')}</p>
  </div>
</header>

<section class="section-sm" style="padding-top:24px;padding-bottom:96px">
  <div class="wrap faq-wrap reveal">

${cats}

  </div>
</section>

<!-- CTA -->
<section class="section cta-band">
  <div class="wrap center">
    <h2 class="h-section reveal">${t('faq.cta.title')}</h2>
    <div class="hero-cta reveal" data-delay="80" style="justify-content:center;margin-top:28px">
      <a class="btn btn-primary btn-lg" href="/download">${t('common.btn.downloadFt8af')}</a>
      <a class="btn btn-ghost btn-lg" href="https://github.com/patrickrb/FT8AF/issues" target="_blank" rel="noopener">${t('faq.cta.ask')}</a>
      <a class="btn btn-ghost btn-lg" href="https://discord.gg/tz4spm5nWB" target="_blank" rel="noopener">
        ${DISCORD_SVG}
        ${t('common.btn.joinDiscord')}
      </a>
    </div>
  </div>
</section>`;
  },
};
