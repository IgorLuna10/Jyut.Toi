import React, { useEffect, useState } from 'react';
import { metroService } from '@/services/metroService';

export default function PlatformDoorTransition({
  isActive,
  nextStationChinese = '交通',
  nextStationEnglish = 'Level 2 · Transit',
  announcement = '請勿靠近車門 · Please stand clear of the platform doors',
  onComplete,
}) {
  const [phase, setPhase] = useState('idle'); // 'closing' -> 'closed' -> 'opening' -> 'done'

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    // Start transition
    setPhase('closing');
    metroService.playPlatformDoorChime();

    // Doors closed
    const timer1 = setTimeout(() => {
      setPhase('closed');
      metroService.playStationArrivalChime();
    }, 1100);

    // Doors open
    const timer2 = setTimeout(() => {
      setPhase('opening');
    }, 2400);

    // Done
    const timer3 = setTimeout(() => {
      setPhase('done');
      if (onComplete) onComplete();
    }, 3400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isActive, onComplete]);

  if (!isActive && phase === 'idle') return null;

  const isClosedOrClosing = phase === 'closing' || phase === 'closed';

  return (
    <div className="absolute inset-0 z-50 overflow-hidden pointer-events-auto flex items-center justify-center">
      
      {/* Left Platform Screen Door */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-900 border-r-4 border-amber-400 shadow-2xl transition-transform duration-1000 ease-in-out flex flex-col justify-between p-4"
        style={{
          transform: isClosedOrClosing ? 'translateX(0%)' : 'translateX(-100%)',
        }}
      >
        {/* Door Glass Panel */}
        <div className="h-2/3 w-full rounded-2xl bg-cyan-950/40 border border-cyan-400/30 p-3 relative overflow-hidden backdrop-blur-xs">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60 pointer-events-none" />
          <div className="h-full flex items-center justify-center">
            <span className="text-white/20 font-mono text-4xl font-black">◀</span>
          </div>
        </div>

        {/* Bottom Safety Strip */}
        <div className="h-10 w-full bg-amber-400/20 border-t-2 border-amber-400 flex items-center px-2">
          <span className="text-[10px] font-mono text-amber-300 tracking-wider">DOOR L-01</span>
        </div>
      </div>

      {/* Right Platform Screen Door */}
      <div
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-zinc-800 via-zinc-700 to-zinc-900 border-l-4 border-amber-400 shadow-2xl transition-transform duration-1000 ease-in-out flex flex-col justify-between p-4"
        style={{
          transform: isClosedOrClosing ? 'translateX(0%)' : 'translateX(100%)',
        }}
      >
        {/* Door Glass Panel */}
        <div className="h-2/3 w-full rounded-2xl bg-cyan-950/40 border border-cyan-400/30 p-3 relative overflow-hidden backdrop-blur-xs">
          <div className="absolute inset-0 bg-gradient-to-bl from-white/20 via-transparent to-transparent opacity-60 pointer-events-none" />
          <div className="h-full flex items-center justify-center">
            <span className="text-white/20 font-mono text-4xl font-black">▶</span>
          </div>
        </div>

        {/* Bottom Safety Strip */}
        <div className="h-10 w-full bg-amber-400/20 border-t-2 border-amber-400 flex items-center justify-end px-2">
          <span className="text-[10px] font-mono text-amber-300 tracking-wider">DOOR R-02</span>
        </div>
      </div>

      {/* Center Door Warning Indicator & Signage */}
      <div
        className={`relative z-20 max-w-sm mx-auto px-6 py-4 rounded-2xl bg-slate-950/95 border-2 border-amber-400 text-center shadow-2xl transition-all duration-500 ${
          phase === 'closed' ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        {/* Flashing Warning Light */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase">
            Platform Screen Doors
          </span>
        </div>

        {/* Bilingual Announcement */}
        <div className="font-serif text-lg font-bold text-white mb-1">
          請勿靠近車門
        </div>
        <div className="text-xs font-mono text-amber-300 mb-3">
          Stand Clear of Platform Doors
        </div>

        {/* Next Station Header */}
        <div className="pt-3 border-t border-slate-800">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-0.5">
            Departing for Next Wall
          </span>
          <div className="text-2xl font-serif font-black text-white">
            {nextStationChinese}
          </div>
          <div className="text-xs text-zinc-300 font-medium">
            {nextStationEnglish}
          </div>
        </div>
      </div>

    </div>
  );
}
