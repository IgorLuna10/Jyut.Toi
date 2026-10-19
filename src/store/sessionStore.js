import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { metroService } from '../services/metroService';
import { speechEngine } from '../services/speechEngine';
import { habitEngine } from '../services/habitEngine';
import { hapticsService } from '../services/hapticsService';

export const useSessionStore = create(
  persist(
    (set, get) => ({
      // Active Session State
      sessionId: null,
      stationName: '',
      themeId: 'red',
      levelNumber: 1,
      queue: [],
      initialTotal: 0,
      completedCount: 0,
      activeNode: null,
      status: 'idle', // 'idle' | 'in_progress' | 'feedback_correct' | 'feedback_incorrect' | 'victory'
      selectedAnswer: null,
      isAnswerChecked: false,
      isCorrect: null,
      
      // Progress & Scoring
      combo: 0,
      highestCombo: 0,
      xpEarned: 0,
      hearts: 5,
      errorsEncountered: [],
      startTime: null,
      endTime: null,

      // Persistent Mastery & Spaced Repetition Bank
      mistakeBank: [],

      // ─────────────────────────────────────────────────────────────
      // ACTIONS
      // ─────────────────────────────────────────────────────────────

      /**
       * Start a brand new exercise session
       */
      startSession: (challenges, meta = {}) => {
        if (!challenges || challenges.length === 0) return;

        const clonedQueue = challenges.map((c, i) => ({
          ...c,
          queueUid: `${c.id || 'q'}_${i}_${Date.now()}`,
        }));

        set({
          sessionId: `sess_${Date.now()}`,
          stationName: meta.stationName || 'Central (中環)',
          themeId: meta.themeId || 'red',
          levelNumber: meta.levelNumber || 1,
          queue: clonedQueue,
          initialTotal: clonedQueue.length,
          completedCount: 0,
          activeNode: clonedQueue[0],
          status: 'in_progress',
          selectedAnswer: null,
          isAnswerChecked: false,
          isCorrect: null,
          combo: 0,
          highestCombo: 0,
          xpEarned: 0,
          errorsEncountered: [],
          startTime: Date.now(),
          endTime: null,
        });

        // Trigger station entrance chime
        try {
          metroService.playPlatformDoorChime();
        } catch (e) {
          // ignore audio context restrictions
        }
      },

      /**
       * Set user's active draft answer (tile sequence, option index, etc.)
       */
      setAnswer: (answer) => {
        const { status } = get();
        if (status !== 'in_progress') return;
        set({ selectedAnswer: answer });
      },

      /**
       * Evaluate current answer against active node target
       */
      submitAnswer: () => {
        const { activeNode, selectedAnswer, status, queue, combo, highestCombo, xpEarned, errorsEncountered, mistakeBank, hearts } = get();
        if (status !== 'in_progress' || !activeNode) return;

        let isCorrect = false;

        switch (activeNode.type) {
          case 'token_scramble': {
            // Target is array of strings e.g. ["唔該", "借借"]
            const target = activeNode.target || [];
            const userTokens = Array.isArray(selectedAnswer) ? selectedAnswer : [];
            isCorrect = JSON.stringify(userTokens) === JSON.stringify(target);
            break;
          }

          case 'tone_discrimination': {
            // Target can be 'a' | 'b' or a tone digit e.g. 1
            isCorrect = selectedAnswer === activeNode.target || selectedAnswer === activeNode.correctTone;
            break;
          }

          case 'multiple_choice':
          case 'listening_cloze': {
            // Target can be correct index or matching string
            if (typeof activeNode.correctIndex === 'number') {
              isCorrect = selectedAnswer === activeNode.correctIndex;
            } else if (activeNode.target) {
              isCorrect = selectedAnswer === activeNode.target;
            }
            break;
          }

          case 'pattern_slot': {
            // Target is complete pattern string or slot matching
            const targetSentence = activeNode.targetSentence || activeNode.target;
            if (typeof selectedAnswer === 'string' && targetSentence) {
              const norm = (s) => (s || '').replace(/\s+/g, ' ').replace(/\s+([！!？?.,，。])/g, '$1').trim();
              isCorrect = norm(selectedAnswer) === norm(targetSentence);
            } else if (Array.isArray(selectedAnswer) && Array.isArray(activeNode.target)) {
              isCorrect = JSON.stringify(selectedAnswer) === JSON.stringify(activeNode.target);
            } else {
              isCorrect = true; // Interactive practice slots
            }
            break;
          }

          default: {
            isCorrect = Boolean(selectedAnswer);
          }
        }

        if (isCorrect) {
          const newCombo = combo + 1;
          const comboBonus = Math.min(newCombo * 5, 25);
          const gained = 15 + comboBonus;

          metroService.addXp(gained);
          hapticsService.success();

          // Habit Engine Quest Progress
          if (activeNode.type === 'token_scramble') {
            habitEngine.recordAction('sentence_assembled');
          } else if (activeNode.type === 'tone_discrimination') {
            habitEngine.recordAction('tone_drilled');
          }

          // Audio feedback
          if (activeNode.hanzi) {
            speechEngine.speak(activeNode.hanzi);
          }

          set({
            isCorrect: true,
            isAnswerChecked: true,
            status: 'feedback_correct',
            combo: newCombo,
            highestCombo: Math.max(highestCombo, newCombo),
            xpEarned: xpEarned + gained,
          });
        } else {
          // DUOLINGO RETRY LOOP:
          hapticsService.error();

          // 1. Record error
          const expectedAnswer = (activeNode.type === 'multiple_choice' || activeNode.type === 'listening_cloze') &&
            typeof activeNode.correctIndex === 'number' &&
            Array.isArray(activeNode.options)
              ? activeNode.options[activeNode.correctIndex]
              : (activeNode.correctTone ?? activeNode.target ?? activeNode.correctIndex);

          const errorRecord = {
            nodeId: activeNode.id,
            nodeType: activeNode.type,
            prompt: activeNode.prompt || activeNode.hanzi,
            userAnswer: selectedAnswer,
            expected: expectedAnswer,
            correctTone: activeNode.correctTone,
            hanzi: activeNode.hanzi || activeNode.character,
            jyutping: activeNode.jyutping || activeNode.syllable,
            options: activeNode.options,
            english: activeNode.english,
            explanation: activeNode.explanation,
            timestamp: Date.now(),
          };

          // 2. Clone activeNode and append to the end of the queue
          const retryNode = {
            ...activeNode,
            isRetry: true,
            queueUid: `${activeNode.id}_retry_${Date.now()}`,
          };

          const newQueue = [...queue, retryNode];

          // 3. Deduct heart (minimum 1 to prevent hard blocking)
          const newHearts = Math.max(1, hearts - 1);

          set({
            isCorrect: false,
            isAnswerChecked: true,
            status: 'feedback_incorrect',
            combo: 0,
            hearts: newHearts,
            queue: newQueue,
            errorsEncountered: [...errorsEncountered, errorRecord],
            mistakeBank: [...mistakeBank.slice(-50), errorRecord],
          });
        }
      },

      /**
       * Advance to next node in the queue, or finish session if queue empty
       */
      nextChallenge: () => {
        const { queue, completedCount, activeNode, isCorrect, levelNumber } = get();
        if (!activeNode) return;

        const nextQueue = queue.slice(1);
        const newCompletedCount = isCorrect ? completedCount + 1 : completedCount;

        if (nextQueue.length === 0) {
          // Session Completed!
          metroService.unlockNextLevel(levelNumber);
          metroService.playStationArrivalChime();
          hapticsService.success();
          habitEngine.recordAction('session_completed');

          set({
            queue: [],
            activeNode: null,
            status: 'victory',
            completedCount: newCompletedCount,
            endTime: Date.now(),
            selectedAnswer: null,
            isAnswerChecked: false,
            isCorrect: null,
          });
        } else {
          set({
            queue: nextQueue,
            activeNode: nextQueue[0],
            status: 'in_progress',
            completedCount: newCompletedCount,
            selectedAnswer: null,
            isAnswerChecked: false,
            isCorrect: null,
          });
        }
      },

      /**
       * Quit / abandon current session and return to map
       */
      abandonSession: () => {
        set({
          status: 'idle',
          activeNode: null,
          queue: [],
          selectedAnswer: null,
          isAnswerChecked: false,
          isCorrect: null,
        });
      },

      /**
       * Reset mistake bank
       */
      clearMistakeBank: () => {
        set({ mistakeBank: [] });
      },
    }),
    {
      name: 'jyut-toi-session-store',
      partialize: (state) => ({
        mistakeBank: state.mistakeBank,
        hearts: state.hearts,
      }),
    }
  )
);
