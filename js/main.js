/**
 * SINGLE-PAGE CORE LOGIC
 */
const SECTION_IDS = ['home','about','experience','skills','projects','roadmap','contact'];

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initGlobalFormHandlers();
  initActiveNavHighlight();
  initBackToTop();
  initNavDropdown();
  initStatCounters('.hms-n');
  initStatCounters('.asg-n');
  initJourneyLine();
  updateActiveNavLink();
  const hash = window.location.hash.replace('#','');
  if (hash && SECTION_IDS.includes(hash)) {
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) scrollToEl(el);
    }, 120);
  }
});

function navH() { return document.getElementById('nav')?.offsetHeight || 77; }
function scrollToEl(el) {
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navH(), behavior: 'smooth' });
}

function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = link.getAttribute('href');
    if (!target || target === '#') return;
    const el = document.querySelector(target);
    if (el) { e.preventDefault(); closeMobileMenu(); scrollToEl(el); history.replaceState(null,'',target); }
  });
}
function closeMobileMenu() { document.getElementById('mob')?.classList.remove('on'); }

function initNavDropdown() {
  const trigger = document.querySelector('.nav-has-dropdown');
  if (!trigger) return;
  const dropdown = trigger.querySelector('.nav-dropdown');
  if (!dropdown) return;
  let closeTimer;
  trigger.addEventListener('mouseenter', () => { clearTimeout(closeTimer); dropdown.classList.add('open'); });
  trigger.addEventListener('mouseleave', () => { closeTimer = setTimeout(() => dropdown.classList.remove('open'), 120); });
  trigger.querySelector('a')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dropdown.classList.toggle('open'); }
    if (e.key === 'Escape') dropdown.classList.remove('open');
  });
  document.addEventListener('click', e => { if (!trigger.contains(e.target)) dropdown.classList.remove('open'); });
}

function initActiveNavHighlight() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) setActiveNavLink(entry.target.id); });
  }, { rootMargin: `-${navH() + 10}px 0px -55% 0px`, threshold: 0 });
  SECTION_IDS.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
}
function setActiveNavLink(sectionId) {
  document.querySelectorAll('.nl a, .mob a').forEach(link => {
    link.classList.toggle('act', link.getAttribute('href') === `#${sectionId}`);
  });
  const csLink = document.querySelector('.nav-has-dropdown > a');
  if (csLink) csLink.classList.toggle('act', sectionId === 'casestudies');
  history.replaceState(null,'',`#${sectionId}`);
}
function updateActiveNavLink() { const h = window.location.hash.replace('#',''); if (h) setActiveNavLink(h); }

window.addEventListener('scroll', () => {
  document.getElementById('nav')?.classList.toggle('sc', window.scrollY > 25);
  document.getElementById('back-to-top')?.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

function initBackToTop() {
  document.getElementById('back-to-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initStatCounters(selector) {
  document.querySelectorAll(selector + '[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let fired = false;
    new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !fired) {
        fired = true;
        const dur = 1100, start = performance.now();
        const step = ts => {
          const p = Math.min((ts - start) / dur, 1);
          el.textContent = Math.round((1 - Math.pow(1-p, 3)) * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        el.textContent = '0' + suffix;
        requestAnimationFrame(step);
      }
    }, { threshold: .5 }).observe(el);
  });
}

function initJourneyLine() {
  const line = document.querySelector('.jpath-line');
  if (!line) return;
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { line.classList.add('draw'); }
  }, { threshold: .3 }).observe(line.parentElement);
}

document.addEventListener('keydown', e => {
  const tag = document.activeElement?.tagName;
  if (['INPUT','TEXTAREA','SELECT'].includes(tag) || e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); scrollToAdjacentSection(1); }
  if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); scrollToAdjacentSection(-1); }
});
function scrollToAdjacentSection(dir) {
  let cur = 0;
  SECTION_IDS.forEach((id,i) => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= navH() + 40) cur = i;
  });
  const target = document.getElementById(SECTION_IDS[Math.max(0, Math.min(SECTION_IDS.length-1, cur+dir))]);
  if (target) scrollToEl(target);
}

function initGlobalFormHandlers() {
  document.querySelector('.cf')?.addEventListener('submit', handleFormSubmitAction);
}
function handleFormSubmitAction(event) {
  event.preventDefault();
  const b = document.getElementById('cfb');
  if (!b) return;
  b.textContent = 'Sent ✓'; b.style.background = '#059669'; b.disabled = true;
  setTimeout(() => { b.textContent = 'Send Message'; b.style.background = ''; b.disabled = false; event.target.reset(); }, 3000);
}
function hf(e) { handleFormSubmitAction(e); }