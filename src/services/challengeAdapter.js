/**
 * Converts level definitions and lesson schemas into standardized ChallengeNodes
 * for the Zustand SessionStore queue.
 *
 * Adheres to Section 4 guidelines:
 * - Instruction line max 4 words, sentence case, zero jargon.
 * - Technical labels (formula, slot, workbench, drill) strictly removed.
 * - The thing being asked is the large, prominent element.
 */

const SITUATIONAL_SCENARIOS = {
  1: {
    situation: 'Morning greeting at the office:',
    options: ['早晨 (zou2 san4) · Good morning', '拜拜 (baai1 baai3) · Bye-bye', '多謝 (do1 ze6) · Thank you'],
    correctIndex: 0,
    audioText: '早晨',
    explanation: '早晨 (zou2 san4) is the warm morning greeting throughout Hong Kong.',
  },
  2: {
    situation: 'Receiving a cup of hot milk tea:',
    options: ['唔該 (m4 goi1) · Thank you for service', '多謝 (do1 ze6) · Thank you for gifts', '早晨 (zou2 san4) · Good morning'],
    correctIndex: 0,
    audioText: '唔該',
    explanation: 'Always use 唔該 (m4 goi1) for services or dining. Reserve 多謝 (do1 ze6) for gifts.',
  },
  3: {
    situation: 'Ordering two egg waffles from a stall:',
    options: ['二 (ji6) · Two', '一 (jat1) · One', '三 (saam1) · Three'],
    correctIndex: 0,
    audioText: '二',
    explanation: '二 (ji6) is the number 2 in counting (Tone 6).',
  },
  4: {
    situation: 'Cashier asks if you are paying cash. Confirm "Yes":',
    options: ['係 (hai6) · Yes', '唔係 (m4 hai6) · No', '唔使 (m4 sai2) · No need'],
    correctIndex: 0,
    audioText: '係',
    explanation: '係 (hai6) means yes or affirmative in Cantonese.',
  },
  5: {
    situation: 'Ordering an iced lemon tea at a diner:',
    options: ['凍檸茶 (dung3 ning4 caa4) · Iced Lemon Tea', '熱奶茶 (jit6 naai5 caa4) · Hot Milk Tea', '水 (seoi2) · Water'],
    correctIndex: 0,
    audioText: '凍檸茶',
    explanation: '凍檸茶 (dung3 ning4 caa4) is iconic Hong Kong cold lemon tea.',
  },
  6: {
    situation: 'Asking the price of an item in a shop:',
    options: ['呢個幾多錢？ (ni1 go3 gei2 do1 cin2?)', '請問出口喺邊度？', '今日幾時嚟？'],
    correctIndex: 0,
    audioText: '呢個幾多錢',
    explanation: '幾多錢 (gei2 do1 cin2) means "How much money?".',
  },
  7: {
    situation: 'Asking politely where the station is:',
    options: ['請問地鐵站喺邊度？ (cing2 man6 dei6 tit3 zaam6 hai2 bin1 dou6?)', '幾多錢？', '有落唔該！'],
    correctIndex: 0,
    audioText: '請問地鐵站喺邊度',
    explanation: '請問 (May I ask) + 喺邊度 (where is it?).',
  },
  8: {
    situation: 'Asking for a slightly lower price at the market:',
    options: ['平啲得唔得？ (peng4 di1 dak1 m4 dak1?)', '我要呢個 (ngo5 jiu3 ni1 go3)', '唔該埋單 (m4 goi1 maai4 daan1)'],
    correctIndex: 0,
    audioText: '平啲得唔得',
    explanation: '平啲 (a bit cheaper) + 得唔得 (is it okay?).',
  },
  9: {
    situation: 'Scheduling a lunch for tomorrow:',
    options: ['聽日 (ting1 jat6) · Tomorrow', '今日 (gam1 jat6) · Today', '琴日 (kam4 jat6) · Yesterday'],
    correctIndex: 0,
    audioText: '聽日',
    explanation: '聽日 (ting1 jat6) means tomorrow in Cantonese.',
  },
  10: {
    situation: 'Ordering breakfast Set A with toast:',
    options: ['我要A餐多士 (ngo5 jiu3 ei1 caan1 do1 si2)', '唔該借借 (m4 goi1 ze3 ze3)', '嘟八達通 (doot1 baat3 daat6 tung1)'],
    correctIndex: 0,
    audioText: '我要A餐多士',
    explanation: 'Diners designate breakfast sets as A餐 (Set A), B餐, and C餐.',
  },
  11: {
    situation: 'Trying on a shirt that fits perfectly:',
    options: ['啱啱好 (ngaam1 ngaam1 hou2) · Just right!', '太大 (taai3 daai6) · Too big', '好貴 (hou2 gwai3) · Very expensive'],
    correctIndex: 0,
    audioText: '啱啱好',
    explanation: '啱啱好 (ngaam1 ngaam1 hou2) means a perfect, satisfying fit.',
  },
  12: {
    situation: 'Identify high level (55) pitch, as in 詩 (poem):',
    options: ['Tone 1 (High Level 55)', 'Tone 4 (Low Falling 21)', 'Tone 6 (Low Level 22)'],
    correctIndex: 0,
    audioText: '詩',
    explanation: 'Tone 1 is the high flat pitch (55).',
  },
  13: {
    situation: 'Saying you already finished lunch:',
    options: ['食咗 (sik6 zo2) · Already ate', '食緊 (sik6 gan2) · Currently eating', '想食 (soeng2 sik6) · Want to eat'],
    correctIndex: 0,
    audioText: '食咗',
    explanation: '咗 (zo2) marks completed actions.',
  },
  14: {
    situation: 'Calling your stop on a red minibus:',
    options: ['前面有落唔該！ (cin4 min6 jau5 lok6 m4 goi1!)', '好靚呀！', '早晨！'],
    correctIndex: 0,
    audioText: '前面有落唔該',
    explanation: '有落 (jau5 lok6) tells the driver you need to get off.',
  },
  15: {
    situation: 'Saying you finished work and are going home:',
    options: ['放工返屋企 (fong3 gung1 faan1 uk1 kei2)', '啱啱開工', '出街食飯'],
    correctIndex: 0,
    audioText: '放工返屋企',
    explanation: '放工 (finish work) + 返屋企 (head home).',
  },
  16: {
    situation: 'Tapping your smartcard at a convenience store:',
    options: ['嘟八達通 (doot1 baat3 daat6 tung1)', '收現金', '寫支票'],
    correctIndex: 0,
    audioText: '嘟八達通',
    explanation: '嘟 (doot1) mimics the contactless card sound.',
  },
  17: {
    situation: 'Introducing a companion as your friend:',
    options: ['呢個係我朋友 (ni1 go3 hai6 ngo5 pang4 jau5)', '呢個係我阿哥', '呢個係司機'],
    correctIndex: 0,
    audioText: '呢個係我朋友',
    explanation: '呢個係 (This is) + 我朋友 (my friend).',
  },
  18: {
    situation: 'Reminding someone it is raining today:',
    options: ['今日落雨帶遮 (gam1 jat6 lok6 jyu5 daai3 ze1)', '今日好熱', '聽日見啦'],
    correctIndex: 0,
    audioText: '今日落雨帶遮',
    explanation: '落雨 (raining) + 帶遮 (bring an umbrella).',
  },
  19: {
    situation: 'Asking politely if someone can give you a hand:',
    options: ['可唔可以幫手？ (ho2 m4 ho2 ji5 bong1 sau2?)', '你走啦', '我唔得閒'],
    correctIndex: 0,
    audioText: '可唔可以幫手',
    explanation: '幫手 (give a hand / help).',
  },
  20: {
    situation: 'Ordering a steamer of Har Gow and Siu Mai at dim sum:',
    options: ['一籠蝦餃一籠燒賣 (jat1 lung4 haa1 gaau2 jat1 lung4 siu1 maai2)', '一個菠蘿包', '一杯凍檸茶'],
    correctIndex: 0,
    audioText: '一籠蝦餃一籠燒賣',
    explanation: '一籠 (one steamer) is the counter for dim sum baskets.',
  },
  21: {
    situation: 'Expressing you had a great, happy day:',
    options: ['好正，好開心！ (hou2 zeng3, hou2 hoi1 sam1!)', '好攰好悶', '麻麻地啦'],
    correctIndex: 0,
    audioText: '好正好開心',
    explanation: '好正 (awesome) + 好開心 (very happy).',
  },
  22: {
    situation: 'Reassuring a friend that everything is all set:',
    options: ['搞掂晒喇！ (gaau2 dim3 saai3 laa3!)', '好難搞呀', '走先啦'],
    correctIndex: 0,
    audioText: '搞掂晒喇',
    explanation: '搞掂 (all set / settled).',
  },
  23: {
    situation: 'Saying you learn Cantonese because you love Hong Kong:',
    options: ['因為鍾意香港，所以學廣東話', '雖然好攰，但係返工', '如果落雨，就帶遮'],
    correctIndex: 0,
    audioText: '因為鍾意香港所以學廣東話',
    explanation: '因為 (because) ... 所以 (therefore).',
  },
  24: {
    situation: 'Encouraging someone with Hong Kong\'s rallying cry:',
    options: ['加油！ (gaa1 jau4!) · Keep going!', '拜拜！ (baai1 baai3!) · Bye-bye!', '唔使！ (m4 sai2!) · No need!'],
    correctIndex: 0,
    audioText: '加油',
    explanation: '加油 (gaa1 jau4 - add oil) means keep going.',
  },
};

