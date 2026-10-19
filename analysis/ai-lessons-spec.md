# AI Curriculum Engine & Interactive Pedagogical Specification

## 1. Executive Summary & Gemini Integration

### 1.1. The Content Ceiling in Conventional Language Apps
Legacy mobile language applications suffer from a structural content ceiling:
- **High Authoring Costs**: Manually authoring vocabulary, grammar exercises, and cultural stories requires hundreds of person-hours per unit.
- **Fixed Datasets**: Conventional apps cap out at approximately 700–900 words, 150–200 sentences, and fewer than 10 short stories. Learners hit an artificial progress ceiling after 4–6 weeks.
- **Robotic Brittle Generators**: Combinatorial string concatenation results in ungrammatical, unnatural sentences (e.g., "He/She has water" or "Does you all eat meal"), confusing learners with improper Cantonese aspect collocations.

### 1.2. The AI-Powered Dynamic Paradigm
This specification designs an intelligent pedagogical layer using Google's **Gemini 2.5 Flash** (and `gemini-2.0-flash` fallback) running via serverless Supabase Edge Functions. It removes the content ceiling completely by dynamically generating, verifying, and adapting infinite structured lessons, exercises, and real-life situational simulations.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Learner Context & State                         │
│  • Current Level: A2 (Lower Intermediate)                              │
│  • Weaknesses from Mistake Bank: Aspect Marker (咗 vs 過), Tone 2 vs 5 │
│  • Situational Target: "Wet Market produce bargaining" or "Cha Chaan"  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             Supabase Edge Function: Gemini 2.5 Flash Client            │
│  • Injects CEFR constraints & target Cantonese grammar rules           │
│  • Structured Outputs (JSON Schema mode)                               │
│  • Enforces pure colloquial Hong Kong Cantonese (口語)                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Automated Linguistic Quality Gate                   │
│  ┌───────────────────────┐   ┌──────────────────┐   ┌───────────────┐  │
│  │ Schema Validation     │   │ Jyutping Check   │   │ Anti-Mandarin │  │
│  │ (Zod / JSON Schema)   │   │ (CC-Canto Lexicon│   │  Lexical Scan │  │
│  │                       │   │  Tone Validation)│   │  (No 的, 在)  │  │
│  └───────────────────────┘   └──────────────────┘   └───────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Pass
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Shared Curriculum Cache & Delivery                    │
│  • Stored in Supabase `curriculum_pool` for instant multi-user reuse   │
│  • Hydrated directly into client standard exercise runner              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Dynamic Lesson Generation Pipeline

### 2.1. Core System Prompt Specification (Gemini 2.5 Flash)

```markdown
You are a senior Cantonese linguist and native language educator specializing in colloquial Hong Kong Cantonese (香港廣東話) with standard LSHK Jyutping romanization.

TASK:
Generate a structured, authentic lesson strictly adhering to the provided JSON Schema.

LINGUISTIC INTEGRITY RULES:
1. STRICT COLLOQUIAL CANTONESE (口語):
   - Never use written Standard Chinese / Mandarin phrasing.
   - Use 喺 (hai2), not 在.
   - Use 睇 (tai2), not 看.
   - Use 食 (sik6), not 吃.
   - Use 飲 (jam2), not 喝.
   - Use 嘅 (ge3), not 的.
   - Use 佢 (keoi5), not 他/她.
   - Use 呢個 (ni1 go3), not 这个.
   - Use 邊度 (bin1 dou6), not 哪里.
   - Use 點樣 (dim2 joeng6), not 怎么.
2. STANDARD JYUTPING:
   - Provide standard LSHK Jyutping with tone digits 1-6 attached to each syllable.
   - Maintain correct spacing between words.
3. GRAMMAR RESTRICTION:
   - Accurately apply aspect markers:
     * 咗 (zo2): Perfective / completed action.
     * 緊 (gan2): Continuous / in progress action.
     * 過 (gwo3): Experiential action ("have experienced before").
     * 完 (jyun4): Finishing an action.
4. TONE ACCURACY:
   - In tone discrimination exercises, only use verified minimal pairs where the tone number alters semantic meaning.
```

