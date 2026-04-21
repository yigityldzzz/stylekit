// `stylekit pull <skill-name>` — download a skill into .stylekit/

import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs';
import * as path from 'path';
import { logger, printLogo } from '../lib/logger';
import { getSkill, skillToJson, skillToTailwindTheme, getSkillNames } from '../lib/skills';
import { Skill } from '../types';

const STYLEKIT_DIR = '.stylekit';

export async function runPull(skillName: string): Promise<void> {
  printLogo();

  if (!skillName || skillName.trim() === '') {
    logger.error('Please provide a skill name.');
    logger.dim(`Available skills: ${getSkillNames().join(', ')}`);
    process.exit(1);
  }

  const skill = getSkill(skillName);

  if (!skill) {
    logger.error(`Skill "${skillName}" not found.`);
    logger.info(`Available skills: ${chalk.cyan(getSkillNames().join(', '))}`);
    process.exit(1);
  }

  const cwd = process.cwd();
  const stylekitDir = path.join(cwd, STYLEKIT_DIR);

  // Step 1 — Create .stylekit/ directory
  const spinnerDir = ora(`Creating ${chalk.cyan(STYLEKIT_DIR + '/')} directory...`).start();
  await simulateDelay(300);
  if (!fs.existsSync(stylekitDir)) {
    fs.mkdirSync(stylekitDir, { recursive: true });
  }
  spinnerDir.succeed(`Directory ${chalk.cyan(STYLEKIT_DIR + '/')} ready.`);

  // Step 2 — Write skill JSON
  const skillJsonPath = path.join(stylekitDir, `${skill.name}.json`);
  const spinnerJson = ora(`Pulling skill ${chalk.green(skill.name)}...`).start();
  await simulateDelay(500);
  fs.writeFileSync(skillJsonPath, skillToJson(skill), 'utf8');
  spinnerJson.succeed(`Skill written to ${chalk.cyan(skillJsonPath)}`);

  // Step 3 — Write Tailwind snippet
  const tailwindSnippetPath = path.join(stylekitDir, `${skill.name}.tailwind.js`);
  const spinnerTw = ora('Generating Tailwind theme snippet...').start();
  await simulateDelay(400);
  fs.writeFileSync(tailwindSnippetPath, skillToTailwindTheme(skill), 'utf8');
  spinnerTw.succeed(`Tailwind snippet written to ${chalk.cyan(tailwindSnippetPath)}`);

  // Summary
  logger.newline();
  console.log(
    chalk.bold.green('  Skill pulled successfully!') +
      chalk.dim(` — ${skill.atmosphere}`)
  );
  logger.newline();

  printSkillSummary(skill);

  logger.newline();
  logger.warn('Tailwind config update suggested:');
  logger.dim(`  Merge ${chalk.cyan(tailwindSnippetPath)} into your ${chalk.cyan('tailwind.config.js')} theme.extend block.`);
  logger.newline();
  logger.dim(`Run ${chalk.cyan('npx stylekit generate')} to create an AI prompt based on this skill.`);
  logger.newline();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function printSkillSummary(skill: Skill): void {
  const kv = (label: string, value: string) =>
    console.log('  ' + chalk.dim(label.padEnd(14)) + value);

  kv('Name:', chalk.green(skill.name));
  kv('Description:', skill.description);
  kv('Tags:', skill.tags.map((t) => chalk.cyan(t)).join(', '));
  kv('Primary:', chalk.hex(cleanHex(skill.colors.primary))(skill.colors.primary));
  kv('Font (sans):', skill.fonts.sans);
  kv('Font (mono):', skill.fonts.mono);
}

function cleanHex(color: string): string {
  if (color.startsWith('#') && (color.length === 4 || color.length === 7)) {
    return color;
  }
  return '#888888';
}

/** Tiny helper to simulate async work so spinners are visible */
function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
