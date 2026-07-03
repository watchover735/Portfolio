import Reveal from './Reveal'

// Consistent section header: small eyebrow with red tick + large display title.
export default function SectionHeading({ eyebrow, title, accent, align = 'left', id }) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  return (
    <div className={`flex flex-col gap-4 ${alignCls}`} id={id}>
      {eyebrow && (
        <Reveal as="div" y={16} className="flex items-center gap-3">
          <span className="h-px w-8 bg-accent" />
          <span className="font-display text-xs uppercase tracking-[0.28em] text-fg-muted">
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal as="h2" delay={0.05}>
        <span className="font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-gradient">{title} </span>
          {accent && <span className="text-accent-gradient">{accent}</span>}
        </span>
      </Reveal>
    </div>
  )
}
