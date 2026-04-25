'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
        setLoading(false)
      }
    })
  }, [router])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800/60 bg-zinc-950/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M3 8h7M3 12h5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="13" cy="10" r="2.5" fill="white" opacity="0.8"/>
              </svg>
            </div>
            <span className="font-semibold text-white">StyleKit</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-zinc-500 text-sm">{user?.email}</p>
        </div>

        {/* Plan card */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Current Plan</p>
            <p className="text-xl font-bold text-white">Free</p>
            <p className="text-xs text-zinc-600 mt-1">25 exports / month</p>
            <Link
              href="/pricing"
              className="inline-block mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Upgrade to Pro
            </Link>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Exports Used</p>
            <p className="text-xl font-bold text-white">0</p>
            <p className="text-xs text-zinc-600 mt-1">of 25 this month</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Member Since</p>
            <p className="text-xl font-bold text-white">
              {new Date(user?.created_at ?? '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Export history placeholder */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Recent Exports</h2>
          <div className="text-center py-8">
            <p className="text-zinc-600 text-sm">No exports yet.</p>
            <p className="text-zinc-700 text-xs mt-1">Install the Chrome Extension and start extracting design systems.</p>
            <a
              href="https://chromewebstore.google.com/detail/stylekit/jbbngpjghnifmnmlfcjacooakmhhglge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 px-4 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-xs font-medium rounded-lg transition-colors"
            >
              Get Chrome Extension
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
