import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Switch,
  StyleSheet, RefreshControl, ImageBackground,
  Modal, Dimensions, ActivityIndicator, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFonts, Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors, spacing, radius, typography } from '@/theme';
import { getCalorieHistory, DayCalories } from '@/lib/foodDatabase';
// WhereToModal replaced by WhereToScreen (full navigation screen)
import {
  getProfile, getFoodLog, getStreak, getWaterLog, getNutritionTargets, todayStr,
  getDailyCoaching, saveDailyCoaching,
} from '@/lib/storage';
import { UserProfile } from '@/lib/types';
import { NutritionTargets } from '@/lib/nutrition';
import {
  initHealthKit, getTodayHealthData, subscribeHeartRate, healthKitAvailable,
  HealthData,
} from '@/lib/healthkit';
import {
  computeRecovery, RecoveryScore, getDailyIdentityMessage, getDailyArticle, DailyArticle,
  getAllArticles, getTodayArticleIndex,
  getStreakCoachingMessage, buildWorkoutAIContext,
} from '@/lib/coaching';
import {
  Program, getRepRange,
  buildPersonalizedPrograms, getWeekSchedule, getTodayDayIdx,
} from '@/lib/workoutPlanner';
import { randomFWPlace, FWPlace } from '@/data/fortWorthPlaces';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const ORANGE = colors.orange;
const BG     = colors.bg;
const CARD   = colors.card;
const RED    = '#E84040';
const GREEN  = colors.green ?? '#22C55E';

interface DashStats {
  calsToday: number; proteinToday: number; carbsToday: number; fatToday: number;
  waterOz: number; streak: number; targets: NutritionTargets | null;
}

const HEALTH_PERMS_KEY = 'ftf_health_permissions';

interface HealthPermsConfig {
  asked: boolean;
  granted: boolean;
  heartRate: boolean;
  hrv: boolean;
  sleep: boolean;
  activeCalories: boolean;
  steps: boolean;
  restingHR: boolean;
  weight: boolean;
}

// ─── Health Permissions Modal ─────────────────────────────────────────────────

const PRIVACY_POLICY_URL = 'https://funkytownfit.app/privacy';

function HealthPermissionsModal({ visible, current, onClose, onSave }: {
  visible: boolean;
  current: HealthPermsConfig | null;
  onClose: () => void;
  onSave: (cfg: HealthPermsConfig) => void;
}) {
  const allOn: HealthPermsConfig = {
    asked: true, granted: true,
    heartRate: true, hrv: true, sleep: true,
    activeCalories: true, steps: true, restingHR: true, weight: true,
  };

  const [cfg, setCfg] = useState<HealthPermsConfig>(current ?? allOn);

  useEffect(() => {
    if (visible) setCfg(current ?? allOn);
  }, [visible]);

  const allEnabled = cfg.heartRate && cfg.hrv && cfg.sleep &&
    cfg.activeCalories && cfg.steps && cfg.restingHR && cfg.weight;

  function toggleAll(val: boolean) {
    setCfg(prev => ({
      ...prev, heartRate: val, hrv: val, sleep: val,
      activeCalories: val, steps: val, restingHR: val, weight: val,
    }));
  }

  function toggle(key: keyof HealthPermsConfig) {
    setCfg(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const rows: { key: keyof HealthPermsConfig; label: string; icon: IoniconName; color: string }[] = [
    { key: 'heartRate',      label: 'Heart Rate',          icon: 'heart',          color: RED },
    { key: 'hrv',            label: 'Heart Rate Variability (HRV)', icon: 'pulse', color: '#A855F7' },
    { key: 'sleep',          label: 'Sleep',               icon: 'moon',           color: colors.blue },
    { key: 'activeCalories', label: 'Active Calories',     icon: 'flame',          color: ORANGE },
    { key: 'steps',          label: 'Steps',               icon: 'footsteps',      color: GREEN },
    { key: 'restingHR',      label: 'Resting Heart Rate',  icon: 'heart-circle',   color: RED },
    { key: 'weight',         label: 'Weight',              icon: 'barbell',        color: colors.textSecondary },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.bgSecondary }}>
        {/* Header */}
        <View style={hpSt.header}>
          <View style={hpSt.handle} />
          <View style={hpSt.titleRow}>
            <Ionicons name="shield-checkmark" size={20} color={GREEN} />
            <Text style={hpSt.title}>Your Data</Text>
          </View>
          <Text style={hpSt.subtitle}>
            Choose what health data Funkytown Fit can read from Apple Health. You can change this anytime.
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL(PRIVACY_POLICY_URL)} style={hpSt.privacyLink}>
            <Ionicons name="document-text-outline" size={13} color={ORANGE} />
            <Text style={hpSt.privacyLinkText}>Read our Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Share All toggle */}
          <View style={hpSt.shareAllRow}>
            <View style={{ flex: 1 }}>
              <Text style={hpSt.shareAllLabel}>Share All</Text>
              <Text style={hpSt.shareAllSub}>Enable all health metrics at once</Text>
            </View>
            <Switch
              value={allEnabled}
              onValueChange={toggleAll}
              trackColor={{ false: colors.cardBorder, true: ORANGE }}
              thumbColor={allEnabled ? '#fff' : colors.textMuted}
            />
          </View>

          <View style={hpSt.dividerFull} />

          {/* Individual toggles */}
          {rows.map(row => (
            <View key={String(row.key)} style={hpSt.row}>
              <View style={[hpSt.iconWrap, { backgroundColor: row.color + '18' }]}>
                <Ionicons name={row.icon} size={18} color={row.color} />
              </View>
              <Text style={hpSt.rowLabel}>{row.label}</Text>
              <Switch
                value={Boolean(cfg[row.key])}
                onValueChange={() => toggle(row.key)}
                trackColor={{ false: colors.cardBorder, true: row.color }}
                thumbColor={cfg[row.key] ? '#fff' : colors.textMuted}
              />
            </View>
          ))}

          <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: 12 }}>
            {/* Connect button */}
            <TouchableOpacity
              style={hpSt.connectBtn}
              onPress={() => onSave({ ...cfg, asked: true, granted: true })}
            >
              <Ionicons name="checkmark-circle" size={18} color={colors.bg} />
              <Text style={hpSt.connectBtnText}>Connect Selected Data</Text>
            </TouchableOpacity>

            {/* No thanks */}
            <TouchableOpacity
              style={hpSt.noThanksBtn}
              onPress={() => onSave({ ...cfg, asked: true, granted: false })}
            >
              <Text style={hpSt.noThanksBtnText}>Not Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const hpSt = StyleSheet.create({
  header: { padding: spacing.lg, paddingTop: 12, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.cardBorder, alignSelf: 'center', marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '900', color: colors.textPrimary, letterSpacing: -0.4 },
  subtitle: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 10 },
  privacyLink: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start' },
  privacyLinkText: { fontSize: 12, fontWeight: '700', color: ORANGE, textDecorationLine: 'underline' },
  shareAllRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: 12 },
  shareAllLabel: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  shareAllSub: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
  dividerFull: { height: 1, backgroundColor: colors.cardBorder, marginHorizontal: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: spacing.lg, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  connectBtn: { backgroundColor: ORANGE, borderRadius: radius.full, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  connectBtnText: { fontSize: 15, fontWeight: '900', color: colors.bg },
  noThanksBtn: { borderRadius: radius.full, borderWidth: 1.5, borderColor: colors.cardBorder, alignItems: 'center', paddingVertical: 13 },
  noThanksBtnText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
});

