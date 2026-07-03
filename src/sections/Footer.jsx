import { FiArrowUp } from 'react-icons/fi'

export default function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const year = 2026 // build year — no runtime Date needed

  return (
    <footer className="section-pad relative border-t border-white/5 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <a href="#home" className="font-display text-lg font-bold text-fg">
            Rahul<span className="text-accent">.</span>
          </a>
          <p className="font-serif text-sm italic text-fg-dim">I bring the web to life.</p>
        </div>

        <p className="order-last text-xs text-fg-dim sm:order-none">
          © {year} Rahul · Web Designer · Haryana, India
        </p>

        <button
          onClick={toTop}
          aria-label="Back to top"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-fg-muted transition-colors hover:border-white/25 hover:text-fg"
        >
          Back to top
          <FiArrowUp className="transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  )
}
