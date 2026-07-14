/* ===== motion.js ===== */
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

/* Loading screen removed */

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
;
/* ===== main.js ===== */
/**
 * MAIN.JS — Nav · smooth scroll · timeline · skill tabs ·
 * workflow ribbon · typewriter · form · counters
 */
const SECTION_IDS = ['home','about','experience','skills','projects','roadmap','contact'];

const ROLES = [
  {
    date:'Sep 2021 – Apr 2023', co:'Freelance / Multiple Clients', loc:'📍 India & Remote', type:'Freelance',
    title:'SEO Specialist — Freelance', sub:'Self-Employed · 11+ clients · 18 months',
    desc:'Built real SEO skills from scratch — no courses, no theory. Shipped audits, fixed code, moved rankings.',
    points:[
      '<strong>On-page SEO</strong> — title tags, meta, heading structure, internal links, content gaps',
      '<strong>Technical audits</strong> — Screaming Frog + GSC: crawl errors, broken links, duplicate content',
      '<strong>WordPress</strong> — theme customisation, page speed, Core Web Vitals fixes'
    ],
    tags:[{t:'Freelance SEO',c:'o'},{t:'Keyword Research',c:'o'},{t:'WordPress',c:'n'},{t:'GSC',c:'n'}]
  },
  {
    date:'May 2023 – Jul 2024', co:'Yolk Media / Amazon FBA Brand', loc:'📍 Confidential Brand', type:'Full-Time',
    title:'SEO Executive — Amazon FBA', sub:'Amazon Marketplace · 50+ ASINs · 15 months',
    desc:'Owned the entire listing side for a confidential FBA brand — search architecture, rewrites, A+, ranking tracking.',
    points:[
      '<strong>Backend search terms</strong> — Helium10 Cerebro reverse lookups, full 250-byte optimisation',
      '<strong>Listing rewrites</strong> — benefit-first titles, keyword-dense bullets, A+ content overhauls',
      '<strong>BSR tracking</strong> — pre/post measurement across 6 categories'
    ],
    tags:[{t:'Amazon SEO',c:'g'},{t:'A9 Algorithm',c:'g'},{t:'Helium10',c:'g'},{t:'A+ Content',c:'n'}]
  },
  {
    date:'Aug 2024 – Jun 2025', co:'Yolk Media', loc:'📍 Multi-Client', type:'Contract',
    title:'SEO Engineer — Frontend & Clients', sub:'eCommerce · Finance · Local Services',
    desc:'Strategy plus hands-on code — heading hierarchy, schema injection, link architecture, audit reports with clear impact × effort matrices.',
    points:[
      '<strong>Frontend SEO</strong> — WordPress/Shopify: heading structure, schema, LCP/CLS fixes',
      '<strong>Internal linking</strong> — crawl equity mapping via Screaming Frog + Ahrefs',
      '<strong>Audit reports</strong> — impact × effort prioritisation delivered to clients'
    ],
    tags:[{t:'Technical SEO',c:'b'},{t:'WordPress',c:'n'},{t:'Shopify',c:'n'},{t:'Ahrefs',c:'n'}]
  },
  {
    date:'Dec 2025 – Mar 2026', co:'SabkiShiksha', loc:'📍 Education Platform', type:'Full-Time',
    title:'SEO Engineer', sub:'SabkiShiksha · Education · 4 months',
    desc:'Full technical SEO and content architecture ownership on an education platform with deep informational intent signals.',
    points:[
      '<strong>Information architecture</strong> — intent mapping for course and guidance pages',
      '<strong>JSON-LD schemas</strong> — Course, FAQ, BreadcrumbList, Organization, all validated',
      '<strong>Core Web Vitals</strong> — LCP, CLS, FID diagnosis and developer handoff'
    ],
    tags:[{t:'Technical SEO',c:'b'},{t:'Python Automation',c:'b'},{t:'Structured Data',c:'b'},{t:'CWV',c:'b'}]
  },
  {
    date:'Apr 2026 – Now', co:'8Bit System Pvt Ltd', loc:'📍 Jaipur, India', type:'cur',
    title:'ELK Stack Developer', sub:'8Bit System Pvt Ltd · Full-Time · Current',
    desc:'Production ELK daily — Logstash pipelines, Elasticsearch query design, Kibana dashboards, Python backend scripts, Linux infrastructure.',
    points:[
      '<strong>Python backend</strong> — log parsing, field enrichment, data transformation, automation scripts',
      '<strong>Logstash pipelines</strong> — grok parsing, field mapping, noise filtering, multi-index routing',
      '<strong>Elasticsearch Query DSL</strong> — aggregations, custom mappings, ILM policy setup',
      '<strong>Kibana dashboards</strong> — error rate panels, latency histograms, alerting rules',
      '<strong>Linux ops</strong> — systemctl, cron, log rotation, SSH remote management'
    ],
    tags:[{t:'Elasticsearch',c:'b'},{t:'Python',c:'b'},{t:'Logstash',c:'b'},{t:'Kibana',c:'b'},{t:'Linux',c:'b'}]
  }
];
try { window.ROLES = ROLES; } catch (e) {}

function buildRolePanel(idx) {
  const r = ROLES[idx];
  const isCur = r.type === 'cur';
  return `<div class="rp-inner">
    <div class="rp-left">
      <span class="rp-date">${r.date}</span>
      <div class="rp-co">${r.co}</div>
      <div class="rp-loc">${r.loc}</div>
      <span class="rp-type ${isCur?'cur':''}">${isCur?'● Current':r.type}</span>
    </div>
    <div class="rp-right">
      <div class="rp-title">${r.title}</div>
      <div class="rp-sub">${r.sub}</div>
      <div class="rp-desc">${r.desc}</div>
      <ul class="rp-ul">${r.points.map(p=>`<li>${p}</li>`).join('')}</ul>
      <div class="rp-tags">${r.tags.map(t=>`<span class="et ${t.c}">${t.t}</span>`).join('')}</div>
    </div>
  </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initNavDropdown();
  initMobileMenu();
  initBackToTop();
  initSmoothScroll();
  initActiveNav();
  initScrollReveals();
  initAboutLines();
  initStatCounters();
  initJourneyLine();
  initExperienceTimeline();
  initSkillTabs();
  initWorkflowRibbon();
  initTypewriter();
  initContactForm();
  initKeyboardNav();
});

/* ── NAV ── */
function navH() {
  return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
}
function initNav() {
  window.addEventListener('scroll', () => {
    document.getElementById('nav')?.classList.toggle('sc', window.scrollY > 30);
    document.getElementById('back-to-top')?.classList.toggle('show', window.scrollY > 420);
  }, { passive: true });
}

/* ── NAV DROPDOWN ── */
function initNavDropdown() {
  const trigger = document.querySelector('.nav-has-dropdown');
  if (!trigger) return;
  const dropdown = trigger.querySelector('.nav-dropdown');
  if (!dropdown) return;
  let t;
  const open = () => { clearTimeout(t); dropdown.classList.add('open'); };
  const close = () => { t = setTimeout(() => dropdown.classList.remove('open'), 150); };
  trigger.addEventListener('mouseenter', open);
  trigger.addEventListener('mouseleave', close);
  document.addEventListener('click', e => { if (!trigger.contains(e.target)) dropdown.classList.remove('open'); });
}

/* ── MOBILE MENU ── */
function initMobileMenu() {
  const btn = document.querySelector('.hbg');
  const mob = document.getElementById('mob');
  if (!btn || !mob) return;
  btn.addEventListener('click', () => mob.classList.toggle('on'));
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mob.classList.remove('on')));
}

/* ── BACK TO TOP ── */
function initBackToTop() {
  document.getElementById('back-to-top')?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

/* ── SMOOTH SCROLL ── */
function scrollToEl(el) {
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navH() - 8, behavior: 'smooth' });
}
function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = link.getAttribute('href');
    if (!target || target === '#') return;
    const el = document.querySelector(target);
    if (el) { e.preventDefault(); document.getElementById('mob')?.classList.remove('on'); scrollToEl(el); history.replaceState(null, '', target); }
  });
}

/* ── ACTIVE NAV ── */
function initActiveNav() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: `-${navH() + 10}px 0px -55% 0px`, threshold: 0 });
  SECTION_IDS.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
}
function setActive(id) {
  document.querySelectorAll('.nl a, .mob a').forEach(a =>
    a.classList.toggle('act', a.getAttribute('href') === `#${id}`)
  );
}

/* ── SCROLL REVEALS ── */
function initScrollReveals() {
  const rvObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); } });
  }, { threshold: .07, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.rv').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i * .032, .26) + 's';
    rvObs.observe(el);
  });
  const stObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: .08 });
  document.querySelectorAll('.stagger').forEach(g => stObs.observe(g));
  const jpObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: .1 });
  document.querySelectorAll('.jpath').forEach(el => jpObs.observe(el));
}

/* ── ABOUT LINES ── */
function initAboutLines() {
  const about = document.getElementById('about');
  if (!about) return;
  let fired = false;
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      document.querySelectorAll('.aline').forEach((line, i) =>
        setTimeout(() => line.classList.add('show'), i * 200)
      );
    }
  }, { threshold: .18 }).observe(about);
}

/* ── STAT COUNTERS ── */
function initStatCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let fired = false;
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !fired) {
        fired = true;
        const dur = 1200, start = performance.now();
        const step = ts => {
          const p = Math.min((ts - start) / dur, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        el.textContent = '0' + suffix;
        requestAnimationFrame(step);
      }
    }, { threshold: .5 }).observe(el);
  });
}

/* ── JOURNEY LINE ── */
function initJourneyLine() {
  const line = document.getElementById('jline');
  if (!line) return;
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) line.classList.add('draw');
  }, { threshold: .25 }).observe(line.parentElement);
}

/* ── EXPERIENCE TIMELINE ── */
function initExperienceTimeline() {
  const nodes = document.querySelectorAll('.jn[data-role]');
  const panel = document.getElementById('role-panel');
  const progressWrap = document.getElementById('role-progress-wrap');
  const progressBar = document.getElementById('role-progress-bar');
  if (!nodes.length || !panel) return;

  let activeIdx = -1, autoTimer = null, paused = false;
  const CYCLE_MS = 4200;

  function openRole(idx, fromAuto = false) {
    if (!fromAuto) { paused = true; stopAuto(); }
    nodes.forEach(n => n.classList.remove('active'));
    nodes[idx]?.classList.add('active');
    panel.innerHTML = buildRolePanel(idx);
    panel.classList.add('open');
    if (progressWrap) progressWrap.classList.add('visible');
    resetBar();
    activeIdx = idx;
    if (!fromAuto) {
      setTimeout(() => {
        window.scrollTo({ top: panel.getBoundingClientRect().top + window.scrollY - navH() - 20, behavior: 'smooth' });
      }, 140);
    }
  }

  function resetBar() {
    if (!progressBar) return;
    progressBar.style.transition = 'none'; progressBar.style.width = '0';
    void progressBar.offsetWidth;
    progressBar.style.transition = `width ${CYCLE_MS}ms linear`;
    progressBar.style.width = '100%';
  }

  function startAuto() {
    if (autoTimer) return;
    autoTimer = setInterval(() => { if (!paused) openRole((activeIdx + 1) % nodes.length, true); }, CYCLE_MS);
  }
  function stopAuto() {
    clearInterval(autoTimer); autoTimer = null;
    if (progressBar) { progressBar.style.transition = 'none'; progressBar.style.width = '0'; }
  }

  nodes.forEach((node, i) => {
    node.addEventListener('click', () => {
      if (activeIdx === i) { paused = !paused; if (!paused) { startAuto(); resetBar(); } return; }
      openRole(i, false);
    });
    node.addEventListener('mouseenter', () => { paused = true; });
    node.addEventListener('mouseleave', () => { paused = false; });
    node.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openRole(i, false); } });
  });
  panel.addEventListener('mouseenter', () => { paused = true; });
  panel.addEventListener('mouseleave', () => { paused = false; });

  const expEl = document.getElementById('experience');
  if (expEl) {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { openRole(0, true); startAuto(); } else stopAuto();
    }, { threshold: .15 }).observe(expEl);
  }
}

