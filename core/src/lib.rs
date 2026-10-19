uniffi::setup_scaffolding!();

pub mod models;
pub mod srs;
pub mod tones;
pub mod engine;

use std::sync::Arc;
pub use models::*;
pub use engine::AppEngine;

pub const APP_NAME: &str = "Jyut.Toi";
pub const APP_TITLE: &str = "Jyut.Toi: Learn Cantonese";
pub const DEVELOPER_NAME: &str = "Panela.Build";

#[uniffi::export]
pub fn create_app_engine() -> Arc<AppEngine> {
    Arc::new(AppEngine::new())
}

#[uniffi::export]
pub fn get_tone_title(tone: u8) -> String {
    tones::get_tone_name(tone).to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_engine_initialization() {
        let engine = AppEngine::new();
        let spark = engine.get_daily_spark(42);
        assert!(!spark.word.chinese.is_empty());
        assert!(!spark.phrase.chinese.is_empty());
    }

    #[test]
    fn test_tone_extraction() {
        let tones = tones::extract_tones("nei5 hou2");
        assert_eq!(tones, vec![5, 2]);
    }

    #[test]
    fn test_srs_calculation() {
        let engine = AppEngine::new();
        let card = srs::new_card("test_word".to_string(), 100);
        let reviewed = engine.review_srs_card(card, 5, 100);
        assert_eq!(reviewed.interval_days, 1);
        assert_eq!(reviewed.repetitions, 1);
    }
}
