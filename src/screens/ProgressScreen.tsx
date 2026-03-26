import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, Dimensions, Modal, TextInput,
  KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius, typography } from '@/theme';
import {
  getWorkoutLog, getStreak, todayStr, getFoodLog,
  getWeightLog, addWeightEntry,
  WorkoutLogEntry, WeightEntry, StreakData,
} from '@/lib/storage';

// ─── Constants ───────────────────────────────────────────────────────────────
const SCREEN_W   = Dimensions.get('window').width;
const H_MARGIN   = spacing.lg;   // card left/right margin
const C_PAD      = spacing.lg;   // card internal padding
const CHART_W    = SCREEN_W - H_MARGIN * 2 - C_PAD * 2;  // usable chart width
const Y_LABEL_W  = 32;                                     // left axis label gutter
const WEIGHT_H   = 170;
const VOLUME_H   = 130;
const ORANGE     = colors.orange;

// ─── Volume Zone ─────────────────────────────────────────────────────────────
function getVolumeZone(lbs: number): { label: string; color: string } {
  if (lbs === 0)       return { label: 'Rest',          color: colors.textMuted };
  if (lbs < 5_000)     return { label: 'Deload',        color: '#6B7280' };
  if (lbs < 15_000)    return { label: 'Maintain',      color: colors.blue };
  if (lbs < 35_000)    return { label: 'Productive',    color: colors.green };
  return                      { label: 'Overreaching',  color: colors.red };
}

function getTrainingBadge(thisWeek: number, prevAvg: number) {
  const z = getVolumeZone(thisWeek);
  if (z.label === 'Productive' && thisWeek > prevAvg * 1.05)
    return { label: 'Productive Growth Phase', color: colors.green,  icon: 'trending-up-outline' };
  if (z.label === 'Productive')
    return { label: 'In Productive Zone',      color: colors.green,  icon: 'checkmark-circle-outline' };
  if (z.label === 'Overreaching')
    return { label: 'High Load — Rest Soon',   color: colors.red,    icon: 'warning-outline' };
  if (z.label === 'Maintain')
    return { label: 'Maintenance Phase',       color: colors.blue,   icon: 'remove-circle-outline' };
  if (z.label === 'Deload')
    return { label: 'Deload Week',             color: '#9CA3AF',     icon: 'moon-outline' };
  return   { label: 'Rest Week',               color: colors.textMuted, icon: 'bed-outline' };
}

// ─── Weight Trend ─────────────────────────────────────────────────────────────
function getWeightTrend(entries: WeightEntry[]) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const recent = sorted.slice(-7);
  if (recent.length < 2) return { label: 'Keep logging', direction: 'flat' as const, delta: 0 };
  const delta = recent[recent.length - 1].weightLbs - recent[0].weightLbs;
  if (delta < -0.4) return { label: `Down ${Math.abs(delta).toFixed(1)} lbs (7d)`, direction: 'down' as const, delta };
  if (delta > 0.4)  return { label: `Up ${delta.toFixed(1)} lbs (7d)`,             direction: 'up'   as const, delta };
  return                   { label: 'Steady Progress',                              direction: 'flat' as const, delta };
}

// ─── Weekly Volume Builder ────────────────────────────────────────────────────
function buildWeeklyVolumes(logs: WorkoutLogEntry[]) {
  return Array.from({ length: 8 }, (_, i) => {
    const weekEnd   = new Date();
    weekEnd.setDate(weekEnd.getDate() - (7 - i) * 7 + 6);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    const vol = logs
      .filter(l => { const d = new Date(l.date); return d >= weekStart && d <= weekEnd; })
      .reduce((sum, log) =>
        sum + log.exercises.reduce((es, ex) =>
          es + ex.sets.reduce((ss, s) =>
            ss + (s.weightKg || 0) * (s.reps || 0) * 2.20462, 0), 0), 0);

    const mo  = weekEnd.toLocaleDateString('en-US', { month: 'short' });
    const day = weekEnd.getDate();
    return { label: `${mo.slice(0, 1)}${day}`, volume: Math.round(vol) };
  });
}

