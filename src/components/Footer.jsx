import React, { useState } from 'react';
import { Shield, FileText, Mail } from 'lucide-react';
import { APP_NAME, DEVELOPER_NAME } from '../config/appConfig';

export default function Footer() {
  const [modalContent, setModalContent] = useState(null); // 'privacy' | 'terms' | null

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-zinc-400 py-12 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          <div className="flex items-center gap-2.5">
            <img src="/icon.png" alt={APP_NAME} className="h-7 w-auto" />
            <span className="font-extrabold text-base text-white tracking-tight">{APP_NAME}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400 font-serif">廣東話學習</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-zinc-400">
            <button 
              onClick={() => setModalContent('privacy')}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>
            <button 
              onClick={() => setModalContent('terms')}
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Service</span>
            </button>
            <a 
              href="mailto:support@example.com"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Support</span>
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} {DEVELOPER_NAME} · {APP_NAME}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with care by {DEVELOPER_NAME} · Metro-level Cantonese study
          </p>
        </div>

      </div>

      {/* Compliance Legal Modal (App Store Required) */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-zinc-300 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h4 className="font-bold text-white text-base">
                {modalContent === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h4>
              <button 
                onClick={() => setModalContent(null)}
                className="text-zinc-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {modalContent === 'privacy' ? (
              <div className="space-y-3 text-xs leading-relaxed text-zinc-400">
                <p><strong>{APP_NAME} respects your privacy.</strong></p>
                <p>1. <strong>Local-First:</strong> Your learning progress, streaks, and quiz results are stored locally on your device.</p>
                <p>2. <strong>No Invasive Tracking:</strong> We never collect Wi-Fi fingerprints, ringer state, network identifiers, or cross-app tracking data.</p>
                <p>3. <strong>Audio & Speech:</strong> Cantonese speech playback utilizes on-device speech engines or local audio assets.</p>
                <p>4. <strong>Billing:</strong> In-app purchases are securely handled directly by Apple StoreKit or Google Play Billing.</p>
              </div>
            ) : (
              <div className="space-y-3 text-xs leading-relaxed text-zinc-400">
                <p><strong>Terms of Use for {APP_NAME}:</strong></p>
                <p>1. <strong>License:</strong> {APP_NAME} grants you a personal, non-exclusive license for language learning.</p>
                <p>2. <strong>Subscriptions:</strong> Pro subscriptions auto-renew through your Apple ID or Google Play Account unless canceled at least 24 hours before the end of the current billing cycle.</p>
                <p>3. <strong>Educational Content:</strong> Content and phonetics are curated for educational study.</p>
              </div>
            )}

            <button
              onClick={() => setModalContent(null)}
              className="mt-6 w-full py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}
