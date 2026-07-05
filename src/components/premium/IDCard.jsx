import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { FiX, FiCopy, FiCheck, FiMail } from 'react-icons/fi'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Contact email — mirrors the Contact section source of truth.
const EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'mycontrolx.tech@gmail.com'

// Card + lanyard geometry (px). The string hangs from a fixed anchor and its
// bottom endpoint is solved so it always meets the card's top-centre.
const CARD_W = 300
const CARD_H = 420
const ANCHOR_Y = 10 // where the lanyard leaves the pin
const STRING_LEN = 116 // resting lanyard length

// After a drag ends, wait this long before resuming the auto-spin so the
// swing-back has time to settle first.
const RESUME_DELAY = 800 // ms

// The ID card: drops in on a lanyard, is draggable with real spring physics
// (swing/bounce), and continuously rotates on its Y-axis via a simple CSS
// animation. The spin is the ONE intentional motion exception on the site.
export default function IDCard({ onClose }) {
  const reduced = useReducedMotion()
  const [copied, setCopied] = useState(false)

  // Single source of truth for position: Framer's built-in `drag` owns x/y.
  // We only READ them for secondary effects (lanyard bend, tilt) — never write
  // a competing transform back, so the card always moves WITH the gesture.
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  // Auto-spin is CSS-driven (see .id-card-spinner in index.css). We only track
  // when to run it: it starts once the drop-in finishes (`entered`) and pauses
  // while the user is actively dragging (`dragging`).
  const [dragging, setDragging] = useState(false)
  const [entered, setEntered] = useState(false)
  const resumeRef = useRef(0) // timeout id used to resume the spin after a drag

  // Lanyard follows the card. Pivot is at the TOP, screen y points down, so the
  // string's bottom endpoint after a CSS rotate θ is (−H·sinθ, H·cosθ). Solving
  // for the card offset (x, STRING_LEN + y) gives θ = atan2(−x, STRING_LEN + y).
  // (The negated x is what keeps the string attached on the correct side.)
  const stringLen = useTransform([x, y], ([lx, ly]) => Math.hypot(lx, STRING_LEN + ly))
  const stringAngle = useTransform(
    [x, y],
    ([lx, ly]) => (Math.atan2(-lx, STRING_LEN + ly) * 180) / Math.PI,
  )
  // Tilt: with a top pivot, dragging right must swing the card's BODY right,
  // which is a negative (counter-swinging) rotate — matches the drag direction.
  const tilt = useTransform(x, [-140, 140], [14, -14])

  // Lock page scroll + wire Escape to close while the card is open.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  // Clear the pending resume timer if the card unmounts mid-drag.
  useEffect(() => () => clearTimeout(resumeRef.current), [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  // Pause the auto-spin the instant a drag begins so it doesn't fight the swing.
  const handleDragStart = () => {
    clearTimeout(resumeRef.current)
    setDragging(true)
  }
  // Resume the spin a moment after release, once the swing-back has settled.
  const handleDragEnd = () => {
    resumeRef.current = setTimeout(() => setDragging(false), RESUME_DELAY)
  }

  // ---------- Card faces ----------
  const shell =
    'absolute inset-0 flex flex-col overflow-hidden rounded-[1.75rem] border border-white/12 bg-ink-2/95 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl'

  const accentGlow = (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
      style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }}
    />
  )

  // Front — avatar + identity
  const Front = (
    <div className={shell} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
      {accentGlow}
      <div className="relative flex items-center justify-between px-5 pt-4">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="font-display text-[0.6rem] uppercase tracking-[0.28em] text-fg-muted">
            Portfolio · ID
          </span>
        </span>
        <span className="font-display text-[0.55rem] uppercase tracking-[0.24em] text-fg-dim">
          Front
        </span>
      </div>

      {/* AI-generated avatar (never a real photo) */}
      <div className="relative mx-5 mt-4 overflow-hidden rounded-2xl border border-white/10">
        <img
          src="/assets/avatar.png"
          alt="Stylized AI-generated avatar representing Rahul"
          className="h-52 w-full object-cover"
          draggable="false"
          width="300"
          height="208"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-2/80 to-transparent" />
        <span className="absolute bottom-3 right-3 h-5 w-7 rounded-[4px] bg-gradient-to-br from-gold-soft to-gold opacity-90" />
      </div>

      <div className="relative flex flex-1 flex-col justify-between px-5 pb-5 pt-4">
        <div>
          <h3 className="font-display text-2xl font-bold tracking-tight text-fg">Rahul</h3>
          <p className="mt-0.5 font-display text-[0.7rem] uppercase tracking-[0.22em] text-fg-dim">
            Web Designer
          </p>
        </div>
        <p className="font-display text-[0.6rem] uppercase tracking-[0.24em] text-fg-dim">
          Drag to swing
        </p>
      </div>
    </div>
  )

  // Back — contact (email only, per site rules)
  const Back = (
    <div
      className={shell}
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
      }}
    >
      {accentGlow}
      <div className="relative flex items-center justify-between px-5 pt-4">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-gold" />
          <span className="font-display text-[0.6rem] uppercase tracking-[0.28em] text-fg-muted">
            Contact
          </span>
        </span>
        <span className="font-display text-[0.55rem] uppercase tracking-[0.24em] text-fg-dim">
          Back
        </span>
      </div>

      <div className="relative flex flex-1 flex-col justify-between px-5 pb-5 pt-6">
        <div>
          <p className="font-serif text-2xl italic leading-snug text-gold-soft">
            I bring the web to life.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            Available for premium landing pages &amp; cinematic web experiences.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={copyEmail}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left text-sm text-fg-muted transition-colors hover:border-accent/40 hover:text-fg"
          >
            {copied ? <FiCheck className="shrink-0 text-gold" /> : <FiCopy className="shrink-0" />}
            <span className="truncate">{copied ? 'Copied to clipboard' : EMAIL}</span>
          </button>
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
          >
            <FiMail /> Email me
          </a>
        </div>
      </div>
    </div>
  )

  const CloseButton = (
    <button
      onClick={onClose}
      aria-label="Close ID card"
      className="fixed right-5 top-5 z-[110] flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-ink-2/70 text-fg-muted backdrop-blur-md transition-colors hover:border-white/30 hover:text-fg"
    >
      <FiX />
    </button>
  )

  // ---- Reduced motion: static card, simple fade, no drag/spin physics. ----
  if (reduced) {
    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div
          className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        />
        {CloseButton}
        <motion.div
          className="relative"
          style={{ width: CARD_W, height: CARD_H }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {Front}
        </motion.div>
      </div>,
      document.body,
    )
  }

  // ---- Full physics: lanyard drop-in, spring-back swing, fling-to-spin. ----
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-hidden">
      {/* Backdrop — click outside to dismiss */}
      <motion.div
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      />

      {CloseButton}

      {/* Dropper — the whole rig falls in from above with a weighted settle,
          then lifts back off-screen the same way on close. */}
      <motion.div
        className="pointer-events-none relative mt-[8vh]"
        style={{ width: CARD_W }}
        initial={{ y: '-130vh' }}
        animate={{ y: 0 }}
        exit={{ y: '-130vh' }}
        transition={{ type: 'spring', stiffness: 120, damping: 15, mass: 1.1 }}
        onAnimationComplete={() => setEntered(true)}
      >
        {/* Anchor pin the lanyard hangs from */}
        <span className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
          <span className="block h-3 w-8 rounded-full bg-gradient-to-b from-white/40 to-white/10 shadow-[0_1px_4px_rgba(0,0,0,0.6)]" />
        </span>

        {/* Lanyard string — length & angle track the card's drag offset */}
        <motion.span
          aria-hidden="true"
          className="absolute z-10 origin-top rounded-full"
          style={{
            top: ANCHOR_Y,
            left: CARD_W / 2 - 1.5,
            width: 3,
            height: stringLen,
            rotate: stringAngle,
            background: 'linear-gradient(180deg, var(--color-accent-soft), var(--color-accent-deep))',
          }}
        />

        {/* Draggable rig. Framer owns x/y; on release it springs back with an
            underdamped wobble (a few visible swings before settling). */}
        <motion.div
          className="pointer-events-auto absolute left-0 cursor-grab touch-none active:cursor-grabbing"
          style={{
            top: ANCHOR_Y + STRING_LEN,
            width: CARD_W,
            x,
            y,
            rotate: tilt,
            transformOrigin: 'top center',
          }}
          drag
          dragElastic={0.6}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 8 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.02 }}
        >
          {/* Perspective host for the 3D auto-spin */}
          <div style={{ perspective: 1200 }}>
            <div
              className={`id-card-spinner relative ${entered ? 'is-spinning' : ''} ${
                dragging ? 'is-paused' : ''
              }`}
              style={{ width: CARD_W, height: CARD_H }}
            >
              {Front}
              {Back}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>,
    document.body,
  )
}
