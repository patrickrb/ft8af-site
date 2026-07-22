// Tests for the bug-report / feature-request form backend.
//   node --test test/
//
// Covers the pure logic (validation, subject/body building) and the Vercel
// handler end-to-end with an in-memory Request and a stubbed email transport —
// so nothing here touches the network.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeFields,
  validate,
  buildSubject,
  buildText,
  safeFilename,
  HONEYPOT,
} from '../api/_report-lib.js';
import { handle } from '../api/report.js';

// ─── helpers ───

// A normalized field object from a plain map (mirrors form.get()).
const fields = (map) => normalizeFields((n) => map[n]);

// Build a POST Request whose body is multipart form data.
function formRequest(map, files = []) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(map)) fd.append(k, v);
  for (const f of files) fd.append('images', f.blob, f.name);
  return new Request('http://localhost/api/report', { method: 'POST', body: fd });
}

const validBug = {
  type: 'bug',
  title: 'TX never keys up on 20m',
  details: 'Tapped CQ, the strip stayed on LISTENING.',
};

// ─── validation ───

test('validate accepts a complete bug report', () => {
  const r = validate(fields(validBug));
  assert.equal(r.ok, true);
  assert.equal(r.spam, false);
  assert.deepEqual(r.errors, []);
});

test('validate flags missing required fields', () => {
  const r = validate(fields({ type: '', title: '', details: '' }));
  assert.equal(r.ok, false);
  assert.deepEqual(r.errors.sort(), ['details', 'title', 'type']);
});

test('validate rejects an unknown type', () => {
  const r = validate(fields({ ...validBug, type: 'rant' }));
  assert.ok(r.errors.includes('type'));
});

test('validate flags a malformed email but allows a blank one', () => {
  assert.ok(validate(fields({ ...validBug, email: 'not-an-email' })).errors.includes('email'));
  assert.equal(validate(fields({ ...validBug, email: '' })).ok, true);
  assert.equal(validate(fields({ ...validBug, email: 'k1af@ft8af.app' })).ok, true);
});

test('validate treats a filled honeypot as spam', () => {
  const r = validate(fields({ ...validBug, [HONEYPOT]: 'http://spam.example' }));
  assert.equal(r.spam, true);
  assert.equal(r.ok, false);
});

// ─── email building ───

test('buildSubject tags the type', () => {
  assert.equal(buildSubject(fields(validBug)), '[Bug] TX never keys up on 20m');
  assert.equal(
    buildSubject(fields({ type: 'feature', title: 'Dark map tiles', details: 'x' })),
    '[Feature] Dark map tiles'
  );
});

test('buildText includes bug environment and omits empty fields', () => {
  const body = buildText(
    fields({ ...validBug, version: 'v1.2', source: 'github', radio: 'FT-891' })
  );
  assert.match(body, /What happened:/);
  assert.match(body, /FT8AF version: v1\.2/);
  assert.match(body, /Source: GitHub APK/);
  assert.match(body, /Radio: FT-891/);
  assert.doesNotMatch(body, /Device:/); // empty → omitted
  assert.doesNotMatch(body, /Steps to reproduce:/);
});

test('buildText renders feature-request sections instead of bug ones', () => {
  const body = buildText(
    fields({ type: 'feature', title: 'Grid overlay', details: 'Show grid lines', useCase: 'Easier SOTA' })
  );
  assert.match(body, /The idea:/);
  assert.match(body, /Problem it would solve:/);
  assert.doesNotMatch(body, /Environment:/);
});

test('safeFilename strips paths and unsafe characters', () => {
  assert.equal(safeFilename('../../etc/passwd'), 'passwd');
  assert.equal(safeFilename('my shot!.png'), 'my shot_.png');
  assert.equal(safeFilename(''), 'image');
});

// ─── handler ───

test('handler rejects non-POST', async () => {
  const res = await handle(new Request('http://localhost/api/report'), {});
  assert.equal(res.status, 405);
});

test('handler returns 422 for an invalid submission', async () => {
  const res = await handle(formRequest({ type: 'bug', title: '' }), { RESEND_API_KEY: 'x' });
  assert.equal(res.status, 422);
  const body = await res.json();
  assert.equal(body.ok, false);
  assert.equal(body.error, 'validation');
});

test('handler silently accepts spam without sending', async () => {
  let called = false;
  const res = await handle(
    formRequest({ ...validBug, [HONEYPOT]: 'x' }),
    { RESEND_API_KEY: 'x' },
    async () => { called = true; return new Response('{}', { status: 200 }); }
  );
  assert.equal(res.status, 200);
  assert.equal((await res.json()).ok, true);
  assert.equal(called, false);
});

test('handler returns 503 when email is not configured', async () => {
  const res = await handle(formRequest(validBug), {});
  assert.equal(res.status, 503);
  assert.equal((await res.json()).error, 'not_configured');
});

test('handler sends one email and reports success', async () => {
  const calls = [];
  const res = await handle(
    formRequest({ ...validBug, email: 'reid@example.com' }),
    { RESEND_API_KEY: 'test-key' },
    async (url, opts) => {
      calls.push({ url, opts });
      return new Response(JSON.stringify({ id: 'abc' }), { status: 200 });
    }
  );
  assert.equal(res.status, 200);
  assert.equal((await res.json()).ok, true);

  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /api\.resend\.com/);
  const payload = JSON.parse(calls[0].opts.body);
  assert.deepEqual(payload.to, ['k1af@ft8af.app']);
  assert.equal(payload.subject, '[Bug] TX never keys up on 20m');
  assert.equal(payload.reply_to, 'reid@example.com');
  assert.match(calls[0].opts.headers.Authorization, /Bearer test-key/);
});

test('handler attaches uploaded images', async () => {
  let payload;
  const png = new Blob([new Uint8Array([1, 2, 3, 4])], { type: 'image/png' });
  await handle(
    formRequest(validBug, [{ blob: png, name: 'screen.png' }]),
    { RESEND_API_KEY: 'k' },
    async (_url, opts) => {
      payload = JSON.parse(opts.body);
      return new Response('{}', { status: 200 });
    }
  );
  assert.equal(payload.attachments.length, 1);
  assert.equal(payload.attachments[0].filename, 'screen.png');
  assert.equal(payload.attachments[0].content, Buffer.from([1, 2, 3, 4]).toString('base64'));
});

test('handler surfaces a transport failure as 502', async () => {
  const res = await handle(formRequest(validBug), { RESEND_API_KEY: 'k' }, async () => {
    return new Response('nope', { status: 500 });
  });
  assert.equal(res.status, 502);
});

test('handler honors REPORT_TO / REPORT_FROM overrides', async () => {
  let payload;
  await handle(formRequest(validBug), {
    RESEND_API_KEY: 'k',
    REPORT_TO: 'triage@ft8af.app',
    REPORT_FROM: 'Bot <bot@ft8af.app>',
  }, async (_url, opts) => {
    payload = JSON.parse(opts.body);
    return new Response('{}', { status: 200 });
  });
  assert.deepEqual(payload.to, ['triage@ft8af.app']);
  assert.equal(payload.from, 'Bot <bot@ft8af.app>');
});
