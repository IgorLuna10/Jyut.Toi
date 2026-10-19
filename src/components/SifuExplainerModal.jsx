import React, { useEffect, useState } from 'react';
import { X, Sparkles, Volume2, BookOpen, CheckCircle2 } from 'lucide-react';
import { speechEngine } from '../services/speechEngine';
import { hapticsService } from '../services/hapticsService';

export default function SifuExplainerModal({ node, userAnswer, isOpen, onClose }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !node) return null;

  const cantoneseTarget = node.hanzi || node.character || (
    Array.isArray(node.target)
      ? node.target.join(' ')
      : typeof node.correctIndex === 'number' && node.options
      ? node.options[node.correctIndex]
      : node.target || ''
  );

  const cleanCantonese = String(cantoneseTarget)
    .replace(/\([^)]*\)/g, '')
    .replace(/·.*/, '')
    .trim();

  const explanation = node.explanation || `In Cantonese, sentence structure and aspect particles follow strict spoken collocations rather than textbook grammar.`;

  const playAudio = () => {
    const textToSpeak = node.hanzi || node.character || cleanCantonese;
    if (textToSpeak && /[\u3400-\u9fa5\u{20000}-\u{2A6DF}]/u.test(textToSpeak)) {
      hapticsService.tapLight();
      setIsPlayingAudio(true);
      speechEngine.speak(textToSpeak);
      setTimeout(() => setIsPlayingAudio(false), 800);
    }
  };

  const handleDismiss = () => {
    hapticsService.tapLight();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in"
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Sifu's Linguistic Insight"
    >
      <div 
        className="w-full max-w-sm bg-white dark:bg-subway-surface border border-slate-200 dark:border-subway-border rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 4 Corner Enamel Mounting Rivets */}
        <span className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-white/40 border border-black/40 z-20 shadow-xs" />
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-white/40 border border-black/40 z-20 shadow-xs" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Master Sifu Banner */}
        <div className="p-6 bg-gradient-to-br from-amber-600 via-orange-600 to-mtr-red text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl shadow-lg mb-2">
            🥋
          </div>

          <h3 className="font-serif font-black text-xl tracking-wide">
            Sifu's Linguistic Insight · 師父指點
          </h3>
          <p className="text-xs text-amber-100 font-mono mt-0.5">
            Cantonese Pedagogical Tutor
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-left">
          
          {/* Target Expression Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-subway-card border border-slate-200 dark:border-subway-border space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
              Target Cantonese Expression
            </span>
            <div className="font-serif font-black text-xl text-slate-900 dark:text-white">
              {expectedText}
            </div>
            {node.jyutping && (
              <div className="font-mono text-xs text-mtr-red dark:text-red-400 font-bold">
                {node.jyutping}
              </div>
            )}
          </div>

          {/* Grammar & Rule Explainer */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Why this rule applies:</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/20">
              {explanation}
            </p>
          </div>

          {/* Audio Action Button with Soundwave Indicator */}
          <button
            type="button"
            onClick={playAudio}
            className="tile-btn w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-subway-border hover:bg-slate-100 dark:hover:bg-subway-card text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            {isPlayingAudio ? (
              <div className="flex items-end gap-0.5 h-3.5 w-3.5 py-0.5">
                <span className="w-1 bg-mtr-red sound-bar h-full" />
                <span className="w-1 bg-mtr-red sound-bar h-2/3" />
                <span className="w-1 bg-mtr-red sound-bar h-4/5" />
              </div>
            ) : (
              <Volume2 className="w-4 h-4 text-mtr-red" />
            )}
            <span>Hear Native Cantonese Pronunciation</span>
          </button>

          {/* Dismiss Action Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="tile-btn w-full py-3.5 px-4 rounded-2xl bg-mtr-red hover:bg-mtr-red/90 text-white font-bold text-sm shadow-lg shadow-mtr-red/30 transition-all"
          >
            明晒喇，師父！ (Got it, Sifu!)
          </button>
        </div>

      </div>
    </div>
  );
}
