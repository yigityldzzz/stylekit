import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'StyleKit terms of service — rules and conditions for using StyleKit Chrome Extension and CLI tool.',
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-zinc-500 text-sm mb-12">Last updated: April 2025</p>

          <div className="space-y-10">

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p className="text-zinc-400 leading-relaxed">
                By installing the StyleKit Chrome Extension, using the StyleKit CLI tool, or accessing
                stylekit.digitaladexpert.de, you agree to these Terms of Service. If you do not agree,
                please do not use StyleKit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
              <p className="text-zinc-400 leading-relaxed">
                StyleKit is a developer tool that extracts design tokens (colors, typography, spacing,
                shadows, border-radius) from websites and generates DESIGN.md files for use with AI
                coding assistants. StyleKit is provided as a free Chrome Extension and an open-source
                CLI tool.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Acceptable Use</h2>
              <p className="text-zinc-400 leading-relaxed mb-3">You agree to use StyleKit only for lawful purposes. You must not:</p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2">
                <li>Use StyleKit to scrape or copy proprietary design systems without authorization</li>
                <li>Redistribute or resell StyleKit as your own product</li>
                <li>Attempt to reverse engineer, decompile, or tamper with the extension</li>
                <li>Use StyleKit in any way that violates applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Intellectual Property</h2>
              <p className="text-zinc-400 leading-relaxed">
                StyleKit, including its code, design, and branding, is owned by Digital Ad Expert.
                The CLI tool is open-source and available under the MIT license on GitHub.
                Design tokens extracted by StyleKit from third-party websites belong to their
                respective owners.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Disclaimer of Warranties</h2>
              <p className="text-zinc-400 leading-relaxed">
                StyleKit is provided &quot;as is&quot; without warranties of any kind. We do not guarantee
                that the extension will work on every website, that extracted design tokens will be
                complete or accurate, or that the service will be uninterrupted or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
              <p className="text-zinc-400 leading-relaxed">
                To the maximum extent permitted by law, Digital Ad Expert shall not be liable for
                any indirect, incidental, special, or consequential damages arising from your use
                of StyleKit or inability to use StyleKit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Changes to Terms</h2>
              <p className="text-zinc-400 leading-relaxed">
                We may update these terms at any time. Continued use of StyleKit after changes
                are posted constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Contact</h2>
              <p className="text-zinc-400 leading-relaxed">
                Questions about these terms?{' '}
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
