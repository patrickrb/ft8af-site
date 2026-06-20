// "FT8 app for Android" comparison landing page.
//
// SEO landing page targeting the "FT8 app(s)" query. Honestly compares FT8AF to
// the other common FT8 apps (FT8CN on Android; WSJT-X and JTDX on the desktop).
// The comparison matrix is data-driven from the catalog: each row's `cells` are
// either the literal text shown in the cell, or the sentinels "yes" / "no" /
// "partial", which render as glyphs with localized labels.

const GH_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.48A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>';
const PLAY_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3.6 2.7 14.5 12 3.6 21.3a1 1 0 0 1-.6-.93V3.63a1 1 0 0 1 .6-.93Z"/><path d="m14.5 12 3.9-3.3 2.7 1.5a1.4 1.4 0 0 1 0 2.45l-2.7 1.5L14.5 12Z"/></svg>';

// Render a single matrix cell. Sentinels become glyphs with a localized label;
// anything else is shown verbatim (and HTML-escaped for safety).
function cell(value, t, isFt8af) {
  const strong = isFt8af ? 'font-weight:600;color:var(--text)' : 'color:var(--text-muted)';
  if (value === 'yes')
    return `<span aria-label="${t('compare.table.legendYes')}" title="${t('compare.table.legendYes')}" style="color:var(--status-confirmed);font-weight:700">✓</span>`;
  if (value === 'no')
    return `<span aria-label="${t('compare.table.legendNo')}" title="${t('compare.table.legendNo')}" style="color:var(--text-faint)">—</span>`;
  if (value === 'partial')
    return `<span aria-label="${t('compare.table.legendPartial')}" title="${t('compare.table.legendPartial')}" style="color:var(--accent)">~</span>`;
  return `<span style="${strong}">${esc(value)}</span>`;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default {
  ns: 'compare',
  route: 'ft8-app-for-android',
  out: 'ft8-app-for-android.html',
  styles: ['site', 'sections'],
  navActive: null,
  ogType: 'website',
  jsonld(t, ctx) {
    const home = 'https://ft8af.app' + (ctx.locale === 'en' ? '' : `/${ctx.locale}`) + '/';
    const here = 'https://ft8af.app' + (ctx.locale === 'en' ? '' : `/${ctx.locale}`) + '/ft8-app-for-android';
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'FT8AF', item: home },
        { '@type': 'ListItem', position: 2, name: t('compare.hero.title').replace(/<br\s*\/?>/g, ' '), item: here },
      ],
    }, null, 2);
  },
  main(t) {
    const cols = t('compare.table.cols'); // ["FT8AF", "FT8CN", "WSJT-X", "JTDX"]
    const rows = t('compare.table.rows');

    const head = cols
      .map((c, i) => {
        const hi = i === 0 ? 'background:rgba(255,175,94,0.08);color:var(--accent)' : 'color:var(--text-muted)';
        return `<th scope="col" style="text-align:center;padding:12px 14px;font-family:var(--font-mono);font-size:13px;border-bottom:1px solid var(--border-strong);${hi}">${esc(c)}</th>`;
      })
      .join('');

    const body = rows
      .map((r) => {
        const cells = r.cells
          .map((v, i) => {
            const hi = i === 0 ? 'background:rgba(255,175,94,0.05)' : '';
            return `<td style="text-align:center;padding:11px 14px;font-size:13.5px;border-bottom:1px solid var(--border);${hi}">${cell(v, t, i === 0)}</td>`;
          })
          .join('');
        return `      <tr>
        <th scope="row" style="text-align:left;padding:11px 16px 11px 4px;font-size:13.5px;font-weight:500;color:var(--text);border-bottom:1px solid var(--border)">${r.label}</th>
        ${cells}
      </tr>`;
      })
      .join('\n');

    const chooseCards = t('compare.choose.cards')
      .map(
        (c, i) => `      <article class="card reveal"${i ? ` data-delay="${i * 70}"` : ''}>
        <h3 style="margin:0 0 10px">${c.h}</h3>
        <p style="margin:0;color:var(--text-muted)">${c.p}</p>
      </article>`,
      )
      .join('\n');

    return `<!-- PAGE HERO -->
<header class="page-hero">
  <div class="wrap">
    <div class="eyebrow reveal">${t('compare.hero.eyebrow')}</div>
    <h1 class="reveal" data-delay="60">${t('compare.hero.title')}</h1>
    <p class="lede reveal" data-delay="120">${t('compare.hero.lede')}</p>
  </div>
</header>

<!-- INTRO -->
<section class="section-sm" style="padding-top:8px">
  <div class="wrap" style="max-width:760px">
    <p class="reveal" style="color:var(--text-muted);font-size:16px;line-height:1.7;margin:0 0 18px">${t('compare.intro.p1')}</p>
    <p class="reveal" data-delay="60" style="color:var(--text-muted);font-size:16px;line-height:1.7;margin:0">${t('compare.intro.p2')}</p>
  </div>
</section>

<!-- COMPARISON TABLE -->
<section class="section-sm" style="padding-top:24px">
  <div class="wrap reveal">
    <div style="overflow-x:auto;border:1px solid var(--border);border-radius:16px">
      <table style="width:100%;border-collapse:collapse;min-width:640px">
        <caption style="text-align:left;padding:16px 16px 4px;font-size:13px;color:var(--text-faint)">${t('compare.table.caption')}</caption>
        <thead>
          <tr>
            <th scope="col" style="text-align:left;padding:12px 16px 12px 4px;font-size:13px;color:var(--text-faint);border-bottom:1px solid var(--border-strong)">${t('compare.table.feature')}</th>
            ${head}
          </tr>
        </thead>
        <tbody>
${body}
        </tbody>
      </table>
    </div>
    <p class="mono" style="margin:14px 4px 0;font-size:11.5px;color:var(--text-faint);line-height:1.6">${t('compare.table.footnote')}</p>
  </div>
</section>

<!-- WHICH TO CHOOSE -->
<section class="section">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="eyebrow">${t('compare.choose.eyebrow')}</div>
      <h2 class="h-section">${t('compare.choose.title')}</h2>
    </div>
    <div class="feat-grid">
${chooseCards}
    </div>
  </div>
</section>

<!-- CTA -->
<section class="section cta-band">
  <div class="wrap center">
    <h2 class="h-section reveal">${t('compare.cta.title')}</h2>
    <p class="lede mx-auto reveal" data-delay="60" style="margin-top:16px;text-align:center">${t('compare.cta.lede')}</p>
    <div class="hero-cta reveal" data-delay="120" style="justify-content:center;margin-top:28px">
      <a class="btn btn-primary btn-lg" href="/download">
        ${GH_SVG}
        ${t('common.btn.downloadFt8af')}
      </a>
      <a class="btn btn-ghost btn-lg" href="https://play.google.com/store/apps/details?id=radio.ks3ckc.ft8af" target="_blank" rel="noopener">
        ${PLAY_SVG}
        $3.50 on Google Play
      </a>
    </div>
  </div>
</section>`;
  },
};
