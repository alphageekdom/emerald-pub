const nav = document.getElementById('nav');
const menu = document.getElementById('navMenu');
const preloader = document.getElementById('preloader');
const anchorLinks = document.querySelectorAll('a[href^="#"]');
const heroReveals = document.querySelectorAll('.hero .reveal');

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

// Event listener to toggle navbar state on scroll
window.addEventListener('scroll', fixNav);

// Event listener to smooth-scroll on anchor link clicks
anchorLinks.forEach((link) => {
  link.addEventListener('click', smoothScroll);
});

// Event listener to fade out preloader on page load
window.addEventListener('load', hidePreloader);
