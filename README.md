# Rising from the Ashes — Book Landing Page

A single-page marketing site for **_Rising from the Ashes_** by E. Wise, an upcoming self-help title from **Emerald Publishing**. The page introduces the author, previews the book's eight chapters, displays reader praise, and sells three editions — e-book, hardcover, and a limited autographed run.

**Live site:** https://emerald-pub.netlify.app/

---

## Sections

- **Hero** — Title, tagline, CSS-rendered book cover, and floating ember particles.
- **About the Author** — Portrait and bio for E. Wise.
- **Inside the Book** — All eight chapters with short descriptions.
- **Praise** — Three reader reviews with avatars and 5-star ratings.
- **Shop** — Three editions (E-Book $14, Hardcover $29, Autographed $48).
- **Newsletter** — Email signup that promises the first chapter free (Netlify Forms).
- **Contact** — Editorial / press inquiries with a full contact form (Netlify Forms).
- **Footer** — Brand column, link columns, and social icons (Instagram, Twitter, Goodreads, Substack).

---

## Tech Stack

- **HTML5** — semantic, accessible markup with skip link, ARIA labels, and proper landmarks.
- **CSS3** — custom styles in [css/styles.css](css/styles.css), built on Bootstrap 5's grid.
- **Bootstrap 5.3.3** — loaded via CDN for layout grid and the mobile nav collapse.
- **Vanilla JavaScript** — no framework, no build step. See [script.js](script.js).
- **Google Fonts** — DM Serif Display (display) + Outfit (body), loaded non-blocking.
- **Cloudinary** — author portrait, reviewer avatars, and edition images, served with `f_auto,q_auto` and responsive `srcset`.
- **Netlify** — static hosting and form handling for the newsletter and contact forms.

---

## Features

- Sticky navbar that changes state on scroll
- Smooth-scroll anchor navigation with mobile menu auto-close
- Branded preloader that fades on page load
- Hero entrance animation, plus `IntersectionObserver`-driven reveals for the rest of the page
- Auto-formatted phone input — `(XXX) XXX-XXXX` as you type
- Floating ember particles in the hero
- Pure-CSS book cover (no image asset needed)
- Responsive image `srcset` and explicit `width`/`height` to reduce CLS
- Open Graph and Twitter Card meta tags for link previews
- SVG favicon embedded as a data URI

---

## Project Structure

```
emerald-pub/
├── index.html          # All page markup and section content
├── css/
│   └── styles.css      # Custom styles (loaded after Bootstrap)
├── script.js           # Nav, smooth scroll, preloader, reveals, phone format
└── README.md
```

---

## Running Locally

No build step. Open the file directly or serve the folder:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then visit http://localhost:8000.

---

## Deployment

Hosted on **Netlify**. Both forms (`newsletter` and `contact`) use `data-netlify="true"` with a honeypot field, so submissions appear in the Netlify dashboard with no backend code required.
