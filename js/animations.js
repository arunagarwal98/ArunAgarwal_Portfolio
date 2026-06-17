/**
 * ANIMATIONS — hero canvas · scroll reveals · experience autocycle · skill tabs · about tilt · h1
 */

const ROLES = [
  { date:'Sep 2021 – Apr 2023', co:'Freelance / Multiple Clients', loc:'📍 India & Remote', type:'Freelance',
    title:'Freelance & Contract SEO Specialist', sub:'Self-Employed · Multiple Clients · 18 months',
    desc:'Where it started. Built real-world SEO skills across eCommerce and service businesses by shipping, not studying.',
    points:['<strong>On-page SEO</strong> — title tags, meta, heading structure, internal links, content gaps','<strong>Technical SEO audits</strong> — Screaming Frog + GSC: crawl errors, broken links, duplicate content','<strong>WordPress builds</strong> — theme customisation, page speed, mobile responsiveness fixes'],
    tags:[{t:'Freelance SEO',c:'o'},{t:'Keyword Research',c:'o'},{t:'WordPress',c:'n'},{t:'GSC',c:'n'}]},
  { date:'May 2023 – Jul 2024', co:'Yolk Media / Amazon FBA Brand', loc:'📍 Confidential Brand', type:'Full-Time',
    title:'SEO Executive — Amazon FBA', sub:'Amazon Marketplace · 1 yr 3 months',
    desc:'Dedicated Amazon SEO for 50+ ASINs — full ownership of backend keyword strategy, listing rewrites, and ranking tracking.',
    points:['<strong>Backend search term architecture</strong> — Helium10 Cerebro reverse lookups, 250-byte field optimisation','<strong>Listing rewrites</strong> — benefit-first, keyword-embedded titles, bullets, and A+ content','<strong>BSR and rank tracking</strong> pre/post optimisation via Helium10 + Seller Central'],
    tags:[{t:'Amazon SEO',c:'g'},{t:'A9 Algorithm',c:'g'},{t:'Helium10',c:'g'},{t:'A+ Content',c:'n'}]},
  { date:'Aug 2024 – Jun 2025', co:'Yolk Media', loc:'📍 Multi-Client', type:'Contract',
    title:'SEO Engineer — Frontend & Client Websites', sub:'Multi-Client · eCommerce · Finance · Local Services',
    desc:'Strategy layer plus hands-on frontend implementation — fixing code, rebuilding link architectures, delivering audit reports.',
    points:['<strong>Frontend SEO</strong> in WordPress/Shopify — heading hierarchy, schema injection, performance','<strong>Internal linking architecture</strong> rebuilds — crawl equity via Screaming Frog + Ahrefs','<strong>Technical audit reports</strong> — impact × effort matrices for multiple client verticals'],
    tags:[{t:'Technical SEO',c:'b'},{t:'WordPress',c:'n'},{t:'Shopify',c:'n'},{t:'Ahrefs',c:'n'}]},
  { date:'Dec 2025 – Mar 2026', co:'SabkiShiksha', loc:'📍 Education Platform', type:'Full-Time',
    title:'SEO Engineer', sub:'SabkiShiksha · Education Platform',
    desc:'Owned full technical SEO and content architecture for an education platform with heavy informational intent content.',
    points:['<strong>Information architecture</strong> — mapped intent layers for course and guidance pages','<strong>JSON-LD structured data</strong>: Course, FAQ, BreadcrumbList, Organization schemas','<strong>Core Web Vitals fixes</strong> — LCP, CLS, FID diagnosis and coordination'],
    tags:[{t:'Technical SEO',c:'b'},{t:'Python Automation',c:'b'},{t:'Structured Data',c:'b'},{t:'CWV',c:'b'},{t:'GSC',c:'n'}]},
  { date:'Apr 2026 – Now', co:'8Bit System Pvt Ltd', loc:'📍 Jaipur, India', type:'cur',
    title:'ELK Stack Developer', sub:'8Bit System Pvt Ltd · Full-Time',
    desc:'Hands-on daily with Python Backend , Logstash pipelines, Elasticsearch query design, Kibana dashboards, and Linux infra.',
    points:['<strong>Python Backend scripts</strong> — log parsing, field transformation, data enrichment, automation, index routing','<strong>Logstash pipeline configs</strong> — grok parsing, field mapping, noise filtering, index routing','<strong>Elasticsearch Query DSL</strong> — aggregations, custom mappings, ILM policy configuration','<strong>Kibana dashboards</strong> — error rates, latency histograms, threshold alerts','<strong>Linux infrastructure</strong> — systemctl, cron, log rotation, SSH remote ops'],
    tags:[{t:'Elasticsearch',c:'b'},{t:'Python',c:'b'},{t:'Logstash',c:'b'},{t:'Kibana',c:'b'},{t:'Linux',c:'b'},{t:'Query DSL',c:'b'}]}
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
  initHeroCanvas();
  initHeroH1();
  initScrollAnimations();
  initAboutTilt();
  initExperienceTimeline();
  initSkillTabs();
  initWorkflowRibbonCycle();
});

