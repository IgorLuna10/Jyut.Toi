# Product Feature Matrix & Functional Specification

## 1. Executive Summary & Product Vision

This specification defines the functional architecture, learning mechanics, and product taxonomy for a modern, cross-platform Cantonese language learning application (built with React, Tailwind CSS, and Capacitor for iOS and Android). 

The application targets colloquial Hong Kong Cantonese (廣東話) with standard Jyutping romanization. It bridges the gap between mechanical vocabulary drills and real-world fluency through immersive acoustic training, contextual sentence construction, tone discrimination drills, and authentic conversational simulations.

### 1.1. Visual & Cultural Identity: Busy, Sharp & Vibrant
Unlike conventional language apps that rely on muted pastels or warm cream backgrounds, this app embodies the distinct aesthetic of urban Hong Kong:
- **Cha Chaan Teng (茶餐廳) Energy**: High-contrast jade greens, diner ticket headers, stainless-steel edge borders, and neon amber accents.
- **MTR Metro Signage**: Crisp station enamel plates, high-visibility platform indicators, sharp bilingual typography, and color-coded line themes (e.g., Mong Kok red, Admiralty teal, Central crimson).
- **Wet Market (街市) Sharpness**: Vibrant wet-market lamp reds (`#E60012`), bold high-contrast price tags, and energetic, compact spacing.
- **Lightweight & Snappy**: Built with pure CSS micro-interactions and vector SVG iconography, avoiding bloated raster animations to ensure a fluid 60fps experience on mobile devices.

---

## 2. Feature Prioritization Matrix

Features are classified into three implementation tiers:
- **Must-Have (P0 / MVP)**: Essential core learning loop, pedagogical baseline, and natural free-to-paid conversion foundation.
- **Nice-to-Have (P1 / Fast Follow)**: Engagement boosters, retention accelerators, and deep cultural features.
- **Skip (Anti-Patterns)**: Low pedagogical ROI, high maintenance, or engagement traps identified in legacy mobile language apps.

