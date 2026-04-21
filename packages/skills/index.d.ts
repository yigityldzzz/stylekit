export interface SkillPreview {
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
}

export interface TextTokens {
  primary: string;
  secondary: string;
  muted: string;
  [key: string]: string;
}

export interface SemanticTokens {
  success: string;
  warning: string;
  error: string;
  info: string;
  [key: string]: string;
}

export interface ColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  border: string;
  text: TextTokens;
  semantic: SemanticTokens;
  [key: string]: unknown;
}

export interface TypographyTokens {
  fontFamily: {
    sans?: string[];
    mono?: string[];
    display?: string[];
    [key: string]: string[] | undefined;
  };
  fontSize: Record<string, string>;
  fontWeight: Record<string, number>;
  lineHeight: Record<string, number>;
  [key: string]: unknown;
}

export interface SpacingTokens {
  base: string;
  scale: number[];
}

export interface MotionTokens {
  duration: {
    fast: string;
    normal: string;
    slow: string;
    [key: string]: string;
  };
  easing: {
    default: string;
    [key: string]: string;
  };
}

export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  motion: MotionTokens;
  [key: string]: unknown;
}

export interface Skill {
  name: string;
  version: string;
  description: string;
  tags: string[];
  preview: SkillPreview;
  tokens: DesignTokens;
  tailwind?: {
    extend?: Record<string, unknown>;
    [key: string]: unknown;
  };
  designMd?: string;
}

export interface SkillSummary {
  name: string;
  version: string;
  description: string;
  tags: string[];
  preview: SkillPreview;
}

export declare const skills: Skill[];
export declare const skillsMap: Record<string, Skill>;

export declare function getSkill(name: string): Skill | null;
export declare function listSkills(): SkillSummary[];

export declare const minimal: Skill;
export declare const corporate: Skill;
export declare const startup: Skill;
export declare const darkMode: Skill;
export declare const glassmorphism: Skill;
export declare const retro: Skill;
export declare const brutalist: Skill;
export declare const softUi: Skill;
export declare const neon: Skill;
export declare const ocean: Skill;
