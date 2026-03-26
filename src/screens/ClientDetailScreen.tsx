import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, RefreshControl, Alert, ActivityIndicator,
  Modal, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius, typography } from '@/theme';
import { getSession } from '@/lib/auth';
import {
  getClientWorkouts,
  getClientNutrition,
  getClientWeightLog,
  getClientProfile,
  getAssignedWorkoutsForTrainer,
  assignWorkout,
  AssignedExercise,
  AssignedWorkout,
  ClientWorkoutEntry,
  ClientDayNutrition,
} from '@/lib/trainer';

type RouteParams = { clientId: string; clientName: string };

// ─── Tab names ────────────────────────────────────────────────────────────────
type TabId = 'overview' | 'workouts' | 'nutrition' | 'assign';

const TABS: { id: TabId; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { id: 'overview',   label: 'Overview',   icon: 'grid-outline'       },
  { id: 'workouts',   label: 'Workouts',   icon: 'barbell-outline'    },
  { id: 'nutrition',  label: 'Nutrition',  icon: 'restaurant-outline' },
  { id: 'assign',     label: 'Assign',     icon: 'add-circle-outline' },
];

// ─── Macro bar ────────────────────────────────────────────────────────────────
function MacroBar({ label, grams, color, total }: {
  label: string; grams: number; color: string; total: number;
}) {
  const pct = total > 0 ? Math.min((grams / total) * 100, 100) : 0;
  return (
    <View style={{ marginBottom: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
        <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textSecondary }}>{label}</Text>
        <Text style={{ fontSize: 11, fontWeight: '800', color }}>{Math.round(grams)}g</Text>
      </View>
      <View style={{ height: 5, backgroundColor: colors.card, borderRadius: 3, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: 3 }} />
      </View>
    </View>
  );
}

