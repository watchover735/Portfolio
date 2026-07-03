import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { useReducedMotion } from '../hooks/useReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

// A large, cinematic project card. The preview media scales/parallaxes on hover
// and a muted video loop plays; static poster shown otherwise.
export default function ProjectCard({ project, featured }) {
  const { index, title, subtitle, kicker, description, tags, responsive, liveUrl, video, poster } =
    project
  const reduced = useReducedMotion()
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const onEnter = () => {
    if (reduced) return
    const v = videoRef.current
    if (v) {
      v.play().then(() => setPlaying(true)).catch(() => {})
    }
  }
  const onLeave = () => {
    const v = videoRef.current
    if (v) {
      v.pause()
      setPlaying(false)
    }
  }

  return (
    <motion.article
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: EASE }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-2 ${
        featured ? 'lg:grid lg:grid-cols-[1.35fr_1fr]' : ''
      }`}
    >
      {/* Media */}
      <a
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className={`relative block overflow-hidden ${
          featured ? 'aspect-[16/10] lg:aspect-auto lg:h-full' : 'aspect-[16/10]'
        }`}
        aria-label={`Open ${title} live site in a new tab`}
      >
        {/* poster still */}
        <img
          src={poster}
          alt={`${title} — preview`}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04] ${
            playing ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ transitionTimingFunction: 'var(--premium)' }}
        />
        {/* muted looping video, plays on hover */}
        {!reduced && (
          <video
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            preload="none"
            poster={poster}
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${
              playing ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        {/* gradient scrim */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        {/* corner index */}
        <span className="absolute left-5 top-4 font-display text-sm font-medium tracking-widest text-white/70">
          {index}
        </span>
        {/* live-link chip */}
        <span className="glass absolute right-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-fg opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          Live <FiArrowUpRight />
        </span>
      </a>

      {/* Content */}
      <div className={`relative flex flex-col justify-between gap-6 p-6 sm:p-8 ${featured ? 'lg:p-10' : ''}`}>
        <div>
          <p className="font-display text-[0.7rem] uppercase tracking-[0.24em] text-fg-dim">
            {kicker}
          </p>
          <h3 className="mt-3 flex flex-wrap items-baseline gap-x-3 font-display font-bold tracking-tight">
            <span className={`text-gradient ${featured ? 'text-4xl sm:text-5xl' : 'text-3xl'}`}>
              {title}
            </span>
            <span className="text-base font-normal text-accent-soft sm:text-lg">{subtitle}</span>
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-muted sm:text-base">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-fg-muted"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-fg-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {responsive}
            </span>
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-1.5 font-display text-sm font-medium text-fg transition-colors hover:text-accent-soft"
            >
              View live
              <FiArrowUpRight className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
