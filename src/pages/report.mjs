// Report a bug / request a feature — a web form that emails a single submission
// to the maintainers (POST /api/report), as an alternative to opening a GitHub
// issue. Structure/markup only; all copy lives in src/i18n. The form degrades to
// GitHub + email fallbacks without JavaScript, and the client enhancement lives
// in public/assets/ft8af.js (initReportForm).

const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 12l5 5 11-12"/></svg>';
const WARN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17v.5"/></svg>';
const GH_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.66.35-1.12.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.48A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>';
const INFO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.5"/></svg>';

// One <input>/<textarea> field. `req` marks it required (adds the aria + tag).
function field(t, { id, label, type = 'text', placeholder, hint, req, group, ph }) {
  const tag = req ? `<span class="rf-req">${t('report.form.required')}</span>` : `<span class="rf-opt">${t('report.form.optional')}</span>`;
  const attrs = `id="${id}" name="${id}"${req ? ' required aria-required="true"' : ''}${placeholder ? ` placeholder="${t(placeholder)}"` : ''}`;
  const control =
    type === 'textarea'
      ? `<textarea class="rf-control rf-textarea" ${attrs} rows="4"></textarea>`
      : `<input class="rf-control" type="${type}" ${attrs}${type === 'email' ? ' autocomplete="email"' : ''} />`;
  const hintEl = hint ? `\n        <p class="rf-hint">${t(hint)}</p>` : '';
  return `      <div class="rf-field"${group ? ` data-when="${group}"` : ''}>
        <label class="rf-label" for="${id}">${t(label)} ${tag}</label>${hintEl}
        ${control}
      </div>`;
}

