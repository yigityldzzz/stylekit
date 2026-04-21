// Local skill registry - hardcoded skill definitions (no API required)

import { Skill } from '../types';

const skills: Skill[] = [
  {
    name: 'minimal',
    description: 'Clean, whitespace-heavy design with subtle borders',
    tags: ['tailwind'],
    atmosphere: 'Like a Zen garden — nothing unnecessary.',
    colors: {
      primary: '#18181b',
      secondary: '#3f3f46',
      accent: '#6366f1',
      background: '#ffffff',
      foreground: '#09090b',
      muted: '#f4f4f5',
      border: '#e4e4e7',
    },
    fonts: { sans: 'Inter', mono: 'JetBrains Mono' },
    borderRadius: { sm: '0.25rem', md: '0.375rem', lg: '0.5rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.07)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.07)',
    },
  },
  {
    name: 'corporate',
    description: 'Professional enterprise look with structured layouts',
    tags: ['tailwind', 'bootstrap'],
    atmosphere: 'Boardroom-ready. Serious and trustworthy.',
    colors: {
      primary: '#1e40af',
      secondary: '#1d4ed8',
      accent: '#3b82f6',
      background: '#f8fafc',
      foreground: '#0f172a',
      muted: '#e2e8f0',
      border: '#cbd5e1',
    },
    fonts: { sans: 'IBM Plex Sans', mono: 'IBM Plex Mono', heading: 'IBM Plex Sans' },
    borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.375rem', full: '9999px' },
    shadows: {
      sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
  },
  {
    name: 'startup',
    description: 'Vibrant, modern SaaS aesthetic with bold CTAs',
    tags: ['tailwind'],
    atmosphere: 'Y Combinator demo day energy.',
    colors: {
      primary: '#7c3aed',
      secondary: '#6d28d9',
      accent: '#f59e0b',
      background: '#fafafa',
      foreground: '#111827',
      muted: '#f3f4f6',
      border: '#e5e7eb',
    },
    fonts: { sans: 'Plus Jakarta Sans', mono: 'Fira Code', heading: 'Plus Jakarta Sans' },
    borderRadius: { sm: '0.5rem', md: '0.75rem', lg: '1rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgb(124 58 237 / 0.1)',
      md: '0 4px 14px 0 rgb(124 58 237 / 0.15)',
      lg: '0 20px 40px -4px rgb(124 58 237 / 0.2)',
    },
  },
  {
    name: 'dark-mode',
    description: 'Dark-first design system with high contrast',
    tags: ['tailwind'],
    atmosphere: 'GitHub at midnight.',
    colors: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
      accent: '#38bdf8',
      background: '#0f172a',
      foreground: '#f1f5f9',
      muted: '#1e293b',
      border: '#334155',
    },
    fonts: { sans: 'Geist', mono: 'Geist Mono' },
    borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem', full: '9999px' },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.4)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.6)',
    },
  },
  {
    name: 'glassmorphism',
    description: 'Frosted glass panels with blurred translucent surfaces',
    tags: ['tailwind'],
    atmosphere: 'macOS Big Sur screensaver vibes.',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      foreground: '#ffffff',
      muted: 'rgba(255,255,255,0.1)',
      border: 'rgba(255,255,255,0.2)',
    },
    fonts: { sans: 'SF Pro Display', mono: 'SF Mono' },
    borderRadius: { sm: '0.75rem', md: '1rem', lg: '1.5rem', full: '9999px' },
    shadows: {
      sm: '0 2px 8px 0 rgba(31,38,135,0.15)',
      md: '0 8px 32px 0 rgba(31,38,135,0.2)',
      lg: '0 16px 48px 0 rgba(31,38,135,0.3)',
    },
  },
  {
    name: 'retro',
    description: 'Nostalgic 80s/90s terminal and pixel aesthetic',
    tags: ['plain'],
    atmosphere: 'Oregon Trail boot screen.',
    colors: {
      primary: '#00ff41',
      secondary: '#008f11',
      accent: '#ffff00',
      background: '#0d0208',
      foreground: '#00ff41',
      muted: '#003b00',
      border: '#00ff41',
    },
    fonts: { sans: 'VT323', mono: 'Share Tech Mono', heading: 'Press Start 2P' },
    borderRadius: { sm: '0', md: '0', lg: '0', full: '0' },
    shadows: {
      sm: '2px 2px 0 #00ff41',
      md: '4px 4px 0 #00ff41',
      lg: '6px 6px 0 #00ff41',
    },
  },
  {
    name: 'brutalist',
    description: 'Raw, stark design with thick borders and stark contrast',
    tags: ['plain', 'tailwind'],
    atmosphere: 'Swiss International Typographic Style meets 2000s flash sites.',
    colors: {
      primary: '#000000',
      secondary: '#1a1a1a',
      accent: '#ff0000',
      background: '#ffffff',
      foreground: '#000000',
      muted: '#f0f0f0',
      border: '#000000',
    },
    fonts: { sans: 'Space Grotesk', mono: 'Space Mono', heading: 'Space Grotesk' },
    borderRadius: { sm: '0', md: '0', lg: '0', full: '0' },
    shadows: {
      sm: '3px 3px 0 #000',
      md: '5px 5px 0 #000',
      lg: '8px 8px 0 #000',
    },
  },
  {
    name: 'soft-ui',
    description: 'Neumorphic design with soft shadows and gentle gradients',
    tags: ['tailwind', 'plain'],
    atmosphere: 'Squeaky clean. Like fresh laundry.',
    colors: {
      primary: '#6c63ff',
      secondary: '#5a52d5',
      accent: '#ff6584',
      background: '#e0e5ec',
      foreground: '#3d4454',
      muted: '#edf0f5',
      border: '#d1d9e6',
    },
    fonts: { sans: 'Nunito', mono: 'Fira Code' },
    borderRadius: { sm: '0.5rem', md: '1rem', lg: '1.5rem', full: '9999px' },
    shadows: {
      sm: '3px 3px 6px #b8bec7, -3px -3px 6px #ffffff',
      md: '6px 6px 12px #b8bec7, -6px -6px 12px #ffffff',
      lg: '10px 10px 20px #b8bec7, -10px -10px 20px #ffffff',
    },
  },
  {
    name: 'neon',
    description: 'Electric neon colors on dark backgrounds, cyberpunk aesthetic',
    tags: ['tailwind'],
    atmosphere: 'Blade Runner 2049 city at 3 AM.',
    colors: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ffff00',
      background: '#0a0a0f',
      foreground: '#e0e0ff',
      muted: '#111120',
      border: '#ff00ff',
    },
    fonts: { sans: 'Orbitron', mono: 'Share Tech Mono', heading: 'Orbitron' },
    borderRadius: { sm: '0.125rem', md: '0.25rem', lg: '0.5rem', full: '9999px' },
    shadows: {
      sm: '0 0 5px #ff00ff, 0 0 10px #ff00ff',
      md: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff',
      lg: '0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 80px #ff00ff',
    },
  },
  {
    name: 'ocean',
    description: 'Calming ocean-inspired blues and teals with flowing layouts',
    tags: ['tailwind'],
    atmosphere: 'Deep water. Calm and infinite.',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#14b8a6',
      background: '#f0f9ff',
      foreground: '#0c4a6e',
      muted: '#e0f2fe',
      border: '#bae6fd',
    },
    fonts: { sans: 'DM Sans', mono: 'DM Mono', heading: 'DM Serif Display' },
    borderRadius: { sm: '0.5rem', md: '1rem', lg: '2rem', full: '9999px' },
    shadows: {
      sm: '0 1px 3px 0 rgb(14 165 233 / 0.15)',
      md: '0 4px 16px 0 rgb(14 165 233 / 0.2)',
      lg: '0 16px 40px -4px rgb(14 165 233 / 0.25)',
    },
  },
];

