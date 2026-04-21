// `stylekit generate` — read DESIGN.md and produce an AI prompt snippet

import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import { logger, printLogo } from '../lib/logger';
import { parseDesignMd, buildAiPrompt, designMdExists } from '../lib/design-md';

export async function runGenerate(): Promise<void> {
  printLogo();

  const cwd = process.cwd();

  // Guard: DESIGN.md must exist
  if (!designMdExists(cwd)) {
    logger.error('No DESIGN.md found in the current directory.');
    logger.info(`Run ${chalk.cyan('npx stylekit init')} first to create your design configuration.`);
    process.exit(1);
  }

  const spinner = ora('Reading DESIGN.md...').start();
  await simulateDelay(400);

  const config = parseDesignMd(cwd);

  if (!config) {
    spinner.fail('Failed to parse DESIGN.md.');
    logger.error('The metadata JSON block in DESIGN.md appears to be missing or malformed.');
    logger.dim('Try regenerating it with: npx stylekit init');
    process.exit(1);
  }

  spinner.succeed('DESIGN.md parsed successfully.');

  const spinnerPrompt = ora('Building AI prompt...').start();
  await simulateDelay(300);
  const prompt = buildAiPrompt(config);
  spinnerPrompt.succeed('Prompt ready.');

  logger.newline();
  console.log(chalk.bold.cyan('  Copy this prompt to your AI tool:'));
  logger.newline();

  // Print the prompt inside a nice box
  console.log(
    boxen(prompt, {
      padding: { top: 1, bottom: 1, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: 'cyan',
    })
  );

  logger.newline();
  logger.success('Prompt copied to your terminal. Paste it into ChatGPT, Claude, Cursor, or any AI tool.');
  logger.dim(`Project: ${chalk.cyan(config.projectName)}  |  Style: ${chalk.cyan(config.stylePreference)}  |  Color: ${chalk.hex(cleanHex(config.primaryColor))(config.primaryColor)}`);
  logger.newline();
}

function cleanHex(color: string): string {
  if (color.startsWith('#') && (color.length === 4 || color.length === 7)) {
    return color;
  }
  return '#888888';
}

function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
