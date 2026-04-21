import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'

const stats = [
  { value: '10+', label: 'AI tools supported' },
  { value: '50+', label: 'Design skills' },
  { value: '1-click', label: 'Extraction' },
  { value: 'Free', label: 'To get started' },
]

export default function Home() {
  return (
    <main className="relative bg-zinc-950">
      <Navbar />
      <Hero />

      {/* Stats bar */}
      <div className="relative border-y border-zinc-800/60 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/3 via-transparent to-violet-600/3 pointer-events-none" />
      </div>

      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
    </main>
  )
}
