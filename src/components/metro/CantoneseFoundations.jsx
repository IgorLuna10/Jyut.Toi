import React, { useState } from 'react';
import { Volume2, Play, BookOpen, Sparkles, CheckCircle2, ArrowRight, Info } from 'lucide-react';
import { speechEngine } from '@/services/speechEngine';
import { hapticsService } from '@/services/hapticsService';

const TONES_DATA = [
  {
    tone: 1,
    name: 'High Flat',
    pitch: '55',
    hanzi: '詩',
    jyutping: 'si1',
    english: 'poem',
    color: '#EF4444',
    contour: 'M 4 8 L 36 8', // High horizontal
    description: 'High, level, steady pitch — like singing a high note.',
  },
  {
    tone: 2,
    name: 'High Rising',
    pitch: '25',
    hanzi: '史',
    jyutping: 'si2',
    english: 'history',
    color: '#F97316',
    contour: 'M 4 28 Q 20 20 36 8', // Rising from mid-low to top
    description: 'Glides sharply upward — like asking a surprised "What?!".',
  },
  {
    tone: 3,
    name: 'Mid Flat',
    pitch: '33',
    hanzi: '試',
    jyutping: 'si3',
    english: 'to test',
    color: '#10B981',
    contour: 'M 4 18 L 36 18', // Middle horizontal
    description: 'Flat, calm, right in the center of your speaking voice.',
  },
  {
    tone: 4,
    name: 'Low Falling',
    pitch: '21',
    hanzi: '時',
    jyutping: 'si4',
    english: 'time',
    color: '#06B6D4',
    contour: 'M 4 24 Q 20 28 36 32', // Low dipping downward
    description: 'Deep and relaxing — like a quiet sigh of relief.',
  },
  {
    tone: 5,
    name: 'Low Rising',
    pitch: '23',
    hanzi: '市',
    jyutping: 'si5',
    english: 'market',
    color: '#3B82F6',
    contour: 'M 4 32 Q 20 26 36 20', // Rising gently from lowest chest
    description: 'Starts in your chest and floats up gently to the middle.',
  },
  {
    tone: 6,
    name: 'Low Flat',
    pitch: '22',
    hanzi: '事',
    jyutping: 'si6',
    english: 'matter / thing',
    color: '#8B5CF6',
    contour: 'M 4 30 L 36 30', // Deep horizontal bottom
    description: 'Heavy, low, flat baseline pitch — grounded and firm.',
  },
];