| Feature Area | Specific Capability | Priority | Rationale & Redesign Strategy |
| :--- | :--- | :--- | :--- |
| **Curriculum** | Open Level Progression (A1 Starter to B2 Fluency) | **Must-Have** | Complete milestone map without artificial lockouts. All core grammatical progressions remain accessible to free learners. |
| **Curriculum** | Combinatorial Brittle Sentence Generators | **Skip** | Legacy rule-based sentence concatenators generate robotic, ungrammatical phrasing. Replaced with validated AI generation. |
| **Exercise** | Tone Minimal-Pair Discrimination Drill | **Must-Have** | Critical differentiator for tonal languages. Teaches tone contour distinction via acoustic A/B testing with pitch wave visuals. |
| **Exercise** | Sentence Token Scramble / Builder | **Must-Have** | Active recall for syntactic ordering and aspect markers (咗, 緊, 過, 起). |
| **Exercise** | Multi-Choice Translation & Listening Drill | **Must-Have** | Fast comprehension check with bilingual prompts and audio playback. |
| **Exercise** | Pattern Slot Substitution Workbench | **Must-Have** | Teaches sentence formulas (e.g., Subject + 喺 + Place + Verb + Object). |
| **Exercise** | Spaced Repetition Flashcards (SRS) | **Must-Have** | Character + Jyutping + meaning recall with review scheduling. |
| **Exercise** | Multi-Round Boss Milestone Challenge | **Must-Have** | Timed checkpoint combining translation, tones, and character recognition. |
| **Exercise** | Contextual Situational Simulations (Street/Diner) | **Must-Have** | Real-world survival scenarios (Ordering at Cha Chaan Teng, Wet Market bargaining, Supermarket checkout, MTR navigation). |
| **Exercise** | Rapid-Fire Word Reflex ("Speed Match") | **Nice-to-Have** | Gamified fluency drill testing immediate recall under time pressure. |
| **Exercise** | Memory Concentration Game (vs CPU) | **Skip** | Low pedagogical density; card-flipping spends time on spatial memorization rather than language acquisition. |
| **Exercise** | Tile-Matching Mini-Game ("Match-3") | **Skip** | Distracts from language immersion; high development overhead for casual arcade mechanics. |
| **Audio** | Native Dual TTS Engine (zh-HK Priority) | **Must-Have** | Low-latency speech synthesis prioritizing high-quality Hong Kong voices. |
| **Audio** | Real-World Acoustic Simulator (Ambient Noise) | **Must-Have** | Optional café, wet market, and street noise overlay to train listening comprehension in real-world environments. |
| **Reference** | Instant Offline Cantonese Dictionary (CC-Canto) | **Must-Have** | Fast sub-10ms offline search supporting Traditional Hanzi, Jyutping, and English. |
| **Reference** | Slang & Pragmatic Expression Explorer | **Must-Have** | Indexed by communicative intent (e.g., frustration, agreement, teasing) with tone etiquette warnings. |
| **Gamification**| Daily Streak & Weekly Consistency Tracking | **Must-Have** | Proven retention driver for habit formation. |
| **Gamification**| Multi-Tier Daily Missions (Listens, Tones, Quizzes)| **Must-Have** | Explicit daily finish lines (e.g., 3 tone drills, 5 sentences). |
| **Gamification**| Mistake Bank & Weak Point Repair | **Must-Have** | Automatic capture of wrong answers with targeted re-drilling. |
| **Gamification**| Hong Kong Cultural Collectible Cards | **Nice-to-Have** | Milestone rewards celebrating local culture (food, transit, heritage). |
| **Account** | Offline-First Guest Mode with Cloud Sync | **Must-Have** | Immediate onboarding without mandatory sign-up; background sync to cloud upon authentication. |
| **Monetization**| Seamless Free-to-Premium Funnel (Ads $\rightarrow$ Pro) | **Must-Have** | Full core learning is free (ad-supported). Pro removes ads and unlocks deep situational simulations and unlimited AI tutor turns. |
| **Monetization**| Hard Artificial Paywalls on Core Levels | **Skip** | Never lock basic vocabulary or core levels. Invite conversion through premium contextual value, not arbitrary friction. |

---

## 3. Screen Inventory & User Flows

```
[ Cold Launch ] ──► [ Seamless Guest Boot ] ──► [ Subway Line Selector / Onboarding ]
                                                          │
                                                          ▼
                                                [ MTR Central Terminal / Dashboard ]
   ┌───────────────────────┬──────────────────────────────┼──────────────────────────────┬─────────────────────────┐
   ▼                       ▼                              ▼                              ▼                         ▼
[ Station Map / Learn ] [ Tone Acoustic Studio ]    [ Street Situational Labs ]   [ Quick Lexicon ]     [ Commuter Profile ]
   │                       │                              │                              │                         │
   ├─ Core Sentence Run    ├─ A/B Contour Drills          ├─ Cha Chaan Teng Lab          ├─ CC-Canto Search        ├─ Daily Streak Board
   ├─ Grammar Workbench    ├─ In-Noise Sentence Practice  ├─ Wet Market Bargaining Lab   ├─ Slang & Mood Index     ├─ Mistake Repair Bank
   ├─ Boss Station Exam    └─ Acoustic Ambient Mixer      ├─ Supermarket & Convenience   └─ Particle Playbook      ├─ Enamel Card Vault
   └─ Free Daily AI Lesson                                └─ MTR Transit & Minibus Lab                             └─ Ad-Free Pro Upgrade
```

### 3.1. Screen-by-Screen Specifications

