/**
 * Where To — Fort Worth
 * Sponsored by Sand Supply Co.
 *
 * Features:
 *  • Sand Supply Co. branded splash that plays on every open
 *  • AI-keyword search returning ranked results with contextual descriptions
 *  • Top result highlighted; all results tappable
 *  • Embedded Leaflet.js map (WebView) per selected place
 *  • "Surprise Me" random spin feature
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView,
  Animated, Dimensions, ActivityIndicator, Linking, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import WebView from 'react-native-webview';

import { colors, spacing, radius, typography } from '@/theme';
import {
  FWPlace, PlaceSearchResult,
  searchFWPlaces, randomFWPlace, FW_PLACES,
} from '@/data/fortWorthPlaces';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── Sand Supply Co. Splash ────────────────────────────────────────────────────

function SandSupplySplash({ onComplete }: { onComplete: () => void }) {
  const opacity      = useRef(new Animated.Value(0)).current;
  const logoScale    = useRef(new Animated.Value(0.7)).current;
  const taglineY     = useRef(new Animated.Value(20)).current;
  const taglineOp    = useRef(new Animated.Value(0)).current;
  const poweredOp    = useRef(new Animated.Value(0)).current;
  const exitOp       = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Fade in background
      Animated.timing(opacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      // Logo springs in
      Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      // Tagline slides up
      Animated.parallel([
        Animated.timing(taglineY, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(taglineOp, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      // "powered by" fades in
      Animated.timing(poweredOp, { toValue: 1, duration: 350, useNativeDriver: true }),
      // Hold for 1.3 seconds
      Animated.delay(1300),
      // Fade out entire splash
      Animated.timing(exitOp, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start(() => onComplete());
  }, []);

  return (
    <Animated.View style={[ss.splash, { opacity: exitOp }]}>
      <Animated.View style={{ opacity, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* Logo mark */}
        <Animated.View style={[ss.logoWrap, { transform: [{ scale: logoScale }] }]}>
          {/* Sand Supply Co. wordmark */}
          <View style={ss.logoIconRow}>
            <Text style={ss.logoIconEmoji}>⛰️</Text>
            <View style={ss.logoDivider} />
            <Text style={ss.logoIconEmoji}>🌾</Text>
          </View>
          <Text style={ss.logoTitle}>SAND SUPPLY CO.</Text>
          <Text style={ss.logoSubtitle}>FORT WORTH · TEXAS</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.Text
          style={[ss.tagline, { opacity: taglineOp, transform: [{ translateY: taglineY }] }]}
        >
          Where will today take you?
        </Animated.Text>

        {/* Decorative divider */}
        <Animated.View style={[ss.splashDivider, { opacity: taglineOp }]} />

        {/* Powered by */}
        <Animated.Text style={[ss.poweredBy, { opacity: poweredOp }]}>
          Discover Fort Worth — powered by Sand Supply Co.
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Leaflet Map HTML ─────────────────────────────────────────────────────────

function buildLeafletHtml(lat: number, lng: number, name: string, color: string): string {
  const markerColor = color.replace('#', '');
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0A0806; }
    #map { width: 100%; height: 100vh; }
    .custom-icon {
      background: #${markerColor};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      width: 28px; height: 28px;
      border: 3px solid #fff;
      box-shadow: 0 0 12px rgba(0,0,0,0.5);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map', {
      zoomControl: true,
      attributionControl: false,
    }).setView([${lat}, ${lng}], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    const icon = L.divIcon({
      html: '<div class="custom-icon"></div>',
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      className: '',
    });

    L.marker([${lat}, ${lng}], { icon })
      .addTo(map)
      .bindPopup('<b style="color:#${markerColor}">${name.replace(/'/g, "\\'")}</b>')
      .openPopup();
  </script>
