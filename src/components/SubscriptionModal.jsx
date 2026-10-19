import React, { useEffect, useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, Zap, RotateCcw, CreditCard } from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';
import { hapticsService } from '../services/hapticsService';

export default function SubscriptionModal({ isOpen, onClose, onUpgraded }) {
  const [billingCycle, setBillingCycle] = useState('annual'); // 'annual' | 'monthly'
  const [isProcessing, setIsProcessing] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    hapticsService.tapMedium();
    setIsProcessing(true);
    setTimeout(() => {
      subscriptionService.upgradeToPro(billingCycle);
      setIsProcessing(false);
      if (onUpgraded) onUpgraded();
      onClose();
    }, 600);
  };

  const handleRestore = () => {
    hapticsService.tapLight();
    const res = subscriptionService.restorePurchases();
    setRestoreMessage(res.message);
    if (res.success && onUpgraded) {
      onUpgraded();
    }
    setTimeout(() => setRestoreMessage(null), 4000);
  };

  const handleDismiss = () => {
    hapticsService.tapLight();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in"
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Unlock Hong Kong Pro Pass"
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-subway-surface border border-slate-200 dark:border-subway-border rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Rivets */}
        <span className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-white/40 border border-black/40 z-20 shadow-xs" />
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-white/40 border border-black/40 z-20 shadow-xs" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Vibrant Hong Kong Hero Banner */}
        <div className="p-6 sm:p-7 bg-gradient-to-br from-mtr-red via-rose-600 to-amber-600 text-white relative overflow-hidden text-center">
          {/* Holographic light sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 border border-white/30 text-amber-200 text-xs font-mono font-bold uppercase tracking-wider mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Hong Kong Pro Pass · 八達通尊尚通行證</span>
          </div>

          <h3 className="font-serif font-black text-2xl sm:text-3xl tracking-wide">
            Unlimited Cantonese Mastery
          </h3>
          <p className="text-xs text-white/90 max-w-xs mx-auto mt-1 leading-relaxed">
            Frictionless learning. Zero ads, unlimited Gemini Sifu AI tutoring, and deep real-world street situational survival labs.
          </p>
        </div>

        {/* Feature List */}
        <div className="p-6 space-y-4">
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                <strong>100% Ad-Free Commuting</strong> across all stations & offline dictionary
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                <strong>Unlimited Gemini 2.5 Sifu AI</strong> situational insights & roleplay drills
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                <strong>All Deep Street Situational Labs</strong> (Cha Chaan Teng, Wet Market, Transit)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                <strong>Offline High-Fidelity Audio Caching</strong> for airplane mode
              </span>
            </div>
          </div>

          {/* Pricing Toggle */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            
            {/* Annual Pass Card */}
            <button
              type="button"
              onClick={() => {
                hapticsService.tapLight();
                setBillingCycle('annual');
              }}
              className={`tile-btn p-3.5 rounded-2xl border-2 text-left relative transition-all ${
                billingCycle === 'annual'
                  ? 'border-mtr-red bg-mtr-red/10 dark:bg-mtr-red/15 shadow-md shadow-mtr-red/10 scale-[1.02]'
                  : 'border-slate-200 dark:border-subway-border bg-slate-50 dark:bg-subway-card text-slate-500'
              }`}
            >
              <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono text-[9px] font-black uppercase tracking-wider shadow-sm">
                Save 48%
              </span>
              <div className="font-bold text-xs text-slate-900 dark:text-white">Annual Pass</div>
              <div className="font-serif font-black text-lg text-mtr-red dark:text-red-400 my-0.5">
                $49.99 <span className="text-xs font-normal text-slate-500 font-sans">/ yr</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">$4.16 / month</div>
            </button>

            {/* Monthly Pass Card */}
            <button
              type="button"
              onClick={() => {
                hapticsService.tapLight();
                setBillingCycle('monthly');
              }}
              className={`tile-btn p-3.5 rounded-2xl border-2 text-left transition-all ${
                billingCycle === 'monthly'
                  ? 'border-mtr-red bg-mtr-red/10 dark:bg-mtr-red/15 shadow-md shadow-mtr-red/10 scale-[1.02]'
                  : 'border-slate-200 dark:border-subway-border bg-slate-50 dark:bg-subway-card text-slate-500'
              }`}
            >
              <div className="font-bold text-xs text-slate-900 dark:text-white">Monthly Pass</div>
              <div className="font-serif font-black text-lg text-slate-900 dark:text-white my-0.5">
                $7.99 <span className="text-xs font-normal text-slate-500 font-sans">/ mo</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Cancel anytime</div>
            </button>

          </div>

          {restoreMessage && (
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-subway-card text-xs text-center font-mono text-slate-700 dark:text-slate-300">
              {restoreMessage}
            </div>
          )}

          {/* Upgrade Action Button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSubscribe}
            className="tile-btn w-full py-4 px-6 rounded-2xl bg-mtr-red hover:bg-mtr-red/90 text-white font-bold text-sm shadow-xl shadow-mtr-red/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>{isProcessing ? 'Activating Pass...' : 'Unlock Hong Kong Pro Pass'}</span>
          </button>

          {/* Restore & Store Terms */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1">
            <button
              type="button"
              onClick={handleRestore}
              className="hover:underline hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              Restore Purchases
            </button>
            <span>Terms of Service · Privacy</span>
          </div>
        </div>

      </div>
    </div>
  );
}
