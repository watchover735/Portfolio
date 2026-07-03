// Generates a clean one-page résumé PDF at public/resume.pdf from spec content.
// Run via `npm run resume` (also runs automatically on `npm run build`).
//
// Content is intentionally limited per the portfolio's identity rules:
//   • Institution name only (MDU University) — NO degree / branch / year / grades
//   • Location limited to "Haryana, India"
//   • Contact = email only — no phone, no address, no social links
//   • Experience framed as self-taught — no fabricated job history
import { jsPDF } from 'jspdf'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/resume.pdf')

// Kept in sync with the site's VITE_CONTACT_EMAIL.
const EMAIL = 'mycontrolx.tech@gmail.com'

const INK = [17, 17, 17]
const MUTED = [90, 90, 96]
const ACCENT = [185, 28, 28]
const HAIR = [214, 214, 218]

const doc = new jsPDF({ unit: 'pt', format: 'a4' })
const W = doc.internal.pageSize.getWidth()
const M = 54 // margin
let y = 0

function text(str, x, yy, { size = 10, color = INK, font = 'helvetica', style = 'normal', spacing } = {}) {
  doc.setFont(font, style)
  doc.setFontSize(size)
  doc.setTextColor(...color)
  if (spacing !== undefined) doc.text(str, x, yy, { charSpace: spacing })
  else doc.text(str, x, yy)
}

function hr(yy, color = HAIR) {
  doc.setDrawColor(...color)
  doc.setLineWidth(0.75)
  doc.line(M, yy, W - M, yy)
}

function sectionTitle(label, yy) {
  text(label.toUpperCase(), M, yy, { size: 9.5, color: ACCENT, style: 'bold', spacing: 2 })
  hr(yy + 7)
  return yy + 24
}

// ---- Header ----------------------------------------------------------------
y = 64
text('RAHUL', M, y, { size: 30, style: 'bold', spacing: 1 })
y += 20
text('Web Designer — Landing Pages & Cinematic Web Experiences', M, y, {
  size: 11.5,
  color: ACCENT,
})
y += 16
text('Haryana, India   ·   ' + EMAIL + '   ·   Self-taught', M, y, { size: 9.5, color: MUTED })
y += 18
hr(y, INK)
y += 26

// ---- Summary ---------------------------------------------------------------
y = sectionTitle('Summary', y)
const summary = doc.splitTextToSize(
  'Self-taught web designer building premium, motion-driven web experiences — landing pages ' +
    'and cinematic, scroll-driven sites that make a brand feel unmistakably high-end. I approach ' +
    'every build with a storytelling mindset, communicating ideas clearly in both code and ' +
    'conversation, with a focus on pacing, restraint, and performance.',
  W - M * 2,
)
text(summary, M, y, { size: 10, color: MUTED })
y += summary.length * 13 + 14

// ---- Skills ----------------------------------------------------------------
y = sectionTitle('Skills', y)
const skillRows = [
  ['Languages & Tools', 'Python · Java · JavaScript · TypeScript · React · HTML5 · CSS3'],
  ['Platforms', 'Firebase · Supabase · Git · GitHub'],
  ['Craft', 'HTML5 Canvas API · Scroll-driven Animation · Motion Design · Responsive Design'],
  ['Frameworks', 'Tailwind CSS · Framer Motion'],
  ['Professional', 'Clear Communication · Client Communication'],
]
for (const [k, v] of skillRows) {
  text(k, M, y, { size: 9.5, style: 'bold', color: INK })
  const val = doc.splitTextToSize(v, W - M * 2 - 120)
  text(val, M + 120, y, { size: 9.5, color: MUTED })
  y += Math.max(val.length * 12, 14) + 4
}
y += 10

// ---- Projects --------------------------------------------------------------
y = sectionTitle('Selected Projects', y)
const projects = [
  ['Salon — Cinematic Scroll Experience', 'Fully responsive, scroll-driven frame-by-frame product film built with HTML5 Canvas and a custom scroll-sync engine.'],
  ['Pizza — Cinematic Product Site', 'Multi-video scroll sequence (2100vh depth) recreating an Apple-style product reveal for a pizza brand.'],
  ['Chocos — Cinematic Brand Site', "Scroll-controlled cinematic animation built for a Kellogg's Chocos concept site."],
]
for (const [title, desc] of projects) {
  text('•  ' + title, M, y, { size: 10, style: 'bold', color: INK })
  y += 13
  const d = doc.splitTextToSize(desc, W - M * 2 - 14)
  text(d, M + 14, y, { size: 9.5, color: MUTED })
  y += d.length * 12 + 10
}
y += 6

// ---- Education -------------------------------------------------------------
y = sectionTitle('Education', y)
text('MDU University', M, y, { size: 10, style: 'bold', color: INK })
y += 20

// ---- Contact ---------------------------------------------------------------
y = sectionTitle('Contact', y)
text(EMAIL, M, y, { size: 10, color: MUTED })

// ---- Footer note -----------------------------------------------------------
doc.setFont('helvetica', 'italic')
doc.setFontSize(8)
doc.setTextColor(...MUTED)
doc.text('I bring the web to life.', W / 2, doc.internal.pageSize.getHeight() - 32, {
  align: 'center',
})

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, Buffer.from(doc.output('arraybuffer')))
console.log('✓ Résumé written to', OUT)
