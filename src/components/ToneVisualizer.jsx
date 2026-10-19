import React, { useState } from 'react';
import { Volume2, Play, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { speechEngine } from '../services/speechEngine';
import { hapticsService } from '../services/hapticsService';

const TONES = [
  {
    num: 1,
    name: 'High Flat',
    cantoName: '陰平 (jam1 ping4)',
    pitch: '55',
    path: 'M 15 20 L 85 20',
    startDot: { x: 15, y: 20 },
    endDot: { x: 85, y: 20 },
    register: 'Upper (陰)',
    char: '詩',
    jyutping: 'si1',
    meaning: 'Poem',
    color: '#ef4444', // Red
    desc: 'Starts high at pitch 5 and stays completely level, like singing a sustained high note.'
  },
  {
    num: 2,
    name: 'High Rising',
    cantoName: '陰上 (jam1 soeng5)',
    pitch: '25',
    path: 'M 15 65 C 45 65, 60 25, 85 20',
    startDot: { x: 15, y: 65 },
    endDot: { x: 85, y: 20 },
    register: 'Upper (陰)',
    char: '史',
    jyutping: 'si2',
    meaning: 'History',
    color: '#f97316', // Orange
    desc: 'Starts low-mid and shoots upward with swift acceleration, like asking "What?!".'
  },
  {
    num: 3,
    name: 'Mid Flat',
    cantoName: '陰去 (jam1 heoi3)',
    pitch: '33',
    path: 'M 15 50 L 85 50',
    startDot: { x: 15, y: 50 },
    endDot: { x: 85, y: 50 },
    register: 'Upper (陰)',
    char: '試',
    jyutping: 'si3',
    meaning: 'To try',
    color: '#eab308', // Amber
    desc: 'Spoken steadily in the middle register without any rising or falling inflection.'
  },
  {
    num: 4,
    name: 'Low Falling',
    cantoName: '陽平 (joeng4 ping4)',
    pitch: '21',
    path: 'M 15 65 C 40 68, 65 78, 85 82',
    startDot: { x: 15, y: 65 },
    endDot: { x: 85, y: 82 },
    register: 'Lower (陽)',
    char: '時',
    jyutping: 'si4',
    meaning: 'Time',
    color: '#06b6d4', // Cyan
    desc: 'Deep chest resonance. Starts low and gently descends to the very floor of your vocal range.'
  },
  {
    num: 5,
    name: 'Low Rising',
    cantoName: '陽上 (joeng4 soeng5)',
    pitch: '23',
    path: 'M 15 65 C 40 65, 60 55, 85 50',
    startDot: { x: 15, y: 65 },
    endDot: { x: 85, y: 50 },
    register: 'Lower (陽)',
    char: '市',
    jyutping: 'si5',
    meaning: 'City / Market',
    color: '#3b82f6', // Blue
    desc: 'Starts low and floats smoothly upward to the middle register with steady composure.'
  },
  {
    num: 6,
    name: 'Low Flat',
    cantoName: '陽去 (joeng4 heoi3)',
    pitch: '22',
    path: 'M 15 65 L 85 65',
    startDot: { x: 15, y: 65 },
    endDot: { x: 85, y: 65 },
    register: 'Lower (陽)',
    char: '事',
    jyutping: 'si6',
    meaning: 'Matter / Business',
    color: '#a855f7', // Purple
    desc: 'Steady low drone held flat across your comfortable conversational baseline.'
  }
];

export default function ToneVisualizer() {
  const [selectedTone, setSelectedTone] = useState(TONES[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const playTone = (char) => {
    hapticsService.tapLight();
    setIsPlayingAudio(true);
    speechEngine.speak(char);
    setTimeout(() => setIsPlayingAudio(false), 900);
  };

  const handleSelectTone = (tone) => {
    setSelectedTone(tone);
    playTone(tone.char);
  };

  return (
    <div className="rounded-3xl bg-[#0B0E17] border border-slate-800/90 p-6 sm:p-9 text-white shadow-2xl relative overflow-hidden backdrop-blur-xl">
      
      {/* Dynamic Background Specular Glow */}
      <div 
        className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full blur-[120px] opacity-25 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: selectedTone.color }}
      />

      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between relative z-10">
        
        {/* Left: Interactive Chao 5-Point Pitch Contour Graph */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: selectedTone.color }} />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-300">
                Chao 5-Point Pitch Scope (趙元任標調法)
              </span>
            </div>
            <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-white/10" style={{ color: selectedTone.color }}>
              Contour: {selectedTone.pitch}
            </span>
          </div>

          {/* Scope Card */}
          <div className="relative w-full h-64 bg-slate-950/90 rounded-2xl border border-slate-800/90 p-4 flex flex-col justify-between shadow-inner overflow-hidden">
            
            {/* Horizontal Pitch Guide Lines (5 to 1) */}
            {[
              { level: 5, label: 'High (高)' },
              { level: 4, label: 'Mid-High (半高)' },
              { level: 3, label: 'Mid (中)' },
              { level: 2, label: 'Mid-Low (半低)' },
              { level: 1, label: 'Low (低)' },
            ].map(({ level, label }) => (
              <div key={level} className="relative flex items-center w-full border-b border-white/5 h-0">
                <span className="absolute -left-2 text-[10px] text-zinc-500 font-mono font-bold">
                  {level}
                </span>
                <span className="ml-5 text-[9px] text-zinc-600 font-mono">
                  {label}
                </span>
              </div>
            ))}

            {/* Register Partition Line between Yin (Upper) and Yang (Lower) */}
            <div className="absolute top-[50%] left-10 right-4 border-b border-dashed border-white/10 pointer-events-none flex justify-end">
              <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-600 pr-1">
                Yin / Yang Register Boundary
              </span>
            </div>

            {/* SVG Tone Curves */}
            <svg 
              className="absolute inset-0 w-full h-full p-4 pointer-events-none" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              {/* Background inactive curves */}
              {TONES.map((t) => {
                const isActive = t.num === selectedTone.num;
                return (
                  <path
                    key={t.num}
                    d={t.path}
                    fill="none"
                    stroke={isActive ? t.color : '#334155'}
                    strokeWidth={isActive ? '4.5' : '1.5'}
                    strokeDasharray={isActive ? 'none' : '3,3'}
                    strokeLinecap="round"
                    opacity={isActive ? 1 : 0.35}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Start Dot */}
              <circle 
                cx={selectedTone.startDot.x} 
                cy={selectedTone.startDot.y} 
                r="3.5" 
                fill={selectedTone.color} 
                className="transition-all duration-300"
              />

              {/* End Dot with Auditory Ripple Halo */}
              <circle 
                cx={selectedTone.endDot.x} 
                cy={selectedTone.endDot.y} 
                r="4" 
                fill={selectedTone.color} 
                className="transition-all duration-300"
              />
              {isPlayingAudio && (
                <circle 
                  cx={selectedTone.endDot.x} 
                  cy={selectedTone.endDot.y} 
                  r="10" 
                  fill="none"
                  stroke={selectedTone.color}
                  strokeWidth="1.5"
                  className="animate-ping"
                />
              )}
            </svg>
          </div>

          {/* Minimal Pair Legend */}
          <div className="mt-3 text-xs text-zinc-400 text-center flex items-center justify-center gap-2">
            <span>Identical Syllable "si":</span>
            <span className="font-serif text-white font-bold tracking-wider">
              詩(1) · 史(2) · 試(3) · 時(4) · 市(5) · 事(6)
            </span>
          </div>
        </div>

        {/* Right: Selected Tone Details & Interactive Soundboard */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-5">
          
          {/* Active Tone Hero Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
            {/* Tone Card Glow Sheen */}
            <div 
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
              style={{ backgroundColor: selectedTone.color }}
            />

            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span 
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wide" 
                    style={{ backgroundColor: `${selectedTone.color}25`, color: selectedTone.color }}
                  >
                    Tone {selectedTone.num} · {selectedTone.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-zinc-400">
                    {selectedTone.register}
                  </span>
                </div>
                <div className="text-sm text-zinc-400 font-mono font-medium">
                  {selectedTone.cantoName}
                </div>
              </div>

              {/* Listen Button with Equalizer Waveform */}
              <button
                type="button"
                onClick={() => playTone(selectedTone.char)}
                className="tile-btn flex items-center gap-2 px-4 py-2 rounded-xl text-white font-bold text-xs shadow-lg transition-all"
                style={{ backgroundColor: selectedTone.color }}
                aria-label={`Pronounce Tone ${selectedTone.num} character`}
              >
                {isPlayingAudio ? (
                  <div className="flex items-end gap-0.5 h-3.5 w-3.5 py-0.5">
                    <span className="w-1 bg-white sound-bar h-full" />
                    <span className="w-1 bg-white sound-bar h-2/3" />
                    <span className="w-1 bg-white sound-bar h-4/5" />
                  </div>
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
                <span>Hear "{selectedTone.char}"</span>
              </button>
            </div>

            {/* Calligraphy Hero Display */}
            <div className="mt-5 flex items-baseline gap-4">
              <span className="text-5xl font-serif font-black text-white tracking-wider drop-shadow-md">
                {selectedTone.char}
              </span>
              <div>
                <div className="font-mono text-xl font-bold text-brand-400">
                  {selectedTone.jyutping}
                </div>
                <div className="text-xs text-zinc-300 font-medium">
                  Meaning: "{selectedTone.meaning}"
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-zinc-300 leading-relaxed border-t border-slate-800/80 pt-3">
              {selectedTone.desc}
            </p>
          </div>

          {/* Tone Selector Soundboard Buttons (T1 - T6) */}
          <div className="grid grid-cols-6 gap-2">
            {TONES.map((t) => {
              const isSelected = t.num === selectedTone.num;
              return (
                <button
                  key={t.num}
                  type="button"
                  onClick={() => handleSelectTone(t)}
                  className={`tile-btn py-2.5 rounded-2xl border text-center transition-all ${
                    isSelected 
                      ? 'border-white/80 bg-white/15 text-white font-bold shadow-lg shadow-black/40 scale-105' 
                      : 'border-slate-800 bg-slate-900/70 text-zinc-400 hover:text-white hover:border-slate-700'
                  }`}
                  style={{
                    borderColor: isSelected ? t.color : undefined,
                  }}
                >
                  <div className="text-xs font-mono font-black" style={{ color: isSelected ? t.color : undefined }}>
                    T{t.num}
                  </div>
                  <div className="text-base font-serif font-black my-0.5">{t.char}</div>
                  <div className="text-[9px] font-mono text-zinc-500">{t.pitch}</div>
                </button>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
