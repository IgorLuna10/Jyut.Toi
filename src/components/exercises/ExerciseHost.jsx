import React, { useState, useEffect } from 'react';
import { X, Flame, Heart, CheckCircle2, AlertCircle, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { useSessionStore } from '../../store/sessionStore';
import { hapticsService } from '../../services/hapticsService';
import SentenceScramble from './SentenceScramble';
import ToneMinimalPair from './ToneMinimalPair';
import MultipleChoiceExercise from './MultipleChoiceExercise';
import PatternSlotWorkbench from './PatternSlotWorkbench';
import SifuExplainerModal from '../SifuExplainerModal';
import GuideCharacter from '../common/GuideCharacter';
import { triggerConfetti } from '../../utils/confetti';
import themesData from '@shared/themes.json';

export default function ExerciseHost({ level, onExit, onFinishStation }) {
  const activeNode = useSessionStore((state) => state.activeNode);
  const queue = useSessionStore((state) => state.queue);
  const initialTotal = useSessionStore((state) => state.initialTotal);
  const completedCount = useSessionStore((state) => state.completedCount);
  const status = useSessionStore((state) => state.status);
  const isCorrect = useSessionStore((state) => state.isCorrect);
  const combo = useSessionStore((state) => state.combo);
  const xpEarned = useSessionStore((state) => state.xpEarned);
  const hearts = useSessionStore((state) => state.hearts);
  const selectedAnswer = useSessionStore((state) => state.selectedAnswer);
  const stationName = useSessionStore((state) => state.stationName);
  const levelNumber = useSessionStore((state) => state.levelNumber);

  const submitAnswer = useSessionStore((state) => state.submitAnswer);
  const nextChallenge = useSessionStore((state) => state.nextChallenge);
  const abandonSession = useSessionStore((state) => state.abandonSession);
  const [isSifuOpen, setIsSifuOpen] = useState(false);
  const [trainJolt, setTrainJolt] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);

  const themeId = level?.themeId || 'red';
  const theme = themesData.themes[themeId] || themesData.themes.red;

  const handleQuit = () => {
    hapticsService.tapLight();
    abandonSession();
    if (onExit) onExit();
  };

  const handleVictoryDone = () => {
    hapticsService.tapMedium();
    abandonSession();
    if (onFinishStation) onFinishStation(levelNumber);
    else if (onExit) onExit();
  };

  const handleSubmit = () => {
    submitAnswer();
  };

  const handleNext = () => {
    hapticsService.tapLight();
    nextChallenge();
  };

  useEffect(() => {
    if (status === 'victory') {
      hapticsService.success();
      triggerConfetti();
      const t = setTimeout(() => setDoorsOpen(true), 600);
      return () => clearTimeout(t);
    } else if (status === 'feedback_correct') {
      hapticsService.success();
    } else if (status === 'feedback_incorrect') {
      hapticsService.error();
      setTrainJolt(true);
      const t = setTimeout(() => setTrainJolt(false), 400);
      return () => clearTimeout(t);
    }
  }, [status]);

  // Progress Percent
  const progressPercent = Math.min(
    100,
    Math.round((completedCount / Math.max(initialTotal, 1)) * 100)
  );

  // ─────────────────────────────────────────────────────────────
  // LEVEL COMPLETE: FULL-SCREEN VERTICALLY CENTRED PLATFORM SCENE
  // ─────────────────────────────────────────────────────────────
  if (status === 'victory') {
    return (
      <div className="h-dvh w-full flex flex-col justify-between items-center p-6 text-center bg-[#07090E] text-white overflow-hidden select-none">
        {/* Ambient Platform Backlight */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[120px] opacity-25 pointer-events-none"
          style={{ backgroundColor: theme.light.accent }}
        />

        <div className="pt-safe w-full" />

        {/* Vertically Centred Content */}
        <div className="my-auto max-w-sm w-full space-y-5 animate-fade-in z-10">
          
          {/* Guide Character Celebrating */}
          <div className="flex justify-center">
            <GuideCharacter pose="celebrate" size="xl" />
          </div>

          {/* Train Arrived Scene */}
          <div className="relative py-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span>Platform Arrived · 通關成功</span>
            </div>

            {/* Platform Station Plate */}
            <div 
              className="mt-3 p-4 rounded-3xl border shadow-2xl relative overflow-hidden"
              style={{
                backgroundColor: theme.night.plateBg,
                borderColor: theme.night.plateBorder,
              }}
            >
              <span className="text-xs text-amber-300 font-bold tracking-wider uppercase block">
                Level {levelNumber} Cleared
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide mt-1">
                {stationName}
              </h2>
            </div>
          </div>

          {/* Staggered Stats Grid */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-xs font-semibold text-slate-400 block">Experience</span>
              <div className="text-2xl font-black text-amber-400 mt-0.5">+{xpEarned || 100} XP</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-xs font-semibold text-slate-400 block">Best Streak</span>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">{combo || 1}x</div>
            </div>
          </div>
        </div>

        {/* Pinned Bottom CTA Above Safe Area */}
        <div className="w-full max-w-sm pb-safe pt-2 z-10">
          <button
            type="button"
            onClick={handleVictoryDone}
            className="tile-btn w-full py-4 px-6 rounded-2xl bg-mtr-red hover:bg-mtr-red/90 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-mtr-red/30 animate-pulse-slow"
          >
            <span>Next Stop</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (!activeNode) return null;

  const isSubmitDisabled =
    selectedAnswer === null ||
    selectedAnswer === undefined ||
    (Array.isArray(selectedAnswer) && selectedAnswer.length === 0);

  return (
    <div 
      className="h-dvh w-full flex flex-col justify-between overflow-hidden bg-slate-100 dark:bg-[#07090E] select-none transition-colors"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 0%, ${theme.light.tileBase}15 0%, transparent 60%)`,
      }}
    >
      
      {/* ─────────────────────────────────────────────────────────────
          1. TOP SESSION HEADER: TRAIN TRACK PROGRESS, HEARTS, QUIT
          ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 pt-safe px-4 pb-2 bg-white/95 dark:bg-[#07090E]/95 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
        {/* Quit Button */}
        <button
          type="button"
          onClick={handleQuit}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          title="Quit"
          aria-label="Quit lesson"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Train Track Progress Bar */}
        <div className="flex-1 max-w-xs relative py-2">
          {/* Railway Ties / Track Base */}
          <div className="relative h-2.5 bg-slate-200 dark:bg-subway-surface rounded-full overflow-hidden border border-slate-300 dark:border-subway-border">
            <div
              className="h-full bg-mtr-red rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Little Train Carriage Icon Advancing along Track */}
          <div 
            className={`absolute top-0 -ml-3 text-sm pointer-events-none transition-all duration-500 ${trainJolt ? 'train-jolt' : ''}`}
            style={{ left: `${progressPercent}%` }}
          >
            <span className="drop-shadow-sm inline-block transform scale-x-[-1]">
              🚅
            </span>
          </div>
        </div>

        {/* Right Badges: Combo Streak & Hearts */}
        <div className="flex items-center gap-1.5 shrink-0">
          {combo > 1 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{combo}x</span>
            </div>
          )}

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-current text-mtr-red" />
            <span>{hearts}</span>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. SCROLLABLE / CENTRED CONTENT AREA
          ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto px-4 py-2 flex flex-col justify-between overscroll-contain">
        {activeNode.type === 'token_scramble' && (
          <SentenceScramble node={activeNode} />
        )}

        {activeNode.type === 'tone_discrimination' && (
          <ToneMinimalPair node={activeNode} />
        )}

        {activeNode.type === 'multiple_choice' && (
          <MultipleChoiceExercise node={activeNode} />
        )}

        {activeNode.type === 'pattern_slot' && (
          <PatternSlotWorkbench node={activeNode} />
        )}
      </main>

      {/* ─────────────────────────────────────────────────────────────
          3. PINNED BOTTOM CTA OR SLIDING FEEDBACK SHEET
          ───────────────────────────────────────────────────────────── */}
      <div className="shrink-0 pb-safe pt-2 px-4 z-40 bg-white/95 dark:bg-[#07090E]/95 border-t border-slate-200/80 dark:border-white/10">
        
        {/* Status: IN PROGRESS (Check Answer Button) */}
        {status === 'in_progress' && (
          <div className="py-2">
            <button
              type="button"
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
              className={`tile-btn w-full py-4 px-6 rounded-2xl font-bold text-base transition-all ${
                isSubmitDisabled
                  ? 'bg-slate-200 dark:bg-subway-surface text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-mtr-red hover:bg-mtr-red/90 text-white shadow-lg shadow-mtr-red/30'
              }`}
            >
              Check Answer
            </button>
          </div>
        )}

        {/* Status: CORRECT (Bottom Sliding Feedback Sheet) */}
        {status === 'feedback_correct' && (
          <div className="py-3 space-y-3 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-full bg-emerald-500 text-white">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                    Correct! 好叻！
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    +{15 + Math.min(combo * 5, 25)} XP earned
                  </p>
                </div>
              </div>

              {activeNode.explanation && (
                <button
                  type="button"
                  onClick={() => setIsSifuOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 hover:bg-emerald-500/10"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Why?</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="tile-btn w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Status: WRONG (Bottom Sliding Feedback Sheet) */}
        {status === 'feedback_incorrect' && (
          <div className="py-3 space-y-3 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-full bg-red-500 text-white">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-red-600 dark:text-red-400">
                    Not quite! 差少少！
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeNode.explanation ? activeNode.explanation.slice(0, 50) + '...' : 'Review this item'}
                  </div>
                </div>
              </div>

              {activeNode.explanation && (
                <button
                  type="button"
                  onClick={() => setIsSifuOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-red-500/40 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1 hover:bg-red-500/10"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Why?</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="tile-btn w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-base shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>

      {/* Sifu Pedagogical Insight Modal */}
      {isSifuOpen && (
        <SifuExplainerModal
          isOpen={isSifuOpen}
          node={activeNode}
          userAnswer={selectedAnswer}
          onClose={() => setIsSifuOpen(false)}
        />
      )}

    </div>
  );
}
