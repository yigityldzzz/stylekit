// Core type definitions for StyleKit CLI

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

export interface FontConfig {
  sans: string;
  mono: string;
  heading?: string;
}

export interface BorderRadius {
  sm: string;
  md: string;
  lg: string;
  full: string;
}

export interface Shadows {
  sm: string;
  md: string;
  lg: string;
}

export interface Skill {
  name: string;
  description: string;
  tags: SkillTag[];
  colors: ColorPalette;
  fonts: FontConfig;
  borderRadius: BorderRadius;
  shadows: Shadows;
  atmosphere: string; // one-liner mood description
}

export type SkillTag = 'tailwind' | 'bootstrap' | 'plain';

export interface DesignConfig {
  projectName: string;
  primaryColor: string;
  fontFamily: string;
  stylePreference: StylePreference;
  generatedAt: string;
  skill?: string;
}

export type StylePreference =
  | 'minimal'
  | 'corporate'
  | 'startup'
  | 'dark-mode'
  | 'glassmorphism'
  | 'retro'
  | 'brutalist'
  | 'soft-ui'
  | 'neon'
  | 'ocean';

export interface InitAnswers {
  projectName: string;
  primaryColor: string;
  fontFamily: string;
  stylePreference: StylePreference;
}
