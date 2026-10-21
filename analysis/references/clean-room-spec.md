# Cantonese Transit Learning Platform: Functional & Technical Specification

> [!IMPORTANT]
> **Clean-Room Compliance Notice**: This document is an original, implementation-independent specification. It contains no proprietary source code, external identifiers, or vendor-specific terminology from third-party reference repositories. Future implementation sessions must consult this document as their sole architectural blueprint.

---

## 1. Architectural Overview & Metaphor

The application models Cantonese language acquisition after a high-density metropolitan rail transit system (the Hong Kong MTR network):
- **Transit Network**: The full language learning system.
- **Lines (Chapters)**: High-level thematic tracks (e.g., Island Line for Daily Greetings, Tsuen Wan Line for City Life, Kwun Tong Line for Street Fluency).
- **Stations (Modules)**: Individual physical stops along a line, each representing a conversational objective or linguistic theme.
- **Platforms (Lessons)**: Sequential learning phases within a station (Vocabulary Introduction, Tone Studio Drill, Sentence Scramble, Fluency Checkpoint).
- **Commuter Drills (Exercises)**: The interactive challenges presented to the learner.

The platform employs a **local-first, cloud-synchronized architecture**:
1. All core exercise content, speech audio, and progression states function fully offline on mobile devices (subway/underground commuter resilience).
2. Progression events are journaled locally and synchronized idempotently to a cloud database whenever network connectivity is established.

---

## 2. Relational Domain Schema

```
+-------------------------------------------------------------------------------+
|                             TRANSIT DOMAIN SCHEMA                            |
+-------------------------------------------------------------------------------+

 [ profiles ] (1)
      |
      +----< [ station_completions ] (Composite PK: profile_id, station_id)
      |
      +----< [ session_attempts ] (1..N)
      |         |
      |         +----< [ attempt_responses ] (1..N)
      |
      +----< [ commuter_streaks ] (1:1 with profile)
      |
      +----< [ daily_commute_quests ] (Composite PK: profile_id, quest_key, quest_date)
      |
      +----< [ monthly_pass_progress ] (Composite PK: profile_id, year, month)
      |
      +----< [ commuter_connections ] (Composite PK: follower_id, following_id)
      |
 [ transit_lines ] (1)
      |
      +----< [ transit_stations ] (1..N)
                 |
                 +----< [ station_platforms ] (1..N)
                            |
                            +----< [ platform_drills ] (1..N)
                                       |
                                       +----< [ drill_options ] (1..N)
```

### Entity Specifications

#### 1. `profiles`
- `id`: UUID (Primary Key, matches authenticated identity).
- `handle`: Text (Unique, alphanumeric username, e.g. `hk_rider_852`).
- `display_name`: Text.
- `avatar_token`: Text (Identifier of selected station mosaic avatar).
- `commuter_xp`: Integer (Default: 0, cumulative experience points earned).
- `active_line_id`: Integer (Foreign Key -> `transit_lines.id`).
- `stamina_hearts`: Smallint (Default: 5, range: 0 to 5).
- `timezone`: Text (IANA timezone string, e.g. `Asia/Hong_Kong`, `America/New_York`).
- `created_at`: Timestamp with time zone.
- `updated_at`: Timestamp with time zone.

#### 2. `transit_lines`
- `id`: Integer (Primary Key).
- `line_code`: Text (Unique, e.g. `ISL`, `TWL`, `KTL`).
- `title_en`: Text.
- `title_zh`: Text (Traditional Chinese, e.g. `第一綫 · 港島綫`).
- `hex_color`: Text (Hexadecimal color code, e.g. `#C8231F`).
- `sort_order`: Integer.
- `is_active`: Boolean (Default: true).

#### 3. `transit_stations`
- `id`: Integer (Primary Key).
- `line_id`: Integer (Foreign Key -> `transit_lines.id`).
- `station_code`: Text (Unique, e.g. `STN-01`).
- `title_en`: Text (e.g. `Hello & Goodbye`).
- `title_zh`: Text (e.g. `你好與拜拜`).
- `jyutping`: Text (e.g. `nei5 hou2 jyu5 baai1 baai3`).
- `theme_identifier`: Text (Station tile palette: `red`, `teal`, `blue`, `orange`, `green`, `yellow`, `purple`, `black`).
- `sequence_number`: Integer (Monotonically increasing sequence within line).
- `summary`: Text.