---

## 3. Real-Life Situational Simulation Specifications

The primary value proposition for both free and premium users is learning how to navigate authentic everyday Hong Kong scenarios:

### Scenario 1: Ordering at a Cha Chaan Teng (茶餐廳)
- **Context**: The user sits in a busy diner during lunch rush and must order, customize tea, and pay.
- **Key Vocabulary**: 凍檸茶 (dung1 ning9 caa4), 少甜 (siu2 tim4), 走冰 (zau2 bing1), 加底 (gaa1 dai2), 蛋撻 (daan6 taat1), 菠蘿油 (bo1 lo4 jau4), 埋單 (maai4 daan1).
- **Gemini Generation Output Sample**:
  ```json
  {
    "id": "scenario_cct_ordering_01",
    "title": "Ordering Lunch at a Cha Chaan Teng",
    "title_cantonese": "茶餐廳嗌晏晝",
    "title_jyutping": "caa4 caan1 teng1 aai3 aan3 zau3",
    "level": "A2",
    "topic": "food_dining",
    "exercises": [
      {
        "id": "cct_ex_01",
        "type": "sentence_scramble",
        "prompt": "Say: 'I want an iced lemon tea, less sweet and no ice.'",
        "target_content": {
          "hanzi": "我想要一杯凍檸茶，少甜走冰。",
          "jyutping": "ngo5 soeng2 jiu3 jat1 bui1 dung1 ning4 caa4, siu2 tim4 zau2 bing1.",
          "english": "I want an iced lemon tea, less sweet, no ice."
        },
        "scramble_data": {
          "tokens": ["我", "想要", "一杯", "凍檸茶", "，", "少甜", "走冰", "熱水"],
          "correct_order_indices": [0, 1, 2, 3, 4, 5, 6]
        },
        "explanation": "走冰 (zau2 bing1) literally means 'remove ice', while 少甜 (siu2 tim4) requests reduced syrup."
      },
      {
        "id": "cct_ex_02",
        "type": "dialogue_roleplay",
        "prompt": "Complete the ordering exchange with the waiter:",
        "dialogue_turns": [
          {
            "speaker": "bot",
            "speaker_name": "Waiter (伙計)",
            "hanzi": "執好位啦！今日食咩餐？",
            "jyutping": "zap1 hou2 wai2 laa1! gam1 jat6 sik6 me1 caan1?",
            "english": "Table is ready! What set meal are you having today?"
          },
          {
            "speaker": "user",
            "speaker_name": "Learner",
            "hanzi": "唔該一個A餐，配煎蛋同多士。",
            "jyutping": "m4 goi1 jat1 go3 ei1 caan1, pui3 zin1 daan2 tung4 do1 si2.",
            "english": "Please, one Set A, with fried egg and toast.",
            "user_branch_choices": [
              {
                "id": "opt_a",
                "hanzi": "唔該一個A餐，配煎蛋同多士。",
                "jyutping": "m4 goi1 jat1 go3 ei1 caan1, pui3 zin1 daan2 tung4 do1 si2.",
                "english": "Please, one Set A, with fried egg and toast.",
                "pragmatic_tone": "colloquial_casual"
              },
              {
                "id": "opt_b",
                "hanzi": "我要吃米饭。",
                "jyutping": "ngo5 jiu3 hek3 mai5 faan6.",
                "english": "I want to eat rice. (Unnatural Mandarin phrasing)",
                "pragmatic_tone": "direct"
              }
            ]
          },
          {
            "speaker": "bot",
            "speaker_name": "Waiter (伙計)",
            "hanzi": "飲咩茶？熱定凍？",
            "jyutping": "jam2 me1 caa4? jit6 ding6 dung3?",
            "english": "What drink? Hot or cold?"
          }
        ]
      }
    ]
  }
  ```

