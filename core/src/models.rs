use serde::{Deserialize, Serialize};

#[derive(Debug, thiserror::Error, uniffi::Error)]
pub enum AppError {
    #[error("Dictionary parse error: {msg}")]
    ParseError { msg: String },
    #[error("Internal engine lock error: {msg}")]
    LockError { msg: String },
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct CantoneseEntry {
    pub chinese: String,
    pub jyutping: String,
    pub english: String,
    pub category: String,
    pub tones: Vec<u8>,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct DailySpark {
    pub word: CantoneseEntry,
    pub phrase: CantoneseEntry,
    pub day_index: u32,
    pub total_words: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct ToneChallenge {
    pub character: String,
    pub syllable: String,
    pub correct_tone: u8,
    pub meaning: String,
    pub options: Vec<u8>,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct UserProgress {
    pub current_streak: u32,
    pub xp: u32,
    pub words_learned: u32,
    pub last_active_day: u32,
    pub freeze_shields: u32,
    pub is_pro: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct SrsCard {
    pub item_id: String,
    pub interval_days: u32,
    pub repetitions: u32,
    pub ease_factor: f64,
    pub next_review_day: u32,
}
