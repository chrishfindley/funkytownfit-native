import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Dimensions, Alert, Animated, ActivityIndicator, Linking,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as KeepAwake from 'expo-keep-awake';

import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';
import {
  addWorkoutLog, getWorkoutLog, updateStreak, todayStr, getProfile,
  CompletedSet, CompletedExercise, WorkoutLogEntry,
} from '@/lib/storage';
import { UserProfile } from '@/lib/types';
import {
  initHealthKit, subscribeHeartRate, saveWorkoutToHealthKit, healthKitAvailable,
} from '@/lib/healthkit';
import {
  getSpotifyToken, searchSpotify, playUri,
  SearchResultItem, PlayResult,
} from '@/lib/spotify';
import {
  ExDef, Program, getRepRange,
  buildPersonalizedPrograms, getWeekSchedule, getTodayDayIdx,
} from '@/lib/workoutPlanner';
import {
  getAssignedWorkoutsForClient, markAssignedWorkoutDone,
  markAssignedWorkoutSkipped, AssignedWorkout,
} from '@/lib/trainer';
import { getSession } from '@/lib/auth';

// ── Spotify deep-link helper ──────────────────────────────────────────────────
async function openInSpotify(uri: string): Promise<void> {
  const canOpen = await Linking.canOpenURL('spotify:');
  const webUrl = uri
    .replace('spotify:track:', 'https://open.spotify.com/track/')
    .replace('spotify:playlist:', 'https://open.spotify.com/playlist/')
    .replace('spotify:show:', 'https://open.spotify.com/show/')
    .replace('spotify:episode:', 'https://open.spotify.com/episode/');
  await Linking.openURL(canOpen ? uri : webUrl);
}
void openInSpotify; // suppress unused warning if Spotify section is inactive

const { width: SW } = Dimensions.get('window');
const ORANGE = '#F97316';
const BG     = colors.bg;
const CARD   = colors.card;

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface SplashMsg { line1: string; line2: string; }
const SPLASH_MESSAGES: SplashMsg[] = [
  { line1: "LET'S",    line2: "GO!! 🚀"       },
  { line1: "COWTOWN",  line2: "IRON 💪"        },
  { line1: "TIME TO",  line2: "GRIND 🔥"       },
  { line1: "BUILT IN", line2: "FORT WORTH ⭐"  },
  { line1: "NO DAYS",  line2: "OFF 🤠"         },
  { line1: "BEAST",    line2: "MODE ON 🦁"     },
  { line1: "WORKOUT",  line2: "TIME! ⚡"       },
  { line1: "RISE &",   line2: "GRIND ☀️"       },
  { line1: "ONE MORE", line2: "SET 🏋️"         },
  { line1: "STAY",     line2: "RUGGED 🤘"      },
  { line1: "EARN IT",  line2: "TODAY 💯"       },
  { line1: "PUSH",     line2: "HARDER 🔝"      },
  { line1: "GRIT &",   line2: "GLORY 🏆"       },
  { line1: "COWTOWN",  line2: "STRONG 💪"      },
  { line1: "IT'S",     line2: "GO TIME ⏱️"     },
];

const REST_PRESETS = [
  { label: ':30',  secs: 30  },
  { label: ':45',  secs: 45  },
  { label: '1:00', secs: 60  },
  { label: '1:30', secs: 90  },
  { label: '2:00', secs: 120 },
  { label: '3:00', secs: 180 },
];

type Phase = 'schedule' | 'detail' | 'splash' | 'active' | 'done';