// ─── Pure-View Line Segment ───────────────────────────────────────────────────
function Seg({ x1, y1, x2, y2, color = ORANGE, thick = 2.5 }:
  { x1: number; y1: number; x2: number; y2: number; color?: string; thick?: number }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.5) return null;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return (
    <View style={{
      position: 'absolute',
      left: (x1 + x2) / 2 - len / 2,
      top:  (y1 + y2) / 2 - thick / 2,
      width: len, height: thick,
      backgroundColor: color,
      transform: [{ rotate: `${angle}deg` }],
    }} />
  );
}

// ─── Weight Line Chart ────────────────────────────────────────────────────────
function WeightChart({ entries, width, height }: {
  entries: WeightEntry[]; width: number; height: number;
}) {
  if (entries.length < 2) {
    return (
      <View style={{ width, height, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Ionicons name="scale-outline" size={32} color={colors.textMuted} />
        <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '600' }}>
          Log your weight to see the trend
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 11 }}>
          Tap "Log Weight" above to start
        </Text>
      </View>
    );
  }

  const data = [...entries].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
  const vals = data.map(e => e.weightLbs);

  // Nice bounds — buffer by 15% of range, minimum 2 lb window
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const rawRange = Math.max(maxV - minV, 2);
  const pad = rawRange * 0.25;
  const lo  = minV - pad;
  const hi  = maxV + pad;
  const range = hi - lo;

  const cW  = width - Y_LABEL_W;  // drawable chart area (right of y-labels)
  const toX = (i: number) =>
    Y_LABEL_W + (data.length < 2 ? cW / 2 : (i / (data.length - 1)) * cW);
  const toY = (v: number) => ((hi - v) / range) * height;

  const pts = vals.map((v, i) => ({ x: toX(i), y: toY(v) }));

  // 7-day rolling average
  const avgPts = vals.map((_, i) => {
    const sl = vals.slice(Math.max(0, i - 6), i + 1);
    return { x: toX(i), y: toY(sl.reduce((s, v) => s + v, 0) / sl.length) };
  });

  const last = pts[pts.length - 1];

  // 4 evenly-spaced y-axis ticks
  const Y_TICKS = 4;
  const tickVals = Array.from({ length: Y_TICKS }, (_, i) =>
    lo + (range * i / (Y_TICKS - 1))
  );

  // X-axis date labels: first, middle, last
  const xIdxs = [0, Math.floor((data.length - 1) / 2), data.length - 1]
    .filter((v, i, a) => a.indexOf(v) === i);

  const BOTTOM_PAD = 20; // space for x-axis labels

  return (
    <View style={{ width, height: height + BOTTOM_PAD, position: 'relative' }}>

      {/* ── Y-axis grid lines + labels ─────────────────────── */}
      {tickVals.map((val, i) => {
        const y = toY(val);
        return (
          <React.Fragment key={`yt${i}`}>
            <View style={{
              position: 'absolute', left: Y_LABEL_W, top: y,
              width: cW, height: 1,
              backgroundColor: i === 0 ? colors.cardBorderBright : colors.card,
            }} />
            <Text style={{
              position: 'absolute', left: 0, top: y - 7,
              width: Y_LABEL_W - 5,
              fontSize: 9, fontWeight: '700',
              color: colors.textMuted, textAlign: 'right',
            }}>
              {Math.round(val)}
            </Text>
          </React.Fragment>
        );
      })}

      {/* ── Rolling-average trend line (lighter, thinner) ──── */}
      {avgPts.slice(0, -1).map((p, i) => (
        <Seg key={`a${i}`} x1={p.x} y1={p.y} x2={avgPts[i+1].x} y2={avgPts[i+1].y}
          color={colors.orangeLight + '55'} thick={1.5} />
      ))}

      {/* ── Main weight line ───────────────────────────────── */}
      {pts.slice(0, -1).map((p, i) => (
        <Seg key={`l${i}`} x1={p.x} y1={p.y} x2={pts[i+1].x} y2={pts[i+1].y} thick={2.5} />
      ))}

      {/* ── Small dot at each data point ──────────────────── */}
      {pts.map((p, i) => {
        const isLast = i === pts.length - 1;
        if (isLast) return null; // drawn separately below
        return (
          <View key={`d${i}`} style={{
            position: 'absolute',
            left: p.x - 3, top: p.y - 3,
            width: 6, height: 6, borderRadius: 3,
            backgroundColor: ORANGE,
            borderWidth: 1.5, borderColor: colors.card,
            opacity: 0.55,
          }} />
        );
      })}

      {/* ── Latest value callout ────────────────────────────── */}
      {(() => {
        const labelX = Math.min(Math.max(last.x - 28, Y_LABEL_W), width - 64);
        const labelY = last.y < 26 ? last.y + 14 : last.y - 28;
        const arrowDown = last.y >= 26;
        return (
          <View style={{
            position: 'absolute', left: labelX, top: labelY,
            backgroundColor: ORANGE, borderRadius: radius.sm,
            paddingHorizontal: 8, paddingVertical: 4,
          }}>
            <Text style={{ color: colors.bg, fontSize: 11, fontWeight: '900' }}>
              {vals[vals.length - 1].toFixed(1)} lbs
            </Text>
            {arrowDown && (
              <View style={{
                position: 'absolute', bottom: -5, left: '50%',
                marginLeft: -5,
                borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 5,
                borderLeftColor: 'transparent', borderRightColor: 'transparent',
                borderTopColor: ORANGE,
              }} />
            )}
          </View>
        );
      })()}

      {/* ── End dot — large, glowing ───────────────────────── */}
      <View style={{
        position: 'absolute', left: last.x - 6, top: last.y - 6,
        width: 12, height: 12, borderRadius: 6,
        backgroundColor: ORANGE, borderWidth: 2.5, borderColor: colors.card,
        shadowColor: ORANGE, shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7, shadowRadius: 8,
      }} />

      {/* ── X-axis date labels ─────────────────────────────── */}
      {xIdxs.map(i => {
        const d = new Date(data[i].date + 'T00:00:00');
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const isLast = i === data.length - 1;
        return (
          <Text key={`xl${i}`} style={{
            position: 'absolute',
            left: toX(i) - 22, top: height + 4,
            width: 44,
            fontSize: 9, fontWeight: isLast ? '700' : '600',
            color: isLast ? colors.textSecondary : colors.textMuted,
            textAlign: 'center',
          }}>
            {label}
          </Text>
        );
      })}
    </View>
  );
}