/* ── SKILL TABS ── */
function initSkillTabs() {
  const tabs = document.querySelectorAll('.sk-tab');
  const panels = document.querySelectorAll('.sk-panel');
  const pBar = document.getElementById('sk-progress-bar');
  if (!tabs.length) return;

  let idx = 0, timer = null, paused = false;
  const CYCLE = 3800;

  function activate(i) {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tabs[i]?.classList.add('active');
    panels[i]?.classList.add('active');
    const stagger = panels[i]?.querySelector('.stagger');
    if (stagger && !stagger.classList.contains('in')) stagger.classList.add('in');
    idx = i; resetPBar();
  }
  function resetPBar() {
    if (!pBar) return;
    pBar.style.transition = 'none'; pBar.style.width = '0';
    void pBar.offsetWidth;
    pBar.style.transition = `width ${CYCLE}ms linear`;
    pBar.style.width = '100%';
  }
  tabs.forEach((tab, i) => tab.addEventListener('click', () => { paused = true; stopCycle(); activate(i); }));
  function startCycle() { if (timer) return; timer = setInterval(() => { if (!paused) activate((idx+1)%tabs.length); }, CYCLE); }
  function stopCycle() { clearInterval(timer); timer = null; }

  const skillsEl = document.getElementById('skills');
  if (skillsEl) {
    new IntersectionObserver(e => {
      if (e[0].isIntersecting) { activate(0); startCycle(); } else stopCycle();
    }, { threshold: .15 }).observe(skillsEl);
    skillsEl.addEventListener('mouseenter', () => { paused = true; });
    skillsEl.addEventListener('mouseleave', () => { paused = false; });
  }
}

/* ── WORKFLOW RIBBON ── */
function initWorkflowRibbon() {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  document.querySelectorAll('.workflow-ribbon').forEach(ribbon => {
    const spans = ribbon.querySelectorAll('span');
    if (!spans.length) return;
    let idx = 0, timer = null;
    new IntersectionObserver(e => {
      if (e[0].isIntersecting) start(); else stop();
    }, { threshold: .4 }).observe(ribbon);
    function start() {
      if (timer) return;
      timer = setInterval(() => {
        spans[idx].classList.remove('lit');
        idx = (idx + 1) % spans.length;
        spans[idx].classList.add('lit');
      }, 960);
    }
    function stop() { clearInterval(timer); timer = null; }
  });
}

/* ── CONTACT FORM ── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('cfb');
  const sticky = document.getElementById('ct-sticky-send');
  const stickyBtn = document.getElementById('ctss-btn');
  if (!form || !btn) return;

  const setBtnText = (el, label) => {
    const tx = el.querySelector('.cfb-tx, .ctss-tx');
    if (tx) tx.textContent = label;
    else el.textContent = label;
  };

  // Sticky footer: show when the form is in view on small screens
  if (sticky && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (window.innerWidth <= 780) {
          sticky.classList.toggle('visible', en.isIntersecting);
        } else {
          sticky.classList.remove('visible');
        }
      });
    }, { threshold: 0.05, rootMargin: '-40px 0px 0px 0px' });
    io.observe(form);
    window.addEventListener('resize', () => {
      if (window.innerWidth > 780) sticky.classList.remove('visible');
    }, { passive: true });
  }

  const doSubmit = async () => {
    if (btn.disabled) return;
    // 3D button press animation
    setBtnText(btn, 'Sending...');
    setBtnText(stickyBtn, 'Sending...');
    btn.classList.add('loading');
    btn.disabled = true;
    if (stickyBtn) stickyBtn.disabled = true;

    const data = new FormData(form);

    try {
      const res = await fetch('https://formspree.io/f/mnjkkzdk', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // Success state
        btn.classList.remove('loading');
        setBtnText(btn, 'Sent ✓');
        setBtnText(stickyBtn, 'Sent ✓');
        btn.style.background = '#059669';
        btn.style.boxShadow = '0 4px 0 rgba(5,150,105,.35),0 6px 20px rgba(5,150,105,.3)';

        setTimeout(() => {
          setBtnText(btn, 'Send Message');
          setBtnText(stickyBtn, 'Send Message');
          btn.style.background = '';
          btn.style.boxShadow = '';
          btn.disabled = false;
          if (stickyBtn) stickyBtn.disabled = false;
          form.reset();
        }, 3500);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      btn.classList.remove('loading');
      setBtnText(btn, 'Failed — Try Again');
      setBtnText(stickyBtn, 'Failed — Try Again');
      btn.style.background = '#dc2626';
      btn.style.boxShadow = '0 4px 0 rgba(220,38,38,.35)';
      btn.disabled = false;
      if (stickyBtn) stickyBtn.disabled = false;
      setTimeout(() => {
        setBtnText(btn, 'Send Message');
        setBtnText(stickyBtn, 'Send Message');
        btn.style.background = '';
        btn.style.boxShadow = '';
      }, 3000);
    }
  };

  form.addEventListener('submit', (e) => { e.preventDefault(); doSubmit(); });
  if (stickyBtn) stickyBtn.addEventListener('click', doSubmit);
}

/* ── KEYBOARD NAV ── */
function initKeyboardNav() {
  document.addEventListener('keydown', e => {
    const tag = document.activeElement?.tagName;
    if (['INPUT','TEXTAREA','SELECT'].includes(tag) || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); scrollAdj(1); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); scrollAdj(-1); }
  });
}
function scrollAdj(dir) {
  // Use ALL page sections in DOM order so keyboard nav never skips middle sections.
  const sections = Array.from(document.querySelectorAll('section.page-section'));
  if (!sections.length) return;
  const threshold = navH() + 60;
  let cur = 0;
  sections.forEach((el, i) => { if (el.getBoundingClientRect().top <= threshold) cur = i; });
  const nextIdx = Math.max(0, Math.min(sections.length - 1, cur + dir));
  const next = sections[nextIdx];
  if (!next) return;
  const top = next.getBoundingClientRect().top + window.scrollY - navH() - 8;
  // Fast but smooth — native smooth scroll, short travel is quick.
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ── TYPEWRITER ── */
function initTypewriter() {
  const box = document.getElementById('cc-typewriter');
  if (!box || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const lineEls = Array.from(box.querySelectorAll('.cl'));
  const lines = lineEls.map(cl => ({
    ln: cl.querySelector('.ln')?.outerHTML || '',
    ct: cl.querySelector('.ct')?.innerHTML || ''
  }));
  if (!lines.length) return;
  const HOLD = 5500, CHAR = 13, LPAUSE = 75;

  function revealChars(html, count) {
    let out = '', visible = 0, i = 0, openTags = [];
    while (i < html.length && visible < count) {
      if (html[i] === '<') {
        const close = html.indexOf('>', i); if (close === -1) break;
        const tag = html.slice(i, close+1); out += tag;
        if (tag[1] !== '/' && !/\/>$/.test(tag)) { const m = tag.match(/^<([a-zA-Z0-9]+)/); if (m) openTags.push(m[1]); }
        else if (tag[1] === '/') openTags.pop();
        i = close+1; continue;
      }
      if (html[i] === '&') { const semi = html.indexOf(';',i); if (semi !== -1 && semi-i<9) { out += html.slice(i,semi+1); visible++; i = semi+1; continue; } }
      out += html[i]; visible++; i++;
    }
    for (let t = openTags.length-1; t >= 0; t--) out += `</${openTags[t]}>`;
    return out;
  }
  function countVis(html) { return html.replace(/<[^>]*>/g,'').replace(/&[a-zA-Z0-9]+;/g,'_').length; }

  let gen = 0;
  async function typeOnce(myGen) {
    box.innerHTML = '';
    for (let li = 0; li < lines.length; li++) {
      if (myGen !== gen) return;
      const { ln, ct } = lines[li];
      const total = countVis(ct);
      const div = document.createElement('div'); div.className = 'cl';
      div.innerHTML = ln + '<span class="ct"></span>';
      box.appendChild(div);
      const ctSpan = div.querySelector('.ct');
      for (let c = 1; c <= total; c++) {
        if (myGen !== gen) return;
        ctSpan.innerHTML = revealChars(ct,c) + '<span class="typed-cursor-el" aria-hidden="true">█</span>';
        await new Promise(r => setTimeout(r, CHAR));
      }
      ctSpan.innerHTML = ct;
      await new Promise(r => setTimeout(r, LPAUSE));
    }
    if (myGen !== gen) return;
    await new Promise(r => setTimeout(r, HOLD));
    if (myGen !== gen) return;
    typeOnce(myGen);
  }
  typeOnce(gen);
  document.addEventListener('visibilitychange', () => { gen++; if (!document.hidden) typeOnce(gen); });
}
;
/* ===== animations.js ===== */
/**
 * ANIMATIONS.JS — 2026 AI · Neural canvas · 3D tilt · Magnetic
 * Spotlight · Hero parallax · Photo tilt · EC tilt · Particles
 */
document.addEventListener('DOMContentLoaded', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const hasHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  initScrollProgress();
  initHeroCanvas();

  if (!reduce) {
    injectHeroElements();
    initHeroParticles();
    if (hasHover) {
      initHeroMotion();
      initMagneticButtons();
      initCardTilt3D('.pc', 8, 32);
      initCardTilt3D('.sk', 6, 18);
      initCardTilt3D('.ec', 6, 14);
      initCardTilt3D('.rm', 4, 12);
      initSpotlight('.pc');
      initAboutPhotoTilt();
    }
  }
});

/* ══════════════════════════════════════════
   SCROLL PROGRESS
   ══════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0) bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
}

/* ══════════════════════════════════════════
   INJECT HERO ELEMENTS (grid + scan + particles)
   ══════════════════════════════════════════ */
function injectHeroElements() {
  const wrap = document.querySelector('.hero-wrap');
  if (!wrap) return;
  ['hero-grid', 'hero-scan', 'hero-particles'].forEach(cls => {
    if (!wrap.querySelector('.' + cls)) {
      const el = document.createElement('div');
      el.className = cls;
      el.setAttribute('aria-hidden', 'true');
      wrap.appendChild(el);
    }
  });
}

/* ══════════════════════════════════════════
   HERO CANVAS — neural graph with 3D parallax depth
   ══════════════════════════════════════════ */
function initHeroCanvas() {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const section = document.getElementById('home');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resize();

  const COUNT = Math.min(52, Math.floor(canvas.width / 22));
  const MAX = 180;
  const LAYERS = 3; // depth layers

  const nodes = Array.from({ length: COUNT }, (_, i) => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - .5) * .32,
    vy: (Math.random() - .5) * .32,
    r: Math.random() * 2 + .6,
    phase: Math.random() * Math.PI * 2,
    layer: Math.floor(Math.random() * LAYERS), // 0=back,1=mid,2=front
    variant: Math.random() > .65 ? 1 : 0
  }));

  let t = 0, rafId, running = true;
  let mx = -9999, my = -9999;
  let pmx = 0, pmy = 0; // parallax mouse

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
    pmx = ((e.clientX - r.left) / r.width - .5) * 2;
    pmy = ((e.clientY - r.top) / r.height - .5) * 2;
  });
  canvas.addEventListener('mouseleave', () => { mx = -9999; my = -9999; pmx = 0; pmy = 0; });

  function draw() {
    if (!running) return;
    t += .009;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Parallax offset per layer
    const layerOffsets = [
      { x: pmx * 8, y: pmy * 6 },
      { x: pmx * 16, y: pmy * 12 },
      { x: pmx * 28, y: pmy * 20 }
    ];

    nodes.forEach(n => {
      n.x += n.vx * (1 + n.layer * .2);
      n.y += n.vy * (1 + n.layer * .2);
      if (n.x < -20) n.x = canvas.width + 20;
      if (n.x > canvas.width + 20) n.x = -20;
      if (n.y < -20) n.y = canvas.height + 20;
      if (n.y > canvas.height + 20) n.y = -20;
      // Cursor repel (stronger for front layer)
      const repelStr = (.2 + n.layer * .1);
      const dx = n.x - mx, dy = n.y - my, d = Math.hypot(dx, dy);
      if (d < 90 && d > 0) {
        const f = (90 - d) / 90 * repelStr;
        n.x += (dx / d) * f; n.y += (dy / d) * f;
      }
    });

    // Draw edges (only between same/adjacent layers)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.abs(nodes[i].layer - nodes[j].layer) > 1) continue;
        const oi = layerOffsets[nodes[i].layer];
        const oj = layerOffsets[nodes[j].layer];
        const dx = (nodes[i].x + oi.x) - (nodes[j].x + oj.x);
        const dy = (nodes[i].y + oi.y) - (nodes[j].y + oj.y);
        const d = Math.hypot(dx, dy);
        if (d < MAX) {
          const avgLayer = (nodes[i].layer + nodes[j].layer) / 2;
          const alpha = (1 - d / MAX) * (.05 + avgLayer * .04);
          const col = (nodes[i].variant || nodes[j].variant)
            ? `rgba(96,165,250,${alpha})` : `rgba(26,111,244,${alpha})`;
          ctx.beginPath();
          ctx.strokeStyle = col;
          ctx.lineWidth = .5 + avgLayer * .3;
          ctx.moveTo(nodes[i].x + oi.x, nodes[i].y + oi.y);
          ctx.lineTo(nodes[j].x + oj.x, nodes[j].y + oj.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      const o = layerOffsets[n.layer];
      const pulse = .35 + .65 * Math.sin(t * (1.2 + n.layer * .2) + n.phase);
      const scale = .6 + n.layer * .25; // back nodes smaller
      const col = n.variant ? `rgba(96,165,250,${pulse * (.3 + n.layer * .1)})` : `rgba(26,111,244,${pulse * (.3 + n.layer * .1)})`;
      ctx.beginPath();
      ctx.arc(n.x + o.x, n.y + o.y, n.r * scale, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
      // Halo on front layer
      if (n.layer === 2 && pulse > .7) {
        ctx.beginPath();
        ctx.arc(n.x + o.x, n.y + o.y, n.r * scale * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = n.variant ? `rgba(96,165,250,${(pulse-.7)*.06})` : `rgba(26,111,244,${(pulse-.7)*.06})`;
        ctx.fill();
      }
    });

    rafId = requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
  setTimeout(() => { canvas.style.opacity = '1'; }, 600);

  new IntersectionObserver(e => {
    running = e[0].isIntersecting;
    if (running) rafId = requestAnimationFrame(draw);
    else cancelAnimationFrame(rafId);
  }, { threshold: 0 }).observe(section);

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 220); }, { passive: true });
}

