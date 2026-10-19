# Technical Architecture & Systems Specification

## 1. System Architecture Overview

The application combines the high-retention session mechanics of **Duolingo** with the specialized tonal and acoustic pedagogical depth of **colloquial Hong Kong Cantonese**, wrapped in a responsive, offline-first React and Capacitor architecture.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                Capacitor Mobile Shell                                  │
│                                                                                        │
│  ┌───────────────────────┐          ┌──────────────────────┐   ┌────────────────────┐  │
│  │ Native Text-to-Speech │          │ RevenueCat & AdMob   │   │ Device Persistence │  │
│  │ (zh-HK Siri / Google) │          │ (StoreKit / Ads)     │   │ (IndexedDB/Prefs)  │  │
│  └──────────▲────────────┘          └──────────▲───────────┘   └─────────▲──────────┘  │
│             │                                  │                         │             │
│  ┌──────────▼──────────────────────────────────▼─────────────────────────▼──────────┐  │
│  │                            React 18+ Web Application                             │  │
│  │                                                                                  │  │
│  │  ┌────────────────────────────────────────────────────────────────────────────┐  │  │
│  │  │ Duolingo-Grade Session Engine & State Machine (Queue + End-of-Run Retry)   │  │  │
│  │  └─────────────────────────────────────▲──────────────────────────────────────┘  │  │
│  │                                        │                                         │  │
│  │  ┌─────────────────────────┐           │            ┌─────────────────────────┐  │  │
│  │  │ MTR Transit Path & UI   │───────────┼───────────►│ Audio & Acoustic Mixer  │  │  │
│  │  │ (Metro Line Progress)   │           │            │ (Web Audio API Ducking) │  │  │
│  │  └─────────────────────────┘           │            └─────────────────────────┘  │  │
│  │                                        │                                         │  │
│  │  ┌─────────────────────────┐           │            ┌─────────────────────────┐  │  │
│  │  │ Offline CC-Canto Lexicon│◄──────────┴───────────►│ Gemini 2.5 AI Adapter   │  │  │
│  │  │ (Sub-10ms Trie Search)  │                        │ (Dynamic Lessons & Sifu)│  │  │
│  │  └─────────────────────────┘                        └─────────────────────────┘  │  │
│  └────────────────────────────────────────▲─────────────────────────────────────────┘  │
└───────────────────────────────────────────┼────────────────────────────────────────────┘
                                            │ HTTPS / WSS
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                            Supabase Serverless Infrastructure                          │
│                                                                                        │
│  ┌─────────────────────────┐    ┌──────────────────────────┐    ┌───────────────────┐  │
│  │ Supabase Auth (OAuth)   │    │ PostgreSQL Database      │    │ Edge Functions    │  │
│  │ (Apple / Google / Guest)│    │ (RLS + Cloud User State) │    │ (Gemini 2.5 Flash)│  │
│  └─────────────────────────┘    └──────────────────────────┘    └───────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The Duolingo-Inspired Session Engine & State Machine

Duolingo’s enduring product advantage lies in its bite-sized, deterministic **Session State Machine**. Rather than displaying uncoordinated static flashcards, learning occurs inside a tight, gamified interactive session queue.

```
       ┌────────────────────────┐
       │ Session Initialization │ (Fetch 10-12 Challenges from Core/Mistakes/AI)
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
   ┌──►│ Pop Next Challenge     │◄──────────────────────────────────┐
   │   └───────────┬────────────┘                                   │
   │               │                                                │
   │               ▼                                                │
   │   ┌────────────────────────┐                                   │
   │   │ Render Challenge Node  │                                   │
   │   │ (Scramble/Tone/MCQ/Lab)│                                   │
   │   └───────────┬────────────┘                                   │
   │               │ User Submits Answer                            │
   │               ▼                                                │
   │   ┌────────────────────────┐                                   │
   │   │ Evaluation & Feedback  │                                   │
   │   └─────┬────────────┬─────┘                                   │
   │         │ Correct    │ Incorrect                               │
   │         ▼            ▼                                         │
   │   ┌───────────┐ ┌──────────────────────────────────────────┐   │
   │   │ Advance   │ │ Push Failed Challenge to End of Queue    │───┤
   │   │ Progress  │ │ (Leitner Immediate Re-test Loop)         │   │
   │   │ Bar       │ │ + Add to Persistent Mistake Bank         │   │
   │   └─────┬─────┘ └──────────────────────────────────────────┘   │
   │         │                                                      │
   │         ▼                                                      │
   │   [ Queue Empty? ] ──No────────────────────────────────────────┘
   │         │
   │         Yes (All Challenges Mastered)
   │         ▼
   │   ┌────────────────────────┐
   └───│ Session Victory Screen │
       │ (+XP, Combo, Stars)    │
       └────────────────────────┘
```

