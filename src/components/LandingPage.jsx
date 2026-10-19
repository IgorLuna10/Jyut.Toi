import React from 'react';
import LandingHero from './LandingHero';
import FeatureGrid from './FeatureGrid';
import ToneVisualizer from './ToneVisualizer';
import PricingSection from './PricingSection';
import DownloadCTA from './DownloadCTA';
import Footer from './Footer';
import { Apple, Smartphone, Moon, Sun, BookOpen } from 'lucide-react';
import { APP_NAME } from '../config/appConfig';

export default function LandingPage({ content, streak, isDark, toggleTheme, onLaunchWebApp }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08090c] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Modern Sticky Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#08090c]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand */}
          <a href="#" className="flex items-center gap-2.5">
            <img src="/icon.png" alt={APP_NAME} className="h-8 w-auto" />
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                {APP_NAME}
              </span>
              <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold tracking-wider uppercase mt-0.5">
                Cantonese App
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Station System
            </a>
            <a href="#tones" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              6 Tones
            </a>
            <a href="#pricing" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Pricing
            </a>
            <a href="#download" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Download
            </a>
            <button
              onClick={onLaunchWebApp}
              className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-bold"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Web Practice Mode</span>
            </button>
          </nav>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* App Store CTA Button */}
            <a
              href="#download"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/30 transition-all flex items-center gap-1.5"
            >
              <Apple className="w-3.5 h-3.5 fill-current" />
              <span>Get App</span>
            </a>
          </div>

        </div>
      </header>

      {/* Hero Section with Interactive Phone Simulator */}
      <LandingHero 
        content={content} 
        streak={streak} 
        onLaunchWebApp={onLaunchWebApp} 
      />

      {/* Feature Grid */}
      <FeatureGrid />

      {/* Tone Visualizer Section */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6" id="tones">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">
            The Sound System
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Demystify the 6 Cantonese Tones.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Cantonese tones become intuitive with contour pitch curves and ear drills.
          </p>
        </div>

        <ToneVisualizer />
      </section>

      {/* Pricing & Monetization Section */}
      <PricingSection />

      {/* Download Section with Badges & TestFlight */}
      <DownloadCTA />

      {/* Compliance & Legal Footer */}
      <Footer />

    </div>
  );
}
