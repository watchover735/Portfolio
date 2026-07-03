import { motion } from 'framer-motion'
import SectionHeading from '../components/common/SectionHeading'
import { techStack } from '../data/techStack'
import { useReducedMotion } from '../hooks/useReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
}
const cell = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export default function TechStack() {
  const reduced = useReducedMotion()

  return (
    <section id="stack" className="section-pad relative mx-auto max-w-7xl py-24 md:py-28">
      <SectionHeading eyebrow="Tech Stack" title="Tools of the" accent="craft" />

      <motion.ul
        variants={grid}
        initial={reduced ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6"
      >
        {techStack.map(({ name, Icon, color }) => (
          <motion.li
            key={name}
            variants={cell}
            style={{ '--brand': color, transitionTimingFunction: 'var(--premium)' }}
            className="group glass relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl px-4 py-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20"
          >
            {/* subtle brand-tinted glow on hover */}
            <span
              className="pointer-events-none absolute inset-0 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-20"
              style={{
                background: 'radial-gradient(circle at 50% 30%, var(--brand), transparent 70%)',
              }}
            />
            <Icon
              className="relative text-3xl text-fg-muted transition-all duration-500 group-hover:scale-110 group-hover:[color:var(--brand)]"
              aria-hidden="true"
            />
            <span className="relative font-display text-xs font-medium tracking-wide text-fg-muted transition-colors duration-500 group-hover:text-fg">
              {name}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}
