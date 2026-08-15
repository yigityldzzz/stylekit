// Community Gallery access for the CLI — lets `stylekit gallery` pull a REAL
// extracted design system (published via the Chrome extension or the Figma
// plugin) instead of the built-in canned style presets.
//
// This is a Node-side sibling of apps/web/lib/gallery.ts and
// apps/figma-plugin/src/code.ts's shadow/color handling — same public
// Supabase project, same anon key (safe client-side, already shipped in the
// web app's own JS bundle), same buildDesignMd() output shape so a DESIGN.md
// pulled via the CLI is byte-for-byte what the website's gallery detail page
// would have generated for the same entry.

const SUPABASE_URL = 'https://evejevftdnqxbhbkjpaj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_GcT1Cx3mqdKbFbS7DwnI4A_VPSuAPZQ';

export interface ExtractedTokens {
  colors: string[];
  typography: { families: string[]; sizes: string[]; weights: string[] };
  spacing: string[];
  borderRadius: string[];
  shadows: string[];
}

export interface GalleryExtraction {
  id: string;
  author_label: string;
  title: string;
  source_host: string;
  source_url: string;
  category: string;
  tokens: ExtractedTokens;
  clone_count: number;
  view_count: number;
  created_at: string;
}

async function supabaseRest(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      ...init.headers,
    },
  });
}

/** Lists gallery entries, optionally filtered by a title/source-host search term. */
export async function listGalleryExtractions(search?: string): Promise<GalleryExtraction[]> {
  const params = new URLSearchParams({
    select: 'id,title,author_label,source_host,category,tokens,clone_count',
    order: 'clone_count.desc',
    limit: '25',
  });
  if (search && search.trim()) {
    params.set('or', `(title.ilike.%${search.trim()}%,source_host.ilike.%${search.trim()}%)`);
  }

  const res = await supabaseRest(`gallery_extractions?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Gallery request failed: HTTP ${res.status}`);
  }
  return (await res.json()) as GalleryExtraction[];
}

/** Fetches one gallery entry's full record by id. */
export async function getGalleryExtraction(id: string): Promise<GalleryExtraction> {
  const params = new URLSearchParams({ select: '*', id: `eq.${id}` });
  const res = await supabaseRest(`gallery_extractions?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Gallery request failed: HTTP ${res.status}`);
  }
  const rows = (await res.json()) as GalleryExtraction[];
  if (!rows.length) throw new Error(`Gallery entry "${id}" not found.`);
  return rows[0];
}

/** Best-effort — a failed counter bump should never break the pull itself. */
export async function incrementCloneCount(id: string): Promise<void> {
  try {
    await supabaseRest('rpc/increment_gallery_clone_count', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ row_id: id }),
    });
  } catch {
    // ignore — non-critical
  }
}

// ── DESIGN.md generation ─────────────────────────────────────────────────────
// Ported verbatim from apps/web/lib/gallery.ts (itself ported from the
// extension's content-script.js), so the same gallery entry produces the
// same DESIGN.md whether you pull it from the CLI, the website, or copy it
// out of the extension directly.

function luminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function categorizeColors(colors: string[]): { label: string; hex: string }[] {
  if (!colors.length) return [];
  const labeled = colors.map((c) => ({ hex: c, lum: luminance(c) }));
  const result: { label: string; hex: string }[] = [];
  const used = new Set<string>();

  const pick = (predicate: (c: { hex: string; lum: number }) => boolean, label: string) => {
    const found = labeled.find((c) => !used.has(c.hex) && predicate(c));
    if (found) {
      used.add(found.hex);
      result.push({ label, hex: found.hex });
    }
  };

  pick((c) => c.lum < 30, 'Background Dark');
  pick((c) => c.lum > 220, 'Background Light');
  pick((c) => c.lum < 30, 'Text Dark');
  pick((c) => c.lum > 200, 'Text Light');

  let idx = 1;
  for (const { hex } of labeled) {
    if (!used.has(hex)) {
      result.push({ label: idx === 1 ? 'Primary' : idx === 2 ? 'Secondary' : `Accent ${idx - 2}`, hex });
      used.add(hex);
      idx++;
    }
  }
  return result;
}

export function buildDesignMdFromGallery(entry: GalleryExtraction): string {
  const { colors, typography, spacing, borderRadius, shadows } = entry.tokens;
  const categorized = categorizeColors(colors);
  const colorLines = categorized.length
    ? categorized.map((c) => `- ${c.label}: \`${c.hex}\``)
    : colors.map((c) => `- \`${c}\``);
  const shadowLabels = ['sm', 'md', 'lg', 'xl', '2xl'];

  const isLocal = entry.id === 'local';
  const lines = [
    `# Design System — ${entry.title}`,
    ``,
    `> Extracted from: ${entry.source_url}`,
    isLocal
      ? `> Imported locally via \`stylekit gallery --json\` — not yet published to the Community Gallery.`
      : `> Pulled from the StyleKit Community Gallery via \`stylekit gallery\` — https://stylekit.digitaladexpert.de/gallery/${entry.id}`,
    ...(isLocal ? [] : [`> Originally published by: ${entry.author_label}`]),
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
          const labels = ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large', 'Full'];
          return `- **${labels[i] || i + 1}:** ${v}`;
        })
      : ['- None detected']),
    ``,
    `## Shadows`,
    ...(shadows.length
      ? shadows.map((v, i) => `- **${shadowLabels[i] || 'shadow-' + (i + 1)}:** \`${v}\``)
      : ['- None detected']),
    ``,
  ];

  return lines.join('\n');
}
