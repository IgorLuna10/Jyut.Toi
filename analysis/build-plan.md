# Implementation Roadmap & Milestone Build Plan

## 1. Project Overview & Target Architecture

This build plan outlines the implementation milestones for developing a modern, clean-room Cantonese learning application targeting iOS, Android, and Web.

- **Frontend Core**: React 18+ (TypeScript), Vite 5+, Tailwind CSS 3.4+.
- **Visual Identity**: Hong Kong Urban Aesthetic (High-contrast MTR station tiles, Cha Chaan Teng neon & jade green accents, Wet Market `#E60012` pendant lamp accents, crisp bilingual typography).
- **Mobile Container**: PWA-first development, packaged for native mobile via Capacitor 6+ (iOS via Xcode / Swift, Android via Gradle / Kotlin).
- **Audio Pipeline**: Dual-engine (Native `@capacitor-community/text-to-speech` for `zh-HK` + Web Audio API Ambient Noise Mixer).
- **Backend & Cloud**: Supabase (PostgreSQL 15+, Edge Functions, RLS) + RevenueCat (In-App Subscriptions) + AdMob/Web Ads.
- **Intelligence Layer**: Dynamic Gemini 2.5 Flash Curriculum Generation and Sifu Pedagogical Tutor via Edge Functions.

---

## 2. Milestone Roadmap

```
┌────────────────────────────────────────────────────────────────────────┐
│ M0: Scaffolding, Mobile Shell & Vibrant HK Design System (Week 1)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ M1: High-Performance Audio Engine & Offline Lexicon (Week 2)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ M2: Core Exercise Interactive Engine & State Store (Weeks 3-4)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ M3: Retention Loops, Gamification & Habit Mechanics (Week 5)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ M4: Street Situational Labs & Real-World Dialogues (Week 6)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ M5: Supabase Cloud Sync & Frictionless Monetization (Week 7)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ M6: Gemini AI Dynamic Lesson Generator & Sifu Tutor (Weeks 8-9)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ M7: Native Capacitor Shell, QA & Store Submission (Week 10)            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Milestone Tasks & Acceptance Criteria

### Milestone 0: Scaffolding, Mobile Shell & Vibrant HK Design System
**Objective**: Establish the unified codebase, responsive mobile layout, and the distinctive Hong Kong visual identity.

- [ ] **Task 0.1: Tailwind CSS Hong Kong Urban Theme**:
  - Configure color tokens: MTR station reds, Admiralty teal, Cha Chaan Teng jade green (`#00A86B`), milk tea amber (`#F5A623`), Wet Market red (`#E60012`), and subway slate.
  - Implement rivet-corner enamel station plates (`StationPlate.jsx`) and ceramic tile wall backgrounds (`TileWall.jsx`).
  - Configure safe area utility classes (`pb-safe`, `pt-safe`, `touch-manipulation`).
- [ ] **Task 0.2: PWA Web Shell & Fluid Navigation**:
  - Implement 5-tab persistent bottom bar: MTR Line Map (Learn), Tone Studio, Street Labs, Quick Lexicon, and Commuter Profile.
  - Full-screen modal transitions simulating MTR platform screen doors opening/closing.

**Acceptance Criteria**: App runs smoothly at 60fps in mobile viewport; visual identity feels unmistakably Hong Kong—busy, sharp, and vibrant without warm cream bloat.

---

### Milestone 1: High-Performance Audio Engine & Offline Lexicon
**Objective**: Guarantee native Cantonese pronunciation fidelity and sub-10ms offline dictionary search.

- [ ] **Task 1.1: Native Dual TTS Pipeline**:
  - Integrate `@capacitor-community/text-to-speech` with Web Speech API browser fallback.
  - Implement `scoreCantoneseVoice` heuristic to discover and prioritize enhanced `zh-HK` system voices, strictly filtering out Mandarin voices.
- [ ] **Task 1.2: Acoustic Simulator (Ambient Noise Mixer)**:
  - Build Web Audio API soundscape player with looped audio buffers: Wet Market chatter, Cha Chaan Teng diner clatter, and Street Tram bells.
  - Auto-ducking: ambient noise reduces by 40% when speech playback starts and restores smoothly when finished.