export default function CantoneseFoundations({ onStartChapter1, isDark = false }) {
  const [playingTone, setPlayingTone] = useState(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  const handlePlayTone = (hanzi, toneNum) => {
    hapticsService.tapLight();
    setPlayingTone(toneNum);
    speechEngine.speak(hanzi);
    setTimeout(() => {
      setPlayingTone(null);
    }, 900);
  };

  const handlePlayAllSequence = async () => {
    if (isPlayingAll) return;
    setIsPlayingAll(true);
    hapticsService.selectionChanged();

    for (let i = 0; i < TONES_DATA.length; i++) {
      const item = TONES_DATA[i];
      setPlayingTone(item.tone);
      speechEngine.speak(item.hanzi);
      await new Promise((res) => setTimeout(res, 950));
    }

    setPlayingTone(null);
    setIsPlayingAll(false);
  };

  const handleSpeakWord = (text) => {
    hapticsService.tapLight();
    speechEngine.speak(text);
  };

  return (
    <div className="space-y-6 pb-8 select-none">
      
      {/* Chapter 0 Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-purple-500/10 border-2 border-purple-500/30 dark:bg-purple-950/20 dark:border-purple-500/40 shadow-sm text-left">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-extrabold uppercase tracking-wider">
            <span>● CHAPTER 0</span>
            <span className="opacity-80">· 入門導引</span>
          </div>
          <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
            Foundations
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Cantonese Basics: Tones, Jyutping & Logic
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">
          Cantonese is a musical, expressive language with 6 spoken tones. Learn how sounds work before boarding Chapter 1.
        </p>
      </div>

      {/* SECTION 1: THE 6 TONES */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-subway-surface border-2 border-slate-300 dark:border-subway-border shadow-sm text-left">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎵</span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              The 6 Spoken Tones (六聲六調)
            </h3>
          </div>
          <button
            type="button"
            onClick={handlePlayAllSequence}
            disabled={isPlayingAll}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all ${
              isPlayingAll 
                ? 'bg-purple-500 text-white animate-pulse' 
                : 'bg-purple-100 hover:bg-purple-200 text-purple-900 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 dark:text-purple-200 border border-purple-300 dark:border-purple-700'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isPlayingAll ? 'Playing Scale...' : 'Play Tone Scale'}</span>
          </button>
        </div>

        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
          The same syllable <span className="font-bold text-slate-900 dark:text-white">"si"</span> changes meaning completely based on your pitch contour:
        </p>

        {/* 6 Tones Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {TONES_DATA.map((t) => {
            const isCurrentPlaying = playingTone === t.tone;
            return (
              <div
                key={t.tone}
                onClick={() => handlePlayTone(t.hanzi, t.tone)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  isCurrentPlaying
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 scale-102 shadow-md'
                    : 'border-slate-300 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/40 hover:border-purple-400'
                }`}
              >
                {/* Tone badge & Pitch contour */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className="px-2 py-0.5 rounded-md text-[11px] font-black text-white"
                    style={{ backgroundColor: t.color }}
                  >
                    Tone {t.tone}
                  </span>
                  <div className="w-9 h-6 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 flex items-center justify-center p-0.5">
                    <svg className="w-full h-full" viewBox="0 0 40 40">
                      <path
                        d={t.contour}
                        fill="none"
                        stroke={t.color}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Character & Jyutping */}
                <div className="flex items-baseline justify-between gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white font-serif">
                    {t.hanzi}
                  </span>
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                    {t.jyutping}
                  </span>
                </div>

                {/* English & Pitch Number */}
                <div className="mt-1 flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="truncate">{t.english}</span>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    ({t.pitch})
                  </span>
                </div>

                {/* Tone Melody Description */}
                <div className="mt-1 text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                  {t.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: JYUTPING 101 */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-subway-surface border-2 border-slate-300 dark:border-subway-border shadow-sm text-left">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🔤</span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            Jyutping Romanization (粵拼)
          </h3>
        </div>

        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
          Every Cantonese word is written with 3 parts: <span className="font-bold text-slate-900 dark:text-white">Initial</span> + <span className="font-bold text-slate-900 dark:text-white">Final</span> + <span className="font-bold text-purple-600 dark:text-purple-400">Tone Number (1–6)</span>.
        </p>

        {/* Formula breakdown */}
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 text-center mb-3">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
            Example: 你 (nei5)
          </div>
          <div className="flex items-center justify-center gap-2 text-base font-black">
            <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 border border-blue-300">
              n (Initial)
            </span>
            <span className="text-slate-400">+</span>
            <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
              ei (Final)
            </span>
            <span className="text-slate-400">+</span>
            <span className="px-2 py-1 rounded-lg bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 border border-purple-300">
              5 (Tone)
            </span>
            <span className="text-slate-400">=</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-serif">
              你 nei5
            </span>
          </div>
        </div>

        {/* 3 Letter Pitfalls */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            ⚠️ 3 Crucial Letters for English Speakers:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/60">
              <div className="text-xs font-black text-amber-900 dark:text-amber-300">
                Letter 'C' = "TS"
              </div>
              <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                Sounds like <span className="underline">ts</span> in "cats".
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">
                e.g. 餐 (caan1) = "tsaan"
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-300 dark:border-blue-700/60">
              <div className="text-xs font-black text-blue-900 dark:text-blue-300">
                Letter 'Z' = "DZ / J"
              </div>
              <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                Sounds like soft <span className="underline">j</span> or <span className="underline">dz</span>.
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">
                e.g. 早 (zou2) = "dzou"
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-700/60">
              <div className="text-xs font-black text-emerald-900 dark:text-emerald-300">
                Letter 'J' = "Y"
              </div>
              <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                Sounds like <span className="underline">y</span> in "yes".
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">
                e.g. 粵 (jyut6) = "yuht"
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: STREET POLITENESS & LOGIC */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-subway-surface border-2 border-slate-300 dark:border-subway-border shadow-sm text-left">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🤝</span>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            Street Logic: 唔該 vs 多謝
          </h3>
        </div>

        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
          Cantonese has two distinct ways to say "Thank You". Using the right one makes you instantly sound like an insider!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 唔該 */}
          <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/20 border-2 border-teal-400 dark:border-teal-700">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-lg font-black text-teal-950 dark:text-teal-200 font-serif">
                唔該 (m4 goi1)
              </span>
              <button
                type="button"
                onClick={() => handleSpeakWord('唔該')}
                className="p-1 rounded-lg text-teal-700 hover:bg-teal-100 dark:text-teal-300 dark:hover:bg-teal-900/40"
                title="Listen"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs font-bold text-teal-800 dark:text-teal-300">
              Thank you for a SERVICE / Please / Excuse me
            </div>
            <ul className="mt-2 space-y-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <li>• Waiter brings tea or the bill</li>
              <li>• Someone holds the MTR door</li>
              <li>• Saying "Excuse me, coming through" (<span className="font-bold text-teal-900 dark:text-teal-200">唔該借借</span>)</li>
            </ul>
          </div>

          {/* 多謝 */}
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-400 dark:border-rose-700">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-lg font-black text-rose-950 dark:text-rose-200 font-serif">
                多謝 (do1 ze6)
              </span>
              <button
                type="button"
                onClick={() => handleSpeakWord('多謝')}
                className="p-1 rounded-lg text-rose-700 hover:bg-rose-100 dark:text-rose-300 dark:hover:bg-rose-900/40"
                title="Listen"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs font-bold text-rose-800 dark:text-rose-300">
              Thank you for a GIFT / Compliment / Money
            </div>
            <ul className="mt-2 space-y-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <li>• Someone gives you a physical gift or lai see</li>
              <li>• Someone compliments your Cantonese</li>
              <li>• Someone treats you to dinner</li>
            </ul>
          </div>
        </div>

        {/* Particles */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
            🗣️ Magic Cantonese Sentence Markers:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700">
              <span className="font-bold text-purple-700 dark:text-purple-300 font-serif">喇 (laa3)</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium ml-1">
                = Ready / Let's go! (<span className="font-serif">行喇！</span>)
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700">
              <span className="font-bold text-purple-700 dark:text-purple-300 font-serif">咗 (zo2)</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium ml-1">
                = Finished / Done (<span className="font-serif">食咗飯</span>)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* START CHAPTER 1 CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            hapticsService.tapMedium();
            if (onStartChapter1) onStartChapter1();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-mtr-red hover:bg-red-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-mtr-red/30 active:scale-98 transition-all"
        >
          <span>Board Chapter 1: First Words (第一綫)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 text-center mt-2">
          You can return to Chapter 0 at any time from the chapter switcher above.
        </p>
      </div>

    </div>
  );
}
