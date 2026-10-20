import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import AppShell from './components/AppShell';
import LandingPage from './components/LandingPage';
import { metroService } from './services/metroService';

function App() {
    const isNative = Capacitor.isNativePlatform();

    // Default to 'app' so the actual Cantonese learning app loads immediately.
    // If running inside Capacitor (iOS / Android native app), ALWAYS show the real app.
    // On web, allow ?landing=true to preview the landing page showcase if desired.
    const [view, setView] = useState(() => {
        if (isNative) return 'app';
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.get('landing') === 'true') return 'landing';
        } catch (e) {}
        return 'app';
    });

    const [content] = useState(() => {
        const lvl1 = metroService.getLevel(1);
        const w = lvl1?.vocab?.[0] || { chinese: '你好', jyutping: 'nei5 hou2', english: 'hello' };
        return { mainWord: w };
    });
    const [streak] = useState(() => metroService.getProgress().streak ?? 0);

    // Dark mode state
    const [isDark, setIsDark] = useState(
        () => typeof window !== 'undefined' && localStorage.getItem('app-theme') === 'dark'
    );

    // Initialize native device features
    useEffect(() => {
        if (isNative) {
            try {
                StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
                SplashScreen.hide();
            } catch (e) {
                console.warn('Native statusbar / splashscreen init:', e);
            }
        }
    }, [isNative, isDark]);

    // Apply dark class to <html> and <body>
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        document.body.classList.toggle('dark', isDark);
    }, [isDark]);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('app-theme', newTheme ? 'dark' : 'light');
    };

    // If on web and user specifically requested the landing showcase
    if (!isNative && view === 'landing') {
        return (
            <LandingPage
                content={content}
                streak={streak}
                isDark={isDark}
                toggleTheme={toggleTheme}
                onLaunchWebApp={() => setView('app')}
            />
        );
    }

    // Otherwise render the full Hong Kong Transit Mobile App
    return (
        <AppShell
            isDark={isDark}
            toggleTheme={toggleTheme}
            onExitToLanding={isNative ? null : () => setView('landing')}
        />
    );
}

export default App;