const PATTERN_REGISTRY = {
  1: {
    template: 'Greeting pair',
    slots: [
      { label: 'First', options: ['你好', '早晨'], correct: '你好' },
      { label: 'Second', options: ['早晨', '拜拜', '好'], correct: '早晨' },
    ],
    targetSentence: '你好 早晨',
    english: 'Hello, good morning!',
  },
  2: {
    template: 'Courtesy phrase',
    fixedPrefix: '唔該',
    slots: [
      { label: 'Action', options: ['借借', '唔使', '多謝'], correct: '借借' },
    ],
    targetSentence: '唔該 借借',
    english: 'Excuse me, please let me pass.',
  },
  3: {
    template: 'Counting sequence',
    slots: [
      { label: 'One', options: ['一', '二', '三'], correct: '一' },
      { label: 'Two', options: ['二', '四', '五'], correct: '二' },
      { label: 'Three', options: ['三', '一', '四'], correct: '三' },
    ],
    targetSentence: '一 二 三',
    english: 'One, two, three!',
  },
  4: {
    template: 'Price answer',
    fixedPrefix: '係',
    slots: [
      { label: 'Amount', options: ['八', '六', '十'], correct: '八' },
    ],
    fixedSuffix: '蚊',
    targetSentence: '係 八 蚊',
    english: 'Yes, eight dollars.',
  },
  5: {
    template: 'Drink order',
    fixedPrefix: '唔該',
    slots: [
      { label: 'Cup', options: ['一杯', '兩杯', '一樽'], correct: '一杯' },
      { label: 'Drink', options: ['凍檸茶', '奶茶', '水'], correct: '凍檸茶' },
    ],
    targetSentence: '唔該 一杯 凍檸茶',
    english: 'Please, one iced lemon tea.',
  },
  6: {
    template: 'Asking price',
    slots: [
      { label: 'Item', options: ['呢個', '嗰個', '邊個'], correct: '呢個' },
    ],
    fixedSuffix: '幾多錢？',
    targetSentence: '呢個 幾多錢？',
    english: 'How much is this one?',
  },
  7: {
    template: 'Direction question',
    fixedPrefix: '請問',
    slots: [
      { label: 'Place', options: ['地鐵站', '出口', '前面'], correct: '地鐵站' },
    ],
    fixedSuffix: '喺邊度？',
    targetSentence: '請問 地鐵站 喺邊度？',
    english: 'Excuse me, where is the station?',
  },
  8: {
    template: 'Market ask',
    fixedPrefix: '我要呢個',
    slots: [
      { label: 'Price', options: ['平啲', '好靚', '多啲'], correct: '平啲' },
    ],
    fixedSuffix: '得唔得？',
    targetSentence: '我要呢個 平啲 得唔得？',
    english: 'I want this, a bit cheaper, okay?',
  },
  9: {
    template: 'Time question',
    slots: [
      { label: 'Day', options: ['今日', '聽日', '琴日'], correct: '今日' },
    ],
    fixedSuffix: '幾時 嚟？',
    targetSentence: '今日 幾時 嚟？',
    english: 'When are you coming today?',
  },
  10: {
    template: 'Breakfast combo',
    fixedPrefix: '我要',
    slots: [
      { label: 'Set', options: ['A餐', 'B餐', '特餐'], correct: 'A餐' },
      { label: 'Side', options: ['多士', '太陽蛋', '公仔麵'], correct: '多士' },
    ],
    targetSentence: '我要 A餐 多士',
    english: 'I want Set A with toast.',
  },
  11: {
    template: 'Fit feedback',
    fixedPrefix: '呢個',
    slots: [
      { label: 'Size', options: ['大', '細', '長'], correct: '大' },
      { label: 'Fit', options: ['啱啱好', '試下', '好靚'], correct: '啱啱好' },
    ],
    targetSentence: '呢個 大 啱啱好',
    english: 'This large one fits just right.',
  },
  12: {
    template: 'Tone triad',
    slots: [
      { label: 'Tone 1', options: ['詩', '史', '試'], correct: '詩' },
      { label: 'Tone 3', options: ['試', '時', '市'], correct: '試' },
      { label: 'Tone 6', options: ['事', '市', '詩'], correct: '事' },
    ],
    targetSentence: '詩 試 事',
    english: 'Poem (T1), Try (T3), Matter (T6)',
  },
  13: {
    template: 'Completed action',
    slots: [
      { label: 'Person', options: ['我', '你', '佢'], correct: '我' },
      { label: 'Action', options: ['食飯', '飲茶', '返屋企'], correct: '食飯' },
    ],
    fixedSuffix: '咗',
    targetSentence: '我 食飯 咗',
    english: 'I have already eaten.',
  },
  14: {
    template: 'Transit call',
    fixedPrefix: '司機',
    slots: [
      { label: 'Spot', options: ['前面', '路口', '站頭'], correct: '前面' },
    ],
    fixedSuffix: '有落！',
    targetSentence: '司機 前面 有落！',
    english: 'Driver, drop-off ahead please!',
  },
  15: {
    template: 'Going home',
    slots: [
      { label: 'Shift', options: ['放工', '放學', '開工'], correct: '放工' },
    ],
    fixedSuffix: '返 屋企',
    targetSentence: '放工 返 屋企',
    english: 'Clocked out, heading home.',
  },
  16: {
    template: 'Smartcard tap',
    fixedPrefix: '我 嘟',
    slots: [
      { label: 'Card', options: ['八達通', '信用卡', '現金'], correct: '八達通' },
      { label: 'Declined', options: ['唔使 膠袋', '要 膠袋', '印單'], correct: '唔使 膠袋' },
    ],
    targetSentence: '我 嘟 八達通 唔使 膠袋',
    english: 'I will tap Octopus, no bag needed.',
  },
  17: {
    template: 'Introducing person',
    fixedPrefix: '呢個 係 我',
    slots: [
      { label: 'Relation', options: ['朋友', '爸爸', '媽媽'], correct: '朋友' },
    ],
    targetSentence: '呢個 係 我 朋友',
    english: 'This is my friend.',
  },
  18: {
    template: 'Weather note',
    slots: [
      { label: 'Day', options: ['今日', '聽日', '而家'], correct: '今日' },
      { label: 'Weather', options: ['落雨', '好熱', '好凍'], correct: '落雨' },
    ],
    fixedSuffix: '帶遮',
    targetSentence: '今日 落雨 帶遮',
    english: 'Raining today, remember your umbrella.',
  },
  19: {
    template: 'Asking favor',
    fixedPrefix: '唔好意思',
    slots: [
      { label: 'Query', options: ['可唔可以', '得唔得', '想唔想'], correct: '可唔可以' },
    ],
    fixedSuffix: '幫手？',
    targetSentence: '唔好意思 可唔可以 幫手？',
    english: 'Excuse me, could you give a hand?',
  },
  20: {
    template: 'Dim sum pairs',
    fixedPrefix: '唔該 一籠',
    slots: [
      { label: 'First', options: ['蝦餃', '叉燒包', '多士'], correct: '蝦餃' },
      { label: 'Second', options: ['一籠 燒賣', '一籠 蛋撻', '一碟 腸粉'], correct: '一籠 燒賣' },
    ],
    targetSentence: '唔該 一籠 蝦餃 一籠 燒賣',
    english: 'One steamer of Har Gow and one Siu Mai.',
  },
  21: {
    template: 'Expressing mood',
    fixedPrefix: '今日',
    slots: [
      { label: 'Vibe', options: ['好正', '好攰', '好熱'], correct: '好正' },
      { label: 'Feeling', options: ['好開心', '好得意', '好搞笑'], correct: '好開心' },
    ],
    targetSentence: '今日 好正 好開心',
    english: 'Today is awesome, I feel very happy!',
  },
  22: {
    template: 'All set phrase',
    slots: [
      { label: 'Calm', options: ['冇問題', '放心啦', '唔緊要'], correct: '冇問題' },
      { label: 'Done', options: ['全部搞掂', '全部搞亂', '埋單'], correct: '全部搞掂' },
    ],
    fixedSuffix: '！',
    targetSentence: '冇問題 全部搞掂！',
    english: 'No problem, everything is all set!',
  },
  23: {
    template: 'Because and so',
    fixedPrefix: '因為',
    slots: [
      { label: 'Reason', options: ['鍾意香港', '有時間', '想返工'], correct: '鍾意香港' },
      { label: 'Result', options: ['所以 學廣東話', '所以 買機票', '所以 瞓覺'], correct: '所以 學廣東話' },
    ],
    targetSentence: '因為 鍾意香港 所以 學廣東話',
    english: 'Because I love Hong Kong, so I learn Cantonese.',
  },
  24: {
    template: 'Fluency triumph',
    fixedPrefix: '我 識講 廣東話',
    slots: [
      { label: 'Cheer', options: ['加油', '好正', '多謝'], correct: '加油' },
    ],
    fixedSuffix: '！',
    targetSentence: '我 識講 廣東話 加油！',
    english: 'I can speak Cantonese, keep going!',
  },
};

