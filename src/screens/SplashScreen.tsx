import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LonghornSilhouette from '../components/LonghornSilhouette';

// ── Design tokens (standalone — no theme import so splash renders immediately)
const BG     = '#0C0C0C';
const WHITE  = '#FFFFFF';
const ORANGE = '#F97316';

interface Props { onComplete: () => void; }

export default function SplashScreen({ onComplete }: Props) {

  // ── One Animated.Value per element
  const ftO   = useRef(new Animated.Value(0)).current;  // FUNKYTOWN
  const ftY   = useRef(new Animated.Value(28)).current;
  const fitO  = useRef(new Animated.Value(0)).current;  // FIT
  const fitY  = useRef(new Animated.Value(28)).current;
  const iconO = useRef(new Animated.Value(0)).current;  // steer + location
  const iconY = useRef(new Animated.Value(18)).current;
  const exitO = useRef(new Animated.Value(1)).current;

  function pop(o: Animated.Value, y: Animated.Value) {
    return Animated.parallel([
      Animated.timing(o, { toValue: 1, duration: 240, useNativeDriver: true }),
      Animated.spring(y, { toValue: 0, damping: 18, stiffness: 220, useNativeDriver: true }),
    ]);
  }

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),       // blank screen — let eyes settle
      pop(ftO, ftY),             // FUNKYTOWN — white
      Animated.delay(380),       // intentional beat
      pop(fitO, fitY),           // FIT — orange
      Animated.delay(460),       // beat
      pop(iconO, iconY),         // steer + FORT WORTH, TX
      Animated.delay(1500),      // hold so everything reads
    ]).start(() => {
      Animated.timing(exitO, { toValue: 0, duration: 420, useNativeDriver: true })
        .start(() => onComplete());
    });
  }, []);

  return (
    <Animated.View style={[styles.root, { opacity: exitO }]}>

      {/* ── Wordmark: FUNKYTOWN (white) + FIT (orange), stacked tight ─────── */}
      <View style={styles.wordmark}>
        <Animated.Text style={[styles.funkytown, { opacity: ftO, transform: [{ translateY: ftY }] }]}>
          FUNKYTOWN
        </Animated.Text>
        <Animated.Text style={[styles.fit, { opacity: fitO, transform: [{ translateY: fitY }] }]}>
          FIT
        </Animated.Text>
      </View>

      {/* ── Steer + location ──────────────────────────────────────────────── */}
      <Animated.View style={[styles.footer, { opacity: iconO, transform: [{ translateY: iconY }] }]}>
        <LonghornSilhouette size={80} color={WHITE} bgColor={BG} />
        <View style={styles.locationRow}>
          <View style={styles.locationLine} />
          <Text style={styles.location}>FORT WORTH, TX</Text>
          <View style={styles.locationLine} />
        </View>
      </Animated.View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Wordmark ─────────────────────────────────────────────────────────────
  wordmark: {
    alignItems: 'center',
    gap: 0,           // zero gap — FIT sits flush under FUNKYTOWN
  },
  funkytown: {
    fontSize: 72,
    fontWeight: '900',
    color: WHITE,
    letterSpacing: -2.5,
    lineHeight: 74,
  },
  fit: {
    fontSize: 72,
    fontWeight: '900',
    color: ORANGE,
    letterSpacing: -2.5,
    lineHeight: 70,   // slightly tighter so they feel like one word
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 96,
    alignItems: 'center',
    gap: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationLine: {
    width: 28,
    height: 1,
    backgroundColor: ORANGE,
    opacity: 0.45,
  },
  location: {
    fontSize: 11,
    fontWeight: '700',
    color: ORANGE,
    letterSpacing: 3.5,
  },
});
