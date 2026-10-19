import React, { useEffect, useState } from 'react';
import { Volume2, RotateCcw } from 'lucide-react';
import { useSessionStore } from '../../store/sessionStore';
import { speechEngine } from '../../services/speechEngine';
import { hapticsService } from '../../services/hapticsService';
import { dictionaryEngine } from '../../services/dictionaryEngine';
import GuideCharacter from '../common/GuideCharacter';

export default function SentenceScramble({ node }) {
  const selectedAnswer = useSessionStore((state) => state.selectedAnswer);
  const setAnswer = useSessionStore((state) => state.setAnswer);
  const isAnswerChecked = useSessionStore((state) => state.isAnswerChecked);
  const isCorrect = useSessionStore((state) => state.isCorrect);

  const [availableTokens, setAvailableTokens] = useState([]);

  const getJyutping = (word) => {
    if (!word) return '';
    const exact = dictionaryEngine.getExact(word);
    if (exact?.jyutping) return exact.jyutping;
    const found = dictionaryEngine.search(word, { limit: 1 });
    return found.length > 0 ? found[0].jyutping : '';
  };

  useEffect(() => {
    const initialPool = node.pool ? [...node.pool] : [];
    setAvailableTokens(initialPool);
    setAnswer([]);
  }, [node.id, node.queueUid]);

  const activeTokens = Array.isArray(selectedAnswer) ? selectedAnswer : [];

  const handleSelectToken = (token, indexInAvailable) => {
    if (isAnswerChecked) return;
    hapticsService.tapMedium();

    const nextAvailable = [...availableTokens];
    nextAvailable.splice(indexInAvailable, 1);
    setAvailableTokens(nextAvailable);

    const nextSelected = [...activeTokens, token];
    setAnswer(nextSelected);

    speechEngine.speak(token);
  };

  const handleDeselectToken = (token, indexInSelected) => {
    if (isAnswerChecked) return;
    hapticsService.tapLight();

    const nextSelected = [...activeTokens];
    nextSelected.splice(indexInSelected, 1);
    setAnswer(nextSelected);

    setAvailableTokens([...availableTokens, token]);
  };

  const handleReset = () => {
    if (isAnswerChecked) return;
    hapticsService.tapLight();
    setAvailableTokens(node.pool ? [...node.pool] : []);
    setAnswer([]);
  };

  const playFullAudio = () => {
    const textToSpeak = node.target ? node.target.join(' ') : (node.hanzi || '');
    if (textToSpeak) {
      speechEngine.speak(textToSpeak);
    }
  };

  const guidePose = isAnswerChecked
    ? (isCorrect ? 'celebrate' : 'thinking')
    : 'ready';

  return (
    <div className="flex-1 flex flex-col justify-between py-2 space-y-4">
      
      {/* ─────────────────────────────────────────────────────────────
          QUESTION AREA: INSTRUCTION MAX 4 WORDS + PROMINENT TARGET
          ───────────────────────────────────────────────────────────── */}
      <div className="text-center px-2 py-1">
        <div className="flex items-center justify-center gap-2 mb-2">
          <GuideCharacter pose={guidePose} size="sm" />
          <h2 className="text-sm sm:text-base font-bold text-slate-600 dark:text-slate-300">
            {node.prompt || 'Build the sentence'}
          </h2>
          <button
            type="button"
            onClick={playFullAudio}
            className="p-1 rounded-xl text-slate-400 hover:text-mtr-red transition-colors"
            title="Listen to Target Audio"
            aria-label="Listen to sentence"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Big Target Meaning */}
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug my-2">
          "{node.english || 'Sentence'}"
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          DROP ZONE / ASSEMBLED SENTENCE
          ───────────────────────────────────────────────────────────── */}
      <div className="min-h-[110px] p-3 sm:p-4 rounded-3xl bg-slate-200/50 dark:bg-subway-surface/70 border-2 border-dashed border-slate-300 dark:border-subway-border flex flex-wrap items-center justify-center gap-2.5 transition-all shadow-inner">
        {activeTokens.length === 0 ? (
          <span className="text-xs text-slate-400 select-none">
            Tap word tiles below to assemble
          </span>
        ) : (
          activeTokens.map((token, idx) => (
            <button
              key={`selected_${token}_${idx}`}
              type="button"
              disabled={isAnswerChecked}
              onClick={() => handleDeselectToken(token, idx)}
              className={`tile-btn px-4 py-3 rounded-2xl shadow-md transition-all ${
                isAnswerChecked
                  ? isCorrect
                    ? 'bg-emerald-600 text-white'
                    : 'bg-mtr-red text-white'
                  : 'bg-white dark:bg-subway-card text-slate-900 dark:text-white border-2 border-slate-300 dark:border-subway-border shadow-tile-acrylic dark:shadow-tile-acrylic-dark'
              }`}
            >
              <div className="flex flex-col items-center justify-center leading-none">
                {getJyutping(token) && (
                  <span className={`text-xs font-bold mb-1 ${
                    isAnswerChecked ? 'text-white/80' : 'text-mtr-red dark:text-red-400'
                  }`}>
                    {getJyutping(token)}
                  </span>
                )}
                <span className="font-serif font-black text-2xl sm:text-3xl" lang="zh-HK">
                  {token}
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          WORD TILE POOL: LARGE, TAPPABLE, ANCHORED TO BOTTOM
          ───────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span className="font-semibold text-slate-400">Word pool</span>
          {activeTokens.length > 0 && !isAnswerChecked && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-mtr-red transition-colors active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 p-4 rounded-3xl bg-white/70 dark:bg-subway-surface/70 border border-slate-200 dark:border-subway-border min-h-[96px] shadow-sm">
          {availableTokens.map((token, idx) => (
            <button
              key={`available_${token}_${idx}`}
              type="button"
              disabled={isAnswerChecked}
              onClick={() => handleSelectToken(token, idx)}
              className="tile-btn min-h-[64px] px-4 py-2.5 rounded-2xl bg-white dark:bg-subway-card text-slate-900 dark:text-white border-2 border-slate-200 dark:border-subway-border shadow-tile-acrylic dark:shadow-tile-acrylic-dark hover:border-mtr-red transition-all active:scale-95"
            >
              <div className="flex flex-col items-center justify-center leading-none">
                {getJyutping(token) && (
                  <span className="text-xs font-bold text-mtr-red dark:text-red-400 mb-1">
                    {getJyutping(token)}
                  </span>
                )}
                <span className="font-serif font-black text-2xl sm:text-3xl" lang="zh-HK">
                  {token}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
