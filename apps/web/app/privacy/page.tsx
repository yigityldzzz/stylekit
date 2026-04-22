import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'StyleKit privacy policy — we do not collect, store, or share any user data.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-zinc-500 text-sm mb-12">Last updated: April 2025</p>

          <div className="prose prose-invert prose-zinc max-w-none space-y-10">

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Overview</h2>
              <p className="text-zinc-400 leading-relaxed">
                StyleKit is a Chrome Extension and CLI tool that extracts design tokens from websites.
                We are committed to protecting your privacy. This policy explains what data we access,
                what we do with it, and what we do not do.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data We Do Not Collect</h2>
              <p className="text-zinc-400 leading-relaxed mb-3">
                StyleKit does <strong className="text-white">not</strong> collect, store, transmit, or share:
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2">
                <li>Personal information (name, email, IP address)</li>
                <li>Browsing history or visited URLs</li>
                <li>The content of web pages you visit</li>
                <li>Any extracted design tokens or DESIGN.md files</li>
                <li>Analytics or usage telemetry</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">How the Extension Works</h2>
              <p className="text-zinc-400 leading-relaxed">
                When you click the StyleKit icon, the extension injects a script into the current tab
                to read computed CSS styles from DOM elements. This process happens entirely within
                your browser. No data leaves your device. The extracted tokens are displayed in the
                extension popup and can optionally be exported as a local file — all locally.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Permissions Explained</h2>
              <div className="space-y-4">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <p className="text-white font-medium text-sm mb-1">activeTab</p>
                  <p className="text-zinc-400 text-sm">Allows the extension to access the current tab only when you click the icon. Not active in the background.</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <p className="text-white font-medium text-sm mb-1">scripting</p>
                  <p className="text-zinc-400 text-sm">Used to inject the style extraction script into the active tab. Required to read CSS computed values.</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                  <p className="text-white font-medium text-sm mb-1">tabs</p>
                  <p className="text-zinc-400 text-sm">Used only to retrieve the current tab&apos;s URL for naming the exported DESIGN.md file.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Third-Party Services</h2>
              <p className="text-zinc-400 leading-relaxed">
                The StyleKit website (stylekit.digitaladexpert.de) is hosted on Vercel. Vercel may
                collect standard server logs (IP address, request timestamps) as part of their
                infrastructure. Please refer to{' '}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300">
                  Vercel&apos;s Privacy Policy
                </a>{' '}
                for details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Changes to This Policy</h2>
              <p className="text-zinc-400 leading-relaxed">
                We may update this policy as the product evolves. Changes will be reflected on this page
                with an updated date. We will never introduce data collection without updating this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
              <p className="text-zinc-400 leading-relaxed">
                Questions about this policy?{' '}
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
