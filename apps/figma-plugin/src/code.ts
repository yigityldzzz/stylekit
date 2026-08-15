// StyleKit for Figma — main plugin thread (runs in Figma's sandbox).
// Receives a StyleKit token set from the UI (either pasted by the user, or
// picked from the Community Gallery browser) and turns it into real, native
// Figma Paint Styles, Text Styles, Effect Styles, and Variables.

interface ExtractedTokens {
  colors: string[];
  typography: { families: string[]; sizes: string[]; weights: string[] };
  spacing: string[];
  borderRadius: string[];
  shadows: string[];
}

interface ImportMessage {
  type: 'import-tokens';
  tokens: ExtractedTokens;
  sourceLabel: string;
}

type UIMessage = ImportMessage | { type: 'cancel' };

figma.showUI(__html__, { width: 380, height: 560, themeColors: true });

// ── Color parsing ────────────────────────────────────────────────────────────

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/** Parses hex (#rgb, #rrggbb, #rrggbbaa) or rgb()/rgba() into Figma's 0–1 RGBA. */
function parseColor(input: string): { r: number; g: number; b: number; a: number } | null {
  const s = input.trim();

  const hexMatch = s.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3 || hex.length === 4) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return { r: clamp01(r), g: clamp01(g), b: clamp01(b), a: clamp01(a) };
  }

  const rgbMatch = s.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i);
  if (rgbMatch) {
    const r = parseFloat(rgbMatch[1]) / 255;
    const g = parseFloat(rgbMatch[2]) / 255;
    const b = parseFloat(rgbMatch[3]) / 255;
    const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    return { r: clamp01(r), g: clamp01(g), b: clamp01(b), a: clamp01(a) };
  }

  return null;
}

// ── box-shadow parsing ────────────────────────────────────────────────────────
// Handles the format browsers' getComputedStyle() actually emits, e.g.
// "rgba(0, 0, 0, 0.1) 0px 1px 2px 0px" or "0px 4px 8px rgba(0,0,0,.15)",
// with or without an explicit spread radius.

interface ParsedShadow {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: { r: number; g: number; b: number; a: number };
}