/* ══════════════════════════════════════════
   HERO PARTICLES — layered depth orbs
   ══════════════════════════════════════════ */
function initHeroParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  const count = window.innerWidth < 768 ? 8 : 18;

  for (let i = 0; i < count; i++) {
    const orb = document.createElement('div');
    const layer = Math.floor(Math.random() * 3);
    const size = (1.5 + layer) + Math.random() * 3;
    const isBlue = Math.random() > .45;
    const dur = 10 + Math.random() * 14;
    const delay = Math.random() * -16;
    const tx = (Math.random() - .5) * (60 + layer * 30);
    const ty = (Math.random() - .5) * (50 + layer * 20);
    const opacity = .15 + layer * .12 + Math.random() * .2;
    orb.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;border-radius:50%;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      pointer-events:none;
      background:${isBlue?'rgba(26,111,244,':'rgba(96,165,250,'}${opacity});
      --tx:${tx}px;--ty:${ty}px;
      animation:orbFloat ${dur}s ${delay}s ease-in-out infinite;
      filter:blur(${layer===0?1:0}px);
    `;
    container.appendChild(orb);
  }

  if (!document.getElementById('orb-kf')) {
    const s = document.createElement('style');
    s.id = 'orb-kf';
    s.textContent = `@keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1);opacity:.6}33%{opacity:.9}50%{transform:translate(var(--tx),var(--ty)) scale(1.12);opacity:.4}66%{opacity:.75}83%{transform:translate(calc(var(--tx)*-.4),calc(var(--ty)*.6)) scale(.88)}}`;
    document.head.appendChild(s);
  }
}

/* ══════════════════════════════════════════
   HERO PARALLAX + CODE CARD 3D TILT
   ══════════════════════════════════════════ */
function initHeroMotion() {
  const wrap = document.querySelector('.hero-wrap');
  const bg = document.querySelector('.hbg-el');
  const card = document.querySelector('.cc-tilt');
  const grid = document.querySelector('.hero-grid');
  if (!wrap) return;

  let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

  function loop() {
    cx += (tx - cx) * .06;
    cy += (ty - cy) * .06;
    if (bg) bg.style.transform = `translate3d(${cx * 22}px,${cy * 15}px,0)`;
    if (grid) grid.style.transform = `translate3d(${cx * 10}px,${cy * 8}px,0)`;
    if (card) {
      card.style.transform = `
        perspective(900px)
        rotateY(${cx * 6}deg)
        rotateX(${-cy * 5}deg)
        translateZ(${Math.abs(cx) * 8 + Math.abs(cy) * 6}px)
      `;
    }
    raf = requestAnimationFrame(loop);
  }

  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - .5) * 2;
    ty = ((e.clientY - r.top) / r.height - .5) * 2;
    if (!raf) raf = requestAnimationFrame(loop);
    // update spotlight
    wrap.style.setProperty('--sx', `${(e.clientX - r.left)/r.width*100}%`);
    wrap.style.setProperty('--sy', `${(e.clientY - r.top)/r.height*100}%`);
  });

  wrap.addEventListener('mouseleave', () => {
    tx = 0; ty = 0;
    const settle = setInterval(() => {
      if (Math.abs(cx) < .006 && Math.abs(cy) < .006) {
        cancelAnimationFrame(raf); raf = null;
        if (bg) bg.style.transform = '';
        if (grid) grid.style.transform = '';
        if (card) card.style.transform = '';
        clearInterval(settle);
      }
    }, 80);
  });
}

/* ══════════════════════════════════════════
   ABOUT PHOTO 3D TILT
   ══════════════════════════════════════════ */
function initAboutPhotoTilt() {
  const wrap = document.querySelector('.aph-wrap');
  const inner = wrap?.querySelector('.aph');
  if (!wrap || !inner) return;

  let raf = null;
  let tx = 0, ty = 0, cx = 0, cy = 0;

  function loop() {
    cx += (tx - cx) * .08;
    cy += (ty - cy) * .08;
    inner.style.transform = `perspective(600px) rotateY(${cx * 9}deg) rotateX(${-cy * 9}deg) scale(1.04) translateZ(10px)`;
    raf = requestAnimationFrame(loop);
  }

  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width - .5;
    ty = (e.clientY - r.top) / r.height - .5;
    if (!raf) raf = requestAnimationFrame(loop);
  });
  wrap.addEventListener('mouseleave', () => {
    tx = 0; ty = 0;
    const settle = setInterval(() => {
      if (Math.abs(cx) < .004 && Math.abs(cy) < .004) {
        cancelAnimationFrame(raf); raf = null;
        inner.style.transform = '';
        clearInterval(settle);
      }
    }, 80);
  });
}

/* ══════════════════════════════════════════
   GENERIC 3D CARD TILT
   maxDeg = max rotation, maxTZ = max translateZ
   ══════════════════════════════════════════ */
function initCardTilt3D(selector, maxDeg, maxTZ) {
  document.querySelectorAll(selector).forEach(card => {
    let raf = null;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let isHover = false;

    function loop() {
      cx += (tx - cx) * .1;
      cy += (ty - cy) * .1;
      const depth = (Math.abs(cx) + Math.abs(cy)) * .5 * maxTZ;

      // Update CSS vars (used by style.css hover rules)
      card.style.setProperty('--tiltX', `${cy * maxDeg}deg`);
      card.style.setProperty('--tiltY', `${cx * maxDeg}deg`);

      if (isHover) {
        raf = requestAnimationFrame(loop);
      } else if (Math.abs(cx) < .002 && Math.abs(cy) < .002) {
        card.style.setProperty('--tiltX', '0deg');
        card.style.setProperty('--tiltY', '0deg');
        cancelAnimationFrame(raf); raf = null;
      } else {
        raf = requestAnimationFrame(loop);
      }
    }

    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - .5;
      ty = (e.clientY - r.top) / r.height - .5;
      if (!raf) { isHover = true; raf = requestAnimationFrame(loop); }
    });
    card.addEventListener('mouseleave', () => {
      isHover = false;
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  });
}

/* ══════════════════════════════════════════
   MAGNETIC BUTTONS — spring physics
   ══════════════════════════════════════════ */
function initMagneticButtons() {
  document.querySelectorAll('.bf, .bo, .ncta, .pcl, .sb').forEach(btn => {
    let raf = null, bx = 0, by = 0, cx = 0, cy = 0, isH = false;

    function loop() {
      cx += (bx - cx) * .14;
      cy += (by - cy) * .14;
      if (Math.abs(cx) > .1 || Math.abs(by) > .1 || isH) {
        btn.style.setProperty('--mag-x', `${cx}px`);
        btn.style.setProperty('--mag-y', `${cy}px`);
        raf = requestAnimationFrame(loop);
      } else {
        btn.style.setProperty('--mag-x', '0px');
        btn.style.setProperty('--mag-y', '0px');
        cancelAnimationFrame(raf); raf = null;
      }
    }

    // Apply magnetic via transform on a wrapper span if needed — simple version: just nudge
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      bx = (e.clientX - r.left - r.width / 2) * .25;
      by = (e.clientY - r.top - r.height / 2) * .3;
      isH = true;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    btn.addEventListener('mouseleave', () => {
      isH = false; bx = 0; by = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  });

  // Apply --mag-x/y to actual transform via a style rule
  if (!document.getElementById('mag-style')) {
    const s = document.createElement('style');
    s.id = 'mag-style';
    s.textContent = `.bf:hover,.bo:hover,.ncta:hover,.pcl:hover,.sb:hover{--mag-tx:var(--mag-x,0px);--mag-ty:var(--mag-y,0px)}`;
    document.head.appendChild(s);
  }

  // Simpler direct approach — just apply transform offset
  document.querySelectorAll('.bf,.bo,.ncta,.sb').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const ox = (e.clientX - r.left - r.width/2) * .22;
      const oy = (e.clientY - r.top - r.height/2) * .28;
      // Keep existing 3D transform and ADD magnetic offset
      btn.dataset.magX = ox;
      btn.dataset.magY = oy;
    });
    btn.addEventListener('mouseleave', () => {
      btn.dataset.magX = 0;
      btn.dataset.magY = 0;
    });
  });
}

/* ══════════════════════════════════════════
   CURSOR SPOTLIGHT on project cards
   ══════════════════════════════════════════ */
function initSpotlight(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}


/* ══ PREMIUM EFFECTS (merged from premium.js) ══ */

/* ══════════════════════════════════════════
   INJECT AURORA + NOISE + GEO
   ══════════════════════════════════════════ */
function injectAurora() {
  if (document.getElementById('aurora-bg')) return;
  const el = document.createElement('div');
  el.id = 'aurora-bg';
  el.innerHTML = `
    <div class="aurora-blob aurora-blob-1"></div>
    <div class="aurora-blob aurora-blob-2"></div>
    <div class="aurora-blob aurora-blob-3"></div>
  `;
  document.body.prepend(el);
}

function injectNoise() {
  if (document.getElementById('noise-overlay')) return;
  const el = document.createElement('div');
  el.id = 'noise-overlay';
  document.body.prepend(el);
}

function injectGeoShapes() {
  if (document.querySelector('.geo-shape')) return;
  [1, 2, 3].forEach(n => {
    const el = document.createElement('div');
    el.className = `geo-shape geo-shape-${n}`;
    document.body.appendChild(el);
  });
}

/* ══════════════════════════════════════════
   PAGE TRANSITION OVERLAY
   ══════════════════════════════════════════ */
function injectPageTransition() {
  if (document.getElementById('page-transition')) return;
  const el = document.createElement('div');
  el.id = 'page-transition';
  el.innerHTML = `
    <div class="pt-panel"></div>
    <div class="pt-logo">Arun<em>.</em></div>
    <div class="pt-bar"></div>
  `;
  document.body.appendChild(el);
}

function initPageTransitions() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  // Intercept external nav links (case studies)
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    if (link.hostname !== location.hostname) return;
    link.addEventListener('click', e => {
      const href = link.href;
      e.preventDefault();
      overlay.classList.add('entering');
      setTimeout(() => {
        overlay.classList.add('leaving');
        window.location.href = href;
      }, 500);
    });
  });

  // On page load — reverse transition if coming from within
  if (document.referrer.includes(location.hostname)) {
    overlay.classList.add('entering');
    setTimeout(() => {
      overlay.classList.remove('entering');
      overlay.classList.add('leaving');
      setTimeout(() => overlay.classList.remove('leaving'), 550);
    }, 200);
  }
}

/* ══════════════════════════════════════════
   MOUSE GLOW
   ══════════════════════════════════════════ */
function initMouseGlow() {
  const glow = document.createElement('div');
  glow.id = 'mouse-glow';
  document.body.appendChild(glow);

  let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

  function loop() {
    cx += (tx - cx) * .08;
    cy += (ty - cy) * .08;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    raf = requestAnimationFrame(loop);
  }

  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
}

/* ══════════════════════════════════════════
   CURSOR TRAILER
   ══════════════════════════════════════════ */
function initCursorTrailer() {
  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let dx = 0, dy = 0, rx = 0, ry = 0, raf;

  document.addEventListener('mousemove', e => {
    dx = e.clientX; dy = e.clientY;
    dot.style.left = dx + 'px'; dot.style.top = dy + 'px';
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });

  function loop() {
    rx += (dx - rx) * .15;
    ry += (dy - ry) * .15;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    raf = requestAnimationFrame(loop);
  }

  // Hover detection
  const hoverEls = 'a,button,.bf,.bo,.sb,.pc,.sk,.bento,.ts-card,.ncta,.pcl';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ══════════════════════════════════════════
   RIPPLE BUTTONS
   ══════════════════════════════════════════ */
function initRippleButtons() {
  document.querySelectorAll('.bf, .bo, .ncta, .cf-btn').forEach(btn => {
    btn.classList.add('ripple-container');
    btn.addEventListener('click', e => {
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 1.5;
      const wave = document.createElement('span');
      wave.className = 'ripple-wave';
      wave.style.cssText = `
        width:${size}px;height:${size}px;
        left:${e.clientX - r.left - size/2}px;
        top:${e.clientY - r.top - size/2}px;
      `;
      btn.appendChild(wave);
      setTimeout(() => wave.remove(), 600);
    });
  });
}

/* ══════════════════════════════════════════
   TEXT SPLIT REVEAL
   ══════════════════════════════════════════ */
function initTextSplitReveal() {
  const titles = document.querySelectorAll('.stitle, .ts-callout-text');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.text-split-word').forEach((w, i) => {
          setTimeout(() => w.classList.add('in'), i * 80);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .4 });

  titles.forEach(el => {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    const words = el.innerHTML.split(/(\s+)/);
    el.innerHTML = words.map(w =>
      w.trim()
        ? `<span class="text-split-word"><span class="text-split-inner">${w}</span></span>`
        : w
    ).join('');
    obs.observe(el);
  });
}

/* ══════════════════════════════════════════
   PARALLAX SECTIONS
   ══════════════════════════════════════════ */
function initParallaxSections() {
  const sections = document.querySelectorAll('.page-section');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    sections.forEach(sec => {
      const r = sec.getBoundingClientRect();
      if (r.bottom < -100 || r.top > window.innerHeight + 100) return;
      const progress = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      const bg = sec.querySelector('.hbg-el');
      if (bg) bg.style.transform = `translateY(${progress * 20}px)`;
    });
  }, { passive: true });
}

/* ══════════════════════════════════════════
   SKILL GLOW SPOTLIGHT
   ══════════════════════════════════════════ */
function initSkillGlowSpotlight() {
  document.querySelectorAll('.sk').forEach(card => {
    let glow = card.querySelector('.sk-glow');
    if (!glow) {
      glow = document.createElement('div');
      glow.className = 'sk-glow';
      card.appendChild(glow);
    }
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

/* ══════════════════════════════════════════
   TECHNOLOGY CONSTELLATION CANVAS
   ══════════════════════════════════════════ */
function initConstellationCanvas() {
  const container = document.getElementById('tech-universe');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const techs = [
    { name: 'Elasticsearch', icon: '🔍', color: '#00BFB3', orbit: 120, speed: .4 },
    { name: 'Logstash', icon: '⚡', color: '#F04E23', orbit: 120, speed: .4 },
    { name: 'Kibana', icon: '📊', color: '#1a6ff4', orbit: 120, speed: .4 },
    { name: 'Python', icon: '🐍', color: '#3776AB', orbit: 190, speed: .25 },
    { name: 'FastAPI', icon: '🚀', color: '#009688', orbit: 190, speed: .25 },
    { name: 'LangChain', icon: '🔗', color: '#1c3c78', orbit: 190, speed: .25 },
    { name: 'OpenAI', icon: '🤖', color: '#10a37f', orbit: 190, speed: .25 },
    { name: 'RAG', icon: '📄', color: '#7c3aed', orbit: 260, speed: .15 },
    { name: 'Docker', icon: '🐳', color: '#2496ED', orbit: 260, speed: .15 },
    { name: 'Linux', icon: '🖥️', color: '#555', orbit: 260, speed: .15 },
    { name: 'Git', icon: '📦', color: '#F05032', orbit: 260, speed: .15 },
  ];

  // Distribute angles evenly per orbit
  const orbitGroups = {};
  techs.forEach(t => {
    if (!orbitGroups[t.orbit]) orbitGroups[t.orbit] = [];
    orbitGroups[t.orbit].push(t);
  });
  Object.values(orbitGroups).forEach(group => {
    group.forEach((t, i) => {
      t.angle = (i / group.length) * Math.PI * 2;
      t.baseAngle = t.angle;
    });
  });

  let W = 0, H = 0, cx = 0, cy = 0;
  let mouseX = null, mouseY = null;
  let hoveredTech = null;
  let rafId, running = true;

  function resize() {
    const r = container.getBoundingClientRect();
    W = canvas.width = r.width;
    H = canvas.height = r.height;
    cx = W / 2; cy = H / 2;
  }
  resize();
  window.addEventListener('resize', resize);

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouseX = null; mouseY = null; hoveredTech = null; });

  let t = 0;

  function draw() {
    if (!running) return;
    t += .008;
    ctx.clearRect(0, 0, W, H);

    // Draw orbit rings
    Object.keys(orbitGroups).forEach(orbit => {
      const r = parseFloat(orbit) * Math.min(W, H) / 620;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(26,111,244,.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    hoveredTech = null;

    techs.forEach(tech => {
      const scale = Math.min(W, H) / 620;
      const r = tech.orbit * scale;
      tech.angle = tech.baseAngle + t * tech.speed;

      // Mouse attraction
      if (mouseX !== null) {
        const techX = cx + Math.cos(tech.angle) * r;
        const techY = cy + Math.sin(tech.angle) * r;
        const dx = mouseX - techX;
        const dy = mouseY - techY;
        const dist = Math.hypot(dx, dy);
        if (dist < 60) {
          hoveredTech = tech;
          tech.angle += (dist < 30 ? .04 : .02) * Math.sign(dx + dy);
        }
      }

      const x = cx + Math.cos(tech.angle) * r;
      const y = cy + Math.sin(tech.angle) * r;
      const isHovered = hoveredTech === tech;

      // Connecting line to center
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      const gradient = ctx.createLinearGradient(cx, cy, x, y);
      gradient.addColorStop(0, 'rgba(26,111,244,.0)');
      gradient.addColorStop(1, isHovered ? tech.color + 'CC' : 'rgba(26,111,244,.12)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = isHovered ? 1.5 : .8;
      ctx.stroke();

      // Node
      const nodeR = isHovered ? 20 : 15;
      ctx.beginPath();
      ctx.arc(x, y, nodeR, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? tech.color + '33' : 'rgba(26,111,244,.1)';
      ctx.fill();
      ctx.strokeStyle = isHovered ? tech.color : 'rgba(26,111,244,.25)';
      ctx.lineWidth = isHovered ? 1.5 : 1;
      ctx.stroke();

      // Icon text
      ctx.font = `${isHovered ? 14 : 11}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tech.icon, x, y);

      // Label
      if (isHovered) {
        const lw = ctx.measureText(tech.name).width + 16;
        const lx = x, ly = y - nodeR - 16;
        ctx.fillStyle = 'rgba(13,27,62,.85)';
        roundRect(ctx, lx - lw/2, ly - 10, lw, 20, 6);
        ctx.fill();
        ctx.font = '500 10px Inter, sans-serif';
        ctx.fillStyle = '#fff';
        ctx.fillText(tech.name, lx, ly);
      }
    });

    // Center pulse ring
    const pulse = .5 + .5 * Math.sin(t * 2);
    ctx.beginPath();
    ctx.arc(cx, cy, 40 + pulse * 8, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(26,111,244,${.06 + pulse * .04})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Floating particles
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + t * .2;
      const pr = 55 + Math.sin(t * 1.5 + i) * 8;
      const px = cx + Math.cos(angle) * pr;
      const py = cy + Math.sin(angle) * pr;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96,165,250,${.3 + .3 * Math.sin(t * 2 + i)})`;
      ctx.fill();
    }

    rafId = requestAnimationFrame(draw);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  requestAnimationFrame(draw);

  new IntersectionObserver(e => {
    running = e[0].isIntersecting;
    if (running) rafId = requestAnimationFrame(draw);
    else cancelAnimationFrame(rafId);
  }, { threshold: 0 }).observe(container);
}

/* ══════════════════════════════════════════
   TRANSITION SECTION — scroll reveals
   ══════════════════════════════════════════ */
function initTransitionSection() {
  const section = document.getElementById('transition-story');
  if (!section) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.ts-card').forEach((card, i) => {
          setTimeout(() => card.classList.add('ts-visible'), i * 120);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .1 });
  obs.observe(section);
}

/* ══════════════════════════════════════════
   TS CARD TILT
   ══════════════════════════════════════════ */
function initTsCardTilt() {
  if (!window.matchMedia('(hover:hover)').matches) return;
  document.querySelectorAll('.ts-card,.ts-skill-block,.ts-callout').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.setProperty('--tiltX', `${-y * 6}deg`);
      card.style.setProperty('--tiltY', `${x * 6}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tiltX', '0deg');
      card.style.setProperty('--tiltY', '0deg');
    });
  });
}