/* ── HERO CANVAS ── */
function initHeroCanvas() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const section = document.getElementById('home');
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = section.offsetWidth; canvas.height = section.offsetHeight; }
  resize();
  const COUNT = Math.min(40, Math.floor(canvas.width / 26));
  const MAX = 160, BLUE = 'rgba(26,111,244,';
  const nodes = Array.from({length:COUNT}, () => ({
    x: Math.random()*canvas.width, y: Math.random()*canvas.height,
    vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3,
    r: Math.random()*1.8+.7, phase: Math.random()*Math.PI*2
  }));
  let t=0, rafId, running=true;
  function draw() {
    if (!running) return;
    t+=.011;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    nodes.forEach(n => {
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<-20)n.x=canvas.width+20; if(n.x>canvas.width+20)n.x=-20;
      if(n.y<-20)n.y=canvas.height+20; if(n.y>canvas.height+20)n.y=-20;
    });
    for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++) {
      const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.hypot(dx,dy);
      if(d<MAX){ctx.beginPath();ctx.strokeStyle=BLUE+(1-d/MAX)*.12+')';ctx.lineWidth=.8;ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.stroke();}
    }
    nodes.forEach(n=>{const p=.55+.45*Math.sin(t+n.phase);ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fillStyle=BLUE+p*.35+')';ctx.fill();});
    rafId=requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
  setTimeout(()=>{canvas.style.opacity='1';},300);
  new IntersectionObserver(e=>{running=e[0].isIntersecting;if(running)rafId=requestAnimationFrame(draw);else cancelAnimationFrame(rafId);},{threshold:0}).observe(section);
  let rt;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(resize,200);},{passive:true});
}

/* ── H1 stagger animate ── */
function initHeroH1() {
  document.querySelectorAll('.h1-line').forEach(el => el.classList.add('anim'));
}

/* ── SCROLL REVEALS ── */
function initScrollAnimations() {
  document.querySelectorAll('.rv').forEach(el => {
    new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');} });},{threshold:.08}).observe(el);
  });
  document.querySelectorAll('.stagger').forEach(group => {
    new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');}});},{threshold:.1}).observe(group);
  });
}

/* ── ABOUT LINES ANIMATION ── */
function animLines() {
  document.querySelectorAll('.aline').forEach((line, i) => {
    line.classList.remove('show');
    setTimeout(() => line.classList.add('show'), i * 220);
  });
}
function initAboutTilt() {
  // About photo tilt on .aph-wrap
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const wrap = document.querySelector('.aph-wrap');
  const inner = wrap?.querySelector('.aph');
  if(!wrap||!inner) return;
  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
    inner.style.transform = `perspective(600px) rotateY(${x*8}deg) rotateX(${-y*8}deg) scale(1.02)`;
    inner.style.transition = 'transform .08s linear';
  });
  wrap.addEventListener('mouseleave', ()=>{ inner.style.transform=''; });
  // Fire animLines when about section enters view
  const aboutSection = document.getElementById('about');
  if(!aboutSection) return;
  let fired = false;
  new IntersectionObserver(entries => {
    if(entries[0].isIntersecting && !fired) { fired=true; animLines(); }
  }, { threshold: .2 }).observe(aboutSection);
}

/* ── ABOUT STAT COUNTERS ── */
function initAboutStatCounters() {
  document.querySelectorAll('.asg-n[data-count]').forEach(el => {
    const target=parseInt(el.dataset.count), suffix=el.dataset.suffix||'';
    let fired=false;
    new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting&&!fired){
        fired=true;
        const dur=1100,start=performance.now();
        const step=ts=>{const p=Math.min((ts-start)/dur,1);el.textContent=Math.round((1-Math.pow(1-p,3))*target)+suffix;if(p<1)requestAnimationFrame(step);};
        el.textContent='0'+suffix; requestAnimationFrame(step);
      }
    },{threshold:.5}).observe(el);
  });
}

