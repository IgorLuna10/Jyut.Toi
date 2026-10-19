import React from 'react';
import themesData from '@shared/themes.json';

export default function TileWall({
  themeId = 'red',
  isDark = false,
  className = '',
  children,
  headerOnly = false,
}) {
  const theme = themesData.themes[themeId] || themesData.themes.red;
  const modeKey = isDark ? 'night' : 'light';
  const mode = theme[modeKey];
  const tileType = theme.tileType;

  // Background WebP asset path
  const assetUrl = `/tiles/${themeId}_${modeKey}.webp`;

  return (
    <div
      className={`relative overflow-hidden transition-colors duration-500 ${className}`}
      style={{
        backgroundColor: mode.tileBase,
        backgroundImage: `url(${assetUrl})`,
        backgroundRepeat: 'repeat',
        backgroundSize: tileType === 'gloss_panel' ? 'cover' : '260px 390px',
      }}
    >
      {/* Glazed Station Lighting Overlay: Lighter upper third, station platform sheen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, 
            rgba(255, 255, 255, ${isDark ? 0.08 : 0.16}) 0%, 
            rgba(255, 255, 255, ${isDark ? 0.02 : 0.06}) 35%, 
            rgba(0, 0, 0, ${isDark ? 0.45 : 0.18}) 100%)`,
        }}
      />

      {/* Subtle Station Wall Grout Grid Sheen */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.4) 0%, transparent 70%)'
        }}
      />

      {/* Content Container */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
