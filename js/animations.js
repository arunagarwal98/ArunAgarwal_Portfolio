/* ===== experience-contact-3d.js ===== */
/* Experience + Contact 3D interactive enhancers.
   Presentation only. Attaches to existing markup. */
(function () {
  const init = () => {
    /* -------- number chips on experience nodes -------- */
    document.querySelectorAll('#experience .jn').forEach((n, i) => {
      const c = n.querySelector('.jn-c');
      if (c && !c.getAttribute('data-step')) c.setAttribute('data-step', String(i + 1).padStart(2, '0'));
    });

    /* -------- 3D tilt on hover (nodes + contact tiles) -------- */
    const tilt = (el, max = 10) => {
      let raf = 0;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 2 - 1;   // -1..1
        const y = ((e.clientY - r.top) / r.height) * 2 - 1;
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.setProperty('--rx', (-y * max).toFixed(2) + 'deg');
          el.style.setProperty('--ry', (x * max).toFixed(2) + 'deg');
        });
      };
      const onLeave = () => {
        cancelAnimationFrame(raf);
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
    };
    const isCoarse = matchMedia('(hover:none)').matches;
    if (!isCoarse) {
      document.querySelectorAll('#experience .jn').forEach((el) => tilt(el, 8));
      document.querySelectorAll('#contact .ctq').forEach((el) => tilt(el, 6));
    }

    /* -------- experience: mark active node when role-panel shows -------- */
    const nodes = document.querySelectorAll('#experience .jn');
    nodes.forEach((n) =>
      n.addEventListener('click', () => {
        nodes.forEach((x) => x.classList.remove('is-active'));
        n.classList.add('is-active');
      })
    );

    /* -------- contact: ripple + copy feedback -------- */
    document.querySelectorAll('#contact .ctq').forEach((btn) => {
      btn.addEventListener('pointerdown', (e) => {
        const r = btn.getBoundingClientRect();
        const d = Math.max(r.width, r.height);
        const s = document.createElement('span');
        s.className = 'ripple';
        s.style.width = s.style.height = d + 'px';
        s.style.left = e.clientX - r.left - d / 2 + 'px';
        s.style.top = e.clientY - r.top - d / 2 + 'px';
        btn.appendChild(s);
        setTimeout(() => s.remove(), 620);
      });
      const copyVal = btn.getAttribute('data-copy');
      if (copyVal) {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          try { await navigator.clipboard.writeText(copyVal); } catch {}
          const label = btn.querySelector('.ctq-t b');
          const orig = label ? label.textContent : '';
          btn.classList.add('copied');
          if (label) label.textContent = 'Copied ✓';
          setTimeout(() => {
            btn.classList.remove('copied');
            if (label) label.textContent = orig;
          }, 1600);
        });
      }
    });

    /* -------- contact: form field has-value class for floating label look -------- */
    document.querySelectorAll('#contact .cf-i').forEach((i) => {
      const wrap = i.closest('.cf-g');
      const sync = () => wrap && wrap.classList.toggle('has-value', !!i.value.trim());
      i.addEventListener('input', sync); sync();
    });

    /* -------- IST live clock (if not already ticking) -------- */
    const clock = document.getElementById('ct-clock');
    if (clock && !clock.dataset.ticking) {
      clock.dataset.ticking = '1';
      const pad = (n) => String(n).padStart(2, '0');
      const tick = () => {
        const d = new Date(Date.now() + 330 * 60000); // IST = UTC+5:30
        clock.textContent = pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
      };
      tick(); setInterval(tick, 30000);
    }
  };

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
;
/* ===== career-icons.js ===== */
/* Career timeline: swap emoji glyphs with clean inline SVG icons.
   Runs on load + observes re-renders. Idempotent. */
