use crate::models::ToneChallenge;

pub fn extract_tones(jyutping: &str) -> Vec<u8> {
    jyutping
        .chars()
        .filter_map(|c| {
            if ('1'..='6').contains(&c) {
                c.to_digit(10).map(|d| d as u8)
            } else {
                None
            }
        })
        .collect()
}

pub fn get_tone_name(tone: u8) -> &'static str {
    match tone {
        1 => "High Flat (55)",
        2 => "High Rising (25)",
        3 => "Mid Flat (33)",
        4 => "Low Falling (21)",
        5 => "Low Rising (23)",
        6 => "Low Flat (22)",
        _ => "Unknown Tone",
    }
}

pub static SAMPLE_TONE_SETS: &[(u8, &str, &str, &str)] = &[
    (1, "詩", "si", "Poem"),
    (2, "史", "si", "History"),
    (3, "試", "si", "To Try"),
    (4, "時", "si", "Time"),
    (5, "市", "si", "City / Market"),
    (6, "事", "si", "Matter / Affair"),
    (1, "分", "fan", "Minute / Divide"),
    (2, "粉", "fan", "Noodle / Powder"),
    (3, "訓", "fan", "To Sleep"),
    (4, "墳", "fan", "Tomb / Grave"),
    (5, "奮", "fan", "Exert"),
    (6, "份", "fan", "Portion / Share"),
];

pub fn generate_challenge(seed: usize) -> ToneChallenge {
    let index = seed % SAMPLE_TONE_SETS.len();
    let (correct_tone, char_str, syllable, meaning) = SAMPLE_TONE_SETS[index];

    ToneChallenge {
        character: char_str.to_string(),
        syllable: syllable.to_string(),
        correct_tone,
        meaning: meaning.to_string(),
        options: vec![1, 2, 3, 4, 5, 6],
    }
}
