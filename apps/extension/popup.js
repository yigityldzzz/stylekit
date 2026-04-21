/**
 * StyleKit Popup Script
 * Controls the popup UI: triggers extraction, renders results,
 * and handles copy/download of the DESIGN.md output.
 */

(function () {
  "use strict";

  // ─── State ────────────────────────────────────────────────────────────────

  let currentDesignMd = "";
  let currentTokens   = null;

  // ─── DOM refs ─────────────────────────────────────────────────────────────

  const $siteUrl        = document.getElementById("site-url");
  const $stateIdle      = document.getElementById("state-idle");
  const $stateLoading   = document.getElementById("state-loading");
  const $stateError     = document.getElementById("state-error");
  const $stateResults   = document.getElementById("state-results");
  const $errorMessage   = document.getElementById("error-message");
  const $btnExtract     = document.getElementById("btn-extract");
  const $btnRetry       = document.getElementById("btn-retry");
  const $btnCopy        = document.getElementById("btn-copy");
  const $btnDownload    = document.getElementById("btn-download");
  const $btnReextract   = document.getElementById("btn-reextract");
  const $colorsGrid     = document.getElementById("colors-grid");
  const $colorsCount    = document.getElementById("colors-count");
  const $typographyList = document.getElementById("typography-list");
  const $spacingChips   = document.getElementById("spacing-chips");
  const $radiusChips    = document.getElementById("radius-chips");
  const $shadowsList    = document.getElementById("shadows-list");
  const $toast          = document.getElementById("toast");

  // ─── State transitions ────────────────────────────────────────────────────

  function showState(name) {
    [$stateIdle, $stateLoading, $stateError, $stateResults].forEach((el) =>
      el.classList.add("hidden")
    );
    const el = document.getElementById("state-" + name);
    if (el) el.classList.remove("hidden");
  }

  // ─── Toast ────────────────────────────────────────────────────────────────

  let toastTimer = null;

  function showToast(message, type = "success") {
    $toast.textContent = message;
    $toast.className = "toast " + type;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      $toast.classList.add("hidden");
    }, 2400);
  }

  // ─── Render helpers ───────────────────────────────────────────────────────

  function renderColors(colors) {
    $colorsGrid.innerHTML = "";
    $colorsCount.textContent = colors.length;

    if (!colors.length) {
      $colorsGrid.innerHTML = '<span style="font-size:11px;color:var(--text-muted)">None detected</span>';
      return;
    }

    for (const hex of colors) {
      const swatch = document.createElement("div");
      swatch.className = "color-swatch";
      swatch.title = "Click to copy " + hex;

      const box = document.createElement("div");
      box.className = "color-box";
      box.style.backgroundColor = hex;

      const label = document.createElement("span");
      label.className = "color-hex";
      label.textContent = hex;

      swatch.appendChild(box);
      swatch.appendChild(label);

      // Click to copy individual color
      swatch.addEventListener("click", () => {
        navigator.clipboard.writeText(hex).then(() => showToast("Copied " + hex));
      });

      $colorsGrid.appendChild(swatch);
    }
  }

  function renderTypography(typography) {
    $typographyList.innerHTML = "";

    const rows = [
      { label: "Font Family", value: typography.families.join(", ") || "—" },
      { label: "Sizes",       value: typography.sizes.join(", ")    || "—" },
      { label: "Weights",     value: typography.weights.join(", ")  || "—" },
    ];

    for (const { label, value } of rows) {
      const row = document.createElement("div");
      row.className = "token-row";

      const lEl = document.createElement("span");
      lEl.className = "token-label";
      lEl.textContent = label;

      const vEl = document.createElement("span");
      vEl.className = "token-value";
      vEl.textContent = value;
      vEl.title = value;

      row.appendChild(lEl);
      row.appendChild(vEl);
      $typographyList.appendChild(row);
    }
  }

  function renderChips(container, values) {
    container.innerHTML = "";
    if (!values.length) {
      container.innerHTML = '<span style="font-size:11px;color:var(--text-muted)">None detected</span>';
      return;
    }
    for (const val of values) {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = val;
      container.appendChild(chip);
    }
  }

  function renderShadows(shadows) {
    $shadowsList.innerHTML = "";
    const labels = ["sm", "md", "lg", "xl", "2xl"];

    if (!shadows.length) {
      $shadowsList.innerHTML = '<span style="font-size:11px;color:var(--text-3)">None detected</span>';
      return;
    }

    for (let i = 0; i < shadows.length; i++) {
      const row = document.createElement("div");
      row.className = "shadow-row";

      // Visual preview dot
      const preview = document.createElement("div");
      preview.className = "shadow-preview";
      preview.style.boxShadow = shadows[i];

      const lEl = document.createElement("span");
      lEl.className = "shadow-label";
      lEl.textContent = labels[i] || "s" + (i + 1);

      const vEl = document.createElement("span");
      vEl.className = "shadow-value";
      vEl.textContent = shadows[i];
      vEl.title = shadows[i];

      row.appendChild(preview);
      row.appendChild(lEl);
      row.appendChild(vEl);
      $shadowsList.appendChild(row);
    }
  }

  function renderResults(tokens, designMd) {
    currentTokens   = tokens;
    currentDesignMd = designMd;

    renderColors(tokens.colors || []);
    renderTypography(tokens.typography || { families: [], sizes: [], weights: [] });
    renderChips($spacingChips, tokens.spacing || []);
    renderChips($radiusChips,  tokens.borderRadius || []);
    renderShadows(tokens.shadows || []);

    showState("results");
  }

  // ─── Extraction ───────────────────────────────────────────────────────────

  function runExtraction() {
    showState("loading");

    chrome.runtime.sendMessage({ action: "extractFromActiveTab" }, (response) => {
      if (chrome.runtime.lastError) {
        showError(chrome.runtime.lastError.message);
        return;
      }

      if (!response || !response.success) {
        showError(response ? response.error : "No response from page.");
        return;
      }

      renderResults(response.tokens, response.designMd);
    });
  }

  function showError(msg) {
    $errorMessage.textContent = msg || "An unknown error occurred.";
    showState("error");
  }

  // ─── Site URL ─────────────────────────────────────────────────────────────

  function loadSiteUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        try {
          const url = new URL(tabs[0].url);
          $siteUrl.textContent = url.hostname + (url.pathname !== "/" ? url.pathname : "");
        } catch {
          $siteUrl.textContent = tabs[0].url || "Unknown";
        }
      }
    });
  }

  // ─── Copy / Download ──────────────────────────────────────────────────────

  function copyDesignMd() {
    if (!currentDesignMd) return;
    navigator.clipboard
      .writeText(currentDesignMd)
      .then(() => showToast("Copied to clipboard!"))
      .catch(() => showToast("Copy failed.", "error"));
  }

  function downloadDesignMd() {
    if (!currentDesignMd) return;

    const blob = new Blob([currentDesignMd], { type: "text/markdown" });
    const url  = URL.createObjectURL(blob);

    // Determine a filename from the current tab host
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let filename = "DESIGN.md";
      if (tabs && tabs[0]) {
        try {
          const host = new URL(tabs[0].url).hostname.replace(/[^a-z0-9.-]/gi, "_");
          filename = host + "-DESIGN.md";
        } catch {
          // keep default filename
        }
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast("Downloaded " + filename);
    });
  }

  // ─── Event listeners ──────────────────────────────────────────────────────

  $btnExtract.addEventListener("click",   runExtraction);
  $btnRetry.addEventListener("click",     runExtraction);
  $btnReextract.addEventListener("click", runExtraction);
  $btnCopy.addEventListener("click",      copyDesignMd);
  $btnDownload.addEventListener("click",  downloadDesignMd);

  // ─── Init ─────────────────────────────────────────────────────────────────

  loadSiteUrl();
  showState("idle");
})();