export default {
  ns: 'report',
  route: 'report',
  out: 'report.html',
  styles: ['site', 'sections', 'report'],
  ogType: 'website',
  main(t) {
    const sourceOpts = [
      ['', 'report.form.sourceChoose'],
      ['github', 'report.form.sourceGithub'],
      ['play', 'report.form.sourcePlay'],
      ['source', 'report.form.sourceSource'],
      ['other', 'report.form.sourceOther'],
    ]
      .map(([v, k]) => `<option value="${v}"${v === '' ? ' selected' : ''}>${t(k)}</option>`)
      .join('\n          ');

    return `<header class="page-hero">
  <div class="wrap">
    <div class="eyebrow cyan reveal">${t('report.hero.eyebrow')}</div>
    <h1 class="reveal" data-delay="60">${t('report.hero.title')}</h1>
    <p class="lede reveal" data-delay="120">${t('report.hero.lede')}</p>
  </div>
</header>

<section class="section-sm" style="padding-top:8px">
  <div class="wrap report-layout">

    <form class="report-form card reveal" data-report action="/api/report" method="post" enctype="multipart/form-data"
      data-max-files="5" data-max-mb="9"
      data-sending="${t('report.form.submitting')}"
      data-msg-error="${t('report.status.errorBody')}"
      data-msg-config="${t('report.status.errorConfig')}"
      data-msg-network="${t('report.status.errorNetwork')}"
      data-msg-toobig="${t('report.status.tooBig')}">

      <fieldset class="rf-type">
        <legend class="rf-label">${t('report.form.typeLegend')}</legend>
        <div class="rf-seg">
          <label class="rf-seg-opt">
            <input type="radio" name="type" value="bug" checked />
            <span>${t('report.form.typeBug')}</span>
          </label>
          <label class="rf-seg-opt">
            <input type="radio" name="type" value="feature" />
            <span>${t('report.form.typeFeature')}</span>
          </label>
        </div>
      </fieldset>

${field(t, { id: 'title', label: 'report.form.titleLabel', placeholder: 'report.form.titlePlaceholder', req: true })}

${field(t, { id: 'details', label: 'report.form.detailsLabel', type: 'textarea', placeholder: 'report.form.detailsPlaceholder', req: true })}

      <!-- Bug-only fields -->
${field(t, { id: 'steps', label: 'report.form.stepsLabel', type: 'textarea', placeholder: 'report.form.stepsPlaceholder', group: 'bug' })}
      <div class="rf-row" data-when="bug">
${field(t, { id: 'expected', label: 'report.form.expectedLabel', placeholder: 'report.form.expectedPlaceholder' })}
${field(t, { id: 'actual', label: 'report.form.actualLabel', placeholder: 'report.form.actualPlaceholder' })}
      </div>

      <fieldset class="rf-env" data-when="bug">
        <legend class="rf-label">${t('report.form.envLegend')}</legend>
        <p class="rf-hint">${t('report.form.envHint')}</p>
        <div class="rf-row">
          <div class="rf-field">
            <label class="rf-label rf-label-sm" for="version">${t('report.form.versionLabel')}</label>
            <input class="rf-control" type="text" id="version" name="version" placeholder="${t('report.form.versionPlaceholder')}" />
          </div>
          <div class="rf-field">
            <label class="rf-label rf-label-sm" for="source">${t('report.form.sourceLabel')}</label>
            <select class="rf-control rf-select" id="source" name="source">
          ${sourceOpts}
            </select>
          </div>
        </div>
        <div class="rf-row">
          <div class="rf-field">
            <label class="rf-label rf-label-sm" for="android">${t('report.form.androidLabel')}</label>
            <input class="rf-control" type="text" id="android" name="android" placeholder="${t('report.form.androidPlaceholder')}" />
          </div>
          <div class="rf-field">
            <label class="rf-label rf-label-sm" for="device">${t('report.form.deviceLabel')}</label>
            <input class="rf-control" type="text" id="device" name="device" placeholder="${t('report.form.devicePlaceholder')}" />
          </div>
        </div>
        <div class="rf-row">
          <div class="rf-field">
            <label class="rf-label rf-label-sm" for="radio">${t('report.form.radioLabel')}</label>
            <input class="rf-control" type="text" id="radio" name="radio" placeholder="${t('report.form.radioPlaceholder')}" />
          </div>
          <div class="rf-field">
            <label class="rf-label rf-label-sm" for="cable">${t('report.form.cableLabel')}</label>
            <input class="rf-control" type="text" id="cable" name="cable" placeholder="${t('report.form.cablePlaceholder')}" />
          </div>
        </div>
      </fieldset>

      <!-- Feature-only fields -->
${field(t, { id: 'useCase', label: 'report.form.useCaseLabel', type: 'textarea', placeholder: 'report.form.useCasePlaceholder', group: 'feature' })}

      <div class="rf-field">
        <label class="rf-label" for="images">${t('report.form.imagesLabel')} <span class="rf-opt">${t('report.form.optional')}</span></label>
        <p class="rf-hint">${t('report.form.imagesHint')}</p>
        <input class="rf-file" type="file" id="images" name="images" accept="image/*" multiple />
        <ul class="rf-filelist" data-report-files></ul>
      </div>

      <div class="rf-row">
${field(t, { id: 'callsign', label: 'report.form.callsignLabel', placeholder: 'report.form.callsignPlaceholder' })}
${field(t, { id: 'email', label: 'report.form.emailLabel', type: 'email', placeholder: 'report.form.emailPlaceholder', hint: 'report.form.emailHint' })}
      </div>

      <!-- Honeypot: positioned off-screen; real users leave it blank, bots that
           autofill every field trip it and the submission is silently dropped. -->
      <div class="rf-hp">
        <label for="website">Website (leave this blank)</label>
        <input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
      </div>

      <div class="rf-actions">
        <button class="btn btn-primary btn-lg" type="submit" data-report-submit>${t('report.form.submit')}</button>
        <p class="rf-privacy">${t('report.form.privacy')}</p>
      </div>

      <div class="rf-note rf-ok" data-report-ok hidden>
        <span class="rf-note-ic">${CHECK}</span>
        <div>
          <h3>${t('report.status.successTitle')}</h3>
          <p>${t('report.status.successBody')}</p>
        </div>
      </div>
      <div class="rf-note rf-err" data-report-err hidden role="alert">
        <span class="rf-note-ic">${WARN}</span>
        <div>
          <h3>${t('report.status.errorTitle')}</h3>
          <p data-report-errmsg>${t('report.status.errorBody')}</p>
        </div>
      </div>

      <noscript>
        <div class="rf-note rf-err">
          <span class="rf-note-ic">${INFO}</span>
          <div>
            <h3>${t('report.noscript.title')}</h3>
            <p>${t('report.noscript.body')}</p>
          </div>
        </div>
      </noscript>
    </form>

    <aside class="report-aside reveal" data-delay="80">
      <div class="card rf-aside-card">
        <h2 class="rf-aside-h">${t('report.aside.title')}</h2>
        <p>${t('report.aside.body')}</p>
        <a class="btn btn-ghost" href="https://github.com/patrickrb/FT8AF/issues/new" target="_blank" rel="noopener">
          ${GH_SVG}
          ${t('report.aside.githubCta')}
        </a>
        <div class="callout" style="margin-top:22px">
          ${INFO}
          <div>
            <h4>${t('report.aside.tipsTitle')}</h4>
            <p>${t('report.aside.tipsBody')} <a href="/wiki/bug-reports">${t('report.aside.wikiLink')}</a></p>
          </div>
        </div>
      </div>
    </aside>

  </div>
</section>`;
  },
};
