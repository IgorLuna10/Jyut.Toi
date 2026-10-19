/**
 * Habit, Quests, Streaks & Cultural Vault Engine
 * Manages daily consistency, 3-tier missions, and Hong Kong enamel collectibles.
 */

import { metroService } from './metroService.js';
import { speechEngine } from './speechEngine.js';

const HABIT_STORAGE_KEY = 'jyut-toi-habit-state';

export const CULTURAL_CARDS_DATA = [
  {
    id: 'c1',
    name: 'Egg Tart',
    chinese: '蛋撻',
    jyutping: 'daan6 taat1',
    icon: '🥧',
    unlockCriterion: 'Complete first practice drill',
    unlockedByDefault: false,
    desc: 'Flaky puff pastry filled with warm, silky egg custard. A Hong Kong Cha Chaan Teng staple since the 1940s.',
  },
  {
    id: 'c2',
    name: 'Ding Ding Tram',
    chinese: '叮叮車',
    jyutping: 'ding1 ding1 ce1',
    icon: '🚋',
    unlockCriterion: 'Maintain a 2-day daily streak',
    unlockedByDefault: false,
    desc: 'Double-decker heritage tram rumbling along Hong Kong Island since 1904. Named after its iconic two-stroke brass warning bell.',
  },
  {
    id: 'c3',
    name: 'Star Ferry',
    chinese: '天星小輪',
    jyutping: 'tin1 sing1 siu2 leon4',
    icon: '⛴️',
    unlockCriterion: 'Reach Level 2 (200 XP)',
    unlockedByDefault: false,
    desc: 'Breeze across Victoria Harbour between Tsim Sha Tsui and Central. National Geographic calls it one of the top 50 trips of a lifetime.',
  },
  {
    id: 'c4',
    name: 'Lion Rock',
    chinese: '獅子山',
    jyutping: 'si1 zi2 saan1',
    icon: '⛰️',
    unlockCriterion: 'Achieve a 5-day daily streak',
    unlockedByDefault: false,
    desc: 'The mountain ridge overlooking Kowloon that represents the enduring Hong Kong "Lion Rock Spirit" (獅子山精神) of grit and resilience.',
  },
  {
    id: 'c5',
    name: 'Neon Signboard',
    chinese: '霓虹招牌',
    jyutping: 'ngai4 hung4 ziu1 paai4',
    icon: '🏮',
    unlockCriterion: 'Complete all 3 Daily Quests',
    unlockedByDefault: false,
    desc: 'Glowing nocturnal calligraphy painting Nathan Road in cyan & amber. Handcrafted by master glassblowers.',
  },
  {
    id: 'c6',
    name: 'Pineapple Bun',
    chinese: '菠蘿包',
    jyutping: 'bo1 lo4 baau1',
    icon: '🍞',
    unlockCriterion: 'Reach Level 4 (400 XP)',
    unlockedByDefault: false,
    desc: 'Golden crust with a checkered sugary pattern resembling pineapple skin, served piping hot with a thick slab of cold butter (菠蘿油).',
  },
  {
    id: 'c7',
    name: 'Red Minibus',
    chinese: '紅頂小巴',
    jyutping: 'hung4 deng2 siu2 baa1',
    icon: '🚐',
    unlockCriterion: 'Review 5 Mistake Bank items',
    unlockedByDefault: false,
    desc: 'Flexible 16-seater vans without fixed stops. You must loudly shout "唔該有落！" (Drop-off please!) to alight.',
  },
  {
    id: 'c8',
    name: 'Mahjong Tile',
    chinese: '麻雀',
    jyutping: 'maa4 zoek3',
    icon: '🀄',
    unlockCriterion: 'Reach Level 6 (600 XP)',
    unlockedByDefault: false,
    desc: 'The classic clatter of 144 bamboo tiles echoing through family parlors and festive celebrations across Hong Kong.',
  },
];

class HabitEngine {
  constructor() {
    this._state = null;
    this.init();
  }

  getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  init() {
    try {
      const saved = localStorage.getItem(HABIT_STORAGE_KEY);
      if (saved) {
        this._state = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse habit state', e);
    }

    const today = this.getTodayKey();

    if (!this._state) {
      this._state = {
        streak: 0,
        lastCompletedDate: null,
        weeklyActivity: {},
        quests: {
          date: today,
          sentences_assembled: 0,
          tones_drilled: 0,
          audio_listens: 0,
          claimedBonus: false,
        },
        unlockedCardIds: [],
        totalAudioListens: 0,
        totalSentencesAssembled: 0,
        totalTonesDrilled: 0,
      };
      this.save();
    } else {
      // Check if day rolled over
      if (this._state.quests?.date !== today) {
        this._state.quests = {
          date: today,
          sentences_assembled: 0,
          tones_drilled: 0,
          audio_listens: 0,
          claimedBonus: false,
        };
        this.save();
      }
    }
  }

  save() {
    try {
      localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(this._state));
    } catch (e) {
      console.warn('Failed to save habit state', e);
    }
  }

  getState() {
    if (!this._state) this.init();
    return this._state;
  }

