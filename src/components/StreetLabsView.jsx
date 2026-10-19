import React, { useState, useEffect, useRef } from 'react';
import { 
  Coffee, ShoppingBag, CreditCard, Bus, Volume2, CheckCircle2, 
  ChevronRight, Sparkles, RotateCcw, VolumeX, MessageSquare, ThumbsUp, Award
} from 'lucide-react';
import { speechEngine } from '../services/speechEngine';
import { acousticSimulator } from '../services/acousticSimulator';
import { metroService } from '../services/metroService';
import { habitEngine } from '../services/habitEngine';

const DETAILED_STREET_LABS = [
  {
    id: 'cct',
    title: 'Cha Chaan Teng Diner Lab',
    titleChinese: '茶餐廳點餐',
    jyutping: 'caa4 caan1 teng1 dim2 caan1',
    description: 'Survive the lunch rush: custom drinks (走冰, 少甜) and classic breakfast sets.',
    icon: Coffee,
    badge: 'Dining',
    soundscapeId: 'cha-chaan-teng',
    color: '#00A86B', // Jade green
    culturalNote: 'In Hong Kong diners, speed is everything. Specify your drink customization upfront: 走冰 (no ice), 少甜 (less sweet), or 走甜 (unsweetened).',
    interactiveSteps: [
      {
        stepIndex: 1,
        speaker: 'Waiter (伙計)',
        hanzi: '幾位呀？今日想飲咩茶？',
        jyutping: 'gei2 wai2 aa3? gam1 jat6 soeng2 jam2 me1 caa4?',
        english: 'How many people? What drink would you like today?',
        choices: [
          {
            id: 'cct_1_a',
            hanzi: '一位，唔該一杯凍檸茶，少甜走冰！',
            jyutping: 'jat1 wai2, m4 goi1 jat1 bui1 dung1 ning4 caa4, siu2 tim4 zau2 bing1!',
            english: 'One person please. One iced lemon tea, less sweet and no ice!',
            politenessScore: 100,
            feedback: 'Perfect! Crisp, courteous, and gives exact drink specifications in true HK diner style.',
            replyHanzi: '好！食咩餐？沙爹牛肉公仔麵配多士太陽蛋？',
            replyJyutping: 'hou2! sik6 me1 caan1? saa1 de1 ngau4 juk6 gung1 zai2 min6 pui3 do1 si2 taai3 joeng4 daan2?',
            replyEnglish: 'Good! What meal? Satay beef instant noodles with toast and sunny-side egg?'
          },
          {
            id: 'cct_1_b',
            hanzi: '兩位，熱奶茶同熱鴛鴦各一杯，唔該！',
            jyutping: 'loeng5 wai2, jit6 naai5 caa4 tung4 jit6 jin1 joeng1 gok3 jat1 bui1, m4 goi1!',
            english: 'Two people, one hot milk tea and one hot Yuanyang please!',
            politenessScore: 100,
            feedback: 'Excellent local choice! Yuanyang is the quintessential HK coffee + tea blend.',
            replyHanzi: '得！配個剛出爐嘅菠蘿油定蛋撻呀？',
            replyJyutping: 'dak1! pui3 go3 gong1 ceot1 lou4 ge3 bo1 lo4 jau4 ding6 daan6 taat1 aa3?',
            replyEnglish: 'Got it! Pair with fresh hot pineapple butter bun or egg tart?'
          },
          {
            id: 'cct_1_c',
            hanzi: '畀杯茶我！',
            jyutping: 'bei2 bui1 caa4 ngo5!',
            english: 'Give me a cup of tea!',
            politenessScore: 40,
            feedback: 'A bit too abrupt! In HK diners, always add "唔該" (m4 goi1) when requesting anything.',
            replyHanzi: '熱定凍呀？快啲講啦，趕住落單呀！',
            replyJyutping: 'jit6 ding6 dung3 aa3? faai3 di1 gong2 laa1, gon2 zyu6 lok6 daan1 aa3!',
            replyEnglish: 'Hot or cold? Speak up quickly, we need to place the ticket!'
          }
        ]
      },
      {
        stepIndex: 2,
        speaker: 'Waiter (伙計)',
        hanzi: '食咩餐？配公仔麵定多士煎蛋？',
        jyutping: 'sik6 me1 caan1? pui3 gung1 zai2 min6 ding6 do1 si2 zin1 daan2?',
        english: 'What set meal? Instant noodles or toast with fried egg?',
        choices: [
          {
            id: 'cct_2_a',
            hanzi: '我要A餐，沙爹牛肉公仔麵，加煎雙蛋！',
            jyutping: 'ngo5 jiu3 A caan1, saa1 de1 ngau4 juk6 gung1 zai2 min6, gaa1 zin1 soeng1 daan2!',
            english: 'I want Set A: satay beef noodles with double fried eggs!',
            politenessScore: 100,
            feedback: 'The undisputed champion breakfast of Hong Kong working commuters.',
            replyHanzi: '得！即刻同你落單，好快有得食！',
            replyJyutping: 'dak1! zik1 hak1 tung4 nei5 lok6 daan1, hou2 faai3 jau5 dak1 sik6!',
            replyEnglish: 'Got it! Sending ticket to kitchen, food will be up in minutes!'
          },
          {
            id: 'cct_2_b',
            hanzi: '淨係要個菠蘿油得喇，唔該！',
            jyutping: 'zing6 hai6 jiu3 go3 bo1 lo4 jau4 dak1 laa3, m4 goi1!',
            english: 'Just a pineapple bun with butter will do, thank you!',
            politenessScore: 95,
            feedback: 'Great afternoon tea order (下午茶).',
            replyHanzi: '好，熱辣辣菠蘿油即刻到！',
            replyJyutping: 'hou2, jit6 laat6 laat6 bo1 lo4 jau4 zik1 hak1 dou3!',
            replyEnglish: 'Good, piping hot pineapple bun coming right up!'
          }
        ]
      },
      {
        stepIndex: 3,
        speaker: 'You (Learner)',
        hanzi: '伙計，埋單唔該！',
        jyutping: 'fo2 gei3, maai4 daan1 m4 goi1!',
        english: 'Waiter, the check please!',
        choices: [
          {
            id: 'cct_3_a',
            hanzi: '伙計，埋單唔該！呢度一共幾多錢？',
            jyutping: 'fo2 gei3, maai4 daan1 m4 goi1! ni1 dou6 jat1 gung6 gei2 do1 cin2?',
            english: 'Waiter, check please! How much is it in total?',
            politenessScore: 100,
            feedback: 'Exact colloquial formula for settling a restaurant bill in Cantonese.',
            replyHanzi: '一共五十二蚊，拎張單去收銀處畀啦！',
            replyJyutping: 'jat1 gung6 ng5 sap6 ji6 man1, ling1 zoeng1 daan1 heoi3 sau1 ngan4 cyu3 bei2 laa1!',
            replyEnglish: 'Fifty-two dollars total, take the slip to the cashier booth!'
          }
        ]
      }
    ]
  },
  {
    id: 'market',
    title: 'Wet Market Produce Lab',
    titleChinese: '街市買餸',
    jyutping: 'gaai1 si5 maai5 sung3',
    description: 'Bargain with fishmongers and green grocers by the catty (斤).',
    icon: ShoppingBag,
    badge: 'Street Market',
    soundscapeId: 'wet-market',
    color: '#E60012', // Market Red
    culturalNote: 'In Hong Kong wet markets, weights are measured in Catties (斤, approx 600g). Always ask for a sprig of scallion (蔥) or cilantro (芫茜) with your vegetable purchase!',
    interactiveSteps: [
      {
        stepIndex: 1,
        speaker: 'Vendor (檔主)',
        hanzi: '靚仔！今日菜心好靚好甜呀，啱啱開箱！',
        jyutping: 'leng3 zai2! gam1 jat6 coi3 sam1 hou2 leng3 hou2 tim4 aa3, ngaam1 ngaam1 hoi1 soeng1!',
        english: 'Handsome guy! The choy sum is gorgeous and sweet today, just opened the box!',
        choices: [
          {
            id: 'mkt_1_a',
            hanzi: '老闆，呢啲菜心一斤幾多錢呀？',
            jyutping: 'lou5 baan2, ni1 di1 coi3 sam1 jat1 gan1 gei2 do1 cin2 aa3?',
            english: 'Boss, how much is this choy sum per catty?',
            politenessScore: 100,
            feedback: 'Polite and natural. Calling the shopkeeper "老闆" (lou5 baan2) earns respect.',
            replyHanzi: '十四蚊一斤！包甜包嫩！要幾多呀？',
            replyJyutping: 'sap6 sei3 man1 jat1 gan1! baau1 tim4 baau1 nyun6! jiu3 gei2 do1 aa3?',
            replyEnglish: 'Fourteen dollars per catty! Guaranteed sweet and tender! How much do you want?'
          },
          {
            id: 'mkt_1_b',
            hanzi: '咁貴嘅！平啲啦！',
            jyutping: 'gam3 gwai3 ge3! peng4 di1 laa1!',
            english: 'So expensive! Make it cheaper!',
            politenessScore: 50,
            feedback: 'Too blunt before asking the price. Build a friendly rapport first!',
            replyHanzi: '今日來貨貴呀！你要多啲我算你平兩蚊啦！',
            replyJyutping: 'gam1 jat6 loi4 fo3 gwai3 aa3! nei5 jiu3 do1 di1 ngo5 syun3 nei5 peng4 loeng5 man1 laa1!',
            replyEnglish: 'Wholesale cost was high today! If you buy more I will discount two bucks!'
          }
        ]
      },
      {
        stepIndex: 2,
        speaker: 'Vendor (檔主)',
        hanzi: '要一斤定半斤呀？',
        jyutping: 'jiu3 jat1 gan1 ding6 bun3 gan1 aa3?',
        english: 'Do you want one catty or half a catty?',
        choices: [
          {
            id: 'mkt_2_a',
            hanzi: '秤一斤，送多兩條蔥得唔得呀？',
            jyutping: 'cing3 jat1 gan1, sung3 do1 loeng5 tiu4 cung1 dak1 m4 dak1 aa3?',
            english: 'Weigh one catty, can you throw in a couple scallions?',
            politenessScore: 100,
            feedback: 'Legendary Hong Kong wet market etiquette! Shopkeepers will almost always say yes.',
            replyHanzi: '好啦好啦，靚仔送多兩條蔥同芫茜畀你！一共十四蚊！',
            replyJyutping: 'hou2 laa1 hou2 laa1, leng3 zai2 sung3 do1 loeng5 tiu4 cung1 tung4 jin4 sai1 bei2 nei5! jat1 gung6 sap6 sei3 man1!',
            replyEnglish: 'Alright alright! Handsome guy gets scallions and cilantro free! Fourteen dollars total!'
          }
        ]
      }
    ]
  },
  {
    id: 'supermarket',
    title: 'Supermarket & Convenience Store',
    titleChinese: '便利店八達通',
    jyutping: 'bin6 lei6 dim3 baat3 daat6 tung1',
    description: 'Master Octopus card tap payments and decline plastic bags.',
    icon: CreditCard,
    badge: 'Daily Living',
    soundscapeId: 'none',
    color: '#0038A8', // Blue
    culturalNote: 'In Hong Kong convenience stores and supermarkets, plastic bags cost $1 HKD by law. Most locals shout "唔使膠袋" (no plastic bag) before tapping.',
    interactiveSteps: [
      {
        stepIndex: 1,
        speaker: 'Cashier (收銀員)',
        hanzi: '一共六十三蚊，點樣畀錢？要唔要膠袋？',
        jyutping: 'jat1 gung6 luk6 sap6 saam1 man1, dim2 joeng2 bei2 cin2? jiu3 m4 jiu3 gaau1 doi2?',
        english: 'Total is 63 dollars, how are you paying? Do you need a plastic bag?',
        choices: [
          {
            id: 'spm_1_a',
            hanzi: '我嘟八達通，自己有環保袋，唔使膠袋！',
            jyutping: 'ngo5 doot1 baat3 daat6 tung1, zi6 gei2 jau5 waan4 bou2 doi2, m4 sai2 gaau1 doi2!',
            english: 'I will tap Octopus, have my own tote bag, no plastic bag needed!',
            politenessScore: 100,
            feedback: 'Smooth, green, and 100% authentic HK lifestyle response.',
            replyHanzi: '好，請放低八達通……「嘟」！搞掂！要唔要印單？',
            replyJyutping: 'hou2, cing2 fong3 dai1 baat3 daat6 tung1... "doot1"! gaau2 dim3! jiu3 m4 jiu3 jan3 daan1?',
            replyEnglish: 'Great, please tap Octopus... "Doot"! All set! Would you like a printed receipt?'
          },
          {
            id: 'spm_1_b',
            hanzi: '畀一百蚊現金，要個一蚊膠袋，唔該！',
            jyutping: 'bei2 jat1 baak3 man1 jin6 gam1, jiu3 go3 jat1 man1 gaau1 doi2, m4 goi1!',
            english: 'One hundred dollars cash, and one $1 plastic bag please!',
            politenessScore: 90,
            feedback: 'Clear and standard cash transaction.',
            replyHanzi: '收你一百，找返三十七蚊！多謝晒！',
            replyJyutping: 'sau1 nei5 jat1 baak3, zaau2 faan1 saam1 sap6 cat1 man1! do1 ze6 saai3!',
            replyEnglish: 'Received 100, change is 37 dollars! Thank you very much!'
          }
        ]
      },
      {
        stepIndex: 2,
        speaker: 'Cashier (收銀員)',
        hanzi: '要唔要印單同儲分？',
        jyutping: 'jiu3 m4 jiu3 jan3 daan1 tung4 cyu5 fan1?',
        english: 'Would you like a printed receipt and reward points?',
        choices: [
          {
            id: 'spm_2_a',
            hanzi: '唔使印單喇，多謝！',
            jyutping: 'm4 sai2 jan3 daan1 laa3, do1 ze6!',
            english: 'No receipt needed, thanks!',
            politenessScore: 100,
            feedback: 'Saves paper and wraps up the checkout quickly.',
            replyHanzi: '好嘅，多謝晒，拜拜！',
            replyJyutping: 'hou2 ge3, do1 ze6 saai3, baai1 baai3!',
            replyEnglish: 'Alright, thank you very much, bye bye!'
          }
        ]
      }
    ]
  },
  {
    id: 'transit',
    title: 'MTR & Red Minibus Transit Lab',
    titleChinese: '公共交通與紅Van',
    jyutping: 'gung1 gung6 gaau1 tung1 jyu5 hung4 vaan1',
    description: 'Shout to stop the speeding minibus with confidence.',
    icon: Bus,
    badge: 'Transit',
    soundscapeId: 'street-traffic',
    color: '#F5A623', // Amber
    culturalNote: 'Red minibuses (紅Van) do not have buzzers or fixed stops. You MUST yell your stop loudly to the driver before the intersection!',
    interactiveSteps: [
      {
        stepIndex: 1,
        speaker: 'You (Navigating MTR)',
        hanzi: '請問去朗豪坊應該喺邊個出口出呀？',
        jyutping: 'cing2 man6 heoi3 long5 hou4 fong1 jing1 goi1 hai2 bin1 go3 ceot1 hau2 ceot1 aa3?',
        english: 'Excuse me, which exit should I take for Langham Place?',
        choices: [
          {
            id: 'trn_1_a',
            hanzi: '請問去朗豪坊應該喺邊個出口出呀？唔該晒！',
            jyutping: 'cing2 man6 heoi3 long5 hou4 fong1 jing1 goi1 hai2 bin1 go3 ceot1 hau2 ceot1 aa3? m4 goi1 saai3!',
            english: 'Excuse me, which exit for Langham Place? Thank you very much!',
            politenessScore: 100,
            feedback: 'Polite station inquiry.',
            replyHanzi: '朗豪坊行C3出口啦，有地底商場扶手電梯直達！',
            replyJyutping: 'long5 hou4 fong1 haang4 C3 ceot1 hau2 laa1, jau5 dei6 dai2 soeng1 coeng4 fu4 sau2 din6 tai1 zik6 daat6!',
            replyEnglish: 'For Langham Place take Exit C3, the basement mall escalator goes right there!'
          }
        ]
      },
      {
        stepIndex: 2,
        speaker: 'Scenario (Speeding Minibus)',
        hanzi: '小巴飛馳緊彌敦道，前面街口就到你屋企喇！快啲嗌！',
        jyutping: 'siu2 baa1 fei1 ci4 gan2 nei4 deon1 dou6, cin4 min6 gaai1 hau2 zau6 dou3 nei5 uk1 kei2 laa3! faai3 di1 aai3!',
        english: 'The minibus is flying down Nathan Road, your street is coming up! Shout your stop!',
        choices: [
          {
            id: 'trn_2_a',
            hanzi: '司機！前面街口有落，唔該！',
            jyutping: 'si1 gei1! cin4 min6 gaai1 hau2 jau5 lok6, m4 goi1!',
            english: 'Driver! Drop-off at the front intersection, please!',
            politenessScore: 100,
            feedback: 'Classic Hong Kong commuter call. Clear, loud, and gives the driver distance to brake safely.',
            replyHanzi: '得！收到！後面架車跟得貼，坐穩啲！',
            replyJyutping: 'dak1! sau1 dou2! hau6 min6 gaa3 ce1 gan1 dak1 tip3, co5 wan2 di1!',
            replyEnglish: 'OK! Got it! The car behind is tailing, hold on tight!'
          },
          {
            id: 'trn_2_b',
            hanzi: '燈位有落！',
            jyutping: 'dang1 wai2 jau5 lok6!',
            english: 'Drop-off at the traffic light!',
            politenessScore: 90,
            feedback: 'Crisp Hong Kong street shorthand for stopping right at the traffic lights.',
            replyHanzi: '好，燈位停！',
            replyJyutping: 'hou2, dang1 wai2 ting4!',
            replyEnglish: 'Alright, stopping at the light!'
          },
          {
            id: 'trn_2_c',
            hanzi: '過咗天橋有落，唔該！',
            jyutping: 'gwo3 zo2 tin1 kiu4 jau5 lok6, m4 goi1!',
            english: 'Drop-off after the overpass, please!',
            politenessScore: 95,
            feedback: 'Precise landmark navigation.',
            replyHanzi: '過橋即停，準備定八達通！',
            replyJyutping: 'gwo3 kiu4 zik1 ting4, zeon2 bei6 ding6 baat3 daat6 tung1!',
            replyEnglish: 'Stopping after bridge, have your Octopus card ready!'
          }
        ]
      }
    ]
  }
];