- [ ] **Task 1.3: CC-Canto Offline Search Engine**:
  - Pre-index CC-Canto dataset into client-side compressed trie/JSON (<6MB).
  - Instant multi-index search: Traditional Hanzi match, tone-agnostic Jyutping match, and English definition substring search.

**Acceptance Criteria**: Tapping any Cantonese word speaks clear Hong Kong Cantonese audio; dictionary searches across 20,000+ entries return results in <10ms without network connectivity.

---

### Milestone 2: Core Exercise Interactive Engine & State Store
**Objective**: Build the interactive mechanics for all foundational pedagogical exercises.

- [ ] **Task 2.1: Zustand State Store**:
  - Centralized store with local persistence middleware.
  - Manage active practice sessions, review queues, user preferences, and daily mission counters.
- [ ] **Task 2.2: Sentence Scramble / Builder Component**:
  - Tactile word tiles that snap into place upon touch.
  - Real-time sentence validation against target Cantonese syntactic order.
  - Shake animation on mistake; celebratory pop on success.
- [ ] **Task 2.3: Tone Minimal-Pair Discrimination Drill**:
  - A/B comparison audio triggers with visual tone pitch contour curves (Tones 1 through 6).
- [ ] **Task 2.4: Multiple Choice Translation & Audio Comprehension**:
  - Audio-first listening mode (characters hidden until answered) and reading mode.
  - Category-clustered semantic distractors.
- [ ] **Task 2.5: Pattern Slot Substitution Workbench**:
  - Interactive formula runner (e.g., `[Time] + [Subject] + 喺 + [Location] + [Verb]`).

**Acceptance Criteria**: Learners can smoothly progress through a 10-question mixed practice set with instant evaluation and zero UI stutter.

---

### Milestone 3: Retention Loops, Gamification & Habit Mechanics
**Objective**: Build habit-forming feedback loops that maximize daily retention.

- [ ] **Task 3.1: XP & Dynamic Leveling Engine**:
  - Linear progression curve ($100 \text{ XP} = 1 \text{ Level}$).
  - Consecutive correct combo multipliers (x5, x10 milestone alerts).
- [ ] **Task 3.2: Streak & Calendar Consistency Tracker**:
  - Timezone-aware daily streak calculation.
  - Weekly commuter schedule showing daily completion stars.
- [ ] **Task 3.3: Three-Tier Daily Mission System**:
  - Daily mission board: 5 Sentences Assembled, 3 Tone Drills, 10 Audio Listens.
  - Bonus +50 XP and confetti celebration upon completing all three targets.
- [ ] **Task 3.4: Mistake Bank (Targeted Remediation)**:
  - Automatically captures missed quiz questions or tone pairs with error timestamps.
  - Dedicated "Clear All Errors" drill launcher.
- [ ] **Task 3.5: Cultural Collectible Vault**:
  - Unlockable digital enamel cards celebrating Hong Kong heritage (Ding Ding Tram, Milk Tea, Star Ferry).
  - Rewarded on achieving 3 Daily Stars.

**Acceptance Criteria**: Progress persists across app restarts; streak increments reliably; mistake bank accumulates and clears errors accurately.

---

### Milestone 4: Street Situational Labs & Real-World Dialogues
**Objective**: Provide authentic immersion through realistic street scenarios and conversational roleplay.

- [ ] **Task 4.1: Cha Chaan Teng Lab**:
  - Interactive lunch rush simulation: ordering customized drinks (走冰, 少甜, 凍飲) and breakfast sets (A餐, 多士, 煎蛋).
- [ ] **Task 4.2: Wet Market Produce Bargaining Lab (街市)**:
  - Purchasing produce by the catty (斤), checking freshness of live fish (游水魚), and asking for green onions (送兩條蔥).
- [ ] **Task 4.3: Supermarket & Convenience Store Lab**:
  - Paying with Octopus (嘟八達通), declining plastic bags (唔使膠袋), and requesting receipts.
