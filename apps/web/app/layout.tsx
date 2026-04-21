import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StyleKit — Extract Any Website\'s Design System in One Click',
  description:
    'StyleKit analyzes any webpage and generates AI-ready DESIGN.md files for Claude Code, Cursor, Copilot and more. Extract colors, fonts, spacing and design tokens instantly.',
  keywords: [
    'design system',
    'design tokens',
    'chrome extension',
    'AI coding',
    'Claude Code',
    'Cursor',
    'Copilot',
    'Tailwind CSS',
    'DESIGN.md',
    'CSS variables',
  ],
  authors: [{ name: 'Digital Ad Expert' }],
  openGraph: {
    title: 'StyleKit — Extract Any Website\'s Design System in One Click',
    description:
      'Generate AI-ready DESIGN.md files from any website. Works with Claude Code, Cursor, Copilot and more.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StyleKit — Extract Any Website\'s Design System',
    description: 'Generate AI-ready DESIGN.md files from any website.',
  },
  robots: {
    index: true,
    follow: true,
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
        {children}
      </body>
    </html>
  )
}
