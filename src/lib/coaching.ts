/**
 * Funkytown Fit — Behavior Change & Recovery Coaching Engine
 *
 * Computes recovery scores, generates daily recommendations,
 * drives identity-based coaching messages, and manages streak motivation.
 *
 * No external dependencies — runs in Expo Go.
 */

import { HealthData } from './healthkit';
import { StreakData } from './storage';

// ── Recovery ──────────────────────────────────────────────────────────────────

export type RecoveryLevel = 'low' | 'moderate' | 'high';

export interface RecoveryScore {
  score: number;          // 0–100
  level: RecoveryLevel;
  label: string;          // "Ready to push", "Steady state", "Easy day"
  color: string;          // hex
  emoji: string;
  summary: string;        // "7.4h · HRV 48ms · RHR 58"
  aiContext: string;      // injected into AI prompts
  workoutTip: string;     // short workout guidance
}

/**
 * Compute recovery score from overnight/morning HealthKit data.
 * Each metric is optional — score degrades gracefully if data is missing.
 */
export function computeRecovery(health: HealthData): RecoveryScore {
  let score = 0;
  let dataPoints = 0;

  // ── Sleep (0-40 pts) ────────────────────────────────────────────────────
  if (health.sleepHours !== null) {
    dataPoints++;
    const h = health.sleepHours;
    if      (h >= 8.5) score += 40;
    else if (h >= 7.5) score += 35;
    else if (h >= 7.0) score += 28;
    else if (h >= 6.0) score += 18;
    else if (h >= 5.0) score += 10;
    else               score += 4;
  }

  // ── HRV — SDNN ms (0-35 pts) ────────────────────────────────────────────
  // Average adult HRV: 20-65ms; higher = more recovered
  if (health.hrv !== null) {
    dataPoints++;
    const h = health.hrv;
    if      (h >= 65) score += 35;
    else if (h >= 50) score += 30;
    else if (h >= 35) score += 22;
    else if (h >= 20) score += 12;
    else              score += 5;
  }

  // ── Resting Heart Rate (0-25 pts) ───────────────────────────────────────
  // Lower resting HR = better recovery
  if (health.restingHeartRate !== null) {
    dataPoints++;
    const r = health.restingHeartRate;
    if      (r < 55)  score += 25;
    else if (r < 60)  score += 20;
    else if (r < 65)  score += 15;
    else if (r < 75)  score += 8;
    else              score += 3;
  }

  // If no data, return neutral "unknown" state
  if (dataPoints === 0) {
    return {
      score: -1, level: 'moderate',
      label: 'Connecting…',
      color: '#6B7280',
      emoji: '📡',
      summary: 'No health data yet',
      aiContext: '',
      workoutTip: 'Track your workouts and sleep to get personalized recommendations.',
    };
  }

  // Normalize: scale up if we only have partial data
  // (so 1 data point at max = ~75, not 25)
  const maxPossible = dataPoints === 3 ? 100 : dataPoints === 2 ? 75 : 40;
  const normalized = Math.min(Math.round((score / maxPossible) * 100), 100);

  const level: RecoveryLevel = normalized >= 70 ? 'high' : normalized >= 40 ? 'moderate' : 'low';

  const summaryParts: string[] = [];
  if (health.sleepHours !== null) summaryParts.push(`${health.sleepHours}h sleep`);
  if (health.hrv        !== null) summaryParts.push(`HRV ${health.hrv}ms`);
  if (health.restingHeartRate !== null) summaryParts.push(`RHR ${health.restingHeartRate}`);

  const configs: Record<RecoveryLevel, { label: string; color: string; emoji: string; workoutTip: string; aiContext: string }> = {
    high: {
      label:      'Ready to push',
      color:      '#22C55E',
      emoji:      '🔥',
      workoutTip: 'High recovery — great day for a PR attempt or heavy session.',
      aiContext:  'User has HIGH recovery today (good sleep, strong HRV). Program a challenging, high-intensity session.',
    },
    moderate: {
      label:      'Steady state',
      color:      '#F59E0B',
      emoji:      '⚡',
      workoutTip: 'Solid recovery — hit your planned session at full effort.',
      aiContext:  'User has MODERATE recovery today. Program the planned workout at normal intensity.',
    },
    low: {
      label:      'Easy day',
      color:      '#EF4444',
      emoji:      '🌊',
      workoutTip: 'Low recovery — focus on mobility, a walk, or a light session.',
      aiContext:  'User has LOW recovery today (poor sleep or low HRV). Recommend mobility work, a light walk, or active recovery — NOT a heavy session.',
    },
  };

  const cfg = configs[level];

  return {
    score: normalized,
    level,
    label:      cfg.label,
    color:      cfg.color,
    emoji:      cfg.emoji,
    summary:    summaryParts.join(' · ') || 'Partial data',
    aiContext:  cfg.aiContext,
    workoutTip: cfg.workoutTip,
  };
}

