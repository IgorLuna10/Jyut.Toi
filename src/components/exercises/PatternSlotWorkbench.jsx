import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { useSessionStore } from '../../store/sessionStore';
import { speechEngine } from '../../services/speechEngine';
import { hapticsService } from '../../services/hapticsService';
import GuideCharacter from '../common/GuideCharacter';

export default function PatternSlotWorkbench({ node }) {
  const selectedAnswer = useSessionStore((state) => state.selectedAnswer);
  const setAnswer = useSessionStore((state) => state.setAnswer);
  const isAnswerChecked = useSessionStore((state) => state.isAnswerChecked);
  const isCorrect = useSessionStore((state) => state.isCorrect);

  const slots = node.slots || [];
  const [slotSelections, setSlotSelections] = useState(() => {
    const init = {};
    slots.forEach((s, idx) => {
      init[idx] = s.options ? s.options[0] : '';
    });
    return init;
  });

  useEffect(() => {
    const parts = [];
    if (node.fixedPrefix) parts.push(node.fixedPrefix);
    slots.forEach((s, idx) => {
      const val = slotSelections[idx] || (s.options ? s.options[0] : '');
      if (val) parts.push(val);
    });
    if (node.fixedSuffix) parts.push(node.fixedSuffix);

    const fullSentence = parts.join(' ').replace(/\s+([！!？?.,，。])/g, '$1');
    setAnswer(fullSentence);
  }, [slotSelections, node.id]);

  const handleSelectSlotOption = (slotIdx, optionValue) => {
    if (isAnswerChecked) return;
    hapticsService.tapLight();
    setSlotSelections((prev) => ({
      ...prev,
      [slotIdx]: optionValue,
    }));
    speechEngine.speak(optionValue);
  };

  const playFullSentence = () => {
    if (typeof selectedAnswer === 'string' && selectedAnswer) {
      speechEngine.speak(selectedAnswer);
    }
  };

  const guidePose = isAnswerChecked
    ? (isCorrect ? 'celebrate' : 'thinking')
    : 'ready';

  return (
    <div className="flex-1 flex flex-col justify-between py-2 space-y-4">
      
      {/* ─────────────────────────────────────────────────────────────
          QUESTION AREA: INSTRUCTION MAX 4 WORDS + MEANING
          ───────────────────────────────────────────────────────────── */}
      <div className="text-center px-2 py-1">
        <div className="flex items-center justify-center gap-2 mb-2">
          <GuideCharacter pose={guidePose} size="sm" />
          <h2 className="text-sm sm:text-base font-bold text-slate-600 dark:text-slate-300">
            {node.prompt || 'Complete the phrase'}
          </h2>
          <button
            type="button"
            onClick={playFullSentence}
            className="p-1 rounded-xl text-slate-400 hover:text-mtr-red transition-colors"
            title="Listen"
            aria-label="Listen to phrase"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug my-2">
          "{node.english || 'Phrase'}"
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ASSEMBLED SENTENCE PREVIEW
          ───────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-cct-jade/10 dark:bg-cct-jade/15 border-2 border-cct-jade/40 text-center space-y-1">
        <span className="text-xs text-cct-jade font-bold uppercase tracking-wider block">
          Your Cantonese Sentence
        </span>
        <div 
          className="font-serif font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide"
          lang="zh-HK"
        >
          {selectedAnswer || '...'}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          OPTIONS SELECTION: LARGE CARDS
          ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {slots.map((slot, slotIdx) => (
          <div key={`slot_${slotIdx}`} className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 px-1 block">
              Choose: {slot.label}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(slot.options || []).map((opt) => {
                const isSelected = slotSelections[slotIdx] === opt;

                return (
                  <button
                    key={`slot_${slotIdx}_${opt}`}
                    type="button"
                    disabled={isAnswerChecked}
                    onClick={() => handleSelectSlotOption(slotIdx, opt)}
                    className={`answer-card p-3 border-2 flex items-center justify-center text-center transition-all ${
                      isSelected
                        ? 'bg-cct-jade/15 border-cct-jade text-cct-jade dark:text-emerald-300 font-bold shadow-md ring-2 ring-cct-jade/30'
                        : 'bg-white dark:bg-subway-card border-slate-200 dark:border-subway-border text-slate-800 dark:text-slate-200 shadow-sm'
                    }`}
                  >
                    <span className="font-serif font-black text-xl sm:text-2xl" lang="zh-HK">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