/* ══════════════════════════════════════════
   TS COUNTERS — count up on reveal
   ══════════════════════════════════════════ */
function initTsCounters() {
  document.querySelectorAll('[data-ts-count]').forEach(el => {
    const target = parseInt(el.dataset.tsCount);
    const suffix = el.dataset.tsSuffix || '';
    let fired = false;
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !fired) {
        fired = true;
        const dur = 1400, start = performance.now();
        const step = ts => {
          const p = Math.min((ts - start) / dur, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        el.textContent = '0' + suffix;
        requestAnimationFrame(step);
      }
    }, { threshold: .6 }).observe(el);
  });
}

/* ══════════════════════════════════════════
   TS TIMELINE LINE — draw on scroll
   ══════════════════════════════════════════ */
function initTsTimelineLine() {
  const tl = document.querySelector('.ts-timeline');
  if (!tl) return;
  new IntersectionObserver(e => {
    if (e[0].isIntersecting) tl.classList.add('line-drawn');
  }, { threshold: .2 }).observe(tl);
}
;
/* ===== transition.js ===== */
// Transition section: scroll-triggered card reveals, timeline fill, number counters
(function(){
  function init(){
    var timeline=document.getElementById('trTimeline');
    if(!timeline) return;
    var cards=timeline.querySelectorAll('.tr-card');
    var fill=document.getElementById('trLineFill');

    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('tr-in');io.unobserve(e.target)}
      });
    },{threshold:.18,rootMargin:'0px 0px -60px 0px'});
    cards.forEach(function(c){io.observe(c)});

    function updateLine(){
      var rect=timeline.getBoundingClientRect();
      var vh=window.innerHeight||document.documentElement.clientHeight;
      var start=rect.top-vh*.6;
      var total=rect.height+vh*.4;
      var progress=Math.min(1,Math.max(0,-start/total));
      if(fill) fill.style.height=(progress*100)+'%';
    }
    updateLine();
    window.addEventListener('scroll',updateLine,{passive:true});
    window.addEventListener('resize',updateLine);

    // Counters
    var counters=document.querySelectorAll('#transition .tr-count-n');
    var cio=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting) return;
        var el=e.target;
        var target=parseInt(el.getAttribute('data-count')||'0',10);
        var suffix=el.getAttribute('data-suffix')||'';
        var dur=1400, start=performance.now();
        function step(t){
          var p=Math.min(1,(t-start)/dur);
          var eased=1-Math.pow(1-p,3);
          el.textContent=Math.round(target*eased)+suffix;
          if(p<1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    },{threshold:.5});
    counters.forEach(function(c){cio.observe(c)});
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}else{init()}
})();
;
/* ===== premium.js ===== */
/**
 * PREMIUM.JS — Landonorris-inspired interactions
 * Layered stack transforms · Immersive clip reveals · Explode-on-hover text
 * Vertical auto-marquee columns · Cursor-follow light · Section pin-scale
 * Image mask reveals · Word explosion · Scroll velocity tilt
 */

