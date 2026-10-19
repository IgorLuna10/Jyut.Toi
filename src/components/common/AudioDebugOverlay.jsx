import React, { useState, useEffect } from 'react';

export default function AudioDebugOverlay() {
  const [lastPlayback, setLastPlayback] = useState(null);
  const [missingVoiceAlert, setMissingVoiceAlert] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const isDev = Boolean(import.meta.env.DEV || (typeof window !== 'undefined' && window.__DEBUG_AUDIO__));

  useEffect(() => {
    const handlePlayback = (e) => {
      setLastPlayback(e.detail);
    };

    const handleMissingVoice = (e) => {
      setMissingVoiceAlert(e.detail);
    };

    window.addEventListener('jyut_audio_playback', handlePlayback);
    window.addEventListener('jyut_missing_cantonese_voice', handleMissingVoice);

    return () => {
      window.removeEventListener('jyut_audio_playback', handlePlayback);
      window.removeEventListener('jyut_missing_cantonese_voice', handleMissingVoice);
    };
  }, []);

  return (
    <>
      {/* Missing Cantonese Voice Critical Notice */}
      {missingVoiceAlert && (
        <div
          role="alert"
          className="fixed top-3 left-3 right-3 z-50 p-4 bg-amber-500/95 dark:bg-amber-600/95 text-slate-950 font-sans rounded-2xl shadow-2xl backdrop-blur-md border border-amber-300 max-w-lg mx-auto transition-all animate-in fade-in slide-in-from-top-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>⚠️</span>
                <span>No Cantonese Voice Detected</span>
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-95">
                Your device lacks a Cantonese (Hong Kong) text-to-speech voice. Playback was blocked to prevent incorrect Mandarin pronunciation.
              </p>
              <div className="mt-2 text-[11px] bg-black/10 rounded-lg p-2 leading-normal">
                <strong>How to enable Cantonese voice:</strong>
                <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                  <li><strong>iOS:</strong> Settings &gt; Accessibility &gt; Spoken Content &gt; Voices &gt; Chinese &gt; Cantonese (Hong Kong).</li>
                  <li><strong>Android:</strong> Settings &gt; Accessibility &gt; Text-to-speech &gt; Google TTS &gt; Install Cantonese (zh-HK).</li>
                  <li><strong>Mac / Chrome:</strong> System Settings &gt; Accessibility &gt; Spoken Content &gt; Siri Voice (Cantonese) or Sinji.</li>
                </ul>
              </div>
            </div>
            <button
              onClick={() => setMissingVoiceAlert(null)}
              className="text-slate-900 hover:text-black font-bold p-1 rounded-md text-sm leading-none"
              aria-label="Dismiss warning"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Dev-only floating Audio Inspector Badge */}
      {isDev && lastPlayback && (
        <aside
          aria-label="Developer Cantonese Audio Inspector"
          className="fixed bottom-20 right-3 z-40 max-w-xs font-mono text-xs shadow-xl rounded-xl border border-slate-700/60 bg-slate-900/90 text-slate-200 backdrop-blur-md overflow-hidden transition-all"
        >
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full px-2.5 py-1.5 flex items-center justify-between gap-2 text-left bg-slate-800/80 hover:bg-slate-800 text-[11px] font-semibold tracking-wide text-emerald-400"
          >
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${lastPlayback.status === 'success' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <span>🔊 {lastPlayback.voice || 'No Voice'}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">[{lastPlayback.lang}]</span>
          </button>

          {expanded && (
            <div className="p-2.5 space-y-1.5 text-[11px] bg-slate-950/90 max-h-48 overflow-y-auto">
              <div className="text-slate-300">
                <span className="text-slate-500">Text: </span>
                <span className="font-sans font-bold text-amber-300">{lastPlayback.text}</span>
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500">Source: </span>
                <span>{lastPlayback.source}</span>
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500">Status: </span>
                <span className={lastPlayback.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}>
                  {lastPlayback.status}
                </span>
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500">Time: </span>
                <span>{lastPlayback.timestamp}</span>
              </div>
            </div>
          )}
        </aside>
      )}
    </>
  );
}
