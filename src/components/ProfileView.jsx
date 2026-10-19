import React, { useState } from 'react';
import { User, Flame, Zap, Award, ShieldCheck, Sparkles, CheckCircle2, ChevronRight, Volume2, AlertCircle, Calendar, Gift } from 'lucide-react';
import { habitEngine, CULTURAL_CARDS_DATA } from '../services/habitEngine';
import { subscriptionService } from '../services/subscriptionService';
import { useSessionStore } from '../store/sessionStore';
import MistakeBankModal from './MistakeBankModal';
import CulturalCardModal from './CulturalCardModal';
import SubscriptionModal from './SubscriptionModal';
import { triggerConfetti } from '../utils/confetti';

export default function ProfileView({ streak = 0, xp = 0, onAddXp, onLaunchRemediation }) {
  const [habitState, setHabitState] = useState(() => habitEngine.getState());
  const [isMistakeModalOpen, setIsMistakeModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isPro, setIsPro] = useState(() => subscriptionService.isPro());
  const [selectedCard, setSelectedCard] = useState(null);
  const [bonusClaimedNotice, setBonusClaimedNotice] = useState(false);

  const mistakeBank = useSessionStore((state) => state.mistakeBank);

  const currentLevel = Math.floor(xp / 100) + 1;
  const progressToNextLevel = xp % 100;
  const commuterTitle = habitEngine.getCommuterTitle(xp);
  const weeklyCalendar = habitEngine.getWeeklyCalendar();
  const quests = habitEngine.getQuestsStatus();
  const allQuestsDone = habitEngine.areAllQuestsCompleted();
  const hasClaimedToday = habitState.quests?.claimedBonus;

  const handleClaimBonus = () => {
    const res = habitEngine.claimDailyBonus();
    if (res.success) {
      triggerConfetti();
      if (onAddXp) onAddXp(res.xpAdded);
      setHabitState({ ...habitEngine.getState() });
      setBonusClaimedNotice(true);
      setTimeout(() => setBonusClaimedNotice(false), 4000);
    }
  };

  const unlockedIds = new Set(habitState.unlockedCardIds || []);

  return (
    <div className="space-y-5 pb-20 animate-fade-in">
      
      {/* ─────────────────────────────────────────────────────────────
          1. AUTHENTIC HONG KONG OCTOPUS PASS (八達通)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#1c2230] via-[#151a26] to-[#0d1017] text-white shadow-2xl border border-white/15 overflow-hidden transition-all duration-300 hover:shadow-glow-red group">
        
        {/* Holographic Security Sheen & Ambient Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/20 via-rose-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Octopus Intersecting Dynamic Arcs */}
        <div className="absolute top-3 right-6 flex items-center gap-1.5 opacity-80">
          <svg className="w-9 h-6" viewBox="0 0 36 24" fill="none">
            <path d="M 6 12 C 6 6, 18 6, 18 12 C 18 18, 30 18, 30 12" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" />
            <path d="M 6 12 C 6 18, 18 18, 18 12 C 18 6, 30 6, 30 12" stroke="#E2231A" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="font-serif font-black text-sm tracking-widest text-amber-200">
            八達通
          </span>
        </div>

        {/* Card Header Content */}
        <div className="flex items-start gap-4 relative z-10">
          {/* Smart Chip Graphic */}
          <div className="w-12 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-200 shadow-md p-1.5 flex flex-col justify-between shrink-0">
            <div className="w-full h-1 bg-amber-700/40 rounded-xs" />
            <div className="flex justify-between">
              <div className="w-2.5 h-3 border border-amber-700/40 rounded-xs" />
              <div className="w-2.5 h-3 border border-amber-700/40 rounded-xs" />
            </div>
            <div className="w-full h-1 bg-amber-700/40 rounded-xs" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-black text-xl text-white truncate">
                {commuterTitle.title}
              </h2>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-mtr-red text-white font-black uppercase tracking-wider shadow-xs shrink-0">
                Level {currentLevel}
              </span>
            </div>
            <div className="text-xs text-amber-300 font-mono font-bold mt-0.5">
              {commuterTitle.subtitle} · {commuterTitle.badge}
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wider mt-1">
              Card: HK-852-{xp}-99 · MTR Transit Pass
            </p>
          </div>
        </div>

        {/* Level XP Progress Bar with Subway Station Stops Indicator */}
        <div className="mt-5 pt-3.5 border-t border-white/10 relative z-10">
          <div className="flex justify-between text-xs font-mono mb-2">
            <span className="text-slate-200 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-teal-400 text-teal-400" />
              <span>{xp} Total Commuter XP</span>
            </span>
            <span className="text-teal-300 font-bold">
              {progressToNextLevel}/100 XP to Level {currentLevel + 1}
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden p-0.5 border border-white/15 shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-400 transition-all duration-700 shadow-sm"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. WEEKLY COMMUTER CALENDAR & STREAK CONSISTENCY
          ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl sm:rounded-3xl p-5 bg-white dark:bg-subway-surface border border-slate-200 dark:border-subway-border shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-mtr-red" />
            <h3 className="font-serif font-black text-base text-slate-900 dark:text-white">
              Weekly Commuter Schedule
            </h3>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold">
            <Flame className="w-4 h-4 fill-current text-amber-500" />
            <span>{streak} Day Streak</span>
          </div>
        </div>

        {/* 7-Day Bubble Row */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1 text-center">
          {weeklyCalendar.map((d) => (
            <div
              key={d.dateKey}
              className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                d.isCompleted
                  ? 'bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                  : d.isToday
                  ? 'bg-amber-500/10 border-2 border-amber-500 text-amber-600 dark:text-amber-400 font-bold animate-pulse'
                  : 'bg-slate-50 dark:bg-subway-card border border-slate-200 dark:border-subway-border text-slate-400'
              }`}
            >
              <span className="text-[10px] font-mono uppercase font-bold">{d.dayName}</span>
              <div className="my-1">
                {d.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : d.isToday ? (
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                ) : (
                  <span className="text-xs font-mono">{d.dayNumber}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. THREE-TIER DAILY COMMUTER QUESTS
          ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl sm:rounded-3xl p-5 bg-white dark:bg-subway-surface border border-slate-200 dark:border-subway-border shadow-md space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Today's Commuter Quests</span>
          </h3>
          {hasClaimedToday ? (
            <span className="text-xs font-mono text-slate-400 font-bold">
              ✓ BONUS CLAIMED
            </span>
          ) : allQuestsDone ? (
            <button
              type="button"
              onClick={handleClaimBonus}
              className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-mono text-xs font-bold shadow-md hover:bg-emerald-600 active:scale-95 transition-all flex items-center gap-1 animate-bounce-slow"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>CLAIM +50 XP</span>
            </button>
          ) : (
            <span className="text-xs font-mono text-amber-500 font-bold">
              +50 XP BONUS WAITING
            </span>
          )}
        </div>

        {bonusClaimedNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center animate-fade-in">
            🎉 +50 XP Bonus Added to Octopus Card!
          </div>
        )}

        {/* Quests List */}
        <div className="space-y-2.5 text-xs">
          {quests.map((q) => (
            <div
              key={q.id}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-subway-card border border-slate-200/60 dark:border-subway-border/60 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-lg">{q.icon}</span>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {q.title}
                  </div>
                  {/* Mini Progress Bar */}
                  <div className="w-32 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-1 overflow-hidden">
                    <div
                      className="h-full bg-mtr-red rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (q.current / q.target) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                  {q.current} / {q.target}
                </span>
                {q.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MISTAKE BANK (TARGETED REMEDIATION)
          ───────────────────────────────────────────────────────────── */}
      <div
        onClick={() => setIsMistakeModalOpen(true)}
        className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-red-950/40 to-slate-900/60 border border-red-500/30 hover:border-red-500/60 transition-all cursor-pointer shadow-md flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-serif font-black text-base text-slate-900 dark:text-white">
                Mistake Bank · 錯題庫
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-500 border border-red-500/30">
                {mistakeBank.length} Items
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {mistakeBank.length > 0
                ? 'Review your slips with targeted spaced repetition'
                : 'All station slips cleared! Zero active mistakes'}
            </p>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-mtr-red transition-colors shrink-0" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. CULTURAL ENAMEL CARDS VAULT
          ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl sm:rounded-3xl p-5 bg-white dark:bg-subway-surface border border-slate-200 dark:border-subway-border shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-mtr-red" />
            <span>Heritage Enamel Cards Vault</span>
          </h3>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {unlockedIds.size} / {CULTURAL_CARDS_DATA.length} UNLOCKED
          </span>
        </div>

        {/* 8-Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {CULTURAL_CARDS_DATA.map((card) => {
            const isUnlocked = unlockedIds.has(card.id);

            return (
              <div
                key={card.id}
                onClick={() => setSelectedCard({ ...card, unlocked: isUnlocked })}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer active:scale-95 ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-white to-slate-50 dark:from-subway-card dark:to-subway-surface border-slate-300 dark:border-subway-border hover:border-mtr-red shadow-sm hover:shadow-md'
                    : 'bg-slate-100 dark:bg-subway-card/30 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="text-3xl mb-1">{card.icon}</div>
                <div className="font-serif font-bold text-xs text-slate-900 dark:text-white truncate">
                  {card.chinese}
                </div>
                <div className="font-mono text-[10px] text-mtr-red dark:text-red-400 truncate">
                  {card.jyutping}
                </div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5">
                  {card.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Frictionless Pro Upgrade Banner */}
      <div className="rounded-2xl sm:rounded-3xl p-5 bg-gradient-to-r from-mtr-red to-rose-700 text-white shadow-xl flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider font-bold mb-1 opacity-90">
            <Sparkles className="w-4 h-4" />
            <span>{isPro ? 'HONG KONG PRO PASS ACTIVE' : 'HONG KONG PRO PASS'}</span>
          </div>
          <h4 className="font-serif font-black text-lg sm:text-xl">
            {isPro ? 'All Premium Benefits Unlocked' : 'Ad-Free Commuting + Unlimited Sifu AI'}
          </h4>
          <p className="text-xs text-white/80 max-w-sm mt-0.5">
            {isPro
              ? 'Enjoy zero ads, unlimited Gemini 2.5 Flash lesson generations, and full situational labs.'
              : 'Remove all ads and unlock unlimited real-world situational roleplay simulations.'}
          </p>
        </div>

        {!isPro && (
          <button
            type="button"
            onClick={() => setIsSubModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shrink-0 shadow-lg hover:bg-slate-100 active:scale-95 transition-all"
          >
            Explore Pro
          </button>
        )}
      </div>

      {/* Modals */}
      <MistakeBankModal
        isOpen={isMistakeModalOpen}
        onClose={() => setIsMistakeModalOpen(false)}
        onLaunchRemediation={onLaunchRemediation}
      />

      <CulturalCardModal
        card={selectedCard}
        isOpen={Boolean(selectedCard)}
        onClose={() => setSelectedCard(null)}
      />

      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        onUpgraded={() => setIsPro(subscriptionService.isPro())}
      />

    </div>
  );
}
