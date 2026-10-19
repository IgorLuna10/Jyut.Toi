import React from 'react';
import { Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { speechEngine } from '@/services/speechEngine';
import ToneBadge from './ToneBadge';
import RegisterBadge from './RegisterBadge';
import themesData from '@shared/themes.json';

export default function WordCard({
  item,
  themeId = 'red',
  isDark = false,
  onMastered,
  isMastered = false,
  className = '',
}) {
  const theme = themesData.themes[themeId] || themesData.themes.red;
  const modeKey = isDark ? 'night' : 'light';
  const mode = theme[modeKey];

  if (!item) return null;

  const handleAudio = () => {
    speechEngine.speak(item.chinese);
  };

  return (
    <div
      className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-xl border ${className}`}
      style={{
        backgroundColor: isDark ? 'rgba(18, 20, 24, 0.88)' : 'rgba(255, 255, 255, 0.94)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Top Header Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: mode.badgeBg,
            color: mode.badgeText,
            border: `1px solid ${mode.badgeBorder}`,
          }}
        >
          Station Word
        </span>

        {item.tones && item.tones[0] && (
          <RegisterBadge toneNumber={item.tones[0]} />
        )}
      </div>

      {/* Main Chinese Characters */}
      <div className="text-center py-2">
        <h3 className="text-5xl sm:text-6xl font-serif font-black tracking-wider text-slate-900 dark:text-white drop-shadow-sm">
          {item.chinese}
        </h3>

        {/* Jyutping & Audio Button */}
        <div className="flex items-center justify-center gap-2.5 mt-3">
          <span className="font-mono text-sm sm:text-base font-semibold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs">
            {item.jyutping}
          </span>
          <button
            onClick={handleAudio}
            className="p-2 sm:p-2.5 rounded-full text-white transition-all transform active:scale-90 shadow-md hover:brightness-110"
            style={{ backgroundColor: mode.accent }}
            title="Listen native Cantonese pronunciation"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* English Meaning */}
        <p className="mt-3 text-base sm:text-lg font-semibold text-slate-700 dark:text-zinc-200">
          "{item.english}"
        </p>

        {/* Notes */}
        {item.notes && (
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 italic">
            {item.notes}
          </p>
        )}
      </div>

      {/* Tone Syllable Breakdown */}
      {item.tones && item.tones.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-2">
          {item.tones.map((toneNum, idx) => (
            <ToneBadge key={idx} toneNumber={toneNum} showDetails={false} />
          ))}
        </div>
      )}

      {/* Mastered Button */}
      {onMastered && (
        <div className="mt-4 pt-2">
          <button
            onClick={onMastered}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              isMastered
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-white shadow-md hover:brightness-110 active:scale-98'
            }`}
            style={{
              backgroundColor: isMastered ? undefined : mode.accent,
            }}
          >
            {isMastered ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Word Mastered (+25 XP)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Mark as Memorized</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
