# Backend Architecture Decision: Supabase vs. Custom Services

## 1. Executive Recommendation

### Verdict: **Adopt Supabase (PostgreSQL + PostgREST + Edge Functions) with a Local-First Client Architecture.**

We explicitly reject adopting the reference application's monolithic Spring Boot / Kotlin / MySQL architecture, and we advise against building a bespoke custom Node/Express/Go API from scratch. 

Supabase provides the ideal foundation for **Jyut.Toi**, delivering 100% of the required relational integrity, authentication, and offline synchronization capabilities with zero boilerplate and negligible maintenance overhead.

---

## 2. Comparative Evaluation Matrix

| Criteria | Reference Model (Spring Boot + MySQL) | Custom API (Node/Go + Postgres) | Recommended Choice: Supabase (Postgres + Edge Functions) |
| :--- | :--- | :--- | :--- |
| **Offline-First Resilience** | **Fails**: Server-authoritative design halts exercise flow if underground MTR signal drops. | **High Effort**: Requires manual conflict resolution and offline queue endpoints. | **Native**: Client operates on local Zustand/IndexedDB; background sync calls Supabase idempotent RPCs when online. |
| **Authentication** | **Manual**: 100+ lines of custom OAuth token exchange, JWT generation, and cookie filters. | **Manual**: Requires third-party auth libraries (Auth0/Clerk) or custom JWT handlers. | **Built-in**: Native Google & Apple OAuth with JWTs and automatic session refresh across mobile/web. |
| **Security & Authorization** | **Code-heavy**: Hand-written Spring Security interceptors and endpoint permissions. | **Code-heavy**: Custom middleware per route. | **Declarative (RLS)**: Row-Level Security rules enforced directly at the database engine level. |
| **AI Lesson Integration** | Requires separate service or complex background workers. | Custom worker queue. | **Edge Functions**: Fast Deno/TypeScript edge functions invoke Gemini/LLMs and write directly to Postgres. |
| **Infrastructure & Ops** | Expensive (JVM runtime, Docker, VPS, DB management). | Moderate (Container hosting, database maintenance). | **Zero-DevOps**: Managed serverless Postgres with generous free tier and transparent scaling. |
| **Team Velocity** | Low (Heavy boilerplate for DTOs, mappers, repositories). | Moderate. | **Maximum**: Auto-generated REST/GraphQL endpoints directly from the relational schema. |

---

## 3. Migration Strategy & Risk Mitigation

Jyut.Toi is currently a local-first application operating off bundled JSON station data (`levels.json`, `themes.json`) and `localStorage`. Moving to cloud-backed persistence involves manageable risks that can be mitigated through phased migration:

### Identified Migration Risks & Mitigations

1. **Risk: Commuter Offline Disruptions on the MTR**:
   - *Problem*: Subway tunnels and transit stations experience sudden cellular packet drops. If the app stalls on a network request, commuter experience is ruined.
   - *Mitigation*: The app must remain **Local-First, Cloud-Synced**. Exercise sessions and audio playback are executed completely on-device without network calls. On station completion, the completion receipt is written to a local queue. A background sync worker uploads pending receipts when connectivity resumes.

2. **Risk: AI-Generated Content Quality & Latency**:
   - *Problem*: If unlimited levels (100+ stations per chapter) are generated live upon user request, learners face unacceptable 5-15 second loading pauses, and prompt hallucinations could introduce incorrect Jyutping or Mandarin pronunciations.
   - *Mitigation*: Employ **Asynchronous Pipeline Caching**:
     - Stations are generated in advance by a scheduled Supabase Edge Function with an automated validation gate (checking against our 320-exercise ruleset and Cantonese dictionary).
     - Validated stations are stored in the `transit_stations` and `platform_drills` tables as ready-to-board stations. The mobile app simply fetches pre-validated payloads.

3. **Risk: Schema Divergence Between Mobile App and Cloud**:
   - *Problem*: Users running older Capacitor app versions on iOS/Android may submit legacy payload shapes.
   - *Mitigation*: Expose versioned PostgreSQL stored procedures (RPCs) for session submissions (`submit_station_completion_v1`), ensuring backwards-compatible data ingestion.

---

## 4. Minimal Target PostgreSQL Schema for Supabase

This minimal schema directly supports all our core requirements (MTR chapters, 100+ extensible levels, stamina hearts, localized streaks, and daily quests):

