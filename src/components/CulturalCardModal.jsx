import React, { useEffect, useState } from 'react';
import { X, Volume2, Sparkles, Award, Compass, ShieldCheck } from 'lucide-react';
import { speechEngine } from '../services/speechEngine';
import { hapticsService } from '../services/hapticsService';

export default function CulturalCardModal({ card, isOpen, onClose }) {
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

  if (!isOpen || !card) return null;

  const playAudio = () => {
    if (card.chinese) {
      hapticsService.tapLight();
      setIsPlayingAudio(true);
      speechEngine.speak(card.chinese);
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
      aria-label={card.name || "Cultural Artifact"}
    >
      <div 
        className="w-full max-w-sm bg-white dark:bg-subway-surface border border-slate-200 dark:border-subway-border rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Enamel Rivets */}
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

        {/* Card Header & Artwork */}
        <div className="p-8 bg-gradient-to-br from-mtr-red via-rose-600 to-amber-600 text-white relative overflow-hidden">
          {/* Specular Sheen Stripe */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 pointer-events-none" />

          <div className="text-6xl sm:text-7xl mb-3 drop-shadow-lg transform hover:scale-110 transition-transform">
            {card.icon}
          </div>

          <h3 className="font-serif font-black text-2xl sm:text-3xl tracking-wide drop-shadow-sm">
            {card.chinese}
          </h3>

          <div className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-amber-200 mt-1">
            {card.jyutping}
          </div>

          <div className="text-xs uppercase tracking-wider font-mono opacity-85 mt-0.5">
            {card.name}
          </div>
        </div>

        {/* Card Body & Cultural Lore */}
        <div className="p-6 space-y-4 text-left">
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Cultural Lore · 香港街頭文化</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-subway-card p-3.5 rounded-2xl border border-slate-200 dark:border-subway-border">
              {card.desc}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-subway-card border border-slate-200 dark:border-subway-border text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                Unlock Criterion
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {card.unlockCriterion}
              </span>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
              card.unlocked 
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {card.unlocked ? 'Unlocked ✓' : 'Locked 🔒'}
            </span>
          </div>

          {/* Audio Action Button */}
          <button
            type="button"
            onClick={playAudio}
            className="tile-btn w-full py-3.5 px-4 rounded-2xl bg-mtr-red hover:bg-mtr-red/90 text-white font-bold text-sm shadow-lg shadow-mtr-red/30 flex items-center justify-center gap-2 transition-all"
          >
            {isPlayingAudio ? (
              <div className="flex items-end gap-0.5 h-4 w-4 py-0.5">
                <span className="w-1 bg-white sound-bar h-full" />
                <span className="w-1 bg-white sound-bar h-2/3" />
                <span className="w-1 bg-white sound-bar h-4/5" />
              </div>
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
            <span>Hear Cantonese: "{card.chinese}"</span>
          </button>
        </div>

      </div>
    </div>
  );
}
