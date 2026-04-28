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
const navMenu = document.getElementById('navMenu');
const anchorLinks = document.querySelectorAll('a[href^="#"]');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

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
  const navHeight = navbar?.getBoundingClientRect().height ?? 70;
  const targetY =
    target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
  window.scrollTo({
    top: targetY,
    behavior: reducedMotionQuery.matches ? 'auto' : 'smooth',
  });

  // Move focus into the target so the skip link actually skips and so
  // keyboard users resume tabbing from the destination, not the link.
  target.focus({ preventScroll: true });

  // Mirror the URL hash so back-button navigation and link sharing work.
  history.pushState(null, '', href);

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
  // Arm the .reveal opacity:0 starting state only when JS is running.
  // Without this class the CSS leaves content visible by default.
  document.documentElement.classList.add('reveal-ready');

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
const phoneInput = document.getElementById('contact-phone');

function formatPhoneNumber(event) {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 10);
  const parts = [];
  if (digits.length > 0) parts.push(`(${digits.slice(0, 3)}`);
  if (digits.length >= 4) parts.push(`) ${digits.slice(3, 6)}`);
  if (digits.length >= 7) parts.push(`-${digits.slice(6, 10)}`);
  event.target.value = parts.join('');
}

// Format on blur, not input — avoids yanking the caret to the end of the
// field while the user is still mid-edit.
phoneInput?.addEventListener('blur', formatPhoneNumber);


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
    closeExcerpt({ restoreFocus: true });
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

function closeExcerpt({ restoreFocus = true } = {}) {
  if (!excerptModal || excerptModal.hidden) return;
  excerptModal.hidden = true;
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', handleExcerptKeydown);
  if (restoreFocus) lastFocusedBeforeModal?.focus();
}

excerptOpener?.addEventListener('click', (event) => {
  event.preventDefault();
  openExcerpt();
});

excerptCloseEls?.forEach((el) =>
  el.addEventListener('click', () => {
    // In-page-anchor CTAs (e.g. "Order Your Copy" → #shop) let the user
    // travel to the destination; restoring focus to the opener would
    // leave focus off-screen, so skip it for those.
    const isAnchorCta = el.matches('a[href^="#"]');
    closeExcerpt({ restoreFocus: !isAnchorCta });
  }),
);


// ── FORM SUBMIT BUSY STATE ──
// Netlify either redirects on success or returns the user to this page on
// failure. While the request is in flight the button has no feedback, so
// users can re-click. Disable + swap text + flag aria-busy until either
// the page navigates away or pageshow restores via bfcache.
const submittableForms = document.querySelectorAll(
  'form[data-netlify="true"]',
);

const busyState = new WeakMap();

function markFormBusy(form) {
  const button = form.querySelector('button[type="submit"]');
  if (!button) return;
  busyState.set(button, button.textContent);
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  button.textContent = 'Sending…';
}

function clearFormBusy(form) {
  const button = form.querySelector('button[type="submit"]');
  if (!button || !busyState.has(button)) return;
  button.disabled = false;
  button.removeAttribute('aria-busy');
  button.textContent = busyState.get(button);
  busyState.delete(button);
}

submittableForms.forEach((form) => {
  form.addEventListener('submit', () => markFormBusy(form));
});

// Restore button text when the user navigates back via the browser back
// button (bfcache restore) — otherwise the disabled "Sending…" state
// would persist.
window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  submittableForms.forEach(clearFormBusy);
});


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