// ── Registry helpers ─────────────────────────────────────────────────────────

/** Returns all registered skills */
export function getAllSkills(): Skill[] {
  return skills;
}

/** Finds a skill by exact name (case-insensitive) */
export function getSkill(name: string): Skill | undefined {
  return skills.find((s) => s.name.toLowerCase() === name.toLowerCase());
}

/** Returns all skill names */
export function getSkillNames(): string[] {
  return skills.map((s) => s.name);
}

/** Converts a Skill into a JSON blob suitable for writing to .stylekit/ */
export function skillToJson(skill: Skill): string {
  return JSON.stringify(skill, null, 2);
}

/** Generates a Tailwind theme extension block from a skill */
export function skillToTailwindTheme(skill: Skill): string {
  return `// tailwind.config.js — theme extension generated by StyleKit (skill: ${skill.name})
module.exports = {
  theme: {
    extend: {
      colors: {
        primary:    '${skill.colors.primary}',
        secondary:  '${skill.colors.secondary}',
        accent:     '${skill.colors.accent}',
        background: '${skill.colors.background}',
        foreground: '${skill.colors.foreground}',
        muted:      '${skill.colors.muted}',
        border:     '${skill.colors.border}',
      },
      fontFamily: {
        sans:    ['${skill.fonts.sans}', 'sans-serif'],
        mono:    ['${skill.fonts.mono}', 'monospace'],
        heading: ['${skill.fonts.heading ?? skill.fonts.sans}', 'sans-serif'],
      },
      borderRadius: {
        sm:   '${skill.borderRadius.sm}',
        md:   '${skill.borderRadius.md}',
        lg:   '${skill.borderRadius.lg}',
        full: '${skill.borderRadius.full}',
      },
      boxShadow: {
        sm: '${skill.shadows.sm}',
        md: '${skill.shadows.md}',
        lg: '${skill.shadows.lg}',
      },
    },
  },
};`;
}