- [ ] **Task 4.4: MTR Subway & Minibus Public Transit Lab**:
  - Asking for station exits, transferring lines, and shouting for the minibus stop (前面有落唔該).

**Acceptance Criteria**: Learners can complete interactive multi-turn dialogue trees with branching choices and pragmatic politeness evaluations.

---

### Milestone 5: Supabase Cloud Sync & Frictionless Monetization
**Objective**: Enable cross-device sync and establish an ad-supported to ad-free premium revenue engine.

- [ ] **Task 5.1: Supabase Authentication**:
  - Support Sign in with Apple, Google OAuth, and Email Magic Links.
  - Guest mode with zero onboarding friction; seamlessly link guest state to newly registered accounts.
- [ ] **Task 5.2: Offline-First Cloud Sync Protocol**:
  - Debounced (700ms) background push of `user_state` payload to PostgreSQL.
  - Conflict resolution using ISO timestamp vectors (`savedAt`).
- [ ] **Task 5.3: Frictionless Free-to-Premium Revenue Model**:
  - Free Tier: Full access to all core levels (A1 to B2) and CC-Canto dictionary, supported by subtle banner ads.
  - Pro Tier: RevenueCat monthly/annual subscription removing all ads, unlocking all deep Street Situational Labs, and providing unlimited AI tutor turns.
  - Native StoreKit / Google Play receipt restore flow.

**Acceptance Criteria**: Seamless cloud restore when logging in on a secondary device; purchase flow unlocks premium entitlements instantly without blocking free learners from core progression.

---

### Milestone 6: Gemini AI Dynamic Lesson Generator & Sifu Tutor
**Objective**: Deploy Gemini 2.5 Flash via Supabase Edge Functions to eliminate the content ceiling.

- [ ] **Task 6.1: Supabase Edge Functions for Gemini 2.5 Flash**:
  - Secure API proxy dispatching structured JSON prompts to Gemini.
  - Rate limiting and per-user token quotas.
- [ ] **Task 6.2: Automated Quality Gate & Linguistic Linter**:
  - Zod structural validation against `lesson-schema.json`.
  - Anti-Mandarin vocabulary regex scanner (flags forbidden markers like 的, 在, 吃, 看).
  - Deterministic Jyutping validator checking syllables against CC-Canto.
- [ ] **Task 6.3: Multi-User Curriculum Caching Pool**:
  - Store validated generated lessons in Supabase PostgreSQL indexed by level, topic, and grammar tags.
  - Re-serve cached lessons for identical proficiency levels to maintain high gross margins.
- [ ] **Task 6.4: Interactive "Sifu Explainer"**:
  - One-tap "Why was I wrong?" modal providing concise, 2-sentence linguistic explanations of failed answers.

**Acceptance Criteria**: Gemini generator produces fully validated, structured lessons in under 3.5 seconds; linguistic filter catches 100% of synthetic Mandarin test intrusions; explainer provides accurate Cantonese grammatical contrast.

---

### Milestone 7: Native Capacitor Shell, QA & Store Submission
**Objective**: Package the optimized web app into native iOS and Android binaries.

- [ ] **Task 7.1: Capacitor Native Shell Integration**:
  - Add native iOS platform via Xcode (`npx cap add ios`) and Android platform via Gradle (`npx cap add android`).
  - Configure native splash screen, app icons, and status bar behavior.
- [ ] **Task 7.2: Mobile Performance & Offline Audit**:
  - Confirm 60fps scrolling and transition animations on mid-range devices.
  - Verify complete functionality in Airplane Mode (offline dictionary, cached lessons, local audio).
- [ ] **Task 7.3: Haptics & Native Interaction**:
  - Integrate `@capacitor/haptics` for subtle impact feedback on button taps, correct answers, and error shakes.
- [ ] **Task 7.4: Store Compliance & Asset Preparation**:
  - Apple App Store review compliance (In-App Purchase restore button, Account Deletion button).
  - Google Play Target API 34+ compliance.

**Acceptance Criteria**: Clean builds archived via Xcode and Gradle; passing Apple App Store and Google Play Store automated pre-launch checks.
