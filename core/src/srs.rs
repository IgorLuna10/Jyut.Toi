use crate::models::SrsCard;

/// SuperMemo-2 Spaced Repetition Scheduling Algorithm
/// Quality is 0-5 (where >= 3 is passing)
pub fn review_card(card: &SrsCard, quality: u8, current_day: u32) -> SrsCard {
    let q = quality.min(5);
    let mut repetitions = card.repetitions;
    let mut interval = card.interval_days;
    let mut ease = card.ease_factor;

    if q >= 3 {
        // Success
        if repetitions == 0 {
            interval = 1;
        } else if repetitions == 1 {
            interval = 6;
        } else {
            interval = ((interval as f64) * ease).round() as u32;
        }
        repetitions += 1;
    } else {
        // Failure, reset repetitions and interval
        repetitions = 0;
        interval = 1;
    }

    // Update Ease Factor (standard SM-2 formula)
    let q_diff = 5.0 - (q as f64);
    ease = ease + (0.1 - q_diff * (0.08 + q_diff * 0.02));
    if ease < 1.3 {
        ease = 1.3;
    }

    SrsCard {
        item_id: card.item_id.clone(),
        interval_days: interval,
        repetitions,
        ease_factor: ease,
        next_review_day: current_day + interval,
    }
}

pub fn new_card(item_id: String, current_day: u32) -> SrsCard {
    SrsCard {
        item_id,
        interval_days: 0,
        repetitions: 0,
        ease_factor: 2.5,
        next_review_day: current_day,
    }
}
