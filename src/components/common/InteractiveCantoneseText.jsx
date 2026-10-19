import React, { useState } from 'react';
import { Volume2, X } from 'lucide-react';
import { dictionaryEngine } from '../../services/dictionaryEngine';
import { speechEngine } from '../../services/speechEngine';

export default function InteractiveCantoneseText({
  text,
  className = '',
  jyutping = null,
  showFurigana = false,
}) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  if (!text) return null;

  // Segment text into Chinese compound tokens, Latin words, or punctuation
  const tokenizeText = (str) => {
    const tokens = [];
    let i = 0;
    while (i < str.length) {
      // Check if current char is whitespace or punctuation
      if (/^[\s，。！？、：；,.!?()（）"'/\\:;`~-]+$/.test(str[i])) {
        tokens.push(str[i]);
        i += 1;
        continue;
      }

      // Check if current sequence is Latin word / Jyutping
      const latinMatch = str.slice(i).match(/^[a-zA-Z0-9'’]+/);
      if (latinMatch) {
        tokens.push(latinMatch[0]);
        i += latinMatch[0].length;
        continue;
      }

      // Chinese multi-character compound check in dictionary
      const sub3 = str.substring(i, i + 3);
      if (sub3.length === 3 && dictionaryEngine.getExact(sub3)) {
        tokens.push(sub3);
        i += 3;
        continue;
      }
      const sub2 = str.substring(i, i + 2);
      if (sub2.length === 2 && dictionaryEngine.getExact(sub2)) {
        tokens.push(sub2);
        i += 2;
        continue;
      }
      // Single Chinese character
      tokens.push(str[i]);
      i += 1;
    }
    return tokens;
  };

  const handleTokenClick = (e, token) => {
    e.stopPropagation();

    // Skip punctuation and non-Chinese Latin words (supports all CJK extensions)
    if (!/\p{Script=Han}/u.test(token)) return;

    // Look up dictionary
    const exact = dictionaryEngine.getExact(token);
    let definition = exact?.english || '';
    let jp = exact?.jyutping || '';

    if (!definition) {
      const results = dictionaryEngine.search(token, { limit: 1 });
      if (results.length > 0) {
        definition = results[0].english;
        jp = results[0].jyutping;
      }
    }

    // Play pronunciation on tap
    speechEngine.speak(token);

    setActiveTooltip({
      token,
      jyutping: jp || token,
      english: definition || 'Cantonese term',
      rect: e.currentTarget.getBoundingClientRect(),
    });
  };

  const tokens = tokenizeText(text);

  return (
    <div className={`relative inline-block ${className}`}>
      
      {/* Ruby / Furigana Jyutping Header if enabled */}
      {showFurigana && jyutping && (
        <div className="font-mono text-xs sm:text-sm font-bold text-mtr-red dark:text-red-400 mb-0.5 tracking-wide">
          {jyutping}
        </div>
      )}

      {/* Segmented Clickable Tokens */}
      <span className="inline-flex flex-wrap items-baseline gap-0.5">
        {tokens.map((token, idx) => {
          const isPunctuation = /^[\s，。！？、：；,.!?]+$/.test(token);

          if (isPunctuation) {
            return <span key={idx} className="opacity-70">{token}</span>;
          }

          return (
            <button
              key={`${token}_${idx}`}
              type="button"
              onClick={(e) => handleTokenClick(e, token)}
              className="hover:text-mtr-red hover:underline decoration-dotted underline-offset-4 cursor-pointer transition-colors px-0.5 rounded focus:outline-none"
              title="Tap for Jyutping & Definition"
            >
              {token}
            </button>
          );
        })}
      </span>

      {/* Floating Word-Tap Tooltip Card */}
      {activeTooltip && (
        <div
          className="fixed z-50 p-3 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl animate-fade-in max-w-xs text-left"
          style={{
            top: activeTooltip.rect.top < 110 ? activeTooltip.rect.bottom + 8 : activeTooltip.rect.top - 90,
            left: Math.max(16, Math.min(window.innerWidth - 260, activeTooltip.rect.left - 40)),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-xl text-white">
                {activeTooltip.token}
              </span>
              <span className="font-mono text-xs font-bold text-amber-300">
                {activeTooltip.jyutping}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => speechEngine.speak(activeTooltip.token)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                title="Play Audio"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTooltip(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
            {activeTooltip.english}
          </div>
        </div>
      )}

      {/* Backdrop overlay to close tooltip on tap outside */}
      {activeTooltip && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setActiveTooltip(null)}
        />
      )}
    </div>
  );
}