(function () {
  const ICONS = {
    // Notepad / freelance
    0: `<svg class="jn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3h9a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M6 7H4M6 12H4M6 17H4"/><path d="M10 8h5M10 12h5M10 16h3"/></svg>`,
    // Box / Amazon FBA
    1: `<svg class="jn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/><path d="M7.5 5.5l9 5"/></svg>`,
    // Globe / Yolk Media
    2: `<svg class="jn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/></svg>`,
    // Graduation cap / SabkiShiksha
    3: `<svg class="jn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/><path d="M22 10v6"/></svg>`,
    // Magnifier / ELK Dev
    4: `<svg class="jn-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M11 8a3 3 0 0 0-3 3"/></svg>`,
  };

  const inject = () => {
    document.querySelectorAll('#experience .jn').forEach((n) => {
      const idx = parseInt(n.getAttribute('data-role') || '-1', 10);
      const disk = n.querySelector('.jn-c');
      if (!disk || !ICONS[idx]) return;
      if (disk.querySelector('.jn-ic')) return;
      // Insert SVG before the emoji span (kept as fallback but hidden via CSS)
      disk.insertAdjacentHTML('afterbegin', ICONS[idx]);
    });
  };

  if (document.readyState !== 'loading') inject();
  else document.addEventListener('DOMContentLoaded', inject);
  [300, 900, 1800, 3000].forEach((t) => setTimeout(inject, t));

  const arm = () => {
    const t = document.querySelector('#experience');
    if (!t) { setTimeout(arm, 500); return; }
    new MutationObserver(() => inject()).observe(t, { childList: true, subtree: true });
  };
  arm();
})();
;
/* ===== career-scroll.js ===== */
/* Career timeline scroll animator:
   - Reveals each .jn with staggered layered 3D entry
   - Drives --jline-p (0..1) on .jpath-line based on scroll progress
   Presentation only. */
