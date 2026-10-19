import React, { useEffect, useState } from 'react';
import { Volume2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSessionStore } from '../../store/sessionStore';
import { speechEngine } from '../../services/speechEngine';
import { hapticsService } from '../../services/hapticsService';
import GuideCharacter from '../common/GuideCharacter';

const TONES_METADATA = {
  1: { name: 'High Flat', contour: '55', path: 'M 10 20 L 90 20', color: '#EF4444' },
  2: { name: 'High Rising', contour: '25', path: 'M 10 65 Q 50 55 90 20', color: '#F59E0B' },
  3: { name: 'Mid Flat', contour: '33', path: 'M 10 45 L 90 45', color: '#10B981' },
  4: { name: 'Low Falling', contour: '21', path: 'M 10 55 Q 50 70 90 85', color: '#3B82F6' },
  5: { name: 'Low Rising', contour: '23', path: 'M 10 85 Q 50 65 90 45', color: '#8B5CF6' },
  6: { name: 'Low Flat', contour: '22', path: 'M 10 75 L 90 75', color: '#EC4899' },
};

export default function ToneMinimalPair({ node }) {
  const selectedAnswer = useSessionStore((state) => state.selectedAnswer);
  const setAnswer = useSessionStore((state) => state.setAnswer);
  const isAnswerChecked = useSessionStore((state) => state.isAnswerChecked);
  const isCorrect = useSessionStore((state) => state.isCorrect);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setAnswer(null);
    const t = setTimeout(() => playAudio(), 250);
    return () => clearTimeout(t);
  }, [node.id, node.queueUid]);

  const playAudio = () => {
    const text = node.hanzi || node.character || node.syllable;
    if (text) {
      hapticsService.tapLight();
      setIsPlaying(true);
      speechEngine.speak(text);
      setTimeout(() => setIsPlaying(false), 800);
    }
  };

  const handleSelectOption = (toneNum) => {
    if (isAnswerChecked) return;
    hapticsService.tapMedium();
    setAnswer(toneNum);
    playAudio();
  };

  const options = node.options || [1, 2, 4, 6];

  const guidePose = isAnswerChecked
    ? (isCorrect ? 'celebrate' : 'thinking')
    : (isPlaying ? 'listening' : 'ready');

  return (
    <div className="flex-1 flex flex-col justify-between py-2 space-y-4">
      
      {/* ─────────────────────────────────────────────────────────────
          QUESTION AREA: INSTRUCTION MAX 4 WORDS + LARGE AUDIO TARGET
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-3">
        
        {/* Instruction Line: Max 4 Words */}
        <div className="flex items-center gap-2 mb-3">
          <GuideCharacter pose={guidePose} size="sm" />
          <h2 className="text-sm sm:text-base font-bold text-slate-600 dark:text-slate-300">
            {node.prompt || 'Which tone is it?'}
          </h2>
        </div>

        {/* Large Prominent Audio & Character Target */}
        <div className="relative group cursor-pointer my-2" onClick={playAudio}>
          <div className={`w-32 h-32 sm:w-36 sm:h-36 rounded-3xl border-2 flex flex-col items-center justify-center p-3 group-hover:scale-105 active:scale-95 transition-all shadow-md ${
            isPlaying
              ? 'bg-mtr-red/15 border-mtr-red shadow-glow-red ring-4 ring-mtr-red/30'
              : 'bg-white dark:bg-subway-surface border-slate-200 dark:border-subway-border'
          }`}>
            <span className="text-xl sm:text-2xl font-bold text-mtr-red dark:text-red-400">
              {node.syllable || node.jyutping}
            </span>
            <span 
              className="font-serif font-black text-4xl sm:text-5xl text-slate-900 dark:text-white my-1"
              lang="zh-HK"
            >
              {node.character || node.hanzi}
            </span>
            {node.english && (
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                "{node.english}"
              </span>
            )}
          </div>

          <button
            type="button"
            className="absolute -bottom-2 -right-2 p-3 rounded-full bg-mtr-red text-white shadow-lg group-hover:brightness-110 active:scale-90 transition-all"
            title="Play Audio"
            aria-label="Play tone sound"
          >
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-2">
          Tap card to repeat the sound
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ANSWER CARDS: 2-COLUMN GRID, MIN HEIGHT 88px, TAPPABLE
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {options.map((toneNum) => {
          const meta = TONES_METADATA[toneNum] || TONES_METADATA[1];
          const isSelected = selectedAnswer === toneNum;
          const isThisCorrect = node.correctTone === toneNum;

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
              key={`tone_opt_${toneNum}`}
              type="button"
              disabled={isAnswerChecked}
              onClick={() => handleSelectOption(toneNum)}
              className={`min-h-[88px] p-3.5 rounded-2xl border-2 flex items-center justify-between gap-2 text-left transition-all active:scale-95 ${cardStyle}`}
            >
              <div className="min-w-0 flex-1">
                <div className="text-base sm:text-lg font-extrabold font-sans">
                  Tone {toneNum}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {meta.name}
                </div>
                <div className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  Pitch {meta.contour}
                </div>
              </div>

              {/* Pitch Contour Graphic */}
              <div className="w-11 h-10 shrink-0 bg-slate-100 dark:bg-subway-surface rounded-xl p-1 border border-slate-200 dark:border-subway-border flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d={meta.path}
                    fill="none"
                    stroke={meta.color}
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
