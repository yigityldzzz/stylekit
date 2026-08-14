'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { GALLERY_CATEGORIES, publishGalleryExtraction, type ExtractedTokens, type GalleryCategory } from '@/lib/gallery'
import type { User } from '@supabase/supabase-js'

interface IncomingPayload {
  tokens: ExtractedTokens
  sourceUrl: string
  sourceHost: string
}

function PublishForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [payload, setPayload] = useState<IncomingPayload | null>(null)
  const [parseError, setParseError] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<GalleryCategory>('SaaS / Product')
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState('')
  const [publishedId, setPublishedId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setCheckingAuth(false)
    })
  }, [])

  useEffect(() => {
    const raw = searchParams.get('data')
    if (!raw) {
      setParseError('No extraction data found. Publish directly from the StyleKit extension popup.')
      return
    }
    try {
      const parsed = JSON.parse(decodeURIComponent(raw)) as IncomingPayload
      if (!parsed?.tokens?.colors) throw new Error('malformed')
      setPayload(parsed)
      setTitle(parsed.sourceHost.replace(/^www\./, ''))
    } catch {
      setParseError('Could not read the extraction data. Please try publishing again from the extension.')
    }
  }, [searchParams])

  async function handlePublish() {
    if (!payload || !user) return
    setPublishing(true)
    setPublishError('')
    try {
      const authorLabel = (user.user_metadata?.full_name as string) || user.email?.split('@')[0] || 'a StyleKit user'
      const result = await publishGalleryExtraction({
        author_id: user.id,
        author_label: authorLabel,
        title: title.trim().slice(0, 100) || payload.sourceHost,
        source_host: payload.sourceHost,
        source_url: payload.sourceUrl,
        category,
        tokens: payload.tokens,
      })
      setPublishedId(result.id)
    } catch (err: unknown) {
      setPublishError(err instanceof Error ? err.message : 'Failed to publish. Please try again.')
    } finally {
      setPublishing(false)
    }
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/gallery/publish'

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        <h1 className="text-3xl font-bold text-white mb-2">Publish to Gallery</h1>
        <p className="text-zinc-500 mb-8">
          Share this extraction publicly so others can discover and reuse it.
        </p>

        {parseError && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-zinc-400 mb-4">{parseError}</p>
            <a
              href="https://chromewebstore.google.com/detail/stylekit/jbbngpjghnifmnmlfcjacooakmhhglge"
              className="text-violet-400 hover:text-violet-300 text-sm"
            >
              Get the StyleKit extension →
            </a>
          </div>
        )}

        {!parseError && checkingAuth && (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!parseError && !checkingAuth && !user && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-zinc-300 mb-5">Sign in to publish this extraction to the public gallery.</p>
            <div className="flex gap-3 justify-center">
              <Link
                href={`/auth/login?redirect=${encodeURIComponent(currentUrl)}`}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Sign in
              </Link>
              <Link
                href={`/auth/register?redirect=${encodeURIComponent(currentUrl)}`}
                className="px-5 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm rounded-xl transition-colors"
              >
                Sign up free
              </Link>
            </div>
          </div>
        )}

        {!parseError && !checkingAuth && user && payload && !publishedId && (
          <div className="glass-card rounded-2xl p-8">
            {/* Preview */}
            <div className="flex gap-1.5 mb-6">
              {payload.tokens.colors.slice(0, 10).map((hex, i) => (
                <div key={i} className="w-8 h-8 rounded-lg border border-white/10" style={{ backgroundColor: hex }} title={hex} />
              ))}
            </div>
            <p className="text-xs text-zinc-600 mb-6">
              {payload.tokens.colors.length} colors · {payload.tokens.spacing.length} spacing values · {payload.tokens.shadows.length} shadows — extracted from{' '}
              <span className="text-zinc-400">{payload.sourceHost}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 focus:border-violet-500 rounded-xl text-sm text-white outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                  className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 focus:border-violet-500 rounded-xl text-sm text-white outline-none transition-colors"
                >
                  {GALLERY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {publishError && <p className="text-red-400 text-xs mt-4">{publishError}</p>}

            <button
              onClick={handlePublish}
              disabled={publishing || !title.trim()}
              className="w-full mt-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all"
            >
              {publishing ? 'Publishing...' : 'Publish to Gallery'}
            </button>
          </div>
        )}

        {publishedId && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Published!</h2>
            <p className="text-sm text-zinc-500 mb-6">Your extraction is now live in the public gallery.</p>
            <div className="flex gap-3 justify-center">
              <Link
                href={`/gallery/${publishedId}`}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                View in Gallery
              </Link>
              <button
                onClick={() => router.push('/gallery')}
                className="px-5 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm rounded-xl transition-colors"
              >
                Browse Gallery
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function PublishPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PublishForm />
    </Suspense>
  )
}
