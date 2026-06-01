/* FT8AF — shared site behavior */
(function () {
  'use strict';

  // ───── Mobile nav ─────
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.mobile-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        menu.classList.toggle('open');
      });
    }
  }

  // ───── Reveal on scroll ─────
  // Content is visible by default. We only ARM the hidden+animate behavior
  // once requestAnimationFrame fires, which proves the page is actually
  // painting (hidden/background iframes never paint, so content stays shown).
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length || !('IntersectionObserver' in window)) return;
    requestAnimationFrame(function () {
      document.documentElement.classList.add('js-reveal');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var d = en.target.getAttribute('data-delay');
            if (d) en.target.style.transitionDelay = d + 'ms';
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      els.forEach(function (e) { io.observe(e); });
      // Safety net: reveal everything shortly after, even if the observer
      // misses something.
      setTimeout(function () {
        els.forEach(function (e) { e.classList.add('in'); });
      }, 1600);
    });
  }

  // ───── Waterfall canvas renderer ─────
  // Renders a static FT8 waterfall: noise floor + vertical signal trails.
  function renderWaterfall(canvas) {
    var w = canvas.clientWidth || 360;
    var h = parseInt(canvas.getAttribute('data-h') || '320', 10);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // base gradient
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#04080f'); g.addColorStop(1, '#080d18');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    // noise floor
    var noise = ctx.createImageData(w, h);
    for (var i = 0; i < noise.data.length; i += 4) {
      var v = Math.random();
      var intensity = Math.pow(v, 4) * 60;
      noise.data[i] = intensity * 0.3;
      noise.data[i + 1] = intensity * 0.5;
      noise.data[i + 2] = intensity * 0.9;
      noise.data[i + 3] = 255;
    }
    ctx.putImageData(noise, 0, 0);

    // signal trails
    var sigs = [
      { freq: 1247, snr: -3 }, { freq: 832, snr: -8 }, { freq: 1684, snr: -14 },
      { freq: 1502, snr: -6 }, { freq: 918, snr: -12 }, { freq: 2104, snr: -2 },
      { freq: 421, snr: -16 }, { freq: 1830, snr: -9 }, { freq: 1320, snr: -11 },
      { freq: 2270, snr: -7 }, { freq: 560, snr: -13 }, { freq: 1955, snr: -5 }
    ];
    sigs.forEach(function (sig, k) {
      var x = (sig.freq / 3000) * w;
      var yStart = 16 + Math.floor(Math.random() * 50);
      var yEnd = Math.min(h - 4, 60 + k * (h / 14) + Math.random() * 24);
      var color = sig.snr >= -8 ? [255, 220, 100] : sig.snr >= -15 ? [120, 220, 255] : [80, 130, 220];
      var phase = Math.random() * Math.PI * 2;
      var streakW = 4;
      for (var y = yStart; y < yEnd; y++) {
        var wobble = Math.sin(y / 6 + phase) * 1.5;
        var cx = x + wobble;
        for (var dx = -streakW; dx <= streakW; dx++) {
          var px = Math.floor(cx + dx);
          if (px < 0 || px >= w) continue;
          var dist = Math.abs(dx);
          var alpha = Math.exp(-(dist * dist) / 4) * (0.8 + Math.random() * 0.2);
          ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + alpha + ')';
          ctx.fillRect(px, y, 1, 1);
        }
      }
    });

    // time grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
    for (var yy = 0; yy < h; yy += h / 4) {
      ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(w, yy); ctx.stroke();
    }
  }

  // ───── Spectrum strip ─────
  function renderSpectrum(canvas) {
    var w = canvas.clientWidth || 360;
    var h = parseInt(canvas.getAttribute('data-h') || '56', 10);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    var bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#0e131e'); bg.addColorStop(1, '#0a0f1a');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    var peaks = [180, 420, 560, 760, 920, 1190, 1320, 1500, 1680, 1830, 1950, 2100, 2270, 2420];
    var bars = Math.floor(w);
    for (var i = 0; i < bars; i++) {
      var x = (i / bars) * w;
      var freq = (i / bars) * 3000;
      var amp = 5 + Math.random() * 8;
      peaks.forEach(function (p) {
        var d = Math.abs(freq - p);
        if (d < 40) amp += Math.exp(-d * d / 200) * (25 + Math.random() * 15);
      });
      amp += Math.random() * 3;
      var bh = Math.min(amp, h - 6);
      var grad = ctx.createLinearGradient(0, h, 0, h - bh);
      grad.addColorStop(0, 'rgba(92,214,232,0.4)');
      grad.addColorStop(1, 'rgba(255,175,94,0.85)');
      ctx.fillStyle = grad;
      ctx.fillRect(x, h - bh, w / bars + 0.5, bh);
    }
  }

  function initCanvases() {
    document.querySelectorAll('canvas[data-waterfall]').forEach(renderWaterfall);
    document.querySelectorAll('canvas[data-spectrum]').forEach(renderSpectrum);
  }

  // ───── FAQ accordion ─────
  function initFaq() {
    document.querySelectorAll('.faq-q').forEach(function (q) {
      q.addEventListener('click', function () {
        var item = q.closest('.faq-item');
        item.classList.toggle('open');
      });
    });
  }

  // ───── Email form (demo) ─────
  function initForms() {
    document.querySelectorAll('form[data-signup]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        track('email_signup', { page: location.pathname });
        var done = f.querySelector('[data-signup-done]');
        var fields = f.querySelector('[data-signup-fields]');
        if (done && fields) { fields.style.display = 'none'; done.style.display = 'flex'; }
      });
    });
  }

  // ───── Vercel Analytics — custom events ─────
  // window.va is defined by /_vercel/insights/script.js; we stubbed a queue in <head>
  // so events fired before it loads aren't lost.
  function track(name, props) {
    if (typeof window.va !== 'function') return;
    try { window.va('event', Object.assign({ name: name }, props || {})); } catch (e) {}
  }

  function classifyLink(a) {
    var href = a.getAttribute('href') || '';
    if (!href) return null;
    if (/play\.google\.com\/store/i.test(href))                return 'buy_play_store';
    if (/github\.com\/patrickrb\/FT8AF\/releases/i.test(href)) return 'download_apk';
    if (/github\.com\/patrickrb\/FT8AF\/issues/i.test(href))   return 'github_issues';
    if (/github\.com\/patrickrb\/FT8AF/i.test(href))           return 'github_repo';
    if (/github\.com\/N0BOY\/FT8CN/i.test(href))               return 'github_ft8cn';
    if (/qrz\.com\//i.test(href))                              return 'qrz_profile';
    return null;
  }

  function initAnalytics() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a) return;
      var name = classifyLink(a);
      if (!name) return;
      track(name, {
        page: location.pathname,
        href: a.getAttribute('href'),
        label: (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
        cta: a.classList.contains('btn-primary') ? 'primary'
           : a.classList.contains('btn') ? 'secondary' : 'inline'
      });
    });
  }

  function init() {
    initNav(); initReveal(); initCanvases(); initFaq(); initForms(); initAnalytics();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(initCanvases, 220);
  });
})();
