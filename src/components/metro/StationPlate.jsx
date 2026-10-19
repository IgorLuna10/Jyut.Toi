import React from 'react';
import themesData from '@shared/themes.json';

export default function StationPlate({
  themeId = 'red',
  isDark = false,
  chinese = '入門',
  jyutping = 'jap6 mun4',
  english = 'Level 1 · Essentials',
  levelNumber = 1,
  compact = false,
  className = '',
}) {
  const theme = themesData.themes[themeId] || themesData.themes.red;
  const modeKey = isDark ? 'night' : 'light';
  const mode = theme[modeKey];

  return (
    <div
      className={`relative rounded-2xl sm:rounded-3xl border shadow-xl transition-all select-none ${className}`}
      style={{
        backgroundColor: mode.plateBg,
        borderColor: mode.plateBorder,
        boxShadow: `0 8px 24px -4px rgba(0,0,0,0.45), inset 0 1px 2px rgba(255,255,255,0.2), 0 0 0 1px ${mode.plateBorder}33`,
      }}
    >
      {/* 4 Corner Enamel Mounting Rivets */}
      <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-white/30 border border-black/40 shadow-xs" />
      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white/30 border border-black/40 shadow-xs" />
      <span className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-white/30 border border-black/40 shadow-xs" />
      <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-white/30 border border-black/40 shadow-xs" />

      <div className={`text-center px-4 py-3 sm:px-6 sm:py-4 ${compact ? 'py-2 px-3' : ''}`}>
        {/* Level Tag */}
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <span 
            className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
            style={{
              backgroundColor: mode.badgeBg,
              color: mode.badgeText,
              border: `1px solid ${mode.badgeBorder}`,
            }}
          >
            STATION {levelNumber}
          </span>
        </div>

        {/* Large Traditional Chinese Calligraphy / Station Lettering */}
        <div
          className={`font-serif font-black tracking-wider leading-none my-1 drop-shadow-sm ${
            compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-5xl'
          }`}
          style={{ color: mode.lettering }}
        >
          {chinese}
        </div>

        {/* Jyutping with Tone Digits */}
        <div
          className="font-mono text-xs sm:text-sm font-semibold tracking-wide opacity-90 mb-0.5"
          style={{ color: mode.subLettering }}
        >
          {jyutping}
        </div>

        {/* English Title */}
        <div
          className="text-[11px] sm:text-xs font-medium tracking-tight opacity-75"
          style={{ color: mode.subLettering }}
        >
          {english}
        </div>
      </div>
    </div>
  );
}
