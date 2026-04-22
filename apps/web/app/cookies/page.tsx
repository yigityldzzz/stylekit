import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'StyleKit cookie policy — we do not use tracking cookies.',
}

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Cookie Policy</h1>
          <p className="text-zinc-500 text-sm mb-12">Last updated: April 2025</p>

          <div className="space-y-10">

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Our Cookie Usage</h2>
              <p className="text-zinc-400 leading-relaxed">
                StyleKit does <strong className="text-white">not</strong> use tracking cookies,
                advertising cookies, or third-party analytics cookies. We do not build user profiles
                or share any data with advertisers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Vercel Analytics</h2>
              <p className="text-zinc-400 leading-relaxed">
                This website uses Vercel Web Analytics to measure aggregate page views and visitor
                counts. Vercel Analytics is privacy-friendly — it does not use cookies and does not
                collect personally identifiable information. Data is aggregated and anonymous.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Chrome Extension</h2>
              <p className="text-zinc-400 leading-relaxed">
                The StyleKit Chrome Extension does not set or read any cookies. It only reads
                computed CSS styles from the active tab when explicitly triggered by the user.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
              <p className="text-zinc-400 leading-relaxed">
                Questions?{' '}
                <a href="mailto:info@digitaladexpert.de" className="text-violet-400 hover:text-violet-300">
                  info@digitaladexpert.de
                </a>
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