export default function StreetLabsView({ onAddXp }) {
  const [selectedLab, setSelectedLab] = useState(DETAILED_STREET_LABS[0]);
  const [mode, setMode] = useState('roleplay'); // 'roleplay' | 'script'
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [dialogueHistory, setDialogueHistory] = useState([]);
  const [politenessTotal, setPolitenessTotal] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [ambientSoundActive, setAmbientSoundActive] = useState(false);
  const replyTimeoutRef = useRef(null);

  // Cleanup audio context and timers on unmount
  useEffect(() => {
    return () => {
      acousticSimulator.stopSoundscape();
      if (replyTimeoutRef.current) {
        clearTimeout(replyTimeoutRef.current);
      }
    };
  }, []);

  // Manage ambient soundscape when changing lab
  useEffect(() => {
    acousticSimulator.stopSoundscape();
    setAmbientSoundActive(false);
    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
    }
    resetSimulation();
  }, [selectedLab.id]);

  const toggleSoundscape = () => {
    if (ambientSoundActive) {
      acousticSimulator.stopSoundscape();
      setAmbientSoundActive(false);
    } else {
      if (selectedLab.soundscapeId && selectedLab.soundscapeId !== 'none') {
        acousticSimulator.startSoundscape(selectedLab.soundscapeId);
        setAmbientSoundActive(true);
      }
    }
  };

  const resetSimulation = () => {
    setCurrentStepIdx(0);
    setDialogueHistory([]);
    setPolitenessTotal(100);
    setIsFinished(false);
  };

  const playAudio = (text) => {
    speechEngine.speak(text);
  };

  const handleChoose = (choice, step) => {
    speechEngine.speak(choice.hanzi);

    // Record turn in history
    const userTurn = {
      speaker: 'You (Learner)',
      hanzi: choice.hanzi,
      jyutping: choice.jyutping,
      english: choice.english,
      feedback: choice.feedback,
      politenessScore: choice.politenessScore,
    };

    const counterTurn = {
      speaker: step.speaker,
      hanzi: choice.replyHanzi,
      jyutping: choice.replyJyutping,
      english: choice.replyEnglish,
    };

    const nextHistory = [...dialogueHistory, userTurn, counterTurn];
    setDialogueHistory(nextHistory);

    // Speak response after short delay, clearing any prior pending reply
    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
    }
    replyTimeoutRef.current = setTimeout(() => {
      speechEngine.speak(choice.replyHanzi);
    }, 1200);

    // Advance step or finish
    const nextIdx = currentStepIdx + 1;
    if (nextIdx < selectedLab.interactiveSteps.length) {
      setCurrentStepIdx(nextIdx);
    } else {
      setIsFinished(true);
      metroService.addXp(30);
      habitEngine.recordAction('sentence_assembled');
      if (onAddXp) onAddXp(30);
    }
  };

  const activeStep = selectedLab.interactiveSteps[currentStepIdx];

  return (
    <div className="space-y-5 pb-20 animate-fade-in">
      
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER BANNER
          ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-subway-surface to-subway-card border border-subway-border text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-cct-jade" />
            <h2 className="font-serif font-black text-xl sm:text-2xl tracking-wide">
              Street Situational Labs · 實戰場景
            </h2>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-cct-jade/20 text-emerald-300 border border-cct-jade/40 font-bold uppercase tracking-wider">
            Branching Simulation
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300">
          Survive genuine Hong Kong urban encounters: fast-talk diners, wet market bargaining, and high-speed minibus shouting.
        </p>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              hapticsService.selectionChanged();
              setMode('roleplay');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all active:scale-95 ${
              mode === 'roleplay'
                ? 'bg-cct-jade text-white shadow-glow-jade'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            🎮 Interactive Roleplay
          </button>
          <button
            type="button"
            onClick={() => {
              hapticsService.selectionChanged();
              setMode('script');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all active:scale-95 ${
              mode === 'script'
                ? 'bg-cct-jade text-white shadow-glow-jade'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            📖 Full Script Review
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SCENARIO SELECTOR CARDS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {DETAILED_STREET_LABS.map((lab) => {
          const Icon = lab.icon;
          const isSelected = selectedLab.id === lab.id;

          return (
            <button
              key={lab.id}
              type="button"
              onClick={() => {
                hapticsService.selectionChanged();
                setSelectedLab(lab);
              }}
              className={`p-4 rounded-3xl border text-left transition-all relative select-none active:scale-95 ${
                isSelected
                  ? 'bg-white dark:bg-subway-surface border-cct-jade shadow-glow-jade scale-[1.01]'
                  : 'bg-white/80 dark:bg-subway-card border-slate-200 dark:border-subway-border hover:border-slate-400'
              }`}
            >
              <div 
                className="w-9 h-9 rounded-2xl flex items-center justify-center text-white mb-2.5 shadow-sm"
                style={{ backgroundColor: lab.color }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="font-serif font-black text-base text-slate-900 dark:text-white leading-tight mb-0.5">
                {lab.titleChinese}
              </div>
              <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate mb-1">
                {lab.jyutping}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {lab.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ACTIVE SCENARIO BLUEPRINT & CULTURAL TIP
          ───────────────────────────────────────────────────────────── */}
      <div className="p-5 rounded-3xl bg-white dark:bg-subway-surface border border-slate-200 dark:border-subway-border shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-serif font-black text-lg text-slate-900 dark:text-white truncate">
              {selectedLab.title} · {selectedLab.titleChinese}
            </h3>
          </div>

          {/* Soundscape Quick Toggle */}
          {selectedLab.soundscapeId !== 'none' && (
            <button
              type="button"
              onClick={() => {
                hapticsService.tapLight();
                toggleSoundscape();
              }}
              className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 active:scale-95 ${
                ambientSoundActive
                  ? 'bg-cct-jade text-white border-cct-jade shadow-glow-jade ring-2 ring-cct-jade/40'
                  : 'bg-slate-100 dark:bg-subway-card border-slate-300 dark:border-subway-border text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {ambientSoundActive ? (
                <div className="flex items-end gap-0.5 h-3">
                  <span className="sound-bar h-2 bg-white animate-soundwave-1" />
                  <span className="sound-bar h-3 bg-white animate-soundwave-2" />
                  <span className="sound-bar h-2 bg-white animate-soundwave-3" />
                </div>
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
              <span>{ambientSoundActive ? 'Ambience ON' : 'Audio Ambience'}</span>
            </button>
          )}
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
          <span className="text-base shrink-0">💡</span>
          <div>
            <span className="font-bold">Street Survival Tip:</span> {selectedLab.culturalNote}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. INTERACTIVE ROLEPLAY BRANCHING RUNNER
          ───────────────────────────────────────────────────────────── */}
      {mode === 'roleplay' && (
        <div className="space-y-4">
          
          {/* Conversation History Stream */}
          <div className="space-y-3">
            {dialogueHistory.map((turn, i) => {
              const isLearner = turn.speaker.includes('Learner');

              return (
                <div
                  key={`hist_${i}`}
                  className={`p-4 rounded-3xl border transition-all animate-fade-in ${
                    isLearner
                      ? 'bg-cct-jade/10 dark:bg-cct-jade/20 border-cct-jade/30 ml-4 text-slate-900 dark:text-white shadow-xs'
                      : 'bg-white dark:bg-subway-card border-slate-200 dark:border-subway-border mr-4 text-slate-800 dark:text-slate-100 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                      {turn.speaker}
                    </span>
                    <button
                      type="button"
                      onClick={() => playAudio(turn.hanzi)}
                      className="p-1 rounded-lg text-slate-400 hover:text-mtr-red transition-colors"
                      title="Listen again"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="font-serif font-black text-xl mb-0.5">{turn.hanzi}</div>
                  <div className="font-mono text-xs text-mtr-teal dark:text-teal-400 font-semibold mb-1">
                    {turn.jyutping}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">{turn.english}</div>

                  {turn.feedback && (
                    <div className="mt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                      ✨ {turn.feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Turn Prompt & Choices */}
          {!isFinished && activeStep && (
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-subway-surface border-2 border-cct-jade/40 shadow-xl space-y-4 animate-slide-up">
              
              {/* Speaker Cue */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-subway-card border border-slate-200 dark:border-subway-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-mtr-red dark:text-red-400">
                    {activeStep.speaker} (Speaking to You)
                  </span>
                  <button
                    type="button"
                    onClick={() => playAudio(activeStep.hanzi)}
                    className="p-1 rounded-lg text-slate-500 hover:text-mtr-red"
                    title="Listen to speaker"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="font-serif font-black text-2xl text-slate-900 dark:text-white mb-0.5">
                  {activeStep.hanzi}
                </div>
                <div className="font-mono text-xs text-mtr-teal dark:text-teal-400 font-semibold mb-1">
                  {activeStep.jyutping}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {activeStep.english}
                </div>
              </div>

              {/* Your Choice Options */}
              <div className="space-y-2.5">
                <div className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 px-1">
                  Choose Your Response (How do you answer?)
                </div>

                {activeStep.choices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => {
                      hapticsService.tapMedium();
                      handleChoose(choice, activeStep);
                    }}
                    className="w-full p-4 rounded-2xl bg-white dark:bg-subway-card border-2 border-slate-200 dark:border-subway-border hover:border-cct-jade dark:hover:border-cct-jade shadow-sm hover:shadow-md transition-all text-left group active:scale-98"
                  >
                    <div className="font-serif font-black text-lg text-slate-900 dark:text-white group-hover:text-cct-jade transition-colors">
                      {choice.hanzi}
                    </div>
                    <div className="font-mono text-xs text-mtr-red dark:text-red-400 font-semibold mt-0.5">
                      {choice.jyutping}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {choice.english}
                    </div>
                  </button>
                ))}
              </div>

            </div>
          )}

          {/* Scenario Victory Box */}
          {isFinished && (
            <div className="p-6 rounded-3xl bg-gradient-to-b from-cct-jade/20 to-emerald-950/40 border-2 border-cct-jade text-center space-y-3 shadow-xl animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-cct-jade text-white flex items-center justify-center text-3xl shadow-glow-jade">
                🎉
              </div>
              <h3 className="font-serif font-black text-2xl text-slate-900 dark:text-white">
                Scenario Survived! · 通關成功
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                You navigated the {selectedLab.titleChinese} lunch rush with authentic local etiquette and earned +30 XP!
              </p>

              <button
                type="button"
                onClick={() => {
                  hapticsService.tapLight();
                  resetSimulation();
                }}
                className="mt-2 py-3 px-6 rounded-2xl bg-cct-jade hover:bg-cct-jade/90 text-white font-bold text-sm shadow-md inline-flex items-center gap-2 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Re-play Scenario</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. SCRIPT REVIEW MODE (FULL TRANSCRIPT)
          ───────────────────────────────────────────────────────────── */}
      {mode === 'script' && (
        <div className="p-5 rounded-3xl bg-white dark:bg-subway-surface border border-slate-200 dark:border-subway-border shadow-md space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
            Complete Dialogue Script (Tap any line to speak)
          </div>

          <div className="space-y-3">
            {selectedLab.interactiveSteps.map((step, idx) => (
              <div key={idx} className="space-y-2">
                {/* Step Prompt Line */}
                <div
                  onClick={() => playAudio(step.hanzi)}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-subway-card border border-slate-200 dark:border-subway-border cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                      {step.speaker}
                    </span>
                    <div className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                      {step.hanzi}
                    </div>
                    <div className="font-mono text-xs text-mtr-teal">{step.jyutping}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300">{step.english}</div>
                  </div>
                  <Volume2 className="w-4 h-4 text-slate-400" />
                </div>

                {/* Sample Best Response */}
                {step.choices[0] && (
                  <div
                    onClick={() => playAudio(step.choices[0].hanzi)}
                    className="p-3.5 rounded-2xl bg-cct-jade/10 border border-cct-jade/30 cursor-pointer flex items-center justify-between ml-4"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-cct-jade">
                        Recommended Local Response
                      </span>
                      <div className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                        {step.choices[0].hanzi}
                      </div>
                      <div className="font-mono text-xs text-cct-jade font-semibold">
                        {step.choices[0].jyutping}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        {step.choices[0].english}
                      </div>
                    </div>
                    <Volume2 className="w-4 h-4 text-cct-jade" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