function getAcousticDistractors(jyutping) {
  if (!jyutping) return ['nei5', 'hou2'];
  const parts = jyutping.split(' ');
  const target = parts[0];

  const map = {
    nei5: ['lei5', 'mei5', 'dei5'],
    hou2: ['kou2', 'tou2', 'gou2'],
    baai1: ['paai1', 'maai1', 'daai1'],
    zou2: ['cou2', 'sou2', 'dou2'],
    m4: ['ng4', 'hm4', 'aa4'],
    goi1: ['koi1', 'gai1', 'doi1'],
    do1: ['to1', 'bo1', 'go1'],
    ze6: ['se6', 'de6', 'ge6'],
    jat1: ['at1', 'kat1', 'bat1'],
    ji6: ['si6', 'ni6', 'li6'],
    saam1: ['taam1', 'caam1', 'kaam1'],
    sei3: ['pei3', 'tei3', 'kei3'],
    ng5: ['m5', 'ung5', 'ing5'],
    luk6: ['muk6', 'duk6', 'buk6'],
    cat1: ['tat1', 'pat1', 'sat1'],
    baat3: ['paat3', 'maat3', 'daat3'],
    gau2: ['kau2', 'dau2', 'sau2'],
    sap6: ['dap6', 'kap6', 'tap6'],
    caa4: ['taa4', 'paa4', 'saa4'],
    seoi2: ['feoi2', 'teoi2', 'leoi2'],
  };

  if (map[target]) {
    return map[target].slice(0, 2);
  }

  const lastChar = target.slice(-1);
  const stem = target.slice(0, -1);
  const toneNum = parseInt(lastChar, 10) || 1;
  const altTone1 = (toneNum % 6) + 1;
  const altTone2 = ((toneNum + 2) % 6) + 1;
  return [`${stem}${altTone1}`, `${stem}${altTone2}`];
}

