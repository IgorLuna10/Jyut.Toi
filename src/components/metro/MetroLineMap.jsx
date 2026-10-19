import React from 'react';
import { Lock, CheckCircle2, Play, Volume2, ArrowRight } from 'lucide-react';
import { metroService } from '@/services/metroService';
import { speechEngine } from '@/services/speechEngine';
import { hapticsService } from '@/services/hapticsService';
import themesData from '@shared/themes.json';

const THEME_LINES = {
  1: {
    name: 'First Words',
    chinese: '第一綫 · 入門基礎',
    color: '#C8231F',
    description: 'Greetings, Numbers, Daily Drinks & Shopping Basics',
  },
  9: {
    name: 'City Life',
    chinese: '第二綫 · 城市生活',
    color: '#0076BE',
    description: 'Time, Diners, Transport, Tones & Everyday Routines',
  },
  17: {
    name: 'Real Talk',
    chinese: '第三綫 · 地道交流',
    color: '#00A040',
    description: 'Family, Feelings, Dim Sum, Local Slang & Fluency',
  },
};

export default function MetroLineMap({
  onSelectStation,
  currentLevelId = 1,
  isDark = false,
}) {
  const allLevels = metroService.getAllLevels();
  const progress = metroService.getProgress();
  const completedCount = progress.completedLevels?.length || 0;

  const handleStationClick = (lvl, isUnlocked) => {
    if (isUnlocked) {
      hapticsService.tapLight();
      const speakText = lvl.chineseTitle || lvl.stationChinese;
      if (speakText) speechEngine.speak(speakText);
      onSelectStation(lvl);
    } else {
      hapticsService.warning();
    }
  };

  const handleSpeak = (e, text) => {
    e.stopPropagation();
    hapticsService.tapLight();
    speechEngine.speak(text);
  };

  return (
    <div className="relative py-2 px-2 sm:px-4 max-w-md mx-auto select-none">
      
      {/* Route Journey Progress Banner */}
      <div className="text-center mb-6 relative">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Cantonese Journey
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
          Step by step from first sounds to confident conversation.
        </p>

        {/* Progress Pill */}
        <div className="mt-3 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-subway-surface border border-slate-300 dark:border-subway-border text-xs text-slate-700 dark:text-slate-300 shadow-xs">
          <span className="font-bold text-mtr-red dark:text-red-400">{completedCount} of 24</span>
          <span className="text-slate-500">stops cleared</span>
          <div className="w-16 h-2 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-mtr-red rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / 24) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Central Rail Track & Station Nodes */}
      <div className="relative pb-6">
        
        {/* Track Line */}
        <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-3 bg-slate-200 dark:bg-[#151924] rounded-full z-0 border border-slate-300/80 dark:border-white/[0.08] shadow-inner">
          <div
            className="w-full bg-gradient-to-b from-red-600 via-sky-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{
              height: `${Math.min(100, (currentLevelId / Math.max(allLevels.length, 1)) * 100)}%`,
            }}
          />
        </div>

        {/* Nodes List */}
        <div className="relative z-10 space-y-8 sm:space-y-10">
          {allLevels.map((lvl) => {
            const isUnlocked = progress.unlockedLevels.includes(lvl.level);
            const isCompleted = progress.completedLevels.includes(lvl.level);
            const isCurrent = lvl.level === currentLevelId;
            const theme = themesData.themes[lvl.themeId] || themesData.themes.red;
            const mode = isDark ? theme.night : theme.light;
            const lineInfo = THEME_LINES[lvl.level];

            return (
              <React.Fragment key={lvl.level}>
                {/* Theme Line Header Banner */}
                {lineInfo && (
                  <div className="pt-6 pb-2 text-center relative z-20">
                    <div
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-wide shadow-md"
                      style={{ backgroundColor: lineInfo.color }}
                    >
                      <span>● {lineInfo.name}</span>
                      <span className="opacity-80 font-normal">· {lineInfo.chinese}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                      {lineInfo.description}
                    </p>
                  </div>
                )}

                <div
                  className={`flex flex-col items-center group ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  onClick={() => handleStationClick(lvl, isUnlocked)}
                >
                  {/* Station Node Circle: ONLY NUMBER OR ICON INSIDE */}
                  <div className="relative">
                    
                    {/* Train Icon on Current Node with Gentle Pulse */}
                    {isCurrent && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-bounce-slow">
                        <div className="px-2 py-0.5 rounded-md bg-mtr-red text-white text-[10px] font-bold shadow-md flex items-center gap-1">
                          <span>🚅</span>
                          <span>Train Here</span>
                        </div>
                        <div className="w-1.5 h-1.5 bg-mtr-red rotate-45 -mt-0.5" />
                      </div>
                    )}

                    {/* Pulse Halo on current active node */}
                    {isCurrent && (
                      <div
                        className="absolute -inset-2.5 rounded-full animate-ping opacity-30 pointer-events-none"
                        style={{ backgroundColor: mode.tileBase }}
                      />
                    )}

                    {/* Clean Circle: ONLY Number or Lock Icon */}
                    <div
                      className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center border-4 shadow-md transition-all duration-200 transform group-hover:scale-105 active:scale-95 ${
                        isCurrent 
                          ? 'ring-4 ring-mtr-red/60 dark:ring-white/80 scale-105 shadow-glow-red' 
                          : ''
                      }`}
                      style={{
                        backgroundColor: isUnlocked ? mode.tileBase : (isDark ? '#161B29' : '#E2E8F0'),
                        borderColor: isUnlocked ? mode.plateBorder : (isDark ? '#2D3748' : '#CBD5E1'),
                      }}
                    >
                      {isUnlocked ? (
                        <>
                          {isCompleted ? (
                            <CheckCircle2 className="w-7 h-7 text-white stroke-[2.5]" />
                          ) : (
                            <span 
                              className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm font-sans"
                              style={{ color: mode.lettering }}
                            >
                              {lvl.level}
                            </span>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                          <Lock className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                          <span className="text-[10px] font-bold mt-0.5 text-slate-500 dark:text-slate-400">
                            {lvl.level}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Level Details Card: OUTSIDE THE CIRCLE */}
                  <div
                    className={`mt-2.5 px-4 py-3 rounded-2xl border text-center w-full max-w-xs transition-all shadow-sm ${
                      isUnlocked
                        ? 'bg-white dark:bg-subway-surface border-slate-200 dark:border-subway-border hover:border-mtr-red/40'
                        : 'bg-slate-200/40 dark:bg-subway-card/30 border-slate-300/40 dark:border-subway-border/30 opacity-70'
                    }`}
                  >
                    {/* Primary Title: What it teaches */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0 text-left">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {lvl.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 shrink-0">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Pronunciation Audio Button */}
                      {isUnlocked && (
                        <button
                          type="button"
                          onClick={(e) => handleSpeak(e, lvl.chineseTitle || lvl.stationChinese)}
                          className="p-1 rounded-lg text-slate-400 hover:text-mtr-red hover:bg-slate-100 dark:hover:bg-subway-card transition-colors shrink-0"
                          title="Listen Pronunciation"
                          aria-label={`Listen to ${lvl.title}`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Secondary Line: Chinese + Jyutping */}
                    <div className="text-xs font-semibold text-mtr-red dark:text-red-400 truncate text-left mb-1">
                      <span className="font-serif">{lvl.chineseTitle || lvl.stationChinese}</span>
                      <span className="text-slate-400 dark:text-slate-500 mx-1.5">·</span>
                      <span className="font-medium text-[11px] text-slate-600 dark:text-slate-300">
                        {lvl.jyutping}
                      </span>
                    </div>

                    {/* Subtitle */}
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate text-left">
                      {lvl.subtitle}
                    </div>

                    {/* Enter / Review CTA */}
                    {isUnlocked && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStationClick(lvl, true);
                        }}
                        className="tile-btn mt-2.5 w-full py-2.5 px-3 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-sm hover:brightness-110 transition-all"
                        style={{ backgroundColor: mode.accent }}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isCompleted ? 'Review' : 'Start'}</span>
                      </button>
                    )}
                  </div>

                </div>
              </React.Fragment>
            );
          })}
        </div>

      </div>

    </div>
  );
}
