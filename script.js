const nav = document.getElementById('nav');
const menu = document.getElementById('navMenu');
const preloader = document.getElementById('preloader');
const anchorLinks = document.querySelectorAll('a[href^="#"]');
const heroReveals = document.querySelectorAll('.hero .reveal');
const scrollReveals = document.querySelectorAll('.reveal:not(.hero .reveal)');
const phoneInput = document.getElementById('c-phone');

const SCROLL_TRIGGER = 40;
const SCROLL_OFFSET = 70;
const PRELOADER_DELAY = 800;
const REVEAL_DELAY = 100;

// Function to toggle the navbar scrolled state
function fixNav() {
  nav.classList.toggle('scrolled', window.scrollY > SCROLL_TRIGGER);
}

// Function to close the Bootstrap mobile menu when it is open
function closeMobileMenu() {
  if (menu.classList.contains('show')) {
    bootstrap.Collapse.getInstance(menu)?.hide();
  }
}

// Function to smooth-scroll to an in-page anchor with nav offset
function smoothScroll(e) {
  const id = this.getAttribute('href');
  if (id.length <= 1) return;

  const target = document.querySelector(id);
  if (!target) return;

  e.preventDefault();
  const y = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  window.scrollTo({ top: y, behavior: 'smooth' });

  closeMobileMenu();
}

// Function to fade out the preloader after page load
function hidePreloader() {
  setTimeout(() => {
    preloader.classList.add('hidden');
    revealHero();
  }, PRELOADER_DELAY);
}

// Function to reveal hero elements with a slight stagger after the preloader fades
function revealHero() {
  setTimeout(() => {
    heroReveals.forEach((el) => el.classList.add('is-in'));
  }, REVEAL_DELAY);
}

// Function to progressively format the contact phone field as (XXX) XXX-XXXX
function formatPhone(e) {
  const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
  let formatted = '';
  if (digits.length > 0) formatted = '(' + digits.slice(0, 3);
  if (digits.length >= 4) formatted += ') ' + digits.slice(3, 6);
  if (digits.length >= 7) formatted += '-' + digits.slice(6, 10);
  e.target.value = formatted;
}

// Function to reveal non-hero elements when they scroll into view
function observeReveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  scrollReveals.forEach((el) => observer.observe(el));
}

// Event listener to toggle navbar state on scroll
window.addEventListener('scroll', fixNav);

// Event listener to smooth-scroll on anchor link clicks
anchorLinks.forEach((link) => {
  link.addEventListener('click', smoothScroll);
});

// Event listener to fade out preloader on page load
window.addEventListener('load', hidePreloader);

// Event listener to auto-format the phone field
phoneInput?.addEventListener('input', formatPhone);

// Start observing non-hero reveals immediately (observer handles visibility itself)
observeReveals();
