// Vercel Function: POST /api/report
//
// Backs the bug-report / feature-request form (src/pages/report.mjs). Accepts a
// multipart submission, validates it, and sends exactly one email per submission
// to k1af@ft8af.app with any attached screenshots.
//
// Uses the web-standard handler signature (a Request in, a Response out) so
// `request.formData()` natively parses the multipart body and its file uploads —
// no extra dependencies. Email delivery goes through Resend's HTTP API; configure
// it with these environment variables in the Vercel project:
//   RESEND_API_KEY  (required to actually send — otherwise the form gets a clear
//                    "not configured" response and the page shows the fallbacks)
//   REPORT_TO       (optional, defaults to k1af@ft8af.app)
//   REPORT_FROM     (optional, defaults to "FT8AF Feedback <feedback@ft8af.app>")

import {
  normalizeFields,
  validate,
  buildSubject,
  buildText,
  buildHtml,
  safeFilename,
  LIMITS,
  DEFAULT_TO,
  DEFAULT_FROM,
} from './_report-lib.js';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

// Pull image uploads off the form, enforcing the count/size caps, and encode them
// for Resend (base64). Non-file and empty parts are ignored.
async function collectAttachments(form) {
  const parts = form.getAll('images').filter((v) => v && typeof v !== 'string' && v.size > 0);
  const attachments = [];
  let total = 0;
  for (const file of parts.slice(0, LIMITS.files)) {
    if (file.size > LIMITS.fileBytes) continue;
    if (total + file.size > LIMITS.totalBytes) break;
    total += file.size;
    const buf = Buffer.from(await file.arrayBuffer());
    attachments.push({
      filename: safeFilename(file.name),
      content: buf.toString('base64'),
      content_type: file.type || 'application/octet-stream',
    });
  }
  return attachments;
}

// Core handler, dependency-injected so it can be tested without env or network.
export async function handle(request, env = process.env, fetchImpl = globalThis.fetch) {
  if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  const fields = normalizeFields((name) => form.get(name));
  const result = validate(fields);

  // Silently accept honeypot hits so bots learn nothing.
  if (result.spam) return json({ ok: true });
  if (!result.ok) return json({ ok: false, error: 'validation', fields: result.errors }, 422);

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return json({ ok: false, error: 'not_configured' }, 503);

  const attachments = await collectAttachments(form);
  const payload = {
    from: env.REPORT_FROM || DEFAULT_FROM,
    to: [env.REPORT_TO || DEFAULT_TO],
    subject: buildSubject(fields),
    text: buildText(fields),
    html: buildHtml(fields),
  };
  if (attachments.length) payload.attachments = attachments;
  if (fields.email) payload.reply_to = fields.email;

  let res;
  try {
    res = await fetchImpl(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return json({ ok: false, error: 'send_failed' }, 502);
  }
  if (!res.ok) return json({ ok: false, error: 'send_failed' }, 502);

  return json({ ok: true });
}

export function POST(request) {
  return handle(request);
}

// Anything other than POST gets a clear 405.
export function GET() {
  return json({ ok: false, error: 'method_not_allowed' }, 405);
}
