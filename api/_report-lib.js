// Pure, framework-agnostic logic for the bug-report / feature-request form.
//
// Kept separate from the Vercel handler (api/report.js) so it can be unit-tested
// with `node --test` — no request/response, no network. The handler wires this to
// `request.formData()` and the email transport. The leading underscore keeps this
// file out of Vercel's route table (it is imported, never served).

export const TYPES = ['bug', 'feature'];

// Allowed values for the "where did you get FT8AF" select on a bug report.
export const SOURCES = ['github', 'play', 'source', 'other'];

// The one destination for every submission — a form fill produces one email here.
export const DEFAULT_TO = 'k1af@ft8af.app';
export const DEFAULT_FROM = 'FT8AF Feedback <feedback@ft8af.app>';

// Guardrails. Text is truncated (not rejected) so a slightly-too-long paste still
// gets through; attachments over the caps are dropped by the handler.
export const LIMITS = {
  title: 200,
  line: 2000,
  block: 8000,
  files: 5,
  fileBytes: 5 * 1024 * 1024, // 5 MB per image
  totalBytes: 9 * 1024 * 1024, // ~9 MB total (under Vercel's request-body ceiling)
};

// Name of the honeypot field. Real users never see it (CSS-hidden); bots that
// autofill every input trip it, and we silently drop the submission.
export const HONEYPOT = 'website';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Collapse a raw form value to a trimmed, length-capped string.
function clean(v, max) {
  if (typeof v !== 'string') return '';
  const s = v.replace(/\r\n/g, '\n').trim();
  return max && s.length > max ? s.slice(0, max) : s;
}

// Build the normalized field object from a `get(name) => value` accessor. Works
// with a real FormData (`(n) => form.get(n)`) or a plain object in tests.
export function normalizeFields(get) {
  const g = (n) => {
    const v = get(n);
    return typeof v === 'string' ? v : '';
  };
  let type = clean(g('type'), 20).toLowerCase();
  if (!TYPES.includes(type)) type = '';

  let source = clean(g('source'), 20).toLowerCase();
  if (!SOURCES.includes(source)) source = '';

  return {
    type,
    title: clean(g('title'), LIMITS.title),
    details: clean(g('details'), LIMITS.block),
    steps: clean(g('steps'), LIMITS.block),
    expected: clean(g('expected'), LIMITS.line),
    actual: clean(g('actual'), LIMITS.line),
    useCase: clean(g('useCase'), LIMITS.block),
    version: clean(g('version'), LIMITS.line),
    source,
    android: clean(g('android'), LIMITS.line),
    device: clean(g('device'), LIMITS.line),
    radio: clean(g('radio'), LIMITS.line),
    cable: clean(g('cable'), LIMITS.line),
    callsign: clean(g('callsign'), 40),
    email: clean(g('email'), 200),
    honeypot: clean(g(HONEYPOT), 200),
  };
}

// Validate a normalized field object.
//   { ok: boolean, errors: string[], spam: boolean }
// `spam` short-circuits the handler into a silent 200 so bots get no signal.
export function validate(f) {
  if (f.honeypot) return { ok: false, errors: [], spam: true };

  const errors = [];
  if (!TYPES.includes(f.type)) errors.push('type');
  if (!f.title) errors.push('title');
  if (!f.details) errors.push('details');
  if (f.email && !EMAIL_RE.test(f.email)) errors.push('email');

  return { ok: errors.length === 0, errors, spam: false };
}

const LABEL = { bug: 'Bug report', feature: 'Feature request' };
const SOURCE_LABEL = {
  github: 'GitHub APK',
  play: 'Google Play',
  source: 'Built from source',
  other: 'Other / not sure',
};

export function buildSubject(f) {
  const tag = f.type === 'bug' ? 'Bug' : 'Feature';
  return `[${tag}] ${f.title}`.slice(0, LIMITS.title + 10);
}

// Plain-text email body. Only the sections relevant to the chosen type are
// included, and empty optional fields are omitted so the email stays tidy.
export function buildText(f) {
  const out = [];
  const push = (label, value) => {
    if (value) out.push(`${label}:\n${value}\n`);
  };

  out.push(`New ${LABEL[f.type] || 'submission'} via the FT8AF web form.\n`);
  out.push(`Title: ${f.title}\n`);

  if (f.type === 'bug') {
    push('What happened', f.details);
    push('Steps to reproduce', f.steps);
    push('Expected result', f.expected);
    push('Actual result', f.actual);

    const env = [
      f.version && `FT8AF version: ${f.version}`,
      f.source && `Source: ${SOURCE_LABEL[f.source]}`,
      f.android && `Android version: ${f.android}`,
      f.device && `Device: ${f.device}`,
      f.radio && `Radio: ${f.radio}`,
      f.cable && `Cable: ${f.cable}`,
    ].filter(Boolean);
    if (env.length) out.push(`Environment:\n${env.join('\n')}\n`);
  } else {
    push('The idea', f.details);
    push('Problem it would solve', f.useCase);
  }

  const contact = [
    f.callsign && `Callsign: ${f.callsign}`,
    f.email ? `Reply-to: ${f.email}` : 'Reply-to: (none provided)',
  ].filter(Boolean);
  out.push(`Contact:\n${contact.join('\n')}\n`);

  return out.join('\n').trim() + '\n';
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// HTML email body — the plain text wrapped in a <pre> so line breaks survive and
// nothing user-supplied is interpreted as markup.
export function buildHtml(f) {
  return `<pre style="font:14px/1.5 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap;word-break:break-word">${esc(
    buildText(f)
  )}</pre>`;
}

// Strip any path and unsafe characters from an uploaded file name.
export function safeFilename(name) {
  const base = String(name || 'image').split(/[\\/]/).pop() || 'image';
  const cleaned = base.replace(/[^\w.\- ]+/g, '_').slice(0, 100).trim();
  return cleaned || 'image';
}