// ── Component ─────────────────────────────────────────────────────────────────
export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();

  // ── Profile & programs ─────────────────────────────────────────────────────
  const [profile, setProfile]               = useState<UserProfile | null>(null);
  const [programs, setPrograms]             = useState<Program[]>([]);
  const [weekSchedule, setWeekSchedule]     = useState<(Program | null)[]>(Array(7).fill(null));
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(getTodayDayIdx());

  // ── Phase & selected workout ────────────────────────────────────────────────
  const [phase, setPhase]                   = useState<Phase>('schedule');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [editMode, setEditMode]             = useState(false);
  const [editExercises, setEditExercises]   = useState<ExDef[]>([]);

  // ── Splash ─────────────────────────────────────────────────────────────────
  const splashScale   = useRef(new Animated.Value(0.7)).current;
  const splashOpacity = useRef(new Animated.Value(0)).current;
  const [splashMsgIdx] = useState(() => Math.floor(Math.random() * SPLASH_MESSAGES.length));

  // ── Active workout state ────────────────────────────────────────────────────
  const [program, setProgram]               = useState<Program | null>(null);
  const [activeExercises, setActiveExercises] = useState<ExDef[]>([]);
  const [exIdx, setExIdx]                   = useState(0);
  const [sessionSets, setSessionSets]       = useState<Record<string, CompletedSet[]>>({});
  const [prevSession, setPrevSession]       = useState<Record<string, CompletedSet[]>>({});
  const [weightVal, setWeightVal]           = useState(0);
  const [repsVal, setRepsVal]               = useState(8);
  const [elapsedSecs, setElapsedSecs]       = useState(0);
  const [clockStarted, setClockStarted]     = useState(false);
  const [saving, setSaving]                 = useState(false);

  // ── Last time / PR ─────────────────────────────────────────────────────────
  const [lastSets, setLastSets]             = useState<CompletedSet[]>([]);
  const [showPR, setShowPR]                 = useState(false);
  const [prWeight, setPrWeight]             = useState(0);

  // ── Heart rate ─────────────────────────────────────────────────────────────
  const [heartRate, setHeartRate]           = useState<number | null>(null);
  const hrFlashAnim = useRef(new Animated.Value(0)).current;
  const hrAnimRef   = useRef<Animated.CompositeAnimation | null>(null);

  // ── Rest timer ─────────────────────────────────────────────────────────────
  const [restTotalSecs, setRestTotalSecs]   = useState(90);
  const [restTimeLeft, setRestTimeLeft]     = useState(90);
  const [restRunning, setRestRunning]       = useState(false);

  // ── Assigned workouts from trainer ─────────────────────────────────────────
  const [assignedWorkouts, setAssignedWorkouts] = useState<AssignedWorkout[]>([]);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Spotify ────────────────────────────────────────────────────────────────
  const [spotifyToken,   setSpotifyToken]   = useState<string | null>(null);
  const [spotifyQuery,   setSpotifyQuery]   = useState('');
  const [spotifyResults, setSpotifyResults] = useState<SearchResultItem[]>([]);
  const [spotifyLoading, setSpotifyLoading] = useState(false);
  const [playingUri,     setPlayingUri]     = useState<string | null>(null);
  const [playStatus,     setPlayStatus]     = useState<PlayResult | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const startTime = useRef<number>(0);

  // ── Load profile, programs, week schedule (+ quick-start) ─────────────────
  useFocusEffect(useCallback(() => {
    (async () => {
      const p = await getProfile();
      setProfile(p);
      const progs = buildPersonalizedPrograms(p);
      setPrograms(progs);
      const daysPerWeek = (p as any)?.daysPerWeek ?? 3;
      setWeekSchedule(getWeekSchedule(progs, daysPerWeek));

      // Load trainer-assigned workouts
      const session = await getSession();
      if (session) {
        const asgn = await getAssignedWorkoutsForClient(session.id);
        setAssignedWorkouts(asgn.filter(a => a.status === 'pending'));
      }

      // Quick-start from Dashboard's "Today's Workout" card
      const quickId = await AsyncStorage.getItem('ftf_quick_start_id');
      if (quickId) {
        await AsyncStorage.removeItem('ftf_quick_start_id');
        const found = progs.find(pr => pr.id === quickId);
        if (found) {
          setSelectedProgram(found);
          setEditExercises(found.exercises.map(e => ({ ...e })));
          setEditMode(false);
          setPhase('detail');
        }
      }
    })();
  }, []));

  // ── Keep screen on during workout ──────────────────────────────────────────
  useEffect(() => {
    if (phase === 'active') {
      KeepAwake.activateKeepAwakeAsync();
    } else {
      KeepAwake.deactivateKeepAwake();
    }
    return () => { KeepAwake.deactivateKeepAwake(); };
  }, [phase]);

  // ── HealthKit heart rate subscription ─────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active') return;
    let cleanup: (() => void) | undefined;
    (async () => {
      if (healthKitAvailable) {
        await initHealthKit();
        cleanup = subscribeHeartRate(bpm => setHeartRate(bpm), 4000);
      }
    })();
    return () => { cleanup?.(); };
  }, [phase]);

  // ── HR flash overlay animation ─────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active' || heartRate === null || !profile) {
      hrAnimRef.current?.stop();
      hrFlashAnim.setValue(0);
      return;
    }
    const age   = (profile as any).age ?? 30;
    const maxHR = 220 - age;
    const pct   = heartRate / maxHR;
    if (pct < 0.85) {
      hrAnimRef.current?.stop();
      hrFlashAnim.setValue(0);
      return;
    }
    const speed   = pct >= 0.95 ? 600 : 1200;   // red is faster
    const opacity = pct >= 0.95 ? 0.35 : 0.22;
    hrAnimRef.current?.stop();
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(hrFlashAnim, { toValue: opacity, duration: speed / 2, useNativeDriver: true }),
        Animated.timing(hrFlashAnim, { toValue: 0,       duration: speed / 2, useNativeDriver: true }),
      ])
    );
    hrAnimRef.current = anim;
    anim.start();
    return () => { anim.stop(); };
  }, [heartRate, phase, profile]);

  // ── Elapsed timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active' || !clockStarted) return;
    const id = setInterval(() => {
      setElapsedSecs(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [phase, clockStarted]);

  // ── Rest countdown: hits 0 → reset & wait (no auto-restart) ───────────────
  useEffect(() => {
    if (!restRunning) return;
    if (restTimeLeft <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setRestRunning(false);
      setRestTimeLeft(restTotalSecs);
      return;
    }
    const t = setTimeout(() => setRestTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [restRunning, restTimeLeft, restTotalSecs]);

  // ── Spotify token ──────────────────────────────────────────────────────────
  useEffect(() => {
    getSpotifyToken().then(t => { if (t) setSpotifyToken(t.accessToken); });
  }, []);

  // ── Splash animation ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'splash') return;
    splashScale.setValue(0.7);
    splashOpacity.setValue(0);
    Animated.parallel([
      Animated.spring(splashScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(splashOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(() => launchActive(), 2600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const fmt     = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const estCals = Math.round(elapsedSecs / 60 * 7);

  function showToast(msg: string, ms = 2200) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), ms);
  }

  async function loadLastSets(exerciseName: string) {
    try {
      const logs = await getWorkoutLog();
      for (let i = logs.length - 1; i >= 0; i--) {
        const match = logs[i].exercises?.find(
          ex => ex.name.toLowerCase() === exerciseName.toLowerCase(),
        );
        if (match?.sets?.length) { setLastSets(match.sets); return; }
      }
      setLastSets([]);
    } catch { setLastSets([]); }
  }

  function openDetail(p: Program) {
    setSelectedProgram(p);
    setEditExercises(p.exercises.map(e => ({ ...e })));
    setEditMode(false);
    setPhase('detail');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  function beginSplash() {
    const valid = editExercises.filter(e => e.name.trim().length > 0);
    if (valid.length === 0) { Alert.alert('No exercises', 'Add at least one exercise.'); return; }
    setEditExercises(valid);
    setPhase('splash');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  async function launchActive() {
    const exs = editExercises.filter(e => e.name.trim().length > 0);
    const p: Program = { ...(selectedProgram!), exercises: exs };
    setProgram(p);
    setActiveExercises(exs);
    setExIdx(0);
    setSessionSets({});
    setWeightVal(exs[0]?.defaultLbs ?? 0);
    setRepsVal(8);
    const firstRest = exs[0]?.restSeconds || 90;
    setRestTotalSecs(firstRest);
    setRestTimeLeft(firstRest);
    setRestRunning(false);
    setClockStarted(false);
    startTime.current = Date.now();
    setElapsedSecs(0);

    const byName: Record<string, CompletedSet[]> = {};
    try {
      const allLogs = await getWorkoutLog();
      const prevLog = [...allLogs].reverse().find(log => log.dayLabel === p.label);
      if (prevLog) prevLog.exercises.forEach(ex => { byName[ex.name] = ex.sets; });
    } catch { /* ignore */ }
    setPrevSession(byName);
    loadLastSets(exs[0]?.name ?? '');

    setPhase('active');
    setTimeout(() => scrollRef.current?.scrollTo({ x: 0, animated: false }), 80);
  }

  function goToEx(idx: number) {
    if (!program) return;
    const c = Math.max(0, Math.min(idx, activeExercises.length - 1));
    setExIdx(c);
    setWeightVal(activeExercises[c]?.defaultLbs ?? 0);
    setRepsVal(8);
    const r = activeExercises[c]?.restSeconds || 90;
    setRestTotalSecs(r);
    setRestTimeLeft(r);
    setRestRunning(false);
    loadLastSets(activeExercises[c]?.name ?? '');
    scrollRef.current?.scrollTo({ x: c * SW, animated: true });
    Haptics.selectionAsync();
  }

  function onScrollEnd(e: { nativeEvent: { contentOffset: { x: number } } }) {
    if (!program) return;
    const newIdx = Math.round(e.nativeEvent.contentOffset.x / SW);
    if (newIdx !== exIdx && newIdx >= 0 && newIdx < activeExercises.length) {
      setExIdx(newIdx);
      setWeightVal(activeExercises[newIdx]?.defaultLbs ?? 0);
      setRepsVal(8);
      const r = activeExercises[newIdx]?.restSeconds || 90;
      setRestTotalSecs(r);
      setRestTimeLeft(r);
      setRestRunning(false);
      loadLastSets(activeExercises[newIdx]?.name ?? '');
    }
  }

  function logSet() {
    if (!program) return;
    const ex = activeExercises[exIdx];
    if (!ex) return;
    if (repsVal <= 0) { Alert.alert('Enter reps', 'How many reps did you do?'); return; }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newSets = [...(sessionSets[ex.name] ?? []), { reps: repsVal, weightKg: weightVal }];
    setSessionSets(prev => ({ ...prev, [ex.name]: newSets }));

    // PR check
    const prevMax = lastSets.length > 0 ? Math.max(...lastSets.map(s => s.weightKg)) : 0;
    if (weightVal > prevMax && prevMax > 0) {
      setPrWeight(weightVal);
      setShowPR(true);
      setTimeout(() => setShowPR(false), 2500);
    }

    // Start rest timer (skip if superset / restSeconds === 0)
    if (ex.restSeconds > 0) {
      setRestTotalSecs(ex.restSeconds);
      setRestTimeLeft(ex.restSeconds);
      setRestRunning(true);
    }

    // Auto-advance after all target sets are logged
    if (newSets.length >= ex.setsTarget) {
      const nextIdx = exIdx + 1;
      if (nextIdx < activeExercises.length) {
        const isSuperset = !!ex.groupId && ex.restSeconds === 0;
        const delay = isSuperset ? 400 : 1800;
        showToast(
          isSuperset
            ? `⚡ Superset! → ${activeExercises[nextIdx].name}`
            : `✓ All sets done! → ${activeExercises[nextIdx].name}`,
        );
        setTimeout(() => goToEx(nextIdx), delay);
      }
    }
  }

  function startClock() {
    startTime.current = Date.now();
    setClockStarted(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  function startRest() {
    if (restTimeLeft === 0) setRestTimeLeft(restTotalSecs);
    setRestRunning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  function stopRest() {
    setRestRunning(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function resetRest() {
    setRestRunning(false);
    setRestTimeLeft(restTotalSecs);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function selectRestPreset(secs: number) {
    setRestTotalSecs(secs);
    setRestTimeLeft(secs);
    setRestRunning(false);
    Haptics.selectionAsync();
  }

  async function handleSpotifySearch() {
    const q = spotifyQuery.trim();
    if (!q || !spotifyToken) return;
    setSpotifyResults([]);
    setPlayStatus(null);
    setSpotifyLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { items } = await searchSpotify(spotifyToken, q, 4);
    setSpotifyResults(items);
    setSpotifyLoading(false);
  }

  async function handlePlay(item: SearchResultItem) {
    if (!spotifyToken) return;
    const uri = item.data.uri;
    setPlayingUri(uri);
    setPlayStatus(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await playUri(spotifyToken, uri);
    setPlayStatus(result);
    if (result !== 'ok') setPlayingUri(null);
  }

  function cancelWorkout() {
    Alert.alert(
      'Cancel workout?',
      'No sets will be saved. You can start again whenever you\'re ready.',
      [
        { text: 'Keep going', style: 'cancel' },
        {
          text: 'Cancel workout',
          style: 'destructive',
          onPress: () => {
            // Clear all session state and return to schedule
            setSessionSets({});
            setExIdx(0);
            setElapsedSecs(0);
            setClockStarted(false);
            setRestRunning(false);
            setRestTimeLeft(90);
            setActiveExercises([]);
            setPhase('schedule');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ]
    );
  }

  async function finishWorkout() {
    if (!program) return;
    const hasAnySets = Object.values(sessionSets).some(s => s.length > 0);
    if (!hasAnySets) {
      Alert.alert(
        'No sets logged',
        'You haven\'t logged any sets yet.',
        [
          { text: 'Keep going', style: 'cancel' },
          { text: 'Cancel workout', style: 'destructive', onPress: cancelWorkout },
        ]
      );
      return;
    }
    setSaving(true);
    setRestRunning(false);
    const exercises: CompletedExercise[] = activeExercises
      .filter(ex => (sessionSets[ex.name]?.length ?? 0) > 0)
      .map(ex => ({ name: ex.name, sets: sessionSets[ex.name] ?? [], muscleGroups: [ex.muscle] }));
    const entry: WorkoutLogEntry = {
      id: Date.now().toString(),
      date: todayStr(),
      dayLabel: program.label,
      exercises,
      durationMinutes: Math.round(elapsedSecs / 60),
      completedAt: new Date().toISOString(),
    };
    await addWorkoutLog(entry);
    await updateStreak();
    if (healthKitAvailable) {
      const startISO = new Date(startTime.current).toISOString();
      const endISO   = new Date().toISOString();
      await saveWorkoutToHealthKit({ startDate: startISO, endDate: endISO, energyBurned: estCals });
    }
    setSaving(false);
    setPhase('done');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  const totalVolume    = Object.values(sessionSets).flat().reduce((s, set) => s + set.weightKg * set.reps, 0);
  const totalSetsCount = Object.values(sessionSets).flat().length;

  // HR overlay color
  const userAge  = (profile as any)?.age ?? 30;
  const maxHR    = 220 - userAge;
  const hrPct    = heartRate ? heartRate / maxHR : 0;
  const hrColor  = hrPct >= 0.95 ? '#FF0000' : '#FFCC00';

  // ═══════════════════════════════════════════════════════════════════════════
  // SCHEDULE VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 'schedule') {
    const today = getTodayDayIdx();
    return (
      <View style={{ flex: 1, backgroundColor: BG }}>
        <View style={[schSt.hero, { paddingTop: insets.top + 16 }]}>
          <Text style={schSt.heading}>Your Week 💪</Text>
          <Text style={schSt.sub}>Tap a day · Pick any workout · Get after it</Text>
        </View>

        {/* ── Week strip ─────────────────────────────────────────────────── */}
        <View style={schSt.weekStrip}>
          {DAY_NAMES.map((d, i) => {
            const prog       = weekSchedule[i];
            const isToday    = i === today;
            const isSelected = i === selectedDayIdx;
            return (
              <TouchableOpacity
                key={d}
                style={[
                  schSt.dayPill,
                  isSelected && schSt.dayPillSelected,
                  isToday && !isSelected && schSt.dayPillToday,
                ]}
                onPress={() => { setSelectedDayIdx(i); Haptics.selectionAsync(); }}
              >
                <Text style={[schSt.dayName, isSelected && { color: '#fff' }]}>{d}</Text>
                <Text style={schSt.dayEmoji}>{prog ? prog.emoji : '😴'}</Text>
                {isToday && (
                  <View style={[schSt.todayDot, isSelected && { backgroundColor: '#fff' }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Selected day ──────────────────────────────────────────────── */}
          {weekSchedule[selectedDayIdx] ? (
            <View style={schSt.dayCard}>
              <Text style={schSt.dayTitle}>
                {DAY_NAMES[selectedDayIdx]} · {weekSchedule[selectedDayIdx]!.label}
              </Text>
              <Text style={schSt.dayTag}>{weekSchedule[selectedDayIdx]!.tag}</Text>
              {weekSchedule[selectedDayIdx]!.exercises.map((ex, i) => (
                <View key={i} style={schSt.exRow}>
                  <Text style={schSt.exName}>{ex.name}</Text>
                  <Text style={schSt.exDetail}>{getRepRange(ex)} · {ex.muscle}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={schSt.viewBtn}
                onPress={() => openDetail(weekSchedule[selectedDayIdx]!)}
              >
                <Text style={schSt.viewBtnTxt}>View Workout →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={schSt.restCard}>
              <Text style={schSt.restEmoji}>😴</Text>
              <Text style={schSt.restText}>Rest Day</Text>
              <Text style={schSt.restSub}>Recovery is part of the program.</Text>
            </View>
          )}

          {/* ── Trainer assigned workouts ─────────────────────────────── */}
          {assignedWorkouts.length > 0 && (
            <>
              <Text style={[schSt.sectionLabel, { color: '#3B82F6', marginTop: 24 }]}>
                📋 FROM YOUR TRAINER
              </Text>
              {assignedWorkouts.map(aw => (
                <View key={aw.id} style={asSt.card}>
                  <View style={asSt.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={asSt.title}>{aw.title}</Text>
                      {aw.trainerName && (
                        <Text style={asSt.trainerName}>Assigned by {aw.trainerName}</Text>
                      )}
                      {aw.targetDate && (
                        <Text style={asSt.targetDate}>Target: {aw.targetDate}</Text>
                      )}
                    </View>
                    <View style={asSt.badge}>
                      <Text style={asSt.badgeText}>NEW</Text>
                    </View>
                  </View>

                  {aw.coachNote ? (
                    <Text style={asSt.note}>"{aw.coachNote}"</Text>
                  ) : null}

                  <View style={asSt.exList}>
                    {aw.exercises.map((ex, i) => (
                      <View key={i} style={asSt.exRow}>
                        <Text style={asSt.exNum}>{i + 1}</Text>
                        <Text style={asSt.exName}>{ex.name}</Text>
                        <Text style={asSt.exMeta}>{ex.sets}×{ex.reps}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={asSt.actions}>
                    <TouchableOpacity
                      style={asSt.doneBtn}
                      onPress={async () => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        const session = await getSession();
                        if (session) await markAssignedWorkoutDone(aw.id, session.id);
                        setAssignedWorkouts(prev => prev.filter(a => a.id !== aw.id));
                      }}
                    >
                      <Ionicons name="checkmark-circle-outline" size={15} color={colors.bg} />
                      <Text style={asSt.doneBtnText}>Mark Done</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={asSt.skipBtn}
                      onPress={async () => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        const session = await getSession();
                        if (session) await markAssignedWorkoutSkipped(aw.id, session.id);
                        setAssignedWorkouts(prev => prev.filter(a => a.id !== aw.id));
                      }}
                    >
                      <Text style={asSt.skipBtnText}>Skip</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* ── All programs ─────────────────────────────────────────────── */}
          <Text style={schSt.sectionLabel}>ALL PROGRAMS</Text>
          {programs.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[schSt.programCard, { borderLeftColor: p.color }]}
              onPress={() => openDetail(p)}
              activeOpacity={0.75}
            >
              <Text style={{ fontSize: 24 }}>{p.emoji}</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={schSt.programName}>{p.label}</Text>
                <Text style={schSt.programTag}>{p.tag} · ~{p.estMins} min</Text>
              </View>
              <Text style={{ color: p.color, fontSize: 20 }}>›</Text>
            </TouchableOpacity>
          ))}

          <Text style={schSt.footer}>TRINITY TRAIL · STOCKYARDS · COWTOWN IRON</Text>
        </ScrollView>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DETAIL + EDIT VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 'detail') {
    const exs = editExercises;
    return (
      <View style={{ flex: 1, backgroundColor: BG }}>
        {/* Header */}
        <View style={[detSt.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity onPress={() => setPhase('schedule')} style={detSt.backBtn}>
            <Text style={detSt.backTxt}>← Back</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text style={detSt.programName} numberOfLines={1}>
              {selectedProgram?.emoji} {selectedProgram?.label}
            </Text>
            <Text style={detSt.programTag}>{selectedProgram?.tag}</Text>
          </View>
          <TouchableOpacity
            style={[detSt.editBtn, editMode && detSt.editBtnActive]}
            onPress={() => { setEditMode(!editMode); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          >
            <Text style={[detSt.editBtnTxt, editMode && { color: '#fff' }]}>
              {editMode ? '✓ Done' : '✎ Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={detSt.sectionLabel}>
            EXERCISES · ~{selectedProgram?.estMins} MIN
          </Text>

          {exs.map((ex, i) => {
            const nextEx      = exs[i + 1];
            const inSuperset  = !!ex.groupId;
            const showBridge  = inSuperset && !!nextEx && nextEx.groupId === ex.groupId;
            return (
              <View key={i}>
                <View style={[detSt.exCard, inSuperset && detSt.exCardSuperset]}>
                  {inSuperset && (
                    <View style={detSt.ssBadge}>
                      <Text style={detSt.ssBadgeTxt}>⚡ SUPERSET</Text>
                    </View>
                  )}

                  {editMode ? (
                    /* ── EDIT MODE ─────────────────────────────────────── */
                    <View>
                      <TextInput
                        style={detSt.editNameInput}
                        value={ex.name}
                        onChangeText={t => {
                          const u = [...exs]; u[i] = { ...u[i], name: t }; setEditExercises(u);
                        }}
                        placeholder="Exercise name"
                        placeholderTextColor={colors.textMuted}
                      />
                      <TextInput
                        style={detSt.editMuscleInput}
                        value={ex.muscle}
                        onChangeText={t => {
                          const u = [...exs]; u[i] = { ...u[i], muscle: t }; setEditExercises(u);
                        }}
                        placeholder="Muscle group"
                        placeholderTextColor={colors.textMuted}
                      />

                      {/* Sets & Reps */}
                      <View style={detSt.editRow}>
                        <Text style={detSt.editLabel}>SETS</Text>
                        <View style={detSt.stepperRow}>
                          <TouchableOpacity style={detSt.stepBtn}
                            onPress={() => {
                              const u = [...exs]; u[i] = { ...u[i], setsTarget: Math.max(1, ex.setsTarget - 1) }; setEditExercises(u);
                            }}>
                            <Text style={detSt.stepBtnTxt}>−</Text>
                          </TouchableOpacity>
                          <Text style={detSt.stepVal}>{ex.setsTarget}</Text>
                          <TouchableOpacity style={detSt.stepBtn}
                            onPress={() => {
                              const u = [...exs]; u[i] = { ...u[i], setsTarget: Math.min(10, ex.setsTarget + 1) }; setEditExercises(u);
                            }}>
                            <Text style={detSt.stepBtnTxt}>+</Text>
                          </TouchableOpacity>
                        </View>

                        <Text style={[detSt.editLabel, { marginLeft: 16 }]}>REPS</Text>
                        <TextInput
                          style={detSt.repsInput}
                          value={ex.repsTarget}
                          onChangeText={t => {
                            const u = [...exs]; u[i] = { ...u[i], repsTarget: t }; setEditExercises(u);
                          }}
                          placeholder="8–10"
                          placeholderTextColor={colors.textMuted}
                        />
                      </View>

                      {/* Rest */}
                      <View style={detSt.editRow}>
                        <Text style={detSt.editLabel}>REST</Text>
                        <TouchableOpacity style={detSt.stepBtn}
                          onPress={() => {
                            const u = [...exs]; u[i] = { ...u[i], restSeconds: Math.max(0, ex.restSeconds - 15) }; setEditExercises(u);
                          }}>
                          <Text style={detSt.stepBtnTxt}>−15s</Text>
                        </TouchableOpacity>
                        <Text style={detSt.stepVal}>
                          {ex.restSeconds === 0 ? 'Superset' : `${ex.restSeconds}s`}
                        </Text>
                        <TouchableOpacity style={detSt.stepBtn}
                          onPress={() => {
                            const u = [...exs]; u[i] = { ...u[i], restSeconds: Math.min(300, ex.restSeconds + 15) }; setEditExercises(u);
                          }}>
                          <Text style={detSt.stepBtnTxt}>+15s</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Superset toggle with next exercise */}
                      {i < exs.length - 1 && (
                        <TouchableOpacity
                          style={[detSt.ssToggle, inSuperset && detSt.ssToggleActive]}
                          onPress={() => {
                            const u = [...exs];
                            if (inSuperset && u[i + 1]?.groupId === ex.groupId) {
                              // Break superset — remove groupId from entire group
                              const gid = ex.groupId!;
                              for (let j = 0; j < u.length; j++) {
                                if (u[j].groupId === gid) {
                                  u[j] = { ...u[j], groupId: undefined };
                                }
                              }
                              u[i] = { ...u[i], restSeconds: 90 };
                            } else {
                              // Create superset with next exercise
                              const gid = `ss_${i}_${Date.now()}`;
                              u[i]     = { ...u[i], groupId: gid, restSeconds: 0 };
                              u[i + 1] = { ...u[i + 1], groupId: gid, restSeconds: u[i + 1].restSeconds || 60 };
                            }
                            setEditExercises(u);
                          }}
                        >
                          <Text style={[detSt.ssToggleTxt, inSuperset && { color: '#F59E0B' }]}>
                            ⚡ {inSuperset ? 'Superset ON' : 'Make Superset with next'}
                          </Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={detSt.deleteBtn}
                        onPress={() => { setEditExercises(exs.filter((_, j) => j !== i)); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                      >
                        <Text style={detSt.deleteBtnTxt}>✕ Remove exercise</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    /* ── VIEW MODE ─────────────────────────────────────── */
                    <View>
                      <Text style={detSt.exName}>{ex.name}</Text>
                      <Text style={detSt.exMuscle}>{ex.muscle}</Text>
                      <View style={detSt.exMetaRow}>
                        <Text style={detSt.exBadge}>{getRepRange(ex)}</Text>
                        <Text style={detSt.exBadge}>
                          {ex.restSeconds === 0 ? '⚡ No rest' : `${ex.restSeconds}s rest`}
                        </Text>
                      </View>
                      {!!ex.notes && <Text style={detSt.exNotes}>{ex.notes}</Text>}
                    </View>
                  )}
                </View>

                {/* Superset bridge connector */}
                {showBridge && (
                  <View style={detSt.ssBridge}>
                    <View style={detSt.ssBridgeLine} />
                    <Text style={detSt.ssBridgeTxt}>⚡ straight to next</Text>
                    <View style={detSt.ssBridgeLine} />
                  </View>
                )}
              </View>
            );
          })}

          {/* Add exercise button (edit mode only) */}
          {editMode && (
            <TouchableOpacity
              style={detSt.addBtn}
              onPress={() => {
                setEditExercises([...exs, {
                  name: '', muscle: '', setsTarget: 3,
                  repsTarget: '10–12', defaultLbs: 0, restSeconds: 60,
                }]);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={detSt.addBtnTxt}>+ Add Exercise</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* START WORKOUT button */}
        <View style={[detSt.footer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity style={detSt.startBtn} onPress={beginSplash}>
            <Text style={detSt.startBtnTxt}>START WORKOUT →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SPLASH SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 'splash') {
    const msg = SPLASH_MESSAGES[splashMsgIdx];
    return (
      <View style={splashSt.container}>
        <Animated.View
          style={[splashSt.inner, { transform: [{ scale: splashScale }], opacity: splashOpacity }]}
        >
          <Text style={splashSt.line1}>{msg.line1}</Text>
          <Text style={splashSt.line2}>{msg.line2}</Text>
        </Animated.View>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DONE SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 'done') {
    return (
      <View style={[doneSt.container, { paddingTop: insets.top + 20 }]}>
        <Text style={doneSt.trophy}>🏆</Text>
        <Text style={doneSt.heading}>Workout Done!</Text>
        <Text style={doneSt.sub}>Fort Worth built different.</Text>
        <View style={doneSt.statsRow}>
          <View style={doneSt.stat}>
            <Text style={doneSt.statVal}>{fmt(elapsedSecs)}</Text>
            <Text style={doneSt.statLbl}>Time</Text>
          </View>
          <View style={doneSt.stat}>
            <Text style={doneSt.statVal}>{totalSetsCount}</Text>
            <Text style={doneSt.statLbl}>Sets</Text>
          </View>
          <View style={doneSt.stat}>
            <Text style={doneSt.statVal}>{totalVolume.toLocaleString()}</Text>
            <Text style={doneSt.statLbl}>Vol (lbs)</Text>
          </View>
          <View style={doneSt.stat}>
            <Text style={doneSt.statVal}>{estCals}</Text>
            <Text style={doneSt.statLbl}>~kcal</Text>
          </View>
        </View>
        <TouchableOpacity style={doneSt.doneBtn} onPress={() => setPhase('schedule')}>
          <Text style={doneSt.doneBtnTxt}>Back to Schedule</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTIVE WORKOUT
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase !== 'active' || !program) return null;

  const curEx   = activeExercises[exIdx];
  const curSets = sessionSets[curEx?.name ?? ''] ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <View style={[activeSt.topBar, { paddingTop: insets.top + 4 }]}>
        {/* Cancel button — always visible, never accidentally triggered (confirm dialog) */}
        <TouchableOpacity onPress={cancelWorkout} style={activeSt.cancelBtn}>
          <Ionicons name="close" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={activeSt.programLabel}>{program.emoji} {program.label}</Text>
          <Text style={activeSt.elapsed}>
            {clockStarted ? fmt(elapsedSecs) : '--:--'} · ~{estCals} kcal
          </Text>
        </View>
        {heartRate !== null && (
          <View style={activeSt.hrBadge}>
            <Text style={activeSt.hrTxt}>❤️ {heartRate} bpm</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={finishWorkout}
          style={activeSt.finishBtn}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={activeSt.finishTxt}>Finish ✓</Text>}
        </TouchableOpacity>
      </View>

      {/* ── Exercise progress pills ───────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={activeSt.pillsScroll}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingVertical: 8 }}
      >
        {activeExercises.map((ex, i) => {
          const done = (sessionSets[ex.name]?.length ?? 0) >= ex.setsTarget;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => goToEx(i)}
              style={[
                activeSt.pill,
                i === exIdx && activeSt.pillActive,
                done && activeSt.pillDone,
              ]}
            >
              <Text
                style={[activeSt.pillTxt, i === exIdx && { color: '#fff' }]}
                numberOfLines={1}
              >
                {ex.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Swipeable exercise cards ──────────────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        style={{ flex: 1 }}
      >
        {activeExercises.map((ex, i) => {
          const sets = sessionSets[ex.name] ?? [];
          const prev = prevSession[ex.name] ?? [];
          return (
            <ScrollView
              key={i}
              style={{ width: SW }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Exercise header */}
              <View style={activeSt.exHeader}>
                <Text style={activeSt.exName}>{ex.name}</Text>
                {!!ex.groupId && (
                  <View style={activeSt.ssBadge}>
                    <Text style={activeSt.ssBadgeTxt}>⚡ SUPERSET</Text>
                  </View>
                )}
                <Text style={activeSt.exMeta}>{ex.muscle} · {getRepRange(ex)}</Text>
                {!!ex.notes && <Text style={activeSt.exNotes}>{ex.notes}</Text>}
              </View>

              {/* Sets progress */}
              <View style={activeSt.setsRow}>
                <Text style={activeSt.setsLabel}>Sets: {sets.length} / {ex.setsTarget}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
                  {Array.from({ length: ex.setsTarget }).map((_, j) => (
                    <View
                      key={j}
                      style={[activeSt.setDot, sets[j] ? activeSt.setDotFilled : null]}
                    >
                      {sets[j] ? <Text style={activeSt.setDotTxt}>{sets[j].reps}</Text> : null}
                    </View>
                  ))}
                </View>
              </View>

              {/* Previous session */}
              {prev.length > 0 && (
                <View style={activeSt.prevBox}>
                  <Text style={activeSt.prevLabel}>LAST TIME</Text>
                  {prev.map((s, j) => (
                    <Text key={j} style={activeSt.prevSet}>
                      Set {j + 1}: {s.weightKg} lbs × {s.reps} reps
                    </Text>
                  ))}
                </View>
              )}

              {/* Weight / reps inputs (active card only) */}
              {i === exIdx && (
                <>
                  <View style={activeSt.inputRow}>
                    <View style={activeSt.inputBlock}>
                      <Text style={activeSt.inputLabel}>WEIGHT (lbs)</Text>
                      <View style={activeSt.stepper}>
                        <TouchableOpacity
                          onPress={() => setWeightVal(v => Math.max(0, v - 5))}
                          style={activeSt.stepBtn}
                        >
                          <Text style={activeSt.stepBtnTxt}>−</Text>
                        </TouchableOpacity>
                        <TextInput
                          style={activeSt.numInput}
                          value={String(weightVal)}
                          onChangeText={t => setWeightVal(parseInt(t) || 0)}
                          keyboardType="numeric"
                          selectTextOnFocus
                        />
                        <TouchableOpacity
                          onPress={() => setWeightVal(v => v + 5)}
                          style={activeSt.stepBtn}
                        >
                          <Text style={activeSt.stepBtnTxt}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={activeSt.inputBlock}>
                      <Text style={activeSt.inputLabel}>REPS</Text>
                      <View style={activeSt.stepper}>
                        <TouchableOpacity
                          onPress={() => setRepsVal(v => Math.max(1, v - 1))}
                          style={activeSt.stepBtn}
                        >
                          <Text style={activeSt.stepBtnTxt}>−</Text>
                        </TouchableOpacity>
                        <TextInput
                          style={activeSt.numInput}
                          value={String(repsVal)}
                          onChangeText={t => setRepsVal(parseInt(t) || 0)}
                          keyboardType="numeric"
                          selectTextOnFocus
                        />
                        <TouchableOpacity
                          onPress={() => setRepsVal(v => v + 1)}
                          style={activeSt.stepBtn}
                        >
                          <Text style={activeSt.stepBtnTxt}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity style={activeSt.logBtn} onPress={logSet}>
                    <Text style={activeSt.logBtnTxt}>Log Set {curSets.length + 1}</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Logged sets */}
              {sets.length > 0 && (
                <View style={activeSt.loggedBox}>
                  <Text style={activeSt.loggedLabel}>LOGGED</Text>
                  {sets.map((s, j) => (
                    <Text key={j} style={activeSt.loggedSet}>
                      ✓ Set {j + 1} — {s.weightKg} lbs × {s.reps} reps
                    </Text>
                  ))}
                </View>
              )}

              {/* Spotify (active card only) */}
              {!!spotifyToken && i === exIdx && (
                <View style={activeSt.spotifyBox}>
                  <Text style={activeSt.spotifyLabel}>🎵 MUSIC</Text>
                  <View style={activeSt.spotifyRow}>
                    <TextInput
                      style={activeSt.spotifyInput}
                      value={spotifyQuery}
                      onChangeText={setSpotifyQuery}
                      placeholder="Search Spotify..."
                      placeholderTextColor={colors.textMuted}
                      returnKeyType="search"
                      onSubmitEditing={handleSpotifySearch}
                    />
                    <TouchableOpacity
                      style={activeSt.spotifySearchBtn}
                      onPress={handleSpotifySearch}
                    >
                      {spotifyLoading
                        ? <ActivityIndicator size="small" color="#fff" />
                        : <Text style={activeSt.spotifySearchTxt}>Go</Text>}
                    </TouchableOpacity>
                  </View>
                  {playStatus && playStatus !== 'ok' && (
                    <Text style={{ color: '#EF4444', fontSize: 12, marginBottom: 6 }}>
                      {playStatus === 'no_premium'
                        ? 'Spotify Premium required to control playback.'
                        : 'Could not start playback. Open Spotify first.'}
                    </Text>
                  )}
                  {spotifyResults.map((item, j) => (
                    <TouchableOpacity
                      key={j}
                      style={[
                        activeSt.spotifyResult,
                        playingUri === item.data.uri && activeSt.spotifyResultPlaying,
                      ]}
                      onPress={() => handlePlay(item)}
                    >
                      <Text style={activeSt.spotifyResultTxt} numberOfLines={1}>
                        {item.data.name}
                      </Text>
                      {playingUri === item.data.uri && (
                        <Text style={activeSt.spotifyPlayingTxt}>▶</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          );
        })}
      </ScrollView>

      {/* ── Bottom: START button or Rest bar ──────────────────────────────── */}
      <View style={[activeSt.restBar, { paddingBottom: insets.bottom + 8 }]}>
        {!clockStarted ? (
          /* Big START button before clock starts */
          <TouchableOpacity style={activeSt.bigStartBtn} onPress={startClock}>
            <Text style={activeSt.bigStartBtnTxt}>▶ START</Text>
          </TouchableOpacity>
        ) : (
          <>
            {/* Rest time presets */}
            <View style={activeSt.presetsRow}>
              {REST_PRESETS.map(rp => (
                <TouchableOpacity
                  key={rp.secs}
                  style={[activeSt.presetBtn, restTotalSecs === rp.secs && activeSt.presetBtnActive]}
                  onPress={() => selectRestPreset(rp.secs)}
                >
                  <Text style={[activeSt.presetTxt, restTotalSecs === rp.secs && { color: '#fff' }]}>
                    {rp.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Rest timer row */}
            <View style={activeSt.timerRow}>
              <Text style={[activeSt.restTimer, restRunning && restTimeLeft <= 10 && { color: '#EF4444' }]}>
                {fmt(restTimeLeft)}
              </Text>
              <TouchableOpacity
                style={[activeSt.restBtn, restRunning && activeSt.restBtnActive]}
                onPress={restRunning ? stopRest : startRest}
              >
                <Text style={activeSt.restBtnTxt}>{restRunning ? '⏸ Rest' : '⏱ Rest'}</Text>
              </TouchableOpacity>
              {restRunning && (
                <TouchableOpacity onPress={resetRest} style={activeSt.resetBtn}>
                  <Text style={activeSt.resetBtnTxt}>↺</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>

      {/* ── PR Flash ──────────────────────────────────────────────────────── */}
      {showPR && (
        <View style={activeSt.prOverlay} pointerEvents="none">
          <Text style={activeSt.prTxt}>🏆 NEW PR! {prWeight} lbs</Text>
        </View>
      )}

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast.length > 0 && (
        <View style={activeSt.toast} pointerEvents="none">
          <Text style={activeSt.toastTxt}>{toast}</Text>
        </View>
      )}

      {/* ── Heart Rate Flash Overlay ──────────────────────────────────────── */}
      {hrPct >= 0.85 && (
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: hrColor, opacity: hrFlashAnim }]}
        />
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const schSt = StyleSheet.create({
  hero: { paddingHorizontal: spacing.lg, paddingBottom: 12 },
  heading: { fontSize: 26, fontWeight: '700', color: colors.textPrimary },
  sub: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  weekStrip: {
    flexDirection: 'row', paddingHorizontal: spacing.md,
    paddingBottom: 12, gap: 4,
  },
  dayPill: {
    flex: 1, alignItems: 'center', paddingVertical: 8,
    borderRadius: 10, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: CARD,
  },
  dayPillSelected: { backgroundColor: ORANGE, borderColor: ORANGE },
  dayPillToday:   { borderColor: ORANGE },
  dayName:  { fontSize: 10, fontWeight: '700', color: colors.textMuted },
  dayEmoji: { fontSize: 16, marginTop: 2 },
  todayDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: ORANGE, marginTop: 2 },
  dayCard:  { backgroundColor: CARD, borderRadius: 14, padding: 16, marginBottom: 20 },
  dayTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  dayTag:   { fontSize: 13, color: colors.textMuted, marginBottom: 12 },
  exRow:    { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  exName:   { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  exDetail: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  viewBtn:  {
    backgroundColor: ORANGE, borderRadius: 10, padding: 13,
    alignItems: 'center', marginTop: 14,
  },
  viewBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  restCard:  { alignItems: 'center', paddingVertical: 40 },
  restEmoji: { fontSize: 48 },
  restText:  { fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginTop: 12 },
  restSub:   { fontSize: 14, color: colors.textMuted, marginTop: 6 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: colors.textMuted,
    letterSpacing: 1.5, marginTop: 20, marginBottom: 10,
  },
  programCard: {
    backgroundColor: CARD, borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderLeftWidth: 4,
  },
  programName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  programTag:  { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  footer: {
    fontSize: 11, color: colors.textMuted, textAlign: 'center',
    letterSpacing: 1.5, marginTop: 24, marginBottom: 8,
  },
});

// ── Assigned workout card styles ──────────────────────────────────────────────
const asSt = StyleSheet.create({
  card: {
    backgroundColor: CARD, borderRadius: 14, padding: 14, marginBottom: 12,
    borderWidth: 1.5, borderColor: '#3B82F6' + '55',
    shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.30, shadowRadius: 10, elevation: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  title:       { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  trainerName: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  targetDate:  { fontSize: 11, color: '#3B82F6', marginTop: 2, fontWeight: '700' },
  badge: {
    backgroundColor: '#3B82F6', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 9, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  note: {
    fontSize: 13, color: colors.textSecondary, fontStyle: 'italic',
    marginBottom: 10, paddingHorizontal: 4,
  },
  exList: {
    backgroundColor: colors.bgSecondary, borderRadius: 8, overflow: 'hidden',
    marginBottom: 12,
  },
  exRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, paddingHorizontal: 12,
    borderBottomWidth: 1, borderBottomColor: colors.cardBorder,
  },
  exNum:  { fontSize: 11, fontWeight: '700', color: colors.textMuted, width: 18 },
  exName: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  exMeta: { fontSize: 13, fontWeight: '800', color: '#3B82F6' },
  actions: { flexDirection: 'row', gap: 10 },
  doneBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: '#3B82F6', borderRadius: 10, paddingVertical: 11,
  },
  doneBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  skipBtn: {
    paddingHorizontal: 18, paddingVertical: 11,
    borderRadius: 10, borderWidth: 1, borderColor: colors.cardBorder,
    backgroundColor: CARD,
  },
  skipBtnText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
});

const detSt = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: colors.cardBorder,
  },
  backBtn:  { padding: 8 },
  backTxt:  { color: ORANGE, fontSize: 15, fontWeight: '600' },
  programName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  programTag:  { fontSize: 12, color: colors.textMuted },
  editBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 8, borderWidth: 1, borderColor: ORANGE,
  },
  editBtnActive: { backgroundColor: ORANGE },
  editBtnTxt:    { color: ORANGE, fontWeight: '700', fontSize: 14 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: colors.textMuted,
    letterSpacing: 1.5, marginBottom: 12,
  },
  exCard:         { backgroundColor: CARD, borderRadius: 12, padding: 14, marginBottom: 8 },
  exCardSuperset: { borderLeftWidth: 3, borderLeftColor: '#F59E0B' },
  ssBadge: {
    backgroundColor: '#F59E0B22', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    alignSelf: 'flex-start', marginBottom: 8,
  },
  ssBadgeTxt: { fontSize: 11, fontWeight: '700', color: '#F59E0B' },
  ssBridge: {
    flexDirection: 'row', alignItems: 'center',
    marginVertical: 4, marginHorizontal: 24,
  },
  ssBridgeLine: { flex: 1, height: 1.5, backgroundColor: '#F59E0B55' },
  ssBridgeTxt:  { fontSize: 11, color: '#F59E0B', marginHorizontal: 8 },
  exName:   { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  exMuscle: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  exMetaRow: { flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' },
  exBadge: {
    backgroundColor: colors.cardBorder, borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
    fontSize: 12, color: colors.textPrimary,
  },
  exNotes: { fontSize: 12, color: '#F59E0B', marginTop: 8, fontStyle: 'italic' },
  // Edit mode inputs
  editNameInput: {
    fontSize: 15, fontWeight: '700', color: colors.textPrimary,
    borderBottomWidth: 1, borderColor: colors.cardBorder,
    paddingVertical: 4, marginBottom: 6,
  },
  editMuscleInput: {
    fontSize: 13, color: colors.textMuted,
    borderBottomWidth: 1, borderColor: colors.cardBorder,
    paddingVertical: 4, marginBottom: 10,
  },
  editRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  editLabel:  { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepBtn:    { backgroundColor: colors.cardBorder, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 },
  stepBtnTxt: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  stepVal:    { fontSize: 15, fontWeight: '700', color: colors.textPrimary, minWidth: 50, textAlign: 'center' },
  repsInput: {
    borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 6, width: 70,
    fontSize: 14, color: colors.textPrimary,
  },
  ssToggle:       { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: colors.cardBorder },
  ssToggleActive: { borderColor: '#F59E0B', backgroundColor: '#F59E0B11' },
  ssToggleTxt:    { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  deleteBtn:      { alignSelf: 'flex-end', padding: 6, marginTop: 4 },
  deleteBtnTxt:   { color: '#EF4444', fontSize: 13, fontWeight: '600' },
  addBtn: {
    borderWidth: 1, borderColor: ORANGE, borderRadius: 10,
    padding: 14, alignItems: 'center', marginTop: 8,
  },
  addBtnTxt: { color: ORANGE, fontWeight: '700', fontSize: 14 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: spacing.lg, paddingTop: 12,
    backgroundColor: BG, borderTopWidth: 1, borderColor: colors.cardBorder,
  },
  startBtn:    { backgroundColor: ORANGE, borderRadius: 14, padding: 16, alignItems: 'center' },
  startBtnTxt: { color: '#fff', fontWeight: '800', fontSize: 17, letterSpacing: 1 },
});

const splashSt = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#080808',
    justifyContent: 'center', alignItems: 'center',
  },
  inner: { alignItems: 'center' },
  line1: { fontSize: 50, fontWeight: '900', color: '#ffffff', letterSpacing: 4, textAlign: 'center' },
  line2: { fontSize: 54, fontWeight: '900', color: ORANGE, letterSpacing: 4, marginTop: 6, textAlign: 'center' },
});

const doneSt = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: BG,
    alignItems: 'center', paddingHorizontal: spacing.lg,
  },
  trophy:   { fontSize: 64, marginTop: 20 },
  heading:  { fontSize: 30, fontWeight: '800', color: colors.textPrimary, marginTop: 12 },
  sub:      { fontSize: 16, color: colors.textMuted, marginTop: 6 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 32 },
  stat:     { backgroundColor: CARD, borderRadius: 12, padding: 14, alignItems: 'center', flex: 1 },
  statVal:  { fontSize: 18, fontWeight: '800', color: ORANGE },
  statLbl:  { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  doneBtn:  { backgroundColor: ORANGE, borderRadius: 14, padding: 16, paddingHorizontal: 40, marginTop: 32 },
  doneBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

const activeSt = StyleSheet.create({
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.md, paddingBottom: 8,
    borderBottomWidth: 1, borderColor: colors.cardBorder,
  },
  cancelBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.cardElevated,
    borderWidth: 1, borderColor: colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  programLabel: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  elapsed:      { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  hrBadge:      { backgroundColor: '#EF444422', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, marginRight: 8 },
  hrTxt:        { fontSize: 13, fontWeight: '700', color: '#EF4444' },
  finishBtn:    { backgroundColor: '#22C55E', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  finishTxt:    { color: '#fff', fontWeight: '700', fontSize: 14 },
  pillsScroll:  { maxHeight: 48, flexShrink: 0 },
  pill:         { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: CARD, marginRight: 8, borderWidth: 1, borderColor: colors.cardBorder },
  pillActive:   { backgroundColor: ORANGE, borderColor: ORANGE },
  pillDone:     { borderColor: '#22C55E', backgroundColor: '#22C55E22' },
  pillTxt:      { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  exHeader:     { marginBottom: 16 },
  exName:       { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  ssBadge:      { backgroundColor: '#F59E0B22', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginVertical: 4 },
  ssBadgeTxt:   { fontSize: 11, fontWeight: '700', color: '#F59E0B' },
  exMeta:       { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  exNotes:      { fontSize: 13, color: '#F59E0B', marginTop: 8, fontStyle: 'italic' },
  setsRow:      { marginBottom: 16 },
  setsLabel:    { fontSize: 14, fontWeight: '700', color: colors.textMuted },
  setDot:       { width: 38, height: 38, borderRadius: 8, borderWidth: 1, borderColor: colors.cardBorder, marginRight: 6, marginBottom: 6, justifyContent: 'center', alignItems: 'center' },
  setDotFilled: { backgroundColor: ORANGE, borderColor: ORANGE },
  setDotTxt:    { color: '#fff', fontSize: 12, fontWeight: '700' },
  prevBox:      { backgroundColor: CARD, borderRadius: 10, padding: 12, marginBottom: 12 },
  prevLabel:    { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.2, marginBottom: 6 },
  prevSet:      { fontSize: 13, color: colors.textPrimary, marginBottom: 2 },
  inputRow:     { flexDirection: 'row', gap: 12, marginBottom: 16 },
  inputBlock:   { flex: 1 },
  inputLabel:   { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.2, marginBottom: 8 },
  stepper:      { flexDirection: 'row', alignItems: 'center', backgroundColor: CARD, borderRadius: 10, overflow: 'hidden' },
  stepBtn:      { padding: 12, backgroundColor: colors.cardBorder },
  stepBtnTxt:   { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  numInput:     { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '700', color: colors.textPrimary, paddingVertical: 10 },
  logBtn:       { backgroundColor: ORANGE, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 },
  logBtnTxt:    { color: '#fff', fontWeight: '800', fontSize: 17 },
  loggedBox:    { backgroundColor: CARD, borderRadius: 10, padding: 12, marginBottom: 12 },
  loggedLabel:  { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.2, marginBottom: 6 },
  loggedSet:    { fontSize: 14, color: '#22C55E', marginBottom: 2 },
  spotifyBox:   { backgroundColor: CARD, borderRadius: 12, padding: 14, marginTop: 16 },
  spotifyLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.2, marginBottom: 10 },
  spotifyRow:   { flexDirection: 'row', gap: 8, marginBottom: 8 },
  spotifyInput: { flex: 1, backgroundColor: BG, borderRadius: 8, padding: 10, fontSize: 14, color: colors.textPrimary },
  spotifySearchBtn: { backgroundColor: '#1DB954', borderRadius: 8, paddingHorizontal: 14, justifyContent: 'center' },
  spotifySearchTxt: { color: '#fff', fontWeight: '700' },
  spotifyResult: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.cardBorder },
  spotifyResultPlaying: { borderColor: '#1DB954' },
  spotifyResultTxt: { fontSize: 14, color: colors.textPrimary, flex: 1 },
  spotifyPlayingTxt: { color: '#1DB954', marginLeft: 8 },
  restBar:      { borderTopWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: spacing.md, paddingTop: 10, backgroundColor: BG },
  bigStartBtn:  { backgroundColor: ORANGE, borderRadius: 14, padding: 18, alignItems: 'center', marginVertical: 6 },
  bigStartBtnTxt: { color: '#fff', fontWeight: '900', fontSize: 24, letterSpacing: 3 },
  presetsRow:   { flexDirection: 'row', gap: 6, marginBottom: 8, justifyContent: 'center', flexWrap: 'wrap' },
  presetBtn:    { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: CARD, borderWidth: 1, borderColor: colors.cardBorder },
  presetBtnActive: { backgroundColor: ORANGE, borderColor: ORANGE },
  presetTxt:    { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  timerRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  restTimer:    { fontSize: 28, fontWeight: '800', color: colors.textPrimary, minWidth: 70, textAlign: 'center' },
  restBtn:      { backgroundColor: CARD, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1, borderColor: colors.cardBorder },
  restBtnActive: { backgroundColor: ORANGE + '44', borderColor: ORANGE },
  restBtnTxt:   { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  resetBtn:     { padding: 10 },
  resetBtnTxt:  { fontSize: 22, color: colors.textMuted },
  prOverlay: {
    position: 'absolute', top: 120, left: 20, right: 20,
    backgroundColor: ORANGE, borderRadius: 12,
    padding: 14, alignItems: 'center',
  },
  prTxt:  { color: '#fff', fontWeight: '800', fontSize: 18 },
  toast: {
    position: 'absolute', bottom: 130, left: 20, right: 20,
    backgroundColor: '#1F2937', borderRadius: 10,
    padding: 12, alignItems: 'center',
  },
  toastTxt: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