// ─── Where To Sponsor Card ────────────────────────────────────────────────────

function WhereToSponsorCard({ onPress }: { onPress: () => void }) {
  const [place] = useState<FWPlace>(() => randomFWPlace());

  const categoryEmoji: Record<string, string> = {
    gym: '💪', restaurant: '🍽️', bar: '🍺', coffee: '☕',
    music: '🎵', outdoors: '🌿', arts: '🎨', shopping: '🛍️',
    sports: '⚽', spa: '🧘', entertainment: '🎭',
  };
  const emoji = categoryEmoji[place.category] ?? '📍';

  return (
    <TouchableOpacity style={wtSt.card} onPress={onPress} activeOpacity={0.82}>
      {/* Green left accent */}
      <View style={wtSt.leftBar} />

      <View style={wtSt.inner}>
        {/* Top row: label + sponsor badge */}
        <View style={wtSt.topRow}>
          <View style={wtSt.labelPill}>
            <Ionicons name="location" size={10} color={GREEN} />
            <Text style={wtSt.labelText}>WHERE TO?</Text>
          </View>
          <View style={wtSt.sponsorBadge}>
            <Text style={wtSt.sponsorLabel}>Sponsored by</Text>
            <Text style={wtSt.sponsorName}>Sand Supply Co.</Text>
          </View>
        </View>

        {/* Featured place teaser */}
        <View style={wtSt.placeRow}>
          <Text style={wtSt.placeEmoji}>{emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={wtSt.placeName}>{place.name}</Text>
            <Text style={wtSt.placeDesc} numberOfLines={1}>
              {place.tags.slice(0, 3).join(' · ')}
            </Text>
          </View>
        </View>

        {/* CTA */}
        <View style={wtSt.ctaRow}>
          <Text style={wtSt.ctaText}>Explore Fort Worth</Text>
          <View style={wtSt.ctaArrow}>
            <Ionicons name="arrow-forward" size={13} color={colors.bg} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const wtSt = StyleSheet.create({
  card: {
    borderRadius: radius.lg, marginBottom: 10, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)',
    backgroundColor: CARD, flexDirection: 'row',
    shadowColor: GREEN, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 10, elevation: 3,
  },
  leftBar: { width: 4, backgroundColor: GREEN },
  inner:   { flex: 1, padding: spacing.md, paddingLeft: spacing.md },
  topRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  labelPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(34,197,94,0.12)', borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)' },
  labelText: { fontSize: 9, fontWeight: '900', color: GREEN, letterSpacing: 1.6 },
  sponsorBadge: { alignItems: 'flex-end' },
  sponsorLabel: { fontSize: 8, color: colors.textMuted, fontWeight: '600', letterSpacing: 0.3 },
  sponsorName:  { fontSize: 11, fontWeight: '900', color: GREEN, letterSpacing: 0.2 },
  placeRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, backgroundColor: 'rgba(34,197,94,0.07)', borderRadius: radius.sm, padding: 10 },
  placeEmoji:{ fontSize: 24 },
  placeName: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginBottom: 2 },
  placeDesc: { fontSize: 11, color: colors.textMuted },
  ctaRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ctaText:   { fontSize: 13, fontWeight: '800', color: GREEN },
  ctaArrow:  { width: 22, height: 22, borderRadius: 11, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center' },
});

// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardScreen({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashStats>({
    calsToday: 0, proteinToday: 0, carbsToday: 0, fatToday: 0,
    waterOz: 0, streak: 0, targets: null,
  });
  const [health, setHealth] = useState<HealthData>({
    heartRateBPM: null, activeCaloriesBurned: null, stepCount: null,
    restingHeartRate: null, hrv: null, vo2Max: null, sleepHours: null,
  });
  const [refreshing,    setRefreshing]    = useState(false);
  const [todayProgram,  setTodayProgram]  = useState<Program | null>(null);
  const [calModal,      setCalModal]      = useState<'in' | 'out' | null>(null);
  const [habitModal,    setHabitModal]    = useState(false);
  const [notifsModal,   setNotifsModal]   = useState(false);
  const [healthPermsModal, setHealthPermsModal] = useState(false);
  const [healthPerms,   setHealthPerms]  = useState<HealthPermsConfig | null>(null);
  const [fontsLoaded] = useFonts({ Pacifico_400Regular });

  // Coaching + recovery
  const [recovery, setRecovery]                   = useState<RecoveryScore | null>(null);
  const [identityMsg]                             = useState(getDailyIdentityMessage());
  const [dailyArticle]                            = useState<DailyArticle>(getDailyArticle());
  const [coachingDismissed, setCoachingDismissed] = useState(false);

  // Init HealthKit once on mount and start HR polling
  useEffect(() => {
    async function setupHealth() {
      const ok = await initHealthKit();
      if (ok) {
        const data = await getTodayHealthData();
        setHealth(data);
        setRecovery(computeRecovery(data));
      }
    }
    setupHealth();
    const unsub = subscribeHeartRate(bpm => setHealth(prev => ({ ...prev, heartRateBPM: bpm })), 10000);
    return unsub;
  }, []);

  async function load() {
    const p = await getProfile();
    setProfile(p);

    // Build today's scheduled workout
    const progs       = buildPersonalizedPrograms(p);
    const daysPerWeek = (p as any)?.daysPerWeek ?? 3;
    const sched       = getWeekSchedule(progs, daysPerWeek);
    setTodayProgram(sched[getTodayDayIdx()] ?? null);

    const today = todayStr();
    const [food, streak, water, targets, coaching] = await Promise.all([
      getFoodLog(today), getStreak(), getWaterLog(today), getNutritionTargets(),
      getDailyCoaching(today),
    ]);
    setStats({
      calsToday:    food.reduce((s, e) => s + e.calories, 0),
      proteinToday: food.reduce((s, e) => s + e.proteinG, 0),
      carbsToday:   food.reduce((s, e) => s + (e.carbsG ?? 0), 0),
      fatToday:     food.reduce((s, e) => s + (e.fatG ?? 0), 0),
      waterOz: water.ozLogged,
      streak: streak.current,
      targets,
    });

    // Load health permissions config
    try {
      const raw = await AsyncStorage.getItem(HEALTH_PERMS_KEY);
      if (raw) setHealthPerms(JSON.parse(raw));
    } catch { /* ignore */ }
    setCoachingDismissed(coaching.coachingDismissed);
    const hData = await getTodayHealthData();
    setHealth(hData);
    setRecovery(computeRecovery(hData));
  }

  useFocusEffect(useCallback(() => { load(); }, []));
  async function onRefresh() { setRefreshing(true); await load(); setRefreshing(false); }

  async function openTodayWorkout(p: Program) {
    await AsyncStorage.setItem('ftf_quick_start_id', p.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Workout');
  }

  const calPct   = stats.targets ? Math.min(stats.calsToday / stats.targets.calories, 1) : 0;
  const protPct  = stats.targets ? Math.min(stats.proteinToday / stats.targets.proteinG, 1) : 0;
  const waterPct = Math.min(stats.waterOz / 100, 1);
  const firstName = profile?.name?.split(' ')[0] ?? '';
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <View style={styles.root}>

      {/* ── Header — compact single row ─────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.brandRow}>
          <View style={styles.brandLeft}>
            <Text style={[
              styles.brandName,
              fontsLoaded ? { fontFamily: 'Pacifico_400Regular' } : { fontWeight: '900' },
            ]}>
              Funkytown Fit
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={9} color={colors.textMuted} />
              <Text style={styles.locationText}>Fort Worth, TX</Text>
            </View>
          </View>

          {/* Compact greeting */}
          {firstName ? (
            <Text style={styles.headerGreeting}>
              Good {greeting()}, {firstName} 👋
            </Text>
          ) : null}

          <TouchableOpacity style={styles.headerIconBtn} onPress={() => setNotifsModal(true)}>
            <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.sheet}
        contentContainerStyle={[styles.sheetContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ORANGE} />}
      >
        {/* ── Calories In / Out split card ──────────────────────────────── */}
        <CalorieSplitCard
          calsIn={stats.calsToday}
          calsOut={health.activeCaloriesBurned ?? 0}
          targetIn={stats.targets?.calories ?? 2000}
          streak={stats.streak}
          protein={stats.proteinToday}
          carbs={stats.carbsToday}
          fat={stats.fatToday}
          onPressIn={() => setCalModal('in')}
          onPressOut={() => setCalModal('out')}
          onLogMeal={() => navigation.navigate('Nutrition')}
        />
        {/* Calories history modal */}
        {calModal !== null && (
          <CaloriesModal
            side={calModal}
            calsInToday={stats.calsToday}
            calsOutToday={health.activeCaloriesBurned ?? 0}
            targetIn={stats.targets?.calories ?? 2000}
            proteinToday={stats.proteinToday}
            carbsToday={stats.carbsToday}
            fatToday={stats.fatToday}
            targetProtein={stats.targets?.proteinG}
            targetCarbs={stats.targets?.carbsG}
            targetFat={stats.targets?.fatG}
            onClose={() => setCalModal(null)}
            onLogMeal={() => { setCalModal(null); navigation.navigate('Nutrition'); }}
          />
        )}

        {/* ── Today's Workout card ──────────────────────────────────────── */}
        {todayProgram && (
          <TodayWorkoutCard
            program={todayProgram}
            onPress={() => openTodayWorkout(todayProgram)}
          />
        )}

        {/* ── Recovery card ────────────────────────────────────────────── */}
        {recovery && (
          <RecoveryCard recovery={recovery} />
        )}

        {/* ── Daily Habit Lab card — always visible, no dismiss ────────── */}
        {(
          <>
            <HabitArticleCard
              article={dailyArticle}
              onReadMore={() => setHabitModal(true)}
            />
            <HabitArticleModal
              article={dailyArticle}
              visible={habitModal}
              onClose={() => setHabitModal(false)}
            />
          </>
        )}

        {/* protein + water boxes removed — macros now shown inside the Calories In card */}

        {/* ── Your Data ───────────────────────────────────────────────── */}
        <View style={[secSt.row, { marginTop: 24 }]}>
          <View style={secSt.bar} />
          <Text style={secSt.text}>Your Data</Text>
          <TouchableOpacity
            style={hlSt.settingsBtn}
            onPress={() => setHealthPermsModal(true)}
          >
            <Ionicons name="settings-outline" size={13} color={colors.textMuted} />
            <Text style={hlSt.settingsBtnText}>
              {healthPerms?.granted ? 'Manage' : 'Connect'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* If not yet consented, show a soft connect prompt */}
        {!healthPerms?.granted ? (
          <TouchableOpacity style={hlSt.connectCard} onPress={() => setHealthPermsModal(true)} activeOpacity={0.8}>
            <Ionicons name="heart-circle-outline" size={28} color={ORANGE} />
            <View style={{ flex: 1 }}>
              <Text style={hlSt.connectTitle}>Connect your health data</Text>
              <Text style={hlSt.connectSub}>See steps, heart rate, sleep, and active calories all in one place. You choose what to share.</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        ) : (
          <>
            <View style={hlSt.card}>
              {(healthPerms?.heartRate ?? true) && (
                <HealthMetric iconName="heart" label="Heart Rate" value={health.heartRateBPM !== null ? `${health.heartRateBPM}` : '—'} unit="bpm" color={RED} />
              )}
              {(healthPerms?.heartRate ?? true) && <View style={hlSt.divider} />}
              {(healthPerms?.hrv ?? true) && (
                <HealthMetric iconName="pulse" label="HRV" value={health.hrv !== null ? `${health.hrv}` : '—'} unit="ms" color="#A855F7" />
              )}
              {(healthPerms?.hrv ?? true) && <View style={hlSt.divider} />}
              {(healthPerms?.sleep ?? true) && (
                <HealthMetric iconName="moon" label="Sleep" value={health.sleepHours !== null ? `${health.sleepHours}` : '—'} unit="hrs" color={colors.blue} />
              )}
            </View>
            <View style={hlSt.card}>
              {(healthPerms?.activeCalories ?? true) && (
                <HealthMetric iconName="flame" label="Active Cal" value={health.activeCaloriesBurned !== null ? `${health.activeCaloriesBurned}` : '—'} unit="kcal" color={ORANGE} />
              )}
              {(healthPerms?.activeCalories ?? true) && <View style={hlSt.divider} />}
              {(healthPerms?.steps ?? true) && (
                <HealthMetric iconName="footsteps" label="Steps" value={health.stepCount !== null ? health.stepCount.toLocaleString() : '—'} unit="steps" color={GREEN} />
              )}
              {(healthPerms?.steps ?? true) && <View style={hlSt.divider} />}
              {(healthPerms?.restingHR ?? true) && (
                <HealthMetric iconName="heart-circle" label="Resting HR" value={health.restingHeartRate !== null ? `${health.restingHeartRate}` : '—'} unit="bpm" color={RED} />
              )}
            </View>
          </>
        )}
        {!healthKitAvailable && healthPerms?.granted && (
          <Text style={hlSt.unavailableNote}>
            Full data available in EAS dev build with HealthKit — connect Apple Watch for recovery metrics
          </Text>
        )}

        {/* Notifications Modal */}
        <Modal visible={notifsModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setNotifsModal(false)}>
          <View style={{ flex: 1, backgroundColor: colors.bgSecondary }}>
            <View style={{ padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.cardBorder, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity onPress={() => setNotifsModal(false)} style={{ padding: 4 }}>
                <Ionicons name="chevron-down" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
              <Text style={{ flex: 1, fontSize: 18, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' }}>Notifications</Text>
              <View style={{ width: 30 }} />
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 12 }}>
              <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' }}>You're all caught up!</Text>
              <Text style={{ fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 20 }}>
                Notifications for streaks, friend activity, coach updates, and messages will appear here. Full push notification support coming soon.
              </Text>
            </View>
          </View>
        </Modal>

        {/* Health Permissions Modal */}
        <HealthPermissionsModal
          visible={healthPermsModal}
          current={healthPerms}
          onClose={() => setHealthPermsModal(false)}
          onSave={async (cfg) => {
            await AsyncStorage.setItem(HEALTH_PERMS_KEY, JSON.stringify(cfg));
            setHealthPerms(cfg);
            setHealthPermsModal(false);
            if (cfg.granted) {
              const data = await getTodayHealthData();
              setHealth(data);
              setRecovery(computeRecovery(data));
            }
          }}
        />

        {/* ── Actions ─────────────────────────────────────────────────── */}
        <SectionLabel text="Get After It" style={{ marginTop: 24 }} />
        <ActionCard
          iconName="barbell"
          title="Start Workout"
          subtitle="Let's ride"
          color={ORANGE}
          photoUri="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80"
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); navigation.navigate('Workout'); }}
        />
        {/* Log Food ActionCard removed — Log Meal is now in the Calories In card above */}
        <WhereToSponsorCard onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); navigation.navigate('WhereTo'); }} />

        <Text style={styles.fwFooter}>
          TRINITY TRAIL · STOCKYARDS · MAGNOLIA AVE · W. 7TH
        </Text>
      </ScrollView>

    </View>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

