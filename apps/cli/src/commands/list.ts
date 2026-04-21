// `stylekit list` — display all available skills in a formatted table

import chalk from 'chalk';
import { logger, printLogo } from '../lib/logger';
import { getAllSkills } from '../lib/skills';
import { Skill, SkillTag } from '../types.js';

export function runList(): void {
  printLogo();

  const skills = getAllSkills();

  console.log(chalk.bold('  Available Skills') + chalk.dim(`  (${skills.length} total)\n`));

  printSkillTable(skills);

  logger.newline();
  logger.dim(`Run ${chalk.cyan('npx stylekit pull <skill-name>')} to add a skill to your project.`);
  logger.newline();
}

// ── Inline table printer (wider, more readable than the generic one) ─────────

function tagBadge(tag: SkillTag): string {
  const colors: Record<SkillTag, chalk.Chalk> = {
    tailwind: chalk.cyan,
    bootstrap: chalk.yellow,
    plain: chalk.magenta,
  };
  return (colors[tag] ?? chalk.white)(tag);
}

function printSkillTable(skills: Skill[]): void {
  const COL_NAME = 16;
  const COL_DESC = 44;
  const COL_TAGS = 28;
  const COL_COLOR = 10;

  const h = (s: string) => chalk.bold.white(s);
  const dim = chalk.dim;
  const sep = '─';

  const border = (l: string, m: string, r: string, fill: (n: number) => string) =>
    dim(l + fill(COL_NAME + 2) + m + fill(COL_DESC + 2) + m + fill(COL_TAGS + 2) + m + fill(COL_COLOR + 2) + r);

  const row = (name: string, desc: string, tags: string, color: string) => {
    const cell = (val: string, width: number) => {
      const visible = val.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
      const padding = Math.max(0, width - visible.length);
      return ' ' + val + ' '.repeat(padding) + ' ';
    };
    return dim('│') + cell(name, COL_NAME) + dim('│') + cell(desc, COL_DESC) + dim('│') + cell(tags, COL_TAGS) + dim('│') + cell(color, COL_COLOR) + dim('│');
  };

  console.log(border('┌', '┬', '┐', (n) => sep.repeat(n)));
  console.log(row(h('Name'), h('Description'), h('Tags'), h('Primary')));
  console.log(border('├', '┼', '┤', (n) => sep.repeat(n)));

  for (const skill of skills) {
    const name = chalk.green(skill.name);
    const desc = skill.description;
    const tags = skill.tags.map(tagBadge).join(chalk.dim(', '));
    const color = chalk.hex(cleanColor(skill.colors.primary))(skill.colors.primary);
    console.log(row(name, desc, tags, color));
  }

  console.log(border('└', '┴', '┘', (n) => sep.repeat(n)));
}

/** Some colors use CSS functions/gradients — fall back to grey for chalk.hex */
function cleanColor(color: string): string {
  if (color.startsWith('#') && (color.length === 4 || color.length === 7)) {
    return color;
  }
  return '#888888';
}
