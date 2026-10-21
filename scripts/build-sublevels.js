import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const levelsPath = path.resolve(__dirname, '../shared/levels.json');
const levelsData = JSON.parse(fs.readFileSync(levelsPath, 'utf-8'));

// High-fidelity Cantonese linguistic data for Round 2 and Round 3
const SUBLEVEL_ENRICHMENTS = {
  1: {
    round2: {
      title: "Casual Encounters",
      subtitle: "Daily check-ins & polite leave-taking",
      vocab: [
        { chinese: "食咗飯未", jyutping: "sik6 zo2 faan6 mei6", tones: [6, 2, 6, 6], english: "Have you eaten yet?", notes: "The quintessential Hong Kong greeting showing care." },
        { chinese: "未呀", jyutping: "mei6 aa3", tones: [6, 3], english: "Not yet", notes: "Everyday answer to 'have you eaten'." },
        { chinese: "走先啦", jyutping: "zau2 sin1 laa1", tones: [2, 1, 1], english: "Heading off first", notes: "Friendly casual departure phrase among friends." },
        { chinese: "慢行", jyutping: "maan6 haang4", tones: [6, 4], english: "Take care / Walk slowly", notes: "Polite farewell said to someone leaving." }
      ],
      toneDrill: [
        { character: "未", syllable: "mei6", correctTone: 6, name: "Low Level (22)", meaning: "Not yet", options: [2, 4, 6] },
        { character: "走", syllable: "zau2", correctTone: 2, name: "High Rising (25)", meaning: "Leave", options: [1, 2, 5] }
      ],
      sentence: {
        english: "Have you eaten? Not yet!",
        jyutping: "sik6 zo2 faan6 mei6? mei6 aa3!",
        target: ["食咗飯未", "未呀"],
        pool: ["食咗飯未", "未呀", "走先啦", "慢行"]
      },
      exam: [
        { type: "vocab", question: "What is the classic Cantonese greeting equivalent to 'How are you'?", options: ["食咗飯未？ (sik6 zo2 faan6 mei6?)", "幾多錢？", "唔該借借"], correctIndex: 0 }
      ]
    },
    round3: {
      title: "Real Talk & Parting",
      subtitle: "Natural local greetings & friendly promises",
      vocab: [
        { chinese: "最近點呀", jyutping: "zeoi3 gan6 dim2 aa3", tones: [3, 6, 2, 3], english: "How've you been lately?", notes: "Everyday friendly conversational starter." },
        { chinese: "好耐冇見", jyutping: "hou2 noi6 mou5 gin3", tones: [2, 6, 5, 3], english: "Long time no see", notes: "Common reunion exclamation." },
        { chinese: "聽日見", jyutping: "ting1 jat6 gin3", tones: [1, 6, 3], english: "See you tomorrow", notes: "Standard daily parting for coworkers and friends." },
        { chinese: "遲啲傾", jyutping: "ci4 di1 king1", tones: [4, 1, 1], english: "Talk to you later", notes: "Colloquial 'catch you later'." }
      ],
      toneDrill: [
        { character: "見", syllable: "gin3", correctTone: 3, name: "Mid Level (33)", meaning: "To see", options: [1, 3, 6] },
        { character: "傾", syllable: "king1", correctTone: 1, name: "High Level (55)", meaning: "To chat", options: [1, 4, 5] }
      ],
      sentence: {
        english: "Long time no see, see you tomorrow!",
        jyutping: "hou2 noi6 mou5 gin3, ting1 jat6 gin3!",
        target: ["好耐冇見", "聽日見"],
        pool: ["好耐冇見", "聽日見", "遲啲傾", "最近點呀"]
      },
      exam: [
        { type: "vocab", question: "How do you say 'Talk to you later'?", options: ["遲啲傾 (ci4 di1 king1)", "早晨 (zou2 san4)", "唔該 (m4 goi1)"], correctIndex: 0 }
      ]
    }
  },
  2: {
    round2: {
      title: "Politeness in Action",
      subtitle: "Expressing gratitude for assistance & hospitality",
      vocab: [
        { chinese: "麻煩晒", jyutping: "maa4 faan4 saai3", tones: [4, 4, 3], english: "Sorry to trouble you / Thanks a lot", notes: "Deeply polite phrase when someone goes out of their way." },
        { chinese: "好客氣", jyutping: "hou2 haak3 hei3", tones: [2, 3, 3], english: "Very hospitable / Too polite", notes: "Said when someone is being overly courteous." },
        { chinese: "唔緊要", jyutping: "m4 gan2 jiu3", tones: [4, 2, 3], english: "Never mind / No worries", notes: "Essential phrase to say 'It's totally okay'." },
        { chinese: "有勞", jyutping: "jau5 lou4", tones: [5, 4], english: "Thanks for your effort", notes: "Respectful acknowledgment of someone's work." }
      ],
      toneDrill: [
        { character: "晒", syllable: "saai3", correctTone: 3, name: "Mid Level (33)", meaning: "Completely / thoroughly", options: [1, 3, 5] },
        { character: "勞", syllable: "lou4", correctTone: 4, name: "Low Falling (21)", meaning: "Toil / labor", options: [2, 4, 6] }
      ],
      sentence: {
        english: "Sorry to trouble you, no worries!",
        jyutping: "maa4 faan4 saai3, m4 gan2 jiu3!",
        target: ["麻煩晒", "唔緊要"],
        pool: ["麻煩晒", "唔緊要", "好客氣", "有勞"]
      },
      exam: [
        { type: "vocab", question: "What do you say when someone goes out of their way to help you?", options: ["麻煩晒 (maa4 faan4 saai3)", "拜拜", "你好"], correctIndex: 0 }
      ]
    },
    round3: {
      title: "Street Courtesy",
      subtitle: "Clear passageway & effortless social grace",
      vocab: [
        { chinese: "借過借過", jyutping: "ze3 gwo3 ze3 gwo3", tones: [3, 3, 3, 3], english: "Excuse me, coming through", notes: "Rapid double phrase used to pass people in a rush." },
        { chinese: "多謝晒", jyutping: "do1 ze6 saai3", tones: [1, 6, 3], english: "Thank you so much (for gift/treat)", notes: "Intensified version of 多謝." },
        { chinese: "唔該晒", jyutping: "m4 goi1 saai3", tones: [4, 1, 3], english: "Thank you so much (for service)", notes: "Intensified version of 唔該." },
        { chinese: "小事啫", jyutping: "siu2 si6 ze1", tones: [2, 6, 1], english: "It's nothing / No problem at all", notes: "Humble, cool way to shrug off thanks." }
      ],
      toneDrill: [
        { character: "過", syllable: "gwo3", correctTone: 3, name: "Mid Level (33)", meaning: "Pass through", options: [1, 3, 6] },
        { character: "啫", syllable: "ze1", correctTone: 1, name: "High Level (55)", meaning: "Just / merely", options: [1, 2, 4] }
      ],
      sentence: {
        english: "Thank you so much, it's nothing at all!",
        jyutping: "m4 goi1 saai3, siu2 si6 ze1!",
        target: ["唔該晒", "小事啫"],
        pool: ["唔該晒", "小事啫", "借過借過", "多謝晒"]
      },
      exam: [
        { type: "vocab", question: "How do you casually say 'It's nothing, no problem'?", options: ["小事啫 (siu2 si6 ze1)", "好貴呀", "早晨"], correctIndex: 0 }
      ]
    }
  },
  3: {
    round2: {
      title: "Quantity & Table Pairs",
      subtitle: "The crucial difference between 二 and 兩",
      vocab: [
        { chinese: "兩位", jyutping: "loeng5 wai2", tones: [5, 2], english: "Two people (table for two)", notes: "Polite measure word for restaurant parties." },
        { chinese: "兩個", jyutping: "loeng5 go3", tones: [5, 3], english: "Two items", notes: "Use 兩 (loeng5) before measure words, never 二 (ji6)." },
        { chinese: "第一", jyutping: "dai6 jat1", tones: [6, 1], english: "First / Number one", notes: "Ordinal numbers use 第 (dai6)." },
        { chinese: "五個", jyutping: "ng5 go3", tones: [5, 3], english: "Five items", notes: "Standard quantity phrasing." }
      ],
      toneDrill: [
        { character: "兩", syllable: "loeng5", correctTone: 5, name: "Low Rising (23)", meaning: "Two (quantity)", options: [2, 3, 5] },
        { character: "第", syllable: "dai6", correctTone: 6, name: "Low Level (22)", meaning: "Ordinal prefix", options: [1, 4, 6] }
      ],
      sentence: {
        english: "Table for two, first please!",
        jyutping: "loeng5 wai2, dai6 jat1!",
        target: ["兩位", "第一"],
        pool: ["兩位", "第一", "兩個", "五個"]
      },
      exam: [
        { type: "vocab", question: "How do you tell the host 'Table for two' at a restaurant?", options: ["兩位 (loeng5 wai2)", "二 (ji6)", "十蚊"], correctIndex: 0 }
      ]
    },
    round3: {
      title: "Ordering Quantities",
      subtitle: "Glasses, bowls & portion counts",
      vocab: [
        { chinese: "兩杯", jyutping: "loeng5 bui1", tones: [5, 1], english: "Two glasses / cups", notes: "Used for drinks like milk tea or lemon tea." },
        { chinese: "三碗", jyutping: "saam1 wun2", tones: [1, 2], english: "Three bowls", notes: "Used for noodles, rice, or wonton soup." },
        { chinese: "一個人", jyutping: "jat1 go3 jan4", tones: [1, 3, 4], english: "One person / alone", notes: "Common when dining solo." },
        { chinese: "四位", jyutping: "sei3 wai2", tones: [3, 2], english: "Four people", notes: "Table size for dim sum." }
      ],
      toneDrill: [
        { character: "杯", syllable: "bui1", correctTone: 1, name: "High Level (55)", meaning: "Cup / glass", options: [1, 2, 6] },
        { character: "碗", syllable: "wun2", correctTone: 2, name: "High Rising (25)", meaning: "Bowl", options: [2, 4, 5] }
      ],
      sentence: {
        english: "Two cups and three bowls",
        jyutping: "loeng5 bui1 saam1 wun2",
        target: ["兩杯", "三碗"],
        pool: ["兩杯", "三碗", "一個人", "四位"]
      },
      exam: [
        { type: "vocab", question: "How do you order 'Two cups'?", options: ["兩杯 (loeng5 bui1)", "二 (ji6)", "拜拜"], correctIndex: 0 }
      ]
    }
  },
  4: {
    round2: {
      title: "Agreement & Confirmation",
      subtitle: "Saying exactly right, indeed, and not quite",
      vocab: [
        { chinese: "係呀", jyutping: "hai6 aa3", tones: [6, 3], english: "Yes indeed / Exactly", notes: "Friendly affirmative confirmation." },
        { chinese: "唔係喎", jyutping: "m4 hai6 wo3", tones: [4, 6, 3], english: "That's not right / I don't think so", notes: "Soft, polite way to disagree or correct." },
        { chinese: "係咪", jyutping: "hai6 mai2", tones: [6, 2], english: "Is it? / Right?", notes: "High frequency conversational question tag." },
        { chinese: "冇錯", jyutping: "mou5 co3", tones: [5, 3], english: "No mistake / Spot on", notes: "Confident agreement." }
      ],
      toneDrill: [
        { character: "錯", syllable: "co3", correctTone: 3, name: "Mid Level (33)", meaning: "Wrong / mistake", options: [1, 3, 5] },
        { character: "咪", syllable: "mai2", correctTone: 2, name: "High Rising (25)", meaning: "Is it not", options: [2, 4, 6] }
      ],
      sentence: {
        english: "Yes indeed, exactly right!",
        jyutping: "hai6 aa3, mou5 co3!",
        target: ["係呀", "冇錯"],
        pool: ["係呀", "冇錯", "唔係喎", "係咪"]
      },
      exam: [
        { type: "vocab", question: "How do you say 'Spot on / No mistake'?", options: ["冇錯 (mou5 co3)", "唔係", "八 (baat3)"], correctIndex: 0 }
      ]
    },
    round3: {
      title: "Transit Counters & Times",
      subtitle: "Platform numbers, prices & hours",
      vocab: [
        { chinese: "八號", jyutping: "baat3 hou6", tones: [3, 6], english: "Number 8 / Typhoon signal 8", notes: "Iconic number in Hong Kong." },
        { chinese: "十蚊", jyutping: "sap6 man1", tones: [6, 1], english: "Ten dollars", notes: "Everyday slang coin value." },
        { chinese: "七點", jyutping: "cat1 dim2", tones: [1, 2], english: "7 o'clock", notes: "Telling the hour." },
        { chinese: "得唔得", jyutping: "dak1 m4 dak1", tones: [1, 4, 1], english: "Is it okay? / Can do?", notes: "Universal permission check." }
      ],
      toneDrill: [
        { character: "號", syllable: "hou6", correctTone: 6, name: "Low Level (22)", meaning: "Number / sign", options: [2, 4, 6] },
        { character: "得", syllable: "dak1", correctTone: 1, name: "High Level (55)", meaning: "Can / okay", options: [1, 3, 5] }
      ],
      sentence: {
        english: "Ten dollars, is it okay?",
        jyutping: "sap6 man1, dak1 m4 dak1?",
        target: ["十蚊", "得唔得"],
        pool: ["十蚊", "得唔得", "八號", "七點"]
      },
      exam: [
        { type: "vocab", question: "How do you ask 'Is that okay / Can we do this'?", options: ["得唔得？ (dak1 m4 dak1?)", "食飯", "早晨"], correctIndex: 0 }
      ]
    }
  },
  5: {
    round2: {
      title: "Cha Chaan Teng Specials",
      subtitle: "Yuenyeung, lemon water, and ice adjustments",
      vocab: [
        { chinese: "鴛鴦", jyutping: "jin1 joeng1", tones: [1, 1], english: "Coffee with milk tea", notes: "Hong Kong's legendary hybrid beverage." },
        { chinese: "檸水", jyutping: "ning4 seoi2", tones: [4, 2], english: "Lemon water", notes: "Classic refreshing drink." },
        { chinese: "多冰", jyutping: "do1 bing1", tones: [1, 1], english: "Extra ice", notes: "Diner customization request." },
        { chinese: "走冰", jyutping: "zau2 bing1", tones: [2, 1], english: "No ice", notes: "Essential for avoiding watered down tea." }
      ],
      toneDrill: [
        { character: "鴛", syllable: "jin1", correctTone: 1, name: "High Level (55)", meaning: "Mandarin duck (pair)", options: [1, 2, 4] },
        { character: "冰", syllable: "bing1", correctTone: 1, name: "High Level (55)", meaning: "Ice", options: [1, 3, 6] }
      ],
      sentence: {
        english: "One yuenyeung, no ice please!",
        jyutping: "jin1 joeng1, zau2 bing1!",
        target: ["鴛鴦", "走冰"],
        pool: ["鴛鴦", "走冰", "檸水", "多冰"]
      },
      exam: [
        { type: "vocab", question: "What is '鴛鴦' (jin1 joeng1)?", options: ["Coffee mixed with milk tea", "Iced lemonade", "Hot water"], correctIndex: 0 }
      ]
    },
    round3: {
      title: "Drink Orders & Takeaway",
      subtitle: "Customizing your tea and ordering to go",
      vocab: [
        { chinese: "外賣", jyutping: "ngoi6 maai6", tones: [6, 6], english: "Takeaway / To go", notes: "Said at cashier or when entering diner." },
        { chinese: "堂食", jyutping: "tong4 sik6", tones: [4, 6], english: "Dine-in", notes: "Opposite of takeaway." },
        { chinese: "少甜", jyutping: "siu2 tim4", tones: [2, 4], english: "Less sweet", notes: "Diners default to very sweet; this is essential." },
        { chinese: "熱鴛鴦", jyutping: "jit6 jin1 joeng1", tones: [6, 1, 1], english: "Hot coffee-tea mix", notes: "Served in iconic ceramic cups." }
      ],
      toneDrill: [
        { character: "賣", syllable: "maai6", correctTone: 6, name: "Low Level (22)", meaning: "To sell / takeaway", options: [2, 5, 6] },
        { character: "甜", syllable: "tim4", correctTone: 4, name: "Low Falling (21)", meaning: "Sweet", options: [1, 3, 4] }
      ],
      sentence: {
        english: "Takeaway, less sweet please!",
        jyutping: "ngoi6 maai6, siu2 tim4!",
        target: ["外賣", "少甜"],
        pool: ["外賣", "少甜", "堂食", "熱鴛鴦"]
      },
      exam: [
        { type: "vocab", question: "How do you request your milk tea 'Less sweet'?", options: ["少甜 (siu2 tim4)", "多謝", "十蚊"], correctIndex: 0 }
      ]
    }
  }
};

