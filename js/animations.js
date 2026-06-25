/**
 * ANIMATIONS.JS — Canvas neural network · hero motion · card tilt ·
 * magnetic buttons · spotlight · particles · about photo tilt
 */
document.addEventListener('DOMContentLoaded', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const hasHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  initHeroCanvas();

  if (!reduce) {
    initHeroParticles();
    initWorkflowLitCycle();
    if (hasHover) {
      initHeroMotion();
      initMagneticButtons();
      initCardTilt('.pc', 5);
      initCardTilt('.sk', 4);
      initSpotlight('.pc');
      initAboutPhotoTilt();
      initEcTilt();
    }
  }
});

/* ══════════════════════════════════════════
   HERO CANVAS — animated neural node graph
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

  const COUNT = Math.min(46, Math.floor(canvas.width / 24));
  const MAX = 175;
  const BLUE = 'rgba(26,111,244,';
  const TEAL = 'rgba(96,165,250,';

  const nodes = Array.from({ length: COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - .5) * .32,
    vy: (Math.random() - .5) * .32,
    r: Math.random() * 1.8 + .7,
    phase: Math.random() * Math.PI * 2,
    variant: Math.random() > .6 ? 1 : 0
  }));

  let t = 0, rafId, running = true;
  let mx = -9999, my = -9999;

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mx = -9999; my = -9999; });

  function draw() {
    if (!running) return;
    t += .009;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < -20) n.x = canvas.width + 20;
      if (n.x > canvas.width + 20) n.x = -20;
      if (n.y < -20) n.y = canvas.height + 20;
      if (n.y > canvas.height + 20) n.y = -20;
      // cursor repel
      const dx = n.x - mx, dy = n.y - my, d = Math.hypot(dx, dy);
      if (d < 90 && d > 0) {
        const f = (90 - d) / 90 * .35;
        n.x += (dx / d) * f; n.y += (dy / d) * f;
      }
    });

    // edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d < MAX) {
          const alpha = (1 - d / MAX) * .13;
          const col = (nodes[i].variant || nodes[j].variant) ? TEAL : BLUE;
          ctx.beginPath();
          ctx.strokeStyle = col + alpha + ')';
          ctx.lineWidth = .65;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // nodes
    nodes.forEach(n => {
      const pulse = .4 + .6 * Math.sin(t * 1.2 + n.phase);
      const col = n.variant ? TEAL : BLUE;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = col + (pulse * .4) + ')';
      ctx.fill();
    });

    rafId = requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
  setTimeout(() => { canvas.style.opacity = '1'; }, 500);

  new IntersectionObserver(e => {
    running = e[0].isIntersecting;
    if (running) rafId = requestAnimationFrame(draw);
    else cancelAnimationFrame(rafId);
  }, { threshold: 0 }).observe(section);

  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 220); }, { passive: true });
}

/* ══════════════════════════════════════════
   HERO PARTICLES — floating orbs
   ══════════════════════════════════════════ */
function initHeroParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  const count = window.innerWidth < 768 ? 7 : 14;

  const style = document.createElement('style');
  style.textContent = `@keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1);opacity:.5}33%{transform:translate(var(--tx),var(--ty)) scale(1.15);opacity:.8}66%{transform:translate(calc(var(--tx)*-.6),calc(var(--ty)*.5)) scale(.85);opacity:.4}}`;
  document.head.appendChild(style);

  for (let i = 0; i < count; i++) {
    const orb = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const isBlue = Math.random() > .45;
    const tx = (Math.random() - .5) * 80;
    const ty = (Math.random() - .5) * 60;
    orb.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;border-radius:50%;
      left:${Math.random() * 100}%;top:${Math.random() * 100}%;pointer-events:none;
      background:${isBlue ? 'rgba(26,111,244,' : 'rgba(96,165,250,'}${Math.random() * .45 + .2});
      --tx:${tx}px;--ty:${ty}px;
      animation:orbFloat ${10 + Math.random() * 12}s ${Math.random() * -14}s ease-in-out infinite;
    `;
    container.appendChild(orb);
  }
}

/* ══════════════════════════════════════════
   HERO MOTION — parallax + code card tilt
   ══════════════════════════════════════════ */
function initHeroMotion() {
  const wrap = document.querySelector('.hero-wrap');
  const bg = document.querySelector('.hbg-el');
  const card = document.querySelector('.cc-tilt');
  if (!wrap) return;

  let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

  function loop() {
    cx += (tx - cx) * .07;
    cy += (ty - cy) * .07;
    if (bg) bg.style.transform = `translate3d(${cx * 24}px,${cy * 16}px,0)`;
    if (card) card.style.transform = `perspective(900px) rotateY(${cx * 4.5}deg) rotateX(${-cy * 4.5}deg)`;
    raf = requestAnimationFrame(loop);
  }

  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - .5) * 2;
    ty = ((e.clientY - r.top) / r.height - .5) * 2;
    if (!raf) raf = requestAnimationFrame(loop);
  });
  wrap.addEventListener('mouseleave', () => {
    tx = 0; ty = 0;
    const settle = setInterval(() => {
      if (Math.abs(cx) < .008 && Math.abs(cy) < .008) {
        cancelAnimationFrame(raf); raf = null;
        if (bg) bg.style.transform = '';
        if (card) card.style.transform = '';
        clearInterval(settle);
      }
    }, 80);
  });
}

/* ══════════════════════════════════════════
   ABOUT PHOTO TILT
   ══════════════════════════════════════════ */
function initAboutPhotoTilt() {
  const wrap = document.querySelector('.aph-wrap');
  const inner = wrap?.querySelector('.aph');
  if (!wrap || !inner) return;
  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    inner.style.transform = `perspective(600px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) scale(1.03)`;
    inner.style.transition = 'transform .08s linear';
  });
  wrap.addEventListener('mouseleave', () => { inner.style.transform = ''; inner.style.transition = ''; });
}

/* ══════════════════════════════════════════
   EC CARD TILT (E-E-A-T cards)
   ══════════════════════════════════════════ */
function initEcTilt() {
  document.querySelectorAll('.ec').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `translateY(-5px) perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ══════════════════════════════════════════
   MAGNETIC BUTTONS
   ══════════════════════════════════════════ */
function initMagneticButtons() {
  document.querySelectorAll('.bf, .bo, .ncta').forEach(btn => {
    const liftY = btn.classList.contains('bf') ? -2 : -1;
    let raf = null;
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * .22;
      const y = (e.clientY - r.top - r.height / 2) * .28;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        btn.style.transform = `translate(${x}px,${liftY + y}px)`;
      });
    });
    btn.addEventListener('mouseleave', () => {
      if (raf) cancelAnimationFrame(raf);
      btn.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════════
   3D CARD TILT
   ══════════════════════════════════════════ */
function initCardTilt(selector, strength = 5) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.setProperty('--tiltX', `${-y * strength}deg`);
      card.style.setProperty('--tiltY', `${x * strength}deg`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tiltX', '0deg');
      card.style.setProperty('--tiltY', '0deg');
    });
  });
}

/* ══════════════════════════════════════════
   CURSOR SPOTLIGHT on cards
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

/* ══════════════════════════════════════════
   WORKFLOW LIT CYCLE (backup for JS)
   ══════════════════════════════════════════ */
function initWorkflowLitCycle() {
  // handled by main.js initWorkflowRibbon
}