// ── Identity Messages (behavior change) ───────────────────────────────────────

const IDENTITY_MESSAGES = [
  "You're the kind of person who shows up every day.",
  "Fort Worth's got a rep. So do you.",
  "Small daily choices build the person you're becoming.",
  "Consistency beats intensity. Every time.",
  "You didn't come this far to only come this far.",
  "Champions are made in the moments no one sees.",
  "The body keeps score. Make it good ones.",
  "Movement is the message. Send it daily.",
  "This is what doing the work looks like.",
  "Strong mind, strong body, strong Funkytown.",
];

/** Returns a deterministic identity message based on today's date. */
export function getDailyIdentityMessage(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return IDENTITY_MESSAGES[dayOfYear % IDENTITY_MESSAGES.length];
}

// ── Daily Habit Articles ──────────────────────────────────────────────────────

export interface DailyArticle {
  title: string;
  body: string;           // 2-3 sentences, science-backed
  source: string;         // researcher / study reference
  challenge: string;      // one specific thing to do today
  challengeEmoji: string;
}

const DAILY_ARTICLES: DailyArticle[] = [
  {
    title: 'The 2-Minute Rule',
    body: 'BJ Fogg\'s behavior research at Stanford shows that making a habit as small as possible eliminates the psychological resistance to starting. James Clear expanded this: any habit should take under 2 minutes to begin. Starting tiny is not a compromise — it\'s the mechanism.',
    source: 'Fogg (2019), Tiny Habits · Clear (2018), Atomic Habits',
    challenge: 'Do 2 minutes of movement right now — squats, a walk, anything.',
    challengeEmoji: '⚡',
  },
  {
    title: 'Habit Stacking Works',
    body: 'When you attach a new behavior to an existing one ("After I pour my morning coffee, I will log yesterday\'s weight"), follow-through increases by 40%. This is called implementation chaining and exploits your brain\'s existing neural pathways.',
    source: 'Gollwitzer (1999), Journal of Personality and Social Psychology',
    challenge: 'After your next meal, immediately drink a full glass of water.',
    challengeEmoji: '💧',
  },
  {
    title: 'Identity Beats Motivation',
    body: 'Wendy Wood at USC found that 43% of daily actions are automatic habits, not conscious choices. People who describe themselves as "a person who exercises" exercise 30% more than those who say "I\'m trying to get fit." The label changes the behavior.',
    source: 'Wood & Neal (2007), Psychological Review',
    challenge: 'Say it out loud: "I\'m someone who shows up for themselves every day."',
    challengeEmoji: '🧠',
  },
  {
    title: 'Sleep Is the Performance Drug',
    body: 'Matthew Walker\'s research at UC Berkeley shows that sleeping under 7 hours cuts athletic performance, reaction time, and decision-making by up to 30%. Even one night of poor sleep spikes cortisol and suppresses muscle protein synthesis.',
    source: 'Walker (2017), Why We Sleep · Sleep Research Society',
    challenge: 'Set a bedtime alarm for tonight — same time every night.',
    challengeEmoji: '🌙',
  },
  {
    title: 'Protein Timing Is Real',
    body: 'A 2013 meta-analysis by Schoenfeld found that consuming 20–40g of protein within 2 hours post-workout boosts muscle protein synthesis by up to 50%. Your muscles are most receptive to amino acids immediately after training.',
    source: 'Schoenfeld & Aragon (2013), Journal of the International Society of Sports Nutrition',
    challenge: 'Plan your post-workout meal right now — before your session.',
    challengeEmoji: '🥩',
  },
  {
    title: 'Skipping Once Is Dangerous',
    body: 'Research on habit disruption shows that missing a behavior once doubles the probability of missing it again the next day. The first skip is not a failure — it\'s a warning. The second skip is when habits die.',
    source: 'Phillippa Lally et al. (2010), European Journal of Social Psychology',
    challenge: 'Don\'t let today be a skip day. Even 10 minutes counts.',
    challengeEmoji: '🛡️',
  },
  {
    title: 'Cold Water & Your Brain',
    body: 'Huberman Lab research shows that 11 minutes of cold exposure per week (not per session) raises norepinephrine by 300% and dopamine by 250% for hours afterward — improving focus, mood, and willpower. Cold showers count.',
    source: 'Søberg et al. (2021), Cell Reports Medicine · Huberman Lab',
    challenge: 'End your shower cold today. 30 seconds minimum.',
    challengeEmoji: '🧊',
  },
  {
    title: 'Exercise Beats Anxiety',
    body: 'A landmark 2018 meta-analysis in JAMA Psychiatry confirmed that 30 minutes of moderate exercise is as effective as first-line antidepressants for mild-to-moderate depression and anxiety — with zero side effects.',
    source: 'Blumenthal et al. (2018), JAMA Internal Medicine',
    challenge: 'Get 30 minutes of movement today. Walk, lift, anything.',
    challengeEmoji: '🏃',
  },
  {
    title: 'Your Gut Runs Your Mood',
    body: '90% of your body\'s serotonin is produced in the gut, not the brain. UCLA researchers found that individuals with diverse gut microbiomes — fed by fiber and fermented foods — report lower anxiety and better emotional regulation.',
    source: 'Mayer et al. (2015), Nature Reviews Neuroscience',
    challenge: 'Add one plant food to your next meal — any vegetable or fruit.',
    challengeEmoji: '🥦',
  },
  {
    title: 'Celebrate the Small Win',
    body: 'Wolfram Schultz\'s Nobel Prize-winning dopamine research shows that reward prediction error — the brain\'s excitement at achieving something expected — is what reinforces habit loops. Celebrating small wins trains your brain to want to repeat the behavior.',
    source: 'Schultz et al. (1997), Science · Fogg (2019)',
    challenge: 'After your workout today, do something that feels like a reward.',
    challengeEmoji: '🏆',
  },
  {
    title: 'Progressive Overload Is Non-Negotiable',
    body: 'Hans Selye\'s General Adaptation Syndrome (the foundation of all strength science) states: muscles grow only when exposed to progressively greater stress. Doing the same workout indefinitely produces zero adaptation after 3–6 weeks.',
    source: 'Selye (1956), Stress · NSCA Strength and Conditioning Journal',
    challenge: 'Add 2.5 lbs or 1 rep to at least one lift today.',
    challengeEmoji: '💪',
  },
  {
    title: 'Tell Someone Your Plan',
    body: 'A Dominican University study by Dr. Gail Matthews found that people who write down their goals AND share them with an accountability partner are 33% more likely to achieve them — compared to those who only think about the goal.',
    source: 'Matthews (2015), Dominican University of California',
    challenge: 'Text one person your workout or nutrition goal for today.',
    challengeEmoji: '📲',
  },
  {
    title: 'Walking Unlocks Your Brain',
    body: 'A Stanford study found that walking boosts creative output by 81% compared to sitting. Oppezzo and Schwartz (2014) showed that the effect continues even after sitting back down — movement primes the brain for divergent thinking.',
    source: 'Oppezzo & Schwartz (2014), Journal of Experimental Psychology',
    challenge: 'Take a 10-minute walk before your most demanding task today.',
    challengeEmoji: '🚶',
  },
  {
    title: 'The 1% Principle',
    body: 'Mathematician and habits researcher Darren Hardy quantified what James Clear later popularized: improving 1% per day compounds to 37x improvement in a year. Conversely, declining 1% daily leaves you at 3% of where you started. Tiny edges compound.',
    source: 'Hardy (2010), The Compound Effect · Clear (2018), Atomic Habits',
    challenge: 'Find one thing to do 1% better today than yesterday.',
    challengeEmoji: '📈',
  },
];

