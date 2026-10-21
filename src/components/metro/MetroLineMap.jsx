import React, { useState, useMemo } from 'react';
import { Lock, CheckCircle2, Play, Volume2, ArrowRight, BookOpen, ChevronRight, X, Sparkles, Star, Compass } from 'lucide-react';
import { metroService } from '@/services/metroService';
import { speechEngine } from '@/services/speechEngine';
import { hapticsService } from '@/services/hapticsService';
import themesData from '@shared/themes.json';
import CantoneseFoundations from './CantoneseFoundations';
import { CHAPTERS } from '@/data/chaptersData';

export default function MetroLineMap({
  onSelectStation,
  currentLevelId = 1,
  isDark = false,
}) {
  const progress = metroService.getProgress();
  const chapters = metroService.getChapters();

  // Determine which chapter current level belongs to
  const initialChapterId = useMemo(() => {
    if (currentLevelId <= 8) return 1;
    if (currentLevelId <= 16) return 2;
    return 3;
  }, [currentLevelId]);

  const [activeChapterId, setActiveChapterId] = useState(initialChapterId);
  const [inspectStation, setInspectStation] = useState(null);

  // Active chapter details & levels
  const activeChapter = chapters.find((c) => c.id === activeChapterId) || chapters[1];
  const chapterLevels = useMemo(() => {
    return metroService.getLevelsForChapter(activeChapterId);
  }, [activeChapterId]);

  const handleStationClick = (lvl, isUnlocked) => {
    if (isUnlocked) {
      hapticsService.tapLight();
      const speakText = lvl.chineseTitle || lvl.stationChinese;
      if (speakText) speechEngine.speak(speakText);
      setInspectStation(lvl);
    } else {
      hapticsService.warning();
    }
  };

  const handleLaunchStation = (lvl, roundNum) => {
    hapticsService.tapMedium();
    setInspectStation(null);
    onSelectStation(lvl, roundNum);
  };

  const handleSpeak = (e, text) => {
    e.stopPropagation();
    hapticsService.tapLight();
    speechEngine.speak(text);
  };

  // Chapter progress calculation
  const completedInChapter = chapterLevels.filter((l) =>
    progress.completedLevels.includes(l.level)
  ).length;
  const totalInChapter = chapterLevels.length;

  return (
    <div className="relative py-1 px-1 sm:px-3 max-w-md mx-auto select-none">
      
      {/* ─────────────────────────────────────────────────────────────
          1. CHAPTER NAVIGATION SELECTOR (Tabs / Rail Lines)
          ───────────────────────────────────────────────────────────── */}
      <div className="mb-4">
        <div className="text-left mb-2 px-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Cantonese Curriculum
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            MTR Chapter Lines
          </h2>
        </div>

        {/* Chapter Switcher Pills */}
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-200/90 dark:bg-subway-surface border-2 border-slate-300 dark:border-subway-border">
          {chapters.map((ch) => {
            const isSelected = ch.id === activeChapterId;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  hapticsService.selectionChanged();
                  setActiveChapterId(ch.id);
                  setInspectStation(null);
                }}
                className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-[#161B29] text-slate-950 dark:text-white shadow-md border-2'
                    : 'text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 border-2 border-transparent'
                }`}
                style={isSelected ? { borderColor: ch.color } : {}}
              >
                <div className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: ch.color }}
                  />
                  <span className="text-[11px] font-black truncate">
                    {ch.id === 0 ? 'Basics' : `Ch ${ch.id}`}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 truncate mt-0.5 max-w-[70px]">
                  {ch.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. VIEW ROUTE OR FOUNDATIONS GUIDE
          ───────────────────────────────────────────────────────────── */}
      {activeChapterId === 0 ? (
        /* CHAPTER 0: INTRODUCTORY CANTONESE BASICS */
        <CantoneseFoundations
          onStartChapter1={() => setActiveChapterId(1)}
          isDark={isDark}
        />
      ) : (
        /* CHAPTER 1, 2, 3: CHAPTER STATIONS MAP */
        <div className="space-y-4">
          
          {/* Chapter Header Banner (CLEANLY ABOVE TRACK - NO OVERLAP) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-subway-surface border-2 border-slate-300 dark:border-subway-border shadow-sm text-left">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-black tracking-wide shadow-xs"
                style={{ backgroundColor: activeChapter.color }}
              >
                <span>● CHAPTER {activeChapter.id}</span>
                <span className="opacity-90 font-bold">· {activeChapter.chinese}</span>
              </div>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                {completedInChapter} / {totalInChapter} Stops
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
              {activeChapter.title}
            </h3>
            
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              {activeChapter.description}
            </p>

            {/* Chapter Progress Bar */}
            <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${totalInChapter > 0 ? (completedInChapter / totalInChapter) * 100 : 0}%`,
                  backgroundColor: activeChapter.color,
                }}
              />
            </div>
          </div>

          {/* Central Rail Track & Station Nodes Container */}
          <div className="relative pt-4 pb-12">
            
            {/* Scoped Vertical Track Line (ONLY within station nodes) */}
            <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-3.5 bg-slate-200 dark:bg-[#151924] rounded-full z-0 border-2 border-slate-300 dark:border-white/10 shadow-inner">
              <div
                className="w-full rounded-full transition-all duration-700"
                style={{
                  height: `${totalInChapter > 0 ? (completedInChapter / totalInChapter) * 100 : 0}%`,
                  backgroundColor: activeChapter.color,
                }}
              />
            </div>

            {/* Station Nodes List */}
            <div className="relative z-10 space-y-10 sm:space-y-12">
              {chapterLevels.map((lvl) => {
                const isUnlocked = progress.unlockedLevels.includes(lvl.level);
                const isCompleted = progress.completedLevels.includes(lvl.level);
                const isCurrent = lvl.level === currentLevelId;
                const theme = themesData.themes[lvl.themeId] || themesData.themes.red;
                const mode = isDark ? theme.night : theme.light;

                const stationRound = metroService.getStationRound(lvl.level);
                const mastery = metroService.getStationMastery(lvl.level);
                const activeRoundData = lvl.rounds ? lvl.rounds[stationRound - 1] : null;

                return (
                  <div
                    key={lvl.level}
                    className={`flex flex-col items-center group ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    onClick={() => handleStationClick(lvl, isUnlocked)}
                  >
                    {/* Station Node Circle */}
                    <div className="relative">
                      
                      {/* "Train Here" Indicator Floating High Above Node (No Overlap) */}
                      {isCurrent && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-bounce-slow">
                          <div className="px-3 py-1 rounded-full bg-mtr-red text-white text-[11px] font-black shadow-lg flex items-center gap-1.5 border-2 border-white dark:border-slate-800">
                            <span>🚅</span>
                            <span>Train Here</span>
                          </div>
                          <div className="w-2 h-2 bg-mtr-red rotate-45 -mt-1 border-r border-b border-white dark:border-slate-800" />
                        </div>
                      )}

                      {/* Pulse Halo on current active node */}
                      {isCurrent && (
                        <div
                          className="absolute -inset-3 rounded-full animate-ping opacity-35 pointer-events-none"
                          style={{ backgroundColor: mode.tileBase }}
                        />
                      )}

                      {/* Station Mosaic Circle Tile */}
                      <div
                        className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center border-4 shadow-md transition-all duration-200 transform group-hover:scale-105 active:scale-95 ${
                          isCurrent 
                            ? 'ring-4 ring-mtr-red/60 dark:ring-white/80 scale-105 shadow-glow-red' 
                            : ''
                        }`}
                        style={{
                          backgroundColor: isUnlocked ? mode.tileBase : (isDark ? '#161B29' : '#CBD5E1'),
                          borderColor: isUnlocked ? mode.plateBorder : (isDark ? '#334155' : '#94A3B8'),
                        }}
                      >
                        {isUnlocked ? (
                          <>
                            {mastery >= 3 ? (
                              <CheckCircle2 className="w-8 h-8 text-white stroke-[2.5]" />
                            ) : (
                              <span 
                                className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm font-sans"
                                style={{ color: mode.lettering }}
                              >
                                {lvl.level}
                              </span>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-700 dark:text-slate-300">
                            <Lock className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                            <span className="text-[10px] font-black mt-0.5 text-slate-700 dark:text-slate-300">
                              {lvl.level}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Star Mastery Badge on Node */}
                      {isUnlocked && mastery > 0 && (
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-slate-900 dark:bg-black border border-amber-400 text-amber-400 text-[10px] font-black flex items-center gap-0.5 shadow-sm">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <span key={i} className={i < mastery ? 'text-amber-400' : 'text-slate-600'}>
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Active Station Card vs Compact Station Label */}
                    {isCurrent ? (
                      /* ACTIVE CURRENT STATION CARD: Multi-Round Awareness */
                      <div className="mt-3 p-4 rounded-2xl bg-white dark:bg-subway-surface border-2 border-mtr-red dark:border-red-500/80 shadow-md w-full max-w-xs text-left transition-all">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-mtr-red text-white uppercase tracking-wider">
                            Stop {lvl.level} · Round {stationRound}/3
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleSpeak(e, lvl.chineseTitle || lvl.stationChinese)}
                            className="p-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-mtr-red hover:bg-slate-100 dark:hover:bg-subway-card transition-colors shrink-0"
                            title="Listen Pronunciation"
                            aria-label={`Listen to ${lvl.title}`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Title & Chinese */}
                        <div className="text-base font-black text-slate-900 dark:text-white mt-1">
                          {lvl.title}
                        </div>
                        <div className="text-xs font-bold text-mtr-red dark:text-red-400 mt-0.5">
                          <span className="font-serif">{lvl.chineseTitle || lvl.stationChinese}</span>
                          <span className="text-slate-400 mx-1">·</span>
                          <span className="text-slate-700 dark:text-slate-300">{lvl.jyutping}</span>
                        </div>

                        {/* Round Info */}
                        <div className="mt-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 text-xs">
                          <div className="font-bold text-slate-900 dark:text-white">
                            Track {stationRound}: {activeRoundData?.title || 'Core Drills'}
                          </div>
                          <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                            {activeRoundData?.subtitle || lvl.subtitle}
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLaunchStation(lvl, stationRound);
                          }}
                          className="mt-3 w-full py-3 px-4 rounded-xl font-black text-xs text-white flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-98 transition-all"
                          style={{ backgroundColor: mode.accent }}
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>Board Round {stationRound}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      /* OTHER STATIONS: Clean, High-Contrast Station Label with Stars */
                      <div className="mt-3 text-center max-w-xs px-2">
                        <div className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                          {lvl.chineseTitle || lvl.stationChinese}
                        </div>
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                          {lvl.title} · <span className="font-medium text-slate-600 dark:text-slate-400">{lvl.jyutping}</span>
                        </div>
                        {isUnlocked && (
                          <div className="text-[10px] font-bold text-mtr-red dark:text-red-400 mt-1 inline-flex items-center gap-1.5">
                            <span>Round {stationRound}/3</span>
                            <span>·</span>
                            <span>{isCompleted ? '✓ Cleared · Tap for Tracks' : 'Tap to Start'}</span>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. STATION DETAIL MODAL (Multi-Round / Sub-Level Tracks)
          ───────────────────────────────────────────────────────────── */}
      {inspectStation && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setInspectStation(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-subway-surface border-2 border-slate-300 dark:border-subway-border p-5 shadow-2xl text-left animate-slide-up relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setInspectStation(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Station Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black">
                Station {inspectStation.level}
              </span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {activeChapter.title}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-serif">
                {inspectStation.chineseTitle || inspectStation.stationChinese}
              </h3>
              <button
                type="button"
                onClick={() => speechEngine.speak(inspectStation.chineseTitle || inspectStation.stationChinese)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-mtr-red dark:text-red-400 transition-colors"
                title="Listen Pronunciation"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {inspectStation.title}
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
              Jyutping: {inspectStation.jyutping}
            </div>

            {/* Multi-Round / Sub-Levels Track Selector */}
            <div className="mt-4 space-y-2">
              <div className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Station Sub-Levels (Platforms):
              </div>
              
              {(inspectStation.rounds || [
                { round: 1, title: 'Foundation Platform', subtitle: inspectStation.subtitle },
                { round: 2, title: 'Street Conversational', subtitle: 'Variations & daily dialogue' },
                { round: 3, title: 'Fluency Mastery', subtitle: 'Rapid response drills' },
              ]).map((rnd) => {
                const isCleared = metroService.getStationMastery(inspectStation.level) >= rnd.round;
                const isCurrentTrack = metroService.getStationRound(inspectStation.level) === rnd.round;

                return (
                  <div
                    key={rnd.round}
                    className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-2 ${
                      isCurrentTrack
                        ? 'border-mtr-red bg-red-50/60 dark:bg-red-950/20'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          Track {rnd.round}: {rnd.title}
                        </span>
                        {isCleared && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ Cleared
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate mt-0.5">
                        {rnd.subtitle}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLaunchStation(inspectStation, rnd.round)}
                      className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1 transition-all shrink-0 active:scale-95 ${
                        isCurrentTrack
                          ? 'bg-mtr-red text-white shadow-sm hover:bg-red-700'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isCleared ? 'Review' : 'Board'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Default Quick Launch CTA */}
            <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => handleLaunchStation(inspectStation, metroService.getStationRound(inspectStation.level))}
                className="w-full py-3.5 px-4 rounded-xl bg-mtr-red hover:bg-red-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continue Station {inspectStation.level} (Track {metroService.getStationRound(inspectStation.level)})</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
