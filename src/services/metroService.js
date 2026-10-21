import themesData from '@shared/themes.json';
import levelsData from '@shared/levels.json';
import { CHAPTERS } from '../data/chaptersData';
import { supabaseSyncService } from './supabaseSyncService';

const PROGRESS_STORAGE_KEY = 'jyut-toi-metro-progress';

class MetroService {
  constructor() {
    this.themes = themesData.themes;
    this.levels = levelsData.levels;
    this._progress = null;
    this._audioCtx = null;
  }

  // Retrieve or initialize progress
  getProgress() {
    if (this._progress) return this._progress;
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) {
        this._progress = JSON.parse(saved);
        if (!this._progress.stationRounds) this._progress.stationRounds = {};
        if (!this._progress.stationMastery) this._progress.stationMastery = {};
        return this._progress;
      }
    } catch (e) {
      console.warn('Failed to read metro progress from storage', e);
    }

    // Default progression state
    this._progress = {
      unlockedLevels: [1, 2], // First 2 stations unlocked by default
      completedLevels: [],
      currentLevelId: 1,
      levelStepProgress: {
        1: 0, // step index 0: vocab, 1: tone, 2: sentence, 3: exam
      },
      xp: 0,
      streak: 0,
      hearts: 5,
      stationRounds: {},
      stationMastery: {},
    };
    this.saveProgress();
    return this._progress;
  }

  saveProgress() {
    if (!this._progress) return;
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(this._progress));
    } catch (e) {
      console.warn('Failed to save metro progress', e);
    }
  }

  getTheme(themeId) {
    return this.themes[themeId] || this.themes['red'];
  }

  getLevel(levelNumber) {
    return this.levels.find((l) => l.level === Number(levelNumber)) || this.levels[0];
  }

  getAllLevels() {
    return this.levels;
  }

  isUnlocked(levelNumber) {
    const progress = this.getProgress();
    return progress.unlockedLevels.includes(Number(levelNumber));
  }

  isCompleted(levelNumber) {
    const progress = this.getProgress();
    return progress.completedLevels.includes(Number(levelNumber));
  }

  unlockNextLevel(currentLevelNumber) {
    const nextLevelNum = Number(currentLevelNumber) + 1;
    const progress = this.getProgress();

    if (!progress.completedLevels.includes(Number(currentLevelNumber))) {
      progress.completedLevels.push(Number(currentLevelNumber));
    }

    if (nextLevelNum <= this.levels.length && !progress.unlockedLevels.includes(nextLevelNum)) {
      progress.unlockedLevels.push(nextLevelNum);
      progress.currentLevelId = nextLevelNum;
    }

    progress.xp += 100;
    this.saveProgress();
    return nextLevelNum;
  }

  // Multi-Round & Sub-Level Management ("levels by levels")
  getStationRound(levelNumber) {
    const progress = this.getProgress();
    return progress.stationRounds?.[Number(levelNumber)] || 1;
  }

  getStationMastery(levelNumber) {
    const progress = this.getProgress();
    const lvlNum = Number(levelNumber);
    if (progress.stationMastery && typeof progress.stationMastery[lvlNum] === 'number') {
      return progress.stationMastery[lvlNum];
    }
    return this.isCompleted(lvlNum) ? 1 : 0;
  }

  setStationRound(levelNumber, roundNum) {
    const progress = this.getProgress();
    if (!progress.stationRounds) progress.stationRounds = {};
    progress.stationRounds[Number(levelNumber)] = Math.max(1, Math.min(3, Number(roundNum)));
    this.saveProgress();
    return progress.stationRounds[Number(levelNumber)];
  }

  completeStationRound(levelNumber, roundNum = 1, xpEarned = 100) {
    const lvlNum = Number(levelNumber);
    const roundNumber = Number(roundNum);
    const progress = this.getProgress();
    if (!progress.stationRounds) progress.stationRounds = {};
    if (!progress.stationMastery) progress.stationMastery = {};

    // 1. Mark station cleared on the line
    if (!progress.completedLevels.includes(lvlNum)) {
      progress.completedLevels.push(lvlNum);
    }

    // 2. Unlock next station if cleared round 1
    const nextLevelNum = lvlNum + 1;
    if (nextLevelNum <= this.levels.length && !progress.unlockedLevels.includes(nextLevelNum)) {
      progress.unlockedLevels.push(nextLevelNum);
      progress.currentLevelId = nextLevelNum;
    }

    // 3. Update station mastery (max 3 stars)
    const currentMastery = progress.stationMastery[lvlNum] || 0;
    progress.stationMastery[lvlNum] = Math.max(currentMastery, roundNumber);

    // 4. Advance station round to next round (1 -> 2 -> 3)
    const nextRound = roundNumber >= 3 ? 1 : roundNumber + 1;
    progress.stationRounds[lvlNum] = nextRound;

    // 5. Award XP
    progress.xp += xpEarned;
    this.saveProgress();

    // 6. Queue offline-resilient sync to Supabase
    try {
      supabaseSyncService.queueCompletion({
        stationId: lvlNum,
        round: roundNumber,
        xpEarned,
        accuracy: 100,
        localDate: new Date().toISOString().split('T')[0],
      });
    } catch (e) {
      console.warn('Sync queue error:', e);
    }

    return { nextLevelNum, nextRound, mastery: progress.stationMastery[lvlNum] };
  }

  addXp(amount) {
    const progress = this.getProgress();
    progress.xp += amount;
    this.saveProgress();
    return progress.xp;
  }

  // Chapter Architecture support
  getChapters() {
    const progress = this.getProgress();
    return CHAPTERS.map((ch) => {
      if (ch.id === 0) {
        return {
          ...ch,
          totalLevels: 0,
          completedLevels: 0,
          isUnlocked: true,
          isCompleted: false,
        };
      }
      const chapterLevels = this.levels.filter((l) => l.lineId === ch.id);
      const completedCount = chapterLevels.filter((l) =>
        progress.completedLevels.includes(l.level)
      ).length;
      const isUnlocked =
        ch.id === 1 ||
        chapterLevels.some((l) => progress.unlockedLevels.includes(l.level));

      return {
        ...ch,
        totalLevels: chapterLevels.length,
        completedLevels: completedCount,
        isUnlocked,
        isCompleted: completedCount >= chapterLevels.length && chapterLevels.length > 0,
      };
    });
  }

  getChapter(chapterId) {
    return CHAPTERS.find((c) => c.id === Number(chapterId)) || CHAPTERS[1];
  }

  getLevelsForChapter(chapterId) {
    const id = Number(chapterId);
    if (id === 0) return [];
    return this.levels.filter((l) => l.lineId === id);
  }

  getChapterForLevel(levelNumber) {
    const lvl = this.getLevel(levelNumber);
    if (!lvl) return CHAPTERS[1];
    return CHAPTERS.find((c) => c.id === lvl.lineId) || CHAPTERS[1];
  }

  // Depletable Energy / Stamina (Hearts)
  getHearts() {
    const progress = this.getProgress();
    return progress.hearts ?? 5;
  }

  deductHeart() {
    const progress = this.getProgress();
    const current = progress.hearts ?? 5;
    progress.hearts = Math.max(0, current - 1);
    this.saveProgress();
    return progress.hearts;
  }

  restoreHearts() {
    const progress = this.getProgress();
    progress.hearts = 5;
    this.saveProgress();
    return 5;
  }

  // Synthesize authentic Hong Kong transit chimes using Web Audio API
  getAudioContext() {
    if (!this._audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this._audioCtx = new AudioContextClass();
      }
    }
    if (this._audioCtx && this._audioCtx.state === 'suspended') {
      this._audioCtx.resume();
    }
    return this._audioCtx;
  }

  // Door warning chime: rhythmic warning beeps (MTR-style "doot doot doot")
  playPlatformDoorChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const beeps = [0, 0.22, 0.44, 0.66, 0.88];

      beeps.forEach((t) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(960, now + t);
        osc.frequency.setValueAtTime(940, now + t + 0.08);

        gain.gain.setValueAtTime(0, now + t);
        gain.gain.linearRampToValueAtTime(0.25, now + t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.14);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + 0.15);
      });
    } catch (e) {
      console.warn('Web Audio chime unavailable:', e);
    }
  }

  // Station arrival chime: melodious rising two-tone chime
  playStationArrivalChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [
        { freq: 523.25, delay: 0 },    // C5
        { freq: 659.25, delay: 0.16 }, // E5
        { freq: 783.99, delay: 0.32 }, // G5
        { freq: 1046.5, delay: 0.48 }  // C6
      ];

      notes.forEach(({ freq, delay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.2, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.38);
      });
    } catch (e) {
      console.warn('Web Audio chime unavailable:', e);
    }
  }
}

export const metroService = new MetroService();
