import { UserProfile, DailyChallengeState, EthioLeaderboardEntry, Question } from '../types/quiz';
import { LEVELS } from '../data/levelsData';

const USER_PROFILE_KEY = 'ethiofantasy_user_profile_v1';
const DAILY_CHALLENGE_PREFIX = 'ethiofantasy_daily_challenge_v1_';

/**
 * Standardize and Mask Ethiopian MSISDN
 * Input: "0912345678" or "+251912345678" or "251912345678" or "912345678"
 * Output: "2519******78"
 */
export function normalizeMsisdn(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('251')) {
    return digits;
  }
  if (digits.startsWith('09')) {
    return '251' + digits.substring(1);
  }
  if (digits.startsWith('9')) {
    return '251' + digits;
  }
  return digits.length > 0 ? digits : '251912345678';
}

export function maskMsisdn(msisdn: string): string {
  const norm = normalizeMsisdn(msisdn);
  if (norm.length >= 5) {
    const start = norm.substring(0, 3); // "251" (3 digits)
    const end = norm.substring(norm.length - 2); // e.g. "22" (2 digits) - total 5 visible digits
    return `${start}*******${end}`;
  }
  return '251*******22';
}

/**
 * Centralized Service Date (YYYY-MM-DD)
 */
export function getCurrentServiceDate(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Calculate Day of 7-Day Cycle (1..7) based on day of week (Mon = 1, Sun = 7)
 */
export function getCycleDayInfo(currentDateStr: string): { dayNumber: number; daysRemaining: number } {
  const date = new Date(currentDateStr);
  const dayOfWeek = date.getDay(); // 0 is Sun, 1 is Mon...
  const dayNumber = dayOfWeek === 0 ? 7 : dayOfWeek; // Mon = 1 ... Sun = 7
  const daysRemaining = 7 - dayNumber;
  return { dayNumber, daysRemaining };
}

/**
 * User Profile Management
 */
const DEFAULT_PROFILE: UserProfile = {
  msisdn: '251965112122',
  maskedMsisdn: '251*******22',
  isLoggedIn: true,
  isSubscribed: true,
  subscriptionDate: '2026-09-20',
  language: 'en',
  notificationsEnabled: true,
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      maskedMsisdn: maskMsisdn(parsed.msisdn || DEFAULT_PROFILE.msisdn),
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    const withMask = {
      ...profile,
      maskedMsisdn: maskMsisdn(profile.msisdn),
    };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(withMask));
  } catch (e) {
    console.error('Error saving EthioFantasy profile', e);
  }
}

/**
 * Daily Challenge Management
 */
export function loadDailyChallengeState(msisdn: string): DailyChallengeState {
  const today = getCurrentServiceDate();
  const { dayNumber } = getCycleDayInfo(today);
  const storageKey = `${DAILY_CHALLENGE_PREFIX}${normalizeMsisdn(msisdn)}`;

  try {
    const raw = localStorage.getItem(storageKey);
    let state: DailyChallengeState;

    if (raw) {
      state = JSON.parse(raw);
    } else {
      // Seed with some realistic earlier days in current 7-day cycle for engaging competition demo
      const baseHistory: Record<string, number> = {};
      const d = new Date();
      // populate previous days with scores
      for (let i = 1; i < dayNumber; i++) {
        const past = new Date(d);
        past.setDate(d.getDate() - i);
        const y = past.getFullYear();
        const m = String(past.getMonth() + 1).padStart(2, '0');
        const dt = String(past.getDate()).padStart(2, '0');
        baseHistory[`${y}-${m}-${dt}`] = 680 + (i * 70);
      }

      state = {
        date: today,
        completed: false,
        todayScore: 0,
        history: baseHistory,
        competitionCycleStart: today,
        currentDayInCycle: dayNumber,
        sevenDayTotal: Object.values(baseHistory).reduce((a, b) => a + b, 0),
      };
    }

    // Check if the date in state is today
    if (state.date !== today) {
      // New day! Today is not completed yet, update date
      state.date = today;
      state.completed = false;
      state.todayScore = 0;
      state.currentDayInCycle = dayNumber;
    }

    // Recalculate 7-day total from last 7 days
    const total = Object.values(state.history).reduce((acc, curr) => acc + curr, 0);
    state.sevenDayTotal = total + (state.completed ? state.todayScore : 0);

    return state;
  } catch {
    return {
      date: today,
      completed: false,
      todayScore: 0,
      history: {},
      competitionCycleStart: today,
      currentDayInCycle: dayNumber,
      sevenDayTotal: 0,
    };
  }
}

