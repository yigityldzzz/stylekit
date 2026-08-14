'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { listGalleryExtractions, GALLERY_CATEGORIES, type GalleryExtraction } from '@/lib/gallery'

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryExtraction[]>([])
  const [category, setCategory] = useState<string>('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const pageSize = 24

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listGalleryExtractions({
        category: category || undefined,
        search: search || undefined,
        page,
        pageSize,
      })
      setItems(res.items)
      setTotal(res.total)
    } catch {
      setItems([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [category, search, page])

  useEffect(() => {
    load()
  }, [load])

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput)
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-400 text-xs font-medium">
            Community Gallery
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">
            Real design systems, extracted by real users
          </h1>
          <p className="text-lg text-zinc-500 max-w-xl mx-auto">
            Browse design tokens the StyleKit community has extracted from live websites. Copy any DESIGN.md instantly — no extraction needed.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={submitSearch} className="max-w-lg mx-auto mb-6">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by site or title..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </form>

        {/* Category filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => { setCategory(''); setPage(1) }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              category === '' ? 'bg-violet-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            All
          </button>
          {GALLERY_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1) }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                category === c ? 'bg-violet-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center max-w-lg mx-auto">
            <h3 className="font-semibold text-zinc-200 mb-2">No extractions found</h3>
            <p className="text-sm text-zinc-500">
              {search || category
                ? 'Try a different search or category.'
                : 'Be the first — install the extension, extract a site, and hit "Publish to Gallery".'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-zinc-600 mb-4">{total} design system{total !== 1 ? 's' : ''}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/gallery/${item.id}`}
                  className="glass-card rounded-2xl p-5 hover:border-violet-500/30 transition-colors group flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-violet-500/10 text-violet-400 font-medium">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-zinc-600">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      {item.clone_count}
                    </span>
                  </div>

                  {/* Color swatch preview */}
                  <div className="flex gap-1 mb-3">
                    {item.tokens.colors.slice(0, 6).map((hex, i) => (
                      <div key={i} className="w-6 h-6 rounded-md border border-white/10" style={{ backgroundColor: hex }} title={hex} />
                    ))}
                  </div>

                  <h3 className="font-semibold text-white mb-1 group-hover:text-violet-400 transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500 truncate flex-1">{item.source_host}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 text-xs text-zinc-600">
                    <span>{item.tokens.colors.length} colors</span>
                    <span>by {item.author_label}</span>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-2 rounded-lg border border-zinc-800 text-zinc-400 disabled:opacity-30 hover:text-white transition-colors text-sm"
                >
                  ← Prev
                </button>
                <span className="text-sm text-zinc-500">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-2 rounded-lg border border-zinc-800 text-zinc-400 disabled:opacity-30 hover:text-white transition-colors text-sm"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
