/**
 * StyleKit Icon Generator
 * Run this script once with Node.js to generate the PNG icon files:
 *   node generate-icons.js
 *
 * Requires the 'canvas' package:
 *   npm install canvas
 * OR if you have it globally available just run the script.
 *
 * If 'canvas' is not available the script falls back to writing
 * minimal hard-coded PNG buffers (solid colour, correct dimensions).
 */

const fs   = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "icons");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

// ─── Attempt to use 'canvas' for nice-looking icons ──────────────────────────
function makeIconCanvas(size) {
  const { createCanvas } = require("canvas");
  const canvas = createCanvas(size, size);
  const ctx    = canvas.getContext("2d");

  const pad  = Math.round(size * 0.08);
  const half = Math.round((size - pad * 2) / 2);
  const r    = Math.round(size * 0.12);
  const gap  = Math.round(size * 0.04);
  const w    = half - gap;

  // Dark background
  ctx.fillStyle = "#0f0f0f";
  ctx.fillRect(0, 0, size, size);

  const squares = [
    { x: pad,        y: pad,        color: "#6C63FF" },
    { x: pad + half, y: pad,        color: "#FF6584" },
    { x: pad,        y: pad + half, color: "#43C6AC" },
    { x: pad + half, y: pad + half, color: "#FFD166" },
  ];

  for (const sq of squares) {
    ctx.fillStyle = sq.color;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(sq.x, sq.y, w, w, r);
    } else {
      ctx.rect(sq.x, sq.y, w, w);
    }
    ctx.fill();
  }

  return canvas.toBuffer("image/png");
}

// ─── Fallback: generate a minimal valid PNG programmatically ─────────────────
// Uses raw PNG binary encoding (no external deps).
function makeIconFallback(size) {
  // We build a PNG with IHDR + IDAT + IEND chunks.
  // Image: dark bg (#0f0f0f) with four colored quadrants.

  const width  = size;
  const height = size;

  // Build raw pixel data (RGBA)
  const pixels = Buffer.alloc(width * height * 4);

  const half = Math.floor(size / 2);

  const colors = {
    bg: [0x0f, 0x0f, 0x0f],
    tl: [0x6c, 0x63, 0xff], // purple
    tr: [0xff, 0x65, 0x84], // pink
    bl: [0x43, 0xc6, 0xac], // teal
    br: [0xff, 0xd1, 0x66], // yellow
  };

  const pad = Math.round(size * 0.10);
  const gap = Math.round(size * 0.05);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      let rgb = colors.bg;

      const inLeft  = x >= pad && x < half - gap;
      const inRight = x >= half + gap && x < width - pad;
      const inTop   = y >= pad && y < half - gap;
      const inBot   = y >= half + gap && y < height - pad;

      if      (inLeft  && inTop) rgb = colors.tl;
      else if (inRight && inTop) rgb = colors.tr;
      else if (inLeft  && inBot) rgb = colors.bl;
      else if (inRight && inBot) rgb = colors.br;

      pixels[idx]     = rgb[0];
      pixels[idx + 1] = rgb[1];
      pixels[idx + 2] = rgb[2];
      pixels[idx + 3] = 255;
    }
  }

  return encodePNG(width, height, pixels);
}

// Minimal PNG encoder (no zlib compression – uses uncompressed deflate blocks)
function encodePNG(width, height, rgba) {
  const zlib = require("zlib");

  // Build raw scanlines: filter byte (0 = None) + RGBA row
  const scanlines = Buffer.alloc((1 + width * 4) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 4);
    scanlines[rowStart] = 0; // filter type None
    rgba.copy(scanlines, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(scanlines, { level: 6 });

  function crc32(buf) {
    const table = crc32.table || (crc32.table = (() => {
      const t = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        t[i] = c;
      }
      return t;
    })());
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const typeBytes = Buffer.from(type, "ascii");
    const len       = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
    const body      = Buffer.concat([typeBytes, data]);
    const crcBuf    = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(body), 0);
    return Buffer.concat([len, body, crcBuf]);
  }

  const IHDR_data = Buffer.alloc(13);
  IHDR_data.writeUInt32BE(width, 0);
  IHDR_data.writeUInt32BE(height, 4);
  IHDR_data[8]  = 8;  // bit depth
  IHDR_data[9]  = 6;  // color type: RGBA
  IHDR_data[10] = 0;  // compression
  IHDR_data[11] = 0;  // filter
  IHDR_data[12] = 0;  // interlace

  const sig  = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const IHDR = chunk("IHDR", IHDR_data);
  const IDAT = chunk("IDAT", compressed);
  const IEND = chunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, IHDR, IDAT, IEND]);
}

// ─── Main ────────────────────────────────────────────────────────────────────
const sizes = [16, 48, 128];

for (const size of sizes) {
  let buf;
  try {
    buf = makeIconCanvas(size);
    console.log(`icon${size}.png  (canvas)`);
  } catch {
    buf = makeIconFallback(size);
    console.log(`icon${size}.png  (fallback)`);
  }
  fs.writeFileSync(path.join(OUT_DIR, `icon${size}.png`), buf);
}

console.log("Done – icons written to ./icons/");
