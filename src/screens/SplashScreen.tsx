import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

// ── Design tokens (standalone — no theme import so splash renders before theme loads)
const BG     = '#0A0806';
const WHITE  = '#FFFFFF';
const ORANGE = '#F97316';

interface Props { onComplete: () => void; }

export default function SplashScreen({ onComplete }: Props) {

  // ── One Animated.Value per word + the steer/location block + exit
  const funkyO = useRef(new Animated.Value(0)).current;
  const funkyY = useRef(new Animated.Value(30)).current;
  const townO  = useRef(new Animated.Value(0)).current;
  const townY  = useRef(new Animated.Value(30)).current;
  const fitO   = useRef(new Animated.Value(0)).current;
  const fitY   = useRef(new Animated.Value(30)).current;
  const iconO  = useRef(new Animated.Value(0)).current;
  const iconY  = useRef(new Animated.Value(20)).current;
  const exitO  = useRef(new Animated.Value(1)).current;

  // ── Reusable pop-in: spring translateY + quick opacity fade
  function pop(o: Animated.Value, y: Animated.Value, targetOpacity = 1) {
    return Animated.parallel([
      Animated.timing(o, { toValue: targetOpacity, duration: 260, useNativeDriver: true }),
      Animated.spring(y, { toValue: 0, damping: 16, stiffness: 200, useNativeDriver: true }),
    ]);
  }

  useEffect(() => {
    Animated.sequence([
      Animated.delay(280),          // blank screen pause — lets eyes settle
      pop(funkyO, funkyY),          // FUNKY
      Animated.delay(420),          // intentional beat
      pop(townO, townY),            // TOWN
      Animated.delay(420),          // beat
      pop(fitO, fitY, 0.6),         // FIT (slightly dimmer — feels like a suffix)
      Animated.delay(440),          // beat
      pop(iconO, iconY),            // steer + location
      Animated.delay(1600),         // hold so it all reads
    ]).start(() => {
      // Fade the whole screen out
      Animated.timing(exitO, { toValue: 0, duration: 440, useNativeDriver: true })
        .start(() => onComplete());
    });
  }, []);

  return (
    <Animated.View style={[styles.root, { opacity: exitO }]}>

      {/* ── Stacked wordmark ───────────────────────────────────────────────── */}
      <View style={styles.wordmark}>
        <Animated.Text style={[styles.funky, { opacity: funkyO, transform: [{ translateY: funkyY }] }]}>
          FUNKY
        </Animated.Text>
        <Animated.Text style={[styles.town, { opacity: townO, transform: [{ translateY: townY }] }]}>
          TOWN
        </Animated.Text>
        <Animated.Text style={[styles.fit, { opacity: fitO, transform: [{ translateY: fitY }] }]}>
          FIT
        </Animated.Text>
      </View>

      {/* ── Steer + location ──────────────────────────────────────────────── */}
      {/* Replace 🐂 with a custom SVG longhorn steer when asset is ready    */}
      <Animated.View style={[styles.footer, { opacity: iconO, transform: [{ translateY: iconY }] }]}>
        <Text style={styles.steer}>🐂</Text>
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
  },
  funky: {
    fontSize: 86,
    fontWeight: '900',
    color: WHITE,
    letterSpacing: -3.5,
    lineHeight: 86,
  },
  town: {
    fontSize: 86,
    fontWeight: '900',
    color: ORANGE,
    letterSpacing: -3.5,
    lineHeight: 86,
    textShadowColor: ORANGE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 28,
  },
  fit: {
    fontSize: 34,
    fontWeight: '900',
    color: WHITE,
    letterSpacing: 16,
    lineHeight: 52,
    marginTop: 2,
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 88,
    alignItems: 'center',
    gap: 10,
  },
  steer: {
    fontSize: 48,
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
    opacity: 0.5,
  },
  location: {
    fontSize: 11,
    fontWeight: '700',
    color: ORANGE,
    letterSpacing: 3.5,
  },
});
