import { motion } from 'framer-motion'
import GradientGlow from '../components/ambient/GradientGlow'
import ParticleField from '../components/ambient/ParticleField'
import { useMagnetic } from '../hooks/useMagnetic'
import { useReducedMotion } from '../hooks/useReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

function scrollTo(href) {
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function MagneticCTA({ href, children, variant }) {
  const ref = useMagnetic({ strength: 0.25, max: 10 })
  // transition scoped to colors/border/shadow only — NOT transform, so the
  // magnetic pull (which writes transform each frame) stays snappy.
  const base =
    'group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-display text-sm font-medium transition-[background-color,border-color,box-shadow] duration-500'
  const styles =
    variant === 'primary'
      ? 'bg-accent text-white hover:bg-accent-deep shadow-[0_10px_40px_-12px_var(--color-accent)]'
      : 'glass text-fg hover:border-white/25'
  return (
    <a
      ref={ref}
      href={href}
      onClick={(e) => {
        e.preventDefault()
        scrollTo(href)
      }}
      className={`${base} ${styles}`}
      style={{ transitionTimingFunction: 'var(--premium)' }}
    >
      {children}
    </a>
  )
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
}

export default function Hero() {
  const reduced = useReducedMotion()
  const initial = reduced ? 'show' : 'hidden'

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
    >
      <GradientGlow />
      <ParticleField />

      <div className="section-pad relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Text column */}
        <motion.div variants={container} initial={initial} animate="show" className="max-w-2xl">
          <motion.div variants={item} className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-accent" />
            <span className="font-display text-xs uppercase tracking-[0.28em] text-fg-muted">
              Web Designer · Self-taught
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl"
          >
            <span className="text-gradient">Rahul</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg text-fg-muted sm:text-xl"
          >
            Web Designer — Premium Landing Pages &amp; Cinematic Web Experiences
          </motion.p>

          <motion.p
            variants={item}
            className="mt-4 font-serif text-3xl italic text-gold-soft sm:text-4xl"
          >
            I bring the web to life.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticCTA href="#work" variant="primary">
              View My Work
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </MagneticCTA>
            <MagneticCTA href="#contact" variant="ghost">
              Get In Touch
            </MagneticCTA>
          </motion.div>
        </motion.div>

        {/* Avatar column */}
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative">
            {/* glow ring behind avatar */}
            <div
              className="absolute inset-0 -z-10 rounded-[2rem] opacity-60 blur-3xl"
              style={{
                background:
                  'radial-gradient(circle at 50% 40%, rgba(220,38,38,0.35), transparent 60%)',
              }}
            />
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-ink-2">
              {/* AI-generated stylized avatar (no real photo). Replace file to update. */}
              <img
                src="/assets/avatar.png"
                alt="Stylized 3D avatar representing Rahul"
                className={`h-full w-full object-cover ${reduced ? '' : 'animate-float-slow'}`}
                loading="eager"
                width="880"
                height="1200"
              />
            </div>
            {/* small gold accent badge */}
            <div className="glass absolute -bottom-4 -left-4 flex items-center gap-2 rounded-full px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-gold" />
              <span className="font-display text-xs tracking-wide text-fg-muted">
                Available for work
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* scroll hint */}
      {!reduced && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        >
          <span className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-fg-dim">
            Scroll
          </span>
          <span className="h-10 w-[1px] bg-gradient-to-b from-fg-dim to-transparent" />
        </motion.div>
      )}
    </section>
  )
}