#### 4. `station_platforms`
- `id`: Integer (Primary Key).
- `station_id`: Integer (Foreign Key -> `transit_stations.id`).
- `platform_type`: Enum (`vocabulary`, `tone_drill`, `sentence_builder`, `station_exam`).
- `title`: Text.
- `sequence_order`: Integer.

#### 5. `platform_drills`
- `id`: Integer (Primary Key).
- `platform_id`: Integer (Foreign Key -> `station_platforms.id`).
- `drill_type`: Enum:
  - `multiple_choice`: Recognition drill with one correct prompt.
  - `tone_discrimination`: Auditory pitch identification (Tones 1–6).
  - `token_scramble`: Cantonese grammatical sentence ordering.
  - `cloze_gap`: Fill-in-the-blank contextual phrase completion.
  - `tone_contour_match`: Visual pitch curve alignment (55, 25, 33, 21, 23, 22).
- `prompt_en`: Text.
- `prompt_zh`: Text (Traditional Chinese characters).
- `prompt_jyutping`: Text.
- `audio_resource_url`: Text (Nullable, path to authentic recording).
- `target_tone`: Smallint (Nullable, 1 to 6).
- `explanation`: Text.
- `sequence_order`: Integer.

#### 6. `drill_options`
- `id`: Integer (Primary Key).
- `drill_id`: Integer (Foreign Key -> `platform_drills.id`).
- `content_zh`: Text.
- `content_jyutping`: Text.
- `content_en`: Text.
- `is_correct`: Boolean.
- `canonical_order`: Integer (Nullable, used for ordering in token scrambles).

#### 7. `station_completions`
- `profile_id`: UUID (Foreign Key -> `profiles.id`).
- `station_id`: Integer (Foreign Key -> `transit_stations.id`).
- `line_id`: Integer (Foreign Key -> `transit_lines.id`).
- `best_accuracy_percent`: Smallint (0 to 100).
- `total_xp_awarded`: Integer.
- `completed_at`: Timestamp with time zone.
- *Primary Key*: `(profile_id, station_id)`.

#### 8. `session_attempts`
- `id`: UUID (Primary Key, client-generated or server-assigned).
- `profile_id`: UUID (Foreign Key -> `profiles.id`).
- `station_id`: Integer (Foreign Key -> `transit_stations.id`).
- `accuracy_percent`: Smallint.
- `total_drills_evaluated`: Smallint.
- `passed_cleanly`: Boolean.
- `session_status`: Enum (`in_progress`, `completed`, `abandoned`).
- `started_at`: Timestamp with time zone.
- `completed_at`: Timestamp with time zone (Nullable).

