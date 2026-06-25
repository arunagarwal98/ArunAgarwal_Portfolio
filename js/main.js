/**
 * MAIN.JS — Core interactions
 * Smooth scroll · nav · timeline · skill tabs · form · counters · typewriter
 */

const SECTION_IDS = ['home','about','experience','skills','projects','roadmap','contact'];

/* ── ROLE DATA ── */
const ROLES = [
  {
    date:'Sep 2021 – Apr 2023',co:'Freelance / Multiple Clients',
    loc:'📍 India & Remote',type:'Freelance',
    title:'Freelance & Contract SEO Specialist',
    sub:'Self-Employed · Multiple Clients · 18 months',
    desc:'Where it started. Built real-world SEO skills across eCommerce and service businesses by shipping, not studying.',
    points:[
      '<strong>On-page SEO</strong> — title tags, meta, heading structure, internal links, content gaps',
      '<strong>Technical SEO audits</strong> — Screaming Frog + GSC: crawl errors, broken links, duplicate content',
      '<strong>WordPress builds</strong> — theme customisation, page speed, mobile responsiveness fixes'
    ],
    tags:[{t:'Freelance SEO',c:'o'},{t:'Keyword Research',c:'o'},{t:'WordPress',c:'n'},{t:'GSC',c:'n'}]
  },
  {
    date:'May 2023 – Jul 2024',co:'Yolk Media / Amazon FBA Brand',
    loc:'📍 Confidential Brand',type:'Full-Time',
    title:'SEO Executive — Amazon FBA',
    sub:'Amazon Marketplace · 1 yr 3 months',
    desc:'Dedicated Amazon SEO for 50+ ASINs — full ownership of backend keyword strategy, listing rewrites, and ranking tracking.',
    points:[
      '<strong>Backend search term architecture</strong> — Helium10 Cerebro reverse lookups, 250-byte field optimisation',
      '<strong>Listing rewrites</strong> — benefit-first, keyword-embedded titles, bullets, and A+ content',
      '<strong>BSR and rank tracking</strong> pre/post optimisation via Helium10 + Seller Central'
    ],
    tags:[{t:'Amazon SEO',c:'g'},{t:'A9 Algorithm',c:'g'},{t:'Helium10',c:'g'},{t:'A+ Content',c:'n'}]
  },
  {
    date:'Aug 2024 – Jun 2025',co:'Yolk Media',
    loc:'📍 Multi-Client',type:'Contract',
    title:'SEO Engineer — Frontend & Client Websites',
    sub:'Multi-Client · eCommerce · Finance · Local Services',
    desc:'Strategy layer plus hands-on frontend implementation — fixing code, rebuilding link architectures, delivering audit reports.',
    points:[
      '<strong>Frontend SEO</strong> in WordPress/Shopify — heading hierarchy, schema injection, performance',
      '<strong>Internal linking architecture</strong> rebuilds — crawl equity via Screaming Frog + Ahrefs',
      '<strong>Technical audit reports</strong> — impact × effort matrices for multiple client verticals'
    ],
    tags:[{t:'Technical SEO',c:'b'},{t:'WordPress',c:'n'},{t:'Shopify',c:'n'},{t:'Ahrefs',c:'n'}]
  },
  {
    date:'Dec 2025 – Mar 2026',co:'SabkiShiksha',
    loc:'📍 Education Platform',type:'Full-Time',
    title:'SEO Engineer',
    sub:'SabkiShiksha · Education Platform',
    desc:'Owned full technical SEO and content architecture for an education platform with heavy informational intent content.',
    points:[
      '<strong>Information architecture</strong> — mapped intent layers for course and guidance pages',
      '<strong>JSON-LD structured data</strong>: Course, FAQ, BreadcrumbList, Organization schemas',
      '<strong>Core Web Vitals fixes</strong> — LCP, CLS, FID diagnosis and coordination'
    ],
    tags:[{t:'Technical SEO',c:'b'},{t:'Python Automation',c:'b'},{t:'Structured Data',c:'b'},{t:'CWV',c:'b'}]
  },
  {
    date:'Apr 2026 – Now',co:'8Bit System Pvt Ltd',
    loc:'📍 Jaipur, India',type:'cur',
    title:'ELK Stack Developer',
    sub:'8Bit System Pvt Ltd · Full-Time',
    desc:'Hands-on daily with Python Backend, Logstash pipelines, Elasticsearch query design, Kibana dashboards, and Linux infrastructure.',
    points:[
      '<strong>Python Backend scripts</strong> — log parsing, field transformation, data enrichment, automation',
      '<strong>Logstash pipeline configs</strong> — grok parsing, field mapping, noise filtering, index routing',
      '<strong>Elasticsearch Query DSL</strong> — aggregations, custom mappings, ILM policy configuration',
      '<strong>Kibana dashboards</strong> — error rates, latency histograms, threshold alerts',
      '<strong>Linux infrastructure</strong> — systemctl, cron, log rotation, SSH remote ops'
    ],
    tags:[{t:'Elasticsearch',c:'b'},{t:'Python',c:'b'},{t:'Logstash',c:'b'},{t:'Kibana',c:'b'},{t:'Linux',c:'b'}]
  }
];

