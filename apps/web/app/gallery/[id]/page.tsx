import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGalleryExtraction } from '@/lib/gallery'
import GalleryDetailClient from './GalleryDetailClient'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const extraction = await getGalleryExtraction(params.id)
    const title = `${extraction.title} — Design System | StyleKit Gallery`
    const description = `Design tokens extracted from ${extraction.source_host}: ${extraction.tokens.colors.length} colors, typography, spacing, and shadows. Copy the DESIGN.md instantly.`
    return {
      title,
      description,
      openGraph: { title, description, type: 'article' },
      twitter: { card: 'summary', title, description },
    }
  } catch {
    return { title: 'Design System — StyleKit Gallery' }
  }
}

export default async function GalleryDetailPage({ params }: { params: { id: string } }) {
  let extraction
  try {
    extraction = await getGalleryExtraction(params.id)
  } catch {
    notFound()
  }

  return <GalleryDetailClient extraction={extraction!} />
}