---

### Scenario 2: Wet Market Vegetable & Seafood Bargaining (街市)
- **Context**: Shopping in a traditional wet market, asking prices per catty, verifying freshness, and asking for green onions.
- **Key Vocabulary**: 一斤 (jat1 gan1 - ~600g), 游水魚 (jau4 seoi2 jyu2 - live swimming fish), 菜心 (coi3 sam1), 幾多錢 (gei2 do1 cin2), 送兩條蔥 (sung3 loeng5 tiu4 cung1).
- **Gemini Generation Output Sample**:
  ```json
  {
    "id": "scenario_wet_market_01",
    "title": "Bargaining at the Wet Market",
    "title_cantonese": "喺街市買餸",
    "title_jyutping": "hai2 gaai1 si5 maai5 sung3",
    "level": "A2",
    "topic": "shopping_bargaining",
    "exercises": [
      {
        "id": "market_ex_01",
        "type": "sentence_scramble",
        "prompt": "Ask the vendor: 'How much is this choy sum per catty?'",
        "target_content": {
          "hanzi": "呢啲菜心一斤幾多錢呀？",
          "jyutping": "ni1 di1 coi3 sam1 jat1 gan1 gei2 do1 cin2 aa3?",
          "english": "How much is this choy sum per catty?"
        },
        "scramble_data": {
          "tokens": ["呢啲", "菜心", "一斤", "幾多錢", "呀", "？", "好平"],
          "correct_order_indices": [0, 1, 2, 3, 4, 5]
        },
        "explanation": "斤 (gan1) is the standard Hong Kong unit of weight (equivalent to approx 604 grams)."
      },
      {
        "id": "market_ex_02",
        "type": "multiple_choice",
        "prompt": "How do you politely ask the fishmonger for free green onions with your fish?",
        "options": [
          { "id": "m1", "text": "送兩條蔥得唔得呀？", "jyutping": "sung3 loeng5 tiu4 cung1 dak1 m4 dak1 aa3?", "hanzi": "送兩條蔥得唔得呀？" },
          { "id": "m2", "text": "給我蔥！", "jyutping": "kei2 ngo5 cung1!", "hanzi": "給我蔥！" },
          { "id": "m3", "text": "我唔要魚。", "jyutping": "ngo5 m4 jiu3 jyu2.", "hanzi": "我唔要魚。" }
        ],
        "correct_option_id": "m1",
        "explanation": "Asking '送兩條蔥得唔得呀？' is standard, friendly market etiquette in Hong Kong."
      }
    ]
  }
  ```

---

### Scenario 3: Supermarket Checkout & Convenience Store
- **Context**: Paying at 7-Eleven or Wellcome/PARKnSHOP, using Octopus card, asking for receipts, and declining plastic bags.
- **Key Vocabulary**: 八達通 (baat3 daat6 tung1), 嘟 (doot1 - verb for tapping an Octopus card), 膠袋 (gaau1 doi2), 收據/單 (daan1).
- **Interactive Exercise**:
  - Prompt: *Tell the cashier you will tap your Octopus card: "我用八達通嘟呀，唔該。"*
  - Cashier prompt: *"要唔要膠袋？" (Do you need a plastic bag?)* -> Response: *"唔使啦，我有環保袋。" (No need, I have an eco-bag.)*

---

### Scenario 4: MTR Subway & Minibus Public Transit
- **Context**: Navigating interchange stations, asking for exits, and shouting to stop the minibus.
- **Key Vocabulary**: 出口 (ceot1 hau2), 轉綫 (zyun3 sin3), 幾號月台 (gei2 hou6 jyut6 toi4), 前面有落唔該 (cin4 min6 jau5 lok6 m4 goi1).
- **Interactive Exercise**:
  - Minibus scenario: When approaching your destination on a green or red minibus, tap the correct phrase to get off:
  - Valid: `前面有落，唔該！` (cin4 min6 jau5 lok6, m4 goi1!)
  - Common distractor: `我想下车` (Mandarin phrasing, driver will ignore or misunderstand).

