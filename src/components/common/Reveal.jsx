import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Global scroll-reveal: subtle fade + slight translate-Y (20–40px), premium easing.
// Never large slide-ins or spins. Respects prefers-reduced-motion.
const EASE = [0.16, 1, 0.3, 1]

export default function Reveal({
  children,
  as = 'div',
  y = 28,
  delay = 0,
  duration = 0.8,
  amount = 0.2,
  className = '',
  ...rest
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  if (reduced) {
    const Tag = as
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
