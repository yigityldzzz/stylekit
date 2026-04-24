import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Pricing — StyleKit',
  description:
    'Simple, transparent pricing for StyleKit. Start free with the Chrome Extension, upgrade to Pro for unlimited skills and CLI access, or get Team for your whole organization.',
}

const faqs = [
  {
    q: 'Is the Chrome Extension really free forever?',
    a: 'Yes. The Chrome Extension and 5 design skills are free forever, no credit card required. We believe great tooling should be accessible to everyone.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, American Express) via Stripe. Annual plans offer a ~20% discount over monthly billing.',
  },
  {
    q: 'Can I cancel at any time?',
    a: 'Absolutely. You can cancel your subscription at any time from your account settings. You\'ll keep access until the end of your billing period.',
  },
  {
    q: 'What is a "Design Skill"?',
    a: 'A Design Skill is a curated DESIGN.md file for a specific brand or product — Vercel, Linear, Stripe, etc. Free users get 5 skills; Pro users get unlimited access plus the ability to extract and save their own.',
  },
  {
    q: 'What does "Team Registry" mean?',
    a: 'Team Registry lets your team publish and share custom design systems privately. One team member extracts or creates a skill, and the entire team can pull it via the CLI or extension.',
  },
  {
    q: 'Do you offer student or open-source discounts?',
    a: 'Yes! Reach out to us at hello@stylekit.dev with proof of your student email or open-source project, and we\'ll set you up with a discount.',
  },
]

export default function PricingPage() {
  return (
    <main className="relative bg-zinc-950 min-h-screen">
      <Navbar />

      {/* Page hero */}
      <div className="relative pt-28 pb-4 text-center px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-violet-600/8 blur-[80px]" />
        </div>
        <div className="relative inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 text-xs font-medium uppercase tracking-wider">
          Pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-3">
          Start free, scale as you grow
        </h1>
        <p className="text-zinc-500 text-lg max-w-lg mx-auto">
          No credit card required. Upgrade anytime.
        </p>
      </div>

      <Pricing standalone />

      {/* FAQ section */}
      <section className="relative py-20 bg-zinc-950">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
              Frequently asked questions
            </h2>
            <p className="text-zinc-500 text-sm">
              Can&apos;t find the answer?{' '}
              <a href="mailto:info@digitaladexpert.de" className="text-violet-400 hover:text-violet-300 transition-colors">
                Contact us
              </a>
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group glass-card rounded-xl px-5 py-4 cursor-pointer open:border-zinc-700"
              >
                <summary className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-200 list-none select-none">
                  {faq.q}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="flex-shrink-0 text-zinc-500 group-open:rotate-180 transition-transform duration-200"
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600/20 via-zinc-900 to-zinc-900 border border-violet-500/20 p-8 md:p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent pointer-events-none" />
            <h2 className="relative text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to ship faster?
            </h2>
            <p className="relative text-zinc-400 mb-7 max-w-md mx-auto">
              Join thousands of developers extracting design systems with StyleKit. Start free in seconds.
            </p>
            <div className="relative flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://chromewebstore.google.com/detail/stylekit/jbbngpjghnifmnmlfcjacooakmhhglge"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-violet-900/40"
              >
                Add to Chrome — Free
              </a>
              <a
                href="/docs"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium rounded-xl transition-all duration-200 hover:bg-white/5"
              >
                View Docs
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
