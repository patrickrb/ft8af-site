// Wiki index page.
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
const DISCORD_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>';

export default {
  ns: 'wiki',
  route: 'wiki',
  out: 'wiki.html',
  styles: ['site', 'sections', 'wiki'],
  navActive: 'wiki',
  ogType: 'website',
  main(t) {
    const li = (key, n) => [...Array(n)].map((_, i) => `          <li>${t(`${key}.${i}`)}</li>`).join('\n');
    return `<header class="page-hero">
  <div class="wrap">
    <div class="eyebrow reveal">${t('wiki.hero.eyebrow')}</div>
    <h1 class="reveal" data-delay="60">${t('wiki.hero.title')}</h1>
    <p class="lede reveal" data-delay="120">${t('wiki.hero.lede')}</p>
  </div>
</header>

<section class="section-sm" style="padding-top:24px">
  <div class="wrap">
    <div class="wiki-grid">

      <a class="card wiki-card reveal" href="/wiki/using">
        <div class="wiki-card-ic amber">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 6h16M4 12h12M4 18h16"/><circle cx="20" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>
        </div>
        <div class="wiki-card-eyebrow mono">${t('wiki.cards.using.eyebrow')}</div>
        <h2>${t('wiki.cards.using.title')}</h2>
        <p>${t('wiki.cards.using.body')}</p>
        <ul class="wiki-card-list">
${li('wiki.cards.using.li', 4)}
        </ul>
        <span class="wiki-card-cta">${t('wiki.cards.using.cta')}
          ${ARROW}
        </span>
      </a>

      <a class="card wiki-card cyan reveal" href="/wiki/bug-reports" data-delay="80">
        <div class="wiki-card-ic cyan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8 6a4 4 0 1 1 8 0v2H8z"/><path d="M5 11h14v6a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5z"/><path d="M5 14H3M21 14h-2M5 18H3M21 18h-2M12 13v9"/></svg>
        </div>
        <div class="wiki-card-eyebrow mono cyan">${t('wiki.cards.bug.eyebrow')}</div>
        <h2>${t('wiki.cards.bug.title')}</h2>
        <p>${t('wiki.cards.bug.body')}</p>
        <ul class="wiki-card-list cyan">
${li('wiki.cards.bug.li', 4)}
        </ul>
        <span class="wiki-card-cta cyan">${t('wiki.cards.bug.cta')}
          ${ARROW}
        </span>
      </a>

    </div>

    <div class="callout reveal" style="margin-top:36px;max-width:880px;margin-left:auto;margin-right:auto">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.5"/></svg>
      <div>
        <h4>${t('wiki.callout.title')}</h4>
        <p>${t('wiki.callout.body')}</p>
      </div>
    </div>
  </div>
</section>

<section class="section cta-band">
  <div class="wrap center">
    <h2 class="h-section reveal">${t('wiki.cta.title')}</h2>
    <p class="lede mx-auto reveal" data-delay="60" style="text-align:center;margin-top:14px">${t('wiki.cta.lede')}</p>
    <div class="hero-cta reveal" data-delay="120" style="justify-content:center;margin-top:28px">
      <a class="btn btn-primary btn-lg" href="https://github.com/patrickrb/FT8AF/issues/new" target="_blank" rel="noopener">${t('wiki.cta.openIssue')}</a>
      <a class="btn btn-ghost btn-lg" href="/faq">${t('wiki.cta.browseFaq')}</a>
      <a class="btn btn-ghost btn-lg" href="https://discord.gg/tz4spm5nWB" target="_blank" rel="noopener">
        ${DISCORD_SVG}
        ${t('common.btn.joinDiscord')}
      </a>
    </div>
  </div>
</section>`;
  },
};