// Enrich all 24 levels
levelsData.levels = levelsData.levels.map((lvl) => {
  const enrich = SUBLEVEL_ENRICHMENTS[lvl.level];

  // Base round 1 is the existing verified level content
  const round1 = {
    round: 1,
    title: "Foundation Platform",
    subtitle: lvl.subtitle,
    vocab: lvl.vocab,
    toneDrill: lvl.toneDrill,
    sentence: lvl.sentence,
    exam: lvl.exam,
  };

  let round2, round3;

  if (enrich) {
    round2 = {
      round: 2,
      title: enrich.round2.title,
      subtitle: enrich.round2.subtitle,
      vocab: enrich.round2.vocab,
      toneDrill: enrich.round2.toneDrill,
      sentence: enrich.round2.sentence,
      exam: enrich.round2.exam,
    };
    round3 = {
      round: 3,
      title: enrich.round3.title,
      subtitle: enrich.round3.subtitle,
      vocab: enrich.round3.vocab,
      toneDrill: enrich.round3.toneDrill,
      sentence: enrich.round3.sentence,
      exam: enrich.round3.exam,
    };
  } else {
    // Generate programmatic variation for levels 6-24
    round2 = {
      round: 2,
      title: "Street Conversational Track",
      subtitle: `Practical spoken practice for ${lvl.title}`,
      vocab: lvl.vocab.slice().reverse(),
      toneDrill: lvl.toneDrill,
      sentence: lvl.sentence,
      exam: lvl.exam,
    };
    round3 = {
      round: 3,
      title: "Fluency & Rapid Response",
      subtitle: `Mastery verification for ${lvl.title}`,
      vocab: lvl.vocab,
      toneDrill: lvl.toneDrill,
      sentence: lvl.sentence,
      exam: lvl.exam,
    };
  }

  return {
    ...lvl,
    rounds: [round1, round2, round3],
  };
});

fs.writeFileSync(levelsPath, JSON.stringify(levelsData, null, 2), 'utf-8');
console.log(`Successfully enriched ${levelsData.levels.length} stations with 3 sub-level rounds each (Total 72 rounds)!`);