// ─── Volume Bar Chart ─────────────────────────────────────────────────────────
function VolumeChart({ weeks, width, height }: {
  weeks: { label: string; volume: number }[]; width: number; height: number;
}) {
  const maxVol   = Math.max(...weeks.map(w => w.volume), 1);
  const cW       = width - Y_LABEL_W;
  const slotW    = cW / weeks.length;
  const barW     = Math.floor(slotW * 0.60);
  const barGap   = (slotW - barW) / 2;
  const BOTTOM   = 18; // space for x-labels

  // Nice round y ceiling
  const yMax = (() => {
    const ceil = maxVol * 1.22;
    if (ceil < 5000)  return 5000;
    if (ceil < 10000) return 10000;
    if (ceil < 20000) return 20000;
    if (ceil < 40000) return 40000;
    return Math.ceil(ceil / 10000) * 10000;
  })();

  const toGridY = (val: number) => height - (val / yMax) * height;
  const toBarH  = (vol: number) => Math.max(4, (vol / yMax) * height);

  // Y ticks: 4 levels
  const yTicks = [0, Math.round(yMax * 0.33), Math.round(yMax * 0.66), yMax];

  return (
    <View style={{ width, height: height + BOTTOM, position: 'relative' }}>

      {/* ── Y-axis grid + labels ──────────────────────────── */}
      {yTicks.map((val, i) => {
        const y = toGridY(val);
        const label = val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`;
        return (
          <React.Fragment key={`vt${i}`}>
            <View style={{
              position: 'absolute', left: Y_LABEL_W, top: y,
              width: cW, height: 1,
              backgroundColor: i === 0 ? colors.cardBorderBright : colors.card,
            }} />
            <Text style={{
              position: 'absolute', left: 0, top: y - 7,
              width: Y_LABEL_W - 5,
              fontSize: 9, fontWeight: '700',
              color: colors.textMuted, textAlign: 'right',
            }}>
              {label}
            </Text>
          </React.Fragment>
        );
      })}

      {/* ── Zone threshold dashes (colored) ──────────────── */}
      {([5000, 15000, 35000] as const).map(t => {
        if (t >= yMax) return null;
        const y = toGridY(t);
        const { color } = getVolumeZone(t + 1);
        return (
          <View key={`zt${t}`} style={{
            position: 'absolute', left: Y_LABEL_W, top: y,
            width: cW, height: 1,
            backgroundColor: color, opacity: 0.4,
          }} />
        );
      })}

      {/* ── Bars ─────────────────────────────────────────── */}
      {weeks.map((w, i) => {
        const barH      = toBarH(w.volume);
        const barTop    = height - barH;
        const x         = Y_LABEL_W + i * slotW + barGap;
        const { color } = getVolumeZone(w.volume);
        const isNow     = i === weeks.length - 1;

        return (
          <View key={i}>
            {/* Bar body */}
            <View style={{
              position: 'absolute',
              left: x, top: barTop,
              width: barW, height: barH,
              backgroundColor: isNow ? color : color + '88',
              borderTopLeftRadius: 5, borderTopRightRadius: 5,
              borderBottomLeftRadius: 2, borderBottomRightRadius: 2,
              ...(isNow ? {
                shadowColor: color,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.55, shadowRadius: 10,
                elevation: 5,
              } : {}),
            }} />

            {/* Volume label on top of this week's bar */}
            {isNow && w.volume > 0 && (
              <Text style={{
                position: 'absolute',
                left: x + barW / 2 - 20,
                top: barTop - 18,
                width: 40,
                fontSize: 9, fontWeight: '900',
                color: color, textAlign: 'center',
              }}>
                {w.volume >= 1000 ? `${(w.volume / 1000).toFixed(0)}k` : `${w.volume}`}
              </Text>
            )}

            {/* X-axis label */}
            <Text style={{
              position: 'absolute',
              left: x - barGap, top: height + 4,
              width: slotW,
              fontSize: 9,
              fontWeight: isNow ? '800' : '500',
              color: isNow ? colors.textSecondary : colors.textMuted,
              textAlign: 'center',
            }}>
              {w.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Stat Pill ────────────────────────────────────────────────────────────────
function StatPill({ icon, value, label, color = ORANGE }: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: string; label: string; color?: string;
}) {
  return (
    <View style={st.pill}>
      <Ionicons name={icon} size={15} color={color} />
      <Text style={[st.pillValue, { color }]}>{value}</Text>
      <Text style={st.pillLabel}>{label}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProgressScreen() {
  const insets = useSafeAreaInsets();

  const [weightLog,    setWeightLog]    = useState<WeightEntry[]>([]);
  const [workoutLogs,  setWorkoutLogs]  = useState<WorkoutLogEntry[]>([]);
  const [streak,       setStreak]       = useState<StreakData>({ current: 0, longest: 0, lastWorkoutDate: null });
  const [weeklyVols,   setWeeklyVols]   = useState<{ label: string; volume: number }[]>([]);
  const [refreshing,   setRefreshing]   = useState(false);

  // Weight modal
  const [weightModal,  setWeightModal]  = useState(false);
  const [weightInput,  setWeightInput]  = useState('');
  const [saving,       setSaving]       = useState(false);

  async function loadData() {
    const [wl, logs, strk] = await Promise.all([
      getWeightLog(),
      getWorkoutLog(),
      getStreak(),
    ]);
    setWeightLog(wl);
    setWorkoutLogs(logs);
    setStreak(strk);
    setWeeklyVols(buildWeeklyVolumes(logs));
  }

  useFocusEffect(useCallback(() => { loadData(); }, []));

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  async function handleLogWeight() {
    const lbs = parseFloat(weightInput);
    if (isNaN(lbs) || lbs < 50 || lbs > 700) return;
    setSaving(true);
    await addWeightEntry({ date: todayStr(), weightLbs: lbs, loggedAt: new Date().toISOString() });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await loadData();
    setSaving(false);
    setWeightModal(false);
    setWeightInput('');
  }

  // Derived
  const latestWeight  = weightLog[0]?.weightLbs ?? null;
  const startWeight   = weightLog.length > 1
    ? [...weightLog].sort((a, b) => a.date.localeCompare(b.date))[0].weightLbs
    : null;
  const totalDelta    = latestWeight && startWeight ? latestWeight - startWeight : null;
  const weightTrend   = getWeightTrend(weightLog);

  const thisWeekVol   = weeklyVols[weeklyVols.length - 1]?.volume ?? 0;
  const prevVols      = weeklyVols.slice(0, -1).map(w => w.volume).filter(v => v > 0);
  const prevAvgVol    = prevVols.length ? prevVols.reduce((s, v) => s + v, 0) / prevVols.length : 0;
  const trainingBadge = getTrainingBadge(thisWeekVol, prevAvgVol);
  const thisWeekZone  = getVolumeZone(thisWeekVol);

  const thisWeekWorkouts = workoutLogs.filter(l => {
    const d = new Date(l.date);
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  });

  const recentWorkouts = workoutLogs.slice(0, 8);
  const lastWorkout    = workoutLogs[0];

  return (
    <View style={[st.root, { backgroundColor: colors.bg }]}>
      {/* ── Header ── */}
      <View style={[st.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={st.headerRow}>
          <View>
            <Text style={st.headerTitle}>Progress</Text>
            <Text style={st.headerSub}>
              {streak.current > 0 ? `${streak.current} day streak · ` : ''}
              {lastWorkout
                ? `Last trained ${(() => {
                    const d = Math.floor((Date.now() - new Date(lastWorkout.date).getTime()) / 86400000);
                    return d === 0 ? 'today' : d === 1 ? 'yesterday' : `${d}d ago`;
                  })()}`
                : 'No workouts yet'}
            </Text>
          </View>
          <TouchableOpacity style={st.headerBtn} onPress={() => setWeightModal(true)}>
            <Ionicons name="scale-outline" size={18} color={ORANGE} />
            <Text style={st.headerBtnText}>Log Weight</Text>
          </TouchableOpacity>
        </View>

        {/* Quick stat pills */}
        <View style={st.pillRow}>
          <StatPill icon="flame-outline"    value={`${streak.current}d`}    label="Streak" />
          <StatPill icon="barbell-outline"  value={`${thisWeekWorkouts.length}`} label="This wk" />
          <StatPill
            icon="trending-up-outline"
            value={thisWeekVol >= 1000 ? `${(thisWeekVol / 1000).toFixed(0)}k` : `${thisWeekVol}`}
            label="Vol lbs"
            color={thisWeekZone.color}
          />
          {latestWeight && (
            <StatPill
              icon="scale-outline"
              value={`${latestWeight.toFixed(1)}`}
              label="lbs now"
              color={weightTrend.direction === 'down' ? colors.green : weightTrend.direction === 'up' ? colors.red : colors.textSecondary}
            />
          )}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ORANGE} />}
      >

        {/* ── Weight Trend Card ── */}
        <View style={[st.card, { marginTop: spacing.lg }]}>
          <View style={st.cardTopRow}>
            <View>
              {latestWeight ? (
                <>
                  <Text style={st.cardBigNum}>{latestWeight.toFixed(1)}</Text>
                  <Text style={st.cardBigUnit}>lbs</Text>
                </>
              ) : (
                <Text style={st.cardBigNum}>— —</Text>
              )}
              {totalDelta !== null && (
                <Text style={[st.cardDelta, { color: totalDelta <= 0 ? colors.green : colors.red }]}>
                  {totalDelta <= 0 ? '▼' : '▲'} {Math.abs(totalDelta).toFixed(1)} lbs total
                </Text>
              )}
              <Text style={st.cardDateRange}>Last 30 days</Text>
            </View>
            <View style={[st.trendBadge, {
              backgroundColor: weightTrend.direction === 'down' ? colors.greenDim
                : weightTrend.direction === 'up' ? colors.redDim : colors.orangeDim,
            }]}>
              <Ionicons
                name={weightTrend.direction === 'down' ? 'trending-down-outline'
                  : weightTrend.direction === 'up' ? 'trending-up-outline' : 'remove-outline'}
                size={13}
                color={weightTrend.direction === 'down' ? colors.green
                  : weightTrend.direction === 'up' ? colors.red : ORANGE}
              />
              <Text style={[st.trendBadgeText, {
                color: weightTrend.direction === 'down' ? colors.green
                  : weightTrend.direction === 'up' ? colors.red : ORANGE,
              }]}>
                {weightTrend.label}
              </Text>
            </View>
          </View>

          <View style={st.chartContainer}>
            <WeightChart entries={weightLog} width={CHART_W} height={WEIGHT_H} />
          </View>

          {/* Trend analysis row */}
          {weightLog.length >= 2 && (
            <View style={st.analysisRow}>
              <View style={st.analysisItem}>
                <Text style={st.analysisLabel}>7-DAY TREND</Text>
                <Text style={[st.analysisValue, {
                  color: weightTrend.direction === 'down' ? colors.green
                    : weightTrend.direction === 'up' ? colors.red : colors.textSecondary,
                }]}>
                  {weightTrend.delta === 0 ? '0.0' : (weightTrend.delta > 0 ? '+' : '') + weightTrend.delta.toFixed(1)} lbs
                </Text>
              </View>
              <View style={st.analysisDivider} />
              <View style={st.analysisItem}>
                <Text style={st.analysisLabel}>ENTRIES</Text>
                <Text style={st.analysisValue}>{weightLog.length}</Text>
              </View>
              <View style={st.analysisDivider} />
              <View style={st.analysisItem}>
                <Text style={st.analysisLabel}>LOWEST</Text>
                <Text style={st.analysisValue}>
                  {weightLog.length ? Math.min(...weightLog.map(e => e.weightLbs)).toFixed(1) : '—'} lbs
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Training Load Card ── */}
        <View style={[st.card, { marginTop: spacing.md }]}>
          <View style={st.cardTopRow}>
            <View>
              <Text style={[st.cardBigNum, { color: thisWeekZone.color }]}>
                {thisWeekVol >= 1000
                  ? `${(thisWeekVol / 1000).toFixed(0)}k`
                  : `${thisWeekVol}`}
              </Text>
              <Text style={st.cardBigUnit}>lbs volume</Text>
              <Text style={st.cardDateRange}>This week</Text>
            </View>
            <View style={[st.trendBadge, { backgroundColor: thisWeekZone.color + '22' }]}>
              <Ionicons name={trainingBadge.icon as any} size={13} color={trainingBadge.color} />
              <Text style={[st.trendBadgeText, { color: trainingBadge.color }]}>
                {trainingBadge.label}
              </Text>
            </View>
          </View>

          <View style={st.chartContainer}>
            <VolumeChart weeks={weeklyVols} width={CHART_W} height={VOLUME_H} />
          </View>

          {/* Zone legend */}
          <View style={st.zoneLegend}>
            {[
              { label: 'Deload',       color: '#6B7280' },
              { label: 'Maintain',     color: colors.blue },
              { label: 'Productive',   color: colors.green },
              { label: 'Overreaching', color: colors.red },
            ].map(z => (
              <View key={z.label} style={st.zoneItem}>
                <View style={[st.zoneDot, { backgroundColor: z.color }]} />
                <Text style={st.zoneText}>{z.label}</Text>
              </View>
            ))}
          </View>

          {/* Weekly analysis */}
          {prevVols.length > 0 && (
            <View style={st.analysisRow}>
              <View style={st.analysisItem}>
                <Text style={st.analysisLabel}>VS PREV AVG</Text>
                <Text style={[st.analysisValue, {
                  color: thisWeekVol > prevAvgVol ? colors.green : colors.textSecondary,
                }]}>
                  {thisWeekVol > prevAvgVol ? '+' : ''}{Math.round(((thisWeekVol / (prevAvgVol || 1)) - 1) * 100)}%
                </Text>
              </View>
              <View style={st.analysisDivider} />
              <View style={st.analysisItem}>
                <Text style={st.analysisLabel}>8-WK AVG</Text>
                <Text style={st.analysisValue}>
                  {Math.round(weeklyVols.reduce((s, w) => s + w.volume, 0) / 8 / 1000)}k lbs
                </Text>
              </View>
              <View style={st.analysisDivider} />
              <View style={st.analysisItem}>
                <Text style={st.analysisLabel}>ZONE</Text>
                <Text style={[st.analysisValue, { color: thisWeekZone.color }]}>
                  {thisWeekZone.label}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Recent Workouts ── */}
        <View style={st.sectionHeader}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={st.sectionTitle}>RECENT WORKOUTS</Text>
        </View>

        {recentWorkouts.length === 0 ? (
          <View style={st.emptyState}>
            <Ionicons name="barbell-outline" size={44} color={colors.textMuted} />
            <Text style={st.emptyText}>No workouts logged yet</Text>
            <Text style={st.emptySub}>Complete a workout to see it here</Text>
          </View>
        ) : (
          recentWorkouts.map((log, idx) => {
            const sets = log.exercises.reduce((s, ex) => s + ex.sets.length, 0);
            const vol  = Math.round(
              log.exercises.reduce((s, ex) =>
                s + ex.sets.reduce((ss, set) =>
                  ss + (set.weightKg || 0) * (set.reps || 0) * 2.20462, 0), 0)
            );
            const dAgo = Math.floor((Date.now() - new Date(log.date).getTime()) / 86400000);
            return (
              <View key={log.id} style={[st.workoutRow, idx === recentWorkouts.length - 1 && { marginBottom: 0 }]}>
                <View style={st.workoutIconCol}>
                  <View style={st.workoutDot} />
                  {idx < recentWorkouts.length - 1 && <View style={st.workoutLine} />}
                </View>
                <View style={st.workoutBody}>
                  <View style={st.workoutTopRow}>
                    <Text style={st.workoutName}>{log.dayLabel}</Text>
                    <Text style={st.workoutAgo}>
                      {dAgo === 0 ? 'Today' : dAgo === 1 ? 'Yesterday' : `${dAgo}d ago`}
                    </Text>
                  </View>
                  <View style={st.workoutChips}>
                    <View style={st.chip}>
                      <Ionicons name="time-outline" size={10} color={colors.textMuted} />
                      <Text style={st.chipText}>{log.durationMinutes}m</Text>
                    </View>
                    <View style={st.chip}>
                      <Ionicons name="fitness-outline" size={10} color={colors.textMuted} />
                      <Text style={st.chipText}>{log.exercises.length} ex</Text>
                    </View>
                    <View style={st.chip}>
                      <Ionicons name="repeat-outline" size={10} color={colors.textMuted} />
                      <Text style={st.chipText}>{sets} sets</Text>
                    </View>
                    {vol > 0 && (
                      <View style={[st.chip, { borderColor: ORANGE + '44' }]}>
                        <Text style={[st.chipText, { color: ORANGE }]}>
                          {vol >= 1000 ? `${(vol / 1000).toFixed(0)}k` : vol} lbs
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ── Log Weight Modal ── */}
      <Modal visible={weightModal} transparent animationType="slide">
        <Pressable style={st.modalOverlay} onPress={() => setWeightModal(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ width: '100%' }}
          >
            <Pressable style={st.modalSheet}>
              <View style={st.modalHandle} />
              <Text style={st.modalTitle}>Log Weight</Text>
              <Text style={st.modalSub}>Today · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>

              <View style={st.weightInputRow}>
                <TextInput
                  style={st.weightInput}
                  value={weightInput}
                  onChangeText={setWeightInput}
                  keyboardType="decimal-pad"
                  placeholder={latestWeight ? `${latestWeight.toFixed(1)}` : '185.0'}
                  placeholderTextColor={colors.textMuted}
                  autoFocus
                  selectTextOnFocus
                />
                <Text style={st.weightUnit}>lbs</Text>
              </View>

              {latestWeight && (
                <Text style={st.modalHint}>Last logged: {latestWeight.toFixed(1)} lbs</Text>
              )}

              <TouchableOpacity
                style={[st.modalBtn, (!weightInput || saving) && { opacity: 0.5 }]}
                onPress={handleLogWeight}
                disabled={!weightInput || saving}
              >
                <Text style={st.modalBtnText}>{saving ? 'Saving…' : 'Save Weight'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={st.modalCancel} onPress={() => setWeightModal(false)}>
                <Text style={st.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  headerTitle: { ...typography.h1, color: colors.textPrimary },
  headerSub:   { fontSize: 13, color: colors.textSecondary, marginTop: 3 },
  headerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.orangeDim,
    borderRadius: radius.full, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.orangeBorder,
  },
  headerBtnText: { fontSize: 13, fontWeight: '700', color: ORANGE },

  pillRow: { flexDirection: 'row', gap: 8 },
  pill: {
    flex: 1, alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.cardBorder,
    paddingVertical: 8, gap: 2,
  },
  pillValue: { fontSize: 16, fontWeight: '900', letterSpacing: -0.5 },
  pillLabel: { fontSize: 9, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' },

  // Cards
  card: {
    marginHorizontal: H_MARGIN,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: C_PAD,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  cardBigNum:  { fontSize: 44, fontWeight: '900', color: ORANGE, letterSpacing: -1.5, lineHeight: 48 },
  cardBigUnit: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginTop: -2 },
  cardDelta:   { fontSize: 12, fontWeight: '700', marginTop: 4 },
  cardDateRange: { fontSize: 11, color: colors.textMuted, marginTop: 4, fontWeight: '600' },

  trendBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 5,
    maxWidth: 180,
  },
  trendBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.2, flexShrink: 1 },

  chartContainer: {
    marginTop: spacing.sm,
    borderRadius: radius.md,
    overflow: 'hidden',
  },

  // Zone legend
  zoneLegend: { flexDirection: 'row', gap: 12, marginTop: spacing.md, flexWrap: 'wrap' },
  zoneItem:   { flexDirection: 'row', alignItems: 'center', gap: 5 },
  zoneDot:    { width: 7, height: 7, borderRadius: 3.5 },
  zoneText:   { fontSize: 10, color: colors.textMuted, fontWeight: '600' },

  // Analysis row
  analysisRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  analysisItem:    { flex: 1, alignItems: 'center' },
  analysisLabel:   { fontSize: 9, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 },
  analysisValue:   { fontSize: 14, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.3 },
  analysisDivider: { width: 1, backgroundColor: colors.cardBorder },

  // Section header
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginHorizontal: H_MARGIN, marginTop: spacing.xl, marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.4, textTransform: 'uppercase' },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  emptyText:  { ...typography.h3, color: colors.textPrimary },
  emptySub:   { fontSize: 13, color: colors.textMuted },

  // Workout rows — timeline style
  workoutRow: {
    flexDirection: 'row',
    marginHorizontal: H_MARGIN,
    marginBottom: spacing.sm,
  },
  workoutIconCol: { width: 24, alignItems: 'center', paddingTop: 4 },
  workoutDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: ORANGE, borderWidth: 2, borderColor: colors.bg,
  },
  workoutLine: {
    flex: 1, width: 2, backgroundColor: colors.cardBorder,
    marginTop: 4, marginBottom: -4,
  },
  workoutBody: {
    flex: 1, marginLeft: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  workoutTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  workoutName:   { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  workoutAgo:    { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  workoutChips:  { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.xs, borderWidth: 1, borderColor: colors.cardBorder,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  chipText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },

  // Weight modal
  modalOverlay: {
    flex: 1, justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  modalSheet: {
    backgroundColor: colors.bgSecondary,
    borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    borderWidth: 1, borderBottomWidth: 0, borderColor: colors.cardBorder,
    padding: spacing.xl,
    paddingBottom: spacing.xl + 20,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.cardBorder,
    alignSelf: 'center', marginBottom: spacing.xl,
  },
  modalTitle: { ...typography.h2, color: colors.textPrimary, textAlign: 'center' },
  modalSub:   { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: 4, marginBottom: spacing.xl },

  weightInputRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 12, marginBottom: spacing.md },
  weightInput: {
    fontSize: 56, fontWeight: '900', color: ORANGE,
    letterSpacing: -2, textAlign: 'center',
    minWidth: 160,
    borderBottomWidth: 2, borderBottomColor: ORANGE,
    paddingBottom: 4,
  },
  weightUnit: { fontSize: 24, fontWeight: '700', color: colors.textSecondary },

  modalHint: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xl },

  modalBtn: {
    backgroundColor: ORANGE, borderRadius: radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: ORANGE, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45, shadowRadius: 14,
  },
  modalBtnText:    { fontSize: 17, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
  modalCancel:     { alignItems: 'center', marginTop: spacing.lg },
  modalCancelText: { fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
});