#### Screen 1: Seamless Onboarding (MTR Station Entrance)
- **Visuals**: Clean MTR turnstile / station entrance aesthetic with high-contrast signage.
- **Components**:
  - Target proficiency selector (Station 1: Starter A1, Station 2: Commuter A2, Station 3: Local Resident B1+).
  - Motivation selector: Dining & Food Culture, Real-World Urban Navigation, Work & Living, Colloquial Banter & Slang.
  - Audio verification: "Ding Dong" platform sound check verifying Cantonese voice output.
  - Guest boot: Instant entry with zero mandatory login.

#### Screen 2: Central Terminal (Main Dashboard)
- **Visuals**: Dark enamel plate header with vibrant neon station accent colors, sharp contrast typography.
- **Components**:
  - **Next Train Departures (Daily Missions)**: 3 high-contrast objective bars (e.g., 5 Sentences Assembled, 3 Tone Discriminations, 10 Spoken Audios).
  - **Streak Station Board**: Bold digital counter tracking daily consecutive practice.
  - **Station Progress Line**: Interactive route map representing grammatical milestones.
  - **Mistake Bank Depot**: Instant indicator showing active items requiring review.

#### Screen 3: Learning Studio (Sentence Scramble & Grammar Workbench)
- **Visuals**: Cha Chaan Teng order slip / MTR route strip aesthetic with sharp tile edges.
- **Components**:
  - **Prompt Display**: English prompt with toggleable ruby Jyutping and audio trigger.
  - **Token Selection Area**: High-contrast, tactile word tiles that snap into place.
  - **Grammar Workbench**: Slot substitution formula (e.g., `[Time] + [Subject] + 喺 + [Location] + [Verb]`).
  - **Immediate Acoustic Feedback**: Crisp, snappy positive chimes or gentle error vibration.

#### Screen 4: Tone Acoustic Studio
- **Visuals**: Neon waveform oscilloscope aesthetic contrasting sharp tone contours.
- **Components**:
  - **Mode Toggles**: Single Syllable Minimal Pairs vs. In-Sentence Tone Discrimination.
  - **Acoustic Simulator Selector**: Background noise overlay (Off, Wet Market, Busy Cha Chaan Teng, Street Tram).
  - **Comparison Triggers**: High-contrast "Play A" vs. "Play B" buttons.
  - **Tone Contour Graphic**: Visual pitch line demonstrating the 6 Cantonese tones:
    - Tone 1: High flat ($55$)
    - Tone 2: High rising ($25$)
    - Tone 3: Mid flat ($33$)
    - Tone 4: Low falling ($21$)
    - Tone 5: Low rising ($23$)
    - Tone 6: Low flat ($22$)

#### Screen 5: Street Situational Labs (Contextual Exercises)
- **Visuals**: Immersive Hong Kong settings with sharp, busy, colorful environmental illustrations:
  1. **Cha Chaan Teng Lab**: Deciphering scribbled handwritten receipts, ordering milk tea (走甜 - less sweet), egg tarts, and pineapple buns with iced butter.
  2. **Wet Market Lab (街市)**: Negotiating with vegetable and seafood vendors, asking prices per catty (一斤幾多錢?), and requesting free scallions/ginger (送兩條蔥得唔得呀?).
  3. **Supermarket & Convenience Store**: Paying via Octopus card (八達通), asking for plastic bags, and requesting paper receipts.
  4. **MTR & Public Transit**: Navigating platform interchanges, asking for exits, and shouting "Next stop please!" on a red minibus (前面有落唔該!).
- **Components**: Multi-step interactive dialogue with branching choices, audio stems, and pragmatic politeness scores.

#### Screen 6: Quick Lexicon & Slang Directory
- **Visuals**: Fast, dense, high-utility dictionary with instant sub-10ms search.
- **Components**:
  - Fast search input supporting Traditional Hanzi, Simplified Hanzi, Jyutping, and English.
  - CC-Canto full offline dataset.
  - Colloquial Slang Index categorized by mood: Frustration, Teasing, Agreement, Sarcasm.
  - Hong Kong particle guide (咗, 緊, 埋, 晒, 啦, 㗎, 咩).

