import React from 'react';
import { Compass, Volume2, Layers, Brain, MessageSquare, ShieldCheck, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { APP_NAME } from '../config/appConfig';

const MTR_LINES = [
  { name: 'Tsuen Wan Line', code: 'TWL', color: '#C8231F' },
  { name: 'Island Line', code: 'ISL', color: '#0076BE' },
  { name: 'Kwun Tong Line', code: 'KTL', color: '#00A040' },
  { name: 'Tseung Kwan O Line', code: 'TKL', color: '#A35EB5' },
  { name: 'Tung Chung Line', code: 'TCL', color: '#F7943E' },
];

export default function FeatureGrid() {
  return (
    <section className="py-24 border-t border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden" id="features">
      {/* Subtle ambient station lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-mtr-red/5 dark:bg-mtr-red/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mtr-red/10 dark:bg-mtr-red/20 border border-mtr-red/20 text-mtr-red dark:text-red-400 text-xs font-mono font-bold uppercase tracking-widest mb-3">
            <span className="w-2 h-2 rounded-full bg-mtr-red animate-pulse" />
            <span>Station Architecture · 香港地鐵站牌設計系統</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-serif">
            Cantonese Mastered Through Hong Kong's Living Fabric.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Step onto the platform. {APP_NAME} turns everyday Hong Kong transit, cha chaan teng tea diner slang, and 6-tone acoustics into an intuitive daily study ritual.
          </p>
        </div>

        {/* Asymmetric Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* BENTO CARD 1: STATION MOSAIC PROGRESSION (Span 2) */}
          <div className="md:col-span-2 group relative p-7 sm:p-9 rounded-3xl bg-white/90 dark:bg-subway-surface/90 border border-slate-200/90 dark:border-subway-border hover:border-mtr-red/50 shadow-lg hover:shadow-2xl hover:shadow-mtr-red/10 transition-all duration-300 backdrop-blur-md overflow-hidden flex flex-col justify-between">
            {/* Corner Enamel Screws */}
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-3 rounded-2xl bg-mtr-red/10 text-mtr-red dark:text-red-400 font-bold">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-mtr-red dark:text-red-400 block">
                      STATION-THEMED MAP
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      24 Enameled Platform Levels
                    </span>
                  </div>
                </div>

                <span className="text-3xl font-mono font-black text-slate-200 dark:text-slate-800">
                  01
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white tracking-wide mb-3">
                Station Mosaic Levels & Enameled Lettering Plates
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Every station along the Tsuen Wan, Island, and Kwun Tong lines has its own distinct glazed ceramic tile color and cut-out calligraphy plate. Advance stop by stop, from Central (中環) through Mong Kok (旺角) to Tsim Sha Tsui (尖沙咀).
              </p>
            </div>

            {/* Visual Station Plate Preview Badges */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-subway-border/60 flex flex-wrap items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-mtr-red text-white font-serif font-black text-sm shadow-md flex items-center gap-2">
                <span>中環</span>
                <span className="font-mono text-[10px] font-normal opacity-80">Central</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[#0076BE] text-white font-serif font-black text-sm shadow-md flex items-center gap-2">
                <span>金鐘</span>
                <span className="font-mono text-[10px] font-normal opacity-80">Admiralty</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[#800080] text-white font-serif font-black text-sm shadow-md flex items-center gap-2">
                <span>尖沙咀</span>
                <span className="font-mono text-[10px] font-normal opacity-80">Tsim Sha Tsui</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[#00A040] text-white font-serif font-black text-sm shadow-md flex items-center gap-2">
                <span>旺角</span>
                <span className="font-mono text-[10px] font-normal opacity-80">Mong Kok</span>
              </div>
            </div>
          </div>

          {/* BENTO CARD 2: 6 TONES AUDIO LAB (Span 1) */}
          <div className="group relative p-7 sm:p-8 rounded-3xl bg-white/90 dark:bg-subway-surface/90 border border-slate-200/90 dark:border-subway-border hover:border-amber-500/50 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 backdrop-blur-md flex flex-col justify-between">
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 font-bold">
                  <Volume2 className="w-6 h-6" />
                </div>
                <span className="text-3xl font-mono font-black text-slate-200 dark:text-slate-800">
                  02
                </span>
              </div>

              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
                PITCH CONTOUR EAR DRILLS
              </span>

              <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white mb-2">
                6-Tone Sound Studio
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Train your auditory reflexes on the Chao 5-point pitch scale (55, 25, 33, 21, 23, 22). Master minimal pairs like <span className="font-serif font-bold text-slate-900 dark:text-white">詩 · 史 · 試 · 時 · 市 · 事</span> without confusing tones.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-subway-border/60 flex items-center justify-between font-mono text-xs text-amber-600 dark:text-amber-400">
              <span className="font-bold">6 Contours</span>
              <span className="text-[11px] text-slate-400">Yin & Yang Registers</span>
            </div>
          </div>

          {/* BENTO CARD 3: TACTILE SENTENCE SYNTHESIS (Span 1) */}
          <div className="group relative p-7 sm:p-8 rounded-3xl bg-white/90 dark:bg-subway-surface/90 border border-slate-200/90 dark:border-subway-border hover:border-emerald-500/50 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 backdrop-blur-md flex flex-col justify-between">
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-bold">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-3xl font-mono font-black text-slate-200 dark:text-slate-800">
                  03
                </span>
              </div>

              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block mb-1">
                TACTILE MAHJONG TILES
              </span>

              <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white mb-2">
                Sentence Synthesis
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Slot together natural Cantonese grammar using magnetic tactile character blocks. Master pivotal sentence-ending aspect particles like 咗 (zo2), 緊 (gan2), and 喇 (laa3).
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-subway-border/60 flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs border border-emerald-500/20">
                唔該
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs border border-emerald-500/20">
                一杯
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs border border-emerald-500/20">
                凍檸茶
              </span>
            </div>
          </div>

          {/* BENTO CARD 4: REAL-WORLD STREET LABS (Span 2) */}
          <div className="md:col-span-2 group relative p-7 sm:p-9 rounded-3xl bg-white/90 dark:bg-subway-surface/90 border border-slate-200/90 dark:border-subway-border hover:border-purple-500/50 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-md overflow-hidden flex flex-col justify-between">
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 dark:text-purple-400 font-bold">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 block">
                      IMMERSIVE SCENARIO SIMULATOR
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Cha Chaan Teng · Wet Markets · Red Minibuses
                    </span>
                  </div>
                </div>

                <span className="text-3xl font-mono font-black text-slate-200 dark:text-slate-800">
                  04
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white tracking-wide mb-3">
                Authentic Colloquial Hong Kong Street Labs
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Real Cantonese is never spoken like a textbook. Learn how to shout your stop on a 16-seat public light bus (有落!), order condensed milk butter toast (奶油多) at Australia Dairy Company, and haggle for fresh choy sum at the wet market with live ambient soundscapes.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-subway-border/60 flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-subway-card border border-slate-200 dark:border-subway-border text-slate-700 dark:text-slate-300 font-serif">
                茶餐廳 凍檸茶走甜
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-subway-card border border-slate-200 dark:border-subway-border text-slate-700 dark:text-slate-300 font-serif">
                街市 幾多錢一斤？
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-subway-card border border-slate-200 dark:border-subway-border text-slate-700 dark:text-slate-300 font-serif">
                小巴 前面有落唔該！
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-subway-card border border-slate-200 dark:border-subway-border text-slate-700 dark:text-slate-300 font-serif">
                點心 唔該攞張枱兩位
              </span>
            </div>
          </div>

          {/* BENTO CARD 5: SM-2 SPACED REPETITION (Span 1) */}
          <div className="group relative p-7 sm:p-8 rounded-3xl bg-white/90 dark:bg-subway-surface/90 border border-slate-200/90 dark:border-subway-border hover:border-sky-500/50 shadow-lg hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 backdrop-blur-md flex flex-col justify-between">
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500 dark:text-sky-400 font-bold">
                  <Brain className="w-6 h-6" />
                </div>
                <span className="text-3xl font-mono font-black text-slate-200 dark:text-slate-800">
                  05
                </span>
              </div>

              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 block mb-1">
                ON-DEVICE MEMORY ENGINE
              </span>

              <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white mb-2">
                SM-2 Spaced Repetition
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                The smart repetition scheduler tracks interval decay and schedules reviews right at the critical point of forgetting, making daily 5-minute drills permanently stick.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-subway-border/60 flex items-center justify-between text-xs text-sky-600 dark:text-sky-400 font-mono font-bold">
              <span>SuperMemo-2</span>
              <span className="text-slate-400 text-[11px]">Dynamic Intervals</span>
            </div>
          </div>

          {/* BENTO CARD 6: HONEST PROGRESS & LOCAL PRIVACY (Span 2) */}
          <div className="md:col-span-2 group relative p-7 sm:p-9 rounded-3xl bg-white/90 dark:bg-subway-surface/90 border border-slate-200/90 dark:border-subway-border hover:border-emerald-500/50 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 backdrop-blur-md overflow-hidden flex flex-col justify-between">
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
                      NO DARK PATTERNS
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Local-First · Zero Tracking · Honest Streaks
                    </span>
                  </div>
                </div>

                <span className="text-3xl font-mono font-black text-slate-200 dark:text-slate-800">
                  06
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white tracking-wide mb-3">
                Honest Learning Progress & 100% Offline Local Engine
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                No artificial heart penalties, no forced spam ads, and no background Wi-Fi or ringer surveillance. Your flashcard memory data and audio pronunciations live completely offline on your device.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-subway-border/60 flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-650 dark:text-emerald-400 font-bold">
                ✓ No forced interstitial ads
              </span>
              <span className="flex items-center gap-1.5 text-emerald-650 dark:text-emerald-400 font-bold">
                ✓ Airplane mode ready
              </span>
              <span className="flex items-center gap-1.5 text-emerald-650 dark:text-emerald-400 font-bold">
                ✓ Native iOS & Android
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