/** Returns a deterministic daily article based on today's date. */
export function getDailyArticle(): DailyArticle {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_ARTICLES[dayOfYear % DAILY_ARTICLES.length];
}

/** Returns the index of today's article in DAILY_ARTICLES. */
export function getTodayArticleIndex(): number {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dayOfYear % DAILY_ARTICLES.length;
}

/** Returns all articles — for the Habit Lab archive view. */
export function getAllArticles(): DailyArticle[] {
  return DAILY_ARTICLES;
}

// ── Streak coaching ───────────────────────────────────────────────────────────

export interface StreakCoachingMessage {
  type: 'milestone' | 'shield_warning' | 'comeback' | 'keep_going';
  emoji: string;
  title: string;
  body: string;
}

export function getStreakCoachingMessage(streak: StreakData): StreakCoachingMessage | null {
  const { current, longest, lastWorkoutDate } = streak;

  // Streak shield warning: worked out yesterday but not yet today
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const isAtRisk = current > 0 && lastWorkoutDate === yesterday;

  if (isAtRisk && current >= 3) {
    return {
      type: 'shield_warning',
      emoji: '🛡️',
      title: `${current}-day streak at risk`,
      body: "Don't let it slip — log a workout or a walk today to protect it.",
    };
  }

  // Milestones
  const MILESTONES = [3, 7, 14, 21, 30, 60, 100];
  if (MILESTONES.includes(current)) {
    return {
      type: 'milestone',
      emoji: '🏆',
      title: `${current}-day streak!`,
      body: current === 7
        ? "One week straight. That's the hardest part — you're past it."
        : current === 30
        ? "30 days. This is a habit now. Don't stop."
        : `${current} days of showing up. Keep stacking.`,
    };
  }

  // Comeback after a break
  if (current === 1 && longest > 3 && lastWorkoutDate === today) {
    return {
      type: 'comeback',
      emoji: '💪',
      title: 'Back at it',
      body: 'Day 1 of the comeback. The hardest part is done.',
    };
  }

  // Ongoing motivation (every 5 days)
  if (current > 0 && current % 5 === 0) {
    return {
      type: 'keep_going',
      emoji: '🔥',
      title: `${current} days strong`,
      body: "Momentum is everything. You've got it.",
    };
  }

  return null;
}

