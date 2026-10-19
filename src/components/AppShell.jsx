import React, { useState } from 'react';
import NavigationHeader from './NavigationHeader';
import BottomNav from './BottomNav';
import MetroLineMap from './metro/MetroLineMap';
import ExerciseHost from './exercises/ExerciseHost';
import ToneStudioView from './ToneStudioView';
import StreetLabsView from './StreetLabsView';
import LexiconView from './LexiconView';
import ProfileView from './ProfileView';
import { metroService } from '../services/metroService';
import { challengeAdapter } from '../services/challengeAdapter';
import { useSessionStore } from '../store/sessionStore';
import AudioDebugOverlay from './common/AudioDebugOverlay';

export default function AppShell({ isDark, toggleTheme, onExitToLanding }) {
  const [activeTab, setActiveTab] = useState('route'); // 'route' | 'sounds' | 'practice' | 'dictionary' | 'profile'
  const [selectedStationLevel, setSelectedStationLevel] = useState(null);
  const [progress, setProgress] = useState(() => metroService.getProgress());

  // Reload progress whenever updated
  const refreshProgress = () => {
    setProgress({ ...metroService.getProgress() });
  };

  const handleSelectStation = (lvl) => {
    const challenges = challengeAdapter.fromLevel(lvl);
    useSessionStore.getState().startSession(challenges, {
      stationName: lvl.title || lvl.chineseTitle || 'Level',
      levelNumber: lvl.level,
      themeId: lvl.themeId,
    });
    setSelectedStationLevel(lvl);
  };

  const handleStationUnlocked = (nextLevelId) => {
    refreshProgress();
    setSelectedStationLevel(null);
  };

  const handleLaunchRemediation = (mistakes) => {
    if (!mistakes || mistakes.length === 0) return;
    const remediationChallenges = mistakes.map((item, idx) => {
      if (item.nodeType === 'token_scramble' || Array.isArray(item.expected)) {
        const target = Array.isArray(item.expected) ? item.expected : [String(item.expected)];
        return {
          id: `remedy_sentence_${idx}`,
          type: 'token_scramble',
          title: 'Review',
          prompt: 'Build the sentence',
          target,
          pool: [...target, '唔該', '多謝', '食飯'].sort(() => Math.random() - 0.5),
          english: item.english || item.prompt,
          explanation: `Correct order: ${target.join(' ')}`,
        };
      } else if (item.nodeType === 'tone_discrimination' || (typeof item.correctTone === 'number' && item.correctTone >= 1 && item.correctTone <= 6)) {
        const tone = item.correctTone ?? (typeof item.expected === 'number' && item.expected >= 1 && item.expected <= 6 ? item.expected : 1);
        return {
          id: `remedy_tone_${idx}`,
          type: 'tone_discrimination',
          title: 'Review',
          prompt: 'Which tone is it?',
          character: item.hanzi || item.prompt,
          hanzi: item.hanzi || item.prompt,
          correctTone: tone,
          options: item.options || [1, 2, 4, 6],
          explanation: item.explanation || `Tone is ${tone}`,
        };
      } else {
        const correctStr = String(item.expected ?? '');
        const defaultDistractors = ['你好', '唔該', '早晨', '多謝'].filter((d) => d !== correctStr);
        const options = Array.isArray(item.options) && item.options.includes(correctStr)
          ? item.options
          : [correctStr, ...defaultDistractors.slice(0, 3)].sort(() => Math.random() - 0.5);

        return {
          id: `remedy_choice_${idx}`,
          type: 'multiple_choice',
          title: 'Review',
          prompt: item.prompt || 'Pick the meaning',
          hanzi: item.hanzi || correctStr,
          options,
          correctIndex: options.indexOf(correctStr),
          explanation: item.explanation || `Correct: ${correctStr}`,
        };
      }
    });

    useSessionStore.getState().startSession(remediationChallenges, {
      stationName: 'Review · 錯題重溫',
      levelNumber: progress.currentLevelId || 1,
      themeId: 'red',
    });
    setSelectedStationLevel({ title: 'Review', chineseTitle: '錯題重溫', jyutping: 'co3 tai4 cung4 wan1' });
  };

  const handleAddXp = (amount) => {
    metroService.addXp(amount);
    refreshProgress();
  };

  // Derive active station details for top header
  const currentStationLevel = metroService.getLevel(progress.currentLevelId || 1);
  const currentStationInfo = {
    chinese: currentStationLevel?.chineseTitle || currentStationLevel?.stationChinese || '你好與拜拜',
    jyutping: currentStationLevel?.jyutping || 'nei5 hou2',
    level: currentStationLevel?.level || 1,
    title: currentStationLevel?.title || 'Hello & Goodbye',
  };

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-slate-100 dark:bg-[#07090E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* If in active exercise session, render full-screen immersive exercise host */}
      {selectedStationLevel ? (
        <div className="h-dvh flex flex-col overflow-hidden w-full max-w-lg mx-auto">
          <ExerciseHost
            level={selectedStationLevel}
            onExit={() => {
              setSelectedStationLevel(null);
              refreshProgress();
            }}
            onFinishStation={handleStationUnlocked}
          />
        </div>
      ) : (
        <>
          {/* Top Sticky Navigation Bar with Solid Non-Ghosting Header */}
          <NavigationHeader
            streak={progress.streak || 7}
            xp={progress.xp || 480}
            isDark={isDark}
            toggleTheme={toggleTheme}
            currentStation={currentStationInfo}
          />

          {/* Main App Content Viewport with Bottom Padding Matching Tab Bar */}
          <main className="flex-1 w-full max-w-lg mx-auto px-3 sm:px-4 pt-3 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] overflow-y-auto overscroll-contain">
            {activeTab === 'route' && (
              <div className="space-y-4">
                <MetroLineMap
                  onSelectStation={handleSelectStation}
                  currentLevelId={progress.currentLevelId}
                  isDark={isDark}
                />
              </div>
            )}

            {activeTab === 'sounds' && (
              <ToneStudioView />
            )}

            {activeTab === 'practice' && (
              <StreetLabsView onAddXp={handleAddXp} />
            )}

            {activeTab === 'dictionary' && (
              <LexiconView />
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4">
                <ProfileView
                  streak={progress.streak || 7}
                  xp={progress.xp || 480}
                  onAddXp={handleAddXp}
                  onLaunchRemediation={handleLaunchRemediation}
                />
                
                {/* Showcase & Info Footer Navigation */}
                {onExitToLanding && (
                  <div className="pt-2 pb-4 text-center">
                    <button
                      type="button"
                      onClick={onExitToLanding}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200/60 dark:bg-subway-surface border border-slate-300 dark:border-subway-border transition-colors"
                    >
                      <span>← Back to Landing Showcase</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* Bottom Persistent Navigation Bar */}
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      )}

      {/* Audio Status & Dev Inspector Overlay */}
      <AudioDebugOverlay />
    </div>
  );
}
