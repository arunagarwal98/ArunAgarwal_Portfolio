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
