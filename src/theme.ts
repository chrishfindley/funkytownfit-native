// Funkytown Fit — Design System
// Sand Supply Co. aesthetic: warm near-black · crisp white · Texas fire orange
// White is the primary text color. Orange is the single accent. No blue undertones.

export const colors = {
  // ── Backgrounds ────────────────────────────────────────────────────────────
  bg:               '#0A0806',   // warm deep black — the foundation
  bgSecondary:      '#0F0D0A',   // slightly elevated (headers, modals)
  card:             '#161210',   // card surface
  cardElevated:     '#1E1A16',   // raised / focused card
  cardBorder:       '#2C2520',   // subtle warm border
  cardBorderBright: '#3C3530',   // active / hover border

  // ── Brand accent ───────────────────────────────────────────────────────────
  orange:        '#F97316',   // THE accent — use sparingly
  orangeLight:   '#FB9A4B',   // lighter for gradients
  orangeDim:     'rgba(249,115,22,0.10)',
  orangeBorder:  'rgba(249,115,22,0.22)',
  orangeGlow:    'rgba(249,115,22,0.14)',
  amber:         '#D4821A',
  gold:          '#C9981F',
  rust:          '#B85C1A',

  // ── Text ───────────────────────────────────────────────────────────────────
  textPrimary:   '#FFFFFF',   // crisp white — Sand Supply Co. style
  textSecondary: '#9E968C',   // warm gray secondary
  textMuted:     '#564E46',   // warm muted labels / placeholders
  textInverse:   '#0A0806',   // text on orange buttons

  // ── Utility ────────────────────────────────────────────────────────────────
  green:         '#22C55E',
  greenDim:      'rgba(34,197,94,0.12)',
  greenBorder:   'rgba(34,197,94,0.22)',
  red:           '#EF4444',
  redDim:        'rgba(239,68,68,0.12)',
  blue:          '#3B82F6',
  blueDim:       'rgba(59,130,246,0.12)',
  spotify:       '#1DB954',

  // ── Shadows ────────────────────────────────────────────────────────────────
  shadow:        '#000000',

  // ── Macro category colors (functional — keep distinct) ─────────────────────
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

// Standard card — clean dark surface, black shadow (no orange glow on every card)
export const cardStyle = {
  backgroundColor: colors.card,
  borderRadius:    radius.lg,
  borderWidth:     1,
  borderColor:     colors.cardBorder,
  padding:         spacing.lg,
  shadowColor:     '#000000',
  shadowOffset:    { width: 0, height: 2 },
  shadowOpacity:   0.35,
  shadowRadius:    8,
  elevation:       4,
};

// Hero card — orange glow reserved for the most important card on screen
export const heroCardStyle = {
  ...cardStyle,
  borderColor:   colors.orangeBorder,
  shadowColor:   colors.orange,
  shadowOpacity: 0.10,
  shadowRadius:  16,
};

// Accent section label — left orange bar + spaced caps
export const sectionLabel = {
  fontSize: 11,
  fontWeight: '700' as const,
  color: colors.textMuted,
  letterSpacing: 1.6,
  textTransform: 'uppercase' as const,
};
