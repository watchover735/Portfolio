import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Premium interactive surface: scroll-reveal entrance + calm hover/tap lift,
// scale, border brighten, and a soft accent glow. Uses the site's single shared
// easing curve — NO bounce/spring here (that's reserved for the ID card).
//
// Works on both pointer and touch:
//   • desktop  → group-hover states + whileHover lift
//   • mobile   → group-active (press) states + whileTap, so the feedback isn't
//                silently lost where hover doesn't exist.
//
// Respects prefers-reduced-motion: renders a static, glow-free surface.
const EASE = [0.16, 1, 0.3, 1]

export default function HoverCard({
  children,
  className = '',
  delay = 0,
  glow = 'var(--color-accent)',
  amount = 0.2,
  lift = -5,
  as = 'div',
  ...rest
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  if (reduced) {
    const Tag = as
    return (
      <Tag className={`relative ${className}`} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={`group relative ${className}`}
      style={{ transformOrigin: 'center', willChange: 'transform' }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      whileHover={{ y: lift, scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      {...rest}
    >
      {/* Soft accent glow — fades in on hover (desktop) or press (mobile). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px -z-10 rounded-[inherit] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60 group-active:opacity-60"
        style={{
          background: `radial-gradient(60% 60% at 50% 0%, ${glow}, transparent 70%)`,
          transitionTimingFunction: 'var(--premium)',
        }}
      />
      {/* Border brighten on hover/press, layered above the surface. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent transition-colors duration-500 group-hover:border-white/25 group-active:border-white/25"
        style={{ transitionTimingFunction: 'var(--premium)' }}
      />
      {children}
    </MotionTag>
  )
}
