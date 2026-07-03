import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

// Elegant sub-1.5s load: monogram draws in, a hairline progress fills,
// then the whole curtain lifts away to reveal the site.
export default function Preloader({ onDone }) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (reduced) {
      setGone(true)
      onDone?.()
      return
    }
    let start
    const total = 1200
    let raf
    const tick = (t) => {
      if (start === undefined) start = t
      const p = Math.min(1, (t - start) / total)
      // ease-out feel
      setProgress(1 - Math.pow(1 - p, 3))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setTimeout(() => setGone(true), 180)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced, onDone])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-2%' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex flex-col items-center gap-6"
          >
            <div className="font-display text-5xl font-bold tracking-tight text-fg">
              R<span className="text-accent">.</span>
            </div>
            <div className="h-px w-40 overflow-hidden bg-white/10">
              <div
                className="h-full bg-accent"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <span className="font-display text-[0.65rem] uppercase tracking-[0.4em] text-fg-dim">
              I bring the web to life
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
