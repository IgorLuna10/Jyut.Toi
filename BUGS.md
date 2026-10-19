# Audit Report: Jyut.Toi Bug Registry (Phase 1 & Phase 2 Setup)

This document contains the complete audit of the Jyut.Toi codebase following the **DEBUG FREEZE** protocol.
Phase 1 audits and lists bugs without modifying application source files.

---

## Bug Inventory

| ID | Severity | Area | File:line | What happens | Repro | Root cause | Planned fix | Confirmed? |
|---|---|---|---|---|---|---|---|---|
| BUG-P0-01 | P0 | Audio / Speech | `src/services/speechEngine.js:169` | Audio speaks in Standard Mandarin (Putonghua) instead of Cantonese throughout the entire app (words, sentences, street labs, wet market). | Click any speaker icon (e.g. in StreetLabsView "Wet Market Produce Lab" or `speechEngine.speak("唔該")`). Audio file byte comparison with `zh-CN` is 100% byte-for-byte identical. | `playOnlineStream` uses unofficial Google Translate TTS endpoint with language code `tl=zh-HK`. Google Translate maps `zh-HK` to `zh-CN` (Mainland Mandarin) on this endpoint (`tl=yue` is Cantonese on Google Translate). Because `playOnlineStream` is Strategy 1, it executes before local Cantonese device voices and plays Mandarin. | Do not ship unofficial Google Translate endpoint in a store app. Prioritize verified Cantonese local device TTS (`zh-HK` / `yue-HK`) first. For tone drills, use pre-generated bundled audio. If `tl=yue` is kept anywhere as network fallback, prove Cantonese vs `zh-CN` via byte check. Add dev-only overlay/logging showing text, language code, voice name, and source. | Yes |
| BUG-P0-02 | P0 | Audio / Voice Selection | `src/services/speechEngine.js:54-59` | On systems with Taiwanese voices installed (or when `zh-HK` is missing), the speech synthesizer picks Taiwanese Mandarin voices to speak Cantonese. | On systems with `zh-TW` voices (e.g. `Meijia`, `Microsoft Hanhan`), `scoreCantoneseVoice` gives +20 points for `/^zh\b/.test(lang)` and lacks a penalty for `zh-TW` or Taiwan. | The scoring function awards positive points to all `zh` locales but only penalizes `zh-cn` and `cmn`, leaving `zh-tw` with a positive score of +20. | Strictly penalize `zh-tw`, `taiwan`, `guoyu`, `bopomofo` in `scoreCantoneseVoice`. Only accept voices with proven Cantonese markers (`zh-hk`, `zh-mo`, `yue`, `cantonese`). | Yes |
| BUG-P0-03 | P0 | Audio / Missing Voice | `src/services/speechEngine.js:223-226` | On devices with no Cantonese voice installed (e.g. Android devices or PCs without HK language pack), TTS silently plays Mandarin without any error. | When `preferredVoice` is null, `playSpeechSynthesis` sets `utterance.lang = 'zh-HK'` without specifying `utterance.voice`. Android / Chrome OS speech synthesis engine quietly falls back to default Chinese voice (Mandarin). | Missing voice on the device is not detected, failing silently instead of alerting the user. | Detect when no authentic Cantonese voice exists (`getAvailableVoices().length === 0`). Fail loudly and surface a clear toast/modal instructing the user to install the Cantonese voice pack in system settings, rather than silently playing Mandarin. | Yes |
| BUG-P0-04 | P0 | Audio / Cache | `src/services/speechEngine.js:167-171` | Audio cache is keyed only by text string, poisoning subsequent plays if language/voice changes or if Mandarin was previously cached. | Play an utterance once under Mandarin; subsequent requests for that text always play the cached Mandarin audio object regardless of voice or locale settings. | `audioCache` map uses `text` as the sole key (`this.audioCache.get(text)`). | Key cache by composite key `${lang}:${voice}:${text}`, and add a cache size limit (e.g. max 100 entries) to prevent unbounded memory growth. | Yes |
| BUG-P1-01 | P1 | State / Logic | `src/services/challengeAdapter.js:330-417` | Pattern slot exercises in Levels 16, 20, 22, 23, and 24 cannot be solved or completed; correct choices are evaluated as incorrect. | Open Station 16, 20, 22, 23, or 24 Pattern challenge, select correct slots. Evaluation checks `selectedAnswer.trim() === targetSentence.trim()` which fails due to mismatches (L16 missing "唔使", L20 missing "一籠", L22 missing "全部" and spacing, L23 missing "所以", L24 trailing space before "!"). | `targetSentence` in `PATTERN_REGISTRY` contains tokens and punctuation that are not in the slot options or fixed affixes. | Align `slots`, `fixedPrefix`, `fixedSuffix`, and `targetSentence` in `challengeAdapter.js` so that selecting the correct slots exactly reconstructs `targetSentence`. Add a validation test asserting all 24 levels can be solved. | Yes |
| BUG-P1-02 | P1 | State / Logic | `src/services/challengeAdapter.js:600` | Station 20 sentence scramble ("唔該 一籠 蝦餃 一籠 燒賣") cannot be completed; user cannot submit the required answer. | Launch Station 20 Sentence challenge. Notice only one "一籠" tile is available in the pool, but the target sentence requires two "一籠" tokens. | `pool = Array.from(new Set([...s.target, ...(s.pool || [])]))` de-duplicates tokens using `new Set()`, stripping the second "一籠". | Preserve target token counts when building the pool; only de-duplicate extra distractor tokens from `s.pool`. | Yes |
| BUG-P1-03 | P1 | State / Logic | `src/components/AppShell.jsx:53-64` | Launching remediation from Mistake Bank generates impossible, corrupted tone questions for multiple-choice errors (e.g. "Which tone is it? Pick the meaning", expected Tone 0, options [1, 2, 4, 6]). | Fail a multiple choice question in any station. Open Profile -> Mistake Bank -> Launch Remediation. | `handleLaunchRemediation` checks `typeof item.expected === 'number'` to identify tone questions. For multiple choice questions, `item.expected` is `correctIndex` (0, 1, or 2), which is a number! It converts multiple-choice mistakes into tone drills with `correctTone: 0`. | Store `nodeType`, `options`, and `hanzi` explicitly in `errorRecord` in `sessionStore.js`. In `handleLaunchRemediation`, check `item.type` instead of guessing from `typeof item.expected`. | Yes |
| BUG-P1-04 | P1 | Audio / Content | `src/services/challengeAdapter.js:93` | Station 12 scenario audio speaks "si1" (spells out "S-I-one" in English/Mandarin) instead of reading character "詩". | In Station 12 situational scenario, tap audio button. | `audioText` is set to `'si1'` (Jyutping) instead of `'詩'` (Chinese Hanzi). | Set `audioText: '詩'`. | Yes |
| BUG-P1-05 | P1 | Tone Studio / Content | `src/components/ToneStudioView.jsx:129-136` | In Tone Studio, drilling tones plays Mandarin Pinyin tones instead of Cantonese tones (e.g. 詩 -> shī, 史 -> shǐ, 試 -> shì, 時 -> shí, 市 -> shì, 事 -> shì). | Go to Sounds tab -> Tap tone contour cards or start Minimal Pair drill. | Direct consequence of BUG-P0-01 (live TTS speaking Mandarin). Tone drills must not rely on live TTS if Cantonese is not guaranteed. | Pre-generate and bundle verified Cantonese tone audio files in `public/audio/tones/` with expected Jyutping stored beside each file. Use bundled files in ToneStudioView, ToneVisualizer, and PhoneSimulator. | Yes |
| BUG-P1-06 | P1 | Audio / Content | `src/components/SifuExplainerModal.jsx:22-35` | In Sifu Explainer modal for vocabulary mistakes, tapping audio speaks English text (e.g. "Good morning") through Chinese TTS, producing mangled accented speech. | Get a vocabulary question wrong, open Sifu modal, tap audio button. | `expectedText` falls back to `node.options[node.correctIndex]`, which is English for vocabulary recognition questions (e.g. "Good morning"). It passes this string to `speechEngine.speak()`. | Use `node.hanzi || node.chinese` as the audio target in `SifuExplainerModal` rather than English option text. | Yes |
| BUG-P1-07 | P1 | Bundle Size / Compliance | `public/HK - Metro & Aesthetics/` | 14MB of unoptimized reference JPGs and design PDFs (`HKGong reference.pdf`) from another app are bundled into `dist/` and shipped in native mobile builds. | Inspect `dist/` directory after `npm run build`. 14MB folder is present. | Raw reference material was placed in `public/` directory instead of a non-bundled folder. (Git check: confirmed never committed to git history). | Move `public/HK - Metro & Aesthetics/` out of `public/` into an unbundled root directory (e.g. `docs/design-assets/`). | Yes |
| BUG-P1-08 | P1 | State / Wrong Data | `src/services/metroService.js:35-37`, `habitEngine.js:119-135` | New users start with hardcoded fake progress (480 XP, 7-day streak, 3 unlocked cultural cards, 25 audio listens) instead of genuine zero-state. | Clear localStorage and load app. Profile shows 480 XP and 7-day streak immediately. | Initial state definitions in `metroService.js` and `habitEngine.js` contain hardcoded test values. | Initialize default state with genuine zero-state (`xp: 0, streak: 0, unlockedCardIds: []` and 0 completed stats). | Yes |
| BUG-P1-09 | P1 | State / Falsy Fallbacks | `src/components/AppShell.jsx:156-157`, `habitEngine.js:211-212` | When `progress.streak` or `progress.xp` is 0, the UI falsely displays 7 streak and 480 XP due to `||` fallback. | Set `progress.streak = 0`. UI shows `7` because `0 || 7` evaluates to `7`. | Using logical OR (`||`) instead of nullish coalescing (`??`) on numeric values where 0 is a valid state. | Replace `||` with `??` for numeric values across the entire codebase. | Yes |
| BUG-P2-01 | P2 | Polling / Lifecycle | `src/components/StreetLabsView.jsx:341-351` | Ambient soundscape (wet market, cha chaan teng, tram) does not stop when user navigates away to another tab; it continues looping in the background indefinitely. | In Street Labs tab, toggle on "Wet Market" soundscape. Tap "Route" tab in BottomNav. Soundscape continues playing. | `StreetLabsView` has no unmount cleanup hook calling `acousticSimulator.stopSoundscape()`. | Add `useEffect(() => () => acousticSimulator.stopSoundscape(), [])` in `StreetLabsView`. | Yes |
| BUG-P2-02 | P2 | Battery / Background work | `src/services/acousticSimulator.js:125,199` | Web Audio intervals for tram bells and porcelain clinks run even when the browser tab is hidden or native app is in the background. | Start soundscape, minimize app or switch browser tabs. | No listeners for `visibilitychange` or Capacitor `appStateChange` to pause/resume audio context and timers. | Listen to `visibilitychange` and suspend/resume `AudioContext` and intervals accordingly. | Yes |
| BUG-P2-03 | P2 | State / Desynchronization | `src/services/api.js:306-343`, `metroService.js`, `habitEngine.js` | Streaks and progress are tracked in three separate incompatible storage keys (`app-v2-progress`, `jyut-toi-metro-progress`, `jyut-toi-habit-state`). | App.jsx displays streak from `appAPI` (0), while Profile displays streak from `habitEngine` (7). | Legacy `AppAPI` streak logic was kept alongside new `habitEngine` and `metroService` implementations. | Consolidate streak source of truth into `habitEngine` / `metroService` and deprecate `appAPI` streak duplicate. | Yes |
| BUG-P2-04 | P2 | Dead Code / Duplicate Paths | `src/components/metro/ExerciseShell.jsx` vs `src/components/exercises/ExerciseHost.jsx` | Two separate exercise runner implementations exist: `ExerciseShell.jsx` (with `StationExam`, `WordCard`, `TileWall`, `StationPlate`) and `ExerciseHost.jsx` (Zustand session runner). | `PhoneSimulator.jsx` on landing page imports `ExerciseShell`, while real app `AppShell.jsx` uses `ExerciseHost`. | Old exercise shell was retained for landing page phone preview while main app moved to ExerciseHost. | Align `PhoneSimulator` to use the unified exercise definitions and retire legacy `ExerciseShell`. | Yes |
| BUG-P2-05 | P2 | Data / CJK Coverage | `src/services/speechEngine.js:106`, `InteractiveCantoneseText.jsx:60` | Regex `[\u4e00-\u9fa5]` strips Cantonese characters in CJK Unified Ideographs Extension B/C/D/E (e.g. 𡃁, 𠵄, 𥄫) and strips all punctuation. | Pass Cantonese text containing extended characters or sentences with natural pauses. | Regex only checks basic CJK block `\u4e00-\u9fa5`. | Use Unicode property escape `\p{Script=Han}` or comprehensive CJK ranges, and preserve natural Cantonese punctuation for TTS cadence. | Yes |
| BUG-P2-06 | P2 | Performance / Input Lag | `src/components/LexiconView.jsx:103` | Fast typing in CC-Canto dictionary causes input lag because search across 25,400 entries runs synchronously on every keystroke with no debounce. | Type quickly in Lexicon search input. | `onChange` directly invokes `dictionaryEngine.search` without debounce. | Add 150ms debounce to Lexicon search input. | Yes |
| BUG-P3-01 | P3 | Dead Code | `src/components/`: `Countdown.jsx`, `Dashboard.jsx`, `Layout.jsx`, `MainChallenge.jsx`, `PhraseDisplay.jsx`, `WordChallenge.jsx` | 6 unused legacy Candle components remain in the repository. | Dependency graph scan from entry points confirms 0 imports in active application paths. | Leftover files from the Candle v1 codebase. | Delete the dead components. | Yes |
| BUG-P3-02 | P3 | Dead Code | `src/services/`: `geminiLessonGenerator.js`, `linguisticLinter.js`, `supabaseSyncService.js` | 3 unused service files with mock implementations are present in `src/services/`. | Dependency graph scan confirms 0 imports in active application paths. | Experimental or mock services created during development. | Delete or archive unreferenced service files. | Yes |
| BUG-P3-03 | P3 | Branding / Leftover References | `src/components/Countdown.jsx:24`, `PhoneSimulator.jsx:193-194` | Old Candle branding terminology ("SPARK", "DAILY SPARK") appears in code and strings. | Grep for "spark" in `src/`. | Legacy Candle branding strings were not renamed to Jyut.Toi transit terminology. | Remove dead `Countdown.jsx` and update `PhoneSimulator.jsx` tab and labels. | Yes |
| BUG-P3-04 | P3 | UI / Tooltip Positioning | `src/components/common/InteractiveCantoneseText.jsx:126-128` | Tooltip card overlays and blocks the tapped word if the word is near the top edge of the screen (`rect.top < 90`). | Tap a word near the top of the viewport. | Fixed `-90px` offset clamped to `top: 10px`. | Display tooltip below the word when `rect.top < 100`. | Yes |
| BUG-P3-05 | P3 | UI / Hardcoded Strings | `src/components/PhoneSimulator.jsx:198,239` | Landing page simulator displays hardcoded "Day 42 / 365" and "Tone 1 (uk1) + Tone 2 (kei2)" regardless of the displayed word. | Open landing page and view PhoneSimulator Daily Word. | Static placeholder copy was hardcoded into the component. | Dynamically compute the tones and day index from the active word. | Yes |
| BUG-P3-06 | P3 | Performance / Redundant Imports | `src/services/hapticsService.js:28,44,60,76` | Every single haptic tap triggers a dynamic `await import('@capacitor/haptics')` call even after the module was already imported at initialization. | Inspect `hapticsService.js` methods. | Redundant dynamic imports inside `tapLight`, `tapMedium`, `success`, `error`. | Cache the imported module and enum references from `init()`. | Yes |
| BUG-P3-07 | P3 | Wasted Network Work | `src/App.jsx:46` | App fetches legacy `/dictionary.json` (73KB) on mount via `appAPI.getTodaysContent()`, even though the user is in `AppShell` and never views it. | Observe network requests on app launch. | `App.jsx` still initializes legacy daily content in `useEffect`. | Remove unnecessary `loadData` call from `App.jsx` when running `AppShell`. | Yes |

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
