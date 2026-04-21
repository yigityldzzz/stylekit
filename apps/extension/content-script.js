/**
 * StyleKit Content Script
 * Analyzes the current page DOM and extracts design tokens:
 * colors, typography, spacing, border-radius, and shadows.
 */

(function () {
  "use strict";

  // ─── Utilities ───────────────────────────────────────────────────────────────

  /**
   * Normalise any CSS color string to a 6-digit hex value.
   * Returns null if the color is transparent, none, or unparseable.
   */
  function normalizeColor(raw) {
    if (!raw || raw === "transparent" || raw === "none" || raw === "rgba(0, 0, 0, 0)") return null;

    // Already a hex value
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw)) {
      return raw.length === 4
        ? "#" + raw[1] + raw[1] + raw[2] + raw[2] + raw[3] + raw[3]
        : raw.toLowerCase();
    }

    // rgb / rgba
    const rgbMatch = raw.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      // Skip near-black/near-white that are almost certainly defaults
      return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    }

    return null;
  }

  /**
   * Given a map of value → frequency, return the top N entries sorted by count.
   */
  function topEntries(map, n = 10) {
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([value]) => value);
  }

  /**
   * Parse a px value string like "16px" and return the numeric value,
   * or null if not a plain px value.
   */
  function parsePx(val) {
    const m = val && val.match(/^(\d+(?:\.\d+)?)px$/);
    return m ? parseFloat(m[1]) : null;
  }

  // ─── Sampling ────────────────────────────────────────────────────────────────

  /**
   * Collect a representative sample of visible elements from the page.
   * Limits to 800 elements to keep extraction fast.
   */
  function sampleElements() {
    const all = Array.from(document.querySelectorAll("*"));
    const visible = all.filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    // Take every Nth element so we spread across the whole page
    const step = Math.max(1, Math.floor(visible.length / 800));
    return visible.filter((_, i) => i % step === 0);
  }

  // ─── Extraction functions ────────────────────────────────────────────────────

  function extractColors(elements) {
    const freq = new Map();

    const props = ["backgroundColor", "color", "borderTopColor", "borderBottomColor", "outlineColor"];

    for (const el of elements) {
      const cs = window.getComputedStyle(el);
      for (const prop of props) {
        const hex = normalizeColor(cs[prop]);
        if (!hex) continue;
        freq.set(hex, (freq.get(hex) || 0) + 1);
      }
    }

    // Filter out pure black & pure white as they are almost always browser defaults
    const filtered = new Map(
      [...freq.entries()].filter(([hex]) => hex !== "#000000" && hex !== "#ffffff" && hex !== "#000" && hex !== "#fff")
    );

    return topEntries(filtered.size > 5 ? filtered : freq, 12);
  }

  function extractTypography(elements) {
    const familyFreq = new Map();
    const sizeFreq = new Map();
    const weightFreq = new Map();

    for (const el of elements) {
      const cs = window.getComputedStyle(el);

      // Font family – take only the first family in the stack
      const family = cs.fontFamily.split(",")[0].trim().replace(/['"]/g, "");
      if (family) familyFreq.set(family, (familyFreq.get(family) || 0) + 1);

      // Font size
      const sizePx = parsePx(cs.fontSize);
      if (sizePx !== null && sizePx > 0) {
        const key = Math.round(sizePx) + "px";
        sizeFreq.set(key, (sizeFreq.get(key) || 0) + 1);
      }

      // Font weight
      const weight = cs.fontWeight;
      if (weight) weightFreq.set(weight, (weightFreq.get(weight) || 0) + 1);
    }

    const families = topEntries(familyFreq, 3);
    const sizes = [...sizeFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([v]) => v)
      .sort((a, b) => parsePx(a) - parsePx(b)); // sort ascending by px value
    const weights = topEntries(weightFreq, 5).sort((a, b) => parseInt(a) - parseInt(b));

    return { families, sizes, weights };
  }

  function extractSpacing(elements) {
    const freq = new Map();
    const props = [
      "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
      "marginTop", "marginRight", "marginBottom", "marginLeft",
      "gap", "rowGap", "columnGap",
    ];

    for (const el of elements) {
      const cs = window.getComputedStyle(el);
      for (const prop of props) {
        const px = parsePx(cs[prop]);
        if (px !== null && px > 0 && px <= 128) {
          const key = Math.round(px) + "px";
          freq.set(key, (freq.get(key) || 0) + 1);
        }
      }
    }

    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([v]) => v)
      .sort((a, b) => parsePx(a) - parsePx(b));
  }

  function extractBorderRadius(elements) {
    const freq = new Map();

    for (const el of elements) {
      const cs = window.getComputedStyle(el);
      const val = cs.borderRadius;
      if (!val || val === "0px") continue;
      // Only accept simple single px values like "4px", "8px", "9999px"
      if (!/^\d+(\.\d+)?px$/.test(val.trim())) continue;
      const rounded = Math.round(parseFloat(val)) + "px";
      freq.set(rounded, (freq.get(rounded) || 0) + 1);
    }

    return topEntries(freq, 6);
  }

  function extractShadows(elements) {
    const freq = new Map();

    for (const el of elements) {
      const cs = window.getComputedStyle(el);
      const val = cs.boxShadow;
      if (!val || val === "none") continue;
      // Take only the first shadow layer (before any comma that separates layers)
      // This avoids long multi-layer shadow strings
      const firstLayer = val.split(/,(?![^(]*\))/)[0].trim();
      if (!firstLayer || firstLayer === "none") continue;
      freq.set(firstLayer, (freq.get(firstLayer) || 0) + 1);
    }

    return topEntries(freq, 5);
  }

  // ─── DESIGN.md builder ───────────────────────────────────────────────────────

  /**
   * Categorise colors into semantic roles using simple heuristics.
   */
  function categorizeColors(colors) {
    if (!colors.length) return [];

    // Compute perceived lightness (0-255) for a hex string
    function luminance(hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    const labeled = colors.map((c) => ({ hex: c, lum: luminance(c) }));

    // Sort by frequency (already sorted) but group by role
    const result = [];
    const used = new Set();

    const pick = (predicate, label) => {
      const found = labeled.find((c) => !used.has(c.hex) && predicate(c));
      if (found) { used.add(found.hex); result.push({ label, hex: found.hex }); }
    };

    pick((c) => c.lum < 30, "Background Dark");
    pick((c) => c.lum > 220, "Background Light");
    pick((c) => c.lum < 30, "Text Dark");
    pick((c) => c.lum > 200, "Text Light");

    // Remaining colors become accent/brand colors
    let idx = 1;
    for (const { hex } of labeled) {
      if (!used.has(hex)) {
        result.push({ label: idx === 1 ? "Primary" : idx === 2 ? "Secondary" : `Accent ${idx - 2}`, hex });
        used.add(hex);
        idx++;
      }
    }

    return result;
  }

  function buildDesignMd(tokens, siteUrl) {
    const { colors, typography, spacing, borderRadius, shadows } = tokens;

    const categorized = categorizeColors(colors);

    const colorLines = categorized.length
      ? categorized.map((c) => `- ${c.label}: \`${c.hex}\``)
      : colors.map((c) => `- \`${c}\``);

    const shadowLabels = ["sm", "md", "lg", "xl", "2xl"];

    const lines = [
      `# Design System`,
      ``,
      `> Extracted from: ${siteUrl}`,
      `> Generated by StyleKit on ${new Date().toISOString().split("T")[0]}`,
      ``,
      `## Colors`,
      ...colorLines,
      ``,
      `## Typography`,
      `- **Font Family:** ${typography.families.join(", ") || "—"}`,
      `- **Sizes:** ${typography.sizes.join(", ") || "—"}`,
      `- **Weights:** ${typography.weights.join(", ") || "—"}`,
      ``,
      `## Spacing`,
      `- **Scale:** ${spacing.join(", ") || "—"}`,
      ``,
      `## Border Radius`,
      ...(borderRadius.length
        ? borderRadius.map((v, i) => {
            const labels = ["Small", "Medium", "Large", "X-Large", "XX-Large", "Full"];
            return `- **${labels[i] || i + 1}:** ${v}`;
          })
        : ["- None detected"]),
      ``,
      `## Shadows`,
      ...(shadows.length
        ? shadows.map((v, i) => `- **${shadowLabels[i] || "shadow-" + (i + 1)}:** \`${v}\``)
        : ["- None detected"]),
      ``,
    ];

    return lines.join("\n");
  }

  // ─── Main extraction entry point ─────────────────────────────────────────────

  function extractTokens() {
    const elements = sampleElements();

    const colors = extractColors(elements);
    const typography = extractTypography(elements);
    const spacing = extractSpacing(elements);
    const borderRadius = extractBorderRadius(elements);
    const shadows = extractShadows(elements);

    return { colors, typography, spacing, borderRadius, shadows };
  }

  // ─── Message listener ────────────────────────────────────────────────────────

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === "extractTokens") {
      try {
        const tokens = extractTokens();
        const designMd = buildDesignMd(tokens, window.location.href);
        sendResponse({ success: true, tokens, designMd });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    }
    // Return true to indicate we will respond asynchronously (required in MV3)
    return true;
  });
})();
