import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const siteUrl = 'https://stylekit.digitaladexpert.de'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'StyleKit — Extract Any Website\'s Design System in One Click',
    template: '%s — StyleKit',
  },
  description:
    'StyleKit Chrome Extension extracts colors, fonts, spacing and design tokens from any website and generates AI-ready DESIGN.md files for Claude Code, Cursor, Copilot, Windsurf and more.',
  keywords: [
    'design system extractor',
    'design tokens',
    'chrome extension',
    'AI coding tools',
    'Claude Code',
    'Cursor AI',
    'GitHub Copilot',
    'Tailwind CSS',
    'DESIGN.md',
    'CSS variables',
    'color palette extractor',
    'font extractor',
    'web design tools',
    'developer tools',
    'npx stylekit-ai',
  ],
  authors: [{ name: 'Digital Ad Expert', url: 'https://digitaladexpert.de' }],
  creator: 'Digital Ad Expert',
  publisher: 'Digital Ad Expert',
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'StyleKit — Extract Any Website\'s Design System in One Click',
    description: 'Generate AI-ready DESIGN.md files from any website. Works with Claude Code, Cursor, Copilot and more. Free Chrome Extension.',
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'StyleKit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StyleKit — Extract Any Website\'s Design System',
    description: 'Free Chrome Extension. Extract design tokens from any site → AI-ready DESIGN.md in 1 click.',
    site: '@DigitalExpertDE',
    creator: '@DigitalExpertDE',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'StyleKit',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Chrome',
              url: siteUrl,
              description: 'Extract design tokens from any website and generate AI-ready DESIGN.md files for Claude Code, Cursor, Copilot and more.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: 'Free Chrome Extension',
              },
              author: {
                '@type': 'Organization',
                name: 'Digital Ad Expert',
                url: 'https://digitaladexpert.de',
              },
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
