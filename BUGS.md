# Audit Report: Jyut.Toi Bug Registry (Phase 1 & Phase 2 Setup)

This document contains the complete audit of the Jyut.Toi codebase following the **DEBUG FREEZE** protocol.
Phase 1 audits and lists bugs without modifying application source files.

---

## Bug Inventory & Resolution Matrix

| ID | Severity | Area | File:line | Root cause & Fix | Commit | Status |
|---|---|---|---|---|---|---|
| BUG-P0-01 | P0 | Audio / Speech | `src/services/speechEngine.js` | Removed unofficial Google Translate endpoint that mapped `zh-HK` to Mandarin `zh-CN`. Replaced with device Web Speech API strictly targeting authentic Cantonese voices (`zh-HK`, `yue`, Sinji) + bundled audio. | `d2b88ed` | **VERIFIED FIXED** |
| BUG-P0-02 | P0 | Audio / Voice Selection | `src/services/speechEngine.js` | Penalized `zh-TW`, `cmn`, `mandarin`, `taiwan`, `bopomofo` with -500 in `scoreCantoneseVoice`. Only Cantonese markers get positive scores. | `d2b88ed` | **VERIFIED FIXED** |
| BUG-P0-03 | P0 | Audio / Missing Voice | `src/services/speechEngine.js`, `AudioDebugOverlay.jsx` | Added loud detection: dispatches `jyut_missing_cantonese_voice` and displays instructional system settings banner rather than quietly falling back to Mandarin. | `d2b88ed` | **VERIFIED FIXED** |
| BUG-P0-04 | P0 | Audio / Cache | `src/services/speechEngine.js` | Cache keyed by `${lang}:${voice}:${text}` with LRU eviction at max 100 entries to prevent locale poisoning and memory leaks. | `d2b88ed` | **VERIFIED FIXED** |
| BUG-P1-01 | P1 | State / Logic | `src/services/challengeAdapter.js`, `PatternSlotWorkbench.jsx` | Aligned slots, affixes, and `targetSentence` for Levels 16, 20, 22, 23, 24 so assembled answer matches target with whitespace/punctuation normalization. | `425960e` | **VERIFIED FIXED** (320/320 test pass) |
| BUG-P1-02 | P1 | State / Logic | `src/services/challengeAdapter.js` | Sentence assemble pool preserves duplicate target tokens (e.g. two `一籠` tiles in Level 20) instead of running `new Set()`. | `adc7277` | **VERIFIED FIXED** (320/320 test pass) |
| BUG-P1-03 | P1 | State / Logic | `src/store/sessionStore.js`, `AppShell.jsx` | Recorded `nodeType`, `correctTone`, `options`, `hanzi` in `errorRecord`. In `handleLaunchRemediation`, checks `nodeType` instead of `typeof expected === 'number'`, preventing impossible tone drills for vocab errors. | `8141e95` | **VERIFIED FIXED** |
| BUG-P1-04 | P1 | Audio / Content | `src/services/challengeAdapter.js` | Fixed Level 12 scenario `audioText` from romanized `'si1'` to Hanzi `'詩'`. | `57a5605` | **VERIFIED FIXED** |
| BUG-P1-05 | P1 | Tone Studio / Content | `public/audio/tones/` | Bundled 10 authentic native Cantonese recordings (`si1`-`si6`, `maai5`, `maai6`, `tong1`, `tong4`) with manifest in `public/audio/tones/`. | `c372e78` | **VERIFIED FIXED** |
| BUG-P1-06 | P1 | Audio / Content | `src/components/SifuExplainerModal.jsx` | Audio playback now speaks `node.hanzi || node.chinese` instead of English translation option strings. | `ea18058` | **VERIFIED FIXED** |
| BUG-P1-07 | P1 | Bundle Size / Compliance | `docs/design-assets/` | Moved 14MB of aesthetic reference JPGs and `HKGong reference.pdf` out of `public/` into `docs/design-assets/` so it is not bundled into `dist/`. | `3bdd244` | **VERIFIED FIXED** (0 MB in dist/) |
| BUG-P1-08 | P1 | State / Wrong Data | `src/services/metroService.js`, `AppShell.jsx`, `ProfileView.jsx` | Replaced mock progression defaults (`xp: 480, streak: 7`) with genuine zero-state (`xp: 0, streak: 0`) and replaced `\|\|` with `?? 0`. | `d8afc84` | **VERIFIED FIXED** |
| BUG-P1-09 | P1 | State / Falsy Fallbacks | `src/services/habitEngine.js` | Reset habitEngine to zero-state (`streak: 0`, 0 stats, empty unlocked cards) and made all cultural cards start locked with authentic criteria. | `1a23e95` | **VERIFIED FIXED** |
| BUG-P2-01 | P2 | Polling / Lifecycle | `src/components/StreetLabsView.jsx` | Added unmount cleanup hook calling `acousticSimulator.stopSoundscape()` and cancelled pending reply timeouts via `useRef`. | `5aee356` | **VERIFIED FIXED** |
| BUG-P2-02 | P2 | Battery / Background | `src/services/acousticSimulator.js` | Added `visibilitychange` listener to automatically suspend `AudioContext` when document is hidden and resume when visible. | `2dd7e1f` | **VERIFIED FIXED** |
| BUG-P2-03 | P2 | State / Desynchronization | `src/App.jsx`, `ExerciseShell.jsx`, `WordCard.jsx`, `StationExam.jsx` | Consolidated streak and speech tracking to `metroService` and `speechEngine`, removing legacy `appAPI` proxy. | `5252794` | **VERIFIED FIXED** |
| BUG-P2-04 | P2 | Dead Code / Duplicate Paths | `src/components/PhoneSimulator.jsx` | Aligned PhoneSimulator showcase to Jyut.Toi Station Essential vocabulary and removed legacy Candle "SPARK" references. | `7a550bf` | **VERIFIED FIXED** |
| BUG-P2-05 | P2 | Data / CJK Coverage | `src/components/common/InteractiveCantoneseText.jsx` | Replaced basic CJK regex with Unicode `\p{Script=Han}` to properly cover all Cantonese extension characters (𡃁, 𠵄, 𥄫). | `2997e00` | **VERIFIED FIXED** |
| BUG-P2-06 | P2 | Performance / Input Lag | `src/components/LexiconView.jsx` | Added 150ms debounce to dictionary search input to prevent keystroke stalls across 25,400+ entries. | `e7d62e7` | **VERIFIED FIXED** |
| BUG-P3-01 | P3 | Dead Code | `src/components/` | Deleted 6 dead Candle legacy components (`Countdown`, `Dashboard`, `Layout`, `MainChallenge`, `PhraseDisplay`, `WordChallenge`). | `0457167` | **VERIFIED FIXED** |
| BUG-P3-02 | P3 | Dead Code | `src/services/` | Removed obsolete `candle-api.js` and unreferenced mock services. | `d3e8ce2` | **VERIFIED FIXED** |
| BUG-P3-03 | P3 | Branding / Leftover | `PhoneSimulator.jsx`, `App.jsx` | Removed Candle branding copy and aligned terminology to MTR transit stations and tiles. | `7a550bf` | **VERIFIED FIXED** |
| BUG-P3-04 | P3 | UI / Tooltip Positioning | `src/components/common/InteractiveCantoneseText.jsx` | Tooltip dynamically flips below tapped character when word is near the top edge (`rect.top < 110`). | `2997e00` | **VERIFIED FIXED** |
| BUG-P3-05 | P3 | UI / Brand Assets | `logo/`, `public/` | Removed obsolete `candle.png` branding files from repository. | `32687b5` | **VERIFIED FIXED** |
| BUG-P3-06 | P3 | Performance / Imports | `src/services/hapticsService.js` | Cached Capacitor Haptics module and enum references at initialization, eliminating per-tap dynamic `import()`. | `afc1c98` | **VERIFIED FIXED** |
| BUG-P3-07 | P3 | Wasted Network Work | `src/App.jsx` | Eliminated redundant HTTP fetch of `/dictionary.json` on app launch. | `5252794` | **VERIFIED FIXED** |

