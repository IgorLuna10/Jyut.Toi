use std::sync::RwLock;
use crate::models::{AppError, CantoneseEntry, DailySpark, ToneChallenge, UserProgress, SrsCard};
use crate::tones::{extract_tones, generate_challenge};
use crate::srs;

#[derive(uniffi::Object)]
pub struct AppEngine {
    words: RwLock<Vec<CantoneseEntry>>,
    phrases: RwLock<Vec<CantoneseEntry>>,
}

#[uniffi::export]
impl AppEngine {
    #[uniffi::constructor]
    pub fn new() -> Self {
        let starter_words = vec![
            CantoneseEntry {
                chinese: "你好".to_string(),
                jyutping: "nei5 hou2".to_string(),
                english: "hello".to_string(),
                category: "greeting".to_string(),
                tones: vec![5, 2],
            },
            CantoneseEntry {
                chinese: "唔該".to_string(),
                jyutping: "m4 goi1".to_string(),
                english: "please / thank you (service)".to_string(),
                category: "politeness".to_string(),
                tones: vec![4, 1],
            },
            CantoneseEntry {
                chinese: "多謝".to_string(),
                jyutping: "do1 ze6".to_string(),
                english: "thank you (for gifts)".to_string(),
                category: "gratitude".to_string(),
                tones: vec![1, 6],
            },
            CantoneseEntry {
                chinese: "屋企".to_string(),
                jyutping: "uk1 kei2".to_string(),
                english: "home / family".to_string(),
                category: "places".to_string(),
                tones: vec![1, 2],
            },
            CantoneseEntry {
                chinese: "凍檸茶".to_string(),
                jyutping: "dung3 ning4 caa4".to_string(),
                english: "iced lemon tea".to_string(),
                category: "food".to_string(),
                tones: vec![3, 4, 4],
            },
        ];

        let starter_phrases = vec![
            CantoneseEntry {
                chinese: "你好嗎？".to_string(),
                jyutping: "nei5 hou2 maa3?".to_string(),
                english: "How are you?".to_string(),
                category: "greeting".to_string(),
                tones: vec![5, 2, 3],
            },
            CantoneseEntry {
                chinese: "唔該一杯凍檸茶。".to_string(),
                jyutping: "m4 goi1 jat1 bui1 dung3 ning4 caa4.".to_string(),
                english: "Please, one iced lemon tea.".to_string(),
                category: "food".to_string(),
                tones: vec![4, 1, 1, 1, 3, 4, 4],
            },
        ];

        Self {
            words: RwLock::new(starter_words),
            phrases: RwLock::new(starter_phrases),
        }
    }

    pub fn load_dictionary_json(&self, json_content: String) -> Result<u32, AppError> {
        #[derive(serde::Deserialize)]
        struct RawEntry {
            chinese: String,
            jyutping: String,
            english: String,
            category: Option<String>,
        }

        #[derive(serde::Deserialize)]
        struct RawDict {
            words: Option<Vec<RawEntry>>,
            phrases: Option<Vec<RawEntry>>,
        }

        let parsed: RawDict = serde_json::from_str(&json_content)
            .map_err(|e| AppError::ParseError { msg: e.to_string() })?;

        let mut words_lock = self.words.write()
            .map_err(|e| AppError::LockError { msg: e.to_string() })?;
        let mut phrases_lock = self.phrases.write()
            .map_err(|e| AppError::LockError { msg: e.to_string() })?;

        if let Some(raw_words) = parsed.words {
            words_lock.clear();
            for w in raw_words {
                let tones = extract_tones(&w.jyutping);
                words_lock.push(CantoneseEntry {
                    chinese: w.chinese,
                    jyutping: w.jyutping,
                    english: w.english,
                    category: w.category.unwrap_or_else(|| "general".to_string()),
                    tones,
                });
            }
        }

        if let Some(raw_phrases) = parsed.phrases {
            phrases_lock.clear();
            for p in raw_phrases {
                let tones = extract_tones(&p.jyutping);
                phrases_lock.push(CantoneseEntry {
                    chinese: p.chinese,
                    jyutping: p.jyutping,
                    english: p.english,
                    category: p.category.unwrap_or_else(|| "phrase".to_string()),
                    tones,
                });
            }
        }

        Ok((words_lock.len() + phrases_lock.len()) as u32)
    }

    pub fn get_daily_spark(&self, day_of_year: u32) -> DailySpark {
        let words = self.words.read().unwrap();
        let phrases = self.phrases.read().unwrap();

        let w_idx = (day_of_year as usize) % words.len();
        let p_idx = (day_of_year as usize) % phrases.len();

        DailySpark {
            word: words[w_idx].clone(),
            phrase: phrases[p_idx].clone(),
            day_index: day_of_year,
            total_words: words.len() as u32,
        }
    }

    pub fn search(&self, query: String) -> Vec<CantoneseEntry> {
        let q = query.trim().to_lowercase();
        if q.is_empty() {
            return Vec::new();
        }

        let words = self.words.read().unwrap();
        let phrases = self.phrases.read().unwrap();

        let mut results = Vec::new();

        for entry in words.iter().chain(phrases.iter()) {
            if entry.chinese.contains(&q)
                || entry.jyutping.to_lowercase().contains(&q)
                || entry.english.to_lowercase().contains(&q)
            {
                results.push(entry.clone());
                if results.len() >= 25 {
                    break;
                }
            }
        }

        results
    }

    pub fn get_tone_challenge(&self, seed: u32) -> ToneChallenge {
        generate_challenge(seed as usize)
    }

    pub fn update_streak(&self, mut progress: UserProgress, today: u32, success: bool) -> UserProgress {
        if success {
            if progress.last_active_day == 0 || progress.last_active_day + 1 == today {
                progress.current_streak += 1;
            } else if progress.last_active_day == today {
                // already marked today
            } else if progress.freeze_shields > 0 && progress.last_active_day + 2 == today {
                progress.freeze_shields -= 1;
                progress.current_streak += 1;
            } else {
                progress.current_streak = 1;
            }

            progress.last_active_day = today;
            progress.xp += 20;
            progress.words_learned += 1;
        }

        progress
    }

    pub fn review_srs_card(&self, card: SrsCard, quality: u8, current_day: u32) -> SrsCard {
        srs::review_card(&card, quality, current_day)
    }
}