// ─── Assign workout modal ─────────────────────────────────────────────────────
function AssignModal({
  trainerId, clientId, clientName,
  onClose, onSent,
}: {
  trainerId: string; clientId: string; clientName: string;
  onClose: () => void; onSent: () => void;
}) {
  const [title,    setTitle]    = useState('');
  const [note,     setNote]     = useState('');
  const [date,     setDate]     = useState('');
  const [exercises, setExercises] = useState<AssignedExercise[]>([
    { name: '', sets: 3, reps: '8-12' },
  ]);
  const [saving, setSaving] = useState(false);

  function updateEx(i: number, field: keyof AssignedExercise, val: any) {
    setExercises(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  }

  function addEx() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExercises(prev => [...prev, { name: '', sets: 3, reps: '8-12' }]);
  }

  function removeEx(i: number) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExercises(prev => prev.filter((_, idx) => idx !== i));
  }

  async function handleSend() {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Give this workout a name');
      return;
    }
    const validExs = exercises.filter(e => e.name.trim());
    if (!validExs.length) {
      Alert.alert('No exercises', 'Add at least one exercise');
      return;
    }
    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { error } = await assignWorkout({
      trainerId,
      clientId,
      title: title.trim(),
      coachNote: note.trim() || undefined,
      exercises: validExs,
      targetDate: date.trim() || undefined,
      status: 'pending',
    });
    setSaving(false);
    if (error) {
      Alert.alert('Error', error);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSent();
  }

  return (
    <Modal visible animationType="slide" transparent>
      <Pressable style={ms.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%' }}
        >
          <Pressable style={ms.sheet}>
            <View style={ms.handle} />
            <Text style={ms.sheetTitle}>Assign Workout to {clientName}</Text>

            {/* Title */}
            <Text style={ms.label}>Workout Title *</Text>
            <TextInput
              style={ms.input}
              placeholder="e.g. Upper Body Pull Day"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            {/* Target date */}
            <Text style={ms.label}>Target Date (optional)</Text>
            <TextInput
              style={ms.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textMuted}
              value={date}
              onChangeText={setDate}
            />

            {/* Coach note */}
            <Text style={ms.label}>Coach Note (optional)</Text>
            <TextInput
              style={[ms.input, { minHeight: 70, textAlignVertical: 'top' }]}
              placeholder="Motivation, focus cues, anything for your client..."
              placeholderTextColor={colors.textMuted}
              value={note}
              onChangeText={setNote}
              multiline
            />

            {/* Exercises */}
            <Text style={ms.label}>Exercises *</Text>
            <ScrollView style={{ maxHeight: 260 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
              {exercises.map((ex, i) => (
                <View key={i} style={ms.exRow}>
                  <View style={{ flex: 1, gap: 6 }}>
                    <TextInput
                      style={ms.input}
                      placeholder={`Exercise ${i + 1} name`}
                      placeholderTextColor={colors.textMuted}
                      value={ex.name}
                      onChangeText={v => updateEx(i, 'name', v)}
                    />
                    <View style={ms.exMeta}>
                      <View style={{ flex: 1 }}>
                        <Text style={ms.exMetaLabel}>Sets</Text>
                        <TextInput
                          style={ms.inputSm}
                          keyboardType="numeric"
                          value={String(ex.sets)}
                          onChangeText={v => updateEx(i, 'sets', parseInt(v) || 1)}
                          placeholderTextColor={colors.textMuted}
                        />
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text style={ms.exMetaLabel}>Reps / Duration</Text>
                        <TextInput
                          style={ms.inputSm}
                          placeholder="8-12 or 30s"
                          placeholderTextColor={colors.textMuted}
                          value={ex.reps}
                          onChangeText={v => updateEx(i, 'reps', v)}
                        />
                      </View>
                    </View>
                    <TextInput
                      style={ms.inputSm}
                      placeholder="Notes (optional)"
                      placeholderTextColor={colors.textMuted}
                      value={ex.notes ?? ''}
                      onChangeText={v => updateEx(i, 'notes', v)}
                    />
                  </View>
                  {exercises.length > 1 && (
                    <TouchableOpacity onPress={() => removeEx(i)} style={ms.removeEx}>
                      <Ionicons name="close-circle" size={20} color={colors.red} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={ms.addExBtn} onPress={addEx}>
              <Ionicons name="add-outline" size={16} color={colors.orange} />
              <Text style={ms.addExBtnText}>Add Exercise</Text>
            </TouchableOpacity>

            {/* Send button */}
            <TouchableOpacity
              style={[ms.sendBtn, saving && { opacity: 0.6 }]}
              onPress={handleSend}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color={colors.bg} size="small" />
                : <>
                    <Ionicons name="send-outline" size={16} color={colors.bg} />
                    <Text style={ms.sendBtnText}>Send to {clientName}</Text>
                  </>
              }
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ClientDetailScreen() {
  const insets = useSafeAreaInsets();
  const nav    = useNavigation();
  const route  = useRoute<RouteProp<{ ClientDetail: RouteParams }, 'ClientDetail'>>();
  const { clientId, clientName } = route.params;

  const [trainerId,   setTrainerId]   = useState<string | null>(null);
  const [activeTab,   setActiveTab]   = useState<TabId>('overview');
  const [profile,     setProfile]     = useState<any>(null);
  const [workouts,    setWorkouts]    = useState<ClientWorkoutEntry[]>([]);
  const [nutrition,   setNutrition]   = useState<ClientDayNutrition[]>([]);
  const [weightLog,   setWeightLog]   = useState<{ date: string; weightLbs: number }[]>([]);
  const [assigned,    setAssigned]    = useState<AssignedWorkout[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [showAssign,  setShowAssign]  = useState(false);

  async function loadData() {
    const session = await getSession();
    if (session) setTrainerId(session.id);

    const [p, w, n, wt, asgn] = await Promise.all([
      getClientProfile(clientId),
      getClientWorkouts(clientId, 30),
      getClientNutrition(clientId, 30),
      getClientWeightLog(clientId),
      session ? getAssignedWorkoutsForTrainer(session.id, clientId) : Promise.resolve([]),
    ]);

    setProfile(p);
    setWorkouts(w);
    setNutrition(n);
    setWeightLog(wt);
    setAssigned(asgn);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, [clientId]);

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  // ── Overview stats ──────────────────────────────────────────────
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().slice(0, 10);
  const todayStr = new Date().toISOString().slice(0, 10);

  const thisWeekWorkouts = workouts.filter(w => w.date >= weekAgoStr).length;
  const lastWorkout      = workouts[0];
  const todayNutrition   = nutrition.find(n => n.date === todayStr);
  const avgCalories      = nutrition.length
    ? Math.round(nutrition.reduce((s, d) => s + d.calories, 0) / nutrition.length)
    : 0;
  const avgProtein       = nutrition.length
    ? Math.round(nutrition.reduce((s, d) => s + d.proteinG, 0) / nutrition.length)
    : 0;
  const latestWeight     = weightLog[0]?.weightLbs;
  const weightDelta      = weightLog.length > 1
    ? weightLog[0].weightLbs - weightLog[weightLog.length - 1].weightLbs
    : null;

  const pendingAssigned  = assigned.filter(a => a.status === 'pending').length;

  // ── Render tab content ──────────────────────────────────────────
  function renderOverview() {
    return (
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.md }}>

        {/* Key metrics */}
        <View style={st.overviewGrid}>
          <View style={st.overviewCell}>
            <Text style={st.overviewNum}>{thisWeekWorkouts}</Text>
            <Text style={st.overviewLabel}>Workouts{'\n'}This Week</Text>
          </View>
          <View style={[st.overviewCell, st.overviewCellBorder]}>
            <Text style={[st.overviewNum, { color: colors.orange }]}>
              {lastWorkout
                ? (() => {
                    const d = Math.floor((Date.now() - new Date(lastWorkout.date + 'T00:00:00').getTime()) / 86400000);
                    return d === 0 ? 'Today' : d === 1 ? 'Yest.' : `${d}d`;
                  })()
                : '—'}
            </Text>
            <Text style={st.overviewLabel}>Last{'\n'}Workout</Text>
          </View>
          <View style={[st.overviewCell, st.overviewCellBorder]}>
            <Text style={[st.overviewNum, { color: colors.green }]}>
              {todayNutrition ? Math.round(todayNutrition.calories) : '—'}
            </Text>
            <Text style={st.overviewLabel}>Today's{'\n'}Calories</Text>
          </View>
          <View style={[st.overviewCell, st.overviewCellBorder]}>
            <Text style={[st.overviewNum, {
              color: latestWeight ? colors.textPrimary : colors.textMuted,
            }]}>
              {latestWeight ? latestWeight.toFixed(1) : '—'}
            </Text>
            <Text style={st.overviewLabel}>Current{'\n'}lbs</Text>
          </View>
        </View>

        {/* 30-day averages */}
        <View style={st.card}>
          <Text style={st.cardTitle}>30-Day Nutrition Averages</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[st.bigNum, { color: colors.orange }]}>{avgCalories}</Text>
              <Text style={st.bigNumLabel}>avg cal/day</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={[st.bigNum, { color: colors.blue }]}>{avgProtein}g</Text>
              <Text style={st.bigNumLabel}>avg protein</Text>
            </View>
            {weightDelta !== null && (
              <View style={{ alignItems: 'center' }}>
                <Text style={[st.bigNum, { color: weightDelta <= 0 ? colors.green : colors.red }]}>
                  {weightDelta > 0 ? '+' : ''}{weightDelta.toFixed(1)}
                </Text>
                <Text style={st.bigNumLabel}>lbs change</Text>
              </View>
            )}
          </View>
        </View>

        {/* Profile summary */}
        {profile && (
          <View style={st.card}>
            <Text style={st.cardTitle}>Client Profile</Text>
            <View style={{ gap: 6 }}>
              {[
                { label: 'Goals',      value: (profile.goals ?? []).join(', ').replace(/_/g, ' ') || '—' },
                { label: 'Experience', value: (profile.training_background ?? '—').replace(/_/g, ' ') },
                { label: 'Equipment',  value: (profile.equipment ?? '—').replace(/_/g, ' ') },
                { label: 'Schedule',   value: `${profile.days_per_week ?? '—'} days · ${profile.minutes_per_session ?? '—'} min` },
              ].map(r => (
                <View key={r.label} style={st.profileRow}>
                  <Text style={st.profileLabel}>{r.label}</Text>
                  <Text style={st.profileVal}>{r.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Pending assigned workouts */}
        {pendingAssigned > 0 && (
          <View style={[st.card, { borderColor: colors.orangeBorder }]}>
            <Text style={st.cardTitle}>
              <Ionicons name="send-outline" size={13} color={colors.orange} /> {' '}
              {pendingAssigned} assigned workout{pendingAssigned !== 1 ? 's' : ''} pending
            </Text>
            <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
              Switch to the Assign tab to view all
            </Text>
          </View>
        )}
      </View>
    );
  }

  function renderWorkouts() {
    return (
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.sm }}>
        {workouts.length === 0 ? (
          <View style={st.emptyState}>
            <Ionicons name="barbell-outline" size={44} color={colors.textMuted} />
            <Text style={st.emptyText}>No workouts logged yet</Text>
          </View>
        ) : (
          workouts.map(w => {
            const dAgo = Math.floor((Date.now() - new Date(w.date + 'T00:00:00').getTime()) / 86400000);
            return (
              <View key={w.id} style={st.workoutRow}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={st.workoutTitle}>{w.dayLabel}</Text>
                    <Text style={st.workoutAgo}>
                      {dAgo === 0 ? 'Today' : dAgo === 1 ? 'Yesterday' : `${dAgo}d ago`}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                    <View style={st.chip}>
                      <Ionicons name="time-outline" size={10} color={colors.textMuted} />
                      <Text style={st.chipText}>{w.durationMinutes}m</Text>
                    </View>
                    <View style={st.chip}>
                      <Ionicons name="fitness-outline" size={10} color={colors.textMuted} />
                      <Text style={st.chipText}>{w.exerciseCount} ex</Text>
                    </View>
                    {w.totalVolumeLbs > 0 && (
                      <View style={[st.chip, { borderColor: colors.orange + '44' }]}>
                        <Text style={[st.chipText, { color: colors.orange }]}>
                          {w.totalVolumeLbs >= 1000
                            ? `${(w.totalVolumeLbs / 1000).toFixed(0)}k lbs`
                            : `${w.totalVolumeLbs} lbs`}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    );
  }

  function renderNutrition() {
    return (
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.sm }}>
        {nutrition.length === 0 ? (
          <View style={st.emptyState}>
            <Ionicons name="restaurant-outline" size={44} color={colors.textMuted} />
            <Text style={st.emptyText}>No nutrition logged yet</Text>
          </View>
        ) : (
          nutrition.map(day => {
            const d = new Date(day.date + 'T00:00:00');
            const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const maxMacro = Math.max(day.proteinG, day.carbsG, day.fatG, 1);
            return (
              <View key={day.date} style={st.nutritionRow}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={st.nutritionDate}>{label}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[st.nutritionCal, { color: colors.orange }]}>
                      {Math.round(day.calories)} kcal
                    </Text>
                    {day.entryCount > 0 && (
                      <Text style={{ fontSize: 10, color: colors.textMuted }}>
                        {day.entryCount} items
                      </Text>
                    )}
                  </View>
                </View>
                <MacroBar label="Protein" grams={day.proteinG} color={colors.blue}  total={maxMacro * 3} />
                <MacroBar label="Carbs"   grams={day.carbsG}   color={colors.green} total={maxMacro * 3} />
                <MacroBar label="Fat"     grams={day.fatG}     color={colors.gold}  total={maxMacro * 3} />
              </View>
            );
          })
        )}
      </View>
    );
  }

  function renderAssign() {
    return (
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.md }}>

        {/* Assign new button */}
        {trainerId && (
          <TouchableOpacity
            style={st.assignNewBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowAssign(true);
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.bg} />
            <Text style={st.assignNewBtnText}>Create New Assignment</Text>
          </TouchableOpacity>
        )}

        {/* Past assignments */}
        <Text style={st.sectionLabel}>ALL ASSIGNMENTS</Text>

        {assigned.length === 0 ? (
          <View style={st.emptyState}>
            <Ionicons name="send-outline" size={44} color={colors.textMuted} />
            <Text style={st.emptyText}>No assignments yet</Text>
            <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
              Tap "Create New Assignment" above
            </Text>
          </View>
        ) : (
          assigned.map(a => {
            const statusColor = a.status === 'completed'
              ? colors.green
              : a.status === 'skipped'
              ? colors.red
              : colors.orange;
            const statusLabel = a.status === 'completed'
              ? '✓ Completed'
              : a.status === 'skipped'
              ? '✗ Skipped'
              : '● Pending';

            const assignedAgo = Math.floor(
              (Date.now() - new Date(a.assignedAt).getTime()) / 86400000
            );

            return (
              <View key={a.id} style={[st.assignedCard, { borderLeftColor: statusColor }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={st.assignedTitle}>{a.title}</Text>
                  <Text style={[st.assignedStatus, { color: statusColor }]}>{statusLabel}</Text>
                </View>
                {a.targetDate && (
                  <Text style={st.assignedMeta}>Target: {a.targetDate}</Text>
                )}
                {a.coachNote && (
                  <Text style={st.assignedNote}>"{a.coachNote}"</Text>
                )}
                <Text style={st.assignedMeta}>
                  {a.exercises.length} exercise{a.exercises.length !== 1 ? 's' : ''}
                  {' · '}
                  Sent {assignedAgo === 0 ? 'today' : `${assignedAgo}d ago`}
                </Text>

                {/* Exercise list */}
                <View style={{ marginTop: 8, gap: 4 }}>
                  {a.exercises.map((ex, i) => (
                    <View key={i} style={st.exListRow}>
                      <Text style={st.exListNum}>{i + 1}</Text>
                      <Text style={st.exListName}>{ex.name}</Text>
                      <Text style={st.exListMeta}>{ex.sets}×{ex.reps}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })
        )}
      </View>
    );
  }

  return (
    <View style={[st.root, { backgroundColor: colors.bg }]}>

      {/* ── Header ── */}
      <View style={[st.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity onPress={() => nav.goBack()} style={st.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={st.headerName}>{clientName}</Text>
          <Text style={st.headerSub}>Client · {workouts.length} workouts logged</Text>
        </View>
      </View>

      {/* ── Tabs ── */}
      <View style={st.tabRow}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[st.tabBtn, active && st.tabBtnActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab(tab.id);
              }}
            >
              <Ionicons name={tab.icon} size={14} color={active ? colors.orange : colors.textMuted} />
              <Text style={[st.tabLabel, active && st.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Content ── */}
      {loading ? (
        <View style={st.emptyState}>
          <ActivityIndicator color={colors.orange} size="large" />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl + 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.orange} />}
        >
          {activeTab === 'overview'  && renderOverview()}
          {activeTab === 'workouts'  && renderWorkouts()}
          {activeTab === 'nutrition' && renderNutrition()}
          {activeTab === 'assign'    && renderAssign()}
        </ScrollView>
      )}

      {/* Assign modal */}
      {showAssign && trainerId && (
        <AssignModal
          trainerId={trainerId}
          clientId={clientId}
          clientName={clientName}
          onClose={() => setShowAssign(false)}
          onSent={async () => {
            setShowAssign(false);
            await loadData();
            setActiveTab('assign');
          }}
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backBtn: { padding: 4 },
  headerName: { ...typography.h2 },
  headerSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingHorizontal: spacing.sm,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive:  { borderBottomColor: colors.orange },
  tabLabel:      { fontSize: 10, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5 },
  tabLabelActive: { color: colors.orange },

  // overview
  overviewGrid: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  overviewCell: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
  },
  overviewCellBorder: {
    borderLeftWidth: 1, borderLeftColor: colors.cardBorder,
  },
  overviewNum:   { fontSize: 22, fontWeight: '900', color: colors.textPrimary, letterSpacing: -0.5 },
  overviewLabel: { fontSize: 10, fontWeight: '600', color: colors.textMuted, textAlign: 'center', marginTop: 4, lineHeight: 14 },

  card: {
    backgroundColor: colors.card, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  cardTitle: { ...typography.h3, marginBottom: spacing.sm },

  bigNum:      { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  bigNumLabel: { fontSize: 10, fontWeight: '600', color: colors.textMuted, marginTop: 2 },

  profileRow:  { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  profileLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '700', flexShrink: 0 },
  profileVal:   { fontSize: 12, color: colors.textPrimary, fontWeight: '600', textAlign: 'right', flex: 1, textTransform: 'capitalize' },

  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  emptyText:  { ...typography.h3, color: colors.textPrimary },

  // workouts
  workoutRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  workoutTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  workoutAgo:   { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.xs, borderWidth: 1, borderColor: colors.cardBorder,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  chipText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },

  // nutrition
  nutritionRow: {
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  nutritionDate: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  nutritionCal:  { fontSize: 15, fontWeight: '900', letterSpacing: -0.3 },

  // assign tab
  assignNewBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.orange, borderRadius: radius.full,
    paddingVertical: 15,
    shadowColor: colors.orange, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45, shadowRadius: 12, elevation: 5,
  },
  assignNewBtnText: { fontSize: 15, fontWeight: '800', color: colors.bg },
  sectionLabel: {
    fontSize: 10, fontWeight: '700', color: colors.textMuted,
    letterSpacing: 1.6, textTransform: 'uppercase',
  },
  assignedCard: {
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.cardBorder,
    borderLeftWidth: 3,
    padding: spacing.md,
  },
  assignedTitle:  { ...typography.h3, flex: 1, marginRight: spacing.sm },
  assignedStatus: { fontSize: 11, fontWeight: '800' },
  assignedMeta:   { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  assignedNote:   {
    fontSize: 12, color: colors.textSecondary, fontStyle: 'italic',
    marginTop: 4, marginBottom: 2,
  },
  exListRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 4,
    borderTopWidth: 1, borderTopColor: colors.cardBorder,
  },
  exListNum:  { fontSize: 11, fontWeight: '700', color: colors.textMuted, width: 16 },
  exListName: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  exListMeta: { fontSize: 12, color: colors.orange, fontWeight: '700' },
});

// ─── Modal styles ─────────────────────────────────────────────────────────────
const ms = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  sheet: {
    backgroundColor: colors.bgSecondary,
    borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
    borderWidth: 1, borderBottomWidth: 0, borderColor: colors.cardBorder,
    padding: spacing.xl,
    paddingBottom: spacing.xl + 16,
    maxHeight: '92%',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.cardBorder,
    alignSelf: 'center', marginBottom: spacing.lg,
  },
  sheetTitle: { ...typography.h2, textAlign: 'center', marginBottom: spacing.lg },
  label: {
    fontSize: 11, fontWeight: '700', color: colors.textMuted,
    letterSpacing: 1.2, textTransform: 'uppercase',
    marginBottom: spacing.sm, marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    color: colors.textPrimary, fontSize: 14,
  },
  inputSm: {
    backgroundColor: colors.card, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.cardBorder,
    paddingHorizontal: spacing.sm, paddingVertical: 8,
    color: colors.textPrimary, fontSize: 13,
  },
  exRow: {
    flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm,
    backgroundColor: colors.bg, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.cardBorder,
    padding: spacing.sm,
  },
  exMeta: { flexDirection: 'row', gap: spacing.sm },
  exMetaLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted, marginBottom: 4 },
  removeEx: { justifyContent: 'flex-start', paddingTop: 6 },
  addExBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: colors.orangeBorder, borderStyle: 'dashed',
    borderRadius: radius.md, paddingVertical: 10,
    justifyContent: 'center', marginTop: 4,
  },
  addExBtnText: { fontSize: 13, fontWeight: '700', color: colors.orange },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.orange, borderRadius: radius.full,
    paddingVertical: 16, marginTop: spacing.lg,
    shadowColor: colors.orange, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45, shadowRadius: 12, elevation: 5,
  },
  sendBtnText: { fontSize: 16, fontWeight: '800', color: colors.bg },
});
