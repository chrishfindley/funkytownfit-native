import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, Share, Alert, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius, typography } from '@/theme';
import { getSession } from '@/lib/auth';
import { getProfile } from '@/lib/storage';
import {
  getOrCreateInviteCode,
  getMyClients,
  buildClientSummary,
  TrainerRelationship,
  ClientSummary,
} from '@/lib/trainer';

// ─── Stat Pill ────────────────────────────────────────────────────────────────
function MiniStat({ label, value, color = colors.textPrimary }: {
  label: string; value: string; color?: string;
}) {
  return (
    <View style={s.miniStat}>
      <Text style={[s.miniStatVal, { color }]}>{value}</Text>
      <Text style={s.miniStatLabel}>{label}</Text>
    </View>
  );
}

// ─── Client Card ──────────────────────────────────────────────────────────────
function ClientCard({ summary, onPress }: {
  summary: ClientSummary;
  onPress: () => void;
}) {
  const { relationship: rel, recentWorkouts, lastWorkoutDate, todayCalories, latestWeightLbs, streak } = summary;

  const lastSeen = lastWorkoutDate
    ? (() => {
        const d = Math.floor((Date.now() - new Date(lastWorkoutDate + 'T00:00:00').getTime()) / 86400000);
        return d === 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d}d ago`;
      })()
    : 'No workouts yet';

  const initials = (rel.clientName ?? 'C')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <TouchableOpacity style={s.clientCard} onPress={onPress} activeOpacity={0.82}>
      {/* Avatar + name */}
      <View style={s.clientCardTop}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.clientName}>{rel.clientName ?? 'Client'}</Text>
          <View style={s.lastSeenRow}>
            <View style={[s.statusDot, { backgroundColor: recentWorkouts > 0 ? colors.green : colors.textMuted }]} />
            <Text style={s.lastSeenText}>Last workout: {lastSeen}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>

      {/* Stats row */}
      <View style={s.clientStatsRow}>
        <MiniStat label="This wk" value={`${recentWorkouts}`} color={recentWorkouts >= 3 ? colors.green : colors.orange} />
        <View style={s.statDivider} />
        <MiniStat label="Streak" value={`${streak}d`} color={streak >= 5 ? colors.orange : colors.textPrimary} />
        <View style={s.statDivider} />
        <MiniStat label="Today kcal" value={todayCalories > 0 ? `${Math.round(todayCalories)}` : '—'} />
        <View style={s.statDivider} />
        <MiniStat label="Weight" value={latestWeightLbs ? `${latestWeightLbs.toFixed(1)}` : '—'} />
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function TrainerDashboardScreen() {
  const insets   = useSafeAreaInsets();
  const nav      = useNavigation<any>();

  const [userId,      setUserId]      = useState<string | null>(null);
  const [inviteCode,  setInviteCode]  = useState<string | null>(null);
  const [summaries,   setSummaries]   = useState<ClientSummary[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);

  async function loadData() {
    const session = await getSession();
    if (!session) return;
    setUserId(session.id);

    const profile = await getProfile();
    const trainerName = profile?.name ?? 'Trainer';

    const [{ code }, clients] = await Promise.all([
      getOrCreateInviteCode(session.id, trainerName),
      getMyClients(session.id),
    ]);

    setInviteCode(code);

    // Build summaries concurrently
    const summaryList = await Promise.all(
      clients.map(rel => buildClientSummary(rel))
    );
    setSummaries(summaryList);
    setLoading(false);
  }

  useFocusEffect(useCallback(() => {
    setLoading(true);
    loadData();
  }, []));

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  async function handleShareCode() {
    if (!inviteCode) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `Join me on Funkytown Fit! Use code ${inviteCode} to connect with me as your trainer. 🤠`,
        title: 'Funkytown Fit Invite',
      });
    } catch { /* dismissed */ }
  }

  async function handleRefreshCode() {
    if (!userId) return;
    setCodeLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Delete existing pending code and create a new one
    const profile = await getProfile();
    const { code } = await getOrCreateInviteCode(userId, profile?.name ?? 'Trainer');
    setInviteCode(code);
    setCodeLoading(false);
  }

  return (
    <View style={[s.root, { backgroundColor: colors.bg }]}>

      {/* ── Header ── */}
      <View style={[s.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={s.headerTitle}>Trainer Dashboard</Text>
        <Text style={s.headerSub}>
          {summaries.length === 0
            ? 'Share your code to add clients'
            : `${summaries.length} active client${summaries.length !== 1 ? 's' : ''}`}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl + 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.orange} />}
      >

        {/* ── Invite Code Card ── */}
        <View style={s.inviteCard}>
          <View style={s.inviteHeader}>
            <View>
              <Text style={s.inviteTitle}>Your Invite Code</Text>
              <Text style={s.inviteSub}>Share this with clients to connect</Text>
            </View>
            <TouchableOpacity onPress={handleRefreshCode} style={s.refreshCodeBtn} disabled={codeLoading}>
              {codeLoading
                ? <ActivityIndicator size="small" color={colors.orange} />
                : <Ionicons name="refresh-outline" size={18} color={colors.orange} />
              }
            </TouchableOpacity>
          </View>

          {/* Code display */}
          <View style={s.codeBox}>
            {inviteCode
              ? inviteCode.split('').map((ch, i) => (
                  <View key={i} style={s.codeChar}>
                    <Text style={s.codeCharText}>{ch}</Text>
                  </View>
                ))
              : <ActivityIndicator color={colors.orange} />
            }
          </View>

          {/* Share button */}
          <TouchableOpacity style={s.shareBtn} onPress={handleShareCode} activeOpacity={0.85}>
            <Ionicons name="share-outline" size={16} color={colors.bg} />
            <Text style={s.shareBtnText}>Share Invite Link</Text>
          </TouchableOpacity>
        </View>

        {/* ── Client List ── */}
        <View style={s.sectionHeader}>
          <Ionicons name="people-outline" size={14} color={colors.textMuted} />
          <Text style={s.sectionTitle}>MY CLIENTS</Text>
        </View>

        {loading ? (
          <View style={s.emptyState}>
            <ActivityIndicator color={colors.orange} size="large" />
          </View>
        ) : summaries.length === 0 ? (
          <View style={s.emptyState}>
            <Ionicons name="people-outline" size={48} color={colors.textMuted} />
            <Text style={s.emptyTitle}>No clients yet</Text>
            <Text style={s.emptySub}>
              Share your invite code above.{'\n'}
              When your client enters it in their{'\n'}
              Profile → Connect to Trainer, they'll appear here.
            </Text>
          </View>
        ) : (
          summaries.map(summary => (
            <ClientCard
              key={summary.relationship.id}
              summary={summary}
              onPress={() => nav.navigate('ClientDetail', {
                clientId:   summary.relationship.clientId!,
                clientName: summary.relationship.clientName ?? 'Client',
              })}
            />
          ))
        )}

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1 },

  header: {
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerTitle: { ...typography.h1 },
  headerSub:   { fontSize: 13, color: colors.textSecondary, marginTop: 3 },

  // ── Invite card ─────────────────────────────────────────────────
  inviteCard: {
    margin: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.orangeBorder,
    padding: spacing.lg,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 6,
  },
  inviteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  inviteTitle: { ...typography.h3 },
  inviteSub:   { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  refreshCodeBtn: {
    padding: 8,
    backgroundColor: colors.orangeDim,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.orangeBorder,
  },

  codeBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },
  codeChar: {
    width: 42,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.bgSecondary,
    borderWidth: 1.5,
    borderColor: colors.orangeBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeCharText: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.orange,
    letterSpacing: -0.5,
  },

  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.orange,
    borderRadius: radius.full,
    paddingVertical: 14,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 5,
  },
  shareBtnText: { fontSize: 15, fontWeight: '800', color: colors.bg },

  // ── Section header ──────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 11, fontWeight: '700',
    color: colors.textMuted, letterSpacing: 1.4,
    textTransform: 'uppercase',
  },

  // ── Empty state ─────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 10,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: { ...typography.h3 },
  emptySub:   {
    fontSize: 13, color: colors.textMuted,
    textAlign: 'center', lineHeight: 20,
  },

  // ── Client card ─────────────────────────────────────────────────
  clientCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  clientCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.orangeDim,
    borderWidth: 1.5, borderColor: colors.orangeBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '900', color: colors.orange },
  clientName: { ...typography.h3, marginBottom: 3 },
  lastSeenRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  lastSeenText: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },

  clientStatsRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: spacing.sm,
  },
  miniStat: { flex: 1, alignItems: 'center', gap: 2 },
  miniStatVal:   { fontSize: 16, fontWeight: '900', letterSpacing: -0.4 },
  miniStatLabel: { fontSize: 9, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' },
  statDivider: { width: 1, backgroundColor: colors.cardBorder },
});
