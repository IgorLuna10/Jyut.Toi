import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Volume2, CheckCircle2, ChevronRight, Award, Compass } from 'lucide-react';
import TileWall from './TileWall';
import StationPlate from './StationPlate';
import WordCard from './WordCard';
import ToneBadge from './ToneBadge';
import StationExam from './StationExam';
import PlatformDoorTransition from './PlatformDoorTransition';
import { speechEngine } from '@/services/speechEngine';
import { metroService } from '@/services/metroService';
import themesData from '@shared/themes.json';

export default function ExerciseShell({
  level,
  isDark = false,
  onBackToMap,
  onStationUnlocked,
}) {
  const theme = themesData.themes[level.themeId] || themesData.themes.red;
  const modeKey = isDark ? 'night' : 'light';
  const mode = theme[modeKey];

  // Steps: 0: Vocab Discovery, 1: Tone Drill, 2: Sentence Scramble, 3: Station Exam
  const [currentStep, setCurrentStep] = useState(0);

  // Vocab State
  const [vocabIdx, setVocabIdx] = useState(0);
  const [masteredWords, setMasteredWords] = useState([]);

  // Tone Drill State
  const toneQuestions = level.toneDrill || [];
  const [toneIdx, setToneIdx] = useState(0);
  const [toneFeedback, setToneFeedback] = useState(null);

  // Sentence Scramble State
  const sentenceChallenge = level.sentence;
  const [sentenceTokens, setSentenceTokens] = useState([]);
  const [sentenceFeedback, setSentenceFeedback] = useState(null);

  // Platform Door Transition State
  const [showDoorTransition, setShowDoorTransition] = useState(false);
  const [nextLevelInfo, setNextLevelInfo] = useState(null);

  // Step names
  const steps = [
    { title: 'Vocab', icon: '📖' },
    { title: 'Tones', icon: '🎯' },
    { title: 'Sentence', icon: '🧩' },
    { title: 'Exam', icon: '🏆' },
  ];

  const handleWordMastered = (chinese) => {
    if (!masteredWords.includes(chinese)) {
      setMasteredWords([...masteredWords, chinese]);
      metroService.addXp(25);
    }
  };

  const handleToneGuess = (guessedTone) => {
    const currentQ = toneQuestions[toneIdx];
    if (guessedTone === currentQ.correctTone) {
      setToneFeedback('correct');
      metroService.addXp(20);
    } else {
      setToneFeedback('wrong');
    }
  };

  const nextToneQuestion = () => {
    setToneFeedback(null);
    setToneIdx((prev) => (prev + 1) % toneQuestions.length);
  };

  const handleSentenceToken = (word) => {
    if (sentenceFeedback === 'correct') return;
    if (sentenceTokens.includes(word)) {
      setSentenceTokens(sentenceTokens.filter((w) => w !== word));
    } else {
      setSentenceTokens([...sentenceTokens, word]);
    }
  };

  const checkSentence = () => {
    const isMatch = JSON.stringify(sentenceTokens) === JSON.stringify(sentenceChallenge.target);
    if (isMatch) {
      setSentenceFeedback('correct');
      metroService.addXp(40);
      speechEngine.speak(sentenceChallenge.target.join(' '));
    } else {
      setSentenceFeedback('wrong');
    }
  };

  const handleExamPassed = (passedLevelNum) => {
    const nextLevelNum = metroService.unlockNextLevel(passedLevelNum);
    const nextLvl = metroService.getLevel(nextLevelNum);
    setNextLevelInfo(nextLvl);
    setShowDoorTransition(true);
  };

  const handleDoorTransitionComplete = () => {
    setShowDoorTransition(false);
    if (onStationUnlocked && nextLevelInfo) {
      onStationUnlocked(nextLevelInfo.level);
    }
  };

  const playAudio = (text) => {
    speechEngine.speak(text);
  };

  const currentVocabItem = level.vocab ? level.vocab[vocabIdx] : null;
  const currentToneQ = toneQuestions[toneIdx];

  return (
    <div className="relative w-full min-h-[640px] rounded-3xl overflow-hidden flex flex-col justify-between">
      {/* Background Station Mosaic Tile Wall */}
      <TileWall
        themeId={level.themeId}
        isDark={isDark}
        className="absolute inset-0 z-0 h-full w-full"
      />

      {/* Top Navigation Bar */}
      <div className="relative z-10 p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-white">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Station Map</span>
        </button>

        {/* Step Tabs */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
          {steps.map((st, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                currentStep === idx
                  ? 'text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              style={{
                backgroundColor: currentStep === idx ? mode.accent : 'transparent',
              }}
            >
              <span>{st.icon}</span>
              <span className="hidden sm:inline">{st.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="relative z-10 flex-1 p-4 sm:p-6 overflow-y-auto max-w-lg mx-auto w-full space-y-4">
        
        {/* Raised Cut-Out Station Enamel Plate */}
        <StationPlate
          themeId={level.themeId}
          isDark={isDark}
          chinese={level.stationChinese}
          jyutping={level.jyutping}
          english={level.title}
          levelNumber={level.level}
        />

        {/* STEP 0: VOCAB DISCOVERY */}
        {currentStep === 0 && currentVocabItem && (
          <div className="space-y-4">
            <WordCard
              item={currentVocabItem}
              themeId={level.themeId}
              isDark={isDark}
              onMastered={() => handleWordMastered(currentVocabItem.chinese)}
              isMastered={masteredWords.includes(currentVocabItem.chinese)}
            />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                disabled={vocabIdx === 0}
                onClick={() => setVocabIdx((prev) => Math.max(0, prev - 1))}
                className="px-3 py-2 rounded-xl bg-slate-900/80 disabled:opacity-40 text-xs font-semibold text-white border border-white/10"
              >
                ← Previous Word
              </button>

              <span className="text-xs font-mono text-white/80 font-bold">
                {vocabIdx + 1} / {level.vocab.length}
              </span>

              {vocabIdx + 1 < level.vocab.length ? (
                <button
                  onClick={() => setVocabIdx((prev) => prev + 1)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-white border border-white/10 shadow hover:brightness-110"
                  style={{ backgroundColor: mode.accent }}
                >
                  Next Word →
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-lg hover:brightness-110 flex items-center gap-1"
                  style={{ backgroundColor: mode.accent }}
                >
                  <span>Practice Tones</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 1: TONE DISCRIMINATION DRILL */}
        {currentStep === 1 && currentToneQ && (
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-white/10 backdrop-blur-md shadow-2xl text-white space-y-4">
            <div className="text-center">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: mode.badgeBg,
                  color: mode.badgeText,
                  border: `1px solid ${mode.badgeBorder}`,
                }}
              >
                Tone Drill · {toneIdx + 1}/{toneQuestions.length}
              </span>
              <h4 className="text-base font-bold text-white mt-1">
                Which pitch contour do you hear?
              </h4>
            </div>

            {/* Audio Prompt Character Box */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-center">
              <div className="text-5xl font-serif font-black text-white mb-2">
                {currentToneQ.character}
              </div>
              <p className="text-xs text-zinc-400 mb-3">Meaning: {currentToneQ.meaning}</p>
              <button
                onClick={() => playAudio(currentToneQ.character)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs text-white shadow-lg hover:brightness-110 active:scale-95"
                style={{ backgroundColor: mode.accent }}
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen Audio</span>
              </button>
            </div>

            {/* Tone Option Buttons */}
            <div className="grid grid-cols-3 gap-2">
              {currentToneQ.options.map((toneNum) => {
                const isCorrect = toneNum === currentToneQ.correctTone;
                let btnStyle = 'bg-slate-800/80 border-slate-700 hover:border-white/30 text-white';

                if (toneFeedback) {
                  if (isCorrect) btnStyle = 'bg-emerald-600/90 border-emerald-400 text-white';
                  else btnStyle = 'opacity-40 bg-slate-800 border-slate-800 text-zinc-500';
                }

                return (
                  <button
                    key={toneNum}
                    disabled={!!toneFeedback}
                    onClick={() => handleToneGuess(toneNum)}
                    className={`p-3 rounded-2xl border text-center transition-all ${btnStyle}`}
                  >
                    <div className="text-sm font-bold font-mono">Tone {toneNum}</div>
                    <ToneBadge toneNumber={toneNum} showDetails={false} />
                  </button>
                );
              })}
            </div>

            {/* Feedback & Advance */}
            {toneFeedback && (
              <div className={`p-3 rounded-2xl text-center text-xs border ${
                toneFeedback === 'correct'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/80 border-rose-500 text-rose-200'
              }`}>
                <div className="font-bold mb-1">
                  {toneFeedback === 'correct' ? '✓ Correct pitch match!' : '❌ Incorrect tone contour'}
                </div>
                <div className="text-[11px] text-zinc-300 mb-2">
                  Target is Tone {currentToneQ.correctTone} ({currentToneQ.name}).
                </div>
                {toneIdx + 1 < toneQuestions.length ? (
                  <button
                    onClick={nextToneQuestion}
                    className="w-full py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors"
                  >
                    Next Sound →
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="w-full py-2 rounded-xl text-white font-bold text-xs transition-colors shadow-md"
                    style={{ backgroundColor: mode.accent }}
                  >
                    Proceed to Sentence Builder →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: SENTENCE BUILDER */}
        {currentStep === 2 && sentenceChallenge && (
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/95 border border-white/10 backdrop-blur-md shadow-2xl text-white space-y-4">
            <div className="text-center">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: mode.badgeBg,
                  color: mode.badgeText,
                  border: `1px solid ${mode.badgeBorder}`,
                }}
              >
                Sentence Scramble
              </span>
              <p className="text-sm text-zinc-200 font-semibold mt-1">
                "{sentenceChallenge.english}"
              </p>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">
                {sentenceChallenge.jyutping}
              </p>
            </div>

            {/* Assembly Area */}
            <div className="min-h-[64px] p-3 rounded-2xl bg-black/50 border border-dashed border-slate-700 flex flex-wrap gap-2 items-center justify-center">
              {sentenceTokens.length === 0 ? (
                <span className="text-[11px] text-zinc-500 italic">Tap words below in natural Cantonese order</span>
              ) : (
                sentenceTokens.map((token, i) => (
                  <button
                    key={i}
                    onClick={() => handleSentenceToken(token)}
                    className="px-3 py-1.5 rounded-xl font-serif font-bold text-xs text-white shadow-sm active:scale-95 transition-transform"
                    style={{ backgroundColor: mode.accent }}
                  >
                    {token} ✕
                  </button>
                ))
              )}
            </div>

            {/* Word Pool */}
            <div className="flex flex-wrap gap-2 justify-center pt-1">
              {sentenceChallenge.pool.map((word, i) => {
                const isUsed = sentenceTokens.includes(word);
                return (
                  <button
                    key={i}
                    disabled={isUsed}
                    onClick={() => handleSentenceToken(word)}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-serif font-bold transition-all ${
                      isUsed
                        ? 'opacity-30 bg-slate-800 border-slate-800 text-zinc-500'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-white shadow-sm'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              {!sentenceFeedback ? (
                <button
                  disabled={sentenceTokens.length === 0}
                  onClick={checkSentence}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-md disabled:opacity-40 hover:brightness-110 transition-all"
                  style={{ backgroundColor: mode.accent }}
                >
                  Verify Sentence
                </button>
              ) : (
                <div className="space-y-2">
                  <div className={`p-2.5 rounded-xl text-center text-xs border ${
                    sentenceFeedback === 'correct'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                  }`}>
                    {sentenceFeedback === 'correct'
                      ? '✓ Perfect natural Cantonese word order!'
                      : 'Check the tone particles and sequence.'}
                  </div>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md hover:brightness-110 flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: mode.accent }}
                  >
                    <span>Proceed to Station Checkpoint Exam</span>
                    <Award className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: STATION EXAM / CHECKPOINT */}
        {currentStep === 3 && (
          <StationExam
            level={level}
            isDark={isDark}
            onPassExam={handleExamPassed}
            onCancel={() => setCurrentStep(0)}
          />
        )}

      </div>

      {/* Platform Screen Door Wipe Transition */}
      <PlatformDoorTransition
        isActive={showDoorTransition}
        nextStationChinese={nextLevelInfo?.stationChinese || '下一站'}
        nextStationEnglish={nextLevelInfo?.title || 'Next Station'}
        announcement={level.doorAnnouncement}
        onComplete={handleDoorTransitionComplete}
      />
    </div>
  );
}
