// Funkytown Fit — Design System
// Deep slate · Texas fire orange · Warm cream — v2

export const colors = {
  // ── Backgrounds ────────────────────────────────────────────────────────────
  bg:            '#0F1117',   // near-black slate (deeper than before)
  bgSecondary:   '#161921',   // header / elevated sections
  card:          '#1C1F2E',   // card surface
  cardElevated:  '#22263A',   // raised / focused card
  cardBorder:    '#2A2E45',   // subtle border
  cardBorderBright: '#3A3F5C', // hover / active border

  // ── Brand accent ───────────────────────────────────────────────────────────
  orange:        '#F97316',   // primary brand
  orangeLight:   '#FB9A4B',   // lighter orange for gradients / highlights
  orangeDim:     'rgba(249,115,22,0.12)',
  orangeBorder:  'rgba(249,115,22,0.28)',
  orangeGlow:    'rgba(249,115,22,0.18)',  // use as shadowColor on dark bg
  amber:         '#D4821A',
  gold:          '#C9981F',
  rust:          '#B85C1A',

  // ── Text ───────────────────────────────────────────────────────────────────
  textPrimary:   '#F0ECE4',   // warm off-white (not harsh pure white)
  textSecondary: '#8A90A8',   // secondary info
  textMuted:     '#474D68',   // labels, placeholders
  textInverse:   '#0F1117',   // text on orange buttons

  // ── Utility ────────────────────────────────────────────────────────────────
  green:         '#22C55E',
  greenDim:      'rgba(34,197,94,0.12)',
  greenBorder:   'rgba(34,197,94,0.25)',
  red:           '#EF4444',
  redDim:        'rgba(239,68,68,0.12)',
  blue:          '#3B82F6',
  blueDim:       'rgba(59,130,246,0.12)',
  spotify:       '#1DB954',

  // ── Shadows ────────────────────────────────────────────────────────────────
  shadow:        '#000000',   // keep for backward compat

  // ── Macro ──────────────────────────────────────────────────────────────────
  calorie:  '#F97316',
  protein:  '#3B82F6',
  carbs:    '#22C55E',
  fat:      '#F59E0B',
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

// Card with orange glow — the "elevated" treatment for dark UI
export const cardStyle = {
  backgroundColor: colors.card,
  borderRadius:    radius.lg,
  borderWidth:     1,
  borderColor:     colors.cardBorder,
  padding:         spacing.lg,
  // On dark backgrounds, use a colored glow instead of black shadow
  shadowColor:     colors.orange,
  shadowOffset:    { width: 0, height: 0 },
  shadowOpacity:   0.08,
  shadowRadius:    12,
  elevation:       4,
};

// Accent section label — left orange bar + spaced caps
export const sectionLabel = {
  fontSize: 11,
  fontWeight: '700' as const,
  color: colors.textMuted,
  letterSpacing: 1.6,
  textTransform: 'uppercase' as const,
};
