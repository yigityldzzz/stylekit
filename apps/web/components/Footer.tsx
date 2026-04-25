import Link from 'next/link'

const footerLinks = {
  Product: [
    { label: 'Chrome Extension', href: 'https://chromewebstore.google.com/detail/stylekit/jbbngpjghnifmnmlfcjacooakmhhglge', external: true },
    { label: 'CLI Tool', href: '/docs#cli-reference', external: false },
    { label: 'Design Skills Library', href: '/docs#design-skills', external: false },
    { label: 'Pricing', href: '/pricing', external: false },
  ],
  Developers: [
    { label: 'CLI Docs', href: '/docs#cli-reference', external: false },
    { label: 'Documentation', href: '/docs', external: false },
    { label: 'GitHub', href: 'https://github.com/yigityldzzz/stylekit', external: true },
    { label: 'Changelog', href: 'https://github.com/yigityldzzz/stylekit/commits/main', external: true },
  ],
  Company: [
    { label: 'Built by Digital Ad Expert', href: 'https://digitaladexpert.de', external: true },
    { label: 'Twitter / X', href: 'https://x.com/DigitalExpertDE', external: true },
    { label: 'Contact', href: 'mailto:info@digitaladexpert.de', external: true },
    { label: 'Privacy Policy', href: '/privacy', external: false },
    { label: 'Terms of Service', href: '/terms', external: false },
  ],
}

export default function Footer() {
  return (
    <footer className="relative bg-zinc-950 border-t border-zinc-800/60">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 4h10M3 8h7M3 12h5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="13" cy="10" r="2.5" fill="white" opacity="0.8" />
                </svg>
              </div>
              <span className="font-semibold text-white">StyleKit</span>
            </div>

            <p className="text-sm text-zinc-500 leading-relaxed mb-5 max-w-xs">
              Extract any website&apos;s design system in one click. Generate AI-ready DESIGN.md files for your favorite coding tools.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/yigityldzzz/stylekit"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all"
                aria-label="GitHub"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://x.com/DigitalExpertDE"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all"
                aria-label="Twitter / X"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} StyleKit by{' '}
            <a href="https://digitaladexpert.de" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-400 transition-colors">
              Digital Ad Expert
            </a>
            . All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Privacy Policy
            </a>
            <span className="text-zinc-800">·</span>
            <a href="/terms" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Terms of Service
            </a>
            <span className="text-zinc-800">·</span>
            <a href="/cookies" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
