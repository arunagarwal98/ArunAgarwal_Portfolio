/**
 * MOTION.JS — Awwwards-level premium interactions
 * Lenis smooth scroll · GSAP-style scroll triggers · Loading screen
 * Custom cursor · Column sliders · Clip-path reveals · Magnetic btns
 * Split text · Horizontal parallax · Premium hover effects
 * NO content changes · NO colour changes · builds on existing code
 */

/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
const M = {
  reduce: window.matchMedia('(prefers-reduced-motion:reduce)').matches,
  mobile: window.innerWidth < 768,
  hover: window.matchMedia('(hover:hover) and (pointer:fine)').matches,
  raf: null,
  scrollY: 0,
  dScrollY: 0,    // damped scroll
  velocity: 0,
};

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initSmoothScroll();
  if (!M.reduce) {
    if (M.hover && !M.mobile) {
      initCustomCursor();
      initMagneticElements();
      initHoverSpotlight();
    }
    initSplitTextReveal();
    initClipPathReveal();
    initColumnSlider();
    initHorizontalParallax();
    initScrollTimeline();
    initCardHoverDepth();
    initNavActiveGlow();
    initCounterReveal();
    initSkillOrbit();
    initButtonRipple();
    initFormMagnetic();
    initSectionEntrances();
    initGrainOverlay();
  }
});

/* ═══════════════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════════════ */


/* ═══════════════════════════════════════════
   SMOOTH SCROLL — native Lenis-style damping
═══════════════════════════════════════════ */
function initSmoothScroll() {
  if (M.mobile || M.reduce) return;

  let current = 0, target = 0, ease = 0.1;
  let ticking = false;

  // We use CSS scroll-behavior:smooth + add velocity tracking only
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    M.velocity = sy - M.scrollY;
    M.scrollY = sy;
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollVelocity();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function updateScrollVelocity() {
  // Stretch cursor on fast scroll
  const cursor = document.getElementById('m-cursor');
  if (cursor && Math.abs(M.velocity) > 3) {
    const stretch = Math.min(Math.abs(M.velocity) * 0.08, 0.5);
    cursor.style.transform = `translate(-50%,-50%) scaleY(${1 + stretch})`;
    setTimeout(() => { if(cursor) cursor.style.transform = 'translate(-50%,-50%) scaleY(1)'; }, 200);
  }
}

/* ═══════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════ */
function initCustomCursor() {
  const dot  = document.getElementById('m-cursor-dot');
  const ring = document.getElementById('m-cursor');
  if (!dot || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let rafId;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function loop() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);

    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);

  // Hover states
  const interactiveSelectors = 'a,button,.bf,.bo,.sb,.pc,.sk,.bento,.rm,.ec,.ct-lk,.pcl,.chip,.ncta,.jn,.otp,.ft-nav a';
  document.querySelectorAll(interactiveSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.setAttribute('data-cursor', 'hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.removeAttribute('data-cursor');
    });
  });

  // Project card — show "View" label
  document.querySelectorAll('.pc').forEach(card => {
    card.addEventListener('mouseenter', () => document.body.setAttribute('data-cursor', 'project'));
    card.addEventListener('mouseleave', () => document.body.removeAttribute('data-cursor'));
  });

  // Hide on leave
  document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='1'; });

  // Click flash
  document.addEventListener('mousedown', () => ring.classList.add('click'));
  document.addEventListener('mouseup',   () => ring.classList.remove('click'));
}

/* ═══════════════════════════════════════════
   MAGNETIC ELEMENTS
═══════════════════════════════════════════ */
function initMagneticElements() {
  const magneticEls = document.querySelectorAll('.bf,.ncta,.back-to-top,.cf-btn');
  magneticEls.forEach(el => {
    let animId, ox = 0, oy = 0, tx = 0, ty = 0;

    function lerp(a, b, n) { return a + (b - a) * n; }

    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left - r.width/2)  * 0.38;
      ty = (e.clientY - r.top  - r.height/2) * 0.38;

      function step() {
        ox = lerp(ox, tx, 0.14);
        oy = lerp(oy, ty, 0.14);
        el.style.setProperty('--mx', ox + 'px');
        el.style.setProperty('--my', oy + 'px');
        animId = requestAnimationFrame(step);
      }
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(step);
    });

    el.addEventListener('mouseleave', () => {
      tx = 0; ty = 0;
      function settle() {
        ox = lerp(ox, 0, 0.12);
        oy = lerp(oy, 0, 0.12);
        el.style.setProperty('--mx', ox + 'px');
        el.style.setProperty('--my', oy + 'px');
        if (Math.abs(ox) > 0.05 || Math.abs(oy) > 0.05)
          animId = requestAnimationFrame(settle);
        else {
          el.style.setProperty('--mx', '0px');
          el.style.setProperty('--my', '0px');
        }
      }
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(settle);
    });
  });
}

