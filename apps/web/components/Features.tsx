const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: 'One-Click Extraction',
    description:
      'Click the StyleKit extension on any website to instantly extract colors, fonts, spacing, border radii, shadows, and more — no manual inspection needed.',
    accent: 'text-amber-400',
    glow: 'group-hover:shadow-amber-900/20',
    border: 'group-hover:border-amber-500/30',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2a10 10 0 0 1 10 10" />
        <path d="M12 6a6 6 0 0 1 6 6" />
        <path d="M12 10a2 2 0 0 1 2 2" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <path d="M2 12a10 10 0 0 0 10 10" />
      </svg>
    ),
    title: 'AI-Ready Output',
    description:
      'DESIGN.md format is optimized for AI coding assistants. Paste it into Claude Code, Cursor, or Copilot and your AI instantly understands the design system.',
    accent: 'text-violet-400',
    glow: 'group-hover:shadow-violet-900/20',
    border: 'group-hover:border-violet-500/30',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: 'Framework Export',
    description:
      'Export design tokens as Tailwind config, Bootstrap variables, plain CSS custom properties, or SCSS. One extraction, multiple formats.',
    accent: 'text-sky-400',
    glow: 'group-hover:shadow-sky-900/20',
    border: 'group-hover:border-sky-500/30',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" y1="19" x2="20" y2="19" />
      </svg>
    ),
    title: 'CLI Integration',
    description: (
      <>
        Run{' '}
        <code className="text-violet-400 font-mono text-xs bg-violet-500/10 px-1.5 py-0.5 rounded">
          npx stylekit-ai pull [skill]
        </code>{' '}
        to pull any design system directly into your project. Works with any framework.
      </>
    ),
    accent: 'text-emerald-400',
    glow: 'group-hover:shadow-emerald-900/20',
    border: 'group-hover:border-emerald-500/30',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="12" y1="7" x2="16" y2="7" />
        <line x1="12" y1="11" x2="16" y2="11" />
        <line x1="12" y1="15" x2="14" y2="15" />
      </svg>
    ),
    title: 'Design Skills Library',
    description:
      '50+ pre-built design systems from top products like Vercel, Linear, Stripe, and more — ready to use in your projects immediately.',
    accent: 'text-rose-400',
    glow: 'group-hover:shadow-rose-900/20',
    border: 'group-hover:border-rose-500/30',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Team Registry',
    description:
      'Create a private registry of custom design systems for your team. Publish once, pull anywhere — consistent design across all your projects.',
    accent: 'text-orange-400',
    glow: 'group-hover:shadow-orange-900/20',
    border: 'group-hover:border-orange-500/30',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 bg-zinc-950">
      {/* Section separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 text-xs font-medium uppercase tracking-wider">
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">
            Everything you need to
            <br />
            replicate any design
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            From extraction to implementation — StyleKit handles the entire design token workflow.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${feature.glow} ${feature.border} hover:-translate-y-1`}
            >
              {/* Top accent line */}
              <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent ${feature.accent.replace('text-', 'via-').replace('400', '500/40')} to-transparent`} />

              {/* Icon container */}
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 bg-zinc-900 border border-zinc-800 ${feature.accent}`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-base font-semibold text-zinc-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
    </section>
  )
}