(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const hover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const mobile = window.innerWidth < 900;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(init);

  function init() {
    if (reduce) return;
    injectStyles();
    layerStackScroll();
    immersiveReveal();
    heroCursorLight();
    explodeOnHover();
    verticalColumnMarquee();
    imageMaskReveal();
    scrollVelocitySkew();
    magneticProjectTitles();
    sectionPinScale();
    ambientOrbBackdrop();
    touchAdapt();
  }

  /* ─────────── Touchscreen adapter — mirrors hover/magnetic effects via touch ─────────── */
  function touchAdapt() {
    const isTouch = matchMedia('(hover:none), (pointer:coarse)').matches || 'ontouchstart' in window;
    if (!isTouch) return;

    const MAG_SEL = '.bf,.ncta,.back-to-top,.cf-btn,.pc,.bento,.rm,.sk,.ec,.ct-lk,.pcl,.chip,.sb';
    const nodes = document.querySelectorAll(MAG_SEL);

    nodes.forEach((el) => {
      let raf = 0, ox = 0, oy = 0, tx = 0, ty = 0, active = false;
      const lerp = (a, b, n) => a + (b - a) * n;

      const step = () => {
        ox = lerp(ox, tx, 0.18);
        oy = lerp(oy, ty, 0.18);
        el.style.setProperty('--mx', ox.toFixed(2) + 'px');
        el.style.setProperty('--my', oy.toFixed(2) + 'px');
        el.style.setProperty('--tiltX', (-oy * 0.4).toFixed(2) + 'deg');
        el.style.setProperty('--tiltY', (ox * 0.4).toFixed(2) + 'deg');
        if (active || Math.abs(ox - tx) > 0.1 || Math.abs(oy - ty) > 0.1) {
          raf = requestAnimationFrame(step);
        } else {
          el.style.removeProperty('--mx'); el.style.removeProperty('--my');
          el.style.removeProperty('--tiltX'); el.style.removeProperty('--tiltY');
        }
      };

      const onMove = (e) => {
        const t = e.touches ? e.touches[0] : e;
        if (!t) return;
        const r = el.getBoundingClientRect();
        // ignore if touch drifted off the element
        if (t.clientX < r.left - 20 || t.clientX > r.right + 20 ||
            t.clientY < r.top - 20 || t.clientY > r.bottom + 20) return;
        tx = (t.clientX - r.left - r.width / 2) * 0.28;
        ty = (t.clientY - r.top - r.height / 2) * 0.28;
        el.classList.add('spotlight-active');
        el.style.setProperty('--spotX', (t.clientX - r.left) + 'px');
        el.style.setProperty('--spotY', (t.clientY - r.top) + 'px');
        if (!raf) raf = requestAnimationFrame(step);
      };

      const onStart = (e) => {
        active = true;
        document.body.setAttribute('data-cursor', 'hover');
        onMove(e);
      };
      const onEnd = () => {
        active = false;
        tx = 0; ty = 0;
        el.classList.remove('spotlight-active');
        document.body.removeAttribute('data-cursor');
        if (!raf) raf = requestAnimationFrame(step);
      };

      el.addEventListener('touchstart', onStart, { passive: true });
      el.addEventListener('touchmove', onMove, { passive: true });
      el.addEventListener('touchend', onEnd, { passive: true });
      el.addEventListener('touchcancel', onEnd, { passive: true });
    });

    // Cursor-follow hero light on touch
    const hero = document.querySelector('#home') || document.querySelector('.hero-wrap');
    const light = hero && hero.querySelector('.pr-hero-light');
    if (hero && !light) {
      const l = document.createElement('div');
      l.className = 'pr-hero-light';
      hero.style.position = hero.style.position || 'relative';
      hero.appendChild(l);
    }
    if (hero) {
      const l = hero.querySelector('.pr-hero-light');
      const onT = (e) => {
        const t = e.touches ? e.touches[0] : e;
        if (!t) return;
        const r = hero.getBoundingClientRect();
        l.style.setProperty('--lx', (t.clientX - r.left) + 'px');
        l.style.setProperty('--ly', (t.clientY - r.top) + 'px');
        l.style.opacity = '1';
      };
      hero.addEventListener('touchstart', onT, { passive: true });
      hero.addEventListener('touchmove', onT, { passive: true });
      hero.addEventListener('touchend', () => (l.style.opacity = '0'), { passive: true });
    }

    // Trigger letter-explode on tap for big titles
    document.querySelectorAll('.stitle, .h1').forEach((el) => {
      el.addEventListener('touchstart', () => {
        el.querySelectorAll('.pr-ch').forEach((ch) => {
          const dx = (Math.random() - 0.5) * 14;
          const dy = (Math.random() - 0.5) * 14;
          const rot = (Math.random() - 0.5) * 22;
          ch.style.transform = `translate(${dx}px,${dy}px) rotate(${rot}deg)`;
        });
        setTimeout(() => {
          el.querySelectorAll('.pr-ch').forEach((ch) => (ch.style.transform = ''));
        }, 700);
      }, { passive: true });
    });
  }


  /* ─────────── 1. Layered stack scroll (sections lift & scale like LN cards) ─────────── */
  function layerStackScroll() {
    const targets = document.querySelectorAll('#about, #experience, #skills, #projects, #transition, #roadmap, #contact');
    if (!targets.length) return;
    let ticking = false;
    function update() {
      const vh = window.innerHeight;
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const p = 1 - Math.min(1, Math.max(0, (r.top + r.height * 0.15) / vh));
        const scale = 0.96 + p * 0.04;
        const y = (1 - p) * 24;
        el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
        el.style.transformOrigin = 'center top';
        el.style.willChange = 'transform';
      });
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ─────────── 2. Immersive clip-path reveal on section headings ─────────── */
  function immersiveReveal() {
    const els = document.querySelectorAll('.stitle, .h1, .elk-showcase, .ts-callout, .role-panel, .ec, .rm, .bento, .pc');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add('pr-immersive');
        io.unobserve(el);
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  }

  /* ─────────── 3. Cursor-follow light on hero ─────────── */
  function heroCursorLight() {
    if (!hover || mobile) return;
    const hero = document.querySelector('#home') || document.querySelector('.hero-wrap') || document.querySelector('header');
    if (!hero) return;
    const light = document.createElement('div');
    light.className = 'pr-hero-light';
    hero.style.position = hero.style.position || 'relative';
    hero.appendChild(light);
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      light.style.setProperty('--lx', (e.clientX - r.left) + 'px');
      light.style.setProperty('--ly', (e.clientY - r.top) + 'px');
      light.style.opacity = '1';
    });
    hero.addEventListener('mouseleave', () => (light.style.opacity = '0'));
  }

  /* ─────────── 4. Explode-on-hover for big titles ─────────── */
  function explodeOnHover() {
    if (!hover) return;
    document.querySelectorAll('.stitle, .h1').forEach((el) => {
      if (el.dataset.exploded) return;
      const walk = (node) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split('').forEach((ch) => {
              if (ch === ' ') return frag.appendChild(document.createTextNode(' '));
              const s = document.createElement('span');
              s.className = 'pr-ch';
              s.textContent = ch;
              frag.appendChild(s);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1 && !n.classList.contains('pr-ch')) walk(n);
        });
      };
      walk(el);
      el.dataset.exploded = '1';
      el.addEventListener('mouseenter', () => {
        el.querySelectorAll('.pr-ch').forEach((ch) => {
          const dx = (Math.random() - 0.5) * 14;
          const dy = (Math.random() - 0.5) * 14;
          const rot = (Math.random() - 0.5) * 22;
          ch.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
        });
      });
      el.addEventListener('mouseleave', () => {
        el.querySelectorAll('.pr-ch').forEach((ch) => (ch.style.transform = ''));
      });
    });
  }

  /* ─────────── 5. Vertical column marquee for skills (LN driver grid) ─────────── */
  function verticalColumnMarquee() {
    const grid = document.querySelector('.sk-grid-logo, .sk-grid, .skills-grid');
    if (!grid || mobile) return;
    // Only decorate if it has enough children
    if (grid.children.length < 4) return;
    grid.classList.add('pr-vmarquee');
  }

  /* ─────────── 6. Image mask reveal for photos and covers ─────────── */
  function imageMaskReveal() {
    const imgs = document.querySelectorAll('img, .hero-photo, .pc-media, .avatar, .pf');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('pr-mask-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    imgs.forEach((el) => {
      el.classList.add('pr-mask');
      io.observe(el);
    });
  }

  /* ─────────── 7. Scroll velocity skew on cards ─────────── */
  function scrollVelocitySkew() {
    if (mobile) return;
    const targets = document.querySelectorAll('.pc, .bento, .rm, .ec');
    let last = window.scrollY, v = 0, raf;
    function tick() {
      const cur = window.scrollY;
      v = (cur - last) * 0.06;
      v = Math.max(-6, Math.min(6, v));
      last = cur;
      targets.forEach((el) => {
        el.style.setProperty('--pr-skew', v.toFixed(2) + 'deg');
      });
      // decay
      v *= 0.9;
      raf = requestAnimationFrame(tick);
    }
    tick();
  }

  /* ─────────── 8. Magnetic project titles ─────────── */
  function magneticProjectTitles() {
    if (!hover) return;
    document.querySelectorAll('.pc h3, .pc .pc-title, .bento h3').forEach((t) => {
      const parent = t.closest('.pc, .bento');
      if (!parent) return;
      parent.addEventListener('mousemove', (e) => {
        const r = parent.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.06;
        const dy = (e.clientY - r.top - r.height / 2) * 0.06;
        t.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      parent.addEventListener('mouseleave', () => (t.style.transform = ''));
    });
  }

  /* ─────────── 9. Section pin-scale for the transition callout ─────────── */
  function sectionPinScale() {
    const el = document.querySelector('#transition .ts-callout, #transition .tr-callout');
    if (!el) return;
    window.addEventListener('scroll', () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = 1 - Math.min(1, Math.max(0, (r.top - vh * 0.2) / vh));
      const scale = 0.92 + p * 0.08;
      el.style.transform = `scale(${scale.toFixed(4)})`;
    }, { passive: true });
  }

  /* ─────────── 10. Ambient orb backdrop that reacts to scroll ─────────── */
  function ambientOrbBackdrop() {
    if (mobile) return;
    const orb = document.createElement('div');
    orb.className = 'pr-orb';
    document.body.appendChild(orb);
    const orb2 = document.createElement('div');
    orb2.className = 'pr-orb pr-orb-2';
    document.body.appendChild(orb2);
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      orb.style.transform = `translate3d(${Math.sin(y * 0.002) * 60}px, ${y * 0.15}px, 0)`;
      orb2.style.transform = `translate3d(${Math.cos(y * 0.002) * 80}px, ${y * -0.1}px, 0)`;
    }, { passive: true });
  }

  /* ─────────── Styles ─────────── */
  function injectStyles() {
    if (document.getElementById('pr-styles')) return;
    const s = document.createElement('style');
    s.id = 'pr-styles';
    s.textContent = `
      /* Layered stack scroll — smooth transform sections */
      #about,#experience,#skills,#projects,#transition,#roadmap,#contact{
        transition: transform .6s cubic-bezier(.22,1,.36,1);
      }

      /* Immersive reveal */
      .pr-immersive{ animation: prClipIn .9s cubic-bezier(.22,1,.36,1) both; }
      @keyframes prClipIn{
        0%{ clip-path: inset(12% 8% 12% 8% round 16px); opacity:.35; filter: blur(6px); transform: translateY(24px);}
        100%{ clip-path: inset(0 0 0 0 round 0); opacity:1; filter: blur(0); transform:none;}
      }

      /* Cursor-follow hero light */
      .pr-hero-light{
        position:absolute; inset:0; pointer-events:none; opacity:0;
        transition: opacity .4s ease;
        background: radial-gradient(520px circle at var(--lx,50%) var(--ly,50%),
          rgba(26,111,244,.18), rgba(96,165,250,.06) 35%, transparent 60%);
        mix-blend-mode: screen; z-index:2;
      }

      /* Explode letters */
      .pr-ch{ display:inline-block; transition: transform .5s cubic-bezier(.34,1.56,.64,1); will-change: transform;}

      /* Vertical marquee */
      @keyframes prVertScroll{
        0%{ transform: translateY(0);}
        100%{ transform: translateY(-50%);}
      }
      .pr-vmarquee{ position:relative; }
      .pr-vmarquee > *{ transition: transform .5s cubic-bezier(.22,1,.36,1); }

      /* Image mask reveal */
      .pr-mask{ clip-path: inset(0 0 100% 0); transition: clip-path 1s cubic-bezier(.77,0,.18,1), transform 1s cubic-bezier(.77,0,.18,1); transform: scale(1.06);}
      .pr-mask-in{ clip-path: inset(0 0 0 0); transform: scale(1);}

      /* Scroll velocity skew */
      .pc,.bento,.rm,.ec{ transform-origin: center center; }
      .pc{ transform: skewY(var(--pr-skew,0deg)); }
      .bento{ transform: skewY(calc(var(--pr-skew,0deg) * 0.5)); }

      /* Ambient orbs */
      .pr-orb{
        position: fixed; top:-200px; left:-200px; width:520px; height:520px;
        border-radius:50%; pointer-events:none; z-index:0;
        background: radial-gradient(circle, rgba(26,111,244,.12), transparent 60%);
        filter: blur(60px);
      }
      .pr-orb-2{
        top:auto; bottom:-300px; left:auto; right:-200px;
        background: radial-gradient(circle, rgba(96,165,250,.10), transparent 60%);
      }
    `;
    document.head.appendChild(s);
  }
})();
;
/* ===== enhance.js ===== */
/* ══════════════════════════════════════════════════════════
   ENHANCE.JS
   - Restores native cursor (removes previous cursor-none override)
   - Hero "Explore" scroll-hint styling & auto-hide on scroll
   - Contact quick actions: copy-to-clipboard, live IST clock
   - Section entry notifications (toast) to boost engagement
   ══════════════════════════════════════════════════════════ */
