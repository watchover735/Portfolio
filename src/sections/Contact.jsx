import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { FiMail, FiDownload, FiCopy, FiCheck } from 'react-icons/fi'
import SectionHeading from '../components/common/SectionHeading'
import Reveal from '../components/common/Reveal'
import ParticleField from '../components/ambient/ParticleField'
import AssembleButton from '../components/premium/AssembleButton'
import { useReveal } from '../hooks/useReveal'

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'your@email.com'
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const EMAILJS_READY = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)

export default function Contact() {
  // once:false so buttons assemble on enter AND dissolve in reverse on exit.
  const [btnRef, btnInView] = useReveal({ threshold: 0.35, once: false })

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [copied, setCopied] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    if (!EMAILJS_READY) {
      // Graceful fallback: open the user's mail client pre-filled.
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
      const subject = encodeURIComponent(`Portfolio enquiry from ${form.name || 'a visitor'}`)
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
      return
    }

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name,
          reply_to: form.email,
          message: form.message,
          to_email: CONTACT_EMAIL,
        },
        { publicKey: PUBLIC_KEY },
      )
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-32">
      <ParticleField density={0.00006} />

      <div className="section-pad relative z-10 mx-auto max-w-7xl">
        <SectionHeading eyebrow="Contact" title="Let's build" accent="something premium" align="center" />
        <Reveal delay={0.1} className="mx-auto mt-6 max-w-xl text-center text-fg-muted">
          <p>
            Have a project in mind, or a role you think I&apos;d fit? Send a message — or grab my
            résumé below.
          </p>
        </Reveal>

        {/* Premium button system: Email → Resume */}
        <div
          ref={btnRef}
          className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          <AssembleButton
            inView={btnInView}
            index={0}
            total={2}
            icon={FiMail}
            label="Email"
            sublabel={CONTACT_EMAIL}
            href={`mailto:${CONTACT_EMAIL}`}
            ariaLabel={`Email ${CONTACT_EMAIL}`}
          />
          <AssembleButton
            inView={btnInView}
            index={1}
            total={2}
            icon={FiDownload}
            label="Resume"
            sublabel="Download PDF"
            href="/resume.pdf"
            download="Rahul-Resume.pdf"
            ariaLabel="Download résumé as PDF"
          />
        </div>

        {/* Click-to-copy email line */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={copyEmail}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-fg-muted transition-colors hover:border-white/25 hover:text-fg"
          >
            {copied ? <FiCheck className="text-gold" /> : <FiCopy />}
            <span>{copied ? 'Copied to clipboard' : CONTACT_EMAIL}</span>
          </button>
        </div>

        {/* Contact form */}
        <Reveal delay={0.15} className="mx-auto mt-14 max-w-2xl">
          <form onSubmit={onSubmit} className="glass rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                label="Name"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your name"
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@company.com"
              />
            </div>
            <div className="mt-5">
              <label className="mb-2 block font-display text-xs uppercase tracking-[0.2em] text-fg-dim">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={onChange}
                placeholder="Tell me about your project or role…"
                className="w-full resize-none rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-fg outline-none transition-colors placeholder:text-fg-dim focus:border-accent/60"
              />
            </div>

            <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 font-display text-sm font-medium text-white transition-all duration-500 hover:bg-accent-deep disabled:opacity-60"
                style={{ transitionTimingFunction: 'var(--premium)' }}
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>

              <p className="text-sm" aria-live="polite">
                {status === 'sent' && <span className="text-gold">Thanks — I&apos;ll be in touch.</span>}
                {status === 'error' && (
                  <span className="text-accent-soft">
                    Something went wrong. Email me directly instead.
                  </span>
                )}
                {status === 'idle' && !EMAILJS_READY && (
                  <span className="text-fg-dim">Opens your mail app.</span>
                )}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function Field({ label, name, type = 'text', value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-2 block font-display text-xs uppercase tracking-[0.2em] text-fg-dim">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-ink/60 px-4 py-3 text-fg outline-none transition-colors placeholder:text-fg-dim focus:border-accent/60"
      />
    </div>
  )
}
