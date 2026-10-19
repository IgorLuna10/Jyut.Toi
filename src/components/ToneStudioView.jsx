import React, { useState } from 'react';
import { Volume2, Play, CheckCircle2, XCircle, RotateCcw, Activity, Info, Zap, Sparkles, Layers } from 'lucide-react';
import { speechEngine } from '../services/speechEngine';
import { hapticsService } from '../services/hapticsService';

const TONES_DATA = [
  { 
    tone: 1, 
    name: 'High Level', 
    cantoName: '陰平', 
    contour: '55', 
    sample: '詩', 
    jyutping: 'si1', 
    meaning: 'Poem', 
    path: 'M 10 20 L 90 20', 
    color: '#EF4444',
    register: 'Upper (陰)' 
  },
  { 
    tone: 2, 
    name: 'High Rising', 
    cantoName: '陰上', 
    contour: '25', 
    sample: '史', 
    jyutping: 'si2', 
    meaning: 'History', 
    path: 'M 10 65 Q 50 55 90 20', 
    color: '#F59E0B',
    register: 'Upper (陰)' 
  },
  { 
    tone: 3, 
    name: 'Mid Level', 
    cantoName: '陰去', 
    contour: '33', 
    sample: '試', 
    jyutping: 'si3', 
    meaning: 'Try / Test', 
    path: 'M 10 45 L 90 45', 
    color: '#10B981',
    register: 'Upper (陰)' 
  },
  { 
    tone: 4, 
    name: 'Low Falling', 
    cantoName: '陽平', 
    contour: '21', 
    sample: '時', 
    jyutping: 'si4', 
    meaning: 'Time', 
    path: 'M 10 55 Q 50 70 90 85', 
    color: '#3B82F6',
    register: 'Lower (陽)' 
  },
  { 
    tone: 5, 
    name: 'Low Rising', 
    cantoName: '陽上', 
    contour: '23', 
    sample: '市', 
    jyutping: 'si5', 
    meaning: 'Market', 
    path: 'M 10 85 Q 50 65 90 45', 
    color: '#8B5CF6',
    register: 'Lower (陽)' 
  },
  { 
    tone: 6, 
    name: 'Low Level', 
    cantoName: '陽去', 
    contour: '22', 
    sample: '事', 
    jyutping: 'si6', 
    meaning: 'Matter', 
    path: 'M 10 75 L 90 75', 
    color: '#EC4899',
    register: 'Lower (陽)' 
  },
];

const MINIMAL_PAIR_DRILLS = [
  {
    id: 'mp_01',
    title: 'Tone 5 (Low Rising) vs Tone 6 (Low Level)',
    a: { hanzi: '買', jyutping: 'maai5', tone: 5, english: 'to buy', path: 'M 10 85 Q 50 65 90 45', color: '#8B5CF6' },
    b: { hanzi: '賣', jyutping: 'maai6', tone: 6, english: 'to sell', path: 'M 10 75 L 90 75', color: '#EC4899' },
    target: 'a',
    note: 'One of the most essential distinctions in Hong Kong shopping. maai5 rises gently; maai6 stays flat and low.'
  },
  {
    id: 'mp_02',
    title: 'Tone 1 (High Level) vs Tone 2 (High Rising)',
    a: { hanzi: '詩', jyutping: 'si1', tone: 1, english: 'poem', path: 'M 10 20 L 90 20', color: '#EF4444' },
    b: { hanzi: '史', jyutping: 'si2', tone: 2, english: 'history', path: 'M 10 65 Q 50 55 90 20', color: '#F59E0B' },
    target: 'b',
    note: 'Tone 1 stays uniformly high and flat; Tone 2 shoots upward like a question: "What?!".'
  },
  {
    id: 'mp_03',
    title: 'Tone 1 (High Level) vs Tone 4 (Low Falling)',
    a: { hanzi: '湯', jyutping: 'tong1', tone: 1, english: 'soup', path: 'M 10 20 L 90 20', color: '#EF4444' },
    b: { hanzi: '糖', jyutping: 'tong4', tone: 4, english: 'sugar / candy', path: 'M 10 55 Q 50 70 90 85', color: '#3B82F6' },
    target: 'a',
    note: 'Extreme acoustic contrast: highest soprano pitch (55) vs deep throat bottom (21).'
  },
  {
    id: 'mp_04',
    title: 'Tone 3 (Mid Level) vs Tone 6 (Low Level)',
    a: { hanzi: '試', jyutping: 'si3', tone: 3, english: 'to try', path: 'M 10 45 L 90 45', color: '#10B981' },
    b: { hanzi: '事', jyutping: 'si6', tone: 6, english: 'matter / business', path: 'M 10 75 L 90 75', color: '#EC4899' },
    target: 'a',
    note: 'Parallel flat lines: Tone 3 rests midway (33); Tone 6 drops down into the chest register (22).'
  }
];

