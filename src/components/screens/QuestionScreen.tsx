import React, { useState, useEffect, useRef } from 'react';
import { LevelData, Question, QuestionResult } from '../../types/quiz';
import { HeaderHud } from '../common/HeaderHud';
import { QuestionImageCard } from '../common/QuestionImageCard';
import { GoalAnimation } from '../common/GoalAnimation';
import { sound } from '../../services/soundService';
import { Clock, ChevronRight } from 'lucide-react';

interface QuestionScreenProps {
  level: LevelData;
  score: number;
  hearts: number;
  isDailyChallenge?: boolean;
  onUpdateScore: (newScore: number) => void;
  onUpdateHearts: (newHearts: number) => void;
  onFinishLevel: (results: QuestionResult[], earnedScore: number) => void;
  onBackToLevels: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  level,
  score,
  hearts,
  isDailyChallenge = false,
  onUpdateScore,
  onUpdateHearts,
  onFinishLevel,
  onBackToLevels,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [expertUsed, setExpertUsed] = useState(false);
  const [challengeScoreEarned, setChallengeScoreEarned] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestion: Question = level.questions[currentQuestionIndex] || level.questions[0];

  // Reset state on each new question
  useEffect(() => {
    setTimeLeft(60);
    setSelectedOptionIndex(null);
    setIsAnswerLocked(false);
    setShowGoalModal(false);
    setEliminatedOptions([]);
    setHintUsed(false);
    setExpertUsed(false);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        if (prev <= 5) {
          sound.playTimerTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex]);

  // Timeout handler
  const handleTimeout = () => {
    if (isAnswerLocked) return;
    setIsAnswerLocked(true);
    sound.playWrong();

    const nextHearts = Math.max(0, hearts - 1);
    onUpdateHearts(nextHearts);

    const questionResult: QuestionResult = {
      questionNumber: currentQuestionIndex + 1,
      questionText: currentQuestion.questionText,
      categoryTitle: currentQuestion.categoryTitle,
      imageType: currentQuestion.imageType,
      imageIdentifier: currentQuestion.imageIdentifier,
      options: currentQuestion.options,
      selectedOptionIndex: null,
      userAnswer: 'Timed Out',
      correctAnswer: currentQuestion.options[currentQuestion.correctAnswerIndex],
      correctAnswerIndex: currentQuestion.correctAnswerIndex,
      isCorrect: false,
      timeRemaining: 0,
    };

    const newResults = [...results, questionResult];
    setResults(newResults);

    setTimeout(() => {
      advanceNextQuestion(newResults);
    }, 1600);
  };

  // Option selection
  const handleSelectOption = (index: number) => {
    if (isAnswerLocked || eliminatedOptions.includes(index)) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswerLocked(true);
    setSelectedOptionIndex(index);

    const isCorrect = index === currentQuestion.correctAnswerIndex;
    const selectedAnswerText = currentQuestion.options[index];
    const correctAnswerText = currentQuestion.options[currentQuestion.correctAnswerIndex];

    const questionResult: QuestionResult = {
      questionNumber: currentQuestionIndex + 1,
      questionText: currentQuestion.questionText,
      categoryTitle: currentQuestion.categoryTitle,
      imageType: currentQuestion.imageType,
      imageIdentifier: currentQuestion.imageIdentifier,
      options: currentQuestion.options,
      selectedOptionIndex: index,
      userAnswer: selectedAnswerText,
      correctAnswer: correctAnswerText,
      correctAnswerIndex: currentQuestion.correctAnswerIndex,
      isCorrect,
      timeRemaining: timeLeft,
    };

    const newResults = [...results, questionResult];
    setResults(newResults);

    if (isCorrect) {
      sound.playCorrect();
      // Add real score points: 100 base points + time bonus
      const pointsEarned = 100 + timeLeft * 2;
      setChallengeScoreEarned((prev) => prev + pointsEarned);
      if (!isDailyChallenge) {
        onUpdateScore(score + pointsEarned);
      }

      setTimeout(() => {
        setShowGoalModal(true);
      }, 350);
    } else {
      sound.playWrong();
      const nextHearts = Math.max(0, hearts - 1);
      onUpdateHearts(nextHearts);

      // Wait 1.6s so player clearly perceives the red wrong and revealed green correct option
      setTimeout(() => {
        advanceNextQuestion(newResults);
      }, 1600);
    }
  };

  // Advance to next question or complete level ONLY after final question!
  const advanceNextQuestion = (latestResults: QuestionResult[]) => {
    setShowGoalModal(false);
    if (currentQuestionIndex + 1 < level.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed ALL questions in level!
      onFinishLevel(latestResults, challengeScoreEarned);
    }
  };

  // Hint (50/50 elimination)
  const handleUseHint = () => {
    if (hintUsed || isAnswerLocked) return;
    sound.playTap();
    setHintUsed(true);

    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQuestion.correctAnswerIndex);
    const toEliminate = wrongIndices.slice(0, 2);
    setEliminatedOptions(toEliminate);
  };

