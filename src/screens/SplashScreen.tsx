import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme';

const { width } = Dimensions.get('window');

interface Props {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: Props) {
  const insets = useSafeAreaInsets();

  // ── Animation values ──────────────────────────────────────────────────────
  const glowOpacity  = useRef(new Animated.Value(0)).current;
  const glowScale    = useRef(new Animated.Value(0.4)).current;
  const logoOpacity  = useRef(new Animated.Value(0)).current;
  const logoScale    = useRef(new Animated.Value(0.6)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const pillOpacity  = useRef(new Animated.Value(0)).current;
  const star1Rot     = useRef(new Animated.Value(0)).current;
  const star2Scale   = useRef(new Animated.Value(0.7)).current;
  const exitOpacity  = useRef(new Animated.Value(1)).current;
  const accentLine1  = useRef(new Animated.Value(0)).current;
  const accentLine2  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ── Entry sequence ─────────────────────────────────────────────────────
    Animated.sequence([
      // 1) Glow blob blooms
      Animated.parallel([
        Animated.timing(glowOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.spring(glowScale,   { toValue: 1, damping: 12, stiffness: 70, useNativeDriver: true }),
      ]),
      // 2) Logo springs in
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.spring(logoScale,   { toValue: 1, damping: 9, stiffness: 120, useNativeDriver: true }),
      ]),
      // 3) Accent lines sweep in
      Animated.parallel([
        Animated.timing(accentLine1, { toValue: 1, duration: 300, useNativeDriver: false }),
        Animated.timing(accentLine2, { toValue: 1, duration: 300, delay: 80, useNativeDriver: false }),
      ]),
      // 4) Tagline + pill fade in
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(pillOpacity,    { toValue: 1, duration: 400, delay: 120, useNativeDriver: true }),
      ]),
    ]).start();

    // ── Star / sparkle loops ───────────────────────────────────────────────
    Animated.loop(
      Animated.sequence([
        Animated.timing(star1Rot, { toValue: 1, duration: 4500, useNativeDriver: true }),
        Animated.timing(star1Rot, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(star2Scale, { toValue: 1.35, duration: 1800, useNativeDriver: true }),
        Animated.timing(star2Scale, { toValue: 0.65, duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    // ── Auto-exit after 2.7s ──────────────────────────────────────────────
    const timer = setTimeout(() => {
      Animated.timing(exitOpacity, { toValue: 0, duration: 400, useNativeDriver: true })
        .start(() => onComplete());
    }, 2700);

    return () => clearTimeout(timer);
  }, []);

  const spin     = star1Rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const line1W   = accentLine1.interpolate({ inputRange: [0, 1], outputRange: [0, 52] });
  const line2W   = accentLine2.interpolate({ inputRange: [0, 1], outputRange: [0, 52] });

  return (
    <Animated.View style={[styles.root, { opacity: exitOpacity }]}>
      {/* ── Fort Worth morning skyline background ─────────────────────── */}
      {/* Replace fw-skyline-morning.jpg with a real FW morning skyline photo */}
      <ImageBackground
        source={require('../../assets/mobilebg.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        imageStyle={{ opacity: 0.22 }}
      />
      {/* Dark overlay to keep text readable */}
      <View style={styles.skylineOverlay} />

      {/* ── Background glow orb ────────────────────────────────────────── */}
      <Animated.View style={[
        styles.glowOrb,
        { opacity: Animated.multiply(glowOpacity, new Animated.Value(0.07)), transform: [{ scale: glowScale }] },
      ]} />
      {/* Second, tighter glow ring */}
      <Animated.View style={[
        styles.glowOrbInner,
        { opacity: Animated.multiply(glowOpacity, new Animated.Value(0.10)), transform: [{ scale: glowScale }] },
      ]} />

      {/* ── Corner sparkles ────────────────────────────────────────────── */}
      <Animated.Text style={[styles.sparkleTL, { transform: [{ rotate: spin }] }]}>✦</Animated.Text>
      <Animated.Text style={[styles.sparkleTR, { transform: [{ scale: star2Scale }] }]}>✦</Animated.Text>
      <Animated.Text style={[styles.sparkleBL, { transform: [{ scale: star2Scale }] }]}>✦</Animated.Text>
      <Animated.Text style={[styles.sparkleBR, { transform: [{ rotate: spin }] }]}>✦</Animated.Text>
      {/* Extra small dots */}
      <Animated.Text style={[styles.dotA, { opacity: pillOpacity }]}>·</Animated.Text>
      <Animated.Text style={[styles.dotB, { opacity: taglineOpacity }]}>·</Animated.Text>

      {/* ── Main logo block ────────────────────────────────────────────── */}
      <Animated.View style={[
        styles.logoBlock,
        { opacity: logoOpacity, transform: [{ scale: logoScale }] },
      ]}>
        {/* Location pre-tag */}
        <Text style={styles.preTag}>📍  FORT WORTH, TEXAS</Text>

        {/* Stacked wordmark */}
        <View style={styles.wordStack}>
          <Text style={styles.wordFunky}>FUNKY</Text>

          {/* TOWN with orange glow */}
          <Text style={styles.wordTown}>TOWN</Text>

          {/* FIT row with expanding accent lines */}
          <View style={styles.fitRow}>
            <Animated.View style={[styles.fitLine, { width: line1W }]} />
            <Text style={styles.wordFit}>FIT</Text>
            <Animated.View style={[styles.fitLine, { width: line2W }]} />
          </View>
        </View>
      </Animated.View>

      {/* ── Tagline ────────────────────────────────────────────────────── */}
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Let's get Funkytown Fit!
      </Animated.Text>

      {/* ── Bottom badge ───────────────────────────────────────────────── */}
      <Animated.View style={[
        styles.bottomBadge,
        { opacity: pillOpacity, bottom: Math.max(insets.bottom + 24, 48) },
      ]}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>COWTOWN'S FITNESS APP</Text>
        <View style={styles.badgeDot} />
      </Animated.View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Glow orbs ────────────────────────────────────────────────────────────
  glowOrb: {
    position: 'absolute',
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundColor: colors.orange,
  },
  glowOrbInner: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.orange,
  },

  // ── Sparkles ──────────────────────────────────────────────────────────────
  sparkleTL: { position: 'absolute', top: 88,  left: 34,  fontSize: 28, color: colors.orange, opacity: 0.55 },
  sparkleTR: { position: 'absolute', top: 130, right: 44, fontSize: 18, color: colors.orange, opacity: 0.38 },
  sparkleBL: { position: 'absolute', bottom: 170, left: 52, fontSize: 16, color: colors.orange, opacity: 0.30 },
  sparkleBR: { position: 'absolute', bottom: 150, right: 36, fontSize: 22, color: colors.orange, opacity: 0.46 },
  dotA: { position: 'absolute', top: 210, right: 28, fontSize: 36, color: colors.orange, opacity: 0.2 },
  dotB: { position: 'absolute', bottom: 280, left: 28, fontSize: 36, color: colors.orange, opacity: 0.2 },

  // ── Logo ─────────────────────────────────────────────────────────────────
  logoBlock: {
    alignItems: 'center',
    marginBottom: 36,
  },
  preTag: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.orange,
    letterSpacing: 2.8,
    marginBottom: 22,
    opacity: 0.88,
  },
  wordStack: {
    alignItems: 'center',
  },
  wordFunky: {
    fontSize: 76,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -3,
    lineHeight: 76,
  },
  wordTown: {
    fontSize: 76,
    fontWeight: '900',
    color: colors.orange,
    letterSpacing: -3,
    lineHeight: 76,
    // Native text shadow for the glow effect
    textShadowColor: colors.orange,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 28,
  },
  fitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
  },
  fitLine: {
    height: 2,
    backgroundColor: colors.orange,
    opacity: 0.5,
    borderRadius: 1,
  },
  wordFit: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 12,
    opacity: 0.6,
  },

  // ── Skyline overlay ───────────────────────────────────────────────────────
  skylineOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,8,6,0.55)',
  },

  // ── Tagline ───────────────────────────────────────────────────────────────
  tagline: {
    fontSize: 22,
    fontWeight: '800',
    color: 'rgba(240,236,228,0.75)',
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 30,
  },

  // ── Bottom badge ──────────────────────────────────────────────────────────
  bottomBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.orangeBorder,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: colors.orangeDim,
  },
  badgeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.orange,
    opacity: 0.7,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.orange,
    letterSpacing: 2,
  },
});
