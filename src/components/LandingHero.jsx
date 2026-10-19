import React from 'react';
import { Apple, Smartphone, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import PhoneSimulator from './PhoneSimulator';
import { APP_NAME } from '../config/appConfig';

export default function LandingHero({ content, streak, onLaunchWebApp }) {
  return (
    <section className="relative pt-6 pb-20 overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              <span>Metro-Level Immersion · 實用廣東話</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Learn Cantonese <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-rose-500 to-amber-500">wall by wall.</span>
            </h1>

            {/* Original copy */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              <span className="font-serif font-bold text-slate-900 dark:text-white text-lg mr-2">
                每站一面牆，步步學廣東話。
              </span>
              {APP_NAME} turns your Cantonese practice into distinct station-level tiles:
              distinct mosaic aesthetics, precise Jyutping, 6-tone pitch training, magnetic sentence assembly, and on-device spaced repetition.
            </p>

            {/* Store Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              
              {/* Apple Store Button */}
              <a
                href="#download"
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold hover:opacity-90 transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <Apple className="w-6 h-6 fill-current" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider font-semibold opacity-70 leading-tight">
                    Download on the
                  </div>
                  <div className="text-base font-extrabold leading-tight">App Store</div>
                </div>
              </a>

              {/* Google Play Button */}
              <a
                href="#download"
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border border-slate-300 dark:border-slate-800 hover:border-brand-500/40 transition-all shadow-sm hover:scale-105 active:scale-95"
              >
                <Smartphone className="w-6 h-6 text-brand-500" />
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-zinc-400 leading-tight">
                    Get it on
                  </div>
                  <div className="text-base font-extrabold leading-tight">Google Play</div>
                </div>
              </a>

            </div>

            {/* Quick Proof Pills */}
            <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-slate-500 dark:text-zinc-400 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="text-brand-500">🚇</span>
                <span>Metro Mosaic Levels</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500">🎯</span>
                <span>6 Tones Mastered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-500">🧠</span>
                <span>SM-2 Memory Retention</span>
              </div>
            </div>

            {/* Web App Access Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onLaunchWebApp}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-mtr-red/10 hover:bg-mtr-red/15 border border-mtr-red/30 text-mtr-red dark:text-red-400 font-bold text-xs transition-all active:scale-95 shadow-xs"
              >
                <span>🚀 Launch Web Practice App Directly</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Right Column: Phone Stage */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm">
              <PhoneSimulator content={content} streak={streak} />
            </div>
            
            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Interactive Live Preview — Try sounds and drills above</span>
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