  // Expert (Reveal correct)
  const handleUseExpert = () => {
    if (expertUsed || isAnswerLocked) return;
    sound.playTap();
    setExpertUsed(true);

    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQuestion.correctAnswerIndex);
    setEliminatedOptions(wrongIndices);
  };

  const progressPercent = Math.round(((currentQuestionIndex) / level.questions.length) * 100);

  return (
    // BRIGHT, CLEAN, SPORTS-FOCUSED PALETTE (Requirement #24)
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-[#eef6ff] via-[#f7fbff] to-[#e8f3fe] text-slate-800 relative overflow-hidden select-none pb-4">
      {/* Soft pitch grass aura and subtle curves */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-100/60 to-transparent pointer-events-none" />

      {/* Top HUD */}
      <div className="w-full max-w-md mx-auto">
        <HeaderHud
          mode="question"
          score={score}
          hearts={hearts}
          levelNumber={level.levelNumber}
          onBackClick={() => {
            sound.playTap();
            onBackToLevels();
          }}
        />

        {/* Question Counter & Timer Bar */}
        <div className="flex items-center justify-between px-5 py-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-900">
            <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-black text-[11px]">
              Question {currentQuestionIndex + 1}/{level.questions.length}
            </span>
          </div>

          {/* 60s Countdown Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono font-bold text-xs shadow-xs ${
            timeLeft <= 10
              ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
              : 'bg-white text-blue-800 border border-blue-200'
          }`}>
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>
        </div>

        {/* Progress Bar (Bright Blue & Green) */}
        <div className="w-full px-5">
          <div className="w-full h-2 rounded-full bg-blue-100 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card Container */}
      <div className="w-full max-w-md mx-auto px-4 flex flex-col items-center justify-center flex-1 my-2">
        {/* Category Header */}
        <span className="text-xs font-black tracking-widest text-blue-800 uppercase mb-2 text-center drop-shadow-xs">
          {currentQuestion.categoryTitle}
        </span>

        {/* White Question Image Card */}
        <div className="w-full mb-3">
          <QuestionImageCard
            question={currentQuestion}
            onUseHint={handleUseHint}
            onUseExpert={handleUseExpert}
            hintUsed={hintUsed}
            expertUsed={expertUsed}
          />
        </div>

        {/* Question Text in Dark High-Readability Font on White surface */}
        <div className="w-full max-w-[350px] p-3 rounded-2xl bg-white border border-blue-100 shadow-sm text-center mb-3">
          <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {currentQuestion.questionText}
          </p>
        </div>

        {/* 2x2 Answer Grid */}
        <div className="w-full max-w-[350px] grid grid-cols-2 gap-2.5">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOptionIndex === index;
            const isCorrect = index === currentQuestion.correctAnswerIndex;
            const isEliminated = eliminatedOptions.includes(index);

            // Default: Crisp white button with blue border and slate text
            let buttonClasses = 'bg-white border-2 border-blue-100 text-slate-800 hover:border-blue-400 hover:bg-blue-50/60 shadow-xs';
            let badge = null;

            if (isAnswerLocked) {
              if (isSelected) {
                if (isCorrect) {
                  buttonClasses = 'bg-emerald-600 border-2 border-emerald-500 text-white shadow-md animate-scaleUp';
                  badge = (
                    <span className="absolute -top-2.5 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full bg-emerald-700 text-[9px] font-black text-white tracking-widest uppercase shadow-xs">
                      CORRECT ✓
                    </span>
                  );
                } else {
                  buttonClasses = 'bg-rose-600 border-2 border-rose-500 text-white shadow-md animate-shake';
                  badge = (
                    <span className="absolute -top-2.5 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full bg-rose-700 text-[9px] font-black text-white tracking-widest uppercase shadow-xs">
                      WRONG ✕
                    </span>
                  );
                }
              } else if (isCorrect) {
                // Revealed correct answer in Green
                buttonClasses = 'bg-emerald-600 border-2 border-emerald-500 text-white shadow-md';
                badge = (
                  <span className="absolute -top-2.5 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full bg-emerald-700 text-[9px] font-black text-white tracking-widest uppercase shadow-xs">
                    CORRECT ✓
                  </span>
                );
              } else {
                buttonClasses = 'opacity-40 bg-slate-100 border-slate-200 text-slate-400';
              }
            } else if (isEliminated) {
              buttonClasses = 'opacity-30 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through';
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                disabled={isAnswerLocked || isEliminated}
                className={`relative min-h-[52px] px-3 py-2 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center text-center transition-all duration-150 active:scale-97 cursor-pointer ${buttonClasses}`}
              >
                {badge}
                <span className="line-clamp-2 leading-tight">
                  {option}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Sub-Navigation Bar */}
      <div className="w-full max-w-md mx-auto px-5 pt-2 flex items-center justify-between">
        <button
          onClick={() => {
            sound.playTap();
            onBackToLevels();
          }}
          className="text-xs font-bold text-slate-500 hover:text-blue-700 transition-colors"
        >
          Exit Level
        </button>

        {isAnswerLocked && (
          <button
            onClick={() => {
              sound.playTap();
              advanceNextQuestion(results);
            }}
            className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>Next Question</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* GOAL! Celebratory Modal */}
      {showGoalModal && (
        <GoalAnimation
          rewardCoins={100}
          questionIndex={currentQuestionIndex}
          totalQuestions={level.questions.length}
          onContinue={() => advanceNextQuestion(results)}
        />
      )}
    </div>
  );
};