### 2.1. Challenge Node Typology
Every session in the queue implements a unified TypeScript contract:

```typescript
export type ChallengeType = 
  | 'token_scramble'       // Tap tiles in syntactic order
  | 'tone_discrimination'  // Minimal pair A/B acoustic pitch check
  | 'listening_cloze'      // Audio prompt -> fill missing syllable
  | 'dialogue_turn'        // Branching situational conversational choice
  | 'pattern_slot'         // Formulaic grammar slot substitution
  | 'speed_reflex';        // Rapid-fire word/definition pairing

export interface ChallengeNode {
  id: string;
  type: ChallengeType;
  prompt: string;
  hanzi: string;
  jyutping: string;
  english: string;
  audioKey?: string;
  ambientNoise?: 'none' | 'cha-chaan-teng' | 'wet-market' | 'street';
  payload: Record<string, any>;
  explanation?: string;
}

export interface SessionState {
  sessionId: string;
  stationName: string;
  queue: ChallengeNode[];
  initialCount: number;
  completedCount: number;
  activeNode: ChallengeNode | null;
  status: 'idle' | 'in_progress' | 'feedback_correct' | 'feedback_error' | 'completed';
  errorsEncountered: ChallengeNode[];
  startTime: number;
}
```

### 2.2. End-of-Run Retry Loop (Guaranteed Mastery)
- If a learner gets an answer wrong:
  1. The UI displays an immediate red bottom-sheet feedback drawer with the correct answer and an optional "Ask Sifu Why" explainer button.
  2. The failed item is recorded in the session's `errorsEncountered` log and appended to the end of the active `queue`.
  3. The learner cannot complete the station stop until every failed challenge is repeated and answered correctly.
- This psychological loop guarantees immediate reinforcement before the session concludes.

---

## 3. The MTR Transit Route Progression Architecture

Duolingo’s linear "Path" maps naturally to a Hong Kong **MTR Subway Route Map**:

```
[ Line 1: Tsuen Wan Line (Tonal & Food Foundations) ]
       │
       ├─ Station 01: Central (中環) ── Essentials & Politeness
       │     ├─ Stop 1: Personal Pronouns & Greetings (我, 你, 佢, 早晨)
       │     ├─ Stop 2: Tone 1 vs Tone 4 Acoustic Discrimination
       │     └─ 🚇 Station Exam: Checkpoint Test
       │
       ├─ Station 02: Admiralty (金鐘) ── Cha Chaan Teng Dining
       │     ├─ Stop 1: Ordering Drinks (凍檸茶, 少甜, 走冰)
       │     ├─ Stop 2: Sentence Scramble with Aspect Marker 咗 (zo2)
       │     ├─ Stop 3: Interactive Waiter Roleplay Lab
       │     └─ 🚇 Station Exam: Checkpoint Test
       │
       └─ Station 03: Mong Kok (旺角) ── Street Snacks & Transit
             ├─ Stop 1: Street Food Vocab (魚蛋, 雞蛋仔, 臭豆腐)
             ├─ Stop 2: Minibus Alighting Command (前面有落唔該)
             └─ 🚇 Station Exam: Checkpoint Test
```

### 3.1. Visual Representation
- **Active Node**: Pulsing neon platform beacon in the current line color.
- **Completed Nodes**: Solid enamel station plates with corner rivets.
- **Locked Nodes**: Dim subway tunnel outline with track rails.

---

## 4. Visual Token & Design System Architecture

### 4.1. The Vibrant Hong Kong Urban Palette
The design system avoids muted beige or warm cream palettes, using high-contrast urban Hong Kong tokens:

```css
:root {
  /* MTR Transit Lines */
  --hk-mtr-red: #C8231F;          /* Mong Kok / Central station enamel */
  --hk-mtr-teal: #2E8B7F;         /* Admiralty / Quarry Bay station */
  --hk-mtr-ochre: #B8860B;        /* Tsim Sha Tsui station */
  --hk-mtr-blue: #0038A8;         /* Island Line deep blue */

  /* Cha Chaan Teng & Dining */
  --hk-cct-jade: #00A86B;         /* Vintage diner jade mosaic tiles */
  --hk-cct-amber: #F5A623;        /* Milk tea amber accent */
  --hk-cct-steel: #334155;        /* Stainless steel booth edging */

  /* Wet Market (街市) */
  --hk-market-red: #E60012;       /* Iconic red pendant lamp hue */
  --hk-market-chalk: #FFFFFF;     /* Sharp white price placard text */

  /* Dark Subway Substrate */
  --hk-subway-dark: #0F172A;      /* Night mode station tunnel slate */
  --hk-subway-surface: #1E293B;   /* Elevated card surface */
  --hk-subway-border: #334155;    /* High-contrast enamel border */
}
```

