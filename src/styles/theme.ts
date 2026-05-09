import 'styled-components';

// Single source of truth for design tokens. Used via the styled-components
// ThemeProvider, so every styled component can read `props.theme.*`.
export const theme = {
  colors: {
    bg: '#0f1115',
    surface: '#171a21',
    surfaceAlt: '#1f232c',
    border: '#2a2f3a',
    borderStrong: '#3a4150',
    text: '#e6e8ee',
    textMuted: '#9aa3b2',
    accent: '#7c5cff',
    accentHover: '#9077ff',
    accentSoft: 'rgba(124, 92, 255, 0.15)',
    danger: '#ef4444',
    success: '#22c55e',
    warn: '#f59e0b',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    pill: '999px',
  },
  shadow: {
    sm: '0 2px 6px rgba(0,0,0,0.25)',
    md: '0 8px 24px rgba(0,0,0,0.35)',
    accent: '0 0 0 3px rgba(124, 92, 255, 0.35)',
  },
  // Mobile-first breakpoint helpers; used as `@media ${theme.bp.tablet}`.
  bp: {
    tablet: '(min-width: 640px)',
    desktop: '(min-width: 1024px)',
  },
  layout: {
    maxWidth: '1200px',
    headerHeight: '64px',
  },
} as const;

export type AppTheme = typeof theme;

// Augment styled-components' DefaultTheme so `props.theme` is typed.
declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
