# Reference Findings: Architecture and Behavioral Analysis

This document synthesizes the architectural paradigms, domain mechanics, and edge cases discovered during research on the reference language learning applications. All observations and analyses are formulated in original language.

---

## Part 1: Frontend Architecture & User Experience

### 1. Screens, User Flow & Curriculum Hierarchy
The user journey follows a standard gamified progression:
1. **Authentication**: Users log in via Google OAuth. If the user has not selected a target language, they are routed to a course onboarding selector.
2. **Main Hub (The Path)**: The core home screen renders the curriculum hierarchy:
   - **Course**: The overall language curriculum (e.g. French, German).
   - **Section**: A high-level thematic grouping (e.g. "Introductory Phrases", "Dining Out").
   - **Unit**: A visual chapter or milestone block with an associated theme color, title, and descriptive banner.
   - **Lesson**: A sequential node rendered along a continuous vertical serpentine path.
   - **Exercise**: A sequence of individual interactive prompts within a lesson.
3. **Curriculum Path Rendering Mechanics**:
   - **Serpentine Alternating Offsets**: Nodes do not sit on a straight line; horizontal margins alternate in a sinusoidal pattern (`ml-0`, `ml-20`, `ml-36`, `ml-16`, `mr-4`, etc.), with offset direction flipping every even/odd block.
   - **Sticky Dynamic Unit Banner**: An intersection observer tracks which unit is currently in view. As the learner scrolls vertically through the path, the top banner updates smoothly to display the current unit's title and description without requiring discrete page loads.
   - **Quick-Scroll Floating Anchor**: A floating action button detects whether the user's active cursor node is in the viewport; if out of view, tapping it triggers an animated scroll directly to the current lesson.
4. **Lesson Session & Completion Flow**:
   - Full-screen modal viewport with progress bar.
   - Sequential exercise step-through with immediate feedback.
   - Exit confirmation sheet prevents accidental loss of progress.
   - End-of-session victory flow split into two sequential view states:
     - State A: Lesson trophy celebration, accuracy percentage, and earned score.
     - State B: Streak counter animation (if daily streak incremented).

### 2. Exercise Types, Validation & Scoring
- **Supported Exercise Types**:
  1. **Token Scramble / Sentence Composition**: The learner is presented with a source sentence prompt and a randomized token bank of target-language words. The user clicks tokens to construct the translation in linear order, with options to unselect tokens back to the bank.
  2. **Cloze / Fill-in-the-Blank**: The learner is presented with an incomplete sentence containing a blank gap, alongside a set of candidate words. The user selects the single correct missing word.
- **Validation Authority**:
  - Validation is **strictly server-authoritative**. The client does not verify answers locally or possess the answer key in the exercise payload.
  - When the user confirms an answer, the client dispatches the selected option IDs to the backend.
  - The backend returns correctness, assigned attempt score, feedback string, and the canonical correct sentence.
- **Scoring Rules**:
  - Each individual exercise prompt awards a maximum of 5 points for a correct response and 0 points for an incorrect response.
  - Overall lesson accuracy equals `(earned_points / (total_exercises * 5)) * 100`.
  - A 100% accuracy score triggers a "Perfect Lesson" bonus (+5 extra points).
  - First-time lesson completion awards full earned points + bonus. Subsequent replays of an already-passed lesson only grant a fixed participation reward (5 base points + 5 if perfect).

### 3. Gamification Domain Rules & Edge Cases
- **Skipping & Testing Out**:
  - When a learner completes a lesson that sits ahead of their current progress pointer, the system automatically marks all intermediate skipped lessons as completed with a score of 0.
  - This advances the user's course progress pointer directly past the target lesson without stranding preceding curriculum nodes in a locked state.
- **Streaks**:
  - Streaks increment by 1 if a lesson is completed on a calendar day immediately following the previous submission date.
  - If a user completes multiple lessons on the same calendar day, the streak count remains unchanged (`prev == next`).
  - If more than 24-48 hours elapse without activity (more than one calendar day skipped), the streak resets to 1 upon the next completion.