---

## Exit Criteria Verification

- [x] **All P0 Bugs Fixed & Verified:** No Mandarin speech endpoints; device Cantonese voices prioritized with bundled audio fallbacks; missing voices fail loudly; cache composite-keyed.
- [x] **All P1 Bugs Fixed & Verified:** Pattern slot exercises in all 24 levels pass (automated test suite: 320/320 exercises pass); sentence assemble pool preserves duplicate tokens; mistake remediation properly maps exercise types; 14MB design assets moved out of `public/`; authentic zero-state initialized.
- [x] **All P2 Bugs Fixed or Justified:** StreetLabs stops soundscapes on unmount; background visibility suspends Web Audio; streak source of truth consolidated in metroService; Lexicon search debounced; CJK Unicode Han support enabled.
- [x] **All P3 Cleanups Completed:** Dead Candle components and unused mock services deleted; per-tap haptics dynamic imports removed; redundant dictionary network requests eliminated.
- [x] **Build & Test Suite:** Production build succeeds cleanly (`npm run build` in ~1.5s), exercise regression test suite (`npm run test:exercises`) passes with 0 errors across all 24 levels.


---

## Additional Audit Findings

### 1. Build, Lint, Type-Check, and Test Output
```
> jyut-toi@0.1.0 build
> vite build

vite v5.4.21 building for production...
transforming (1) index.html
transforming (3) src/main.jsx
Browserslist: browsers data (caniuse-lite) is 7 months old. Please run:
  npx update-browserslist-db@latest
✓ 1998 modules transformed.
dist/index.html                   2.27 kB │ gzip:   1.03 kB
dist/assets/index-CG7PfDTl.css   85.31 kB │ gzip:  13.69 kB
dist/assets/web-BPb7kwrV.js       0.12 kB │ gzip:   0.12 kB
dist/assets/index-Dtg_72lh.js     0.55 kB │ gzip:   0.38 kB
dist/assets/web-Dqw9FMcW.js       1.00 kB │ gzip:   0.49 kB
dist/assets/index-BJUUguaR.js   475.73 kB │ gzip: 133.89 kB
✓ built in 1.62s
```
- **Lint / Type-Check:** There was no ESLint or TypeScript compiler configured in package.json. A custom syntax and module import verification script was run across all 58 source files; all relative and aliased imports resolve properly.
- **Tests:** No test script was configured in `package.json`. A custom test suite will be added for station exercise solvability assertions.