(function () {
  function init() {
    var timeline = document.getElementById('jtimeline');
    if (!timeline) return;
    var line = document.getElementById('jline');
    var nodes = timeline.querySelectorAll('.jn');
    if (!nodes.length) return;

    // Stagger reveal
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach(function (n) { io.observe(n); });

    // Scroll progress on line (0..1 as section crosses viewport)
    var raf = 0;
    function update() {
      var r = timeline.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var start = vh * 0.85;                       // begin when top enters 85%
      var end = vh * 0.25;                          // finish when top hits 25%
      var p = (start - r.top) / (start - end);
      if (p < 0) p = 0; else if (p > 1) p = 1;
      if (line) line.style.setProperty('--jline-p', p.toFixed(3));
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = 0; update(); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    // Safety: after 2.4s force-reveal any node still hidden (avoid empty look)
    setTimeout(function () {
      nodes.forEach(function (n) { n.classList.add('in'); });
      if (line && parseFloat(getComputedStyle(line).getPropertyValue('--jline-p') || '0') < 0.05) {
        line.style.setProperty('--jline-p', '1');
      }
    }, 2400);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
;
/* ===== career-carousel.js ===== */
/* Career carousel:
   - Snap-scroll horizontal card list
   - Detects centered card via IntersectionObserver on the track root
   - Marks that card .is-active and triggers a click so main.js updates
     the role-panel via its existing initExperienceTimeline() wiring.
   - Prev/Next arrows + pagination dots + keyboard support.
   Presentation only.
*/
(function () {
  function init() {
    var track = document.getElementById('jctrack');
    if (!track) return;
    var cards = Array.prototype.slice.call(track.querySelectorAll('.jc-card'));
    if (!cards.length) return;
    var dots = Array.prototype.slice.call(document.querySelectorAll('#jcdots .jc-dot'));
    var arrows = Array.prototype.slice.call(document.querySelectorAll('#experience .jc-arrow'));
    var activeIdx = -1;
    var suppressUntil = 0;

    function setActive(i, opts) {
      opts = opts || {};
      if (i < 0 || i >= cards.length || i === activeIdx) return;
      activeIdx = i;
      cards.forEach(function (c, k) { c.classList.toggle('is-active', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === i); });
      arrows.forEach(function (b) {
        var dir = parseInt(b.getAttribute('data-jc-dir'), 10);
        if (dir === -1) b.disabled = (i === 0);
        if (dir === 1)  b.disabled = (i === cards.length - 1);
      });
      // Sync legacy panel logic in main.js by dispatching a click on the card.
      // main.js listens on `.jn[data-role]` clicks — clicking opens the role
      // panel. We suppress its side-effect of scrolling the panel into view
      // by clearing the panel scroll target from happening during passive scroll.
      if (opts.dispatch !== false) {
        // Temporarily prevent the click from re-scrolling: main.js only scrolls
        // when the user *clicks* — a synthetic click still triggers it. So we
        // simulate via a custom event that main.js does NOT listen for, and
        // instead directly rebuild the panel using the exposed ROLES data.
        renderPanel(i);
      }
    }

    function renderPanel(i) {
      if (typeof window.buildRolePanel === 'function') {
        var panel = document.getElementById('role-panel');
        if (!panel) return;
        panel.innerHTML = window.buildRolePanel(i);
        panel.classList.add('open');
      } else if (window.ROLES && window.ROLES[i]) {
        // Fallback: main.js not yet loaded. Retry shortly.
        setTimeout(function () { renderPanel(i); }, 120);
      } else {
        // Last-resort: click the underlying node so main.js panel wiring runs.
        cards[i].click();
      }
    }

    // Scroll → active-card detection (throttled via rAF)
    var raf = 0;
    function detect() {
      raf = 0;
      if (Date.now() < suppressUntil) return;
      var tr = track.getBoundingClientRect();
      var center = tr.left + tr.width / 2;
      var best = 0, bestD = Infinity;
      for (var k = 0; k < cards.length; k++) {
        var r = cards[k].getBoundingClientRect();
        var d = Math.abs((r.left + r.width / 2) - center);
        if (d < bestD) { bestD = d; best = k; }
      }
      setActive(best);
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(detect); }
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Snap helper
    function scrollToIdx(i) {
      if (i < 0) i = 0; else if (i >= cards.length) i = cards.length - 1;
      var card = cards[i];
      var tr = track.getBoundingClientRect();
      var r = card.getBoundingClientRect();
      var delta = (r.left + r.width / 2) - (tr.left + tr.width / 2);
      suppressUntil = Date.now() + 650;
      track.scrollBy({ left: delta, behavior: 'smooth' });
      setActive(i);
    }

    // Prev / Next buttons
    arrows.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = parseInt(btn.getAttribute('data-jc-dir'), 10) || 1;
        scrollToIdx(activeIdx + dir);
      });
    });

    // Dots
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { scrollToIdx(i); });
    });

    // Card icons + editorial trading-card chrome
    var GLYPHS  = ['🔍','📦','🌐','🎓','🚀'];
    var TAGS    = ['Rare','Popular','Featured','Signature','Current'];
    var STATS   = [
      { l:'Clients',  v:'11+' },
      { l:'ASINs',    v:'50+' },
      { l:'Verticals',v:'3'   },
      { l:'Schemas',  v:'4'   },
      { l:'Stack',    v:'ELK' }
    ];
    var LIGHT_CARDS = { 1: true }; // yellow card uses dark text
    // SVG decoration shapes per card index (halftone rings, X, waves, orange gear, blob)
    var DECOS = [
      // 0: concentric rings (Nintendo pop)
      '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><circle cx="140" cy="60" r="80"/><circle cx="140" cy="60" r="60"/><circle cx="140" cy="60" r="40"/><circle cx="140" cy="60" r="20"/></svg>',
      // 1: diagonal stripes / X (Best Buy)
      '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="3"><path d="M-20 40L200 220M40 -20L220 200M-20 100L200 280M100 -20L280 200"/></svg>',
      // 2: fluid wave (Seamless Integration)
      '<svg viewBox="0 0 200 200" fill="currentColor"><path d="M20 60c30-40 70-40 100 0s70 40 100 0v160H20z" opacity=".55"/><path d="M0 110c30-30 70-30 100 10s70 30 100 0v100H0z" opacity=".9"/></svg>',
      // 3: orbit / crosshair (dark HAPE feel)
      '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="150" cy="55" r="70"/><circle cx="150" cy="55" r="4" fill="currentColor"/><path d="M40 55h220M150 -55v220" stroke-dasharray="2 6"/></svg>',
      // 4: blob wave (Develope card)
      '<svg viewBox="0 0 200 200" fill="currentColor"><path d="M0 130c40 30 80 -30 120 -10s60 -20 80 -40v120H0z" opacity=".55"/><path d="M0 160c30 -20 90 20 130 0s50 -30 70 -30v70H0z" opacity=".9"/></svg>'
    ];

    cards.forEach(function (card, i) {
      if (LIGHT_CARDS[i]) card.classList.add('jc-light');
      // Deco layer
      if (!card.querySelector('.jc-deco')) {
        var deco = document.createElement('div');
        deco.className = 'jc-deco';
        deco.setAttribute('aria-hidden','true');
        deco.innerHTML = DECOS[i] || DECOS[0];
        card.prepend(deco);
      }
      // Top strip: tag + eye
      if (!card.querySelector('.jc-top')) {
        var top = document.createElement('div');
        top.className = 'jc-top';
        top.innerHTML =
          '<span class="jc-tag">' + (TAGS[i] || 'Chapter') + '</span>' +
          '<span class="jc-eye" aria-hidden="true">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M8 7h9v9"/></svg>' +
          '</span>';
        card.prepend(top);
      }
      // Glyph
      if (!card.querySelector('.jc-glyph')) {
        var g = document.createElement('span');
        g.className = 'jc-glyph';
        g.setAttribute('aria-hidden','true');
        g.textContent = GLYPHS[i] || '✦';
        // Insert after top strip, before date
        var dateEl = card.querySelector('.jc-date');
        if (dateEl) card.insertBefore(g, dateEl);
        else card.appendChild(g);
        card.classList.add('has-glyph');
      }
      // Bottom stat strip
      if (!card.querySelector('.jc-foot')) {
        var foot = document.createElement('div');
        foot.className = 'jc-foot';
        var s = STATS[i] || { l:'Chapter', v:(i+1) };
        foot.innerHTML =
          '<div class="jc-stat"><b>' + s.v + '</b><span>' + s.l + '</span></div>' +
          '<div class="jc-stat jc-stat-accent" style="margin-left:auto;text-align:right"><b>0' + (i+1) + '/05</b><span>Chapter</span></div>' +
          '<span class="jc-dot-row" aria-hidden="true"><i></i></span>';
        card.appendChild(foot);
      }
    });

    // Detect touch/coarse pointers — on those, tap should open the modal
    // (via career-modal.js) rather than being intercepted here for centering.
    var isTouch = (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches);

    // Card hover / click / keyboard
    cards.forEach(function (card, i) {
      // HOVER (desktop only) centers the card and freezes auto-cycle
      if (!isTouch) {
        card.addEventListener('mouseenter', function () {
          isHover = true;
          if (activeIdx !== i) scrollToIdx(i);
        });
      }
      card.addEventListener('focusin', function () {
        isHover = true;
        if (activeIdx !== i) scrollToIdx(i);
      });
      // Do NOT intercept clicks — career-modal.js opens the detail modal.
      card.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); scrollToIdx(i + 1); cards[Math.min(i+1,cards.length-1)].focus(); }
        else if (e.key === 'ArrowLeft')  { e.preventDefault(); scrollToIdx(i - 1); cards[Math.max(i-1,0)].focus(); }
      });
    });

    // Drag-to-scroll
    var isDown = false, startX = 0, startLeft = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      isDown = true; startX = e.clientX; startLeft = track.scrollLeft;
      track.setPointerCapture && track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', function (e) {
      if (!isDown) return;
      track.scrollLeft = startLeft - (e.clientX - startX);
    });
    function endDrag() { isDown = false; }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', endDrag);

    // Initial: activate current role card (index 4) once in viewport
    var section = document.getElementById('experience');
    var started = false;
    var autoTimer = 0;
    var isHover = false;

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(function () {
        if (isHover) return;
        if (document.body.classList.contains('cm-open')) return; // modal open
        var next = (activeIdx + 1) % cards.length;
        scrollToIdx(next);
      }, 5000);
    }
    function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = 0; } }

    // Pause on hover / focus / touch — resume on leave
    ['mouseenter','focusin','touchstart'].forEach(function (ev) {
      track.addEventListener(ev, function(){ isHover = true; }, { passive: true });
    });
    ['mouseleave','focusout','touchend','touchcancel'].forEach(function (ev) {
      track.addEventListener(ev, function(){ isHover = false; }, { passive: true });
    });

    function startOnce() {
      if (started) return; started = true;
      requestAnimationFrame(function () {
        scrollToIdx(0);
        startAuto();
      });
    }
    if (section && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { startOnce(); if (!autoTimer) startAuto(); }
          else stopAuto();
        });
      }, { threshold: 0.35 }).observe(section);
    } else {
      startOnce();
    }
    setTimeout(startOnce, 2200);

  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