- **Daily Quests & Monthly Challenges**:
  - Users receive 3 daily quests refreshed each day (e.g. Earn a Perfect Lesson, Maintain Streak, Achieve >90% Accuracy).
  - Each completed daily quest increments a cumulative counter toward the active Monthly Challenge (e.g., Complete 30 daily quests during the month).
- **Leaderboards**:
  - Implemented as an all-time global points leaderboard using cursor-based keyset pagination on `(points DESC, id ASC)`.
  - *Edge Case*: It does not implement weekly tiered leagues (e.g. Bronze/Gold tiers) or weekly score resets; users accumulate points indefinitely.
- **Social Following**:
  - Unidirectional follow system (follower vs followed).
  - Enforces database uniqueness on `(follower_id, followed_id)` and prevents self-following via check constraints.
- **Profiles & Avatars**:
  - Simple catalogue picker from pre-rendered avatar image URLs rather than an in-engine procedural vector generator.

### 4. State Management & Network Strategy
- **React Query + Batching Layer**:
  - The frontend uses TanStack React Query for asynchronous state and caching.
  - Stale time is configured to 60 seconds across catalog and progress queries.
  - **Client-Side Request Batching**: Employs a request-batching utility (`@yornaath/batshit`) with a 10ms microtask scheduling window. When 20 lesson nodes mount simultaneously, their individual fetch hooks do not trigger 20 parallel HTTP calls; instead, the batcher collects IDs within 10ms and dispatches a single batch query (`/lessons?lessonIds=1,2,3...`), eliminating client-side N+1 waterfalls.
- **Optimistic Updates & Invalidation**:
  - On completing a lesson, the mutation response directly updates cache entries for the current lesson, newly unlocked lessons, user total score, and streak length in place, while invalidating quest and monthly challenge caches.

### 5. Tactile UI & Feedback Moments
- **3D Tactile Push-Buttons**: Interactive elements feature a bottom border shadow simulating physical buttons. On click/press, CSS `active:translate-y-[5px] active:shadow-none` depresses the button physically into the surface.
- **Dual-Phase Celebrations**: End-of-lesson feedback separates completion statistics from streak increments into distinct narrative cards with Lottie animations, creating emotional pacing.
- **Spring Entrance Transitions**: Screen transitions and modal sheets utilize damped spring physics (`type: spring, stiffness: 800, damping: 25`) to avoid mechanical linear easing.
- **Auditory Affirmation**: Distinct, snappy audio cues sound on validation (crisp high-pitched chime for correct, low buzz for incorrect, fanfare for lesson finish).

---

## Part 2: Backend Architecture & Resilience Analysis

### 6. Relational Data Model & Entity Relationship Diagram

The backend relies on a normalized relational schema with cascading foreign keys:

```
+--------------------------------------------------------------------------------+
|                               ENTITY RELATIONSHIP DIAGRAM                     |
+--------------------------------------------------------------------------------+

 [ Course ] (1)
    |
    +----< [ Section ] (1..N)
    |         |
    |         +----< [ LudoUnit ] (1..N)
    |                   |
    |                   +----< [ Lesson ] (1..N)
    |                   |         |
    |                   |         +----< [ Exercise ] (1..N)
    |                   |                   |
    |                   |                   +----< [ ExerciseOption ] (1..N)
    |                   |
    |                   +----(1) [ PathIcon ]
    |
    +----< [ UserCourseProgress ] >----+
                                       |
 [ User ] (1) -------------------------+
    |
    +----< [ LessonCompletion ] (Composite PK: user_id, lesson_id)
    |
    +----< [ ExerciseAttempt ] (1..N)
    |         |
    |         +----< [ AttemptOption ] (1..N: attempt_id, option_id, position)
    |
    +----< [ Follow ] (Composite Unique: follower_id, followed_id)
    |
    +----< [ UserDailyQuest ] (Composite PK: user_id, quest_def_id, date)
    |         |
    |        (N)
    |         |
    |      [ QuestDefinition ] (1)
    |
    +----< [ UserMonthlyChallenge ] (Composite PK: user_id, challenge_def_id, year, month)
              |
             (N)
              |
           [ MonthlyChallengeDefinition ] (1)
```

