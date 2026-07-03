import SectionHeading from '../components/common/SectionHeading'
import Reveal from '../components/common/Reveal'
import ProjectCard from './ProjectCard'
import { projects } from '../data/projects'

export default function FeaturedWork() {
  const [salon, ...rest] = projects // Salon first & most prominent (Rule 7)

  return (
    <section id="work" className="section-pad relative mx-auto max-w-7xl py-24 md:py-32">
      <div className="flex flex-col gap-4">
        <SectionHeading eyebrow="Featured Work" title="Selected" accent="experiences" />
        <Reveal delay={0.1}>
          <p className="max-w-xl text-fg-muted">
            A short reel of cinematic, scroll-driven builds — each one a small proof of what the
            web can feel like when motion leads the design.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 flex flex-col gap-8">
        {/* Salon — hero card, full width & largest */}
        <ProjectCard project={salon} featured />

        {/* Pizza + Chocos — secondary grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {rest.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
