import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Moon, Sun, Flame, Zap, Radio, Check, ChevronDown } from 'lucide-react';
import { acousticSimulator } from '../services/acousticSimulator';
import { hapticsService } from '../services/hapticsService';

export default function NavigationHeader({
  streak = 7,
  xp = 480,
  isDark = false,
  toggleTheme,
  currentStation = { chinese: '你好與拜拜', jyutping: 'nei5 hou2', level: 1, title: 'Hello & Goodbye' }
}) {
  const [ambientMode, setAmbientMode] = useState(acousticSimulator.activeType || 'none');
  const [ambientMenuOpen, setAmbientMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const soundscapes = [
    { id: 'none', label: 'Quiet', sublabel: 'Standard learning atmosphere', icon: '🔇' },
    { id: 'cha-chaan-teng', label: 'Cha Chaan Teng', sublabel: 'Cups, chatter & milk tea orders', icon: '☕' },
    { id: 'wet-market', label: 'Wet Market', sublabel: 'Lively vendors & seafood bustle', icon: '🐟' },
    { id: 'street-traffic', label: 'Ding Ding Tram', sublabel: 'Double-decker bell & street buzz', icon: '🚋' },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAmbientMenuOpen(false);
      }
    }
    if (ambientMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ambientMenuOpen]);

  const handleSelectSoundscape = (id) => {
    hapticsService.selectionChanged();
    acousticSimulator.startSoundscape(id);
    setAmbientMode(id);
    setAmbientMenuOpen(false);
  };

  const levelText = currentStation.level ? `Lvl ${currentStation.level}` : 'Route';
  const displayTitle = currentStation.title || currentStation.chinese || 'First Words';

  return (
    <header className="sticky top-0 z-40 w-full solid-header pt-safe px-3 sm:px-4 pb-2.5 transition-colors shadow-xs">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Current Level Badge (Friendly Rounded Pill) */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-mtr-red/10 border border-mtr-red/25 text-mtr-red dark:bg-mtr-red/20 dark:border-mtr-red/40 min-w-0">
            <span className="w-2 h-2 rounded-full bg-mtr-red shrink-0 animate-pulse" />
            <span className="text-xs font-bold shrink-0">{levelText}</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
              {displayTitle}
            </span>
          </div>
        </div>

        {/* Right: Progress Counters & Quick Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Daily Streak */}
          <div 
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold"
            title={`${streak} Day Streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{streak}</span>
          </div>

          {/* XP Meter */}
          <div 
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs font-bold"
            title={`${xp} Total XP`}
          >
            <Zap className="w-3.5 h-3.5 fill-teal-500 text-teal-500" />
            <span>{xp}</span>
          </div>

          {/* Acoustic Ambient Soundscape Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                hapticsService.tapLight();
                setAmbientMenuOpen(!ambientMenuOpen);
              }}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center select-none active:scale-95 ${
                ambientMode !== 'none'
                  ? 'bg-cct-jade text-white border-cct-jade shadow-glow-jade'
                  : 'bg-slate-100 hover:bg-slate-200/80 border-slate-300 dark:bg-subway-surface dark:hover:bg-subway-card dark:border-subway-border text-slate-700 dark:text-slate-200'
              }`}
              title="Hong Kong Ambient Soundscape"
              aria-label="Toggle Soundscape"
            >
              {ambientMode !== 'none' ? (
                <div className="flex items-end gap-0.5 h-3.5 w-3.5 py-0.5">
                  <span className="w-0.5 bg-white sound-bar h-full animate-soundwave-1" />
                  <span className="w-0.5 bg-white sound-bar h-2/3 animate-soundwave-2" />
                  <span className="w-0.5 bg-white sound-bar h-4/5 animate-soundwave-3" />
                </div>
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Dropdown Menu */}
            {ambientMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 p-2 rounded-2xl bg-white dark:bg-subway-card border border-slate-200 dark:border-subway-border shadow-2xl z-50 animate-fade-in text-left">
                <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Audio Atmosphere
                </div>
                <div className="mt-1 space-y-1">
                  {soundscapes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectSoundscape(s.id)}
                      className={`w-full p-2.5 rounded-xl text-left flex items-start gap-2.5 transition-colors ${
                        ambientMode === s.id
                          ? 'bg-cct-jade/10 text-cct-jade dark:text-emerald-400 font-bold border border-cct-jade/30'
                          : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span className="text-lg">{s.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold leading-tight">{s.label}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-400 leading-tight mt-0.5">
                          {s.sublabel}
                        </div>
                      </div>
                      {ambientMode === s.id && (
                        <Check className="w-4 h-4 text-cct-jade dark:text-emerald-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => {
              hapticsService.tapLight();
              toggleTheme();
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-subway-surface border border-slate-300 dark:border-subway-border text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors active:scale-95"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>

        </div>

      </div>
    </header>
  );
}
