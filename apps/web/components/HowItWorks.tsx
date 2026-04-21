import CodeBlock from './CodeBlock'

const steps = [
  {
    number: '01',
    title: 'Install the Chrome Extension',
    description:
      'Add StyleKit to Chrome in seconds. It\'s free, lightweight, and requires no account or login to get started.',
    cta: { label: 'Add to Chrome — Free', href: '#' },
    visual: (
      <div className="relative flex items-center justify-center h-40">
        <div className="relative">
          {/* Chrome browser mockup */}
          <div className="w-56 h-32 rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border-b border-zinc-700">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              <div className="flex-1 ml-2 h-4 rounded-md bg-zinc-700/50" />
            </div>
            <div className="p-3 space-y-1.5">
              <div className="h-2 rounded bg-zinc-700/60 w-3/4" />
              <div className="h-2 rounded bg-zinc-700/40 w-full" />
              <div className="h-2 rounded bg-zinc-700/40 w-5/6" />
            </div>
          </div>
          {/* Extension badge */}
          <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 px-3 py-2 bg-violet-600 rounded-xl shadow-lg shadow-violet-900/50 text-white text-xs font-semibold">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            StyleKit
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '02',
    title: 'Visit any website and click "Extract"',
    description:
      'Browse to any site — your competitor, a design inspiration, or a component library. Click the StyleKit icon and watch it analyze the design tokens in real time.',
    visual: (
      <div className="relative flex items-center justify-center h-40">
        <div className="relative w-56">
          {/* Extraction animation */}
          <div className="space-y-2">
            {[
              { label: 'Colors', value: '12 extracted', color: 'text-amber-400', done: true },
              { label: 'Typography', value: '4 families', color: 'text-sky-400', done: true },
              { label: 'Spacing', value: '8 values', color: 'text-emerald-400', done: true },
              { label: 'Shadows', value: 'Analyzing...', color: 'text-violet-400', done: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/40">
                <div className={`w-1.5 h-1.5 rounded-full ${item.done ? 'bg-emerald-400' : 'bg-violet-400 animate-pulse'}`} />
                <span className="text-xs text-zinc-400 flex-1">{item.label}</span>
                <span className={`text-xs font-mono ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '03',
    title: 'Copy your DESIGN.md and use it with AI',
    description:
      'Your DESIGN.md is ready instantly. Copy it and paste into Claude Code, Cursor, or any AI coding tool. Your AI assistant now understands the exact design system.',
    cta: { label: 'View an example DESIGN.md', href: '#' },
    visual: (
      <div className="relative flex items-center justify-center h-40">
        <div className="w-56">
          <div className="rounded-lg overflow-hidden border border-zinc-700/60 bg-zinc-900/80 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/60 border-b border-zinc-700/40">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <span className="text-zinc-500">DESIGN.md</span>
              <div className="ml-auto text-zinc-500 text-[10px]">✓ Copied</div>
            </div>
            <div className="p-3 space-y-1">
              <div className="text-violet-400"># Colors</div>
              <div><span className="text-sky-400">primary</span><span className="text-zinc-500">: </span><span className="text-emerald-400">#000000</span></div>
              <div><span className="text-sky-400">accent</span><span className="text-zinc-500">: </span><span className="text-emerald-400">#0070f3</span></div>
              <div className="text-violet-400"># Typography</div>
              <div><span className="text-sky-400">font-sans</span><span className="text-zinc-500">: </span><span className="text-emerald-400">Inter</span></div>
            </div>
          </div>
          {/* AI tool badges */}
          <div className="flex gap-2 mt-3">
            {['Claude', 'Cursor', 'Copilot'].map((t) => (
              <div key={t} className="flex-1 text-center py-1 rounded-md bg-zinc-800/60 border border-zinc-700/40 text-[10px] text-zinc-500">
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
]

const cliExample = `# Apply Vercel's design system to your project
$ npx stylekit pull vercel

> Fetching skill: vercel
> Writing DESIGN.md...
> Writing tailwind.config.js...

Done! 3 files updated.`

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-zinc-950">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 text-xs font-medium uppercase tracking-wider">
            How it works
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">
            From any website to
            <br />
            AI-ready in 3 steps
          </h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            No setup, no configuration, no API keys. Just install and start extracting.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 md:space-y-8 mb-20">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative glass-card rounded-2xl p-6 md:p-8 group hover:border-violet-500/20 transition-all duration-300"
            >
              <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
                {/* Content */}
                <div className="flex gap-5 items-start">
                  {/* Step number */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-violet-400">{step.number}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100 mb-2">{step.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-xl">{step.description}</p>
                    {step.cta && (
                      <a
                        href={step.cta.href}
                        className="inline-flex items-center gap-1.5 mt-4 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
                      >
                        {step.cta.label}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Visual */}
                <div className="md:w-64">
                  {step.visual}
                </div>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute -bottom-4 left-[2.9rem] w-px h-8 bg-gradient-to-b from-violet-500/30 to-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* CLI section */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 md:p-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="4 17 10 11 4 5"/>
                  <line x1="12" y1="19" x2="20" y2="19"/>
                </svg>
                CLI
              </div>
              <h3 className="text-2xl font-bold gradient-text mb-3">
                Use it from the command line
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                The StyleKit CLI lets you pull design skills directly into your project, generate config files, and keep your design system in sync — all from your terminal.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <a href="#" className="text-sm text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1.5 transition-colors">
                  CLI Documentation
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <CodeBlock code={cliExample} language="shell" filename="terminal" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
    </section>
  )
}
