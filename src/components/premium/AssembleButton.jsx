import { useState } from 'react'
import { motion } from 'framer-motion'
import { useMagnetic } from '../../hooks/useMagnetic'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

// A 3×2 tile grid whose pieces assemble into the button surface.
const TILES = [0, 1, 2, 3, 4, 5]
const TILE_OFFSETS = [
  { x: -18, y: -14 },
  { x: 0, y: -22 },
  { x: 18, y: -14 },
  { x: -18, y: 14 },
  { x: 0, y: 22 },
  { x: 18, y: 14 },
]

/**
 * Premium button that constructs itself from geometric blocks, reveals in
 * sequence, is magnetic + hover-lit, ripples on click, and dissolves in reverse
 * on section exit. Part of one unified luxury motion system.
 *
 * @param inView   whether the section is in the viewport (drives assemble/dissolve)
 * @param index    reveal order within the group (0 = first in, last out)
 * @param total    number of buttons in the group
 */
export default function AssembleButton({
  inView,
  index,
  total,
  icon: Icon,
  label,
  sublabel,
  onClick,
  href,
  download,
  ariaLabel,
}) {
  const reduced = useReducedMotion()
  const magneticRef = useMagnetic({ strength: 0.3, max: 12 })
  const [ripple, setRipple] = useState(null)

  // Sequenced timing. Enter: Email→Resume. Exit: reverse (Resume→Email).
  const enterBase = 0.15 + index * 0.28
  const exitBase = (total - 1 - index) * 0.14

  const tileTransition = (i) =>
    inView
      ? { duration: 0.34, ease: EASE, delay: enterBase + i * 0.05 }
      : { duration: 0.28, ease: EASE, delay: exitBase + (TILES.length - 1 - i) * 0.03 }

  const contentTransition = inView
    ? { duration: 0.4, ease: EASE, delay: enterBase + 0.34 }
    : { duration: 0.25, ease: EASE, delay: exitBase }

  const handleClick = (e) => {
    if (!reduced) {
      const rect = e.currentTarget.getBoundingClientRect()
      setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, key: Date.now() })
      setTimeout(() => setRipple(null), 650)
    }
    onClick?.(e)
  }

  const Wrapper = href ? motion.a : motion.button
  const wrapperProps = href
    ? { href, download, target: download ? undefined : '_self' }
    : { type: 'button' }

  return (
    <div ref={magneticRef} className="relative">
      <Wrapper
        {...wrapperProps}
        onClick={handleClick}
        aria-label={ariaLabel || label}
        initial={false}
        whileHover={reduced ? undefined : { scale: 1.03, y: -6 }}
        whileTap={reduced ? undefined : { scale: 0.985 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="group relative flex h-40 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl sm:w-60"
        style={{ transformOrigin: 'center' }}
      >
        {/* --- Assembling tiles form the glass surface --- */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
          {TILES.map((i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="bg-white/[0.045] backdrop-blur-xl"
              initial={reduced ? false : { opacity: 0, scale: 0.6, x: TILE_OFFSETS[i].x, y: TILE_OFFSETS[i].y }}
              animate={
                reduced
                  ? { opacity: 1 }
                  : inView
                    ? { opacity: 1, scale: 1, x: 0, y: 0 }
                    : { opacity: 0, scale: 0.7, x: TILE_OFFSETS[i].x * 0.6, y: TILE_OFFSETS[i].y * 0.6 }
              }
              transition={tileTransition(i)}
            />
          ))}
        </div>

        {/* Unified border + reflection over the tile seams */}
        <span className="pointer-events-none absolute inset-0 rounded-3xl border border-white/10 transition-colors duration-500 group-hover:border-white/30" />
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-3xl opacity-40 transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.10), transparent)' }}
        />

        {/* Light sweep on hover */}
        {!reduced && (
          <span
            className="pointer-events-none absolute inset-0 -translate-x-full opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100"
            style={{
              background:
                'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.14) 50%, transparent 70%)',
              transitionTimingFunction: 'var(--premium)',
            }}
            aria-hidden="true"
          />
        )}

        {/* Click ripple */}
        {ripple && (
          <span
            key={ripple.key}
            className="pointer-events-none absolute rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 8,
              height: 8,
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(255,255,255,0.5), transparent 70%)',
              animation: 'assemble-ripple 0.6s var(--premium) forwards',
            }}
            aria-hidden="true"
          />
        )}

        {/* --- Content --- */}
        <motion.span
          className="relative z-10 flex flex-col items-center gap-3"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={reduced ? { opacity: 1 } : { opacity: inView ? 1 : 0, y: inView ? 0 : 8 }}
          transition={contentTransition}
        >
          <Icon className="text-4xl text-fg transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
          <span className="flex flex-col items-center">
            <span className="font-display text-base font-medium text-fg">{label}</span>
            {sublabel && (
              <span className="mt-0.5 text-xs text-fg-dim">{sublabel}</span>
            )}
          </span>
        </motion.span>
      </Wrapper>
    </div>
  )
}
