// Standalone re-implementation of the pure-logic parsing functions from
// src/code.ts, so they can be unit-tested in plain Node (no Figma API
// available in this sandbox — this validates the logic that code.ts embeds).

function clamp01(n) { return Math.max(0, Math.min(1, n)); }

function parseColor(input) {
  const s = input.trim();
  const hexMatch = s.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3 || hex.length === 4) hex = hex.split('').map((c) => c + c).join('');
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

function parseBoxShadow(input) {
  let s = input.trim();
  if (!s || /^none$/i.test(s)) return null;
  s = s.replace(/^inset\s+/i, '').replace(/\s+inset$/i, '');
  const anyFunctionMatch = s.match(/[a-z]+\([^)]*\)/i);
  const colorMatch = s.match(/(#[0-9a-f]{3,8}\b|rgba?\([^)]+\))/i);
  const color = colorMatch ? parseColor(colorMatch[0]) : null;
  const withoutColor = anyFunctionMatch ? s.replace(anyFunctionMatch[0], ' ') : s;
  const numbers = withoutColor.split(/\s+/).filter(Boolean).map((tok) => parseFloat(tok)).filter((n) => !Number.isNaN(n));
  if (numbers.length < 2) return null;
  return {
    offsetX: numbers[0] ?? 0, offsetY: numbers[1] ?? 0, blur: numbers[2] ?? 0, spread: numbers[3] ?? 0,
    color: color ?? { r: 0, g: 0, b: 0, a: 0.25 },
  };
}

function parseLength(input) {
  const m = input.trim().match(/-?[\d.]+/);
  if (!m) return null;
  const n = parseFloat(m[0]);
  return Number.isNaN(n) ? null : n;
}

// ── Tests ────────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
function check(name, actual, expected) {
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a === e) { pass++; console.log(`ok  - ${name}`); }
  else { fail++; console.log(`FAIL - ${name}\n  expected: ${e}\n  actual:   ${a}`); }
}
function approxCheck(name, actual, expected, eps = 0.01) {
  const keys = Object.keys(expected);
  const ok = keys.every((k) => Math.abs(actual[k] - expected[k]) < eps);
  if (ok) { pass++; console.log(`ok  - ${name}`); }
  else { fail++; console.log(`FAIL - ${name}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`); }
}

// -- parseColor --
approxCheck('hex 6-digit', parseColor('#8b5cf6'), { r: 0.545, g: 0.361, b: 0.965, a: 1 });
approxCheck('hex 3-digit', parseColor('#fff'), { r: 1, g: 1, b: 1, a: 1 });
approxCheck('hex 8-digit with alpha', parseColor('#8b5cf680'), { r: 0.545, g: 0.361, b: 0.965, a: 0.502 });
approxCheck('rgb()', parseColor('rgb(139, 92, 246)'), { r: 0.545, g: 0.361, b: 0.965, a: 1 });
approxCheck('rgba() with decimal alpha', parseColor('rgba(0, 0, 0, 0.1)'), { r: 0, g: 0, b: 0, a: 0.1 });
approxCheck('rgba() with spaces from getComputedStyle', parseColor('rgba(17, 24, 39, 1)'), { r: 0.067, g: 0.094, b: 0.153, a: 1 });
check('invalid color returns null', parseColor('not-a-color'), null);
check('named color returns null (not supported)', parseColor('red'), null);

// -- parseBoxShadow (real getComputedStyle() output shapes) --
approxCheck('chrome-style: color first', parseBoxShadow('rgba(0, 0, 0, 0.1) 0px 1px 2px 0px').color, { r: 0, g: 0, b: 0, a: 0.1 });
check('chrome-style offsets', (() => { const p = parseBoxShadow('rgba(0, 0, 0, 0.1) 0px 1px 2px 0px'); return [p.offsetX, p.offsetY, p.blur, p.spread]; })(), [0, 1, 2, 0]);
check('offsets-first, no spread', (() => { const p = parseBoxShadow('0px 4px 8px rgba(0,0,0,.15)'); return [p.offsetX, p.offsetY, p.blur, p.spread]; })(), [0, 4, 8, 0]);
check('offsets-only, no blur/spread', (() => { const p = parseBoxShadow('2px 2px #000'); return [p.offsetX, p.offsetY, p.blur, p.spread]; })(), [2, 2, 0, 0]);
check('inset prefix stripped, offsets still parsed', (() => { const p = parseBoxShadow('inset 0px 1px 2px rgba(0,0,0,.2)'); return [p.offsetX, p.offsetY, p.blur, p.spread]; })(), [0, 1, 2, 0]);
check('none returns null', parseBoxShadow('none'), null);
check('empty returns null', parseBoxShadow(''), null);
check(
  'real-world bug: oklch() color must not leak numbers into offsets (figma.com extraction)',
  (() => { const p = parseBoxShadow('oklch(0 0 none / 0.16) 0px 1px 0px 0px'); return [p.offsetX, p.offsetY, p.blur, p.spread]; })(),
  [0, 1, 0, 0]
);
check('oklch() color falls back to default gray (unparseable, but no crash)', parseBoxShadow('oklch(0 0 none / 0.16) 0px 1px 0px 0px').color, { r: 0, g: 0, b: 0, a: 0.25 });
check('color missing falls back to default gray', parseBoxShadow('0px 1px 2px').color, { r: 0, g: 0, b: 0, a: 0.25 });

// -- parseLength --
check('px suffix', parseLength('16px'), 16);
check('rem suffix (treated as raw number)', parseLength('1.5rem'), 1.5);
check('unitless', parseLength('8'), 8);
check('negative', parseLength('-4px'), -4);
check('garbage returns null', parseLength('none'), null);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
