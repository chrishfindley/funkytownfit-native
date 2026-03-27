import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Dimensions, ImageBackground, Animated,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography } from '@/theme';
import { UserProfile, Goal, TrainingBackground, Equipment, Sex } from '@/lib/types';
import { saveProfile, setOnboarded } from '@/lib/storage';

const { width: SW } = Dimensions.get('window');

// ─── Total steps: 0–13 ──────────────────────────────────────────────────────
// Profile:      0 Welcome · 1 You · 2 Body · 3 Goals · 4 Background · 5 Schedule · 6 Recap
// Feature tour: 7 Dashboard · 8 Train · 9 Eat · 10 Progress · 11 Where To · 12 Community
// Final:        13 Ready
const TOTAL_STEPS = 14;

// ─── Static data ─────────────────────────────────────────────────────────────
const GOALS: { label: string; value: Goal }[] = [
  { label: 'Lose Fat',              value: 'lose_fat'             },
  { label: 'Build Muscle',          value: 'build_muscle'         },
  { label: 'Body Recomp',           value: 'body_recomp'          },
  { label: 'Improve Fitness',       value: 'improve_fitness'      },
  { label: 'Strength / Powerlifting', value: 'strength'           },
  { label: 'Run a 5K',              value: 'run_5k'               },
  { label: 'Run a 10K',             value: 'run_10k'              },
  { label: 'Run a Half Marathon',   value: 'run_half'             },
  { label: 'Run a Marathon',        value: 'run_full'             },
  { label: 'Athletic Performance',  value: 'athletic_performance' },
  { label: 'Glute Focus',           value: 'glute_focus'          },
  { label: 'Maintain',              value: 'maintain'             },
  { label: 'Mobility & Flexibility', value: 'mobility_flexibility'},
];
const TRAINING_BACKGROUNDS: { label: string; value: TrainingBackground }[] = [
  { label: 'Brand New 🌱',              value: 'complete_beginner' },
  { label: 'Some Experience (< 6 mo)', value: 'beginner'          },
  { label: 'Intermediate (6 mo – 2 yr)', value: 'intermediate'    },
  { label: 'Advanced (2+ years)',       value: 'advanced'          },
];
const EQUIPMENT_OPTIONS: { label: string; value: Equipment }[] = [
  { label: 'Full Gym',           value: 'full_gym'          },
  { label: 'Dumbbells Only',     value: 'dumbbells_only'    },
  { label: 'Home Gym',           value: 'home_gym'          },
  { label: 'Bodyweight Only',    value: 'bodyweight_only'   },
  { label: 'Resistance Bands',   value: 'resistance_bands'  },
  { label: 'Kettlebells Only',   value: 'kettlebells_only'  },
  { label: 'Gym + Outdoor',      value: 'gym_and_outdoor'   },
];
const DAYS_OPTIONS    = [2, 3, 4, 5, 6];
const MINUTES_OPTIONS = [30, 45, 60, 75, 90];

