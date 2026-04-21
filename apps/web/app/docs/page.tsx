import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Docs — StyleKit',
  description: 'StyleKit documentation. Learn how to extract design tokens with the Chrome extension and use the CLI tool.',
}

const sections = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'chrome-extension', label: 'Chrome Extension' },
  { id: 'cli-reference', label: 'CLI Reference' },
  { id: 'design-md-format', label: 'DESIGN.md Format' },
  { id: 'design-skills', label: 'Design Skills' },
  { id: 'ai-integration', label: 'AI Integration' },
]

const skills = [
  { name: 'minimal', desc: 'Clean, whitespace-heavy design with subtle borders' },
  { name: 'corporate', desc: 'Professional enterprise look with structured layouts' },
  { name: 'startup', desc: 'Vibrant, modern SaaS aesthetic with bold CTAs' },
  { name: 'dark-mode', desc: 'Dark-first design system with high contrast' },
  { name: 'glassmorphism', desc: 'Frosted glass panels with blurred translucent surfaces' },
  { name: 'retro', desc: 'Nostalgic 80s/90s terminal and pixel aesthetic' },
  { name: 'brutalist', desc: 'Raw, stark design with thick borders and stark contrast' },
  { name: 'soft-ui', desc: 'Neumorphic design with soft shadows and gentle gradients' },
  { name: 'neon', desc: 'Electric neon colors on dark backgrounds' },
  { name: 'ocean', desc: 'Calming ocean-inspired blues and teals' },
]

