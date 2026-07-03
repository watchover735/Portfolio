import { FiShield } from 'react-icons/fi'
import SectionHeading from '../components/common/SectionHeading'
import Reveal from '../components/common/Reveal'
import { services, scopeNote } from '../data/services'

export default function Services() {
  return (
    <section id="services" className="section-pad relative mx-auto max-w-7xl py-24 md:py-32">
      <SectionHeading eyebrow="Services" title="How we can" accent="work together" />

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {services.map((s, i) => (
          <Reveal
            key={s.id}
            delay={i * 0.1}
            className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border p-8 md:p-10 ${
              s.highlight
                ? 'border-accent/40 bg-gradient-to-br from-accent/[0.08] to-transparent'
                : 'border-white/10 bg-ink-2'
            }`}
          >
            {s.highlight && (
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
                style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }}
              />
            )}
            <div className="relative">
              <span
                className={`inline-block rounded-full px-3 py-1 font-display text-[0.65rem] uppercase tracking-[0.2em] ${
                  s.highlight ? 'bg-accent text-white' : 'border border-white/15 text-fg-muted'
                }`}
              >
                {s.tag}
              </span>
              <h3 className="mt-6 font-display text-2xl font-semibold text-fg sm:text-3xl">
                {s.title}
              </h3>
              <p className="mt-4 max-w-md leading-relaxed text-fg-muted">{s.description}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Scope note — confident "what's included", not a disclaimer */}
      <Reveal delay={0.15}>
        <div className="mt-8 flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7">
          <FiShield className="mt-0.5 shrink-0 text-xl text-gold" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-fg-muted">
            <span className="font-medium text-fg">What&apos;s included: </span>
            {scopeNote}
          </p>
        </div>
      </Reveal>
    </section>
  )
}