(function () {
  if (typeof window === 'undefined') return;

  // ── inject styles ─────────────────────────────────────────
  const css = `
  /* Force visible native cursor everywhere */
  html, body { cursor: auto !important; }
  a, button, [role="button"], .ncta, .bf, .bo, .cf-btn, .sb,
  .ct-lk, .pc, .jn, .sk-tab, .chip { cursor: pointer !important; }
  input, textarea, select { cursor: text !important; }
  #m-cursor, #m-cursor-dot, #cursor-dot, #cursor-ring, #ai-cursor { display: none !important; }

  /* ── Hero explore hint ── */
  .hero-explore{
    position:absolute; left:50%; bottom:22px; transform:translateX(-50%);
    display:inline-flex; align-items:center; gap:.7rem;
    padding:.55rem .55rem .55rem .7rem;
    background:rgba(255,255,255,.7); backdrop-filter: blur(10px);
    border:1.5px solid var(--bdr2, rgba(26,111,244,.25));
    border-radius:999px; color:var(--ink,#0d1b3e);
    text-decoration:none; font-family:var(--fb, inherit);
    box-shadow: 0 8px 24px rgba(13,27,62,.12), 0 2px 0 rgba(26,111,244,.15);
    transition: transform .35s cubic-bezier(.2,.9,.2,1.2), box-shadow .3s, opacity .5s, background .3s;
    z-index: 40; opacity:0; animation: heHintIn .8s .8s forwards ease-out;
  }
  .hero-explore:hover{ transform:translateX(-50%) translateY(-3px); background:#fff; }
  .hero-explore.hidden{ opacity:0; pointer-events:none; transform:translateX(-50%) translateY(20px);}
  .hex-ring{
    width:34px;height:34px;border-radius:50%;
    display:grid;place-items:center;
    background:var(--blue,#1a6ff4); color:#fff;
    box-shadow: 0 0 0 3px rgba(26,111,244,.18), 0 6px 14px rgba(26,111,244,.35);
    position:relative;
  }
  .hex-ring::before{
    content:''; position:absolute; inset:-4px; border-radius:50%;
    border:1.5px dashed rgba(26,111,244,.45); animation: heSpin 8s linear infinite;
  }
  .hex-text{ display:flex; flex-direction:column; line-height:1.15; padding-right:.2rem;}
  .hex-label{ font-size:.72rem; font-weight:700; letter-spacing:.14em; color:var(--ink,#0d1b3e);}
  .hex-sub{ font-size:.62rem; font-weight:500; color:var(--muted,#5c6b8a); letter-spacing:.06em;}
  .hex-arrow{
    width:28px;height:28px;border-radius:50%;
    display:grid;place-items:center;
    background:rgba(26,111,244,.09); color:var(--blue,#1a6ff4);
    animation: heBounce 1.6s ease-in-out infinite;
  }
  @keyframes heBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }
  @keyframes heSpin { to { transform: rotate(360deg);} }
  @keyframes heHintIn { to { opacity:1; } }
  @media (max-width: 700px){
    .hero-explore{ bottom:14px; padding:.4rem .45rem .4rem .55rem; }
    .hex-sub{ display:none; }
  }

  /* ── Contact quick actions ── */
  .ct-quick{
    display:grid; grid-template-columns:1fr 1fr; gap:.55rem; margin: .2rem 0 1rem;
  }
  @media (max-width:520px){ .ct-quick{ grid-template-columns:1fr; } }
  .ctq{
    display:flex; align-items:center; gap:.65rem;
    padding:.65rem .75rem;
    background: linear-gradient(145deg,#fff,rgba(240,247,255,.85));
    border:1.5px solid var(--bdr2, rgba(26,111,244,.18));
    border-radius:12px; text-decoration:none; color:var(--ink,#0d1b3e);
    font-family:var(--fb, inherit); text-align:left;
    box-shadow: 0 3px 0 rgba(13,27,62,.05), 0 6px 16px rgba(13,27,62,.06);
    transition: transform .25s cubic-bezier(.2,.9,.2,1.2), box-shadow .25s, border-color .25s, background .25s;
    cursor:pointer; position:relative; overflow:hidden;
  }
  .ctq::after{
    content:''; position:absolute; inset:0;
    background: radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(26,111,244,.14), transparent 60%);
    opacity:0; transition: opacity .3s; pointer-events:none;
  }
  .ctq:hover{ transform: translateY(-3px); border-color: var(--blue,#1a6ff4); box-shadow: 0 6px 0 rgba(13,27,62,.06), 0 14px 28px rgba(26,111,244,.16);}
  .ctq:hover::after{ opacity:1; }
  .ctq:active{ transform: translateY(-1px) scale(.99); }
  .ctq-ic{
    flex:0 0 34px; width:34px; height:34px; border-radius:10px;
    display:grid; place-items:center; font-size:.95rem; font-weight:800;
    background: rgba(26,111,244,.08); color: var(--blue,#1a6ff4);
    border:1px solid rgba(26,111,244,.22);
  }
  .ctq-t{ display:flex; flex-direction:column; line-height:1.2; min-width:0;}
  .ctq-t b{ font-size:.8rem; font-weight:700;}
  .ctq-t em{ font-size:.68rem; font-style:normal; color:var(--muted,#5c6b8a);}
  .ctq.copied{ border-color:#22c55e; background: rgba(34,197,94,.08); }
  .ctq.copied .ctq-ic{ background:rgba(34,197,94,.15); color:#16a34a; border-color:rgba(34,197,94,.4);}

  .ct-status{
    display:flex; align-items:center; gap:.55rem;
    font-size:.72rem; color:var(--muted,#5c6b8a);
    padding:.55rem .8rem; margin-bottom:1rem;
    background: rgba(34,197,94,.06);
    border:1px solid rgba(34,197,94,.22); border-radius:10px;
  }
  .ct-status b{ color:#15803d;}
  .ct-dot{
    width:8px;height:8px;border-radius:50%; background:#22c55e;
    box-shadow:0 0 0 4px rgba(34,197,94,.18);
    animation: ctPulse 1.6s ease-in-out infinite;
  }
  @keyframes ctPulse { 0%,100%{box-shadow:0 0 0 4px rgba(34,197,94,.18);} 50%{box-shadow:0 0 0 8px rgba(34,197,94,0);} }

  /* ── Notifications ── */
  .np-wrap{
    position: fixed; right: 18px; bottom: 18px; z-index: 9999;
    display:flex; flex-direction:column; gap:10px; pointer-events:none;
    max-width: min(340px, calc(100vw - 32px));
  }
  @media (max-width: 640px){
    .np-wrap{
      right: 12px; bottom: 12px; left: auto;
      transform: none;
      width: min(260px, calc(100vw - 82px));
      max-width: none;
    }
  }
  .np-toast{
    pointer-events:auto;
    display:flex; align-items:flex-start; gap:.7rem;
    padding: .7rem .85rem .75rem .8rem;
    background: rgba(13,27,62,.94); color:#eaf1ff;
    border:1px solid rgba(124,196,255,.28);
    border-left: 3px solid #7cc4ff;
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(13,27,62,.35), 0 2px 0 rgba(124,196,255,.15);
    font-family: var(--fb, inherit); font-size:.78rem; line-height:1.35;
    transform: translateX(20px); opacity:0;
    animation: npIn .35s cubic-bezier(.2,.9,.2,1.2) forwards;
    backdrop-filter: blur(6px);
  }
  .np-toast.out { animation: npOut .3s ease-in forwards; }
  .np-toast .np-ic{
    flex:0 0 28px; width:28px; height:28px; border-radius:8px;
    display:grid; place-items:center; font-size:.9rem;
    background: rgba(124,196,255,.15); border:1px solid rgba(124,196,255,.32);
  }
  .np-toast b{ display:block; font-weight:700; font-size:.78rem; margin-bottom:2px; color:#fff;}
  .np-toast em{ font-style:normal; color:rgba(234,241,255,.72); font-size:.72rem;}
  .np-toast a.np-cta{
    color:#7cc4ff; text-decoration:none; font-weight:600; margin-left:.35rem;
    border-bottom:1px dashed rgba(124,196,255,.45);
  }
  .np-toast .np-x{
    background:none; border:none; color:rgba(234,241,255,.55);
    cursor:pointer; padding:0 .1rem; font-size:1rem; line-height:1;
    margin-left:auto; align-self:flex-start;
  }
  .np-toast .np-x:hover{ color:#fff;}
  .np-bar{
    position:absolute; left:0; bottom:0; height:2px;
    background: linear-gradient(90deg,#7cc4ff,#a78bfa);
    animation: npBar 5s linear forwards;
    border-radius:0 0 12px 12px;
  }
  @keyframes npIn  { to { transform:translateX(0); opacity:1; } }
  @keyframes npOut { to { transform:translateX(20px); opacity:0; } }
  @keyframes npBar { from { width:100%; } to { width:0%; } }
  @media (max-width: 500px){ .np-wrap{ right:10px; bottom:10px; left:10px; max-width:none; } }
  `;
  const style = document.createElement('style');
  style.id = 'enhance-style';
  style.textContent = css;
  document.head.appendChild(style);

  // ── Hero explore hint: hide when hero exits view ──────────
  const hint = document.querySelector('.hero-explore');
  if (hint) {
    const onScroll = () => {
      if (window.scrollY > 120) hint.classList.add('hidden');
      else hint.classList.remove('hidden');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Contact quick actions ─────────────────────────────────
  document.querySelectorAll('.ctq').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    const copy = el.getAttribute('data-copy');
    if (copy) {
      el.addEventListener('click', async (e) => {
        e.preventDefault();
        try { await navigator.clipboard.writeText(copy); } catch (_) {}
        el.classList.add('copied');
        const t = el.querySelector('.ctq-t b');
        const old = t ? t.textContent : '';
        if (t) t.textContent = 'Copied ✓';
        notify({ ic: '✓', title: 'Email copied', body: copy + ' — paste it anywhere.' });
        setTimeout(() => { if (t) t.textContent = old; el.classList.remove('copied'); }, 1800);
      });
    }
  });

  // ── Live IST clock ────────────────────────────────────────
  const clock = document.getElementById('ct-clock');
  if (clock) {
    const fmt = () => {
      const now = new Date();
      const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
      const h = String(ist.getHours()).padStart(2, '0');
      const m = String(ist.getMinutes()).padStart(2, '0');
      clock.textContent = `${h}:${m}`;
    };
    fmt(); setInterval(fmt, 30000);
  }

  // ── Notifications ─────────────────────────────────────────
  let wrap = document.querySelector('.np-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'np-wrap'; document.body.appendChild(wrap); }

  function notify({ ic = '★', title, body, cta, href, ttl = 5000 }) {
    const maxVisible = 2;
    const all = Array.from(wrap.children);
    while (all.length >= maxVisible) { all.shift().remove(); }
    const t = document.createElement('div');
    t.className = 'np-toast';
    t.innerHTML = `
      <div class="np-ic">${ic}</div>
      <div style="min-width:0"><b>${title}</b><em>${body}${cta && href ? ` <a class="np-cta" href="${href}">${cta} →</a>` : ''}</em></div>
      <button class="np-x" aria-label="Dismiss">×</button>
      <span class="np-bar"></span>`;
    const close = () => { t.classList.add('out'); setTimeout(() => t.remove(), 300); };
    t.querySelector('.np-x').addEventListener('click', close);
    wrap.appendChild(t);
    setTimeout(close, ttl);
  }
  window.__notify = notify;

  // Welcome nudge — wait until the page has fully loaded AND the
  // transition/loading overlay is gone so it never appears during the
  // pre-load screen. Also require the tab to be visible.
  function fireWelcome() {
    if (document.hidden) {
      document.addEventListener('visibilitychange', fireWelcome, { once: true });
      return;
    }
    // Guard against any lingering full-screen loader/transition element
    const overlay = document.querySelector(
      '#m-loader, .page-transition.active, .loading-screen, .preloader, [data-loading="true"]'
    );
    if (overlay && getComputedStyle(overlay).display !== 'none' &&
        getComputedStyle(overlay).opacity !== '0') {
      setTimeout(fireWelcome, 400);
      return;
    }
    notify({
      ic: '👋', title: 'Welcome — I\'m Arun',
      body: 'Scroll to explore. Six sections, ~2 min read.',
      cta: 'Start', href: '#about', ttl: 6000,
    });
  }
  function scheduleWelcome() { setTimeout(fireWelcome, 1800); }
  if (document.readyState === 'complete') scheduleWelcome();
  else window.addEventListener('load', scheduleWelcome, { once: true });


  // Section-entry hints
  const hints = {
    about:      { ic: '👤', title: 'About',      body: 'Who I am and how I got here.' },
    transition: { ic: '🧭', title: 'The Journey', body: 'SEO → Automation → Programming → Backend.' },
    experience: { ic: '💼', title: 'Experience',  body: '4+ yrs shipping in production.' },
    skills:     { ic: '⚡', title: 'Skills',      body: 'ELK, Python, LLMs, RAG, FastAPI.' },
    projects:   { ic: '🚀', title: 'Projects',    body: 'Hover a card to inspect a build.' },
    roadmap:    { ic: '🗺️', title: 'Roadmap',     body: 'Where I\'m headed — AI integration.' },
    contact:    { ic: '✉️', title: 'Let\'s talk',  body: 'Copy my email or book a 20-min call.', cta: 'Book call', href: 'https://cal.com/arunagarwal' },
  };
  const seen = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const id = en.target.id;
      if (!id || seen.has(id) || !hints[id]) return;
      seen.add(id);
      notify(hints[id]);
    });
  }, { threshold: 0.35 });
  Object.keys(hints).forEach((id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });

  // Progress-milestone nudge
  let milestoneHit = false;
  window.addEventListener('scroll', () => {
    if (milestoneHit) return;
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (pct > 0.75) {
      milestoneHit = true;
      notify({ ic: '🎯', title: 'Almost there', body: 'You\'ve seen the work — say hi below.', cta: 'Contact', href: '#contact', ttl: 6000 });
    }
  }, { passive: true });
})();
;
/* ===== premium-redesign.js ===== */
/* ══════════════════════════════════════════════════════════
   PREMIUM REDESIGN — motion layer
   - Scroll progress bar
   - Active section pill on nav
   - Nav shadow on scroll
   - Card mouse-follow spotlight (--mx/--my)
   - 3D tilt on premium cards
   All GPU-only, single rAF loop, honors prefers-reduced-motion.
   ══════════════════════════════════════════════════════════ */
