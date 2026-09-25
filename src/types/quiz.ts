export type ScreenType = 
  | 'SPLASH'
  | 'LIBRARY'
  | 'LOGIN'
  | 'MAIN'
  | 'LEVEL_SELECT'
  | 'PLAYING'
  | 'CONGRATULATIONS'
  | 'REVIEW';

export type MainTab = 'levels' | 'leaderboard' | 'settings';

export type BottomNavTab = 'HOME' | 'GAME' | 'LEADERBOARD' | 'PROFILE';

export type QuizMode = 'LEVEL' | 'DAILY';

export interface UserProfile {
  msisdn: string;
  maskedMsisdn: string;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  subscriptionDate?: string;
  language: 'en' | 'am' | 'om';
  notificationsEnabled: boolean;
}

export interface DailyChallengeState {
  date: string; // YYYY-MM-DD
  completed: boolean;
  todayScore: number;
  history: Record<string, number>; // date -> daily score
  competitionCycleStart: string; // YYYY-MM-DD
  currentDayInCycle: number; // 1..7 (e.g. Day 4 of 7)
  sevenDayTotal: number;
}

export interface EthioLeaderboardEntry {
  rank: number;
  maskedMsisdn: string;
  sevenDayScore: number;
  isCurrentUser?: boolean;
}

export interface Question {
  id: string;
  categoryTitle: string; // e.g. "GUESS THE FOOTBALL PLAYER", "GUESS THE CLUB", "FOOTBALL BASICS", "ETHIOPIAN FOOTBALL"
  questionText: string;
  type: 'player' | 'club' | 'trivia' | 'trophy' | 'stadium';
  imageType?: 'player' | 'club' | 'rules' | 'trophy' | 'stadium' | 'referee' | 'card' | 'pitch' | 'ball' | 'striker' | 'whistle' | 'lion';
  imageIdentifier?: string; // e.g. 'kempes', 'son', 'jorginho', 'okocha', 'cruz_azul', 'bate_borisov', 'saint_george', etc.
  playerClubBadge?: string;
  options: [string, string, string, string];
  correctAnswerIndex: number; // 0..3
  hintCost?: number;
  expertCost?: number;
}

export interface QuestionResult {
  questionNumber: number;
  questionText: string;
  categoryTitle: string;
  imageType?: string;
  imageIdentifier?: string;
  options: [string, string, string, string];
  selectedOptionIndex: number | null;
  userAnswer: string;
  correctAnswer: string;
  correctAnswerIndex: number;
  isCorrect: boolean;
  timeRemaining: number;
}

export interface LevelData {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  levelNumber: number;
  totalQuestions: number;
  iconType: 'ball' | 'referee' | 'pitch' | 'striker' | 'card' | 'whistle' | 'trophy' | 'lion' | 'crown' | 'shield';
  accentColor: string;
  questions: Question[];
}

export interface UserProgress {
  score: number; // Total game score points
  stars: number; // Total stars earned
  hearts: number; // Lives
  unlockedLevelIds: number[]; // e.g. [1] initially
  completedLevelIds: number[];
  levelStars: Record<number, number>; // levelId -> stars (0..3)
  levelScores: Record<number, number>; // levelId -> points score
  levelPercentages: Record<number, number>; // levelId -> percentage (0..100)
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  levelsCompleted: number;
  avatar: string;
  isCurrentUser?: boolean;
}
