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
  if (!form || !btn) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // 3D button press animation
    btn.textContent = 'Sending...';
    btn.classList.add('loading');
    btn.disabled = true;

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
        btn.textContent = 'Sent ✓';
        btn.style.background = '#059669';
        btn.style.boxShadow = '0 4px 0 rgba(5,150,105,.35),0 6px 20px rgba(5,150,105,.3)';

        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.style.background = '';
          btn.style.boxShadow = '';
          btn.disabled = false;
          form.reset();
        }, 3500);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      btn.classList.remove('loading');
      btn.textContent = 'Failed — Try Again';
      btn.style.background = '#dc2626';
      btn.style.boxShadow = '0 4px 0 rgba(220,38,38,.35)';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.style.boxShadow = '';
      }, 3000);
    }
  });
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
  let cur = 0;
  SECTION_IDS.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= navH() + 50) cur = i;
  });
  const next = document.getElementById(SECTION_IDS[Math.max(0, Math.min(SECTION_IDS.length-1, cur+dir))]);
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
