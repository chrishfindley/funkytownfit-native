/**
 * LonghornSilhouette — clean SVG longhorn steer head for splash screen & branding.
 * Uses react-native-svg (bundled with Expo SDK).
 * Replace with a designer asset when ready — just swap the path data below.
 */
import React from 'react';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';

interface Props {
  size?: number;       // controls width; height is proportional
  color?: string;      // fill color (white by default)
  bgColor?: string;    // used for nostril "holes" — should match background
}

export default function LonghornSilhouette({
  size    = 160,
  color   = '#FFFFFF',
  bgColor = '#0C0C0C',
}: Props) {
  // All coordinates designed for a 220×160 viewBox
  const vw = 220;
  const vh = 160;
  const h  = (size / vw) * vh;

  return (
    <Svg width={size} height={h} viewBox={`0 0 ${vw} ${vh}`}>
      <G>
        {/*
         * ── Left horn ──────────────────────────────────────────────────────
         * Tapered horn: wide thick stroke at the base, thinning toward tip.
         * Two overlapping paths create a convincing taper without a filled path.
         */}
        <Path
          d="M 74 62 Q 40 30 10 16"
          stroke={color}
          strokeWidth={18}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M 66 68 Q 36 44 14 30"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
        />

        {/*
         * ── Right horn ─────────────────────────────────────────────────────
         */}
        <Path
          d="M 146 62 Q 180 30 210 16"
          stroke={color}
          strokeWidth={18}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M 154 68 Q 184 44 206 30"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
        />

        {/*
         * ── Head — three overlapping ellipses create a natural shape ───────
         * Top oval: wide and short (forehead / brow)
         * Main oval: taller (muzzle area)
         * Seam cover: blends horn attachment points into the head
         */}
        {/* Seam cover — hides the gap between horn strokes and head */}
        <Ellipse cx="110" cy="68" rx="46" ry="20" fill={color} />
        {/* Main head */}
        <Ellipse cx="110" cy="100" rx="44" ry="52" fill={color} />
        {/* Brow ridge — widens the top slightly */}
        <Ellipse cx="110" cy="74" rx="40" ry="18" fill={color} />

        {/*
         * ── Ears — small rounded shapes between horns and head ─────────────
         */}
        <Ellipse cx="78"  cy="66" rx="10" ry="13" fill={color} transform="rotate(-18 78 66)" />
        <Ellipse cx="142" cy="66" rx="10" ry="13" fill={color} transform="rotate(18 142 66)" />

        {/*
         * ── Nostrils — punched out using the background color ─────────────
         */}
        <Circle cx="96"  cy="132" r="7"  fill={bgColor} />
        <Circle cx="124" cy="132" r="7"  fill={bgColor} />
      </G>
    </Svg>
  );
}