;
/* ===== career-modal.js ===== */
/* Career modal — accessible detail view for a selected career card.
   - Opens on click / Enter / Space on any .jc-card
   - Focus is trapped inside the dialog; Escape or backdrop closes it
   - Restores focus to the invoking card on close
   - Mobile: renders as a bottom drawer (see career-modal.css)
   - Pauses the carousel auto-cycle while open (via .cm-open on <body>)
*/
(function () {
  var GLYPHS = ['🔍','📦','⚙️','🎓','🚀'];

  function h(tag, attrs, html) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'class') el.className = attrs[k];
      else el.setAttribute(k, attrs[k]);
    }
    if (html != null) el.innerHTML = html;
    return el;
  }

  function buildRoot() {
    var root = h('div', {
      class: 'cm-root',
      id: 'career-modal',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'cm-title',
      'aria-describedby': 'cm-desc',
      'aria-hidden': 'true'
    });
    root.innerHTML =
      '<div class="cm-backdrop" data-cm-close="1" aria-hidden="true"></div>' +
      '<div class="cm-dialog" tabindex="-1" role="document">' +
        '<header class="cm-head">' +
          '<div class="cm-icon" aria-hidden="true"></div>' +
          '<div class="cm-head-text">' +
            '<div class="cm-date" aria-label="Role period"></div>' +
            '<h3 class="cm-title" id="cm-title"></h3>' +
            '<div class="cm-sub"></div>' +
          '</div>' +
          '<button type="button" class="cm-close" aria-label="Close role details (Escape)" data-cm-close="1">×</button>' +
        '</header>' +
        '<div class="cm-body">' +
          '<div class="cm-meta" aria-label="Company and location"></div>' +
          '<p class="cm-desc" id="cm-desc"></p>' +
          '<div class="cm-section-label" id="cm-ach-label">Key achievements</div>' +
          '<ul class="cm-points" aria-labelledby="cm-ach-label"></ul>' +
          '<div class="cm-section-label" id="cm-stack-label">Stack &amp; focus</div>' +
          '<div class="cm-tags" role="list" aria-labelledby="cm-stack-label"></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);
    return root;
  }

  var root, dialog, lastFocus = null, currentIdx = -1;

  function render(idx) {
    var roles = window.ROLES;
    if (!roles || !roles[idx]) return false;
    var r = roles[idx];
    var isCur = r.type === 'cur';

    dialog.querySelector('.cm-icon').textContent = GLYPHS[idx] || '✦';
    dialog.querySelector('.cm-date').textContent = r.date || '';
    dialog.querySelector('.cm-title').textContent = r.title || '';
    dialog.querySelector('.cm-sub').textContent = r.sub || '';
    dialog.querySelector('.cm-desc').textContent = r.desc || '';

    var meta = dialog.querySelector('.cm-meta');
    meta.innerHTML =
      (r.co ? '<span>🏢 ' + r.co + '</span>' : '') +
      (r.loc ? '<span>' + r.loc + '</span>' : '') +
      '<span class="cm-type ' + (isCur ? 'is-cur' : '') + '">' +
        (isCur ? '● Current role' : (r.type || '')) +
      '</span>';

    var ul = dialog.querySelector('.cm-points');
    ul.innerHTML = (r.points || []).map(function (p) { return '<li>' + p + '</li>'; }).join('');

    var tags = dialog.querySelector('.cm-tags');
    tags.innerHTML = (r.tags || []).map(function (t) {
      return '<span class="et ' + (t.c || '') + '" role="listitem">' + t.t + '</span>';
    }).join('');

    return true;
  }

  function focusable() {
    return Array.prototype.slice.call(
      dialog.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
  }

  function onKey(e) {
    if (!root.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      var f = focusable();
      if (!f.length) { e.preventDefault(); dialog.focus(); return; }
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function open(idx, invoker) {
    if (!render(idx)) return;
    currentIdx = idx;
    lastFocus = invoker || document.activeElement;
    root.setAttribute('aria-hidden', 'false');
    root.classList.add('is-open');
    document.body.classList.add('cm-lock', 'cm-open');
    // Focus the close button (safe first stop)
    setTimeout(function () {
      var c = dialog.querySelector('.cm-close');
      if (c) c.focus();
    }, 30);
    if (invoker && invoker.setAttribute) invoker.setAttribute('aria-expanded', 'true');
  }

  function close() {
    if (!root.classList.contains('is-open')) return;
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cm-lock', 'cm-open');
    // Reset any cards' aria-expanded
    var cards = document.querySelectorAll('.jc-card[aria-expanded="true"]');
    for (var i = 0; i < cards.length; i++) cards[i].setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) {
      try { lastFocus.focus({ preventScroll: true }); } catch (_) { lastFocus.focus(); }
    }
    currentIdx = -1;
  }

  function bindCards() {
    var cards = document.querySelectorAll('.jc-card');
    Array.prototype.forEach.call(cards, function (card) {
      // Ensure keyboard-reachable
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      if (!card.hasAttribute('role')) card.setAttribute('role', 'button');
      card.setAttribute('aria-haspopup', 'dialog');
      card.setAttribute('aria-controls', 'career-modal');

      // Rich, contextual aria-label from ROLES data so screen readers
      // announce "Open role details: <Title> at <Company>, <Date>".
      var roles = window.ROLES || [];
      var meta = roles[parseInt(card.getAttribute('data-role'), 10)];
      if (meta) {
        card.setAttribute(
          'aria-label',
          'Open role details: ' + meta.title + ' at ' + meta.co + ', ' + meta.date
        );
      }

      var idx = parseInt(card.getAttribute('data-role'), 10);
      // Use capture phase + stopImmediatePropagation so other listeners
      // (e.g. main.js openRole scroll-jump) don't fire alongside us.
      card.addEventListener('click', function (e) {
        if (e.button && e.button !== 0) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        open(idx, card);
      }, true);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          e.stopImmediatePropagation();
          open(idx, card);
        }
      }, true);
    });
  }

  function init() {
    if (document.querySelector('.cm-root')) return;
    root = buildRoot();
    dialog = root.querySelector('.cm-dialog');

    root.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.getAttribute && t.getAttribute('data-cm-close') === '1') close();
    });
    document.addEventListener('keydown', onKey);

    bindCards();
    // Expose for other scripts
    window.openCareerModal = open;
    window.closeCareerModal = close;
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
;
