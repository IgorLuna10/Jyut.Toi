import React, { useEffect, useState } from 'react';
import { X, AlertCircle, RotateCcw, CheckCircle2, Play, Sparkles, Volume2, Trash2 } from 'lucide-react';
import { useSessionStore } from '../store/sessionStore';
import { speechEngine } from '../services/speechEngine';
import { hapticsService } from '../services/hapticsService';

export default function MistakeBankModal({ isOpen, onClose, onLaunchRemediation }) {
  const mistakeBank = useSessionStore((state) => state.mistakeBank);
  const clearMistakeBank = useSessionStore((state) => state.clearMistakeBank);
  const [playingId, setPlayingId] = useState(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLaunch = () => {
    hapticsService.tapMedium();
    if (onLaunchRemediation) {
      onLaunchRemediation(mistakeBank);
    }
    onClose();
  };

  const handleAudio = (id, text) => {
    hapticsService.tapLight();
    setPlayingId(id);
    speechEngine.speak(String(text));
    setTimeout(() => setPlayingId(null), 800);
  };

  const handleClear = () => {
    hapticsService.tapLight();
    clearMistakeBank();
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
      aria-label="Mistake Bank Remediation"
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-subway-surface border border-slate-200 dark:border-subway-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Rivets */}
        <span className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/30 border border-black/40 shadow-xs" />
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/30 border border-black/40 shadow-xs" />

        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-subway-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-mtr-red/10 text-mtr-red dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-black text-lg text-slate-900 dark:text-white">
                Mistake Bank · 錯題本
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {mistakeBank.length} items logged for remediation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-subway-card transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 no-scrollbar">
          {mistakeBank.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center text-3xl shadow-sm">
                ✨
              </div>
              <h4 className="font-serif font-black text-lg text-slate-800 dark:text-slate-100">
                Zero Errors Recorded!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                Your Cantonese practice is sharp. Any mistakes you encounter in station challenges will automatically be stored here for focused spaced repetition review.
              </p>
            </div>
          ) : (
            mistakeBank.map((item, idx) => {
              const cardId = `err_${item.nodeId}_${idx}`;
              const isPlaying = playingId === cardId;
              const expectedStr = Array.isArray(item.expected) 
                ? item.expected.join(' ') 
                : String(item.expected);

              return (
                <div
                  key={cardId}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-subway-card border border-slate-200 dark:border-subway-border flex items-center justify-between gap-3 text-left shadow-xs hover:border-mtr-red/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate font-serif">
                      {item.prompt}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Target:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        {expectedStr}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAudio(cardId, item.expected)}
                    className="tile-btn p-2.5 rounded-xl bg-white dark:bg-subway-surface text-slate-600 dark:text-slate-300 hover:text-mtr-red border border-slate-200 dark:border-subway-border shrink-0 shadow-xs"
                    title="Listen to Cantonese Pronunciation"
                    aria-label="Listen to Cantonese Pronunciation"
                  >
                    {isPlaying ? (
                      <div className="flex items-end gap-0.5 h-4 w-4 py-0.5">
                        <span className="w-1 bg-mtr-red sound-bar h-full" />
                        <span className="w-1 bg-mtr-red sound-bar h-2/3" />
                        <span className="w-1 bg-mtr-red sound-bar h-4/5" />
                      </div>
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {mistakeBank.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-subway-border bg-slate-50 dark:bg-subway-card/50 flex items-center gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="tile-btn px-4 py-3 rounded-2xl border border-slate-300 dark:border-subway-border text-slate-600 dark:text-slate-300 text-xs font-mono font-semibold hover:bg-slate-200 dark:hover:bg-subway-surface transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log</span>
            </button>

            <button
              type="button"
              onClick={handleLaunch}
              className="tile-btn flex-1 py-3.5 px-4 rounded-2xl bg-mtr-red hover:bg-mtr-red/90 text-white font-bold text-xs sm:text-sm shadow-lg shadow-mtr-red/30 flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Remediation ({mistakeBank.length})</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