/* ── EXPERIENCE — auto-cycle with progress bar ── */
function initExperienceTimeline() {
  const nodes = document.querySelectorAll('.jn[data-role]');
  const panel = document.getElementById('role-panel');
  const progressWrap = document.getElementById('role-progress-wrap');
  const progressBar = document.getElementById('role-progress-bar');
  if (!nodes.length || !panel) return;

  const line = document.getElementById('jline');
  if (line) {
    new IntersectionObserver(e=>{if(e[0].isIntersecting)line.classList.add('draw');},{threshold:.3}).observe(line.parentElement);
  }

  let activeIdx = -1, autoTimer = null, progressAnim = null, paused = false;
  const CYCLE_MS = 4000;

  function openRole(idx, fromAuto=false) {
    if (!fromAuto) { paused = true; stopAutoTimer(); }
    nodes.forEach(n=>{ n.classList.remove('active'); n.setAttribute('aria-expanded','false'); });
    nodes[idx]?.classList.add('active');
    nodes[idx]?.setAttribute('aria-expanded','true');
    panel.innerHTML = buildRolePanel(idx);
    panel.classList.add('open');
    if (progressWrap) progressWrap.classList.add('visible');
    resetProgressBar();
    activeIdx = idx;
    // scroll panel into view
    if (!fromAuto) {
      setTimeout(()=>{
        const navEl = document.getElementById('nav');
        const nH = navEl?.offsetHeight||77;
        window.scrollTo({top:panel.getBoundingClientRect().top+window.scrollY-nH-20,behavior:'smooth'});
      },120);
    }
  }

  function resetProgressBar() {
    if (!progressBar) return;
    progressBar.style.transition='none'; progressBar.style.width='0';
    void progressBar.offsetWidth;
    progressBar.style.transition=`width ${CYCLE_MS}ms linear`;
    progressBar.style.width='100%';
  }

  function startAutoTimer() {
    if (autoTimer) return;
    autoTimer = setInterval(()=>{
      if (paused) return;
      const next = (activeIdx+1)%nodes.length;
      openRole(next, true);
    }, CYCLE_MS);
  }
  function stopAutoTimer() { clearInterval(autoTimer); autoTimer=null; if(progressBar){progressBar.style.transition='none';progressBar.style.width='0';} }

  // Click to open (toggle + pause auto)
  nodes.forEach((node,i)=>{
    node.addEventListener('click', ()=>{
      if (activeIdx===i && !paused) { paused=true; stopAutoTimer(); return; }
      if (activeIdx===i && paused) { paused=false; startAutoTimer(); return; }
      openRole(i, false);
    });
    node.addEventListener('mouseenter', ()=>{ paused=true; });
    node.addEventListener('mouseleave', ()=>{ paused=false; });
    node.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openRole(i,false); } });
  });

  // Panel hover pauses
  panel.addEventListener('mouseenter',()=>{ paused=true; });
  panel.addEventListener('mouseleave',()=>{ paused=false; });

  // Start: open first when visible
  new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      openRole(0,true);
      startAutoTimer();
    } else {
      stopAutoTimer();
    }
  },{threshold:.2}).observe(document.getElementById('experience')||document.body);
}

/* ── SKILLS — tabs + autocycle + progress ── */
function initSkillTabs() {
  const tabs   = document.querySelectorAll('.sk-tab');
  const panels = document.querySelectorAll('.sk-panel');
  const pBar   = document.getElementById('sk-progress-bar');
  if (!tabs.length) return;

  let idx=0, timer=null, paused=false;
  const CYCLE = 3500;

  function activateTab(i) {
    tabs.forEach(t=>t.classList.remove('active'));
    panels.forEach(p=>p.classList.remove('active'));
    tabs[i]?.classList.add('active');
    panels[i]?.classList.add('active');
    // trigger stagger
    const stagger = panels[i]?.querySelector('.stagger');
    if (stagger && !stagger.classList.contains('in')) stagger.classList.add('in');
    idx=i;
    resetSkProgress();
  }

  function resetSkProgress() {
    if (!pBar) return;
    pBar.style.transition='none'; pBar.style.width='0';
    void pBar.offsetWidth;
    pBar.style.transition=`width ${CYCLE}ms linear`;
    pBar.style.width='100%';
  }

  tabs.forEach((tab,i)=>{ tab.addEventListener('click',()=>{ paused=true; activateTab(i); stopCycle(); }); });

  function startCycle() { if(timer)return; timer=setInterval(()=>{ if(!paused)activateTab((idx+1)%tabs.length); },CYCLE); }
  function stopCycle() { clearInterval(timer); timer=null; }

  const section = document.getElementById('skills');
  if (section) {
    new IntersectionObserver(e=>{
      if(e[0].isIntersecting){activateTab(0);startCycle();}else stopCycle();
    },{threshold:.2}).observe(section);
    section.addEventListener('mouseenter',()=>paused=true);
    section.addEventListener('mouseleave',()=>paused=false);
  }
}

/* ── WORKFLOW RIBBON CYCLE ── */
function initWorkflowRibbonCycle() {
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.workflow-ribbon').forEach(ribbon=>{
    const spans=ribbon.querySelectorAll('span'); if(!spans.length)return;
    let idx=0,timer=null;
    new IntersectionObserver(e=>{if(e[0].isIntersecting)start();else stop();},{threshold:.5}).observe(ribbon);
    function start(){if(timer)return;timer=setInterval(()=>{spans[idx].classList.remove('lit');idx=(idx+1)%spans.length;spans[idx].classList.add('lit');},900);}
    function stop(){clearInterval(timer);timer=null;}
  });
}

window.addEventListener('scroll',()=>{},{passive:true});