#### Screen 7: Commuter Profile & Card Vault
- **Visuals**: Enamel souvenir card collection with glossy metallic borders.
- **Components**:
  - Full lifetime XP, Level, and Vocabulary Mastered counts.
  - Mistake Bank: One-tap "Clear All Errors" drill launcher.
  - Cultural Card Vault: Collectible cultural icons earned on 3-star daily completions (Ding Ding Tram, Milk Tea, Star Ferry).
  - Premium Upgrade Hub: Clear value comparison (Ad-free flow, all Situational Labs, unlimited AI Sifu conversational roleplay).

---

## 4. Exercise Types, Data Models & Scoring Logic

### 4.1. Sentence Token Scramble / Builder
- **Objective**: Construct correct Cantonese sentences given an English translation prompt.
- **Scoring**: Exact order match yields `+10 XP` + Combo multiplier. Mistakes route the item to the Mistake Bank.
- **Data Model**:
  ```json
  {
    "type": "sentence_scramble",
    "prompt_english": "I want to drink milk tea now.",
    "target_hanzi": "我而家想飲奶茶。",
    "target_jyutping": "ngo5 ji4 gaa1 soeng2 jam2 naai5 caa4.",
    "target_tokens": ["我", "而家", "想", "飲", "奶茶"],
    "distractor_tokens": ["今日", "食"]
  }
  ```

### 4.2. Tone Minimal-Pair Discrimination
- **Objective**: Distinguish between identical syllables separated only by pitch contour.
- **Scoring**: Correct answer yields `+12 XP`. Acoustic contour comparison is displayed upon completion.
- **Data Model**:
  ```json
  {
    "type": "tone_discrimination",
    "target_tone": 2,
    "option_a": { "hanzi": "糖", "jyutping": "tong4", "tone": 4, "english": "sugar / candy" },
    "option_b": { "hanzi": "湯", "jyutping": "tong1", "tone": 1, "english": "soup" },
    "target_option": "option_b"
  }
  ```

### 4.3. Contextual Situational Dialogue
- **Objective**: Complete real-life street scenarios with pragmatic naturalness.
- **Scoring**: Full dialogue completion awards `+25 XP` and unlocks the scenario's cultural receipt card.

---

## 5. Frictionless Free-to-Premium Monetization Model

### 5.1. The "Invited Upgrade" Philosophy
Instead of locking learners behind an arbitrary paywall after lesson 5, the application adopts an open, value-forward funnel:

```
┌────────────────────────────────────────────────────────┐
│                   Free Tier (Full Core)                │
│  • 100% of core grammatical levels (A1 to B2)          │
│  • Full CC-Canto offline dictionary                    │
│  • Core practice exercises & daily streak loop         │
│  • 1 Daily AI Sifu lesson generation                   │
│  • Supported by tasteful, non-intrusive banner ads     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼ Natural Value Appeal
┌────────────────────────────────────────────────────────┐
│               Premium Tier ("Hong Kong Pro")           │
│  • 100% Ad-Free, uninterrupted learning flow           │
│  • Complete Street Situational Labs (Cha Chaan Teng,   │
│    Wet Market, Supermarket, MTR & Minibus navigation)  │
│  • Unlimited AI Sifu Conversational Roleplay           │
│  • Full Acoustic Simulator (Acoustic background noise) │
│  • Offline pre-caching of all media & audio            │
└────────────────────────────────────────────────────────┘
```

### 5.2. Conversion Vectors
1. **Ad-Free Commuter Experience**: Free users see small, elegant static banner ads between completed exercise blocks. Upgrading removes all ads instantly.
2. **Contextual Survival Packs**: Direct in-context teasers (e.g., "Ready to order dim sum in Hong Kong? Try the Cha Chaan Teng Survival Lab").
3. **Conversational AI Depth**: When free users complete their 1 free daily AI generation, Sifu invites them: *"Want to keep chatting in Cantonese? Upgrade to Pro for unlimited roleplay."*