function parseBoxShadow(input: string): ParsedShadow | null {
  let s = input.trim();
  if (!s || /^none$/i.test(s)) return null;
  s = s.replace(/^inset\s+/i, '').replace(/\s+inset$/i, '');

  // Pull the color out first (it can be at the start or the end) so the
  // remaining string is just space-separated lengths.
  const colorMatch = s.match(/(#[0-9a-f]{3,8}\b|rgba?\([^)]+\))/i);
  const color = colorMatch ? parseColor(colorMatch[0]) : null;
  const withoutColor = colorMatch ? s.replace(colorMatch[0], ' ') : s;

  const numbers = withoutColor
    .split(/\s+/)
    .filter(Boolean)
    .map((tok) => parseFloat(tok))
    .filter((n) => !Number.isNaN(n));

  if (numbers.length < 2) return null;

  return {
    offsetX: numbers[0] ?? 0,
    offsetY: numbers[1] ?? 0,
    blur: numbers[2] ?? 0,
    spread: numbers[3] ?? 0,
    color: color ?? { r: 0, g: 0, b: 0, a: 0.25 },
  };
}

/** Extracts the first numeric length from a CSS value like "16px", "1.5rem", "8" — assumes px. */
function parseLength(input: string): number | null {
  const m = input.trim().match(/-?[\d.]+/);
  if (!m) return null;
  const n = parseFloat(m[0]);
  return Number.isNaN(n) ? null : n;
}

// ── Import ────────────────────────────────────────────────────────────────────

async function pickFont(preferredFamily: string): Promise<FontName> {
  const fallback: FontName = { family: 'Inter', style: 'Regular' };
  try {
    // Does the requested family exist on this machine/Figma account at all?
    const available = await figma.listAvailableFontsAsync();
    const match = available.find((f) => f.fontName.family.toLowerCase() === preferredFamily.toLowerCase());
    if (!match) return fallback;
    const regular = available.find(
      (f) => f.fontName.family === match.fontName.family && f.fontName.style === 'Regular'
    );
    return regular ? regular.fontName : match.fontName;
  } catch {
    return fallback;
  }
}

async function importTokens(tokens: ExtractedTokens, sourceLabel: string) {
  const prefix = sourceLabel ? `StyleKit/${sourceLabel}` : 'StyleKit';
  const summary = { colors: 0, textStyles: 0, effects: 0, variables: 0, skipped: 0 };

  // ── Colors -> Paint Styles ──────────────────────────────────────────────
  for (let i = 0; i < tokens.colors.length; i++) {
    const parsed = parseColor(tokens.colors[i]);
    if (!parsed) { summary.skipped++; continue; }
    const style = figma.createPaintStyle();
    style.name = `${prefix}/Colors/${tokens.colors[i]}`;
    style.paints = [{ type: 'SOLID', color: { r: parsed.r, g: parsed.g, b: parsed.b }, opacity: parsed.a }];
    summary.colors++;
  }

  // ── Typography -> Text Styles (one per detected size, primary family) ──
  const primaryFamily = tokens.typography.families[0] || 'Inter';
  const font = await pickFont(primaryFamily);
  for (const sizeStr of tokens.typography.sizes) {
    const size = parseLength(sizeStr);
    if (size === null || size <= 0) { summary.skipped++; continue; }
    try {
      await figma.loadFontAsync(font);
      const style = figma.createTextStyle();
      style.name = `${prefix}/Typography/${sizeStr}`;
      style.fontName = font;
      style.fontSize = size;
      summary.textStyles++;
    } catch {
      summary.skipped++;
    }
  }

  // ── Shadows -> Effect Styles ─────────────────────────────────────────────
  const shadowLabels = ['sm', 'md', 'lg', 'xl', '2xl'];
  for (let i = 0; i < tokens.shadows.length; i++) {
    const parsed = parseBoxShadow(tokens.shadows[i]);
    if (!parsed) { summary.skipped++; continue; }
    const style = figma.createEffectStyle();
    style.name = `${prefix}/Shadows/${shadowLabels[i] || 'shadow-' + (i + 1)}`;
    style.effects = [{
      type: 'DROP_SHADOW',
      color: { r: parsed.color.r, g: parsed.color.g, b: parsed.color.b, a: parsed.color.a },
      offset: { x: parsed.offsetX, y: parsed.offsetY },
      radius: parsed.blur,
      spread: parsed.spread,
      visible: true,
      blendMode: 'NORMAL',
    }];
    summary.effects++;
  }

  // ── Spacing + Border Radius -> Number Variables ──────────────────────────
  if (tokens.spacing.length || tokens.borderRadius.length) {
    const collection = figma.variables.createVariableCollection(`${prefix}/Tokens`);
    const modeId = collection.modes[0].modeId;

    tokens.spacing.forEach((val, i) => {
      const n = parseLength(val);
      if (n === null) { summary.skipped++; return; }
      const v = figma.variables.createVariable(`spacing/${val}`, collection, 'FLOAT');
      v.setValueForMode(modeId, n);
      summary.variables++;
    });

    tokens.borderRadius.forEach((val, i) => {
      const n = parseLength(val);
      if (n === null) { summary.skipped++; return; }
      const v = figma.variables.createVariable(`radius/${val}`, collection, 'FLOAT');
      v.setValueForMode(modeId, n);
      summary.variables++;
    });
  }

  return summary;
}

figma.ui.onmessage = async (msg: UIMessage) => {
  if (msg.type === 'cancel') {
    figma.closePlugin();
    return;
  }

  if (msg.type === 'import-tokens') {
    try {
      const summary = await importTokens(msg.tokens, msg.sourceLabel);
      figma.ui.postMessage({ type: 'import-result', success: true, summary });
      figma.notify(
        `StyleKit: ${summary.colors} color${summary.colors !== 1 ? 's' : ''}, ${summary.textStyles} text style${summary.textStyles !== 1 ? 's' : ''}, ${summary.effects} effect${summary.effects !== 1 ? 's' : ''}, ${summary.variables} variable${summary.variables !== 1 ? 's' : ''} imported`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      figma.ui.postMessage({ type: 'import-result', success: false, error: message });
      figma.notify(`StyleKit import failed: ${message}`, { error: true });
    }
  }
};