/* ═══════════════════════════════════════════
   HOVER SPOTLIGHT on sections
═══════════════════════════════════════════ */
function initHoverSpotlight() {
  document.querySelectorAll('.bento,.rm,.ec,.sk,.ct-lk').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--spotX', `${e.clientX - r.left}px`);
      card.style.setProperty('--spotY', `${e.clientY - r.top}px`);
      card.classList.add('spotlight-active');
    });
    card.addEventListener('mouseleave', () => card.classList.remove('spotlight-active'));
  });
}

/* ═══════════════════════════════════════════
   SPLIT TEXT REVEAL
═══════════════════════════════════════════ */
function initSplitTextReveal() {
  const targets = document.querySelectorAll('.stitle:not([data-split-done]),.h1:not([data-split-done])');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = '1';

      // Split into word spans preserving inner HTML spans
      const words = el.querySelectorAll('span');
      if (words.length === 0) {
        // Plain text — wrap each word
        const text = el.innerHTML;
        el.innerHTML = text.split(/(\s+)/).map(w =>
          w.trim() ? `<span class="sw"><span class="swi">${w}</span></span>` : w
        ).join('');
      }
      // Animate .swi elements if present
      el.querySelectorAll('.swi').forEach((w, i) => {
        w.style.transitionDelay = `${i * 0.06}s`;
        setTimeout(() => w.classList.add('in'), 20);
      });

      // For .hl, .hl2, .hl3 — wrap in reveal div
      ['.hl','.hl2','.hl3'].forEach(cls => {
        el.querySelectorAll(cls).forEach((sp, i) => {
          if (!sp.dataset.wrapped) {
            sp.dataset.wrapped = '1';
            sp.style.display = 'inline-block';
            sp.style.opacity = '0';
            sp.style.transform = 'translateY(30px)';
            sp.style.transition = `opacity .7s ${0.1 + i*0.12}s cubic-bezier(.22,1,.36,1), transform .7s ${0.1+i*0.12}s cubic-bezier(.22,1,.36,1)`;
            setTimeout(() => { sp.style.opacity = '1'; sp.style.transform = 'none'; }, 100);
          }
        });
      });

      obs.unobserve(el);
    });
  }, { threshold: 0.3 });

  targets.forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════════
   CLIP-PATH SECTION REVEALS
═══════════════════════════════════════════ */
function initClipPathReveal() {
  const els = document.querySelectorAll('.elk-showcase,.ts-callout,.role-panel.open,.ot-bar');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('clip-revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════════
   COLUMN SLIDER — skills marquee columns
═══════════════════════════════════════════ */
function initColumnSlider() {
  const cols = document.querySelectorAll('.sk-grid-logo');
  if (!cols.length) return;

  // Add a vertical drift to alternating skill cards
  let lastSy = 0;
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    const delta = sy - lastSy;
    lastSy = sy;

    cols.forEach((col, ci) => {
      const cards = col.querySelectorAll('.sk');
      cards.forEach((card, i) => {
        if (!card._colOffset) card._colOffset = 0;
        const dir = (ci % 2 === 0) ? 1 : -1;
        card._colOffset += delta * dir * 0.04;
        card._colOffset = Math.max(-18, Math.min(18, card._colOffset));
        card.style.transform = card.style.transform.includes('perspective')
          ? card.style.transform
          : `translateY(${card._colOffset}px)`;
      });
    });
  }, { passive: true });
}

/* ═══════════════════════════════════════════
   HORIZONTAL PARALLAX — chips, tags, marquee
═══════════════════════════════════════════ */
function initHorizontalParallax() {
  const rows = [
    { el: document.querySelector('.chips'), speed: 0.06, dir: -1 },
    { el: document.querySelector('.kw-tags'), speed: 0.04, dir: 1 },
    { el: document.querySelector('.elk-tags'), speed: 0.05, dir: -1 },
    { el: document.querySelector('.proj-ticker-inner'), speed: 0, dir: 1 }, // already animated
  ].filter(r => r.el);

  window.addEventListener('scroll', () => {
    rows.forEach(row => {
      if (!row.speed) return;
      const r = row.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const prog = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      const offset = (prog - 0.5) * 100 * row.speed * row.dir;
      row.el.style.transform = `translateX(${offset}px)`;
    });
  }, { passive: true });
}