// ── Sub-components ──────────────────────────────────────────────────────────

function TodayWorkoutCard({ program, onPress }: { program: Program; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[twSt.card, { borderLeftColor: program.color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={twSt.topRow}>
        <Text style={twSt.label}>TODAY'S WORKOUT</Text>
        <Text style={[twSt.tag, { color: program.color }]}>{program.tag}</Text>
      </View>
      <View style={twSt.titleRow}>
        <Text style={twSt.emoji}>{program.emoji}</Text>
        <Text style={twSt.title}>{program.label}</Text>
      </View>
      <View style={twSt.metaRow}>
        <Text style={twSt.meta}>{program.exercises.length} exercises</Text>
        <Text style={twSt.dot}>·</Text>
        <Text style={twSt.meta}>~{program.estMins} min</Text>
      </View>
      <View style={twSt.exPreview}>
        {program.exercises.slice(0, 3).map((ex, i) => (
          <Text key={i} style={twSt.exLine}>
            {getRepRange(ex)}  {ex.name}
          </Text>
        ))}
        {program.exercises.length > 3 && (
          <Text style={twSt.exMore}>+{program.exercises.length - 3} more</Text>
        )}
      </View>
      <View style={[twSt.startRow, { backgroundColor: program.color }]}>
        <Text style={twSt.startTxt}>Tap to Start →</Text>
      </View>
    </TouchableOpacity>
  );
}

const twSt = StyleSheet.create({
  card: {
    backgroundColor: CARD, borderRadius: 16, padding: 16,
    marginBottom: 14, borderLeftWidth: 4,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.5 },
  tag:   { fontSize: 11, fontWeight: '600' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  emoji:    { fontSize: 28 },
  title:    { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  metaRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  meta:     { fontSize: 13, color: colors.textMuted },
  dot:      { fontSize: 13, color: colors.textMuted },
  exPreview: { marginBottom: 12 },
  exLine:    { fontSize: 13, color: colors.textPrimary, marginBottom: 3 },
  exMore:    { fontSize: 12, color: colors.textMuted, fontStyle: 'italic' },
  startRow:  { borderRadius: 10, padding: 11, alignItems: 'center' },
  startTxt:  { color: '#fff', fontWeight: '700', fontSize: 14 },
});

// ─── Calorie Split Card ───────────────────────────────────────────────────────
function CalorieSplitCard({ calsIn, calsOut, targetIn, streak, protein, carbs, fat, onPressIn, onPressOut, onLogMeal }: {
  calsIn: number; calsOut: number; targetIn: number; streak: number;
  protein: number; carbs: number; fat: number;
  onPressIn: () => void; onPressOut: () => void; onLogMeal: () => void;
}) {
  const pctIn  = Math.min(calsIn / (targetIn || 2000), 1);
  const net    = calsIn - calsOut;

  return (
    <View style={calSt.wrapper}>
      {/* Streak chip across top */}
      <View style={calSt.topRow}>
        <Text style={calSt.todayLabel}>Today</Text>
        {streak > 0 && (
          <View style={calSt.streakChip}>
            <Ionicons name="flame" size={11} color={ORANGE} />
            <Text style={calSt.streakNum}>{streak}d streak</Text>
          </View>
        )}
      </View>

      {/* Two columns */}
      <View style={calSt.cols}>
        {/* ── Calories In ── */}
        <TouchableOpacity style={calSt.col} onPress={onPressIn} activeOpacity={0.8}>
          <Text style={calSt.colLabel}>CALORIES IN</Text>
          <Text style={[calSt.colNum, { color: colors.textPrimary }]}>{calsIn.toLocaleString()}</Text>
          <Text style={calSt.colTarget}>/ {targetIn.toLocaleString()} goal</Text>
          <View style={calSt.barBg}>
            <View style={[calSt.barFill, { width: `${Math.round(pctIn * 100)}%` as any, backgroundColor: ORANGE }]} />
          </View>
          <Text style={[calSt.pctText, { color: colors.textMuted }]}>{Math.round(pctIn * 100)}%</Text>

          {/* Macro summary row */}
          <View style={calSt.macroRow}>
            <View style={calSt.macroPill}>
              <Text style={[calSt.macroVal, { color: colors.protein }]}>{Math.round(protein)}g</Text>
              <Text style={calSt.macroKey}>P</Text>
            </View>
            <View style={calSt.macroPill}>
              <Text style={[calSt.macroVal, { color: colors.amber }]}>{Math.round(carbs)}g</Text>
              <Text style={calSt.macroKey}>C</Text>
            </View>
            <View style={calSt.macroPill}>
              <Text style={[calSt.macroVal, { color: '#F97316' }]}>{Math.round(fat)}g</Text>
              <Text style={calSt.macroKey}>F</Text>
            </View>
          </View>

          {/* Log Meal — styled like ActionCard */}
          <TouchableOpacity style={calSt.logMealBtn} onPress={onLogMeal} activeOpacity={0.82}>
            <Ionicons name="nutrition" size={16} color={colors.bg} />
            <Text style={calSt.logMealText}>Log Meal</Text>
          </TouchableOpacity>
          <Text style={calSt.tapHint}>Tap for history →</Text>
        </TouchableOpacity>

        <View style={calSt.divider} />

        {/* ── Calories Out ── */}
        <TouchableOpacity style={calSt.col} onPress={onPressOut} activeOpacity={0.8}>
          <Text style={calSt.colLabel}>CALORIES OUT</Text>
          <Text style={[calSt.colNum, { color: colors.textPrimary }]}>{calsOut > 0 ? calsOut.toLocaleString() : '—'}</Text>
          <Text style={calSt.colTarget}>active burn</Text>
          {calsOut > 0 && (
            <>
              <View style={calSt.barBg}>
                <View style={[calSt.barFill, { width: `${Math.min(calsOut / 600 * 100, 100)}%` as any, backgroundColor: RED }]} />
              </View>
              <Text style={[calSt.pctText, { color: RED }]}>{Math.round(calsOut / 6)}% of goal</Text>
            </>
          )}
          {calsOut === 0 && (
            <Text style={calSt.noDataNote}>Syncs from Apple Health</Text>
          )}
          {/* Net */}
          {calsOut > 0 && (
            <View style={calSt.netChip}>
              <Text style={calSt.netLabel}>NET  </Text>
              <Text style={[calSt.netNum, { color: net > 0 ? ORANGE : GREEN }]}>
                {net > 0 ? '+' : ''}{net.toLocaleString()} kcal
              </Text>
            </View>
          )}
          <Text style={calSt.tapHint}>Tap for history →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Calories History Modal ────────────────────────────────────────────────────
const SCREEN_W = Dimensions.get('window').width;
const CHART_W  = SCREEN_W - 64;

function CaloriesModal({ side, calsInToday, calsOutToday, targetIn,
  proteinToday = 0, carbsToday = 0, fatToday = 0,
  targetProtein, targetCarbs, targetFat,
  onClose, onLogMeal }: {
  side: 'in' | 'out'; calsInToday: number; calsOutToday: number;
  targetIn: number;
  proteinToday?: number; carbsToday?: number; fatToday?: number;
  targetProtein?: number; targetCarbs?: number; targetFat?: number;
  onClose: () => void; onLogMeal: () => void;
}) {
  type Range = 'Week' | '1M' | '3M' | '6M';
  const [range, setRange]     = useState<Range>('Week');
  const [history, setHistory] = useState<DayCalories[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const days = range === 'Week' ? 7 : range === '1M' ? 30 : range === '3M' ? 90 : 180;
      const data = await getCalorieHistory(days);
      setHistory(data);
      setLoading(false);
    }
    load();
  }, [range]);

  const CHART_H    = 120;
  const vals       = history.map(d => side === 'in' ? d.calories : 0);
  const maxVal     = Math.max(...vals, targetIn, 100);
  const accent     = side === 'in' ? ORANGE : RED;
  const title      = side === 'in' ? 'Calories In' : 'Calories Out';
  const todayCals  = side === 'in' ? calsInToday : calsOutToday;
  const calPct     = Math.min(Math.round((calsInToday / (targetIn || 2000)) * 100), 100);

  const macros = [
    { label: 'Protein', value: proteinToday, target: targetProtein, color: colors.protein },
    { label: 'Carbs',   value: carbsToday,   target: targetCarbs,   color: colors.amber },
    { label: 'Fat',     value: fatToday,     target: targetFat,     color: '#F97316' },
  ];

  return (
    <Modal animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={cmSt.root}>

        {/* ── Header bar ───────────────────────────────────────────────── */}
        <View style={cmSt.header}>
          <TouchableOpacity onPress={onClose} style={cmSt.closeBtn}>
            <Ionicons name="chevron-down" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[cmSt.title, { flex: 1, textAlign: 'center' }]}>{title}</Text>
          {side === 'in' ? (
            <TouchableOpacity style={[cmSt.logBtn, { backgroundColor: accent }]} onPress={onLogMeal}>
              <Ionicons name="add" size={16} color={colors.bg} />
              <Text style={cmSt.logBtnText}>Log</Text>
            </TouchableOpacity>
          ) : <View style={{ width: 60 }} />}
        </View>

        {/* ── Today section ────────────────────────────────────────────── */}
        <View style={cmSt.todaySection}>
          <Text style={cmSt.todaySectionLabel}>TODAY</Text>
          <View style={cmSt.todayRow}>
            <Text style={[cmSt.todayBigNum, { color: accent }]}>
              {todayCals > 0 ? todayCals.toLocaleString() : '—'}
            </Text>
            <Text style={cmSt.todayBigUnit}> kcal</Text>
          </View>

          {side === 'in' && (
            <>
              <Text style={cmSt.todayGoalText}>{calPct}% of {targetIn.toLocaleString()} goal</Text>
              <View style={cmSt.todayBarBg}>
                <View style={[cmSt.todayBarFill, { width: `${calPct}%` as any, backgroundColor: accent }]} />
              </View>
              <View style={cmSt.macroSection}>
                {macros.map(m => {
                  const pct = m.target ? Math.min(m.value / m.target, 1) : 0;
                  return (
                    <View key={m.label} style={cmSt.macroRow}>
                      <View style={cmSt.macroLabelRow}>
                        <Text style={[cmSt.macroName, { color: m.color }]}>{m.label}</Text>
                        <Text style={cmSt.macroValues}>
                          {Math.round(m.value)}g{m.target ? ` / ${Math.round(m.target)}g` : ''}
                        </Text>
                      </View>
                      <View style={cmSt.macroBarBg}>
                        <View style={[cmSt.macroBarFill, { width: `${Math.round(pct * 100)}%` as any, backgroundColor: m.color }]} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}
          {side === 'out' && calsOutToday === 0 && (
            <Text style={cmSt.todayNoData}>Syncs from Apple Health</Text>
          )}
        </View>

        {/* ── History range tabs ───────────────────────────────────────── */}
        <View style={cmSt.tabs}>
          {(['Week', '1M', '3M', '6M'] as Range[]).map(r => (
            <TouchableOpacity
              key={r}
              style={[cmSt.tab, range === r && { backgroundColor: accent }]}
              onPress={() => setRange(r)}
            >
              <Text style={[cmSt.tabText, range === r && { color: colors.bg }]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={cmSt.loader}><ActivityIndicator color={accent} /></View>
        ) : (
          <ScrollView contentContainerStyle={cmSt.content}>
            {/* Bar chart */}
            <View style={[cmSt.chart, { height: CHART_H + 30 }]}>
              {vals.length === 0 ? (
                <View style={cmSt.noData}>
                  <Text style={cmSt.noDataText}>No data for this range yet</Text>
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  {side === 'in' && (
                    <View style={[cmSt.targetLine, { bottom: (targetIn / maxVal) * CHART_H + 12 }]}>
                      <Text style={cmSt.targetLineLabel}>Goal {targetIn.toLocaleString()}</Text>
                    </View>
                  )}
                  <View style={cmSt.barsRow}>
                    {vals.map((v, i) => {
                      const barH = maxVal > 0 ? Math.max((v / maxVal) * CHART_H, v > 0 ? 3 : 0) : 0;
                      const isToday = i === vals.length - 1;
                      return (
                        <View key={i} style={[cmSt.barWrap, { height: CHART_H + 12 }]}>
                          <View style={[cmSt.bar, {
                            height: barH,
                            backgroundColor: isToday ? accent : accent + '66',
                            width: Math.max(CHART_W / vals.length - 3, 2),
                          }]} />
                          {vals.length <= 10 && (
                            <Text style={cmSt.barLabel} numberOfLines={1}>
                              {new Date(history[i]?.date + 'T00:00').toLocaleDateString('en-US', { weekday: 'short' }).slice(0,1)}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>

            {/* Stats row */}
            <View style={cmSt.statsRow}>
              {[
                { label: 'Avg / day', value: vals.filter(v => v > 0).length > 0
                    ? Math.round(vals.filter(v => v > 0).reduce((a, b) => a + b, 0) / vals.filter(v => v > 0).length).toLocaleString()
                    : '—' },
                { label: 'Days logged', value: `${vals.filter(v => v > 0).length}` },
                { label: side === 'in' ? 'vs Goal' : 'Total burned',
                  value: side === 'in'
                    ? `${vals.filter(v => v > 0).length > 0 ? Math.round(vals.filter(v=>v>0).reduce((a,b)=>a+b,0)/vals.filter(v=>v>0).length / targetIn * 100) : 0}%`
                    : `${vals.reduce((a, b) => a + b, 0).toLocaleString()}`
                },
              ].map(stat => (
                <View key={stat.label} style={cmSt.stat}>
                  <Text style={[cmSt.statVal, { color: accent }]}>{stat.value}</Text>
                  <Text style={cmSt.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {side === 'out' && (
              <View style={cmSt.healthNote}>
                <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
                <Text style={cmSt.healthNoteText}>
                  Calorie burn history comes from Apple Health. Full history view available in EAS dev build with HealthKit access.
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

function StatCard({ value, label, unit = '', color, pct, target }: {
  value: number; label: string; unit?: string; color: string; pct: number; target?: number;
}) {
  return (
    <View style={statSt.card}>
      <Text style={[statSt.value, { color }]}>
        {value.toLocaleString()}<Text style={statSt.unit}>{unit}</Text>
      </Text>
      <Text style={statSt.label}>{label}</Text>
      <View style={statSt.barBg}>
        <View style={[statSt.barFill, { width: `${Math.round(pct * 100)}%` as any, backgroundColor: color }]} />
      </View>
      {target !== undefined && <Text style={statSt.target}>/ {target.toLocaleString()}</Text>}
    </View>
  );
}

function SectionLabel({ text, style }: { text: string; style?: object }) {
  return (
    <View style={[secSt.row, style]}>
      <View style={secSt.bar} />
      <Text style={secSt.text}>{text}</Text>
    </View>
  );
}

function RecoveryCard({ recovery }: { recovery: RecoveryScore }) {
  if (recovery.score === -1) return null; // no data yet
  const pct = recovery.score / 100;
  return (
    <View style={[recSt.card, { borderColor: recovery.color + '40' }]}>
      <View style={recSt.topRow}>
        <View>
          <Text style={recSt.sectionLabel}>RECOVERY</Text>
          <Text style={recSt.label}>{recovery.emoji}  {recovery.label}</Text>
        </View>
        <View style={recSt.scoreWrap}>
          <Text style={[recSt.scoreNum, { color: recovery.color }]}>{recovery.score}</Text>
          <Text style={recSt.scoreUnit}>/100</Text>
        </View>
      </View>
      <View style={recSt.barBg}>
        <View style={[recSt.barFill, { width: `${recovery.score}%` as any, backgroundColor: recovery.color }]} />
      </View>
      <Text style={recSt.summary}>{recovery.summary}</Text>
      <View style={[recSt.tipRow, { backgroundColor: recovery.color + '14' }]}>
        <Text style={[recSt.tipText, { color: recovery.color }]}>{recovery.workoutTip}</Text>
      </View>
    </View>
  );
}

function HabitArticleCard({ article, onReadMore }: {
  article: DailyArticle; onReadMore: () => void;
}) {
  return (
    <TouchableOpacity style={coachSt.card} onPress={onReadMore} activeOpacity={0.88}>
      {/* Header row — no dismiss X, users keep the card permanently */}
      <View style={coachSt.headerRow}>
        <View style={coachSt.tagWrap}>
          <View style={coachSt.tagPill}>
            <Ionicons name="flask" size={11} color={ORANGE} />
            <Text style={coachSt.tag}>HABIT LAB</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>

      {/* Article title */}
      <Text style={coachSt.articleTitle}>{article.title}</Text>

      {/* Full summary — readable without opening the article */}
      <Text style={coachSt.articleTeaser}>{article.body}</Text>

      {/* Read More row */}
      <View style={coachSt.readMoreRow}>
        <Text style={coachSt.readMoreText}>Read full article</Text>
        <Ionicons name="arrow-forward-circle" size={16} color={ORANGE} />
      </View>

      {/* Challenge strip */}
      <View style={coachSt.challengeRow}>
        <Text style={coachSt.challengeEmoji}>{article.challengeEmoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={coachSt.challengeLabel}>TODAY'S CHALLENGE</Text>
          <Text style={coachSt.challengeText}>{article.challenge}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function HabitArticleModal({ article, visible, onClose }: {
  article: DailyArticle; visible: boolean; onClose: () => void;
}) {
  type Tab = 'today' | 'archive';
  const [tab, setTab] = useState<Tab>('today');
  const [selected, setSelected] = useState<DailyArticle>(article);
  const allArticles = getAllArticles();
  const todayIdx    = getTodayArticleIndex();

  function ArticleDetail({ a }: { a: DailyArticle }) {
    return (
      <ScrollView contentContainerStyle={hmSt.content}>
        <View style={hmSt.badge}>
          <Ionicons name="flask" size={13} color={ORANGE} />
          <Text style={hmSt.badgeText}>HABIT LAB</Text>
        </View>
        <Text style={hmSt.title}>{a.title}</Text>
        <Text style={hmSt.body}>{a.body}</Text>
        <Text style={hmSt.body}>
          {'\n'}Research consistently shows that small, deliberate habits compounded over time produce dramatically better outcomes than intense short-term bursts. Your brain builds neural pathways through repetition — neuroscientists call this long-term potentiation. Over weeks, the action shifts from effortful to automatic.{'\n\n'}
          The key insight is implementation intentions: instead of "I will do X," say "When Y happens, I will do X." This if-then structure anchors the habit to an existing cue so you don't rely on willpower.{'\n\n'}
          <Text style={{ color: ORANGE }}>Fort Worth tip:</Text> Stack your new habit with something you already do every day. Morning coffee → 10-min walk on Trinity Trails. Evening wind-down → 5 min mobility work.
        </Text>
        <Text style={hmSt.source}>— {a.source}</Text>
        <View style={hmSt.challenge}>
          <Text style={hmSt.challengeEmoji}>{a.challengeEmoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={hmSt.challengeLabel}>TODAY'S CHALLENGE</Text>
            <Text style={hmSt.challengeText}>{a.challenge}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <Modal animationType="slide" presentationStyle="pageSheet" visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.bgSecondary }}>
        {/* Handle + header */}
        <View style={hmSt.header}>
          <View style={hmSt.handle} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 4 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['today', 'archive'] as Tab[]).map(t => (
                <TouchableOpacity key={t} onPress={() => setTab(t)}
                  style={[hmSt.tabBtn, tab === t && hmSt.tabBtnActive]}>
                  <Text style={[hmSt.tabText, tab === t && hmSt.tabTextActive]}>
                    {t === 'today' ? "Today's Article" : 'Archive'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {tab === 'today' ? (
          <ArticleDetail a={article} />
        ) : (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {/* Article list */}
            <ScrollView style={hmSt.archiveList} contentContainerStyle={{ paddingBottom: 40 }}>
              {allArticles.map((a, i) => (
                <TouchableOpacity key={i}
                  style={[hmSt.archiveRow, selected === a && hmSt.archiveRowActive]}
                  onPress={() => setSelected(a)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[hmSt.archiveTitle, selected === a && { color: ORANGE }]} numberOfLines={2}>
                      {a.title}
                    </Text>
                    {i === todayIdx && (
                      <Text style={hmSt.archiveToday}>TODAY</Text>
                    )}
                  </View>
                  <Text style={{ fontSize: 18 }}>{a.challengeEmoji}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* Article detail */}
            <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: colors.cardBorder }}>
              <ArticleDetail a={selected} />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

function HealthMetric({ iconName, label, value, unit, color }: {
  iconName: IoniconName; label: string; value: string; unit: string; color: string;
}) {
  return (
    <View style={hlSt.metric}>
      <Ionicons name={iconName} size={18} color={color} style={{ marginBottom: 4 }} />
      <Text style={[hlSt.metricValue, { color }]}>{value}</Text>
      <Text style={hlSt.metricUnit}>{unit}</Text>
      <Text style={hlSt.metricLabel}>{label}</Text>
    </View>
  );
}

function ActionCard({ iconName, title, subtitle, color, onPress, photoUri }: {
  iconName: IoniconName; title: string; subtitle: string; color: string;
  onPress: () => void; photoUri?: string;
}) {
  return (
    <TouchableOpacity activeOpacity={0.78} onPress={onPress} style={actSt.card}>
      <ImageBackground
        source={photoUri ? { uri: photoUri } : undefined}
        style={actSt.cardInner}
        imageStyle={actSt.cardImage}
        resizeMode="cover"
      >
        {/* Tinted dark overlay */}
        <View style={[actSt.overlay, { backgroundColor: color + '1A' }]} />
        {/* Left accent bar */}
        <View style={[actSt.leftBorder, { backgroundColor: color }]} />

        <View style={actSt.content}>
          {/* Icon circle */}
          <View style={[actSt.iconWrap, { backgroundColor: color + '28' }]}>
            <Ionicons name={iconName} size={24} color={color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={actSt.title}>{title}</Text>
            <Text style={actSt.subtitle}>{subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={color} style={{ opacity: 0.7 }} />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  header: {
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: spacing.lg,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  brandLeft: { flex: 0 },

  brandName: {
    fontSize: 22,
    color: ORANGE,
    letterSpacing: 0.2,
  },

  headerGreeting: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 1 },
  locationText: { fontSize: 9, color: colors.textMuted, fontWeight: '600', letterSpacing: 0.4 },

  headerIconBtn: {
    width: 34, height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },

  sheet:        { flex: 1, backgroundColor: BG },
  sheetContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },

  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: 0 },

  fwFooter: {
    fontSize: 9, fontWeight: '700', letterSpacing: 1.8,
    color: colors.textMuted, textAlign: 'center', marginTop: 36,
    opacity: 0.5,
  },
});

// (heroSt removed — replaced by calSt for the split calories card)

// Section label accent
const secSt = StyleSheet.create({
  row:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  bar:  { width: 3, height: 14, backgroundColor: ORANGE, borderRadius: 2 },
  text: { fontSize: 11, fontWeight: '800', color: colors.textSecondary, letterSpacing: 1.4, textTransform: 'uppercase' },
});

// Stat cards (protein + water)
const statSt = StyleSheet.create({
  card: {
    flex: 1, backgroundColor: CARD,
    borderRadius: radius.md, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: colors.cardBorder,
    marginBottom: spacing.sm,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.20, shadowRadius: 10, elevation: 3,
  },
  value: { fontSize: 24, fontWeight: '900', letterSpacing: -0.8 },
  unit:  { fontSize: 12, fontWeight: '700', opacity: 0.8 },
  label: {
    fontSize: 9, fontWeight: '800', color: colors.textMuted,
    letterSpacing: 1.3, textTransform: 'uppercase', marginTop: 4, marginBottom: 10,
  },
  barBg: {
    width: '100%', height: 4, backgroundColor: colors.cardBorder,
    borderRadius: 2, overflow: 'hidden', marginBottom: 6,
  },
  barFill: { height: 4, borderRadius: 2 },
  target: { fontSize: 10, color: colors.textMuted, fontWeight: '600' },
});

// Apple Health card
const hlSt = StyleSheet.create({
  card: {
    backgroundColor: CARD,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000000', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.20, shadowRadius: 10, elevation: 2,
  },
  metric: {
    flex: 1, alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: 4,
  },
  metricValue: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  metricUnit:  { fontSize: 10, fontWeight: '600', color: colors.textSecondary },
  metricLabel: {
    fontSize: 9, fontWeight: '700', color: colors.textMuted,
    letterSpacing: 1.1, textTransform: 'uppercase', marginTop: 4,
  },
  divider: { width: 1, backgroundColor: colors.cardBorder, marginVertical: 12 },
  unavailableNote: {
    fontSize: 11, color: colors.textMuted,
    marginBottom: 8, paddingHorizontal: spacing.xs,
  },
  settingsBtn: {
    marginLeft: 'auto' as any,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  settingsBtnText: { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  connectCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: CARD, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.cardBorder, padding: spacing.md, marginBottom: spacing.sm,
    shadowColor: '#000000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.1, shadowRadius: 10,
  },
  connectTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary, marginBottom: 3 },
  connectSub:   { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
});

// Recovery card
const recSt = StyleSheet.create({
  card: {
    backgroundColor: CARD, borderRadius: radius.lg, borderWidth: 1,
    padding: spacing.lg, marginBottom: spacing.sm,
    shadowColor: '#000000', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1, shadowRadius: 14, elevation: 4,
  },
  topRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  sectionLabel: { fontSize: 9, fontWeight: '800', color: colors.textMuted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 },
  label:      { fontSize: 20, fontWeight: '900', color: colors.textPrimary, letterSpacing: -0.4 },
  scoreWrap:  { alignItems: 'flex-end' },
  scoreNum:   { fontSize: 36, fontWeight: '900', letterSpacing: -1.5, lineHeight: 38 },
  scoreUnit:  { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  barBg:      { width: '100%', height: 6, backgroundColor: colors.cardBorder, borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  barFill:    { height: 6, borderRadius: 3 },
  summary:    { fontSize: 11, color: colors.textSecondary, fontWeight: '600', marginBottom: 10 },
  tipRow:     { borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 8 },
  tipText:    { fontSize: 12, fontWeight: '700', lineHeight: 18 },
});

// Calorie split card
const calSt = StyleSheet.create({
  wrapper: {
    backgroundColor: CARD, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.cardBorder, padding: spacing.md, marginBottom: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.30, shadowRadius: 6, elevation: 4,
  },
  topRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  todayLabel: { fontSize: 28, fontWeight: '900', color: ORANGE, letterSpacing: -0.5, lineHeight: 32 },
  streakChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.cardElevated, borderWidth: 1, borderColor: colors.cardBorderBright, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  streakNum:  { fontSize: 11, fontWeight: '800', color: colors.textPrimary },
  cols:       { flexDirection: 'row', gap: 0 },
  col:        { flex: 1, paddingHorizontal: 8 },
  divider:    { width: 1, backgroundColor: colors.cardBorder, marginVertical: 4 },
  colLabel:   { fontSize: 9, fontWeight: '800', color: colors.textMuted, letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 5 },
  colNum:     { fontSize: 42, fontWeight: '900', letterSpacing: -2, lineHeight: 44 },
  colTarget:  { fontSize: 11, color: colors.textMuted, fontWeight: '600', marginBottom: 10, marginTop: 2 },
  barBg:      { width: '100%', height: 4, backgroundColor: colors.cardBorder, borderRadius: 2, overflow: 'hidden', marginBottom: 4 },
  barFill:    { height: 4, borderRadius: 2 },
  pctText:    { fontSize: 10, fontWeight: '700', color: colors.textMuted, marginBottom: 8 },
  macroRow:   { flexDirection: 'row', gap: 6, marginBottom: 10, marginTop: 2 },
  macroPill:  { flexDirection: 'row', alignItems: 'center', gap: 2 },
  macroVal:   { fontSize: 12, fontWeight: '800' },
  macroKey:   { fontSize: 9, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5 },

  logMealBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: ORANGE, borderRadius: radius.md,
    paddingHorizontal: 12, paddingVertical: 9,
    alignSelf: 'stretch', justifyContent: 'center',
    marginBottom: 7,
    shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.35, shadowRadius: 6,
  },
  logMealText:{ fontSize: 13, fontWeight: '900', color: colors.bg, letterSpacing: 0.2 },
  noDataNote: { fontSize: 10, color: colors.textMuted, fontStyle: 'italic', marginBottom: 8, lineHeight: 14 },
  netChip:    { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  netLabel:   { fontSize: 9, fontWeight: '800', color: colors.textMuted, letterSpacing: 1 },
  netNum:     { fontSize: 13, fontWeight: '900' },
  tapHint:    { fontSize: 9, color: colors.textMuted, fontStyle: 'italic', opacity: 0.7 },
});

// Calories modal
const cmSt = StyleSheet.create({
  root:    { flex: 1, backgroundColor: colors.bgSecondary },
  header:  { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.cardBorder, gap: 10 },
  closeBtn:{ padding: 4 },
  title:   { fontSize: 18, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.3 },
  todayNum:{ fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  todayUnit:{ fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  logBtn:  { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 8 },
  logBtnText: { fontSize: 13, fontWeight: '800', color: colors.bg },
  tabs:    { flexDirection: 'row', gap: 8, paddingHorizontal: spacing.lg, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  tab:     { flex: 1, alignItems: 'center', paddingVertical: 7, borderRadius: radius.full, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card },
  tabText: { fontSize: 12, fontWeight: '800', color: colors.textMuted, letterSpacing: 0.5 },
  content: { padding: spacing.lg, paddingBottom: 60 },
  loader:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  chart:   { marginBottom: spacing.lg },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', paddingBottom: 12 },
  barWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar:     { borderRadius: 3, minHeight: 0 },
  barLabel:{ fontSize: 8, color: colors.textMuted, marginTop: 3, fontWeight: '700' },
  targetLine: { position: 'absolute', left: 0, right: 0, height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: ORANGE + '60' },
  targetLineLabel: { position: 'absolute', right: 0, fontSize: 8, color: ORANGE, fontWeight: '700', top: -10 },
  noData:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  noDataText: { color: colors.textMuted, fontSize: 13 },
  statsRow:{ flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  stat:    { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  statVal: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  statLabel:{ fontSize: 9, color: colors.textMuted, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 },
  healthNote: { flexDirection: 'row', gap: 6, backgroundColor: colors.card, borderRadius: radius.sm, padding: 10, borderWidth: 1, borderColor: colors.cardBorder },
  healthNoteText: { flex: 1, fontSize: 11, color: colors.textMuted, lineHeight: 16 },

  // Today section
  todaySection:     { padding: spacing.lg, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  todaySectionLabel:{ fontSize: 9, fontWeight: '800', color: colors.textMuted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 },
  todayRow:         { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 2 },
  todayBigNum:      { fontSize: 52, fontWeight: '900', letterSpacing: -2, lineHeight: 56 },
  todayBigUnit:     { fontSize: 17, fontWeight: '600', color: colors.textSecondary, paddingBottom: 10 },
  todayGoalText:    { fontSize: 11, color: colors.textMuted, fontWeight: '600', marginBottom: 6 },
  todayBarBg:       { width: '100%', height: 6, backgroundColor: colors.cardBorder, borderRadius: 3, overflow: 'hidden', marginBottom: 14 },
  todayBarFill:     { height: 6, borderRadius: 3 },
  macroSection:     { gap: 9 },
  macroRow:         { gap: 3 },
  macroLabelRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  macroName:        { fontSize: 12, fontWeight: '800', letterSpacing: 0.2 },
  macroValues:      { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  macroBarBg:       { width: '100%', height: 5, backgroundColor: colors.cardBorder, borderRadius: 2.5, overflow: 'hidden' },
  macroBarFill:     { height: 5, borderRadius: 2.5 },
  todayNoData:      { fontSize: 12, color: colors.textMuted, fontStyle: 'italic', marginTop: 4 },
});

// Habit Article card
const coachSt = StyleSheet.create({
  card: {
    backgroundColor: CARD, borderRadius: radius.lg, borderWidth: 1,
    borderColor: colors.cardBorder, padding: spacing.lg + 4, marginBottom: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.30, shadowRadius: 6,
  },
  headerRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tagWrap:     { flexDirection: 'row', alignItems: 'center' },
  tagPill:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.cardElevated, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.cardBorderBright },
  tag:         { fontSize: 12, fontWeight: '900', color: '#8A8A8A', letterSpacing: 1.8, textTransform: 'uppercase' },

  articleTitle:  { fontSize: 22, fontWeight: '900', color: colors.textPrimary, letterSpacing: -0.5, marginBottom: 10, lineHeight: 28 },
  articleTeaser: { fontSize: 14, color: colors.textSecondary, lineHeight: 22, marginBottom: 12 },

  readMoreRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  readMoreText: { fontSize: 13, fontWeight: '800', color: ORANGE },

  challengeRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.cardElevated, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorderBright, paddingHorizontal: 14, paddingVertical: 14 },
  challengeEmoji: { fontSize: 28 },
  challengeLabel: { fontSize: 9, fontWeight: '800', color: '#8A8A8A', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 4 },
  challengeText:  { fontSize: 15, fontWeight: '700', color: colors.textPrimary, lineHeight: 20 },
});

// Habit Article modal
const hmSt = StyleSheet.create({
  header:    { alignItems: 'center', paddingTop: 12, paddingHorizontal: spacing.lg, paddingBottom: 10 },
  handle:    { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.cardBorder, marginBottom: 10 },
  closeBtn:  { alignSelf: 'flex-end', padding: 4 },
  content:   { padding: spacing.lg, paddingBottom: 60 },
  badge:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.cardElevated, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 5, alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.cardBorderBright, marginBottom: 14 },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#8A8A8A', letterSpacing: 1.8, textTransform: 'uppercase' },
  title:     { fontSize: 24, fontWeight: '900', color: colors.textPrimary, letterSpacing: -0.5, marginBottom: 16, lineHeight: 30 },
  body:      { fontSize: 15, color: colors.textPrimary, lineHeight: 24, marginBottom: 4 },
  source:    { fontSize: 11, color: colors.textMuted, fontStyle: 'italic', marginTop: 12, marginBottom: 20 },
  challenge: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: colors.cardElevated, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorderBright, padding: 14 },
  challengeEmoji: { fontSize: 28 },
  challengeLabel: { fontSize: 9, fontWeight: '900', color: '#8A8A8A', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 5 },
  challengeText:  { fontSize: 15, fontWeight: '700', color: colors.textPrimary, lineHeight: 22 },

  // Archive tab styles
  tabBtn:          { paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.full, borderWidth: 1, borderColor: colors.cardBorder },
  tabBtnActive:    { backgroundColor: colors.cardElevated, borderColor: colors.cardBorderBright },
  tabText:         { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  tabTextActive:   { color: colors.textPrimary },
  archiveList:     { width: 180, borderRightWidth: 1, borderRightColor: colors.cardBorder },
  archiveRow:      { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  archiveRowActive:{ backgroundColor: colors.cardElevated },
  archiveTitle:    { fontSize: 13, fontWeight: '700', color: colors.textPrimary, lineHeight: 18 },
  archiveToday:    { fontSize: 9, fontWeight: '800', color: '#8A8A8A', letterSpacing: 1.5, marginTop: 3 },
});

// Action cards
const actSt = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 3,
  },
  cardInner: {
    minHeight: 78,
    justifyContent: 'center',
    backgroundColor: CARD,
  },
  cardImage: { opacity: 0.32 },
  overlay:    { ...StyleSheet.absoluteFillObject },
  leftBorder: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    paddingLeft: spacing.md + 4,
  },
  iconWrap: { width: 50, height: 50, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  title:    { fontSize: 16, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.2 },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.60)', marginTop: 3 },
});
