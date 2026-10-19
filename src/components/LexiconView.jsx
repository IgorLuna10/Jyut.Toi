import React, { useState, useEffect, useRef } from 'react';
import { Search, Volume2, BookOpen, Sparkles, Filter, X, Copy, Check, Hash } from 'lucide-react';
import { dictionaryEngine } from '../services/dictionaryEngine';
import { speechEngine } from '../services/speechEngine';
import { hapticsService } from '../services/hapticsService';

export default function LexiconView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filterColloquial, setFilterColloquial] = useState(false);
  const [activeToneFilter, setActiveToneFilter] = useState(null); // null or 1-6
  const [copiedId, setCopiedId] = useState(null);
  const [playingHanzi, setPlayingHanzi] = useState(null);
  const searchTimeoutRef = useRef(null);

  // Initialize dictionary on mount
  useEffect(() => {
    dictionaryEngine.load().then(() => {
      setIsLoaded(true);
      // Default initial entries (Hong Kong essentials)
      setResults(dictionaryEngine.search('食', { limit: 24 }));
    });

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const executeSearch = (text, isColloquial = filterColloquial, tone = activeToneFilter) => {
    let term = (text || '').trim();
    if (!term) term = '食';
    
    let found = dictionaryEngine.search(term, { limit: 40, filterColloquial: isColloquial });
    if (tone) {
      found = found.filter(item => {
        if (!item.jyutping) return false;
        return item.jyutping.includes(String(tone));
      });
    }
    setResults(found);
  };

  const handleInputChange = (text) => {
    setQuery(text);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      executeSearch(text, filterColloquial, activeToneFilter);
    }, 150);
  };

  const handleClear = () => {
    setQuery('');
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    executeSearch('', filterColloquial, activeToneFilter);
  };

  const handleToggleColloquial = () => {
    hapticsService.tapLight();
    const next = !filterColloquial;
    setFilterColloquial(next);
    executeSearch(query, next, activeToneFilter);
  };

  const handleToneFilterClick = (toneNum) => {
    hapticsService.tapLight();
    const nextTone = activeToneFilter === toneNum ? null : toneNum;
    setActiveToneFilter(nextTone);
    executeSearch(query, filterColloquial, nextTone);
  };

  const playAudio = (text) => {
    hapticsService.tapLight();
    setPlayingHanzi(text);
    speechEngine.speak(text);
    setTimeout(() => setPlayingHanzi(null), 1000);
  };

  const copyJyutping = (item) => {
    hapticsService.tapLight();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(`${item.hanzi} (${item.jyutping}) - ${item.english}`);
      setCopiedId(item.id || item.hanzi);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-4 pb-20 select-none animate-fade-in">
      
      {/* Search Header Banner */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-subway-surface via-subway-card to-[#0d101a] border border-subway-border text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-mtr-teal/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-mtr-teal/20 border border-mtr-teal/40 text-teal-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl tracking-wide">
                CC-Canto Lexicon · 辭典
              </h2>
              <span className="text-[10px] font-mono text-teal-300 font-semibold uppercase tracking-wider">
                {isLoaded ? '25,400+ Offline Cantonese Words' : 'Indexing Lexicon...'}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed relative z-10">
          Instant offline lookup by Traditional Hanzi characters, Jyutping romanization (with or without tone numbers), or English definitions.
        </p>

        {/* Search Field */}
        <div className="relative mt-4 z-10">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Search 'sik', 'dim2', 'tea', '奶茶', '唔該'..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/10 focus:bg-white/15 border border-white/20 focus:border-mtr-teal text-white placeholder-slate-400 text-sm outline-none transition-all font-sans shadow-inner"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-white"
              aria-label="Clear Search Input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Badges & Quick Categories */}
        <div className="flex items-center gap-2 mt-3.5 text-xs overflow-x-auto no-scrollbar pb-1 z-10 relative">
          <button
            type="button"
            onClick={handleToggleColloquial}
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-semibold transition-all shrink-0 active:scale-95 ${
              filterColloquial
                ? 'bg-cct-amber text-slate-900 border-cct-amber font-bold shadow-glow-amber'
                : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/15'
            }`}
          >
            🔥 HK Colloquial Slang
          </button>
          <button
            type="button"
            onClick={() => handleSearch('dim sum')}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/20 text-slate-300 hover:bg-white/15 shrink-0 active:scale-95 transition-all"
          >
            Dim Sum (點心)
          </button>
          <button
            type="button"
            onClick={() => handleSearch('tea')}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/20 text-slate-300 hover:bg-white/15 shrink-0 active:scale-95 transition-all"
          >
            Tea (茶)
          </button>
          <button
            type="button"
            onClick={() => handleSearch('station')}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/20 text-slate-300 hover:bg-white/15 shrink-0 active:scale-95 transition-all"
          >
            MTR Transit (站)
          </button>
        </div>

        {/* Tone 1-6 Quick Selector */}
        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/10 z-10 relative">
          <span className="text-[10px] font-mono uppercase text-slate-400 mr-1">Filter Tone:</span>
          {[1, 2, 3, 4, 5, 6].map((t) => (
            <button
              key={`tone_filter_${t}`}
              type="button"
              onClick={() => handleToneFilterClick(t)}
              className={`w-7 h-6 rounded-lg text-[10px] font-mono font-bold transition-all active:scale-90 ${
                activeToneFilter === t
                  ? 'bg-mtr-teal text-white shadow-glow-teal ring-2 ring-white/50'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              T{t}
            </button>
          ))}
          {activeToneFilter && (
            <button
              type="button"
              onClick={() => handleToneFilterClick(activeToneFilter)}
              className="text-[10px] font-mono text-slate-400 hover:text-white underline ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Meta */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
        <span>Found {results.length} vocabulary entries</span>
        <span className="text-[11px] opacity-75">Sub-5ms Indexed Trie</span>
      </div>

      {/* Results Bento List */}
      <div className="space-y-3">
        {results.map((item, idx) => {
          const isSlang = item.english && (
            /\[(colloquial|slang|cantonese|informal|loanword|idiom)\]/i.test(item.english) ||
            /\b(colloquial|slang)\b/i.test(item.english)
          );
          const isPlaying = playingHanzi === item.hanzi;
          const isCopied = copiedId === (item.id || item.hanzi);

          return (
            <div
              key={item.id || idx}
              onClick={() => playAudio(item.hanzi)}
              className="p-4 rounded-2xl bg-white dark:bg-subway-surface border border-slate-200 dark:border-subway-border hover:border-mtr-red/60 dark:hover:border-mtr-red/60 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-98"
            >
              <div className="min-w-0 flex-1">
                {/* Traditional Hanzi + Slang Badge */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide">
                    {item.hanzi}
                  </span>
                  {isSlang && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      HK SLANG
                    </span>
                  )}
                </div>

                {/* Jyutping with Tone Digits */}
                <div className="font-mono text-xs sm:text-sm font-bold text-mtr-red dark:text-red-400 mb-1">
                  {item.jyutping}
                </div>

                {/* English Definition */}
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {item.english}
                </div>
              </div>

              {/* Action Buttons: Copy & Audio */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyJyutping(item);
                  }}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-subway-card hover:bg-slate-200 dark:hover:bg-subway-card-hover text-slate-600 dark:text-slate-400 transition-colors"
                  title="Copy word & Jyutping"
                  aria-label="Copy to clipboard"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(item.hanzi);
                  }}
                  className={`p-2.5 rounded-xl transition-all ${
                    isPlaying
                      ? 'bg-mtr-red text-white shadow-glow-sm'
                      : 'bg-slate-100 dark:bg-subway-card group-hover:bg-mtr-red group-hover:text-white text-slate-600 dark:text-slate-300'
                  }`}
                  title="Play native Cantonese audio"
                  aria-label={`Pronounce ${item.hanzi}`}
                >
                  <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}

        {results.length === 0 && (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm bg-white dark:bg-subway-surface rounded-3xl border border-slate-200 dark:border-subway-border p-8">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="font-bold text-slate-700 dark:text-slate-300">No entries found for "{query}"</p>
            <p className="text-xs mt-1 text-slate-400">Try searching with Jyutping syllables without tones, or simple English keywords.</p>
          </div>
        )}
      </div>

    </div>
  );
}