---

## 4. Interactive Teacher Mode ("Sifu AI")

### 4.1. Pedagogical Error Explainer
When the learner fails an exercise, the UI surfaces a "Ask Sifu Why" button that invokes Gemini with a compact system prompt:

```markdown
You are Sifu, a warm, concise, and pedagogically brilliant Hong Kong Cantonese tutor.

GOAL: Explain why the learner's answer is incorrect and provide an intuitive memory anchor.
CONSTRAINTS:
- Keep the explanation under 3 sentences.
- Never scold; be encouraging and culturally contextual.
- Explain the linguistic contrast clearly (e.g. difference in tone contour, particle semantics, or word order).
- Provide the correct Jyutping and English gloss.
```

#### Example Output:
> "You said **飲過 (jam2 gwo3)** instead of **飲咗 (jam2 zo2)**! Remember: **咗 (zo2)** indicates that an action was completed recently ('I drank my milk tea just now'). **過 (gwo3)** expresses lifetime experience ('I have tried snake soup before')."

---

## 5. Multi-Layer Quality Assurance Pipeline

Generative AI output cannot be delivered directly to language learners without multi-tier verification. Hallucinated Jyutping or Mandarin lexical bleed will misinform learners.

```
┌────────────────────────────────────────────────────────┐
│         Gemini 2.5 Flash Lesson Candidate Output       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Stage 1: Structural JSON Schema Validation (Zod)       │
│ • Validates required fields, arrays, types, ranges     │
│ ❌ Fails? ──► Automatic 1-shot repair retry            │
└──────────────────────────┬─────────────────────────────┘
                           │ Pass
                           ▼
┌────────────────────────────────────────────────────────┐
│ Stage 2: Lexicon & Jyutping Deterministic Linter       │
│ • Tokenizes Hanzi sentences using Cantonese segmenter  │
│ • Cross-references tokens against CC-Canto dictionary  │
│ • Confirms tone numbers are strictly between 1 and 6   │
│ ❌ Hallucinated Jyutping? ──► Replaced via CC-Canto    │
└──────────────────────────┬─────────────────────────────┘
                           │ Pass
                           ▼
┌────────────────────────────────────────────────────────┐
│ Stage 3: Anti-Mandarin Lexical Guardrail               │
│ • Regex scan for forbidden Mandarin-isms:              │
│   [的, 在, 看, 吃, 喝, 谁, 怎么, 什么, 他, 她, 们]   │
│ ❌ Detected? ──► Discard or trigger re-generation       │
└──────────────────────────┬─────────────────────────────┘
                           │ Pass
                           ▼
┌────────────────────────────────────────────────────────┐
│ Stage 4: Cache in Supabase Curriculum Repository       │
└────────────────────────────────────────────────────────┘
```

---

## 6. Cost Optimization, Caching & Scalability

### 6.1. Multi-User Shared Curriculum Pool
To maintain unit economics while delivering personalized content:
- Every approved AI-generated lesson is indexed in PostgreSQL by `level` + `topic` + `grammar_tags`.
- When User B requests a lesson on "Cha Chaan Teng lunch orders" at Level A2, the system performs a semantic lookup over the existing verified cache before making an LLM API call.
- **Cache Hit Target**: >65% of requests served from pre-verified, zero-marginal-cost cache.

### 6.2. Offline Fallback Strategy
- When network connectivity is unavailable, the application falls back gracefully to a bundled SQLite / JSON database containing:
  - 120 pre-verified core curriculum lessons.
  - 30 survival street dialogue simulations.
  - Complete offline CC-Canto dictionary.
- The UI signals "Offline Mode: Standard Curriculum Available" without blocking the user from completing their daily streak or missions.
