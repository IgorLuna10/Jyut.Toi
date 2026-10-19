import React, { useState } from 'react';
import { Check, Sparkles, Shield, ArrowRight, Zap, CreditCard, Award } from 'lucide-react';
import { APP_NAME } from '../config/appConfig';
import { hapticsService } from '../services/hapticsService';

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState('annual'); // 'monthly' | 'annual'

  const handleToggleCycle = (cycle) => {
    hapticsService.tapLight();
    setBillingCycle(cycle);
  };

  return (
    <section className="py-24 border-t border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden" id="pricing">
      {/* Station platform background ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-mtr-red/5 dark:bg-mtr-red/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mtr-red/10 dark:bg-mtr-red/20 border border-mtr-red/20 text-mtr-red dark:text-red-400 text-xs font-mono font-bold uppercase tracking-widest mb-3">
            <span className="w-2 h-2 rounded-full bg-mtr-red animate-pulse" />
            <span>Hong Kong Commuter Passes · 車票與月票</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-serif">
            Honest Pricing. Unlimited Platform Access.
          </h2>

          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
            No forced ads, no heart-loss lockouts, and no predatory dark patterns. Core daily practice is always free.
          </p>

          {/* Tactile Billing Switcher */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-full bg-slate-200/80 dark:bg-subway-surface border border-slate-300 dark:border-subway-border shadow-inner">
            <button
              type="button"
              onClick={() => handleToggleCycle('monthly')}
              className={`tile-btn px-6 py-2 rounded-full text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-subway-card text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly Pass
            </button>
            <button
              type="button"
              onClick={() => handleToggleCycle('annual')}
              className={`tile-btn px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                billingCycle === 'annual'
                  ? 'bg-mtr-red text-white shadow-md shadow-mtr-red/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Annual Pass</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                Save 50%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* TIER 1: SINGLE JOURNEY TICKET (FREE) */}
          <div className="group relative p-8 rounded-3xl bg-white/90 dark:bg-subway-surface/90 border border-slate-200 dark:border-subway-border flex flex-col justify-between shadow-lg hover:shadow-xl transition-all backdrop-blur-md">
            {/* Corner rivets */}
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Single Journey · 單程票
                </span>
                <span className="text-xl">🎫</span>
              </div>

              <h3 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
                Standard Free
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Foundational vocabulary and daily essential Cantonese practice.
              </p>
              
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-mono font-black text-slate-900 dark:text-white">$0</span>
                <span className="text-xs font-mono text-slate-500">/ forever</span>
              </div>

              <ul className="mt-7 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Daily Word & Phrase rotation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Level 1 Essentials & starter exercises</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Daily tone drill practice rounds</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Basic offline Cantonese dictionary</span>
                </li>
              </ul>
            </div>

            <a
              href="#download"
              className="tile-btn mt-8 block text-center py-3 rounded-2xl border border-slate-300 dark:border-subway-border text-slate-800 dark:text-white font-bold text-xs hover:bg-slate-100 dark:hover:bg-subway-card transition-all"
            >
              Get Started Free
            </a>
          </div>

          {/* TIER 2: OCTOPUS PRO PASS (MOST POPULAR) */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-b from-[#141824] to-[#0A0D14] text-white border-2 border-mtr-red shadow-2xl shadow-mtr-red/20 flex flex-col justify-between transform md:-translate-y-2">
            {/* Top Enameled Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-mtr-red text-white text-[10px] font-mono font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg border border-red-400/40 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Octopus Pro Pass · 八達通通行證</span>
            </div>

            {/* Corner rivets */}
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-white/30 border border-black/40" />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-white/30 border border-black/40" />

            <div>
              <div className="flex items-center justify-between mb-4 mt-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                  Full Platform Pass
                </span>
                <span className="text-xl">💳</span>
              </div>

              <h3 className="text-2xl font-serif font-black text-white">
                Octopus Pro
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                For focused learners aiming for comprehensive fluency and audio precision.
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-mono font-black text-white">
                  {billingCycle === 'annual' ? '$29.99' : '$4.99'}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {billingCycle === 'annual' ? '/ year ($2.49/mo)' : '/ month'}
                </span>
              </div>
              <div className="text-[11px] font-mono text-red-400 font-bold mt-1">
                Includes 7-day free trial · Cancel anytime
              </div>

              <ul className="mt-7 space-y-3.5 text-xs text-zinc-200">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-mtr-red shrink-0" />
                  <span className="font-bold text-white">Unlimited Gemini 2.5 Sifu AI Insights</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-mtr-red shrink-0" />
                  <span>All 24 metro station levels unlocked</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-mtr-red shrink-0" />
                  <span>Spaced Repetition (SRS) memory scheduling</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-mtr-red shrink-0" />
                  <span>Street Labs (Cha Chaan Teng & Minibus)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-mtr-red shrink-0" />
                  <span>Full offline voice audio packs</span>
                </li>
              </ul>
            </div>

            <a
              href="#download"
              className="tile-btn mt-8 block text-center py-3.5 rounded-2xl bg-gradient-to-r from-mtr-red to-rose-600 text-white font-bold text-xs shadow-xl shadow-mtr-red/30 hover:brightness-110 transition-all"
            >
              Start 7-Day Free Trial
            </a>
          </div>

          {/* TIER 3: LIFETIME COMMEMORATIVE PASS */}
          <div className="group relative p-8 rounded-3xl bg-white/90 dark:bg-subway-surface/90 border border-slate-200 dark:border-subway-border flex flex-col justify-between shadow-lg hover:shadow-xl transition-all backdrop-blur-md">
            {/* Corner rivets */}
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 border border-black/30" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                  Golden Pass · 永久紀念車票
                </span>
                <span className="text-xl">🏆</span>
              </div>

              <h3 className="text-2xl font-serif font-black text-slate-900 dark:text-white">
                Lifetime Pass
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Single payment. Complete access to all current and future content forever.
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl font-mono font-black text-slate-900 dark:text-white">$69.99</span>
                <span className="text-xs font-mono text-slate-500">/ one-time</span>
              </div>

              <ul className="mt-7 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-bold">Everything in Octopus Pro forever</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>All upcoming transit line expansion levels</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Cross-platform entitlement (iOS & Android)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Direct priority developer support</span>
                </li>
              </ul>
            </div>

            <a
              href="#download"
              className="tile-btn mt-8 block text-center py-3 rounded-2xl border border-slate-300 dark:border-subway-border text-slate-800 dark:text-white font-bold text-xs hover:bg-slate-100 dark:hover:bg-subway-card transition-all"
            >
              Get Lifetime Access
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