export const challengeAdapter = {
  fromLevel(level) {
    if (!level) return [];

    const nodes = [];
    const levelNum = level.level || 1;
    const themeId = level.themeId || 'red';
    const vocabList = Array.isArray(level.vocab) ? level.vocab : [];

    // 1. EAR TRAINING SOUND IDENTIFICATION: "What do you hear?"
    if (vocabList.length > 0) {
      const earTargets = vocabList.slice(0, 2);
      earTargets.forEach((v, idx) => {
        const distractors = getAcousticDistractors(v.jyutping);
        const options = [v.jyutping, ...distractors].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(v.jyutping);

        nodes.push({
          id: `lvl_${levelNum}_ear_${idx}`,
          type: 'multiple_choice',
          title: 'Listening',
          prompt: 'What do you hear?',
          hanzi: v.chinese,
          jyutping: v.jyutping,
          audioText: v.chinese,
          isListeningDrill: true,
          displayMode: 'jyutping_first',
          options,
          correctIndex,
          themeId,
          explanation: `The sound is "${v.jyutping}" (${v.chinese}). Means "${v.english}".`,
        });
      });
    }

    // 2. VOCABULARY RECOGNITION: "Pick the meaning"
    vocabList.forEach((v, idx) => {
      const distractors = vocabList
        .filter((_, i) => i !== idx)
        .map((item) => item.english)
        .slice(0, 2);

      const fallbackDistractors = ['Thank you', 'Hello', 'One', 'Good morning', 'Yes'];
      while (distractors.length < 2) {
        const pick = fallbackDistractors.find((d) => d !== v.english && !distractors.includes(d));
        if (pick) distractors.push(pick);
        else distractors.push(`Option ${distractors.length + 1}`);
      }

      const options = [v.english, ...distractors].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(v.english);

      nodes.push({
        id: `lvl_${levelNum}_vocab_${idx}`,
        type: 'multiple_choice',
        title: 'Vocabulary',
        prompt: 'Pick the meaning',
        hanzi: v.chinese,
        jyutping: v.jyutping,
        english: v.english,
        notes: v.notes,
        displayMode: 'standard',
        themeId,
        options,
        correctIndex,
        explanation: `${v.chinese} (${v.jyutping}) means "${v.english}".`,
      });
    });

    // 3. REVERSE TRANSLATION: "Say this in Cantonese"
    if (vocabList.length >= 2) {
      vocabList.slice(0, 2).forEach((v, idx) => {
        const distractors = vocabList
          .filter((_, i) => i !== idx)
          .map((item) => `${item.jyutping} (${item.chinese})`)
          .slice(0, 2);

        const correctOption = `${v.jyutping} (${v.chinese})`;
        const options = [correctOption, ...distractors].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(correctOption);

        nodes.push({
          id: `lvl_${levelNum}_reverse_${idx}`,
          type: 'multiple_choice',
          title: 'Translate',
          prompt: 'Say this in Cantonese',
          targetEnglish: v.english,
          hanzi: v.chinese,
          jyutping: v.jyutping,
          audioText: v.chinese,
          displayMode: 'reverse',
          options,
          correctIndex,
          themeId,
          explanation: `"${v.english}" is ${v.chinese} (${v.jyutping}).`,
        });
      });
    }

    // 4. ACOUSTIC TONE DISCRIMINATION: "Which tone is it?"
    if (Array.isArray(level.toneDrill) && level.toneDrill.length > 0) {
      level.toneDrill.slice(0, 2).forEach((td, idx) => {
        nodes.push({
          id: `lvl_${levelNum}_tone_${idx}`,
          type: 'tone_discrimination',
          title: 'Tones',
          prompt: 'Which tone is it?',
          character: td.character,
          syllable: td.syllable,
          hanzi: td.character,
          jyutping: td.syllable,
          english: td.meaning,
          correctTone: td.correctTone,
          toneName: td.name,
          options: td.options || [1, 2, 4, 6],
          themeId,
          explanation: `"${td.syllable}" (${td.character}) is Tone ${td.correctTone} (${td.name}).`,
        });
      });
    }

    // 5. SITUATIONAL CONVERSATION: "Choose what to say"
    const scenario = SITUATIONAL_SCENARIOS[levelNum];
    if (scenario) {
      nodes.push({
        id: `lvl_${levelNum}_scenario`,
        type: 'multiple_choice',
        title: 'Conversation',
        prompt: 'Choose what to say',
        situation: scenario.situation,
        audioText: scenario.audioText,
        options: scenario.options,
        correctIndex: scenario.correctIndex,
        themeId,
        explanation: scenario.explanation,
      });
    }

    // 6. TACTILE SENTENCE ASSEMBLER: "Build the sentence"
    if (level.sentence && Array.isArray(level.sentence.target)) {
      const s = level.sentence;
      const pool = Array.from(new Set([...s.target, ...(s.pool || [])])).sort(() => Math.random() - 0.5);

      nodes.push({
        id: `lvl_${levelNum}_sentence`,
        type: 'token_scramble',
        title: 'Sentence',
        prompt: 'Build the sentence',
        english: s.english,
        jyutping: s.jyutping,
        target: s.target,
        pool,
        themeId,
        explanation: `Order: ${s.target.join(' ')} (${s.jyutping})`,
      });
    }

    // 7. PATTERN BUILDER: "Complete the phrase"
    const pattern = PATTERN_REGISTRY[levelNum] || PATTERN_REGISTRY[1];
    nodes.push({
      id: `lvl_${levelNum}_pattern`,
      type: 'pattern_slot',
      title: 'Patterns',
      prompt: 'Complete the phrase',
      formula: pattern.template,
      fixedPrefix: pattern.fixedPrefix,
      fixedSuffix: pattern.fixedSuffix,
      slots: pattern.slots,
      targetSentence: pattern.targetSentence,
      english: pattern.english,
      themeId,
      explanation: `Target: "${pattern.targetSentence}" (${pattern.english})`,
    });

    return nodes;
  },
};
