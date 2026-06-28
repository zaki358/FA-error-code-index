/** デザイントークン — DESIGN.md の値を TypeScript 定数化。hex 直書き禁止、ここのみ参照。 */

export const colors = {
  // Brand
  primary: "#cc785c",
  primaryActive: "#a9583e",
  primaryDisabled: "#e6dfd8",
  accentTeal: "#5db8a6",
  accentAmber: "#e8a55a",

  // Surface
  canvas: "#faf9f5",
  surfaceSoft: "#f5f0e8",
  surfaceCard: "#efe9de",
  surfaceCreamStrong: "#e8e0d2",
  surfaceDark: "#181715",
  surfaceDarkElevated: "#252320",
  surfaceDarkSoft: "#1f1e1b",
  hairline: "#e6dfd8",
  hairlineSoft: "#ebe6df",

  // Text
  ink: "#141413",
  bodyStrong: "#252523",
  body: "#3d3d3a",
  muted: "#6c6a64",
  mutedSoft: "#8e8b82",
  onPrimary: "#ffffff",
  onDark: "#faf9f5",
  onDarkSoft: "#a09d96",

  // Semantic
  success: "#5db872",
  warning: "#d4a017",
  error: "#c64545",
} as const;

export const typography = {
  displaySm: {
    fontFamily: "'EB Garamond', 'Cormorant Garamond', Garamond, Georgia, serif",
    fontSize: "28px",
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: "-0.3px",
  },
  titleMd: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: "0",
  },
  titleSm: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "16px",
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: "0",
  },
  bodyMd: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: 1.55,
    letterSpacing: "0",
  },
  bodySm: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: 1.55,
    letterSpacing: "0",
  },
  caption: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: "0",
  },
  captionUppercase: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
  },
  code: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: "0",
  },
  button: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: 1.0,
    letterSpacing: "0",
  },
  navLink: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: "0",
  },
} as const;

export const spacing = {
  xxs: "4px",
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
  section: "96px",
} as const;

export const rounded = {
  xs: "4px",
  sm: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  pill: "9999px",
  full: "50%",
} as const;