// ── Variable reward messages ──────────────────────────────────────────────────

const VARIABLE_REWARDS = [
  { emoji: '⭐', msg: "Star performance today. Fort Worth knows what's up." },
  { emoji: '🤠', msg: "Cowtown approved. That session was legit." },
  { emoji: '🏅', msg: "That workout just earned Funkytown Hall of Fame status." },
  { emoji: '🌟', msg: "You put in real work today. That counts for everything." },
  { emoji: '🎯', msg: "Dialed in. Mind, body, and macros on point." },
];

/** Occasionally (1-in-4 chance) returns a variable reward message, else null. */
export function maybeGetVariableReward(): { emoji: string; msg: string } | null {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  // Deterministic "random" based on day — shows on days 0, 4, 8, 13, 17 etc (not truly random but consistent per day)
  if (dayOfYear % 4 !== 0 && dayOfYear % 7 !== 0) return null;
  return VARIABLE_REWARDS[dayOfYear % VARIABLE_REWARDS.length];
}

// ── AI prompt builder ─────────────────────────────────────────────────────────

/**
 * Build the context string injected into AI workout generation prompts.
 * Used by WorkoutScreen when calling the Anthropic API.
 */
export function buildWorkoutAIContext(
  recovery: RecoveryScore,
  streak: StreakData,
  dailyCommitment: string,
): string {
  if (!recovery.aiContext) return '';
  return [
    recovery.aiContext,
    streak.current > 0 ? `User is on a ${streak.current}-day streak — keep the momentum.` : '',
    dailyCommitment ? `Today's commitment: "${dailyCommitment}"` : '',
  ].filter(Boolean).join(' ');
}
