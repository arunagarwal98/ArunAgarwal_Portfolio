/* ============================================================
   ENHANCE.JS — additive UX motion layer
   - Hero sequenced reveal trigger
   - Scroll reveal observer (auto-tags common blocks)
   - Subtle parallax on .parallax-layer
   - Cursor-aware tilt on cards (.enh-tilt)
   - Magnetic pull on primary CTA / nav CTA
   transform + opacity only. Respects prefers-reduced-motion.
   ============================================================ */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Hero sequenced entrance ---------- */
  const triggerHero = () => {
    const hero = document.getElementById('home');
    if (hero) hero.classList.add('enh-seq');
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(triggerHero));
  } else {
    requestAnimationFrame(triggerHero);
  }

  if (reduce) return;

  /* ---------- 2. Scroll reveal ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const selectors = [
      'section .about-hero',
      'section .ec', 'section .proj', 'section .pcard', 'section .rcard',
      'section .pc', 'section .skill-card', 'section .sc',
      'section h2', 'section .section-title', 'section .stitle',
      'section .hms-c'
    ];
    const nodes = document.querySelectorAll(selectors.join(','));
    nodes.forEach((el, idx) => {
      if (el.closest('#home')) return; // hero has its own sequence
      el.classList.add('enh-reveal');
      el.style.setProperty('--i', (idx % 8).toString());
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.enh-reveal').forEach(n => io.observe(n));
  });

  /* ---------- 3. Parallax (very gentle) ---------- */
  const layers = () => document.querySelectorAll('.parallax-layer');
  let pTicking = false;
  const onScroll = () => {
    if (pTicking) return;
    pTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      layers().forEach(el => {
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + y) * 0.05 - y * 0.08;
        el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      });
      pTicking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 4. Cursor-aware tilt on cards ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const tiltTargets = document.querySelectorAll('.cc, .hms-c, .proj, .pcard, .pc, .skill-card');
    tiltTargets.forEach(el => {
      el.classList.add('enh-tilt');
      el.addEventListener('pointermove', (ev) => {
        const r = el.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width;
        const py = (ev.clientY - r.top) / r.height;
        const rx = (px - 0.5) * 6;   // max 6deg
        const ry = (py - 0.5) * 6;
        el.style.setProperty('--rx', rx.toFixed(2));
        el.style.setProperty('--ry', ry.toFixed(2));
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--rx', '0');
        el.style.setProperty('--ry', '0');
      });
    });
  });

  /* ---------- 5. Magnetic CTA pull ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const mag = document.querySelectorAll('.bf, .ncta');
    mag.forEach(el => {
      el.addEventListener('pointermove', (ev) => {
        const r = el.getBoundingClientRect();
        const x = ev.clientX - r.left - r.width / 2;
        const y = ev.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${(x * 0.15).toFixed(1)}px, ${(y * 0.2 - 2).toFixed(1)}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  });
})();