export function recordDailyChallengeScore(msisdn: string, score: number): DailyChallengeState {
  const today = getCurrentServiceDate();
  const current = loadDailyChallengeState(msisdn);

  const updatedHistory = {
    ...current.history,
    [today]: score,
  };

  const total = Object.values(updatedHistory).reduce((acc, curr) => acc + curr, 0);

  const updated: DailyChallengeState = {
    ...current,
    date: today,
    completed: true,
    todayScore: score,
    history: updatedHistory,
    sevenDayTotal: total,
  };

  try {
    const storageKey = `${DAILY_CHALLENGE_PREFIX}${normalizeMsisdn(msisdn)}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving daily challenge', e);
  }

  return updated;
}

/**
 * Top 10 Leaderboard (Deterministic & Real 7-Day Scores)
 * Masked MSISDN ONLY. NO names, NO photos, NO full numbers.
 */
export function getTop10Leaderboard(
  currentUserMsisdn: string,
  user7DayScore: number
): { top10: EthioLeaderboardEntry[]; userPosition: EthioLeaderboardEntry | null } {
  const currentMasked = maskMsisdn(currentUserMsisdn);

  // Deterministic top players pool for EthioFantasy 7-Day Competition (5 digits visible)
  const mockPlayers: Array<{ maskedMsisdn: string; score: number }> = [
    { maskedMsisdn: '251*******14', score: 5820 },
    { maskedMsisdn: '251*******89', score: 5640 },
    { maskedMsisdn: '251*******03', score: 5490 },
    { maskedMsisdn: '251*******77', score: 5310 },
    { maskedMsisdn: '251*******42', score: 5180 },
    { maskedMsisdn: '251*******95', score: 5020 },
    { maskedMsisdn: '251*******31', score: 4860 },
    { maskedMsisdn: '251*******66', score: 4710 },
    { maskedMsisdn: '251*******18', score: 4550 },
    { maskedMsisdn: '251*******50', score: 4390 },
    { maskedMsisdn: '251*******27', score: 4210 },
    { maskedMsisdn: '251*******62', score: 4050 },
    { maskedMsisdn: '251*******81', score: 3880 },
  ];

  // Combine with current user
  const allEntries: Array<{ maskedMsisdn: string; score: number; isCurrentUser?: boolean }> = [
    { maskedMsisdn: currentMasked, score: user7DayScore, isCurrentUser: true },
    ...mockPlayers.filter((p) => p.maskedMsisdn !== currentMasked),
  ];

  // Deterministic sort: higher score first, if equal sort by masked string
  allEntries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.maskedMsisdn.localeCompare(b.maskedMsisdn);
  });

  // Assign ranks
  const ranked: EthioLeaderboardEntry[] = allEntries.map((p, idx) => ({
    rank: idx + 1,
    maskedMsisdn: p.maskedMsisdn,
    sevenDayScore: p.score,
    isCurrentUser: p.isCurrentUser,
  }));

  const top10 = ranked.slice(0, 10);
  const currentUserEntry = ranked.find((p) => p.isCurrentUser);

  let userPosition: EthioLeaderboardEntry | null = null;
  if (currentUserEntry && currentUserEntry.rank > 10) {
    userPosition = currentUserEntry;
  }

  return { top10, userPosition };
}

/**
 * Deterministic Daily Challenge Question Set
 * Exactly 10 questions picked deterministically for the given service date
 * so all players get the exact same challenge questions each day.
 */
export function getDailyChallengeQuestions(dateStr: string): Question[] {
  // Use date string as seed
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  // Pick questions across diverse levels from LEVELS
  const questions: Question[] = [];
  const levelCount = LEVELS.length;

  for (let i = 0; i < 10; i++) {
    const levelIdx = (positiveHash + i * 7) % levelCount;
    const targetLevel = LEVELS[levelIdx];
    const qIdx = (positiveHash + i * 3) % targetLevel.questions.length;
    const originalQ = targetLevel.questions[qIdx];

    questions.push({
      ...originalQ,
      id: `daily_${dateStr}_q${i + 1}`,
      categoryTitle: 'DAILY CHALLENGE',
    });
  }

  return questions;
}
