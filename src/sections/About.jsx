import Reveal from '../components/common/Reveal'
import SectionHeading from '../components/common/SectionHeading'

export default function About() {
  return (
    <section id="about" className="section-pad relative mx-auto max-w-7xl py-24 md:py-32">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading eyebrow="About" title="A designer who" accent="tells stories" />

        <div className="max-w-2xl">
          <Reveal delay={0.1}>
            <p className="text-2xl font-light leading-relaxed text-fg sm:text-3xl">
              I&apos;m a self-taught web designer building{' '}
              <span className="text-fg">premium, motion-driven web experiences</span> — landing
              pages and cinematic, scroll-driven sites that make a brand feel unmistakably
              high-end.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-lg leading-relaxed text-fg-muted">
              I approach every build with a storytelling mindset. A background in debate and
              public speaking taught me to communicate ideas clearly — in code and in
              conversation — so the work doesn&apos;t just look good, it says something. I care
              about pacing, restraint, and the small details that separate &ldquo;nice&rdquo;
              from &ldquo;expensive.&rdquo;
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex items-center gap-3 text-sm text-fg-dim">
              <span className="h-px w-6 bg-gold/60" />
              <span className="font-display tracking-wide">
                Based in Haryana, India · MDU University
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