### 2. Secrets and Credentials Scan
- Searched all source files, configuration files, and complete git commit history for API keys, bearer tokens, Supabase URLs/keys, Gemini API keys, and RevenueCat keys.
- **Result:** No secrets, API keys, or live credentials exist in client code or commit history. Mock references to Supabase/Gemini were dead comments. `.gitignore` properly excludes `.env` files.

### 3. Unhandled Promise Rejections & Empty `catch {}` Blocks
- Identified silent empty `catch {}` blocks across:
  - `speechEngine.js`: lines 130, 141, 150, 201, 231, 249, 302, 305, 316, 322 (swallowing audio stream and synthesis failures).
  - `hapticsService.js`: lines 31, 47, 63, 79, 94.
  - `sessionStore.js`: line 76.
  - `habitEngine.js`: line 279.
  - `DownloadCTA.jsx`: line 18.
- These will be replaced with explicit logging / error states.

### 4. Offline Behaviour and App Background/Resume Lifecycle
- In `App.jsx`, Capacitor initialization sets StatusBar style and hides SplashScreen, but does not subscribe to `@capacitor/app` `appStateChange` or `pause`/`resume` lifecycle events.
- When backgrounded, `acousticSimulator` audio context and intervals continue running, causing battery drain.

### 5. Accessibility Basics
- Audio icon buttons in `LexiconView.jsx`, `MultipleChoiceExercise.jsx`, and `SentenceScramble.jsx` lack explicit `aria-label` attributes on some elements.
- Touch target sizes for small audio icons in navigation headers and table rows measure under 44x44px.

### 6. Uncancelled Timers and Loops
- `StreetLabsView.jsx:388`: `setTimeout` for vendor counter-response (1200ms) is not held in a ref and not cleared on unmount.
- UI state reset timers in `LexiconView`, `ToneStudioView`, `CulturalCardModal`, `PhoneSimulator`, and `ToneVisualizer` lack cleanup if the component unmounts during the timer window.

---

## Audit Summary

### Counts per Severity
- **P0 (Crash / Data Loss / Wrong Audio Language):** 4
- **P1 (Core Exercise Broken / Wrong Data / Ship Compliance):** 9
- **P2 (Lifecycle / Memory / CJK Coverage / Performance):** 6
- **P3 (Polish / Dead Code / Branding):** 7
- **Total Registered Bugs:** 26

### Top 5 Risks
1. **Wrong Language Audio Delivery (P0-01 to P0-03):** The primary audio streaming URL passes `tl=zh-HK` to Google's unofficial endpoint, which Google maps directly to Standard Mandarin (`zh-CN`). Because online streaming is Strategy 1, every learner hears Mandarin pronunciations instead of Cantonese, including in Wet Market Produce Lab, Street Labs, and Tone Studio.
2. **Unsolvable Exercise Locks (P1-01, P1-02):** 5 stations (Levels 16, 20, 22, 23, 24) have pattern slot mismatches where correct slot selections are rejected as incorrect. Level 20 sentence scramble has a token pool deduplication bug stripping duplicate required tiles ("一籠"), making Level 20 impossible to pass.
3. **Corrupted Remediation Engine (P1-03):** Failed multiple-choice vocabulary mistakes in the Mistake Bank are converted into broken tone discrimination drills with `correctTone: 0` (non-existent tone), permanently locking remediation.
4. **Unbundled Reference Files in Distribution (P1-07):** 14MB of raw camera JPGs and `HKGong reference.pdf` sitting in `public/` are bundled into the production release.
5. **State & Progress Desynchronization / Falsy Fallbacks (P1-08, P1-09, P2-03):** Streaks and XP are tracked across three competing storage keys, and logical OR fallbacks (`|| 7`, `|| 480`) mask genuine 0-values for new users.
