import { supabase } from './supabase'

export const GALLERY_CATEGORIES = [
  'SaaS / Product',
  'E-commerce',
  'Marketing / Landing',
  'Blog / Content',
  'Portfolio',
  'Dashboard / Admin',
  'Other',
] as const

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]

export interface ExtractedTokens {
  colors: string[]
  typography: { families: string[]; sizes: string[]; weights: string[] }
  spacing: string[]
  borderRadius: string[]
  shadows: string[]
}

export interface GalleryExtraction {
  id: string
  author_id: string
  author_label: string
  title: string
  source_host: string
  source_url: string
  category: GalleryCategory
  tokens: ExtractedTokens
  clone_count: number
  view_count: number
  created_at: string
}

// ─── Queries ──────────────────────────────────────────────────────────────

export async function listGalleryExtractions(opts: {
  category?: string
  search?: string
  page?: number
  pageSize?: number
} = {}) {
  const page = opts.page ?? 1
  const pageSize = opts.pageSize ?? 24
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('gallery_extractions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (opts.category) query = query.eq('category', opts.category)
  if (opts.search) query = query.or(`title.ilike.%${opts.search}%,source_host.ilike.%${opts.search}%`)

  const { data, error, count } = await query
  if (error) throw error
  return { items: (data ?? []) as GalleryExtraction[], total: count ?? 0, page, pageSize }
}

export async function getGalleryExtraction(id: string) {
  const { data, error } = await supabase
    .from('gallery_extractions')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as GalleryExtraction
}

export async function publishGalleryExtraction(input: {
  author_id: string
  author_label: string
  title: string
  source_host: string
  source_url: string
  category: string
  tokens: ExtractedTokens
}) {
  const { data, error } = await supabase
    .from('gallery_extractions')
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data as GalleryExtraction
}

export async function deleteGalleryExtraction(id: string) {
  const { error } = await supabase.from('gallery_extractions').delete().eq('id', id)
  if (error) throw error
}

export async function incrementCloneCount(id: string) {
  await supabase.rpc('increment_gallery_clone_count', { row_id: id })
}

export async function incrementViewCount(id: string) {
  await supabase.rpc('increment_gallery_view_count', { row_id: id })
}

// ─── DESIGN.md generation (ported from apps/extension/content-script.js so the
// gallery detail page can regenerate the exact same output the extension
// would have produced) ───────────────────────────────────────────────────────

function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function categorizeColors(colors: string[]): { label: string; hex: string }[] {
  if (!colors.length) return []
  const labeled = colors.map((c) => ({ hex: c, lum: luminance(c) }))
  const result: { label: string; hex: string }[] = []
  const used = new Set<string>()

  const pick = (predicate: (c: { hex: string; lum: number }) => boolean, label: string) => {
    const found = labeled.find((c) => !used.has(c.hex) && predicate(c))
    if (found) {
      used.add(found.hex)
      result.push({ label, hex: found.hex })
    }
  }

  pick((c) => c.lum < 30, 'Background Dark')
  pick((c) => c.lum > 220, 'Background Light')
  pick((c) => c.lum < 30, 'Text Dark')
  pick((c) => c.lum > 200, 'Text Light')

  let idx = 1
  for (const { hex } of labeled) {
    if (!used.has(hex)) {
      result.push({ label: idx === 1 ? 'Primary' : idx === 2 ? 'Secondary' : `Accent ${idx - 2}`, hex })
      used.add(hex)
      idx++
    }
  }
  return result
}

export function buildDesignMd(tokens: ExtractedTokens, sourceUrl: string): string {
  const { colors, typography, spacing, borderRadius, shadows } = tokens
  const categorized = categorizeColors(colors)
  const colorLines = categorized.length
    ? categorized.map((c) => `- ${c.label}: \`${c.hex}\``)
    : colors.map((c) => `- \`${c}\``)
  const shadowLabels = ['sm', 'md', 'lg', 'xl', '2xl']

  const lines = [
    `# Design System`,
    ``,
    `> Extracted from: ${sourceUrl}`,
    `> Published via StyleKit Gallery — https://stylekit.digitaladexpert.de/gallery`,
    ``,
    `## Colors`,
    ...colorLines,
    ``,
    `## Typography`,
    `- **Font Family:** ${typography.families.join(', ') || '—'}`,
    `- **Sizes:** ${typography.sizes.join(', ') || '—'}`,
    `- **Weights:** ${typography.weights.join(', ') || '—'}`,
    ``,
    `## Spacing`,
    `- **Scale:** ${spacing.join(', ') || '—'}`,
    ``,
    `## Border Radius`,
    ...(borderRadius.length
      ? borderRadius.map((v, i) => {
          const labels = ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large', 'Full']
          return `- **${labels[i] || i + 1}:** ${v}`
        })
      : ['- None detected']),
    ``,
    `## Shadows`,
    ...(shadows.length
      ? shadows.map((v, i) => `- **${shadowLabels[i] || 'shadow-' + (i + 1)}:** \`${v}\``)
      : ['- None detected']),
    ``,
  ]

  return lines.join('\n')
}
