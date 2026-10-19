import React from 'react';

const TONE_SPECS = {
  1: { name: 'High Level', contour: '55', register: 'Upper', path: 'M 2 4 L 22 4', color: '#EF4444' },
  2: { name: 'High Rising', contour: '25', register: 'Upper', path: 'M 2 18 L 22 4', color: '#F59E0B' },
  3: { name: 'Mid Level', contour: '33', register: 'Upper', path: 'M 2 11 L 22 11', color: '#10B981' },
  4: { name: 'Low Falling', contour: '21', register: 'Lower', path: 'M 2 16 L 22 22', color: '#3B82F6' },
  5: { name: 'Low Rising', contour: '23', register: 'Lower', path: 'M 2 22 L 22 14', color: '#8B5CF6' },
  6: { name: 'Low Level', contour: '22', register: 'Lower', path: 'M 2 20 L 22 20', color: '#EC4899' },
};

export default function ToneBadge({ toneNumber = 1, showDetails = false, size = 'md' }) {
  const spec = TONE_SPECS[toneNumber] || TONE_SPECS[1];

  if (!showDetails) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-white/10 dark:bg-black/30 border border-white/20 text-white shadow-xs">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d={spec.path} stroke={spec.color} />
        </svg>
        <span>T{toneNumber}</span>
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/15 text-white">
      <svg className="w-5 h-5 bg-black/40 rounded p-0.5 border border-white/10" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round">
        <line x1="2" y1="4" x2="22" y2="4" stroke="rgba(255,255,255,0.15)" strokeDasharray="2 2" strokeWidth="1" />
        <line x1="2" y1="12" x2="22" y2="12" stroke="rgba(255,255,255,0.15)" strokeDasharray="2 2" strokeWidth="1" />
        <line x1="2" y1="20" x2="22" y2="20" stroke="rgba(255,255,255,0.15)" strokeDasharray="2 2" strokeWidth="1" />
        <path d={spec.path} stroke={spec.color} />
      </svg>
      <div className="text-left leading-tight">
        <div className="text-xs font-bold font-mono flex items-center gap-1.5">
          <span>Tone {toneNumber}</span>
          <span className="text-[10px] text-zinc-400 font-sans">({spec.contour})</span>
        </div>
        <div className="text-[10px] text-zinc-300">{spec.name}</div>
      </div>
    </div>
  );
}
