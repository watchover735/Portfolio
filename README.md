# Rahul — Portfolio

A premium, motion-first portfolio for a web designer specializing in cinematic,
scroll-driven landing pages. Built as a live proof-of-skill.

**Stack:** React 19 · Vite 6 · Tailwind CSS v4 · Framer Motion · EmailJS · jsPDF

---

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run build      # production build → dist/  (auto-generates the résumé PDF first)
npm run preview    # preview the production build
npm run resume     # (re)generate public/resume.pdf from spec content
```

Node 18+ required.

---

## Configuration

Copy `.env.example` → `.env` and fill in the values you have:

```
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
VITE_CONTACT_EMAIL=your@email.com
```

- **EmailJS** — until all three keys are present, the contact form **gracefully
  falls back to a `mailto:` link** (opens the visitor's mail app pre-filled). No
  crash, no dead form. Create a free account at <https://www.emailjs.com/>.
  The template should expose: `from_name`, `reply_to`, `message`, `to_email`.
- **VITE_CONTACT_EMAIL** — the address shown on the site and used for the
  mailto fallback. Also update `EMAIL` in `scripts/generate-resume.mjs` so the
  résumé matches, then rerun `npm run resume`.

---

## Placeholders to replace with real assets/values

| Placeholder | Where | Action |
|---|---|---|
| `your@email.com` | `.env` (`VITE_CONTACT_EMAIL`) + `scripts/generate-resume.mjs` | Set your real email, rerun `npm run resume` |
| EmailJS keys | `.env` | Add to enable in-form sending (else mailto fallback) |
| `public/assets/avatar.png` | Hero | Supplied AI avatar — swap the file to update |
| `public/assets/previews/*.mp4` / `*.png` | Featured Work | Compressed from the supplied recordings; replace to update |

Everything renders and builds correctly **as-is** with the placeholders.

---

## Identity rules baked into the content

This site deliberately shows: no real photo (AI avatar only), no social links
(email + form only), location limited to "Haryana, India", education limited to
"MDU University" (no degree/branch/grades), no certificates, experience framed
as self-taught. The résumé generator enforces the same limits.

## Structure

```
src/
  components/   Preloader, Navbar, ambient bg, common wrappers, premium AssembleButton
  sections/     Hero, About, TechStack, FeaturedWork, Skills, Services, Contact, Footer
  hooks/        useReveal, useMagnetic, useReducedMotion, useScrolled
  data/         projects, techStack, skills, services
scripts/
  generate-resume.mjs   builds public/resume.pdf (runs on prebuild)
```