function CodeSnippet({ code, lang = 'bash' }: { code: string; lang?: string }) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-zinc-800 my-4">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
          <div className="w-3 h-3 rounded-full bg-zinc-700" />
        </div>
        <span className="text-xs text-zinc-500 ml-2">{lang}</span>
      </div>
      <pre className="p-4 overflow-x-auto bg-zinc-950 text-sm">
        <code className="text-zinc-300 font-mono leading-relaxed">{code}</code>
      </pre>
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono">
      {children}
    </span>
  )
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="flex gap-12">

          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Documentation</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
              <div className="mt-8 p-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
                <p className="text-xs text-zinc-400 mb-2">Need help?</p>
                <a href="mailto:info@digitaladexpert.de" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  info@digitaladexpert.de →
                </a>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 max-w-3xl">

            {/* Header */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                Documentation
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">StyleKit Docs</h1>
              <p className="text-lg text-zinc-400">
                Everything you need to extract design systems and apply them to your AI-generated code.
              </p>
            </div>

            {/* Getting Started */}
            <section id="getting-started" className="mb-14 scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-3">Getting Started</h2>
              <div className="h-px bg-zinc-800 mb-6" />
              <p className="text-zinc-400 leading-relaxed mb-4">
                StyleKit has two components that work together: a <strong className="text-zinc-200">Chrome Extension</strong> that extracts design tokens from any website, and a <strong className="text-zinc-200">CLI tool</strong> that applies pre-built design systems to your projects.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center mb-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2z"/>
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">Chrome Extension</h3>
                  <p className="text-xs text-zinc-500">Visit any site, click Extract, get your DESIGN.md instantly.</p>
                </div>
                <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                      <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">CLI Tool</h3>
                  <p className="text-xs text-zinc-500">Pull any design skill directly into your project from the terminal.</p>
                </div>
              </div>
            </section>

            {/* Chrome Extension */}
            <section id="chrome-extension" className="mb-14 scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-3">Chrome Extension</h2>
              <div className="h-px bg-zinc-800 mb-6" />

              <h3 className="text-base font-semibold text-zinc-200 mb-2">Installation</h3>
              <ol className="space-y-2 text-zinc-400 text-sm mb-6">
                <li className="flex gap-3"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center font-bold">1</span>Add StyleKit from the Chrome Web Store (free)</li>
                <li className="flex gap-3"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center font-bold">2</span>Pin the extension to your toolbar for quick access</li>
                <li className="flex gap-3"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center font-bold">3</span>Visit any website and click the StyleKit icon</li>
                <li className="flex gap-3"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center font-bold">4</span>Click <strong className="text-zinc-200">"Extract Styles"</strong> — results appear instantly</li>
              </ol>

              <h3 className="text-base font-semibold text-zinc-200 mb-2">What it extracts</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {['Colors (12 max)', 'Font families', 'Font sizes', 'Font weights', 'Spacing scale', 'Border radius', 'Box shadows', 'Spacing gaps'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-zinc-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </div>
                ))}
              </div>

              <h3 className="text-base font-semibold text-zinc-200 mb-2">Export options</h3>
              <p className="text-sm text-zinc-400">After extraction, you can:</p>
              <ul className="mt-2 space-y-1 text-sm text-zinc-400">
                <li className="flex items-center gap-2"><Badge>Copy</Badge> Copy DESIGN.md to clipboard and paste into your AI tool</li>
                <li className="flex items-center gap-2 mt-1"><Badge>Download</Badge> Save as <code className="text-zinc-300">DESIGN.md</code> file to your project</li>
              </ul>
            </section>

            {/* CLI Reference */}
            <section id="cli-reference" className="mb-14 scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-3">CLI Reference</h2>
              <div className="h-px bg-zinc-800 mb-6" />

              <p className="text-zinc-400 text-sm mb-4">Install via npx — no global install required:</p>
              <CodeSnippet code="npx stylekit-ai [command]" />

              <div className="space-y-6 mt-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge>npx stylekit-ai list</Badge>
                    <span className="text-xs text-zinc-500">List all available design skills</span>
                  </div>
                  <CodeSnippet code={`npx stylekit-ai list

┌──────────────────┬──────────────────────────────────┬──────────┐
│ Name             │ Description                      │ Tags     │
├──────────────────┼──────────────────────────────────┼──────────┤
│ minimal          │ Clean, whitespace-heavy design   │ tailwind │
│ startup          │ Vibrant modern SaaS aesthetic    │ tailwind │
│ dark-mode        │ Dark-first with high contrast    │ tailwind │
│ ...              │ ...                              │ ...      │
└──────────────────┴──────────────────────────────────┴──────────┘`} />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge>npx stylekit-ai pull {'<skill>'}</Badge>
                    <span className="text-xs text-zinc-500">Pull a skill into your project</span>
                  </div>
                  <CodeSnippet code={`npx stylekit-ai pull minimal

✔ Fetching skill: minimal
✔ Writing .stylekit/minimal.json
✔ Tailwind config snippet ready

# Add to your tailwind.config.js:
extend: {
  colors: { primary: '#18181b', accent: '#6366f1' },
  fontFamily: { sans: ['Inter', 'system-ui'] }
}`} />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge>npx stylekit-ai init</Badge>
                    <span className="text-xs text-zinc-500">Create a DESIGN.md interactively</span>
                  </div>
                  <CodeSnippet code={`npx stylekit-ai init

? What is your primary brand color? #7c3aed
? Which font would you like to use? Inter
? Choose a design style: Minimal
? What's the corner radius style? Rounded

✔ DESIGN.md created successfully!`} />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge>npx stylekit-ai generate</Badge>
                    <span className="text-xs text-zinc-500">Generate AI prompt from your DESIGN.md</span>
                  </div>
                  <CodeSnippet code={`npx stylekit-ai generate

╭─────────────────────────────────────────╮
│  Copy this prompt to your AI tool:      │
│                                         │
│  Use the following design system for    │
│  all UI components you generate...      │
╰─────────────────────────────────────────╯`} />
                </div>
              </div>
            </section>

            {/* DESIGN.md Format */}
            <section id="design-md-format" className="mb-14 scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-3">DESIGN.md Format</h2>
              <div className="h-px bg-zinc-800 mb-6" />
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                DESIGN.md is a plain Markdown file that describes your design system in a format optimized for AI coding assistants. Paste it into Claude Code, Cursor, or Copilot and your AI will follow your exact design language.
              </p>
              <CodeSnippet lang="markdown" code={`# Design System

> Extracted from: vercel.com
> Generated by StyleKit on 2026-04-21

## Colors
- Primary: \`#000000\`
- Background: \`#ffffff\`
- Accent: \`#0070f3\`
- Text Muted: \`#888888\`
- Border: \`#eaeaea\`

## Typography
- **Font Family:** Inter, system-ui, sans-serif
- **Sizes:** 12px, 14px, 16px, 20px, 24px, 32px, 48px
- **Weights:** 400, 500, 600, 700

## Spacing
- **Scale:** 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

## Border Radius
- **Small:** 4px
- **Medium:** 8px
- **Large:** 12px
- **Full:** 9999px

## Shadows
- **sm:** 0 1px 2px rgba(0,0,0,0.05)
- **md:** 0 4px 6px rgba(0,0,0,0.07)
- **lg:** 0 10px 15px rgba(0,0,0,0.1)`} />
            </section>

            {/* Design Skills */}
            <section id="design-skills" className="mb-14 scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-3">Design Skills</h2>
              <div className="h-px bg-zinc-800 mb-6" />
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                StyleKit comes with 10 pre-built design skills. Pull any of them into your project with <Badge>npx stylekit-ai pull {'<name>'}</Badge>
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div key={skill.name} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <code className="text-xs text-violet-400 bg-violet-500/10 px-2 py-1 rounded-md font-mono flex-shrink-0 mt-0.5">{skill.name}</code>
                    <p className="text-xs text-zinc-400 leading-relaxed">{skill.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Integration */}
            <section id="ai-integration" className="mb-14 scroll-mt-24">
              <h2 className="text-2xl font-bold text-white mb-3">AI Integration</h2>
              <div className="h-px bg-zinc-800 mb-6" />
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                StyleKit works with all major AI coding tools. Here's how to use your DESIGN.md with each one:
              </p>
              <div className="space-y-4">
                {[
                  { name: 'Claude Code', color: 'text-orange-400', steps: 'Add your DESIGN.md to the project root. Claude Code automatically reads it as context. Or paste contents directly in your prompt.' },
                  { name: 'Cursor', color: 'text-blue-400', steps: 'Add DESIGN.md to your project. Reference it with @DESIGN.md in Cursor chat, or add it to .cursorrules for automatic context.' },
                  { name: 'GitHub Copilot', color: 'text-zinc-300', steps: 'Paste the DESIGN.md content at the start of your prompt. Copilot will follow the design constraints for all generated components.' },
                  { name: 'Windsurf', color: 'text-cyan-400', steps: 'Place DESIGN.md in your project root. Windsurf\'s Cascade agent will automatically detect and use it as design context.' },
                ].map((tool) => (
                  <div key={tool.name} className="p-5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <h3 className={`text-sm font-semibold mb-2 ${tool.color}`}>{tool.name}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{tool.steps}</p>
                  </div>
                ))}
              </div>
            </section>

          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
