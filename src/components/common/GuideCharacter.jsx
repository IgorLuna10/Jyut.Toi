import React from 'react';

/**
 * Ding-Jai (叮仔) - Jyut.Toi's original friendly Hong Kong guide character.
 * An original illustrated transit friend with a conductor cap and expressive poses.
 * 100% original design, clean scalable SVG.
 */
export default function GuideCharacter({
  pose = 'ready', // 'ready' | 'listening' | 'thinking' | 'celebrate' | 'support'
  size = 'md',    // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-18 h-18 sm:w-20 sm:h-20',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    xl: 'w-32 h-32 sm:w-36 sm:h-36',
  };

  const dimClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${dimClass} ${className} select-none`}>
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="faceGrad" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#FFF1E0" />
            <stop offset="100%" stopColor="#FAD4B2" />
          </radialGradient>
          <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C8231F" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>

        {/* Ambient Halo Glow */}
        <circle cx="60" cy="62" r="48" fill="#C8231F" opacity="0.08" />

        {/* Body / Collar */}
        <path
          d="M 38 98 Q 60 114 82 98 L 84 116 Q 60 124 36 116 Z"
          fill="#0F172A"
        />
        {/* Red Necktie / Transit Collar Badge */}
        <path d="M 54 98 L 66 98 L 63 115 L 60 118 L 57 115 Z" fill="#C8231F" />
        <circle cx="60" cy="103" r="2.5" fill="#FBBF24" />

        {/* Head / Round Face */}
        <circle cx="60" cy="62" r="34" fill="url(#faceGrad)" stroke="#E5B28B" strokeWidth="2" />

        {/* Ears */}
        <circle cx="27" cy="64" r="7" fill="#FAD4B2" />
        <circle cx="93" cy="64" r="7" fill="#FAD4B2" />

        {/* Rosy Cheeks */}
        <ellipse cx="43" cy="70" rx="5.5" ry="3.5" fill="#FB7185" opacity="0.6" />
        <ellipse cx="77" cy="70" rx="5.5" ry="3.5" fill="#FB7185" opacity="0.6" />

        {/* Expressive Eyes & Eyebrows based on pose */}
        {pose === 'celebrate' ? (
          <>
            {/* Happy Curved Eyes (Smiling shut) */}
            <path d="M 43 59 Q 49 53 55 59" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <path d="M 65 59 Q 71 53 77 59" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            {/* Wide Cheerful Smile */}
            <path d="M 49 71 Q 60 85 71 71 Z" fill="#C8231F" stroke="#1E293B" strokeWidth="2" />
            <path d="M 53 73 Q 60 79 67 73" fill="#FB7185" />
          </>
        ) : pose === 'listening' ? (
          <>
            {/* Attentive Eyes with Sparkle */}
            <circle cx="49" cy="58" r="4.5" fill="#1E293B" />
            <circle cx="47.5" cy="56.5" r="1.5" fill="#FFFFFF" />
            <circle cx="71" cy="58" r="4.5" fill="#1E293B" />
            <circle cx="69.5" cy="56.5" r="1.5" fill="#FFFFFF" />
            {/* Gentle Smile */}
            <path d="M 52 72 Q 60 78 68 72" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            {/* Headphones */}
            <path d="M 24 64 A 36 36 0 0 1 96 64" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
            <rect x="20" y="56" width="9" height="18" rx="4.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <rect x="91" y="56" width="9" height="18" rx="4.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          </>
        ) : pose === 'thinking' ? (
          <>
            {/* Looking Up Tilted Eyes */}
            <circle cx="50" cy="55" r="4" fill="#1E293B" />
            <circle cx="48.5" cy="53.5" r="1.5" fill="#FFFFFF" />
            <circle cx="72" cy="55" r="4" fill="#1E293B" />
            <circle cx="70.5" cy="53.5" r="1.5" fill="#FFFFFF" />
            {/* Raised Brow */}
            <path d="M 45 49 Q 50 46 55 49" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            <path d="M 67 47 Q 72 43 77 48" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            {/* Little Thoughtful 'O' Mouth */}
            <ellipse cx="60" cy="73" rx="3.5" ry="4.5" fill="#1E293B" />
          </>
        ) : (
          <>
            {/* Friendly Round Eyes */}
            <circle cx="49" cy="58" r="4.5" fill="#1E293B" />
            <circle cx="47.5" cy="56" r="1.8" fill="#FFFFFF" />
            <circle cx="71" cy="58" r="4.5" fill="#1E293B" />
            <circle cx="69.5" cy="56" r="1.8" fill="#FFFFFF" />
            {/* Warm Friendly Smile */}
            <path d="M 51 70 Q 60 78 69 70" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {/* Conductor Visor Cap */}
        <path
          d="M 30 46 C 30 24, 90 24, 90 46 Z"
          fill="url(#capGrad)"
        />
        {/* Cap Red Brim / Visor */}
        <path
          d="M 25 46 Q 60 38 95 46 Q 60 54 25 46 Z"
          fill="url(#visorGrad)"
          stroke="#7F1D1D"
          strokeWidth="1.5"
        />
        {/* Gold Emblem Button */}
        <circle cx="60" cy="38" r="6" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
        <path d="M 57 38 L 63 38 M 60 35 L 60 41" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
