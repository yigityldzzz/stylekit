'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { buildDesignMd, incrementCloneCount, incrementViewCount, type GalleryExtraction } from '@/lib/gallery'

export default function GalleryDetailClient({ extraction }: { extraction: GalleryExtraction }) {
  const [copied, setCopied] = useState(false)
  const designMd = buildDesignMd(extraction.tokens, extraction.source_url)

  useEffect(() => {
    incrementViewCount(extraction.id).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraction.id])

  async function copyDesignMd() {
    try {
      await navigator.clipboard.writeText(designMd)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      incrementCloneCount(extraction.id).catch(() => {})
    } catch {
      // clipboard blocked — user can still select the text manually
    }
  }

  function shareUrl() {
    return `https://stylekit.digitaladexpert.de/gallery/${extraction.id}`
  }

  const { colors, typography, spacing, borderRadius, shadows } = extraction.tokens

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        <Link href="/gallery" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8">
          ← Back to Gallery
        </Link>

        <div className="glass-card rounded-2xl p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 font-medium">
              {extraction.category}
            </span>
            <div className="flex items-center gap-3 text-xs text-zinc-600">
              <span>{extraction.view_count} views</span>
              <span>·</span>
              <span>{extraction.clone_count} copies</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{extraction.title}</h1>
          <p className="text-zinc-500 mb-1">
            Extracted from{' '}
            <a href={extraction.source_url} target="_blank" rel="noopener noreferrer nofollow" className="text-violet-400 hover:text-violet-300 transition-colors">
              {extraction.source_host}
            </a>
          </p>
          <p className="text-sm text-zinc-600 mb-8">
            Published by {extraction.author_label} · {new Date(extraction.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={copyDesignMd}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {copied ? '✓ Copied!' : 'Copy DESIGN.md'}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${extraction.title} design system, extracted with StyleKit:`)}&url=${encodeURIComponent(shareUrl())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm rounded-xl transition-colors"
            >
              Share on X
            </a>
            <a
              href="https://chromewebstore.google.com/detail/stylekit/jbbngpjghnifmnmlfcjacooakmhhglge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm rounded-xl transition-colors"
            >
              Extract your own →
            </a>
          </div>

          {/* Colors */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-zinc-400 mb-3">Colors ({colors.length})</h2>
            <div className="flex flex-wrap gap-2">
              {colors.map((hex, i) => (
                <button
                  key={i}
                  onClick={() => navigator.clipboard.writeText(hex).catch(() => {})}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
                  title={`Copy ${hex}`}
                >
                  <span className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: hex }} />
                  <span className="text-xs text-zinc-400 font-mono">{hex}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-zinc-400 mb-3">Typography</h2>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3"><span className="text-zinc-600 w-24 flex-shrink-0">Families</span><span className="text-zinc-300">{typography.families.join(', ') || '—'}</span></div>
              <div className="flex gap-3"><span className="text-zinc-600 w-24 flex-shrink-0">Sizes</span><span className="text-zinc-300">{typography.sizes.join(', ') || '—'}</span></div>
              <div className="flex gap-3"><span className="text-zinc-600 w-24 flex-shrink-0">Weights</span><span className="text-zinc-300">{typography.weights.join(', ') || '—'}</span></div>
            </div>
          </section>

          {/* Spacing / Radius */}
          <div className="grid sm:grid-cols-2 gap-8 mb-8">
            <section>
              <h2 className="text-sm font-semibold text-zinc-400 mb-3">Spacing</h2>
              <div className="flex flex-wrap gap-1.5">
                {spacing.length ? spacing.map((v, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">{v}</span>
                )) : <span className="text-xs text-zinc-600">None detected</span>}
              </div>
            </section>
            <section>
              <h2 className="text-sm font-semibold text-zinc-400 mb-3">Border Radius</h2>
              <div className="flex flex-wrap gap-1.5">
                {borderRadius.length ? borderRadius.map((v, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">{v}</span>
                )) : <span className="text-xs text-zinc-600">None detected</span>}
              </div>
            </section>
          </div>

          {/* Shadows */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-400 mb-3">Shadows</h2>
            <div className="space-y-2">
              {shadows.length ? shadows.map((v, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div className="w-6 h-6 rounded-md bg-zinc-800 flex-shrink-0" style={{ boxShadow: v }} />
                  <span className="text-xs text-zinc-400 font-mono truncate">{v}</span>
                </div>
              )) : <span className="text-xs text-zinc-600">None detected</span>}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
