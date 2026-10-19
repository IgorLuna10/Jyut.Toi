import React, { useState } from 'react';
import { Apple, Smartphone, QrCode, CheckCircle2, Send, ArrowRight } from 'lucide-react';
import { APP_NAME } from '../config/appConfig';

export default function DownloadCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleBetaSignup = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    // Persist email in local storage for developer reference
    try {
      const list = JSON.parse(localStorage.getItem('app-beta-signups') || '[]');
      list.push({ email, timestamp: new Date().toISOString() });
      localStorage.setItem('app-beta-signups', JSON.stringify(list));
    } catch (err) {}
  };

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden" id="download">
      {/* Background glow circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-2xl mb-2 inline-block">🇭🇰</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Start speaking authentic Cantonese today.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400">
            Available on iOS via TestFlight & App Store. Android version in active development.
          </p>
        </div>

        {/* Store Download Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          
          {/* Apple App Store Button */}
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-white text-slate-950 font-bold hover:bg-zinc-200 transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            <Apple className="w-8 h-8 fill-current" />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-650 leading-tight">
                Download on the
              </div>
              <div className="text-lg font-extrabold leading-tight">App Store</div>
            </div>
          </a>

          {/* Google Play Button */}
          <a
            href="#beta"
            className="flex items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-slate-800 text-white font-bold border border-slate-700 hover:border-brand-500/50 hover:bg-slate-750 transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            <Smartphone className="w-8 h-8 text-brand-400" />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 leading-tight">
                Coming Soon to
              </div>
              <div className="text-lg font-extrabold leading-tight">Google Play</div>
            </div>
          </a>

        </div>

        {/* TestFlight Beta Signup Card */}
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-950/70 border border-slate-800 text-center shadow-2xl" id="beta">
          <h3 className="text-lg font-bold text-white mb-1">
            Want early access via TestFlight?
          </h3>
          <p className="text-xs text-zinc-400 mb-6">
            Join the {APP_NAME} beta circle. Get invited to the iOS build before the official App Store release.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-600 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>You're on the list! We'll send your TestFlight invite shortly.</span>
            </div>
          ) : (
            <form onSubmit={handleBetaSignup} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                required
                placeholder="Enter your Apple ID email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-brand-600/30"
              >
                <span>Join Beta</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-zinc-500">
            <span>✓ No spam</span>
            <span>·</span>
            <span>✓ Direct developer feedback</span>
            <span>·</span>
            <span>✓ Free Pro access during beta</span>
          </div>
        </div>

      </div>
    </section>
  );
}
