import React from 'react';
import { Compass, Volume2, Sparkles, BookOpen, User } from 'lucide-react';
import { hapticsService } from '../services/hapticsService';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'route', label: 'Route', icon: Compass },
    { id: 'sounds', label: 'Sounds', icon: Volume2 },
    { id: 'practice', label: 'Practice', icon: Sparkles },
    { id: 'dictionary', label: 'Dictionary', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleTabClick = (tabId) => {
    hapticsService.selectionChanged();
    setActiveTab(tabId);
  };

  return (
    <nav 
      aria-label="Primary Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-slate-200/90 dark:border-white/[0.08] pb-safe transition-all duration-300"
    >
      <div className="max-w-lg mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`group flex flex-col items-center justify-center py-2 px-1 min-h-[48px] rounded-2xl transition-all duration-200 relative touch-manipulation select-none active:scale-95 ${
                isActive
                  ? 'text-mtr-red dark:text-red-400 font-black'
                  : 'text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white font-bold'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Indicator Top Pill Glow */}
              {isActive && (
                <div className="absolute -top-1 w-8 h-1 rounded-full bg-mtr-red dark:bg-red-400 shadow-glow-sm transition-all" />
              )}

              {/* Icon Container */}
              <div className={`p-1 rounded-xl transition-all ${
                isActive 
                  ? 'bg-mtr-red/10 dark:bg-mtr-red/20 scale-110' 
                  : 'group-hover:bg-slate-100 dark:group-hover:bg-white/5'
              }`}>
                <Icon className={`w-5 h-5 transition-transform ${
                  isActive ? 'stroke-[2.4] text-mtr-red dark:text-red-400' : 'stroke-[1.8]'
                }`} />
              </div>
              
              <span className={`text-[11px] tracking-tight mt-0.5 truncate max-w-full ${
                isActive ? 'font-bold' : 'font-medium'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