</body>
</html>`;
}

// ─── Place Result Card ─────────────────────────────────────────────────────────

function PlaceCard({
  result, isTop, isSelected, onPress,
}: {
  result: PlaceSearchResult;
  isTop: boolean;
  isSelected: boolean;
  onPress: () => void;
}) {
  const { place, contextDescription } = result;

  return (
    <TouchableOpacity
      style={[
        s.resultCard,
        isTop  && s.resultCardTop,
        isSelected && s.resultCardSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {isTop && (
        <View style={s.topBadge}>
          <Ionicons name="star" size={9} color={colors.bg} />
          <Text style={s.topBadgeText}>BEST MATCH</Text>
        </View>
      )}

      <View style={s.cardHeader}>
        <View style={[s.cardEmoji, { backgroundColor: place.color + '22', borderColor: place.color + '55' }]}>
          <Text style={{ fontSize: 22 }}>{place.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.placeName}>{place.name}</Text>
          <Text style={[s.placeVibe, isTop && { color: place.color }]}>{place.vibe}</Text>
        </View>
        {place.workout && (
          <View style={s.workoutChip}>
            <Text style={s.workoutChipText}>{place.workout}</Text>
          </View>
        )}
      </View>

      {isTop ? (
        <Text style={s.contextDesc}>{contextDescription}</Text>
      ) : (
        <Text style={s.placeDescShort} numberOfLines={2}>{place.description}</Text>
      )}

      {isSelected && (
        <View style={s.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={14} color={colors.orange} />
          <Text style={s.selectedText}>Viewing on map</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Spin Wheel ───────────────────────────────────────────────────────────────

function SpinResult({ place, onClose }: { place: FWPlace; onClose: () => void }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opAnim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
      Animated.timing(opAnim,   { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[s.spinOverlay, { opacity: opAnim }]}>
      <Animated.View style={[s.spinCard, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity style={s.spinClose} onPress={onClose}>
          <Ionicons name="close-circle" size={28} color={colors.textMuted} />
        </TouchableOpacity>

        <Text style={s.spinLabel}>TODAY'S ADVENTURE</Text>
        <Text style={{ fontSize: 60, textAlign: 'center', marginVertical: 8 }}>{place.emoji}</Text>
        <Text style={[s.spinPlaceName, { color: place.color }]}>{place.name}</Text>
        <Text style={s.spinVibe}>{place.vibe}</Text>
        <Text style={s.spinDesc}>{place.description}</Text>

        {place.workout && (
          <View style={[s.spinWorkoutChip, { backgroundColor: place.color + '22', borderColor: place.color + '44' }]}>
            <Ionicons name="fitness" size={12} color={place.color} />
            <Text style={[s.spinWorkoutText, { color: place.color }]}>{place.workout}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[s.spinGoBtn, { backgroundColor: place.color }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(place.name + ' Fort Worth TX')}`);
          }}
        >
          <Ionicons name="navigate" size={16} color={colors.bg} />
          <Text style={s.spinGoBtnText}>Get Directions</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

// ─── Category Filter Pill ─────────────────────────────────────────────────────

const CATEGORIES = [
  { key: 'all',      label: 'All',       icon: 'apps-outline' },
  { key: 'fitness',  label: 'Fitness',   icon: 'barbell-outline' },
  { key: 'food',     label: 'Food',      icon: 'restaurant-outline' },
  { key: 'outdoors', label: 'Outdoors',  icon: 'leaf-outline' },
  { key: 'fun',      label: 'Fun',       icon: 'happy-outline' },
  { key: 'nightlife',label: 'Nights',    icon: 'moon-outline' },
  { key: 'culture',  label: 'Culture',   icon: 'color-palette-outline' },
] as const;

