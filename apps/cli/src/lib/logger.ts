// Colored terminal output utilities using chalk

import chalk from 'chalk';
import boxen from 'boxen';

// ── Core log helpers ────────────────────────────────────────────────────────

export const logger = {
  success: (msg: string) => console.log(chalk.green('✔ ') + msg),
  error: (msg: string) => console.error(chalk.red('✖ ') + msg),
  info: (msg: string) => console.log(chalk.blue('ℹ ') + msg),
  warn: (msg: string) => console.log(chalk.yellow('⚠ ') + msg),
  dim: (msg: string) => console.log(chalk.dim(msg)),
  newline: () => console.log(),
};

// ── ASCII art logo ───────────────────────────────────────────────────────────

export function printLogo(): void {
  const logo = [
    chalk.cyan(' ___  _         _      _  ___ _ _'),
    chalk.cyan('/ __|| |_  _  _| | ___| |/ (_) | |'),
    chalk.cyan('\\__ \\|  _|| || | |/ -_) \' <| |  _|'),
    chalk.cyan('|___/ \\__| \\_, |_|\\___|_|\\_\\_|\\__|'),
    chalk.cyan('           |__/'),
  ].join('\n');

  const subtitle = chalk.dim('  Design systems for AI-generated code');

  console.log(
    boxen(`${logo}\n\n${subtitle}`, {
      padding: { top: 1, bottom: 1, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: 'cyan',
    })
  );
  console.log();
}

// ── Table renderer ───────────────────────────────────────────────────────────

export interface TableColumn {
  header: string;
  width: number;
  align?: 'left' | 'right' | 'center';
}

function pad(str: string, width: number, align: 'left' | 'right' | 'center' = 'left'): string {
  // Strip ANSI escape codes to measure actual visible length
  const visible = str.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
  const pad = Math.max(0, width - visible.length);
  if (align === 'right') return ' '.repeat(pad) + str;
  if (align === 'center') {
    const left = Math.floor(pad / 2);
    const right = pad - left;
    return ' '.repeat(left) + str + ' '.repeat(right);
  }
  return str + ' '.repeat(pad);
}

export function printTable<T extends Record<string, unknown>>(
  rows: T[],
  columns: TableColumn[]
): void {
  const sep = '─';
  const divider = columns.map((c) => sep.repeat(c.width + 2)).join('┼');

  // Header
  const header = columns
    .map((c) => ' ' + pad(chalk.bold.white(c.header), c.width) + ' ')
    .join('│');

  console.log(chalk.dim('┌' + columns.map((c) => sep.repeat(c.width + 2)).join('┬') + '┐'));
  console.log(chalk.dim('│') + header + chalk.dim('│'));
  console.log(chalk.dim('├' + divider + '┤'));

  // Rows
  for (const row of rows) {
    const cells = columns
      .map((c) => {
        const val = String(row[c.header.toLowerCase()] ?? '');
        return ' ' + pad(val, c.width, c.align) + ' ';
      })
      .join(chalk.dim('│'));
    console.log(chalk.dim('│') + cells + chalk.dim('│'));
  }

  console.log(chalk.dim('└' + columns.map((c) => sep.repeat(c.width + 2)).join('┴') + '┘'));
}
