import React, { useState } from 'react';
import { 
  Volume2, Award, ChevronRight, CheckCircle2, RotateCcw, 
  Sparkles, Lock, Play, Compass, BookOpen, Layers, ArrowRight, ArrowLeft
} from 'lucide-react';
import { speechEngine } from '../services/speechEngine';
import { hapticsService } from '../services/hapticsService';
import { APP_NAME } from '../config/appConfig';
import { metroService } from '../services/metroService';
import TileWall from './metro/TileWall';
import StationPlate from './metro/StationPlate';
import ExerciseShell from './metro/ExerciseShell';
import MetroLineMap from './metro/MetroLineMap';
import themesData from '@shared/themes.json';

const TONES_DATA = [
  { tone: 1, name: 'High Level', contour: '55', sample: '詩 (si1)', meaning: 'Poem', color: '#ef4444' },
  { tone: 2, name: 'High Rising', contour: '25', sample: '史 (si2)', meaning: 'History', color: '#f97316' },
  { tone: 3, name: 'Mid Level', contour: '33', sample: '試 (si3)', meaning: 'Try / Test', color: '#eab308' },
  { tone: 4, name: 'Low Falling', contour: '21', sample: '時 (si4)', meaning: 'Time', color: '#06b6d4' },
  { tone: 5, name: 'Low Rising', contour: '23', sample: '市 (si5)', meaning: 'Market', color: '#3b82f6' },
  { tone: 6, name: 'Low Level', contour: '22', sample: '事 (si6)', meaning: 'Matter', color: '#a855f7' },
];

const SENTENCE_CHALLENGES = [
  {
    english: "Please, one iced lemon tea.",
    jyutping: "m4 goi1, jat1 bui1 dung3 ning4 caa4.",
    target: ["唔該", "一杯", "凍檸茶"],
    pool: ["凍檸茶", "唔該", "食飯", "一杯", "多謝"]
  },
  {
    english: "How do I get to Central station?",
    jyutping: "zung1 waan4 zaam6 dim2 heoi3?",
    target: ["中環", "站", "點去？"],
    pool: ["點去？", "多謝", "中環", "站", "屋企"]
  },
  {
    english: "Very delicious, thank you!",
    jyutping: "hou2 hou2 sik6, do1 ze6!",
    target: ["好好食", "多謝！"],
    pool: ["靚仔", "好好食", "多謝！", "走甜"]
  }
];

