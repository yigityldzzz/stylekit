#!/usr/bin/env node
// StyleKit CLI — entry point

import { Command } from 'commander';
import chalk from 'chalk';
import { runInit } from './commands/init';
import { runList } from './commands/list';
import { runPull } from './commands/pull';
import { runGenerate } from './commands/generate';

const program = new Command();

program
  .name('stylekit')
  .description(chalk.cyan('StyleKit') + ' — Apply design systems to your AI-generated code')
  .version('0.1.0', '-v, --version', 'Show version number');

// ── Commands ─────────────────────────────────────────────────────────────────

program
  .command('init')
  .description('Interactively create a DESIGN.md in the current directory')
  .action(async () => {
    try {
      await runInit();
    } catch (err) {
      handleError(err);
    }
  });

program
  .command('list')
  .description('List all available design skills')
  .action(() => {
    try {
      runList();
    } catch (err) {
      handleError(err);
    }
  });

program
  .command('pull <skill-name>')
  .description('Pull a skill into .stylekit/ and generate a Tailwind snippet')
  .action(async (skillName: string) => {
    try {
      await runPull(skillName);
    } catch (err) {
      handleError(err);
    }
  });

program
  .command('generate')
  .description('Generate an AI prompt from your DESIGN.md')
  .action(async () => {
    try {
      await runGenerate();
    } catch (err) {
      handleError(err);
    }
  });

// ── Default: show help when called with no arguments ─────────────────────────

if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv);

// ── Error handler ─────────────────────────────────────────────────────────────

function handleError(err: unknown): void {
  if (err instanceof Error) {
    console.error(chalk.red('✖ Error: ') + err.message);
    if (process.env.DEBUG) {
      console.error(err.stack);
    }
  } else {
    console.error(chalk.red('✖ An unexpected error occurred.'));
  }
  process.exit(1);
}