// ─── Feature slides ───────────────────────────────────────────────────────────
interface FeatureSlide {
  emoji: string;
  accentColor: string;
  title: string;
  badge: string;
  description: string;
  bullets: { emoji: string; text: string }[];
}
const FEATURE_SLIDES: FeatureSlide[] = [
  {
    emoji: '🏠',
    accentColor: colors.orange,
    badge: 'HOME',
    title: 'Your Daily Command Center',
    description:
      "Everything you need, first screen you see. Today's personalized workout, your calorie target, macros at a glance — and one tap to get moving.",
    bullets: [
      { emoji: '🏋️', text: "Today's workout, built for you, ready to go" },
      { emoji: '🍎', text: 'Calorie & macro snapshot always visible' },
      { emoji: '📍', text: "One tap to Fort Worth's best fitness spots" },
    ],
  },
  {
    emoji: '💪',
    accentColor: '#3B82F6',
    badge: 'TRAIN',
    title: 'Workouts Built for You',
    description:
      "Not a generic plan — your program is built from your goals, equipment, and schedule. Track every set, every rep, every rest. PRs celebrated.",
    bullets: [
      { emoji: '📋', text: 'Fully custom programs from your profile' },
      { emoji: '⏱️', text: 'Rest timer, set logging, superset support' },
      { emoji: '🏆', text: 'Personal record detection with celebration' },
    ],
  },
  {
    emoji: '🥗',
    accentColor: colors.green,
    badge: 'EAT',
    title: 'Nutrition Made Effortless',
    description:
      "Point your camera at a meal, or search the database. Your AI coach calculates calories, protein, carbs, and fat — automatically.",
    bullets: [
      { emoji: '📸', text: 'Camera AI identifies food in seconds' },
      { emoji: '🎯', text: 'Daily calorie & macro targets from your goal' },
      { emoji: '📊', text: 'Full meal history and nutrition trends' },
    ],
  },
  {
    emoji: '📈',
    accentColor: '#8B5CF6',
    badge: 'PROGRESS',
    title: 'Watch Yourself Transform',
    description:
      "Every workout, every meal, every pound — tracked and charted so you can see the momentum you've built over time.",
    bullets: [
      { emoji: '📉', text: 'Body weight & composition trends' },
      { emoji: '🔥', text: 'Streak tracking that keeps you consistent' },
      { emoji: '💪', text: 'Strength PRs and volume records per lift' },
    ],
  },
  {
    emoji: '📍',
    accentColor: '#F59E0B',
    badge: 'WHERE TO',
    title: 'Fort Worth Is Your Gym',
    description:
      "From the Stockyards to Benbrook Lake — 17 curated Fort Worth spots, each with a custom Spotify playlist and real-time hours.",
    bullets: [
      { emoji: '🗺️', text: '17 curated Fort Worth fitness & lifestyle spots' },
      { emoji: '🎵', text: 'Custom Spotify playlist for each location vibe' },
      { emoji: '🕐', text: "Real-time open/closed status and directions" },
    ],
  },
  {
    emoji: '🤝',
    accentColor: '#EC4899',
    badge: 'COMMUNITY',
    title: 'Your Squad — Coming Soon',
    description:
      "Find your workout partner right here in Fort Worth. Get randomly matched or invite friends. Accountability hits different when it's local.",
    bullets: [
      { emoji: '👥', text: 'Match with local workout partners' },
      { emoji: '🏆', text: 'Challenges, leaderboards, and friendly bets' },
      { emoji: '🔔', text: 'Accountability check-ins and group workouts' },
    ],
  },
];

// ─── Props ───────────────────────────────────────────────────────────────────
interface OnboardingScreenProps {
  onComplete: () => void;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Transition animations
  const fadeAnim  = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // ── Profile state ──────────────────────────────────────────────────────────
  const [name,      setName]     = useState('');
  const [age,       setAge]      = useState('');
  const [sex,       setSex]      = useState<Sex | null>(null);
  const [heightFt,  setHeightFt] = useState('');
  const [heightIn,  setHeightIn] = useState('');
  const [weight,    setWeight]   = useState('');
  const [selectedGoals,      setSelectedGoals]      = useState<Goal[]>([]);
  const [trainingBackground, setTrainingBackground] = useState<TrainingBackground | null>(null);
  const [equipment,          setEquipment]          = useState<Equipment | null>(null);
  const [daysPerWeek,        setDaysPerWeek]        = useState<number | null>(null);
  const [minutesPerSession,  setMinutesPerSession]  = useState<number | null>(null);

