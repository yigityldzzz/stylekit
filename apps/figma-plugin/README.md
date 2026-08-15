# StyleKit for Figma

Turns a StyleKit token set — colors, typography, shadows, spacing, radius —
into real, native Figma Paint Styles, Text Styles, Effect Styles, and
Variables. Two ways to bring tokens in:

1. **Community Gallery tab** — browses `stylekit.digitaladexpert.de/gallery`
   directly inside the plugin (read-only, public data) and imports any entry
   with one click.
2. **Paste JSON tab** — paste a token JSON copied from the extension's
   **Copy Tokens (JSON) — for Figma** button, for tokens you haven't
   published yet.

## How it's built

- `src/code.ts` — the plugin's main thread (runs in Figma's sandbox, has the
  `figma` document API, no DOM/fetch). Parses colors/shadows/lengths and
  creates the actual styles/variables.
- `src/ui.html` — the plugin UI (a regular iframe — has `fetch`/DOM, no
  `figma` API). Fetches the gallery straight from Supabase's public REST API
  using the same publishable/anon key the website itself uses, and posts the
  chosen token set to `code.ts` via `postMessage`.
- `manifest.json` — points `main` at the **compiled** `dist/code.js`, not the
  TypeScript source, so you must build before loading the plugin.

## Build

```bash
cd apps/figma-plugin
npm install
npm run build     # compiles src/code.ts -> dist/code.js
```

`npm run watch` recompiles on save while you're iterating.

## Load it locally in Figma (no review, no publishing required)

1. Open the Figma **desktop app** (local plugin import isn't available on
   figma.com in the browser).
2. Menu → **Plugins** → **Development** → **Import plugin from manifest…**
3. Select `apps/figma-plugin/manifest.json` from this repo.
4. Open any file, then Menu → Plugins → Development → **StyleKit** to run it.
5. Every edit to `src/code.ts` needs `npm run build` (or `npm run watch`)
   before Figma picks it up — for `src/ui.html` changes, just re-run the
   plugin.

## What it creates

| Token | Figma object |
|---|---|
| `colors[]` | Paint Styles, named `StyleKit/<source>/Colors/<hex>` |
| `typography.sizes[]` | Text Styles, one per size, using the first detected font family (falls back to Inter if that font isn't installed/available) |
| `shadows[]` | Effect Styles (drop shadow), parsed from the `box-shadow` computed-style string |
| `spacing[]`, `borderRadius[]` | Number Variables in a new `StyleKit/<source>/Tokens` collection |

Colors/shadows accept hex (`#rgb`, `#rrggbb`, `#rrggbbaa`) and `rgb()`/`rgba()` —
these are the only formats `getComputedStyle()` in the browser extension
actually produces, so that's what the parser targets. Anything it can't parse
is silently skipped and counted in an "skipped" tally shown after import.

## Testing notes

Figma itself can't run inside this sandbox, so this was verified as far as
possible without a live Figma session:

- `src/code.ts` compiles with **zero errors** against the official
  `@figma/plugin-typings`, so every `figma.*` call used here matches the real
  API shape.
- The color/shadow/length parsing logic (the only part with real branching
  logic) is covered by `test_parsing.js` — 21 cases, including the exact
  `rgba(...) Npx Npx Npx Npx` shape Chrome's `getComputedStyle()` actually
  emits for box-shadow, inset shadows, alpha-channel hex, and malformed
  input. Run with `node test_parsing.js`.
- The gallery REST query used in `ui.html` was hand-tested against the real
  production Supabase project with the real anon key and returns correctly
  (empty array right now since the Gallery has no published entries yet).

What's **not** verified end-to-end: actually creating styles inside a real
Figma document, font-loading fallback behavior for fonts not installed
locally, and the `postMessage` round-trip inside the actual Figma iframe
sandbox. Please test a real import once you load it locally (see above) —
if a font/color/shadow doesn't come through the way you expect, that's the
first place to look.

## Eventually publishing to the Figma Community

Publishing (so it's installable by anyone, not just loaded locally) needs a
Figma account holding the plugin, plus going through Figma's own review —
that's a manual step only you can do from the desktop app once you're happy
with local testing (Menu → Plugins → Development → StyleKit → right-click →
Publish).
