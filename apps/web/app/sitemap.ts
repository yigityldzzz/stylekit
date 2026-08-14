import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://stylekit.digitaladexpert.de'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/gallery`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]

  // Each published extraction gets its own indexable, shareable page — this is
  // the main organic-growth lever of the gallery, so make sure search engines
  // can discover every one of them.
  let galleryRoutes: MetadataRoute.Sitemap = []
  try {
    const { data } = await supabase
      .from('gallery_extractions')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(5000)

    galleryRoutes = (data ?? []).map((row) => ({
      url: `${base}/gallery/${row.id}`,
      lastModified: new Date(row.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {
    // If Supabase is unreachable at build time, still ship the static routes.
  }

  return [...staticRoutes, ...galleryRoutes]
}