**Key Structural Properties**:
- **Strict Hierarchy Cascades**: Deleting a course cascades through sections, units, lessons, and exercises.
- **Composite Primary Keys**:
  - `lesson_completions`: `(user_id, lesson_id)` prevents duplicate records per lesson.
  - `user_daily_quest`: `(user_id, quest_def_id, date)` ensures exactly one progress counter per quest per day.
  - `user_monthly_challenge`: `(user_id, challenge_def_id, year, month)` scopes challenge records to a calendar period.
- **Indexed Hot Paths**:
  - Keyset index on `users(points DESC, id ASC)` allows high-performance pagination across millions of accounts.
  - Foreign key indices on `exercise_attempts(exercise_id, user_id, is_checked)`.

### 7. API Surface & Security Boundary
- **Endpoint Structure**:
  - Public Endpoints: Catalog navigation (`/catalog/**`, `/courses/**`, `/sections/**`, `/units/**`), public profile lookups, and global leaderboard.
  - Authenticated Endpoints: Attempt submissions (`/progress/exercise-attempt`), session completions (`/progress/lesson-complete`), quest management, and follow actions.
- **Authentication Mechanism**:
  - Google OAuth token exchange on backend -> issues signed JWT -> stored in `HttpOnly`, `SameSite=Lax` cookie.
  - Stateless Spring Security filter parses the JWT cookie on incoming requests and injects the user principal into the execution context.

### 8. Game Logic & Business Rules
- **Server Authority**: The backend controls progress calculation, accuracy scoring, streak increments, and quest triggers.
- **Streak Calculation**: Evaluates the gap between the incoming timestamp and `user.last_submission`. If the last date equals yesterday, streak increments. If today, streak is maintained. If older, streak resets to 1.
- **Quest Progression**: On lesson completion, business rules evaluate if accuracy reached 100% (triggers `PERFECT` quest) or >90% (triggers `ACCURACY` quest), and if streak incremented (triggers `STREAK` quest).

### 9. Vulnerability, Fragility & Missing Components Audit
A thorough engineering audit reveals several critical vulnerabilities and omissions in the reference backend:

1. **Cheating & Unchecked Completion Exploit**:
   - In `LessonCompletionService`, the endpoint `/progress/lesson-complete` accepts any `lessonId` and marks it completed without verifying that the user has submitted passing attempts for all exercises in that lesson.
   - An attacker can bypass the entire exercise session by firing a single POST request to complete any lesson, artificially farming streak increments and leaderboard points.
2. **Timezone Desynchronization in Streak Logic**:
   - The reference backend calculates `DateUtils.today(clock)` using the server's clock (UTC).
   - A learner studying in a timezone far from UTC (e.g., UTC+8 in Hong Kong or UTC-8 in the Americas) will experience midnight transitions hours ahead or behind their actual local day, causing premature streak breaks or inability to advance daily streaks at local bedtime.
3. **Session State Pollution on Abandoned Lessons**:
   - Individual attempts are written to `exercise_attempts` with `is_checked = 0`. Attempts are only marked `is_checked = 1` when the entire lesson completion endpoint is hit.
   - If a learner abandons a lesson midway and starts it again later, un-checked attempts from the previous session remain in the database. When the lesson is finally completed, the accuracy denominator counts attempts from both sessions, penalizing the user's accuracy unfairly.
4. **Race Conditions & Concurrency Hazards**:
   - User point updates and daily quest increments lack optimistic locking (`@Version`) or row-level pessimistic locking (`SELECT ... FOR UPDATE`).
   - Concurrent exercise submissions from multiple tabs or network retries will result in lost point updates.
5. **Absence of Rate Limiting**:
   - Endpoints lack IP or user token bucket rate limiting, leaving exercise verification and leaderboard endpoints susceptible to automated scrapers and denial-of-service floods.
6. **CSRF Vulnerability**:
   - `http.csrf { it.disable() }` is configured alongside cookie-based authentication. While `SameSite=Lax` offers partial protection, relying strictly on Lax without custom headers (e.g. `X-Requested-With`) or anti-CSRF tokens introduces cross-site execution risks in certain web contexts.

