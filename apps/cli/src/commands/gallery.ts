// `stylekit gallery [search]` — browse the Community Gallery (real design
// systems extracted from real sites via the Chrome extension or Figma
// plugin) and pull one straight into DESIGN.md, without leaving the
// terminal. Also accepts a raw token JSON directly via --json for tokens
// that haven't been published to the gallery yet.

import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import * as fs from 'fs';
import * as path from 'path';
import { logger, printLogo } from '../lib/logger';
import { designMdExists } from '../lib/design-md';
import {
  listGalleryExtractions,
  getGalleryExtraction,
  incrementCloneCount,
  buildDesignMdFromGallery,
  GalleryExtraction,
  ExtractedTokens,
} from '../lib/gallery';

export interface GalleryOptions {
  json?: string;
}

export async function runGallery(search: string | undefined, options: GalleryOptions): Promise<void> {
  printLogo();

  const cwd = process.cwd();
  const designMdPath = path.join(cwd, 'DESIGN.md');

  // ── Path 1: --json <file> — a locally-extracted token set that hasn't
  // (or won't) be published to the gallery. Mirrors the Figma plugin's
  // "Paste JSON" tab, copied from the extension's "Copy Tokens (JSON)"
  // button. ────────────────────────────────────────────────────────────────
  if (options.json) {
    await pullFromJsonFile(options.json, cwd, designMdPath);
    return;
  }

  // ── Path 2: browse and pull from the public gallery ─────────────────────
  const spinner = ora('Fetching the Community Gallery...').start();
  let entries: GalleryExtraction[];
  try {
    entries = await listGalleryExtractions(search);
    spinner.succeed(
      search
        ? `Found ${entries.length} result${entries.length === 1 ? '' : 's'} for "${search}".`
        : `Loaded ${entries.length} gallery entr${entries.length === 1 ? 'y' : 'ies'}.`
    );
  } catch (err) {
    spinner.fail('Could not reach the gallery.');
    throw err;
  }

  if (!entries.length) {
    logger.newline();
    logger.warn(search ? `No gallery entries match "${search}".` : 'The gallery is empty right now.');
    logger.dim('Extract a site with the StyleKit Chrome extension and publish it to seed the gallery:');
    logger.dim(`  ${chalk.cyan('https://stylekit.digitaladexpert.de/gallery')}`);
    logger.newline();
    return;
  }

  const { chosenId } = await inquirer.prompt<{ chosenId: string }>([
    {
      type: 'list',
      name: 'chosenId',
      message: 'Pick a design system to pull:',
      pageSize: 12,
      choices: entries.map((e) => ({
        name: `${e.title.padEnd(28)} ${chalk.dim(e.source_host)} ${chalk.dim('·')} ${chalk.cyan(e.category)} ${chalk.dim(`· ${e.clone_count} pulls`)}`,
        value: e.id,
      })),
    },
  ]);

  const chosen = entries.find((e) => e.id === chosenId)!;
  await writeFromExtraction(chosen, cwd, designMdPath, /* fullFetchNeeded */ true);
}

// ── Path 1 implementation ────────────────────────────────────────────────────

async function pullFromJsonFile(jsonPath: string, cwd: string, designMdPath: string): Promise<void> {
  const resolved = path.isAbsolute(jsonPath) ? jsonPath : path.join(cwd, jsonPath);

  if (!fs.existsSync(resolved)) {
    logger.error(`File not found: ${chalk.cyan(resolved)}`);
    logger.dim('Copy tokens from the StyleKit extension\'s "Copy Tokens (JSON) — for Figma" button and save them to a file first.');
    process.exit(1);
  }

  let tokens: ExtractedTokens;
  try {
    const raw = JSON.parse(fs.readFileSync(resolved, 'utf8'));
    tokens = normalizeTokens(raw);
  } catch (err) {
    logger.error(`Could not parse ${chalk.cyan(resolved)} as a StyleKit token JSON.`);
    throw err;
  }

  const fakeEntry: GalleryExtraction = {
    id: 'local',
    author_label: 'you',
    title: path.basename(resolved, path.extname(resolved)),
    source_host: 'local extraction',
    source_url: resolved,
    category: 'Other',
    tokens,
    clone_count: 0,
    view_count: 0,
    created_at: new Date().toISOString(),
  };

  await writeFromExtraction(fakeEntry, cwd, designMdPath, /* fullFetchNeeded */ false);
}

function normalizeTokens(raw: any): ExtractedTokens {
  return {
    colors: Array.isArray(raw.colors) ? raw.colors : [],
    typography: {
      families: raw.typography?.families ?? [],
      sizes: raw.typography?.sizes ?? [],
      weights: raw.typography?.weights ?? [],
    },
    spacing: Array.isArray(raw.spacing) ? raw.spacing : [],
    borderRadius: Array.isArray(raw.borderRadius) ? raw.borderRadius : [],
    shadows: Array.isArray(raw.shadows) ? raw.shadows : [],
  };
}

// ── Shared: write DESIGN.md from a resolved gallery entry ───────────────────

async function writeFromExtraction(
  entry: GalleryExtraction,
  cwd: string,
  designMdPath: string,
  fullFetchNeeded: boolean
): Promise<void> {
  if (designMdExists(cwd)) {
    const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([
      {
        type: 'confirm',
        name: 'overwrite',
        message: chalk.yellow('DESIGN.md already exists. Overwrite it?'),
        default: false,
      },
    ]);
    if (!overwrite) {
      logger.info('Keeping existing DESIGN.md. No changes made.');
      return;
    }
  }

  const spinner = ora(`Pulling "${entry.title}"...`).start();

  // The list endpoint doesn't return every column — fetch the full row
  // (still just the public, already-fetched-in-the-list tokens field in
  // practice, but this keeps the contract honest if the select list above
  // ever gets trimmed further).
  let full = entry;
  if (fullFetchNeeded) {
    try {
      full = await getGalleryExtraction(entry.id);
    } catch {
      // fall back to what we already have from the list call
    }
  }

  const content = buildDesignMdFromGallery(full);
  fs.writeFileSync(designMdPath, content, 'utf8');
  spinner.succeed(`DESIGN.md written to ${chalk.cyan(designMdPath)}`);

  if (fullFetchNeeded && full.id !== 'local') {
    incrementCloneCount(full.id); // best-effort, not awaited on purpose
  }

  logger.newline();
  console.log(chalk.bold.green('  Pulled successfully!') + chalk.dim(` — ${full.tokens.colors.length} colors, ${full.tokens.shadows.length} shadows`));
  logger.newline();
  logger.dim(`Run ${chalk.cyan('npx stylekit generate')} to turn this into an AI prompt.`);
  logger.newline();
}