#### 9. `commuter_streaks`
- `profile_id`: UUID (Primary Key, Foreign Key -> `profiles.id`).
- `current_streak`: Integer (Default: 0).
- `longest_streak`: Integer (Default: 0).
- `last_activity_date`: Date (Calculated relative to user's registered IANA timezone).
- `freeze_tokens`: Smallint (Default: 1, streak freeze protections).
- `updated_at`: Timestamp with time zone.

#### 10. `daily_commute_quests`
- `profile_id`: UUID (Foreign Key -> `profiles.id`).
- `quest_key`: Enum (`board_stations`, `perfect_tones`, `maintain_streak`, `review_mistakes`).
- `quest_date`: Date (User local calendar day).
- `target_count`: Smallint.
- `current_count`: Smallint (Default: 0).
- `reward_xp`: Integer.
- `is_claimed`: Boolean (Default: false).
- *Primary Key*: `(profile_id, quest_key, quest_date)`.

#### 11. `monthly_pass_progress`
- `profile_id`: UUID (Foreign Key -> `profiles.id`).
- `year`: Smallint.
- `month`: Smallint (1 to 12).
- `completed_daily_quests`: Integer (Default: 0).
- `target_quests`: Integer (Default: 30).
- `badge_reward_token`: Text.
- `is_claimed`: Boolean (Default: false).
- *Primary Key*: `(profile_id, year, month)`.

#### 12. `commuter_connections`
- `follower_id`: UUID (Foreign Key -> `profiles.id`).
- `following_id`: UUID (Foreign Key -> `profiles.id`).
- `established_at`: Timestamp with time zone.
- *Primary Key*: `(follower_id, following_id)`.
- *Constraint*: `CHECK (follower_id <> following_id)`.

---

## 3. Business Rules & Domain Mechanics

### A. Experience Points (XP) & Scoring Formulas
1. **Base Platform Score**:
   - Each platform drill is worth a base value of **10 XP** on first correct answer.
   - Answering with mistakes deducts 2 XP per incorrect submission down to a floor of 4 XP.
2. **Station Completion Bonus**:
   - Perfect Score (100% accuracy on first attempt): **+25 XP Bonus**.
   - Great Score (>=80% accuracy): **+15 XP Bonus**.
3. **Repeat Review Rule**:
   - Replaying a previously cleared station yields a flat **20 XP** maintenance reward upon passing, preventing infinite point farming while encouraging spaced repetition.
4. **Accuracy Calculation**:
   $$\text{Accuracy Percentage} = \text{round}\left(\frac{\text{Drills Passed on First Submission}}{\text{Total Distinct Drills in Session}} \times 100\right)$$
   *(Note: Retries within the same session must not inflate the denominator.)*

### B. Commuter Stamina & Depletion Mechanics
1. **Stamina Capacity**: Every user possesses a maximum of **5 Hearts (Stamina)**.
2. **Mistake Penalty**: Each incorrect answer in an exercise platform deducts **1 Heart**.
3. **Depletion State**: If stamina reaches 0, the current session halts and prompts the learner to either:
   - Practice in the **Mistake Bank (错题重温)** to earn back hearts (+1 Heart per 3 mistakes successfully remediated).
   - Wait for organic stamina regeneration (+1 Heart every 4 hours).
4. **Offline Resilience**: Local client maintains stamina state and timestamps heart regeneration offline.

### C. Streak Calculation with Local Timezone Enforcement
Streaks must never be evaluated against a static server UTC date. All calendar calculations must evaluate the user's localized civil day:

1. Let $T_{\text{user}}$ be the current instant evaluated in the learner's IANA timezone:
   $$\text{CurrentLocalDate} = \text{DatePart}(\text{Timezone}(\text{Now}, \text{Profile.timezone}))$$
2. Retrieve `commuter_streaks.last_activity_date`:
   - **Case 1: Same Day** ($\text{last\_activity\_date} == \text{CurrentLocalDate}$):
     Streak is retained. `current_streak` remains unchanged.
   - **Case 2: Next Consecutive Day** ($\text{last\_activity\_date} == \text{CurrentLocalDate} - 1\text{ day}$):
     Streak advances. `current_streak = current_streak + 1`. If `current_streak > longest_streak`, update `longest_streak`.
   - **Case 3: Single Missed Day with Freeze Available** ($\text{last\_activity\_date} == \text{CurrentLocalDate} - 2\text{ days}$ and `freeze_tokens > 0`):
     Consume 1 freeze token. Streak is preserved. `current_streak = current_streak + 1`.
   - **Case 4: Broken Streak** ($\text{last\_activity\_date} < \text{CurrentLocalDate} - 1\text{ day}$ and no freeze):
     Streak resets. `current_streak = 1`.
3. Update `last_activity_date = CurrentLocalDate`.

### D. Station Skipping & Line Testing-Out
Learners with prior Cantonese proficiency can skip ahead along an MTR line:
1. When a user tests out of Station $K$ on Line $L$:
   - The user must pass a comprehensive checkpoint exam (minimum 85% accuracy).
   - Upon passing, all intermediate stations $S_1, S_2, \dots, S_{K-1}$ on Line $L$ are automatically recorded in `station_completions` with `best_accuracy_percent = 100` and `total_xp_awarded = 0`.
   - Station $K+1$ becomes the new unlocked frontier on the transit map.
   - This eliminates repetitive friction for heritage speakers while safeguarding XP integrity.

### E. Daily Commute Quests & Monthly Pass System
1. **Quest Generation**: Every morning at 00:00 in the user's timezone, 3 active quests are populated:
   - Quest 1: *Daily Boarding* (Complete 1 Station Platform) -> 20 XP.
   - Quest 2: *Tone Master* (Score 100% on a Tone Studio Drill) -> 30 XP.
   - Quest 3: *Speed Commute* (Complete a station with >=90% accuracy) -> 30 XP.
2. **Monthly Pass Accumulator**:
   - Claiming any daily quest automatically increments `monthly_pass_progress.completed_daily_quests` by 1.
   - Reaching 30 completed daily quests during the active calendar month unlocks the exclusive Monthly Commuter Metro Badge.

---

## 4. Edge Cases & Resilience Safeguards

| Scenario | Risk | Specification Safeguard |
| :--- | :--- | :--- |
| **Mid-Session Abandonment** | Incomplete attempts polluter accuracy denominators. | Sessions generate a single ephemeral `session_attempt` UUID. If the user exits before completion, status is flagged `abandoned`. When computing overall stats, only records with `session_status = 'completed'` are aggregated. |
| **Rapid Double Submission** | Race conditions duplicating XP or rewards. | The completion sync endpoint accepts an idempotent `client_mutation_id`. Database writes execute inside an atomic transaction using `INSERT ... ON CONFLICT (profile_id, station_id) DO NOTHING`. |
| **Clock Manipulation (Client Side)** | Users advancing device date to farm streaks. | The client sends an ISO UTC timestamp. The server verifies that the timestamp does not exceed server UTC time by more than 15 minutes. Historical dates are rejected. |
| **Offline Underground Commuting** | Network loss while training on the subway. | Exercises, bundled audio, and progress logic run 100% client-side via local store. Pending completion receipts are stored in an indexed offline queue and synchronized with exponential backoff once the device detects connectivity. |
| **Token Scramble Permutations** | Multiple grammatically valid word orders. | For sentence construction drills, `drill_options` supports an array of valid sequence permutations, or a semantic validator that checks acceptable particle placements (e.g. placing `唔該` at beginning or end of request). |

---

## 5. Verification & Acceptance Test Suites

### Test Suite 1: Localized Streak Boundary
- **Given** a learner in timezone `Asia/Hong_Kong` with `last_activity_date` set to `2026-10-19` and `current_streak = 5`.
- **When** the learner completes a station on `2026-10-20` at 23:45 local time (server UTC is `2026-10-20 15:45`).
- **Then** `current_streak` must advance to `6` and `last_activity_date` must record `2026-10-20`.
- **When** the learner completes another station 30 minutes later at `2026-10-21 00:15` local time.
- **Then** `current_streak` must advance to `7` and `last_activity_date` must record `2026-10-21`.

### Test Suite 2: Station Skipping Integrity
- **Given** a learner who has cleared Station 2 on the Island Line.
- **When** the learner challenges and passes the Station 6 Test-Out Exam with 90% accuracy.
- **Then** Stations 3, 4, 5, and 6 must immediately be marked completed in `station_completions`.
- **And** intermediate stations 3, 4, and 5 must be awarded 0 XP, while Station 6 awards exam completion XP.
- **And** Station 7 must be unlocked as the active current station.

### Test Suite 3: Idempotent Session Completion
- **Given** a completed station attempt with `client_mutation_id = "abc-123"`.
- **When** the client submits the completion payload twice due to poor transit cellular signal.
- **Then** the database must process the first payload, increment XP and streaks, and return HTTP 200.
- **And** the second duplicate submission must detect the existing `client_mutation_id`, return the identical HTTP 200 receipt, and **not** award duplicate XP or quest counters.

### Test Suite 4: Stamina Depletion & Mistake Remediation
- **Given** a learner with `stamina_hearts = 1`.
- **When** the learner submits an incorrect answer in a tone discrimination drill.
- **Then** `stamina_hearts` must become `0`.
- **And** the exercise session must transition into the "Out of Stamina" recovery modal.
- **When** the user completes 3 exercises in the Mistake Bank.
- **Then** `stamina_hearts` must replenish to `1` and allow resuming station progression.
