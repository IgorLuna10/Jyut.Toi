# Jyut.Toi: Learn Cantonese

**Jyut.Toi** (粵台) is a metro-level Cantonese language learning application with a shared Rust core, native iOS/Android interfaces, and a web showcase.

## Features

- **Metro-Themed Progression**: Distinct station-wall mosaic styling per level.
- **Tone Discrimination Drills**: Interactive ear-training for the 6 Cantonese tones.
- **Sentence Assembly**: Magnetic word and particle tiles for authentic Cantonese grammar.
- **Spaced Repetition (SRS)**: On-device SM-2 memory retention engine.
- **Speech Synthesis**: Native Cantonese audio playback.
- **Honest Retention Tracking**: Genuine streak tracking without artificial score manipulation or forced losses.

## Architecture

- `core/`: Rust core library (dictionary, SM-2 SRS, tone engine, UniFFI scaffolding).
- `ios/`: Native SwiftUI application with StoreKit 2 and AVFoundation.
- `bindings/`: Generated Swift and Kotlin bindings.
- `src/`: Web showcase and interactive simulator (React 18, Vite, Tailwind CSS).
- `src/config/appConfig.js`: Single config constant controlling the application name.
