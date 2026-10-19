import React, { useEffect } from 'react';
import { Volume2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSessionStore } from '../../store/sessionStore';
import { speechEngine } from '../../services/speechEngine';
import { hapticsService } from '../../services/hapticsService';
import GuideCharacter from '../common/GuideCharacter';

export default function MultipleChoiceExercise({ node }) {
  const selectedAnswer = useSessionStore((state) => state.selectedAnswer);
  const setAnswer = useSessionStore((state) => state.setAnswer);
  const isAnswerChecked = useSessionStore((state) => state.isAnswerChecked);
  const isCorrect = useSessionStore((state) => state.isCorrect);

  useEffect(() => {
    setAnswer(null);
    if (node.isListeningDrill) {
      const t = setTimeout(() => playAudio(), 250);
      return () => clearTimeout(t);
    }
  }, [node.id, node.queueUid]);

  const playAudio = () => {
    const text = node.audioText || node.hanzi;
    if (text) {
      speechEngine.speak(text);
    }
  };

  const handleSelect = (idx) => {
    if (isAnswerChecked) return;
    hapticsService.tapLight();
    setAnswer(idx);
    if (node.hanzi && !node.isListeningDrill) {
      playAudio();
    }
  };

  const options = node.options || [];

  // Parse option components: handle rich strings, Chinese, Jyutping, or plain text
  const parseOption = (opt) => {
    if (!opt) return { primary: '', isRich: false };
    if (typeof opt === 'object') {
      return {
        chinese: opt.chinese || opt.hanzi,
        jyutping: opt.jyutping,
        meaning: opt.meaning || opt.english,
        primary: opt.text || opt.label || opt.primary || String(opt),
        isRich: Boolean(opt.chinese && (opt.jyutping || opt.meaning)),
      };
    }
    const str = String(opt).trim();
    
    // Check if it's formatted like "你好 (nei5 hou2) · Hello"
    const richMatch = str.match(/^([^\(·]+)\(([^)]+)\)(?:\s*·\s*(.+))?$/);
    if (richMatch) {
      return {
        chinese: richMatch[1].trim(),
        jyutping: richMatch[2].trim(),
        meaning: richMatch[3] ? richMatch[3].trim() : null,
        primary: str,
        isRich: true,
      };
    }

    // Check if it's formatted with "·" e.g. "nei5 hou2 · Hello"
    if (str.includes('·')) {
      const parts = str.split('·').map(s => s.trim());
      return {
        chinese: parts[0],
        meaning: parts[1],
        primary: str,
        isRich: true,
      };
    }

    // Plain string: check if Chinese characters
    const hasChinese = /[\u4e00-\u9fa5]/.test(str);
    return {
      primary: str,
      chinese: hasChinese ? str : null,
      isRich: false,
    };
  };

  const guidePose = isAnswerChecked
    ? (isCorrect ? 'celebrate' : 'thinking')
    : (node.isListeningDrill ? 'listening' : 'ready');

  return (
    <div className="flex-1 flex flex-col justify-between py-2 space-y-4">
      
      {/* ─────────────────────────────────────────────────────────────
          QUESTION AREA: INSTRUCTION MAX 4 WORDS + LARGE PROMINENT ITEM
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-3">
        
        {/* Instruction Line: Max 4 Words, Sentence Case, Zero Jargon */}
        <div className="flex items-center gap-2 mb-3">
          <GuideCharacter pose={guidePose} size="sm" />
          <h2 className="text-sm sm:text-base font-bold text-slate-600 dark:text-slate-300">
            {node.prompt || 'Pick the meaning'}
          </h2>
        </div>

        {/* Listening Ear Drill: Big Audio Tap Button */}
        {node.isListeningDrill ? (
          <div className="my-2 flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={playAudio}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-mtr-red/10 dark:bg-mtr-red/20 border-2 border-mtr-red/40 flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md group touch-manipulation"
              title="Play Audio"
              aria-label="Play Cantonese sound"
            >
              <Volume2 className="w-12 h-12 text-mtr-red dark:text-red-400 group-hover:scale-110 transition-transform animate-pulse" />
              <span className="text-xs font-bold text-mtr-red dark:text-red-400 mt-2">
                Tap to hear
              </span>
            </button>
            {isAnswerChecked && (node.hanzi || node.jyutping) && (
              <div className="mt-3 flex items-center gap-2 animate-fade-in">
                {node.jyutping && <span className="text-sm font-bold text-mtr-red dark:text-red-400">{node.jyutping}</span>}
                {node.hanzi && <span className="font-serif text-lg text-slate-800 dark:text-slate-200">({node.hanzi})</span>}
              </div>
            )}
          </div>
        ) : node.displayMode === 'reverse' ? (
          /* Reverse Translation: English Word Prominent */
          <div className="my-3 space-y-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">English</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              "{node.targetEnglish || node.english}"
            </div>
          </div>
        ) : node.situation ? (
          /* Situation Scenario: Real Life Prompt */
          <div className="my-2 p-4 rounded-2xl bg-white/80 dark:bg-subway-surface border border-slate-200 dark:border-subway-border max-w-sm w-full">
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold block mb-1">Situation</span>
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {node.situation}
            </p>
          </div>
        ) : (
          /* Vocabulary Recognition: Large Chinese Characters (28px+) + Jyutping */
          <div className="my-2 space-y-1">
            {node.jyutping && (
              <div className="text-sm sm:text-base font-semibold text-mtr-red dark:text-red-400">
                {node.jyutping}
              </div>
            )}
            {node.hanzi && (
              <div 
                className="text-4xl sm:text-5xl font-serif font-black text-slate-900 dark:text-white tracking-wide"
                lang="zh-HK"
              >
                {node.hanzi}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ANSWER CARDS: MIN HEIGHT 72px, TAPPABLE, ANCHORED TO BOTTOM
          ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3 w-full">
        {options.map((opt, idx) => {
          const isSelected = selectedAnswer === idx;
          const isThisCorrect = node.correctIndex === idx;
          const parsed = parseOption(opt);

          let cardStyle = 'bg-white dark:bg-subway-card border-slate-200 dark:border-subway-border text-slate-800 dark:text-slate-200 shadow-sm';
          
          if (isSelected) {
            cardStyle = 'bg-mtr-red/10 dark:bg-mtr-red/20 border-mtr-red text-mtr-red dark:text-red-400 font-bold shadow-md ring-2 ring-mtr-red/30 -translate-y-0.5';
          }
          if (isAnswerChecked) {
            if (isThisCorrect) {
              cardStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/40';
            } else if (isSelected && !isCorrect) {
              cardStyle = 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-400 card-shake';
            }
          }

          return (
            <button
              key={`opt_${idx}`}
              type="button"
              disabled={isAnswerChecked}
              onClick={() => handleSelect(idx)}
              className={`answer-card w-full p-4 border-2 flex items-center justify-between text-left transition-all ${cardStyle}`}
            >
              {parsed.isRich ? (
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-serif font-black text-slate-900 dark:text-white" lang="zh-HK">
                      {parsed.chinese}
                    </span>
                    {parsed.jyutping && (
                      <span className="text-xs font-semibold text-mtr-red dark:text-red-400">
                        {parsed.jyutping}
                      </span>
                    )}
                  </div>
                  {parsed.meaning && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {parsed.meaning}
                    </div>
                  )}
                </div>
              ) : parsed.chinese ? (
                <div className="min-w-0 flex-1">
                  <span className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white" lang="zh-HK">
                    {parsed.chinese}
                  </span>
                </div>
              ) : (
                <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate flex-1">
                  {parsed.primary}
                </div>
              )}

              {/* Status Indicator */}
              <div className="shrink-0 ml-3">
                {isAnswerChecked && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                )}
                {isAnswerChecked && isSelected && !isCorrect && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