export default function PhoneSimulator({ content, streak: initialStreak = 0 }) {
  const [activeTab, setActiveTab] = useState('metro'); // 'metro' | 'station' | 'spark' | 'tone' | 'sentence'
  const [streak, setStreak] = useState(initialStreak);
  const [xp, setXp] = useState(0);
  const [selectedStation, setSelectedStation] = useState(() => metroService.getLevel(1));
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  // Tone Master Game State
  const [toneIndex, setToneIndex] = useState(0);
  const [toneFeedback, setToneFeedback] = useState(null);

  // Sentence Builder State
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [sentenceFeedback, setSentenceFeedback] = useState(null);

  const playAudio = (text) => {
    hapticsService.tapLight();
    setIsPlayingAudio(true);
    speechEngine.speak(text);
    setTimeout(() => setIsPlayingAudio(false), 800);
  };

  const handleToneSelect = (selectedTone) => {
    const currentTarget = TONES_DATA[toneIndex];
    if (selectedTone === currentTarget.tone) {
      hapticsService.tapMedium();
      setToneFeedback('correct');
      setXp(w => w + 25);
    } else {
      hapticsService.tapLight();
      setToneFeedback('wrong');
    }
  };

  const nextToneQuestion = () => {
    hapticsService.tapLight();
    setToneFeedback(null);
    setToneIndex((prev) => (prev + 1) % TONES_DATA.length);
  };

  const currentSentence = SENTENCE_CHALLENGES[sentenceIdx];

  const handleTokenClick = (word) => {
    hapticsService.tapLight();
    if (selectedTokens.includes(word)) {
      setSelectedTokens(selectedTokens.filter(w => w !== word));
    } else {
      setSelectedTokens([...selectedTokens, word]);
    }
  };

  const verifySentence = () => {
    const isMatch = JSON.stringify(selectedTokens) === JSON.stringify(currentSentence.target);
    if (isMatch) {
      hapticsService.tapMedium();
      setSentenceFeedback('correct');
      setXp(w => w + 50);
      playAudio(currentSentence.target.join(' '));
    } else {
      hapticsService.tapLight();
      setSentenceFeedback('wrong');
    }
  };

  const nextSentence = () => {
    hapticsService.tapLight();
    setSentenceFeedback(null);
    setSelectedTokens([]);
    setSentenceIdx((prev) => (prev + 1) % SENTENCE_CHALLENGES.length);
  };

  // Launch station exercise shell
  const openStation = (level) => {
    hapticsService.tapLight();
    setSelectedStation(level);
    setActiveTab('station');
  };

  const handleSwitchTab = (tab) => {
    hapticsService.tapLight();
    setActiveTab(tab);
  };

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[360px] h-[700px] rounded-[50px] bg-slate-950 p-3 shadow-2xl ring-1 ring-slate-800 shadow-mtr-red/20 flex flex-col justify-between select-none">
      
      {/* Outer Phone Bezel & Specular Rim */}
      <div className="absolute inset-0 rounded-[50px] pointer-events-none ring-1 ring-inset ring-white/10" />
      
      {/* Dynamic Island / Notch */}
      <div className="relative w-full z-30 pt-2 pb-1 px-6 flex items-center justify-between text-[11px] text-white/80 font-medium">
        <span>9:41</span>
        <div className="h-5 w-24 bg-black rounded-full flex items-center justify-center space-x-1.5 shadow-inner">
          <div className="h-2 w-2 rounded-full bg-mtr-red animate-pulse" />
          <span className="text-[9px] text-zinc-300 font-mono tracking-wider">{APP_NAME}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-2 border border-white/60 rounded-xs flex items-center p-0.5">
            <div className="w-2 h-1 bg-white rounded-xs"></div>
          </div>
        </div>
      </div>

      {/* Screen Content Window */}
      <div className="relative flex-1 bg-slate-900 rounded-[38px] overflow-hidden flex flex-col border border-white/5">
        
        {/* Top App Bar inside Simulator */}
        <div className="px-4 py-2.5 bg-slate-950/95 border-b border-white/10 backdrop-blur-md flex items-center justify-between z-20">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold text-xs">⚡</span>
            <span className="text-xs font-bold text-white font-mono">{streak} Day Streak</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono font-bold bg-mtr-red/10 text-mtr-red dark:text-red-400 px-2.5 py-0.5 rounded-full border border-mtr-red/20">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{xp} XP</span>
          </div>
        </div>

        {/* Dynamic Tab Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          
          {/* TAB 1: METRO PROGRESSION LINE MAP */}
          {activeTab === 'metro' && (
            <div className="p-3">
              <MetroLineMap
                currentLevelId={selectedStation.level}
                isDark={true}
                onSelectStation={openStation}
              />
            </div>
          )}

          {/* TAB 2: ACTIVE STATION WALL & EXERCISE SHELL */}
          {activeTab === 'station' && selectedStation && (
            <ExerciseShell
              level={selectedStation}
              isDark={true}
              onBackToMap={() => setActiveTab('metro')}
              onStationUnlocked={(nextLvlNum) => {
                const nextLvl = metroService.getLevel(nextLvlNum);
                setSelectedStation(nextLvl);
                setXp(x => x + 100);
              }}
            />
          )}

          {/* TAB 3: DAILY SPARK */}
          {activeTab === 'spark' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                <span className="font-mono text-[10px] tracking-wider uppercase">DAILY PRACTICE</span>
                <span className="text-mtr-red font-mono font-bold">Day 42 / 365</span>
              </div>

              {/* Main Word Card with Station Tile backdrop */}
              <TileWall themeId="red" isDark={true} className="rounded-2xl p-5 border border-white/15 shadow-xl text-center relative group">
                <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-black/50 border border-amber-300/30 px-3 py-0.5 rounded-full mb-3 shadow-xs">
                  Daily Word · 今日一詞
                </span>
                
                <h3 className="text-5xl font-serif font-black text-white tracking-wider mb-2 drop-shadow-md">
                  {content?.mainWord?.chinese || "屋企"}
                </h3>
                
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-zinc-100 bg-black/60 px-3 py-1 rounded-lg border border-white/15">
                    {content?.mainWord?.jyutping || "uk1 kei2"}
                  </span>
                  <button 
                    type="button"
                    onClick={() => playAudio(content?.mainWord?.chinese || "屋企")}
                    className="tile-btn p-2 rounded-full bg-mtr-red hover:bg-mtr-red/90 text-white shadow-md transition-all"
                    title="Listen Cantonese Audio"
                    aria-label="Listen Cantonese Audio"
                  >
                    {isPlayingAudio ? (
                      <div className="flex items-end gap-0.5 h-3.5 w-3.5 py-0.5">
                        <span className="w-0.5 bg-white sound-bar h-full" />
                        <span className="w-0.5 bg-white sound-bar h-2/3" />
                        <span className="w-0.5 bg-white sound-bar h-4/5" />
                      </div>
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <p className="text-sm text-zinc-200 font-semibold capitalize">
                  "{content?.mainWord?.english || "home / family"}"
                </p>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-zinc-300 font-mono">
                  <span>Tone 1 (uk1) + Tone 2 (kei2)</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Core Vocab
                  </span>
                </div>
              </TileWall>

              {/* Action Banner */}
              <button 
                type="button"
                onClick={() => {
                  handleSwitchTab('metro');
                }}
                className="tile-btn w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-mtr-red to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-mtr-red/30 transition-all"
              >
                <span>Enter Metro Stations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TAB 4: TONE DRILL GAME */}
          {activeTab === 'tone' && (
            <div className="p-4 space-y-3.5">
              <div className="text-center">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  Tone Discrimination Drill
                </span>
                <h4 className="text-sm font-bold text-white mt-1">Which tone do you hear?</h4>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center shadow-inner">
                <div className="text-4xl font-serif font-black text-white mb-1">
                  {TONES_DATA[toneIndex].sample.split(' ')[0]}
                </div>
                <p className="text-xs text-zinc-400 mb-3 font-mono">Meaning: {TONES_DATA[toneIndex].meaning}</p>
                <button
                  type="button"
                  onClick={() => playAudio(TONES_DATA[toneIndex].sample.split(' ')[0])}
                  className="tile-btn inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mtr-red hover:bg-mtr-red/90 text-white text-xs font-bold shadow-md transition-all"
                >
                  {isPlayingAudio ? (
                    <div className="flex items-end gap-0.5 h-3.5 w-3.5 py-0.5">
                      <span className="w-0.5 bg-white sound-bar h-full" />
                      <span className="w-0.5 bg-white sound-bar h-2/3" />
                      <span className="w-0.5 bg-white sound-bar h-4/5" />
                    </div>
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                  <span>Listen Audio</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {TONES_DATA.map((t) => {
                  const isCurrent = t.tone === TONES_DATA[toneIndex].tone;
                  let btnColor = "bg-slate-800/80 border-slate-700 text-zinc-200 hover:border-white/30";
                  
                  if (toneFeedback) {
                    if (isCurrent) btnColor = "bg-emerald-600/90 border-emerald-400 text-white font-bold shadow-md";
                    else btnColor = "opacity-35 bg-slate-800 border-slate-800 text-zinc-500";
                  }

                  return (
                    <button
                      key={t.tone}
                      type="button"
                      disabled={!!toneFeedback}
                      onClick={() => handleToneSelect(t.tone)}
                      className={`tile-btn p-2.5 rounded-xl border text-center transition-all ${btnColor}`}
                    >
                      <div className="text-xs font-bold font-mono">Tone {t.tone}</div>
                      <div className="text-[10px] text-zinc-400 truncate font-mono">({t.contour})</div>
                    </button>
                  );
                })}
              </div>

              {toneFeedback && (
                <div className={`p-3 rounded-xl text-center text-xs border ${
                  toneFeedback === 'correct' 
                    ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' 
                    : 'bg-rose-950/60 border-rose-600 text-rose-200'
                }`}>
                  <div className="font-bold mb-1.5 font-mono">
                    {toneFeedback === 'correct' ? '✓ Correct tone contour!' : '❌ Not quite!'}
                  </div>
                  <button
                    type="button"
                    onClick={nextToneQuestion}
                    className="tile-btn w-full py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-xs transition-colors"
                  >
                    Next Sound →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SENTENCE BUILDER */}
          {activeTab === 'sentence' && (
            <div className="p-4 space-y-3.5">
              <div className="text-center">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  Sentence Scramble · 句子重組
                </span>
                <p className="text-xs text-zinc-300 font-medium mt-1">"{currentSentence.english}"</p>
              </div>

              <div className="min-h-[64px] p-2.5 rounded-xl bg-slate-950/90 border border-dashed border-slate-700 flex flex-wrap gap-1.5 items-center justify-center">
                {selectedTokens.length === 0 ? (
                  <span className="text-[11px] text-zinc-500 italic">Tap tiles below to assemble sentence</span>
                ) : (
                  selectedTokens.map((token, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleTokenClick(token)}
                      className="tile-btn px-3 py-1.5 rounded-xl bg-mtr-red text-white text-xs font-serif font-black shadow-md border-b-2 border-red-800"
                    >
                      {token} ✕
                    </button>
                  ))
                )}
              </div>

              <div className="flex flex-wrap gap-2 justify-center pt-1">
                {currentSentence.pool.map((word, i) => {
                  const isUsed = selectedTokens.includes(word);
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isUsed}
                      onClick={() => handleTokenClick(word)}
                      className={`tile-btn px-3.5 py-2 rounded-xl text-xs font-serif font-bold transition-all shadow-sm ${
                        isUsed 
                          ? 'opacity-30 bg-slate-800 border-slate-700 text-zinc-500' 
                          : 'bg-slate-800/90 hover:bg-slate-750 border border-slate-650 text-white border-b-2 border-b-slate-950'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                {!sentenceFeedback ? (
                  <button
                    type="button"
                    disabled={selectedTokens.length === 0}
                    onClick={verifySentence}
                    className="tile-btn w-full py-2.5 rounded-xl bg-mtr-red disabled:opacity-40 text-white text-xs font-bold shadow-md hover:bg-mtr-red/90 transition-all"
                  >
                    Check Order
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className={`p-2.5 rounded-xl text-center text-xs ${
                      sentenceFeedback === 'correct' ? 'bg-emerald-950/70 border border-emerald-600 text-emerald-200' : 'bg-rose-950/70 border border-rose-600 text-rose-200'
                    }`}>
                      {sentenceFeedback === 'correct' ? '✓ Correct! Natural Cantonese word order.' : 'Check particle order.'}
                    </div>
                    <button
                      type="button"
                      onClick={nextSentence}
                      className="tile-btn w-full py-2 rounded-xl bg-slate-750 hover:bg-slate-700 text-white text-xs font-semibold"
                    >
                      Next Sentence →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Bottom App Navigation Bar inside Simulator */}
        <div className="px-3 py-2 bg-slate-950 border-t border-white/10 flex items-center justify-around text-center z-20">
          <button
            type="button"
            onClick={() => handleSwitchTab('metro')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
              activeTab === 'metro' || activeTab === 'station' ? 'text-mtr-red font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Metro Line</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab('spark')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
              activeTab === 'spark' ? 'text-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Today</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab('tone')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
              activeTab === 'tone' ? 'text-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Tones</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTab('sentence')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
              activeTab === 'sentence' ? 'text-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Builder</span>
          </button>
        </div>

        {/* Home Indicator Bar */}
        <div className="w-full pb-1 pt-0.5 flex justify-center bg-slate-950">
          <div className="w-24 h-1 bg-white/30 rounded-full"></div>
        </div>

      </div>

    </div>
  );
}