  /**
   * Record a learner action to advance quests & streaks
   * @param {'sentence_assembled' | 'tone_drilled' | 'audio_listen' | 'session_completed'} actionType
   */
  recordAction(actionType) {
    if (!this._state) this.init();
    const today = this.getTodayKey();

    // Ensure today's quests initialized
    if (this._state.quests.date !== today) {
      this._state.quests = {
        date: today,
        sentences_assembled: 0,
        tones_drilled: 0,
        audio_listens: 0,
        claimedBonus: false,
      };
    }

    if (actionType === 'sentence_assembled') {
      this._state.quests.sentences_assembled = (this._state.quests.sentences_assembled || 0) + 1;
      this._state.totalSentencesAssembled = (this._state.totalSentencesAssembled || 0) + 1;
    } else if (actionType === 'tone_drilled') {
      this._state.quests.tones_drilled = (this._state.quests.tones_drilled || 0) + 1;
      this._state.totalTonesDrilled = (this._state.totalTonesDrilled || 0) + 1;
    } else if (actionType === 'audio_listen') {
      this._state.quests.audio_listens = (this._state.quests.audio_listens || 0) + 1;
      this._state.totalAudioListens = (this._state.totalAudioListens || 0) + 1;
    }

    // Mark today's activity
    this._state.weeklyActivity[today] = true;
    this._state.lastCompletedDate = today;

    // Check unlocks
    this.checkCardUnlocks();
    this.save();

    return this._state;
  }

  /**
   * Check if any cultural cards can be unlocked
   */
  checkCardUnlocks() {
    const progress = metroService.getProgress();
    const currentXp = progress.xp ?? 0;
    const streak = this._state.streak ?? 0;
    const allQuestsDone = this.areAllQuestsCompleted();

    const unlocked = new Set(this._state.unlockedCardIds || []);

    // c1: Complete first practice drill (sentence assembled or tone drilled)
    if (this._state.totalSentencesAssembled >= 1 || this._state.totalTonesDrilled >= 1) unlocked.add('c1');
    // c2: Maintain a 2-day daily streak
    if (streak >= 2) unlocked.add('c2');
    // c3: Reach Level 2 (200 XP)
    if (currentXp >= 200) unlocked.add('c3');
    // c4: Achieve a 5-day daily streak
    if (streak >= 5) unlocked.add('c4');
    // c5: Complete all 3 Daily Quests
    if (allQuestsDone) unlocked.add('c5');
    // c6: Reach Level 4 (400 XP)
    if (currentXp >= 400) unlocked.add('c6');
    // c7: Complete 5 tone drills
    if (this._state.totalTonesDrilled >= 5) unlocked.add('c7');
    // c8: Reach Level 6 (600 XP)
    if (currentXp >= 600) unlocked.add('c8');

    this._state.unlockedCardIds = Array.from(unlocked);
  }

  /**
   * Check quest completion state
   */
  getQuestsStatus() {
    const q = this._state.quests || {};
    return [
      {
        id: 'q_sentences',
        title: 'Assemble 5 Cantonese Sentences',
        current: Math.min(5, q.sentences_assembled || 0),
        target: 5,
        isCompleted: (q.sentences_assembled || 0) >= 5,
        icon: '🧩',
      },
      {
        id: 'q_tones',
        title: 'Discriminate 3 Tone Pairs',
        current: Math.min(3, q.tones_drilled || 0),
        target: 3,
        isCompleted: (q.tones_drilled || 0) >= 3,
        icon: '🎯',
      },
      {
        id: 'q_audio',
        title: 'Listen to 10 Native Pronunciations',
        current: Math.min(10, q.audio_listens || 0),
        target: 10,
        isCompleted: (q.audio_listens || 0) >= 10,
        icon: '🔊',
      },
    ];
  }

  areAllQuestsCompleted() {
    const quests = this.getQuestsStatus();
    return quests.every((q) => q.isCompleted);
  }

  /**
   * Claim daily +50 XP bonus when all 3 quests completed
   */
  claimDailyBonus() {
    if (!this.areAllQuestsCompleted() || this._state.quests.claimedBonus) {
      return { success: false, message: 'Bonus already claimed or quests pending' };
    }

    this._state.quests.claimedBonus = true;
    metroService.addXp(50);
    this.checkCardUnlocks();
    this.save();

    try {
      metroService.playStationArrivalChime();
    } catch (e) {}

    return { success: true, xpAdded: 50 };
  }

  /**
   * Generates calendar data for the current week (Monday through Sunday)
   */
  getWeeklyCalendar() {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
    // Normalize Monday to index 0
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const calendar = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + mondayOffset + i);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      const isToday = dateKey === this.getTodayKey();
      const isPast = d < today && !isToday;
      const isCompleted = Boolean(this._state?.weeklyActivity?.[dateKey]);

      calendar.push({
        dayName: days[i],
        dayNumber: d.getDate(),
        dateKey,
        isToday,
        isPast,
        isCompleted,
      });
    }

    return calendar;
  }

  /**
   * Returns commemorative commuter title based on XP
   */
  getCommuterTitle(xp = 480) {
    if (xp >= 1000) return { title: 'Victoria Peak Master', subtitle: '太平山頂 宗師', badge: 'Tier V' };
    if (xp >= 750) return { title: 'Central Transit Executive', subtitle: '中環 總督察', badge: 'Tier IV' };
    if (xp >= 500) return { title: 'Star Ferry Navigator', subtitle: '天星小輪 領航員', badge: 'Tier III' };
    if (xp >= 250) return { title: 'Mong Kok Street Explorer', subtitle: '旺角 探險家', badge: 'Tier II' };
    return { title: 'Kowloon Commuter', subtitle: '九龍 通勤者', badge: 'Tier I' };
  }
}

export const habitEngine = new HabitEngine();
