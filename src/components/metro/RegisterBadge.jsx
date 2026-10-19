import React from 'react';

export default function RegisterBadge({ toneNumber = 1 }) {
  const isUpper = [1, 2, 3].includes(Number(toneNumber));

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        isUpper
          ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
          : 'bg-indigo-400/15 text-indigo-300 border border-indigo-400/30'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isUpper ? 'bg-amber-400' : 'bg-indigo-400'}`} />
      <span>{isUpper ? 'Upper Register (陰)' : 'Lower Register (陽)'}</span>
    </span>
  );
}