/* ── BUILD ROLE PANEL HTML ── */
function buildRolePanel(idx) {
  const r = ROLES[idx];
  const isCur = r.type === 'cur';
  return `<div class="rp-inner">
    <div class="rp-left">
      <span class="rp-date">${r.date}</span>
      <div class="rp-co">${r.co}</div>
      <div class="rp-loc">${r.loc}</div>
      <span class="rp-type ${isCur ? 'cur' : ''}">${isCur ? '● Current' : r.type}</span>
    </div>
    <div class="rp-right">
      <div class="rp-title">${r.title}</div>
      <div class="rp-sub">${r.sub}</div>
      <div class="rp-desc">${r.desc}</div>
      <ul class="rp-ul">${r.points.map(p => `<li>${p}</li>`).join('')}</ul>
      <div class="rp-tags">${r.tags.map(t => `<span class="et ${t.c}">${t.t}</span>`).join('')}</div>
    </div>
  </div>`;
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
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

/* ── SCROLL PROGRESS ── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });
}

/* ── NAV SCROLL ── */
function initNav() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    const btt = document.getElementById('back-to-top');
    if (nav) nav.classList.toggle('sc', window.scrollY > 30);
    if (btt) btt.classList.toggle('show', window.scrollY > 420);
  }, { passive: true });
}

/* ── NAV DROPDOWN ── */
function initNavDropdown() {
  const trigger = document.querySelector('.nav-has-dropdown');
  if (!trigger) return;
  const dropdown = trigger.querySelector('.nav-dropdown');
  const triggerLink = trigger.querySelector('a');
  if (!dropdown) return;
  let closeTimer;

  const open = () => { clearTimeout(closeTimer); dropdown.classList.add('open'); triggerLink?.setAttribute('aria-expanded','true'); };
  const close = () => { closeTimer = setTimeout(() => { dropdown.classList.remove('open'); triggerLink?.setAttribute('aria-expanded','false'); }, 150); };

  trigger.addEventListener('mouseenter', open);
  trigger.addEventListener('mouseleave', close);
  triggerLink?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dropdown.classList.toggle('open'); }
    if (e.key === 'Escape') { dropdown.classList.remove('open'); }
  });
  document.addEventListener('click', e => { if (!trigger.contains(e.target)) dropdown.classList.remove('open'); });
}

/* ── MOBILE MENU ── */
function initMobileMenu() {
  const btn = document.getElementById('mob-toggle');
  const mob = document.getElementById('mob');
  if (!btn || !mob) return;
  btn.addEventListener('click', () => {
    const open = mob.classList.toggle('on');
    btn.setAttribute('aria-expanded', String(open));
  });
  // Close on link click
  mob.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mob.classList.remove('on');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ── BACK TO TOP ── */
function initBackToTop() {
  document.getElementById('back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── SMOOTH SCROLL ── */
function navH() { return document.getElementById('nav')?.offsetHeight || 77; }
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
  document.querySelectorAll('.nl a, .mob a').forEach(a => {
    a.classList.toggle('act', a.getAttribute('href') === `#${id}`);
  });
  history.replaceState(null, '', `#${id}`);
}

/* ── SCROLL REVEALS ── */
function initScrollReveals() {
  const rvObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); }
    });
  }, { threshold: .07, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.rv').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i * 0.032, 0.26) + 's';
    rvObs.observe(el);
  });

  const staggerObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: .08 });
  document.querySelectorAll('.stagger').forEach(g => staggerObs.observe(g));

  // jpath
  const jpObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: .1 });
  document.querySelectorAll('.jpath').forEach(el => jpObs.observe(el));
}

