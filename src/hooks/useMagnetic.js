import { useEffect, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

// Magnetic cursor pull. The element glides a few px toward the cursor when it
// hovers nearby, and smoothly returns on leave. No spring / no overshoot.
export function useMagnetic({ strength = 0.32, max = 14 } = {}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const render = () => {
      // ease current toward target
      cx += (tx - cx) * 0.18
      cy += (ty - cy) * 0.18
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(render)
      } else {
        raf = 0
      }
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const relX = e.clientX - (r.left + r.width / 2)
      const relY = e.clientY - (r.top + r.height / 2)
      tx = Math.max(-max, Math.min(max, relX * strength))
      ty = Math.max(-max, Math.min(max, relY * strength))
      kick()
    }

    const onLeave = () => {
      tx = 0
      ty = 0
      kick()
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [strength, max, reduced])

  return ref
}
