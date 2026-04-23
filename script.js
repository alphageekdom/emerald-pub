// ── NAVBAR SCROLL STATE ──
const NAV_SCROLL_TRIGGER = 40;
const navbar = document.getElementById('nav');

// rAF-throttled: coalesce bursts of scroll events into one class update per frame.
let navScrollTicking = false;

function handleNavScroll() {
  if (navScrollTicking) return;
  navScrollTicking = true;
  requestAnimationFrame(() => {
    navbar.classList.toggle('scrolled', window.scrollY > NAV_SCROLL_TRIGGER);
    navScrollTicking = false;
  });
}

if (navbar) window.addEventListener('scroll', handleNavScroll);


// ── NAV ANCHORS + MOBILE MENU ──
const NAV_HEIGHT_OFFSET = 70;
const navMenu = document.getElementById('navMenu');
const anchorLinks = document.querySelectorAll('a[href^="#"]');

function closeMobileMenu() {
  if (!navMenu.classList.contains('show')) return;
  bootstrap.Collapse.getInstance(navMenu)?.hide();
}

function handleAnchorClick(event) {
  const href = event.currentTarget.getAttribute('href');
  if (href === '#') return;

  const target = document.querySelector(href);
  if (!target) return;

  event.preventDefault();
  const targetY =
    target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT_OFFSET;
  window.scrollTo({ top: targetY, behavior: 'smooth' });

  closeMobileMenu();
}

anchorLinks.forEach((link) => link.addEventListener('click', handleAnchorClick));

// ESC closes the mobile nav if it's open (early-returns when closed).
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileMenu();
});


// ── SCROLL-TRIGGERED REVEALS ──
// Hero .reveal elements start in the viewport and animate in on first tick.
const REVEAL_THRESHOLD = 0.15;
const scrollReveals = document.querySelectorAll('.reveal');

function initRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { threshold: REVEAL_THRESHOLD }
  );

  scrollReveals.forEach((el) => observer.observe(el));
}

initRevealObserver();


// ── CONTACT PHONE FORMATTING ──
const phoneInput = document.getElementById('c-phone');

function formatPhoneNumber(event) {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 10);
  const parts = [];
  if (digits.length > 0) parts.push(`(${digits.slice(0, 3)}`);
  if (digits.length >= 4) parts.push(`) ${digits.slice(3, 6)}`);
  if (digits.length >= 7) parts.push(`-${digits.slice(6, 10)}`);
  event.target.value = parts.join('');
}

phoneInput?.addEventListener('input', formatPhoneNumber);


// ── EXCERPT MODAL ──
const excerptModal = document.getElementById('excerpt-modal');
const excerptDialog = excerptModal?.querySelector('[role="dialog"]');
const excerptOpener = document.querySelector('[data-open-excerpt]');
const excerptCloseEls = excerptModal?.querySelectorAll('[data-close-excerpt]');

let lastFocusedBeforeModal = null;

function getFocusables(root) {
  return root.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
}

function handleExcerptKeydown(event) {
  if (event.key === 'Escape') {
    closeExcerpt();
    return;
  }
  if (event.key !== 'Tab') return;

  const focusables = getFocusables(excerptDialog);
  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

function openExcerpt() {
  if (!excerptModal) return;
  lastFocusedBeforeModal = document.activeElement;
  excerptModal.hidden = false;
  document.body.classList.add('modal-open');
  excerptDialog?.focus();
  document.addEventListener('keydown', handleExcerptKeydown);
}

function closeExcerpt() {
  if (!excerptModal || excerptModal.hidden) return;
  excerptModal.hidden = true;
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', handleExcerptKeydown);
  lastFocusedBeforeModal?.focus();
}

excerptOpener?.addEventListener('click', (event) => {
  event.preventDefault();
  openExcerpt();
});

excerptCloseEls?.forEach((el) => el.addEventListener('click', closeExcerpt));


// ── DYNAMIC DATES ──
const yearEl = document.getElementById('year');
const seasonEl = document.getElementById('season');

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

function currentSeasonLabel() {
  // December rolls into next year's Winter
  if (currentMonth === 11) return `Winter ${currentYear + 1}`;
  if (currentMonth <= 1) return `Winter ${currentYear}`;
  if (currentMonth <= 4) return `Spring ${currentYear}`;
  if (currentMonth <= 7) return `Summer ${currentYear}`;
  return `Fall ${currentYear}`;
}

if (yearEl) yearEl.textContent = currentYear;
if (seasonEl) seasonEl.textContent = currentSeasonLabel();
