import { motion } from 'framer-motion'
import SectionHeading from '../components/common/SectionHeading'
import HoverCard from '../components/common/HoverCard'
import { skillGroups } from '../data/skills'
import { useReducedMotion } from '../hooks/useReducedMotion'

const EASE = [0.16, 1, 0.3, 1]

const list = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const chip = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export default function Skills() {
  const reduced = useReducedMotion()

  return (
    <section id="skills" className="section-pad relative mx-auto max-w-7xl py-24 md:py-32">
      <SectionHeading eyebrow="Skills" title="What I bring" accent="to the table" />

      <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {skillGroups.map((group, gi) => (
          <HoverCard
            key={group.id}
            delay={gi * 0.1}
            glow={group.accent}
            className="glass rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ background: group.accent }} />
              <h3 className="font-display text-xl font-semibold text-fg">{group.label}</h3>
            </div>

            <motion.ul
              variants={list}
              initial={reduced ? 'show' : 'hidden'}
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="mt-8 flex flex-wrap gap-2.5"
            >
              {group.items.map((item) => (
                <motion.li
                  key={item}
                  variants={chip}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-fg-muted transition-colors duration-300 hover:border-white/20 hover:text-fg"
                >
                  {item}
                </motion.li>
              ))}
            </motion.ul>
          </HoverCard>
        ))}
      </div>
    </section>
  )
}