---

## Part 3: Comparative Evaluation & Recommendations for Jyut.Toi

| Reference Feature | Assessment for Jyut.Toi | Implementation Decision & Rationale |
| :--- | :--- | :--- |
| **Curriculum Hierarchy (Course -> Section -> Unit -> Lesson)** | **Adapt** | Adapt to our Hong Kong transit metaphor: Line (Network) -> Chapter (Line Sector) -> Station (Unit) -> Platform Track (Lesson) -> Drill (Exercise). This maps directly to Hong Kong MTR Line navigation. |
| **Request Batching (`batshit` DataLoader)** | **Skip for now / Adapt later** | Our app is currently local-first (static JSON levels + local state). Once Supabase is introduced, Supabase client handles batching natively via relational `select('*, units(*, lessons(*))')`. |
| **Dynamic Sticky Intersection Banner** | **Adopt** | High-utility UX pattern. Adapting this so the top header indicates the active station / transit zone dynamically as the user scrolls along the MTR rail line. |
| **Server-Authoritative Exercise Checking** | **Skip for offline, Adopt for backend** | A language app for transit commuters must support offline practice on the subway (MTR underground). Verification must remain local-first in client, with cryptographic session signing or server sync upon connection. |
| **Serpentine Path with Alternating Offsets** | **Skip / Adapt minimally** | Our app has a dedicated Hong Kong MTR metro track visual identity. A generic curvy Duolingo snake clashes with transit aesthetics. We maintain our authentic vertical/diagonal metro rail tracks. |
| **Skipping Ahead (Auto-passing intermediates)** | **Adopt with caution** | Excellent user autonomy feature for intermediate Cantonese speakers. If a learner passes Station 8 directly, stations 1–7 unlock as cleared with 0 bonus XP. |
| **Streak System** | **Adapt with Local Timezone** | Must fix the reference app's timezone bug: streak evaluation must store the client's local timezone offset (or `Asia/Hong_Kong` / device timezone) to calculate calendar day boundaries accurately. |
| **Quests & Monthly Challenges** | **Adopt** | Proven retention driver. Implement daily transit challenges (e.g. "Ride 3 Stations", "Perfect Tone Discrimination", "Review 5 Mistake Bank Cards"). |
| **Spring & 3D Tactile Buttons** | **Adopt** | The tactile button depth (`active:translate-y-[4px]` with solid shadow) matches our MTR mosaic ceramic tile tactile aesthetic. |
| **Lottie Celebration Sequencing** | **Adopt** | Pacing completion into separate celebration beats (Station Arrival Chime -> Victory Stats -> Streak Increment) significantly elevates polish. |
| **Spring Boot / Kotlin / MySQL Backend** | **Reject / Skip** | Heavy, monolithic, expensive to maintain, and requires manual infrastructure management. Supabase (PostgreSQL + PostgREST + Edge Functions + Built-in Auth) satisfies all requirements with 90% less boilerplate. |

---

## Part 4: Backend Strategy: Supabase vs. Custom Service

### Recommendation
**Do not adopt the reference project's Spring Boot + MySQL architecture.** Instead, implement a **Supabase + PostgreSQL + Edge Functions** architecture.

### Comparative Rationale
1. **Local-First & Offline Resilience**: A Spring Boot API requires active internet connectivity for every single exercise check. On the Hong Kong underground MTR, commuters frequently drop connections. A local-first architecture (IndexedDB / SQLite / Zustand) with background Supabase sync allows uninterrupted learning.
2. **Schema Power & Row-Level Security (RLS)**: PostgreSQL supports composite keys, triggers, JSONB for flexible exercise structures, and declarative Row-Level Security. We eliminate hundreds of lines of Spring controller and repository boilerplate.
3. **Development Velocity**: Supabase provides Google / Apple OAuth, real-time subscriptions, and auto-generated REST/GraphQL APIs out of the box.
4. **Maintenance Overhead**: Spring/Kotlin requires JVM hosting, Docker containers, database connection pooling configurations, and manual token lifecycle handling. Supabase runs serverless and scales seamlessly.