type CategoryKey = typeof CATEGORIES[number]['key'];
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function WhereToScreen() {
  const insets = useSafeAreaInsets();
  const nav    = useNavigation();

  const [splashDone,    setSplashDone]    = useState(false);
  const [query,         setQuery]         = useState('');
  const [results,       setResults]       = useState<PlaceSearchResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<FWPlace | null>(null);
  const [spinPlace,     setSpinPlace]     = useState<FWPlace | null>(null);
  const [categoryFilter,setCategoryFilter]= useState<CategoryKey>('all');
  const [mapLoading,    setMapLoading]    = useState(false);

  // Spin animation
  const spinAnim  = useRef(new Animated.Value(0)).current;
  const mainFadeY = useRef(new Animated.Value(30)).current;
  const mainOp    = useRef(new Animated.Value(0)).current;

  // Animate main content in after splash
  useEffect(() => {
    if (splashDone) {
      Animated.parallel([
        Animated.timing(mainOp,    { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(mainFadeY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
      // Load default results
      setResults(searchFWPlaces(''));
    }
  }, [splashDone]);

  // Re-run search when query or category changes
  useEffect(() => {
    let res = searchFWPlaces(query);
    if (categoryFilter !== 'all') {
      res = res.filter(r => r.place.category === categoryFilter);
    }
    setResults(res);
    // Clear selected if it's no longer in results
    if (selectedPlace && !res.find(r => r.place.id === selectedPlace.id)) {
      setSelectedPlace(null);
    }
  }, [query, categoryFilter]);

  function handleSpin() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Animate the spin button
    Animated.sequence([
      Animated.timing(spinAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(spinAnim, { toValue: 0, duration: 0,   useNativeDriver: true }),
    ]).start();
    // Pick random (filtered if category is set)
    const pool = categoryFilter === 'all'
      ? FW_PLACES
      : FW_PLACES.filter(p => p.category === categoryFilter);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setSpinPlace(picked);
  }

  const spinRotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  function selectPlace(place: FWPlace) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPlace(prev => prev?.id === place.id ? null : place);
    setMapLoading(true);
  }

  if (!splashDone) {
    return <SandSupplySplash onComplete={() => setSplashDone(true)} />;
  }

  return (
    <View style={[s.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <View style={[s.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => nav.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Where To?</Text>
          <View style={s.sponsorBadge}>
            <Text style={s.sponsorText}>⛰️  Powered by Sand Supply Co.</Text>
          </View>
        </View>

        {/* Spin button */}
        <TouchableOpacity style={s.spinBtn} onPress={handleSpin}>
          <Animated.View style={{ transform: [{ rotate: spinRotate }] }}>
            <Ionicons name="dice-outline" size={20} color={colors.orange} />
          </Animated.View>
          <Text style={s.spinBtnLabel}>Surprise</Text>
        </TouchableOpacity>
      </View>

      {/* ── Search Bar ── */}
      <Animated.View style={[s.searchWrap, { opacity: mainOp, transform: [{ translateY: mainFadeY }] }]}>
        <View style={s.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={s.searchInput}
            placeholder="taco with a view... sunrise run... date night..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* ── Category Filters ── */}
      <Animated.View style={{ opacity: mainOp }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterRow}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[s.filterPill, categoryFilter === cat.key && s.filterPillActive]}
              onPress={() => {
                Haptics.selectionAsync();
                setCategoryFilter(cat.key);
              }}
            >
              <Ionicons
                name={cat.icon as IoniconName}
                size={12}
                color={categoryFilter === cat.key ? colors.bg : colors.textMuted}
              />
              <Text style={[s.filterPillLabel, categoryFilter === cat.key && s.filterPillLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* ── Main content: results + map ── */}
      <Animated.View style={[{ flex: 1 }, { opacity: mainOp }]}>
        {selectedPlace ? (
          /* Map view with results list below */
          <View style={{ flex: 1 }}>
            {/* Map */}
            <View style={s.mapWrap}>
              {mapLoading && (
                <View style={s.mapLoader}>
                  <ActivityIndicator color={colors.orange} size="small" />
                </View>
              )}
              <WebView
                style={s.map}
                source={{ html: buildLeafletHtml(selectedPlace.lat, selectedPlace.lng, selectedPlace.name, selectedPlace.color) }}
                onLoadEnd={() => setMapLoading(false)}
                scrollEnabled={false}
                javaScriptEnabled
              />
              {/* Map header overlay */}
              <View style={s.mapOverlay}>
                <Text style={[s.mapPlaceName, { color: selectedPlace.color }]}>{selectedPlace.emoji}  {selectedPlace.name}</Text>
                <TouchableOpacity
                  style={s.directionsBtn}
                  onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(selectedPlace.name + ' Fort Worth TX')}`)}
                >
                  <Ionicons name="navigate-outline" size={14} color={colors.bg} />
                  <Text style={s.directionsBtnText}>Directions</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Scrollable result list below map */}
            <ScrollView style={s.resultList} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
              {results.map((result, idx) => (
                <PlaceCard
                  key={result.place.id}
                  result={result}
                  isTop={idx === 0 && query.trim().length > 0}
                  isSelected={selectedPlace?.id === result.place.id}
                  onPress={() => selectPlace(result.place)}
                />
              ))}
            </ScrollView>
          </View>
        ) : (
          /* Just the results list */
          <ScrollView style={s.resultList} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
            {results.length === 0 ? (
              <View style={s.emptyState}>
                <Text style={{ fontSize: 40 }}>🤔</Text>
                <Text style={s.emptyTitle}>Nothing matched</Text>
                <Text style={s.emptySub}>Try a different search or hit Surprise Me!</Text>
              </View>
            ) : (
              results.map((result, idx) => (
                <PlaceCard
                  key={result.place.id}
                  result={result}
                  isTop={idx === 0 && query.trim().length > 0}
                  isSelected={false}
                  onPress={() => selectPlace(result.place)}
                />
              ))
            )}
          </ScrollView>
        )}
      </Animated.View>

      {/* ── Spin Result Overlay ── */}
      {spinPlace && (
        <SpinResult place={spinPlace} onClose={() => setSpinPlace(null)} />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const ss = StyleSheet.create({
  // Splash
  splash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0B0E12',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  logoIconEmoji: {
    fontSize: 40,
  },
  logoDivider: {
    width: 1.5,
    height: 32,
    backgroundColor: 'rgba(249,115,22,0.4)',
  },
  logoTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
    textAlign: 'center',
  },
  logoSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(249,115,22,0.8)',
    letterSpacing: 4,
    marginTop: 4,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  splashDivider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(249,115,22,0.5)',
    marginVertical: 18,
  },
  poweredBy: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.40)',
    letterSpacing: 1,
    textAlign: 'center',
  },
});

const s = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    gap: spacing.sm,
  },
  backBtn: {
    padding: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  sponsorBadge: {
    backgroundColor: 'rgba(249,115,22,0.1)',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
    borderWidth: 1,
    borderColor: colors.orangeBorder,
  },
  sponsorText: {
    fontSize: 9,
    color: colors.orange,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  spinBtn: {
    alignItems: 'center',
    backgroundColor: colors.orangeDim,
    borderWidth: 1,
    borderColor: colors.orangeBorder,
    borderRadius: radius.sm,
    padding: 6,
    minWidth: 56,
  },
  spinBtnLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.orange,
    letterSpacing: 0.5,
    marginTop: 2,
  },

  // Search
  searchWrap: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bgSecondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },

  // Category filters
  filterRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 6,
    backgroundColor: colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filterPillActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  filterPillLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  filterPillLabelActive: { color: colors.bg },

  // Results list
  resultList: { flex: 1 },

  // Result card
  resultCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  resultCardTop: {
    borderColor: colors.orangeBorder,
    shadowColor: colors.orange,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  resultCardSelected: {
    borderColor: colors.orange,
    borderWidth: 1.5,
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
    backgroundColor: colors.orange,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: spacing.sm,
  },
  topBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: colors.bg,
    letterSpacing: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 8,
  },
  cardEmoji: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  placeName: { ...typography.h3, marginBottom: 1 },
  placeVibe: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  workoutChip: {
    backgroundColor: colors.orangeDim,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.orangeBorder,
  },
  workoutChipText: { fontSize: 9, fontWeight: '700', color: colors.orange },
  contextDesc: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  placeDescShort: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  selectedText: { fontSize: 11, color: colors.orange, fontWeight: '700' },

  // Map
  mapWrap: {
    height: SCREEN_H * 0.3,
    position: 'relative',
    backgroundColor: colors.bgSecondary,
  },
  map: { flex: 1, backgroundColor: 'transparent' },
  mapLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15,17,23,0.88)',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapPlaceName: { fontSize: 14, fontWeight: '800' },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.orange,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  directionsBtnText: { fontSize: 12, fontWeight: '800', color: colors.bg },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    gap: 10,
  },
  emptyTitle: { ...typography.h3 },
  emptySub: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },

  // Spin overlay
  spinOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: spacing.lg,
  },
  spinCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.xl,
    width: '100%',
    alignItems: 'center',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 20,
  },
  spinClose: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  spinLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  spinPlaceName: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  spinVibe: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  spinDesc: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 16,
  },
  spinWorkoutChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 20,
  },
  spinWorkoutText: { fontSize: 12, fontWeight: '700' },
  spinGoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.full,
    paddingHorizontal: 24,
    paddingVertical: 14,
    width: '100%',
    justifyContent: 'center',
  },
  spinGoBtnText: { fontSize: 16, fontWeight: '800', color: colors.bg },
});