(function () {
  if (typeof window === 'undefined') return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Scroll progress ──────────────────────────────────────
  const bar = document.createElement('div');
  bar.className = 'pr-progress';
  document.body.appendChild(bar);

  // ── Nav elements ─────────────────────────────────────────
  const nav = document.querySelector('nav.n, header nav.n, .n');
  const navLinks = Array.from(document.querySelectorAll('.nl a[href^="#"]'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct + '%';
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);

    // active section: whichever section top is nearest above 30% viewport
    if (sections.length) {
      const y = window.scrollY + window.innerHeight * 0.32;
      let active = sections[0];
      for (const sec of sections) {
        if (sec.offsetTop <= y) active = sec;
      }
      const id = active && active.id;
      navLinks.forEach((a) => {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
      });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  // ── Card spotlight + tilt ────────────────────────────────
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    const cards = document.querySelectorAll('.pc, .bento, .sk, .ec, .ct-w, .rm');
    cards.forEach((el) => {
      let raf = 0;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        el.style.setProperty('--mx', x + 'px');
        el.style.setProperty('--my', y + 'px');
        const px = (x / r.width - 0.5) * 2;
        const py = (y / r.height - 0.5) * 2;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transform = `translateY(-6px) perspective(900px) rotateX(${(-py * 3).toFixed(2)}deg) rotateY(${(px * 3).toFixed(2)}deg)`;
        });
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }
})();

/* ── Reveal safety net ────────────────────────────────────────────
   Some sections use .rv / .aline / .jpath which start hidden and rely
   on IntersectionObserver to add .in / .show. On tall sections or
   fast scrolls the observers can miss elements, leaving content
   invisible. This safety net guarantees anything scrolled near the
   viewport (or already above it) becomes visible. */
(function revealSafetyNet(){
  if (typeof window === 'undefined') return;
  const run = () => {
    const vh = window.innerHeight || 800;
    const reveal = (el, cls) => { if (!el.classList.contains(cls)) el.classList.add(cls); };
    document.querySelectorAll('.rv').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 1.15) reveal(el, 'in');
    });
    document.querySelectorAll('.stagger, .jpath').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 1.15) reveal(el, 'in');
    });
    const about = document.getElementById('about');
    if (about) {
      const r = about.getBoundingClientRect();
      if (r.top < vh) {
        document.querySelectorAll('.aline').forEach((line, i) => {
          if (!line.classList.contains('show')) setTimeout(() => line.classList.add('show'), i * 120);
        });
      }
    }
  };
  // Initial sweep after portfolio scripts init
  setTimeout(run, 300);
  setTimeout(run, 900);
  // Continuous safety on scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { run(); ticking = false; });
  }, { passive: true });
  // Absolute fallback: after 4s force-reveal everything still hidden
  setTimeout(() => {
    document.querySelectorAll('.rv:not(.in), .stagger:not(.in), .jpath:not(.in)').forEach(el => el.classList.add('in'));
    document.querySelectorAll('.aline:not(.show)').forEach(el => el.classList.add('show'));
  }, 4000);
})();
;
/* ===== norris-motion.js ===== */
/* norris-motion.js — motion inspired by landonorris.com
   - Split hero headline into per-word rise-in
   - Inject racing marquee under hero
   - Magnetic buttons (subtle pull toward cursor)
   - Bold volt cursor tag on interactive hover
   - Scroll-clip reveals for section titles
*/
(function(){
  if (window.__nxMotionLoaded) return;
  window.__nxMotionLoaded = true;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init(){
    splitHeadline();
    injectMarquee();
    magneticButtons();
    voltCursor();
    revealTitles();
  }

  /* ---------- 1. Split headline into words ---------- */
  function splitHeadline(){
    const h = document.querySelector('.hm-left .h1');
    if (!h || h.dataset.nxSplit) return;
    h.dataset.nxSplit = '1';
    // Preserve child element structure by walking text nodes only
    const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT, null);
    const nodes = []; let n;
    while ((n = walker.nextNode())) nodes.push(n);
    let idx = 0;
    nodes.forEach(node => {
      const text = node.nodeValue;
      if (!text.trim()) return;
      const frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(part)); return; }
        const word = document.createElement('span');
        word.className = 'nx-word';
        const inner = document.createElement('span');
        inner.textContent = part;
        inner.style.setProperty('--nx-d', (60 + idx*70) + 'ms');
        idx++;
        word.appendChild(inner);
        frag.appendChild(word);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  
  /* ---------- 3. Magnetic buttons ---------- */
  function magneticButtons(){
    if (reduce) return;
    const targets = document.querySelectorAll('.hero-merged .bp, .hero-merged .bo, .hero-merged .btn, .nav a.cta');
    targets.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top - r.height/2;
        el.style.transform = `translate(${x*0.22}px, ${y*0.28}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- 4. Volt cursor tag ---------- */
  function voltCursor(){
    if (reduce || matchMedia('(hover: none)').matches) return;
    const tag = document.createElement('div');
    tag.className = 'nx-cursor';
    tag.textContent = '';
    document.body.appendChild(tag);
    let x = 0, y = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });
    function loop(){
      tx += (x - tx) * 0.22;
      ty += (y - ty) * 0.22;
      tag.style.left = tx + 'px';
      tag.style.top = ty + 'px';
      requestAnimationFrame(loop);
    }
    loop();
    const map = [
      { sel: 'a[href^="mailto:"]', label: 'Email' },
      { sel: 'a[href*="github.com"]', label: 'GitHub' },
      { sel: 'a[href*="linkedin.com"]', label: 'LinkedIn' },
      { sel: '.bp, .btn-primary, [data-cta="hire"]', label: 'Hire →' },
      { sel: '.bo, .btn-outline', label: 'View →' },
      { sel: '.career-card, .exp-card, .project-card', label: 'Open' },
      { sel: '.aph, .hm-photo img', label: 'Arun' },
    ];
    document.addEventListener('mouseover', (e) => {
      for (const {sel, label} of map){
        if (e.target.closest(sel)){
          tag.textContent = label;
          tag.classList.add('is-on');
          return;
        }
      }
      tag.classList.remove('is-on');
    });
  }

  /* ---------- 5. Scroll reveal for section titles ---------- */
  function revealTitles(){
    if (reduce || !('IntersectionObserver' in window)) return;
    const titles = document.querySelectorAll('section h2, .section-title, .st-title');
    titles.forEach(t => t.classList.add('nx-reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting){
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    titles.forEach(t => io.observe(t));
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Wait a beat so premium-redesign.js has laid out first
    setTimeout(init, 60);
  }
})();
;
/* ===== norris-plus.js ===== */
/* NORRIS+ : keyboard-snap flash, 3D section reveals, AI status chip */
(function(){
  if (typeof window === 'undefined') return;

  /* 1. AI corner chip */
  function mountChip(){
    if (document.querySelector('.np-ai-chip')) return;
    var chip = document.createElement('a');
    chip.href = '#contact';
    chip.className = 'np-ai-chip';
    chip.setAttribute('aria-label','AI engineer status');
    chip.innerHTML = '<span class="dot" aria-hidden="true"></span><span>AI · Shipping</span>';
    document.body.appendChild(chip);
  }

  /* 2. 3D reveal-on-enter for every page-section */
  function initReveal(){
    var sections = document.querySelectorAll('section.page-section');
    if (!sections.length || !('IntersectionObserver' in window)) {
      sections.forEach(function(s){ s.classList.add('np-in'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){
          en.target.classList.add('np-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '-8% 0px -12% 0px', threshold: 0.05 });
    sections.forEach(function(s){ io.observe(s); });
    // Safety net after 2s
    setTimeout(function(){ sections.forEach(function(s){ s.classList.add('np-in'); }); }, 2200);
  }

  /* 3. Flash the section we land on with keyboard arrow keys */
  function initFlash(){
    document.addEventListener('keydown', function(e){
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var tag = document.activeElement && document.activeElement.tagName;
      if (['INPUT','TEXTAREA','SELECT'].indexOf(tag) !== -1) return;
      // Find section closest to viewport top after next tick (scroll happens in main.js)
      setTimeout(function(){
        var sections = Array.from(document.querySelectorAll('section.page-section'));
        var target = sections.reduce(function(best, s){
          var t = Math.abs(s.getBoundingClientRect().top - 80);
          return (!best || t < best.d) ? { el: s, d: t } : best;
        }, null);
        if (target && target.el){
          target.el.classList.remove('np-flash');
          void target.el.offsetWidth;
          target.el.classList.add('np-flash');
          setTimeout(function(){ target.el.classList.remove('np-flash'); }, 1000);
        }
      }, 350);
    });
  }

  function boot(){ mountChip(); initReveal(); initFlash(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
;
/* ===== brand-logos.js ===== */
/* Swap stylized skill SVGs with real brand logos (Simple Icons CDN).
   Falls back to the original inline SVG on error. */
(function () {
  // slug -> hex color (Simple Icons brand color)
  const MAP = {
    'Elasticsearch':   { slug: 'elasticsearch',    color: '005571' },
    'Logstash':        { slug: 'logstash',         color: 'F04E23' },
    'Kibana':          { slug: 'kibana',           color: '005571' },
    'Linux / Bash':    { slug: 'gnubash',          color: '4EAA25' },
    'Git / GitHub':    { slug: 'github',           color: '181717' },
    'Python 3.x':      { slug: 'python',           color: '3776AB' },
    'FastAPI':         { slug: 'fastapi',          color: '009688' },
    'Pydantic v2':     { slug: 'pydantic',         color: 'E92063' },
    'Docker':          { slug: 'docker',           color: '2496ED' },
    'OpenAI SDK':      { slug: 'openaigym',        color: '412991' },
    'LangChain':       { slug: 'langchain',        color: '1C3C3C' },
    'Anthropic SDK':   { slug: 'anthropic',        color: 'D97757' },
    'REST APIs':       { slug: 'fastapi',          color: '009688' },
    'Screaming Frog':  { slug: 'googlechrome',     color: '4285F4' },
    'Ahrefs':          { slug: 'semrush',          color: 'FF7139' },
    'Search Console':  { slug: 'googlesearchconsole', color: '458CF5' },
    'PageSpeed / CWV': { slug: 'pagespeedinsights', color: '4285F4' },
    'WordPress':       { slug: 'wordpress',        color: '21759B' },
    'Vector DBs':      { slug: 'qdrant',           color: 'DC244C' },
    'Cloud Deploy':    { slug: 'googlecloud',      color: '4285F4' },
    'LLM Agents':      { slug: 'openaigym',        color: '412991' },
    'PostgreSQL':      { slug: 'postgresql',       color: '4169E1' },
    'Async Python':    { slug: 'python',           color: '3776AB' },
    'CI/CD':           { slug: 'githubactions',    color: '2088FF' },
  };

  const init = () => {
    document.querySelectorAll('#skills .sk').forEach((card) => {
      if (card.dataset.brandDone === '1') return;
      const nameEl = card.querySelector('.sk-n');
      const wrap = card.querySelector('.sk-logo-wrap');
      const svg = card.querySelector('.sk-logo');
      if (!nameEl || !wrap || !svg) return;
      const name = nameEl.textContent.trim();
      const meta = MAP[name];
      if (!meta) return;

      const img = document.createElement('img');
      img.className = 'sk-brand-img';
      img.decoding = 'async';
      img.alt = name + ' logo';
      img.width = 32; img.height = 32;
      img.src = `https://cdn.simpleicons.org/${meta.slug}/${meta.color}`;
      img.style.opacity = '0';
      img.style.transition = 'opacity .35s ease';

      img.addEventListener('load', () => {
        svg.style.display = 'none';
        img.style.opacity = '1';
      });
      img.addEventListener('error', () => { img.remove(); /* keep original SVG */ });

      wrap.appendChild(img);
      card.dataset.brandDone = '1';
    });
  };

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
  // Re-run periodically to survive portfolio re-renders / hydration.
  [400, 900, 1600, 2800, 4500].forEach((t) => setTimeout(init, t));
  // Observe #skills for re-renders and re-inject.
  const armObserver = () => {
    const target = document.querySelector('#skills');
    if (!target) { setTimeout(armObserver, 500); return; }
    const mo = new MutationObserver(() => init());
    mo.observe(target, { childList: true, subtree: true });
  };
  armObserver();
})();

;
