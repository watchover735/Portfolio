// Soft, slow-drifting ambient gradient blobs. Pure CSS, GPU-friendly.
// Restrained deep-red glow — never a large saturated fill.
export default function GradientGlow({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="animate-drift absolute -top-1/4 left-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 rounded-full opacity-[0.22] blur-[120px]"
        style={{
          background:
            'radial-gradient(circle at center, var(--color-accent-deep), transparent 62%)',
        }}
      />
      <div
        className="animate-drift absolute bottom-0 right-0 h-[42vmax] w-[42vmax] rounded-full opacity-[0.14] blur-[120px]"
        style={{
          animationDelay: '-9s',
          background:
            'radial-gradient(circle at center, #7a1d1d, transparent 60%)',
        }}
      />
    </div>
  )
}