/* ── ABOUT LINES ── */
function animLines() {
  document.querySelectorAll('.aline').forEach((line, i) => {
    setTimeout(() => line.classList.add('show'), i * 200);
  });
}
function initAboutLines() {
  const about = document.getElementById('about');
  if (!about) return;
  let fired = false;
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) { fired = true; animLines(); }
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
    nodes.forEach(n => { n.classList.remove('active'); n.setAttribute('aria-selected', 'false'); });
    nodes[idx]?.classList.add('active');
    nodes[idx]?.setAttribute('aria-selected', 'true');
    panel.innerHTML = buildRolePanel(idx);
    panel.classList.add('open');
    if (progressWrap) progressWrap.classList.add('visible');
    resetBar();
    activeIdx = idx;
    if (!fromAuto) {
      setTimeout(() => {
        const top = panel.getBoundingClientRect().top + window.scrollY - navH() - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 140);
    }
  }

  function resetBar() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0';
    void progressBar.offsetWidth;
    progressBar.style.transition = `width ${CYCLE_MS}ms linear`;
    progressBar.style.width = '100%';
  }

  function startAuto() {
    if (autoTimer) return;
    autoTimer = setInterval(() => {
      if (!paused) openRole((activeIdx + 1) % nodes.length, true);
    }, CYCLE_MS);
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
    node.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openRole(i, false); }
    });
  });
  panel.addEventListener('mouseenter', () => { paused = true; });
  panel.addEventListener('mouseleave', () => { paused = false; });

  const expEl = document.getElementById('experience');
  if (expEl) {
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { openRole(0, true); startAuto(); }
      else stopAuto();
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
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    panels.forEach(p => p.classList.remove('active'));
    tabs[i]?.classList.add('active');
    tabs[i]?.setAttribute('aria-selected','true');
    panels[i]?.classList.add('active');
    const stagger = panels[i]?.querySelector('.stagger');
    if (stagger && !stagger.classList.contains('in')) stagger.classList.add('in');
    idx = i;
    resetPBar();
  }
  function resetPBar() {
    if (!pBar) return;
    pBar.style.transition = 'none'; pBar.style.width = '0';
    void pBar.offsetWidth;
    pBar.style.transition = `width ${CYCLE}ms linear`;
    pBar.style.width = '100%';
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { paused = true; stopCycle(); activate(i); });
  });

  function startCycle() { if (timer) return; timer = setInterval(() => { if (!paused) activate((idx + 1) % tabs.length); }, CYCLE); }
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
  if (!form || !btn) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    btn.textContent = 'Sending...';
    btn.classList.add('loading');
    btn.disabled = true;
    setTimeout(() => {
      btn.classList.remove('loading');
      btn.textContent = 'Sent ✓';
      btn.style.background = '#059669';
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1400);
  });
}
function hf(e) { e.preventDefault(); document.getElementById('contact-form')?.dispatchEvent(new Event('submit')); }

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
  let cur = 0;
  SECTION_IDS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= navH() + 50) cur = i;
  });
  const next = document.getElementById(SECTION_IDS[Math.max(0, Math.min(SECTION_IDS.length - 1, cur + dir))]);
  if (next) scrollToEl(next);
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

  const HOLD = 5500, CHAR = 13, LINE_PAUSE = 75;

  function revealChars(html, count) {
    let out = '', visible = 0, i = 0, openTags = [];
    while (i < html.length && visible < count) {
      if (html[i] === '<') {
        const close = html.indexOf('>', i);
        if (close === -1) break;
        const tag = html.slice(i, close + 1);
        out += tag;
        if (tag[1] !== '/' && !/\/>$/.test(tag)) {
          const m = tag.match(/^<([a-zA-Z0-9]+)/);
          if (m) openTags.push(m[1]);
        } else if (tag[1] === '/') openTags.pop();
        i = close + 1; continue;
      }
      if (html[i] === '&') {
        const semi = html.indexOf(';', i);
        if (semi !== -1 && semi - i < 9) { out += html.slice(i, semi + 1); visible++; i = semi + 1; continue; }
      }
      out += html[i]; visible++; i++;
    }
    for (let t = openTags.length - 1; t >= 0; t--) out += `</${openTags[t]}>`;
    return out;
  }
  function countVis(html) { return html.replace(/<[^>]*>/g, '').replace(/&[a-zA-Z0-9]+;/g, '_').length; }

  let gen = 0;
  async function typeOnce(myGen) {
    box.innerHTML = '';
    for (let li = 0; li < lines.length; li++) {
      if (myGen !== gen) return;
      const { ln, ct } = lines[li];
      const total = countVis(ct);
      const div = document.createElement('div');
      div.className = 'cl';
      div.innerHTML = ln + '<span class="ct"></span>';
      box.appendChild(div);
      const ctSpan = div.querySelector('.ct');
      for (let c = 1; c <= total; c++) {
        if (myGen !== gen) return;
        ctSpan.innerHTML = revealChars(ct, c) + '<span class="typed-cursor-el" aria-hidden="true">█</span>';
        await new Promise(r => setTimeout(r, CHAR));
      }
      ctSpan.innerHTML = ct;
      await new Promise(r => setTimeout(r, LINE_PAUSE));
    }
    if (myGen !== gen) return;
    await new Promise(r => setTimeout(r, HOLD));
    if (myGen !== gen) return;
    typeOnce(myGen);
  }
  typeOnce(gen);
  document.addEventListener('visibilitychange', () => { gen++; if (!document.hidden) typeOnce(gen); });
}