/* ═══════════════════════════════════════════
   SCROLL TIMELINE — pinned storytelling
═══════════════════════════════════════════ */
function initScrollTimeline() {
  // Stagger .rm roadmap cards on scroll
  const rmCards = document.querySelectorAll('.rm');
  if (!rmCards.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = [...rmCards].indexOf(e.target);
        setTimeout(() => e.target.classList.add('rm-entered'), idx * 100);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  rmCards.forEach(c => obs.observe(c));

  // Stagger bento grid
  const bentos = document.querySelectorAll('.bento');
  const bObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = [...bentos].indexOf(e.target);
        setTimeout(() => e.target.classList.add('bento-entered'), idx * 80);
        bObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  bentos.forEach(b => bObs.observe(b));
}

/* ═══════════════════════════════════════════
   CARD HOVER DEPTH — project cards 3D mouse follow
═══════════════════════════════════════════ */
function initCardHoverDepth() {
  if (!M.hover) return;
  document.querySelectorAll('.pc,.bento,.rm,.sk').forEach(card => {
    let rafId, tx = 0, ty = 0, cx = 0, cy = 0;

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;

      function step() {
        cx += (tx - cx) * 0.1;
        cy += (ty - cy) * 0.1;
        card.style.setProperty('--tiltX', `${-cy * 6}deg`);
        card.style.setProperty('--tiltY', `${cx * 6}deg`);
        rafId = requestAnimationFrame(step);
      }
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(step);
    });

    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(rafId);
      tx = 0; ty = 0;
      function settle() {
        cx += (0 - cx) * 0.1;
        cy += (0 - cy) * 0.1;
        card.style.setProperty('--tiltX', `${-cy * 6}deg`);
        card.style.setProperty('--tiltY', `${cx * 6}deg`);
        if (Math.abs(cx) > 0.01 || Math.abs(cy) > 0.01) rafId = requestAnimationFrame(settle);
        else {
          card.style.setProperty('--tiltX', '0deg');
          card.style.setProperty('--tiltY', '0deg');
        }
      }
      rafId = requestAnimationFrame(settle);
    });
  });
}

/* ═══════════════════════════════════════════
   NAV ACTIVE GLOW INDICATOR
═══════════════════════════════════════════ */
function initNavActiveGlow() {
  const indicator = document.createElement('span');
  indicator.id = 'm-nav-indicator';
  indicator.setAttribute('aria-hidden','true');
  document.getElementById('nav')?.appendChild(indicator);

  function updateIndicator() {
    const active = document.querySelector('.nl a.act');
    if (!active || !indicator) return;
    const r = active.getBoundingClientRect();
    const nr = document.getElementById('nav').getBoundingClientRect();
    indicator.style.left   = (r.left - nr.left) + 'px';
    indicator.style.width  = r.width + 'px';
    indicator.style.opacity = '1';
  }

  // Update on scroll (active link changes)
  const navObs = new MutationObserver(updateIndicator);
  document.querySelectorAll('.nl a').forEach(a => {
    navObs.observe(a, { attributes: true, attributeFilter: ['class'] });
  });
  setTimeout(updateIndicator, 600);
}

/* ═══════════════════════════════════════════
   COUNTER REVEAL — existing counters enhanced
═══════════════════════════════════════════ */
function initCounterReveal() {
  // Wrap existing counters with flip animation
  document.querySelectorAll('.ast-n,.hms-n,.ts-counter-n,.em-n').forEach(el => {
    el.classList.add('m-counter');
  });
}

/* ═══════════════════════════════════════════
   SKILL ORBIT — subtle floating on hover
═══════════════════════════════════════════ */
function initSkillOrbit() {
  document.querySelectorAll('.sk').forEach((card, i) => {
    const delay = i * 0.3;
    card.style.setProperty('--orbit-delay', `${delay}s`);
    card.classList.add('sk-orbit');
  });
}

/* ═══════════════════════════════════════════
   BUTTON RIPPLE
═══════════════════════════════════════════ */
function initButtonRipple() {
  document.querySelectorAll('.bf,.bo,.ncta,.pcl.s,.cf-btn,.sk-tab').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const existing = this.querySelector('.m-ripple');
      if (existing) existing.remove();
      const r = this.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const ripple = document.createElement('span');
      ripple.className = 'm-ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
}

/* ═══════════════════════════════════════════
   FORM MAGNETIC
═══════════════════════════════════════════ */
function initFormMagnetic() {
  document.querySelectorAll('.cf-i').forEach(input => {
    input.addEventListener('focus', () => input.closest('.cf-g')?.classList.add('m-focused'));
    input.addEventListener('blur',  () => input.closest('.cf-g')?.classList.remove('m-focused'));
  });
}

/* ═══════════════════════════════════════════
   SECTION ENTRANCES — unique per section
═══════════════════════════════════════════ */
function initSectionEntrances() {
  const sections = [
    { id: 'experience', cls: 'entrance-slide' },
    { id: 'skills',     cls: 'entrance-scale' },
    { id: 'projects',   cls: 'entrance-fade'  },
    { id: 'roadmap',    cls: 'entrance-rise'  },
    { id: 'contact',    cls: 'entrance-blur'  },
  ];

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('entrance-done');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });

  sections.forEach(({ id, cls }) => {
    const el = document.getElementById(id);
    if (el) { el.classList.add(cls); obs.observe(el); }
  });
}

/* ═══════════════════════════════════════════
   GRAIN OVERLAY
═══════════════════════════════════════════ */
function initGrainOverlay() {
  if (document.getElementById('m-grain')) return;
  const grain = document.createElement('div');
  grain.id = 'm-grain';
  grain.setAttribute('aria-hidden','true');
  document.body.appendChild(grain);
}
