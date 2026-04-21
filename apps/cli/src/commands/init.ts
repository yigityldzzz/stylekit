// `stylekit init` — interactive DESIGN.md creation

import chalk from 'chalk';
import inquirer from 'inquirer';
import { logger, printLogo } from '../lib/logger';
import { generateDesignMd, writeDesignMd, designMdExists } from '../lib/design-md';
import { getSkillNames } from '../lib/skills';
import { InitAnswers, StylePreference } from '../types.js';
import * as path from 'path';

export async function runInit(): Promise<void> {
  printLogo();

  const cwd = process.cwd();
  const designMdPath = path.join(cwd, 'DESIGN.md');

  // Warn if DESIGN.md already exists
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

  logger.info('Let\'s set up your design system. Answer a few quick questions:\n');

  const skillNames = getSkillNames();

  const answers = await inquirer.prompt<InitAnswers>([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: path.basename(cwd),
      validate: (input: string) => (input.trim().length > 0 ? true : 'Project name cannot be empty'),
    },
    {
      type: 'input',
      name: 'primaryColor',
      message: 'Primary color (hex or name, e.g. #6366f1 or indigo):',
      default: '#6366f1',
      validate: (input: string) => (input.trim().length > 0 ? true : 'Color cannot be empty'),
    },
    {
      type: 'input',
      name: 'fontFamily',
      message: 'Primary font family (e.g. Inter, Geist, DM Sans):',
      default: 'Inter',
      validate: (input: string) => (input.trim().length > 0 ? true : 'Font name cannot be empty'),
    },
    {
      type: 'list',
      name: 'stylePreference',
      message: 'Choose a style preset:',
      choices: skillNames.map((name) => ({
        name: `${name.padEnd(18)} ${getStyleEmoji(name as StylePreference)}`,
        value: name,
      })),
      default: 'minimal',
    },
  ]);

  // Generate and write DESIGN.md
  const content = generateDesignMd(answers);
  writeDesignMd(cwd, content);

  logger.newline();
  logger.success(`DESIGN.md created at ${chalk.cyan(designMdPath)}`);
  logger.newline();
  logger.dim('Next steps:');
  logger.dim(`  ${chalk.cyan('npx stylekit list')}       — browse available design skills`);
  logger.dim(`  ${chalk.cyan('npx stylekit pull ' + answers.stylePreference)}  — download the "${answers.stylePreference}" skill`);
  logger.dim(`  ${chalk.cyan('npx stylekit generate')}   — generate an AI prompt from DESIGN.md`);
  logger.newline();
}

// Returns a decorative emoji for each style preset
function getStyleEmoji(style: StylePreference): string {
  const map: Record<StylePreference, string> = {
    minimal: '— clean & quiet',
    corporate: '— professional & structured',
    startup: '— bold & energetic',
    'dark-mode': '— dark-first, high contrast',
    glassmorphism: '— frosted glass panels',
    retro: '— 80s terminal nostalgia',
    brutalist: '— raw & stark',
    'soft-ui': '— neumorphic & gentle',
    neon: '— cyberpunk glow',
    ocean: '— calm blue depth',
  };
  return chalk.dim(map[style] ?? '');
}
