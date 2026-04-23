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


// ── SMOOTH SCROLL ──
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


// ── PRELOADER + HERO REVEAL ──
const PRELOADER_FADE_DELAY = 800;
const HERO_REVEAL_DELAY = 100;
const preloader = document.getElementById('preloader');
const heroReveals = document.querySelectorAll('.hero .reveal');

function revealHero() {
  setTimeout(() => {
    heroReveals.forEach((el) => el.classList.add('is-in'));
  }, HERO_REVEAL_DELAY);
}

function hidePreloader() {
  setTimeout(() => {
    preloader.classList.add('hidden');
    revealHero();
  }, PRELOADER_FADE_DELAY);
}

window.addEventListener('load', hidePreloader);


// ── SCROLL-TRIGGERED REVEALS ──
const REVEAL_THRESHOLD = 0.15;
const scrollReveals = document.querySelectorAll('.reveal:not(.hero .reveal)');

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