export default function ToneStudioView({ onAddXp }) {
  const [activeSubTab, setActiveSubTab] = useState('contours'); // 'contours' | 'drill'
  const [activePlayingTone, setActivePlayingTone] = useState(null);
  const [drillIndex, setDrillIndex] = useState(0);
  const [selectedSide, setSelectedSide] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  const currentDrill = MINIMAL_PAIR_DRILLS[drillIndex];
  const targetItem = currentDrill[currentDrill.target];

  const handlePlayTone = (item) => {
    hapticsService.tapMedium();
    setActivePlayingTone(item.tone);
    speechEngine.speak(item.sample || item.hanzi);
    setTimeout(() => setActivePlayingTone(null), 1000);
  };

  const handlePlayDrillTarget = () => {
    hapticsService.tapMedium();
    setActivePlayingTone('drill-target');
    speechEngine.speak(targetItem.hanzi);
    setTimeout(() => setActivePlayingTone(null), 1000);
  };

  const handleAnswer = (side) => {
    if (feedback) return;
    setSelectedSide(side);

    if (side === currentDrill.target) {
      hapticsService.success();
      setFeedback('correct');
      if (onAddXp) onAddXp(25);
    } else {
      hapticsService.error();
      setFeedback('wrong');
    }
  };

  const handleNextDrill = () => {
    hapticsService.tapLight();
    setFeedback(null);
    setSelectedSide(null);
    setDrillIndex((prev) => (prev + 1) % MINIMAL_PAIR_DRILLS.length);
  };

  return (
    <div className="space-y-6 pb-20 select-none animate-fade-in">
      
      {/* Studio Header Banner */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-subway-surface via-subway-card to-[#0d101a] border border-subway-border text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-mtr-teal/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-mtr-teal/20 border border-mtr-teal/40 text-teal-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl tracking-wide">
                Tone Acoustic Studio · 聲調實驗室
              </h2>
              <span className="text-[10px] font-mono text-teal-300 font-semibold uppercase tracking-wider">
                6 Pitch Contours & Ear Training
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed relative z-10">
          Cantonese pitch contours separate native Hong Kong fluency from textbook confusion. Tap any tone below to hear its pitch curve, or test your ear in the A/B discrimination drills.
        </p>

        {/* Sub-tab Navigation */}
        <div className="flex gap-2 mt-5 relative z-10">
          <button
            type="button"
            onClick={() => {
              hapticsService.selectionChanged();
              setActiveSubTab('contours');
            }}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 ${
              activeSubTab === 'contours'
                ? 'bg-mtr-teal text-white shadow-glow-teal'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Tone Piano & Curves</span>
          </button>
          <button
            type="button"
            onClick={() => {
              hapticsService.selectionChanged();
              setActiveSubTab('drill');
            }}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 ${
              activeSubTab === 'drill'
                ? 'bg-mtr-teal text-white shadow-glow-teal'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>A/B Minimal Pair Drills</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          VIEW 1: TONE PIANO & PITCH CONTOURS
          ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'contours' && (
        <div className="space-y-4">
          
          {/* Quick Soundboard Piano Matrix */}
          <div className="rounded-3xl p-4 sm:p-5 bg-white dark:bg-subway-surface border border-slate-200 dark:border-subway-border shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Playable Tone Soundboard (Tap to hear)
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Syllable "si"
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {TONES_DATA.map((t) => {
                const isPlaying = activePlayingTone === t.tone;
                return (
                  <button
                    key={t.tone}
                    type="button"
                    onClick={() => handlePlayTone(t)}
                    className={`tile-btn p-3 rounded-2xl flex flex-col items-center justify-center border-2 shadow-sm transition-all ${
                      isPlaying
                        ? 'scale-105 border-mtr-teal bg-teal-500/10 shadow-glow-teal ring-2 ring-mtr-teal/50'
                        : 'border-slate-200 dark:border-subway-border bg-slate-50 dark:bg-subway-card hover:border-mtr-teal/60'
                    }`}
                  >
                    <div 
                      className="w-5 h-5 rounded-md text-[10px] font-mono font-bold text-white flex items-center justify-center mb-1"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.tone}
                    </div>
                    <span className="font-serif font-black text-2xl text-slate-900 dark:text-white leading-none my-0.5">
                      {t.sample}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {t.jyutping}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                      Contour {t.contour}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Pitch Contour Cards Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TONES_DATA.map((t) => (
              <div
                key={`card_${t.tone}`}
                onClick={() => handlePlayTone(t)}
                className="p-4 rounded-2xl bg-white dark:bg-subway-surface border border-slate-200 dark:border-subway-border shadow-md hover:border-mtr-teal/60 transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-98"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Miniature Pitch Graph */}
                  <div className="w-16 h-14 rounded-xl bg-slate-100 dark:bg-subway-card border border-slate-200 dark:border-subway-border/60 p-1 relative shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Register reference guide lines */}
                      <line x1="10" y1="20" x2="90" y2="20" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                      <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                      <line x1="10" y1="80" x2="90" y2="80" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                      <path 
                        d={t.path} 
                        fill="none" 
                        stroke={t.color} 
                        strokeWidth="8" 
                        strokeLinecap="round" 
                      />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span 
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white shrink-0"
                        style={{ backgroundColor: t.color }}
                      >
                        T{t.tone}
                      </span>
                      <span className="font-serif font-black text-lg text-slate-900 dark:text-white truncate">
                        {t.sample} ({t.jyutping})
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {t.cantoName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {t.name} · "{t.meaning}"
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Pitch: {t.contour} · {t.register}
                    </div>
                  </div>
                </div>

                <button 
                  type="button"
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-subway-card group-hover:bg-mtr-teal group-hover:text-white text-slate-600 dark:text-slate-300 transition-colors shrink-0"
                  title="Hear Cantonese Pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 2: A/B MINIMAL PAIR ACOUSTIC DRILLS
          ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'drill' && (
        <div className="rounded-3xl p-5 sm:p-7 bg-white dark:bg-subway-surface border border-slate-200 dark:border-subway-border shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-subway-border pb-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-mtr-teal">
              DRILL {drillIndex + 1} OF {MINIMAL_PAIR_DRILLS.length}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-bold">
              {currentDrill.title}
            </span>
          </div>

          {/* Central Target Listening Beacon */}
          <div className="text-center py-6 px-4 bg-slate-50 dark:bg-subway-card rounded-2xl border border-slate-200 dark:border-subway-border/60 relative overflow-hidden">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Listen to the Acoustic Mystery Clip
            </p>

            <button
              type="button"
              onClick={handlePlayDrillTarget}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-mtr-teal hover:bg-teal-700 text-white font-bold shadow-lg shadow-mtr-teal/30 active:scale-95 transition-all text-sm sm:text-base"
            >
              {activePlayingTone === 'drill-target' ? (
                <div className="flex items-end gap-1 h-5">
                  <span className="sound-bar h-3 bg-white animate-soundwave-1" />
                  <span className="sound-bar h-5 bg-white animate-soundwave-2" />
                  <span className="sound-bar h-4 bg-white animate-soundwave-3" />
                </div>
              ) : (
                <Volume2 className="w-5 h-5 animate-pulse" />
              )}
              <span>Tap to Listen</span>
            </button>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-2 font-medium">
              Which character and pitch contour did you hear?
            </p>
          </div>

          {/* A vs B Selection Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            
            {/* Option A */}
            <button
              type="button"
              onClick={() => handleAnswer('a')}
              disabled={!!feedback}
              className={`tile-btn p-4 rounded-2xl border-2 text-center transition-all ${
                selectedSide === 'a'
                  ? feedback === 'correct'
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-glow-sm'
                    : 'border-rose-500 bg-rose-500/10'
                  : 'border-slate-200 dark:border-subway-border hover:border-mtr-teal bg-white dark:bg-subway-card'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-serif font-black mb-1 text-slate-900 dark:text-white">
                {currentDrill.a.hanzi}
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-mtr-teal mb-0.5">
                {currentDrill.a.jyutping} (Tone {currentDrill.a.tone})
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                "{currentDrill.a.english}"
              </div>
            </button>

            {/* Option B */}
            <button
              type="button"
              onClick={() => handleAnswer('b')}
              disabled={!!feedback}
              className={`tile-btn p-4 rounded-2xl border-2 text-center transition-all ${
                selectedSide === 'b'
                  ? feedback === 'correct'
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-glow-sm'
                    : 'border-rose-500 bg-rose-500/10'
                  : 'border-slate-200 dark:border-subway-border hover:border-mtr-teal bg-white dark:bg-subway-card'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-serif font-black mb-1 text-slate-900 dark:text-white">
                {currentDrill.b.hanzi}
              </div>
              <div className="font-mono text-xs sm:text-sm font-bold text-mtr-teal mb-0.5">
                {currentDrill.b.jyutping} (Tone {currentDrill.b.tone})
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                "{currentDrill.b.english}"
              </div>
            </button>
          </div>

          {/* Feedback Drawer */}
          {feedback && (
            <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 animate-slide-up ${
              feedback === 'correct'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-500/40 text-rose-800 dark:text-rose-300'
            }`}>
              <div className="flex items-center gap-2.5">
                {feedback === 'correct' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
                <div>
                  <div className="text-xs sm:text-sm font-bold">
                    {feedback === 'correct' ? 'Good Ear! +25 XP' : 'Not quite!'}
                  </div>
                  <div className="text-xs opacity-90">
                    Target was: <strong>{targetItem.hanzi} ({targetItem.jyutping})</strong> · "{targetItem.english}"
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextDrill}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shrink-0 hover:opacity-90 active:scale-95 transition-all shadow-sm"
              >
                Next Pair
              </button>
            </div>
          )}

          {/* Linguistic Context Note */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-subway-card text-xs text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-subway-border/80">
            <Info className="w-4 h-4 text-mtr-teal shrink-0 mt-0.5" />
            <span className="leading-relaxed">{currentDrill.note}</span>
          </div>
        </div>
      )}
    </div>
  );
}