  const toggleGoal = (goal: Goal) =>
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );

  // ── Navigation ─────────────────────────────────────────────────────────────
  function animateStep(nextStep: number, dir: 'fwd' | 'back' = 'fwd') {
    Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }).start(() => {
      setStep(nextStep);
      slideAnim.setValue(dir === 'fwd' ? 28 : -28);
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, damping: 22, stiffness: 200, useNativeDriver: true }),
      ]).start();
    });
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  function canContinue(): boolean {
    if (step >= 7) return true;
    switch (step) {
      case 0: return true;
      case 1: return name.trim() !== '' && age !== '' && sex !== null;
      case 2: return heightFt !== '' && heightIn !== '' && weight !== '';
      case 3: return selectedGoals.length > 0;
      case 4: return trainingBackground !== null && equipment !== null;
      case 5: return daysPerWeek !== null && minutesPerSession !== null;
      case 6: return true;
      default: return false;
    }
  }

  // ── Continue handler ────────────────────────────────────────────────────────
  async function handleContinue() {
    if (step === 6) {
      setLoading(true);
      try {
        const totalInches = parseInt(heightFt) * 12 + parseInt(heightIn);
        const profile: UserProfile = {
          id: Date.now().toString(),
          name,
          age: parseInt(age),
          sex: sex!,
          heightCm:       Math.round(totalInches * 2.54),
          weightKg:       Math.round((parseInt(weight) / 2.205) * 10) / 10,
          goals:          selectedGoals,
          trainingBackground: trainingBackground!,
          exerciseTypes:  [],
          equipment:      equipment!,
          daysPerWeek:    daysPerWeek!,
          minutesPerSession: minutesPerSession!,
          createdAt:  new Date().toISOString(),
          updatedAt:  new Date().toISOString(),
        };
        await saveProfile(profile);
        await setOnboarded();
        animateStep(7);
      } catch (e) {
        console.error('Profile save error:', e);
      } finally {
        setLoading(false);
      }
    } else if (step === TOTAL_STEPS - 1) {
      onComplete();
    } else {
      animateStep(step + 1);
    }
  }

  function handleBack() {
    if (step > 0 && step !== 7) animateStep(step - 1, 'back');
  }

  // ── Button label ────────────────────────────────────────────────────────────
  function btnLabel(): string {
    if (step === 0)              return "Let's Go 🤠";
    if (step === 6)              return 'Lock It In  →';
    if (step === TOTAL_STEPS - 1) return 'Enter Funkytown  🔥';
    return 'Next  →';
  }

  // ── Progress ───────────────────────────────────────────────────────────────
  const progressPct = ((step + 1) / TOTAL_STEPS) * 100;
  const isFeatureTour = step >= 7 && step <= 12;
  const featureSlide  = isFeatureTour ? FEATURE_SLIDES[step - 7] : null;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

      {/* ── Progress bar (hidden on welcome) ─────────────────────────── */}
      {step > 0 && (
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>
      )}

      {/* ── Feature tour step indicator ───────────────────────────────── */}
      {isFeatureTour && (
        <View style={styles.tourDots}>
          {FEATURE_SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.tourDot,
                i === step - 7 && styles.tourDotActive,
                i === step - 7 && { backgroundColor: featureSlide?.accentColor },
              ]}
            />
          ))}
        </View>
      )}

      {/* ── Scrollable content ────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: step === 0 ? 0 : spacing.lg, paddingBottom: spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {step === 0 && <StepWelcome />}

          {step === 1 && (
            <StepYou
              name={name} setName={setName}
              age={age}   setAge={setAge}
              sex={sex}   setSex={setSex}
            />
          )}

          {step === 2 && (
            <StepBody
              heightFt={heightFt} setHeightFt={setHeightFt}
              heightIn={heightIn} setHeightIn={setHeightIn}
              weight={weight}     setWeight={setWeight}
            />
          )}

          {step === 3 && (
            <StepGoals selectedGoals={selectedGoals} toggleGoal={toggleGoal} />
          )}

          {step === 4 && (
            <StepBackground
              trainingBackground={trainingBackground}
              setTrainingBackground={setTrainingBackground}
              equipment={equipment}
              setEquipment={setEquipment}
            />
          )}

          {step === 5 && (
            <StepSchedule
              daysPerWeek={daysPerWeek}         setDaysPerWeek={setDaysPerWeek}
              minutesPerSession={minutesPerSession} setMinutesPerSession={setMinutesPerSession}
            />
          )}

          {step === 6 && (
            <StepRecap
              name={name} age={age} sex={sex}
              heightFt={heightFt} heightIn={heightIn} weight={weight}
              selectedGoals={selectedGoals}
              trainingBackground={trainingBackground}
              equipment={equipment}
              daysPerWeek={daysPerWeek}
              minutesPerSession={minutesPerSession}
            />
          )}

          {isFeatureTour && featureSlide && (
            <FeatureTourSlide slide={featureSlide} />
          )}

          {step === TOTAL_STEPS - 1 && (
            <StepReady name={name} />
          )}

        </Animated.View>
        <View style={{ height: spacing.xl }} />
      </ScrollView>

      {/* ── Bottom nav ─────────────────────────────────────────────────── */}
      <View style={[styles.navRow, { paddingHorizontal: spacing.lg }]}>
        {step > 0 && step !== 7 && step < TOTAL_STEPS - 1 && (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} disabled={loading}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.nextBtn,
            !canContinue() && styles.nextBtnDisabled,
            step >= 7 && featureSlide && { backgroundColor: featureSlide.accentColor },
            step === TOTAL_STEPS - 1 && { backgroundColor: colors.orange },
          ]}
          onPress={handleContinue}
          disabled={!canContinue() || loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#13151A" size="small" />
          ) : (
            <Text style={styles.nextBtnText}>{btnLabel()}</Text>
          )}
        </TouchableOpacity>
      </View>

    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Welcome