---

## 5. Technology Stack & Runtime Configuration

- **Frontend Core**: React 18.3+ with TypeScript.
- **Build Engine**: Vite 5+ with `@vitejs/plugin-react-swc`.
- **Styling Architecture**: Tailwind CSS 3.4+ configured with custom Hong Kong MTR/Diner tokens.
- **Mobile Container**: PWA-first packaging into Capacitor 6.x.
  - `@capacitor/core`: Native web-view bridge.
  - `@capacitor-community/text-to-speech`: Direct binding to iOS `AVSpeechSynthesizer` and Android `android.speech.tts.TextToSpeech`.
  - `@revenuecat/purchases-capacitor`: Native in-app subscriptions and entitlements.
  - `@capacitor-community/admob` (or Web Ad fallback): Unobtrusive banner ads for free-tier sustainability.
- **AI Engine**: Google Gemini API (`gemini-2.5-flash` as primary, `gemini-2.0-flash` fallback) executed via secure Supabase Edge Functions.

---

## 6. Audio & Acoustic Architecture

### 6.1. Native Dual-Layer Speech Engine
1. **Native Capacitor Text-To-Speech (Mobile Priority)**:
   - Queries system TTS for the `zh-HK` or `yue-HK` locale.
   - iOS: Prioritizes enhanced Siri voices (Sin-ji, Danny).
   - Android: Binds to Google Cantonese TTS engine.
2. **Web Speech API (`window.speechSynthesis`) (Browser Preview & PWA)**:
   - Dynamic voice ranking algorithm:
     - Boosts: `zh-hk` (+100), `yue` (+120), `enhanced` (+40).
     - Penalizes: `zh-cn` (-180), `cmn` (-180) to eliminate Mandarin voice bleed.

### 6.2. Acoustic Simulator (Ambient Noise Mixer)
Built using the Web Audio API to prepare learners for real-life comprehension:
- **Audio Loops**: Looped stereo ambient tracks representing three quintessential Hong Kong listening environments:
  - `wet-market`: Bustling street market with vendor calls.
  - `cha-chaan-teng`: Diner ambience with clattering porcelain tea cups and rapid waiter chatter.
  - `street-traffic`: Urban street ambience with tram bells ("Ding Ding") and distant traffic.
- **Dynamic Ducking**: When speech synthesis plays, ambient noise volume ducks by 40% automatically, mimicking human auditory focus.

---

## 7. Offline Dictionary Engine (CC-Canto Data Layer)

The application bundles an optimized offline lexicon derived from CC-Canto and CEDICT:
- **Trie Indexing**: Instant prefix searching for Jyutping without tone numbers (e.g., `sik`) and with tone numbers (e.g., `sik6`).
- **Normalized Character Map**: Cross-references Traditional Hanzi (`食`), Simplified Hanzi (`吃`), Jyutping, and English definitions.
- **Speed**: Sub-10ms search query resolution executing fully on-device without network latency.

---

## 8. Persistence & Free-to-Premium Revenue Pipeline

### 8.1. Offline-First Local State
- State is managed via Zustand with local persistence in `localStorage` / `IndexedDB`:
  - `user_prefs`: Theme, sound volume, voice rate, noise settings.
  - `learning_progress`: Word familiarity, XP, streak history.
  - `mistake_bank`: Failed items with error frequency counters.
  - `situational_progress`: Completed street survival scenarios.

### 8.2. Cloud Synchronization Contract
When an account is authenticated, local state syncs to Supabase via debounced upserts to `public.user_state`:

```sql
CREATE TABLE public.user_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    auth_subject TEXT NOT NULL,
    payload JSONB NOT NULL,
    schema_version INT NOT NULL DEFAULT 1,
    client_updated_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_state_user UNIQUE (user_id),
    CONSTRAINT uq_user_state_subject UNIQUE (auth_subject)
);
```

### 8.3. Revenue & Entitlement Pipeline
- **Free Tier**: 100% core levels unlocked; banner ad-supported; 1 free AI lesson/day; starter situational labs.
- **Pro Tier (RevenueCat Entitlement: `premium`)**:
  - `canto_premium_monthly` ($7.99/mo) / `canto_premium_yearly` ($49.99/yr).
  - Eliminates all ads.
  - Unlocks all Street Situational Labs (Cha Chaan Teng, Wet Market, Supermarket, MTR/Minibus).
  - Unlimited AI Sifu Conversational Practice.
  - Full Acoustic Simulator soundscapes.