```sql
-- ============================================================================
-- 1. EXTENSIONS & ENUMS
-- ============================================================================
create extension if not exists "uuid-ossp";

create type drill_type as enum (
  'multiple_choice',
  'tone_discrimination',
  'token_scramble',
  'cloze_gap',
  'tone_contour_match'
);

create type platform_type as enum (
  'vocabulary',
  'tone_drill',
  'sentence_builder',
  'station_exam'
);

-- ============================================================================
-- 2. USER PROFILES & STAMINA
-- ============================================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  handle text unique not null,
  display_name text not null,
  avatar_token text default 'stn_central_mosaic',
  commuter_xp integer default 0 not null,
  stamina_hearts smallint default 5 not null check (stamina_hearts between 0 and 5),
  timezone text default 'Asia/Hong_Kong' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- ============================================================================
-- 3. MTR TRANSIT CURRICULUM
-- ============================================================================
create table public.transit_lines (
  id serial primary key,
  line_code text unique not null, -- 'ISL', 'TWL', 'KTL'
  title_en text not null,
  title_zh text not null,
  hex_color text not null,        -- '#C8231F'
  sort_order smallint not null
);

create table public.transit_stations (
  id serial primary key,
  line_id integer references public.transit_lines(id) on delete cascade not null,
  station_code text unique not null,
  title_en text not null,
  title_zh text not null,
  jyutping text not null,
  theme_identifier text default 'red' not null,
  sequence_number integer not null,
  summary text not null
);

create table public.station_platforms (
  id serial primary key,
  station_id integer references public.transit_stations(id) on delete cascade not null,
  platform_type platform_type not null,
  title text not null,
  sequence_order smallint not null
);

create table public.platform_drills (
  id serial primary key,
  platform_id integer references public.station_platforms(id) on delete cascade not null,
  drill_type drill_type not null,
  prompt_en text not null,
  prompt_zh text not null,
  prompt_jyutping text,
  audio_url text,
  target_tone smallint check (target_tone between 1 and 6),
  content_payload jsonb not null, -- options, correct answer keys, distractors
  sequence_order smallint not null
);

-- ============================================================================
-- 4. PROGRESSION, COMPLETIONS & STREAKS
-- ============================================================================
create table public.station_completions (
  profile_id uuid references public.profiles(id) on delete cascade not null,
  station_id integer references public.transit_stations(id) on delete cascade not null,
  line_id integer references public.transit_lines(id) on delete cascade not null,
  accuracy_percent smallint not null check (accuracy_percent between 0 and 100),
  total_xp_awarded integer default 0 not null,
  completed_at timestamptz default now() not null,
  primary key (profile_id, station_id)
);

alter table public.station_completions enable row level security;
create policy "Users view own completions" on public.station_completions for select using (auth.uid() = profile_id);
create policy "Users insert own completions" on public.station_completions for insert with check (auth.uid() = profile_id);

create table public.commuter_streaks (
  profile_id uuid references public.profiles(id) on delete cascade primary key,
  current_streak integer default 0 not null,
  longest_streak integer default 0 not null,
  last_activity_date date not null,
  freeze_tokens smallint default 1 not null,
  updated_at timestamptz default now() not null
);

alter table public.commuter_streaks enable row level security;
create policy "Users view own streak" on public.commuter_streaks for select using (auth.uid() = profile_id);

-- ============================================================================
-- 5. DAILY COMMUTE QUESTS
-- ============================================================================
create table public.daily_commute_quests (
  profile_id uuid references public.profiles(id) on delete cascade not null,
  quest_key text not null,
  quest_date date not null,
  target_count smallint not null,
  current_count smallint default 0 not null,
  reward_xp integer not null,
  is_claimed boolean default false not null,
  primary key (profile_id, quest_key, quest_date)
);

alter table public.daily_commute_quests enable row level security;
create policy "Users view own quests" on public.daily_commute_quests for select using (auth.uid() = profile_id);
create policy "Users update own quests" on public.daily_commute_quests for update using (auth.uid() = profile_id);

-- ============================================================================
-- 6. ATOMIC IDEMPOTENT COMPLETION RPC
-- ============================================================================
create or replace function public.record_station_completion(
  p_station_id integer,
  p_line_id integer,
  p_accuracy smallint,
  p_xp_earned integer,
  p_user_local_date date
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_user_id uuid := auth.uid();
  v_streak_rec record;
  v_new_streak integer := 1;
begin
  -- 1. Insert or update completion
  insert into public.station_completions (profile_id, station_id, line_id, accuracy_percent, total_xp_awarded, completed_at)
  values (v_user_id, p_station_id, p_line_id, p_accuracy, p_xp_earned, now())
  on conflict (profile_id, station_id)
  do update set
    accuracy_percent = greatest(station_completions.accuracy_percent, excluded.accuracy_percent),
    total_xp_awarded = station_completions.total_xp_awarded + excluded.total_xp_awarded;

  -- 2. Increment user XP
  update public.profiles
  set commuter_xp = commuter_xp + p_xp_earned,
      updated_at = now()
  where id = v_user_id;

  -- 3. Calculate localized streak
  select * into v_streak_rec from public.commuter_streaks where profile_id = v_user_id;
  if not found then
    insert into public.commuter_streaks (profile_id, current_streak, longest_streak, last_activity_date)
    values (v_user_id, 1, 1, p_user_local_date);
  else
    if v_streak_rec.last_activity_date = p_user_local_date then
      v_new_streak := v_streak_rec.current_streak;
    elsif v_streak_rec.last_activity_date = p_user_local_date - interval '1 day' then
      v_new_streak := v_streak_rec.current_streak + 1;
    else
      v_new_streak := 1;
    end if;

    update public.commuter_streaks
    set current_streak = v_new_streak,
        longest_streak = greatest(v_streak_rec.longest_streak, v_new_streak),
        last_activity_date = p_user_local_date,
        updated_at = now()
    where profile_id = v_user_id;
  end if;

  return jsonb_build_object(
    'status', 'success',
    'new_streak', v_new_streak,
    'xp_earned', p_xp_earned
  );
end;
$$;
```