// ─────────────────────────────────────────────────────────────────────────────
const HERO_URI = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1080&q=90';

function StepWelcome() {
  return (
    <ImageBackground
      source={{ uri: HERO_URI }}
      style={styles.welcomeHero}
      imageStyle={styles.welcomeHeroImg}
      resizeMode="cover"
    >
      <View style={styles.heroOverlayTop} />
      <View style={styles.heroOverlayBottom} />
      <View style={styles.heroContent}>
        <View style={styles.locationPill}>
          <Text style={styles.locationPillText}>📍 FORT WORTH, TX</Text>
        </View>
        <Text style={styles.welcomeBrand}>Funkytown{'\n'}Fit</Text>
        <Text style={styles.welcomeTagline}>
          Train hard. Eat right.{'\n'}Live the Fort Worth life.
        </Text>
        <Text style={styles.welcomeStar}>✦</Text>
      </View>
    </ImageBackground>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: You
// ─────────────────────────────────────────────────────────────────────────────
function StepYou({ name, setName, age, setAge, sex, setSex }: {
  name: string; setName: (v: string) => void;
  age: string;  setAge: (v: string) => void;
  sex: Sex | null; setSex: (v: Sex) => void;
}) {
  return (
    <View style={styles.stepWrap}>
      <Text style={styles.stepTag}>STEP 1 / 6</Text>
      <Text style={styles.stepTitle}>Tell us about you</Text>

      <Text style={styles.fieldLabel}>Full Name</Text>
      <TextInput
        style={styles.input} placeholderTextColor={colors.textMuted}
        placeholder="Enter your name" value={name} onChangeText={setName}
        returnKeyType="done" autoCorrect={false}
      />

      <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Age</Text>
      <TextInput
        style={styles.input} placeholderTextColor={colors.textMuted}
        placeholder="e.g. 27" keyboardType="numeric"
        value={age} onChangeText={setAge} returnKeyType="done"
      />

      <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Biological Sex</Text>
      <View style={styles.pillRow}>
        {(['male', 'female', 'prefer_not'] as Sex[]).map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.selectPill, sex === s && styles.selectPillActive]}
            onPress={() => setSex(s)}
          >
            <Text style={[styles.selectPillText, sex === s && styles.selectPillTextActive]}>
              {s === 'male' ? 'Male' : s === 'female' ? 'Female' : 'Prefer not'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Body
// ─────────────────────────────────────────────────────────────────────────────
function StepBody({ heightFt, setHeightFt, heightIn, setHeightIn, weight, setWeight }: {
  heightFt: string; setHeightFt: (v: string) => void;
  heightIn: string; setHeightIn: (v: string) => void;
  weight: string;   setWeight: (v: string) => void;
}) {
  return (
    <View style={styles.stepWrap}>
      <Text style={styles.stepTag}>STEP 2 / 6</Text>
      <Text style={styles.stepTitle}>Your body</Text>

      <Text style={styles.fieldLabel}>Height</Text>
      <View style={styles.heightRow}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input} placeholderTextColor={colors.textMuted}
            placeholder="ft" keyboardType="numeric"
            value={heightFt} onChangeText={setHeightFt} returnKeyType="done"
          />
        </View>
        <Text style={styles.heightSep}>ft</Text>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input} placeholderTextColor={colors.textMuted}
            placeholder="in" keyboardType="numeric"
            value={heightIn} onChangeText={setHeightIn} returnKeyType="done"
          />
        </View>
        <Text style={styles.heightSep}>in</Text>
      </View>

      <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Weight (lbs)</Text>
      <TextInput
        style={styles.input} placeholderTextColor={colors.textMuted}
        placeholder="e.g. 165" keyboardType="numeric"
        value={weight} onChangeText={setWeight} returnKeyType="done"
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Goals
// ─────────────────────────────────────────────────────────────────────────────
function StepGoals({ selectedGoals, toggleGoal }: {
  selectedGoals: Goal[]; toggleGoal: (g: Goal) => void;
}) {
  return (
    <View style={styles.stepWrap}>
      <Text style={styles.stepTag}>STEP 3 / 6</Text>
      <Text style={styles.stepTitle}>What are you training for?</Text>
      <Text style={[styles.fieldLabel, { marginBottom: spacing.md }]}>Pick everything that applies</Text>
      <View style={styles.goalGrid}>
        {GOALS.map(g => (
          <TouchableOpacity
            key={g.value}
            style={[styles.goalChip, selectedGoals.includes(g.value) && styles.goalChipActive]}
            onPress={() => toggleGoal(g.value)}
          >
            <Text style={[styles.goalChipText, selectedGoals.includes(g.value) && styles.goalChipTextActive]}>
              {g.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Background & Equipment
// ─────────────────────────────────────────────────────────────────────────────
function StepBackground({ trainingBackground, setTrainingBackground, equipment, setEquipment }: {
  trainingBackground: TrainingBackground | null;
  setTrainingBackground: (v: TrainingBackground) => void;
  equipment: Equipment | null;
  setEquipment: (v: Equipment) => void;
}) {
  return (
    <View style={styles.stepWrap}>
      <Text style={styles.stepTag}>STEP 4 / 6</Text>
      <Text style={styles.stepTitle}>Your background</Text>

      <Text style={styles.fieldLabel}>Training Experience</Text>
      <View style={styles.optionList}>
        {TRAINING_BACKGROUNDS.map(b => (
          <TouchableOpacity
            key={b.value}
            style={[styles.optionRow, trainingBackground === b.value && styles.optionRowActive]}
            onPress={() => setTrainingBackground(b.value)}
          >
            <Text style={[styles.optionRowText, trainingBackground === b.value && styles.optionRowTextActive]}>
              {b.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Equipment Access</Text>
      <View style={styles.optionList}>
        {EQUIPMENT_OPTIONS.map(e => (
          <TouchableOpacity
            key={e.value}
            style={[styles.optionRow, equipment === e.value && styles.optionRowActive]}
            onPress={() => setEquipment(e.value)}
          >
            <Text style={[styles.optionRowText, equipment === e.value && styles.optionRowTextActive]}>
              {e.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Schedule
// ─────────────────────────────────────────────────────────────────────────────
function StepSchedule({ daysPerWeek, setDaysPerWeek, minutesPerSession, setMinutesPerSession }: {
  daysPerWeek: number | null;       setDaysPerWeek: (v: number) => void;
  minutesPerSession: number | null; setMinutesPerSession: (v: number) => void;
}) {
  return (
    <View style={styles.stepWrap}>
      <Text style={styles.stepTag}>STEP 5 / 6</Text>
      <Text style={styles.stepTitle}>Your schedule</Text>

      <Text style={styles.fieldLabel}>Days per week</Text>
      <View style={styles.pillRow}>
        {DAYS_OPTIONS.map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.selectPill, daysPerWeek === d && styles.selectPillActive]}
            onPress={() => setDaysPerWeek(d)}
          >
            <Text style={[styles.selectPillText, daysPerWeek === d && styles.selectPillTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>Minutes per session</Text>
      <View style={styles.pillRow}>
        {MINUTES_OPTIONS.map(m => (
          <TouchableOpacity
            key={m}
            style={[styles.selectPill, minutesPerSession === m && styles.selectPillActive]}
            onPress={() => setMinutesPerSession(m)}
          >
            <Text style={[styles.selectPillText, minutesPerSession === m && styles.selectPillTextActive]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Recap
// ─────────────────────────────────────────────────────────────────────────────
function StepRecap({ name, age, sex, heightFt, heightIn, weight, selectedGoals,
  trainingBackground, equipment, daysPerWeek, minutesPerSession }: {
  name: string; age: string; sex: Sex | null;
  heightFt: string; heightIn: string; weight: string;
  selectedGoals: Goal[]; trainingBackground: TrainingBackground | null;
  equipment: Equipment | null; daysPerWeek: number | null; minutesPerSession: number | null;
}) {
  const goalLabels = GOALS.filter(g => selectedGoals.includes(g.value)).map(g => g.label);
  const bgLabel    = TRAINING_BACKGROUNDS.find(b => b.value === trainingBackground)?.label;
  const eqLabel    = EQUIPMENT_OPTIONS.find(e => e.value === equipment)?.label;
  const sexLabel   = sex === 'male' ? 'Male' : sex === 'female' ? 'Female' : 'Prefer not to say';
  return (
    <View style={styles.stepWrap}>
      <Text style={styles.stepTag}>STEP 6 / 6</Text>
      <Text style={styles.stepTitle}>Looks good, {name}! 🔥</Text>
      <Text style={[styles.fieldLabel, { marginBottom: spacing.lg }]}>
        We'll build your personalized plan from this.
      </Text>
      <View style={styles.recapCard}>
        <RecapRow label="Name"       value={name}                />
        <RecapRow label="Age"        value={`${age} yrs`}        />
        <RecapRow label="Sex"        value={sexLabel}             />
        <RecapRow label="Height"     value={`${heightFt}' ${heightIn}"`} />
        <RecapRow label="Weight"     value={`${weight} lbs`}     />
        <RecapRow label="Goals"      value={goalLabels.join(', ')} />
        <RecapRow label="Experience" value={bgLabel ?? '—'}      />
        <RecapRow label="Equipment"  value={eqLabel ?? '—'}      />
        <RecapRow label="Schedule"   value={`${daysPerWeek} days/wk · ${minutesPerSession} min`} />
      </View>
    </View>
  );
}

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.recapRow}>
      <Text style={styles.recapLabel}>{label}</Text>
      <Text style={styles.recapValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature Tour Slide
// ─────────────────────────────────────────────────────────────────────────────
function FeatureTourSlide({ slide }: { slide: FeatureSlide }) {
  const { emoji, accentColor, badge, title, description, bullets } = slide;
  return (
    <View style={styles.featureWrap}>
      {/* Orb + Emoji */}
      <View style={styles.featureOrbWrap}>
        <View style={[styles.featureOrb, { backgroundColor: accentColor + '18', borderColor: accentColor + '35' }]} />
        <Text style={styles.featureEmoji}>{emoji}</Text>
      </View>

      {/* Badge + Title */}
      <View style={[styles.featureBadge, { backgroundColor: accentColor + '18', borderColor: accentColor + '40' }]}>
        <Text style={[styles.featureBadgeText, { color: accentColor }]}>{badge}</Text>
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{description}</Text>

      {/* Bullets */}
      <View style={styles.bulletList}>
        {bullets.map((b, i) => (
          <View key={i} style={[styles.bulletRow, { borderColor: accentColor + '28' }]}>
            <Text style={styles.bulletEmoji}>{b.emoji}</Text>
            <Text style={styles.bulletText}>{b.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step: Ready (final)
// ─────────────────────────────────────────────────────────────────────────────
function StepReady({ name }: { name: string }) {
  return (
    <View style={styles.readyWrap}>
      <Text style={styles.readyFireEmoji}>🔥</Text>
      <Text style={styles.readyTitle}>
        You're ready,{'\n'}{name || 'Cowtown'}!
      </Text>
      <Text style={styles.readyDesc}>
        Your plan is built. Your city is waiting.{'\n'}
        Fort Worth, Texas style.
      </Text>

      {/* Feature icon strip */}
      <View style={styles.readyIconRow}>
        {[
          { e: '🏠', c: colors.orange  },
          { e: '💪', c: '#3B82F6'      },
          { e: '🥗', c: colors.green   },
          { e: '📈', c: '#8B5CF6'      },
          { e: '📍', c: '#F59E0B'      },
        ].map((item, i) => (
          <View key={i} style={[styles.readyIcon, { borderColor: item.c + '40', backgroundColor: item.c + '12' }]}>
            <Text style={styles.readyIconEmoji}>{item.e}</Text>
          </View>
        ))}
      </View>

      <View style={styles.readyTagRow}>
        <View style={styles.readyTagDot} />
        <Text style={styles.readyTag}>📍 FORT WORTH, TX  ·  EST. 2024</Text>
        <View style={styles.readyTagDot} />
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // ── Progress bar ──────────────────────────────────────────────────────────
  progressTrack: {
    height: 3,
    backgroundColor: colors.card,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.orange,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },

  // ── Tour step dots ────────────────────────────────────────────────────────
  tourDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingTop: spacing.md,
  },
  tourDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tourDotActive: {
    width: 20,
    borderRadius: 3,
  },

  // ── Scroll content ────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },

  // ── Welcome ───────────────────────────────────────────────────────────────
  welcomeHero: {
    width: '100%',
    height: 500,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderRadius: radius.xl,
    marginBottom: spacing.sm,
  },
  welcomeHeroImg: { borderRadius: radius.xl },
  heroOverlayTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: radius.xl,
  },
  heroOverlayBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 300,
    backgroundColor: 'rgba(10,10,15,0.84)',
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    zIndex: 2,
  },
  locationPill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.orangeDim,
    marginBottom: spacing.md,
  },
  locationPillText: {
    fontSize: 10, fontWeight: '800', color: colors.orange, letterSpacing: 1.8,
  },
  welcomeBrand: {
    fontSize: 56, fontWeight: '900', color: '#FFFFFF',
    letterSpacing: -2, lineHeight: 56, marginBottom: spacing.md,
  },
  welcomeTagline: {
    fontSize: 16, color: 'rgba(255,255,255,0.72)', lineHeight: 24,
  },
  welcomeStar: {
    fontSize: 18, color: colors.orange, marginTop: spacing.md, opacity: 0.7,
  },

  // ── Profile steps ─────────────────────────────────────────────────────────
  stepWrap: {
    minHeight: 400,
  },
  stepTag: {
    fontSize: 10, fontWeight: '700', color: colors.orange,
    letterSpacing: 2, marginBottom: spacing.sm,
  },
  stepTitle: {
    ...typography.h1,
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 15,
  },
  heightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heightSep: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  pillRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  selectPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  selectPillActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },
  selectPillText: {
    ...typography.bodyMd,
    color: colors.textSecondary,
  },
  selectPillTextActive: {
    color: colors.bg, fontWeight: '700',
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  goalChip: {
    flex: 1,
    minWidth: SW / 2 - spacing.lg * 2 - spacing.md / 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  goalChipActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  goalChipText: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  goalChipTextActive: {
    color: colors.bg, fontWeight: '700',
  },
  optionList: { gap: spacing.sm },
  optionRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  optionRowActive: {
    backgroundColor: colors.orange,
    borderColor: colors.orange,
  },
  optionRowText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  optionRowTextActive: {
    color: colors.bg, fontWeight: '700',
  },
  recapCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    gap: spacing.md,
  },
  recapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  recapLabel: {
    ...typography.bodyMd,
    color: colors.textSecondary,
    flexShrink: 0,
  },
  recapValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },

  // ── Feature tour slide ────────────────────────────────────────────────────
  featureWrap: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  featureOrbWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  featureOrb: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
  },
  featureEmoji: {
    fontSize: 72,
    lineHeight: 88,
  },
  featureBadge: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: spacing.md,
  },
  featureBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  featureTitle: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  featureDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  bulletList: {
    width: '100%',
    gap: spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  bulletEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  bulletText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 22,
  },

  // ── Ready (final) ─────────────────────────────────────────────────────────
  readyWrap: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  readyFireEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  readyTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -1.2,
    lineHeight: 46,
    marginBottom: spacing.lg,
  },
  readyDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: spacing.xl,
  },
  readyIconRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  readyIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyIconEmoji: {
    fontSize: 24,
  },
  readyTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    opacity: 0.5,
  },
  readyTagDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: colors.orange,
  },
  readyTag: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.orange,
    letterSpacing: 1.8,
  },

  // ── Bottom nav ────────────────────────────────────────────────────────────
  navRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  backBtn: {
    flex: 0.28,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  nextBtn: {
    flex: 1,
    paddingVertical: spacing.md + 4,
    borderRadius: radius.full,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 7,
  },
  nextBtnDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextBtnText: {
    ...typography.button,
    color: colors.textInverse,
    fontWeight: '900',
  },
});
