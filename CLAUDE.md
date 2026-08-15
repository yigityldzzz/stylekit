# StyleKit — CLAUDE.md

Extracts a live website's design tokens (colors, typography, spacing,
border-radius, shadows) into an AI-ready `DESIGN.md`. Part of the Digital Ad
Expert product portfolio (sibling products: FlowKit, AdFlow).

## Layout (npm workspaces monorepo)

- `apps/extension` — the Chrome extension that does the actual extraction.
  Plain JS, no bundler. `content-script.js` extracts tokens from the live
  page + builds the DESIGN.md via `buildDesignMd()`; `popup.js` drives the
  UI (Copy / Download / **Publish to Gallery** / **Copy Tokens (JSON) — for
  Figma**). Publishing hands off to the website via
  `?data=<url-encoded-json>` in a new tab — the extension itself never talks
  to Supabase directly.
- `apps/web` — Next.js App Router site (`stylekit.digitaladexpert.de`).
  `lib/gallery.ts` has the Supabase queries + a TS port of the extension's
  `buildDesignMd()`. `lib/supabase.ts` reads `NEXT_PUBLIC_SUPABASE_URL` /
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — the anon/publishable key is safe
  client-side by design (it's literally embedded in the shipped JS bundle).
- `apps/figma-plugin` — imports Gallery entries (or pasted JSON) as native
  Figma Paint/Text/Effect Styles + Variables. `src/code.ts` runs in Figma's
  sandbox (no DOM/fetch); `src/ui.html` is the iframe UI (has fetch, no
  Figma API). Must `npm run build` before Figma will load it — see its own
  README for local-load testing steps. **Not yet published to Figma
  Community** — only loadable locally as of this writing.
- `apps/cli` — separate CLI tool, less actively developed than the above.

## Backend: Supabase project `evejevftdnqxbhbkjpaj` (eu-west-1)

- Auth (email/password + Google OAuth) and the `gallery_extractions` table
  (public SELECT, owner-only INSERT/DELETE via RLS,
  `increment_gallery_clone_count`/`increment_gallery_view_count` as
  SECURITY DEFINER functions so anon users can bump counters without a
  general UPDATE policy).
- Two distinct API keys, do not confuse them:
  - **anon/publishable** (`sb_publishable_...`) — safe in client-side code,
    already embedded in the deployed web bundle.
  - **service_role** (`sb_secret_...`) — full admin access, server-side
    only. Currently used by the CRM admin panel's `/api/stylekit-users`
    route (see the CRM's own CLAUDE.md) to list registered users. Never put
    this in anything that ships to a browser.
- DB access from a normal client needs the **Session Pooler** connection
  string (IPv4) — the direct connection is IPv6-only and won't resolve from
  most sandboxed/CI environments.

## Deploy

- `apps/web` auto-deploys via Vercel on push to `main` — no manual step.
- `apps/extension` does **not** auto-deploy. After a change, bump
  `manifest.json` version and upload a fresh zip via the Chrome Web Store
  Developer Dashboard, same as FlowKit.
- `apps/figma-plugin` isn't deployed anywhere yet — it's loaded locally in
  Figma for now (Menu → Plugins → Development → Import from manifest).

## Growth context

Built to compete for installs against similar "design token extractor"
extensions. Roadmap (in priority order, from an earlier planning session):
1. ✅ Community Gallery (browse/publish extracted design systems) — shipped.
2. ✅ Figma plugin (import Gallery entries as native styles) — shipped,
   pending local testing + eventual Figma Community publish.
3. CLI ↔ extension bridge — not started.

Target was 150+ weekly active users within 2 weeks of the Gallery shipping;
check the extension's Chrome Web Store analytics panel for current numbers
before planning further growth work.
