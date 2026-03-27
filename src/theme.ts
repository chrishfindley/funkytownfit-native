// Funkytown Fit — Design System
// Sand Supply Co. aesthetic: PURE neutral black · bright white · Texas fire orange
// Rule: bg is true neutral black (no warm/brown cast). Orange accent only. White = all content.

export const colors = {
  // ── Backgrounds — pure neutral, zero warm undertone ─────────────────────────
  bg:               '#0C0C0C',   // true near-black — no brown, no blue, no warm cast
  bgSecondary:      '#101010',   // slightly raised (headers, sheets)
  card:             '#141414',   // card surface — almost same as bg, just barely lifted
  cardElevated:     '#1A1A1A',   // raised / focused state
  cardBorder:       '#222222',   // neutral grey outline — clean and crisp
  cardBorderBright: '#2E2E2E',   // active / hover border

  // ── Brand accent — use sparingly ─────────────────────────────────────────────
  orange:        '#F97316',   // THE one accent color
  orangeLight:   '#FB9A4B',   // lighter variant for gradients/chips
  orangeDim:     'rgba(249,115,22,0.10)',
  orangeBorder:  'rgba(249,115,22,0.22)',
  orangeGlow:    'rgba(249,115,22,0.12)',
  amber:         '#D4821A',
  gold:          '#C9981F',
  rust:          '#B85C1A',

  // ── Text — high contrast ──────────────────────────────────────────────────────
  textPrimary:   '#FFFFFF',   // pure bright white — maximum contrast
  textSecondary: '#8A8A8A',   // neutral mid-grey (no warm undertone)
  textMuted:     '#484848',   // dark grey for labels / placeholders
  textInverse:   '#0C0C0C',   // text on orange CTA buttons

  // ── Utility / semantic ────────────────────────────────────────────────────────
  green:         '#22C55E',
  greenDim:      'rgba(34,197,94,0.12)',
  greenBorder:   'rgba(34,197,94,0.22)',
  red:           '#EF4444',
  redDim:        'rgba(239,68,68,0.12)',
  blue:          '#3B82F6',
  blueDim:       'rgba(59,130,246,0.12)',
  spotify:       '#1DB954',

  // ── Shadows ───────────────────────────────────────────────────────────────────
  shadow:        '#000000',

  // ── Macro category colors (functional — keep visually distinct) ───────────────
  calorie:  '#F97316',   // orange
  protein:  '#3B82F6',   // blue
  carbs:    '#22C55E',   // green
  fat:      '#F59E0B',   // amber
};

export const spacing = {
  xs: 4, sm: 8, md: 14, lg: 20, xl: 28, xxl: 44,
};

export const radius = {
  xs: 6, sm: 10, md: 16, lg: 22, xl: 30, full: 9999,
};

export const typography = {
  display:   { fontSize: 52, fontWeight: '900' as const, color: colors.textPrimary, letterSpacing: -1.5 },
  displaySm: { fontSize: 36, fontWeight: '900' as const, color: colors.textPrimary, letterSpacing: -0.8 },
  h1:        { fontSize: 28, fontWeight: '800' as const, color: colors.textPrimary, letterSpacing: -0.4 },
  h2:        { fontSize: 22, fontWeight: '700' as const, color: colors.textPrimary, letterSpacing: -0.2 },
  h3:        { fontSize: 17, fontWeight: '700' as const, color: colors.textPrimary },
  body:      { fontSize: 15, fontWeight: '400' as const, color: colors.textPrimary, lineHeight: 23 },
  bodyMd:    { fontSize: 14, fontWeight: '400' as const, color: colors.textSecondary, lineHeight: 21 },
  bodySm:    { fontSize: 12, fontWeight: '400' as const, color: colors.textSecondary, lineHeight: 18 },
  label:     { fontSize: 10, fontWeight: '700' as const, color: colors.textMuted, letterSpacing: 1.4, textTransform: 'uppercase' as const },
  button:    { fontSize: 16, fontWeight: '800' as const, letterSpacing: 0.3 as const },
};

// Standard card — same near-black as the bg, only a subtle grey border distinguishes it
export const cardStyle = {
  backgroundColor: colors.card,
  borderRadius:    radius.lg,
  borderWidth:     1,
  borderColor:     colors.cardBorder,
  padding:         spacing.lg,
  shadowColor:     '#000000',
  shadowOffset:    { width: 0, height: 1 },
  shadowOpacity:   0.25,
  shadowRadius:    6,
  elevation:       3,
};

// Hero card — the single most important card on a screen (orange border only, no glow)
export const heroCardStyle = {
  ...cardStyle,
  borderColor:   colors.orangeBorder,
  shadowOpacity: 0.08,
};

// Accent section label — spaced caps, muted grey
export const sectionLabel = {
  fontSize: 11,
  fontWeight: '700' as const,
  color: colors.textMuted,
  letterSpacing: 1.6,
  textTransform: 'uppercase' as const,
};
