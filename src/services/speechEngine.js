/**
 * Authentic Cantonese Speech Engine
 * Strict No-Mandarin Policy:
 * 1. Bundled authentic Cantonese audio recordings (for Tone Studio and high-frequency phonemes)
 * 2. On-device Web Speech API strictly targeting authentic Cantonese voices (zh-HK / yue-HK / Sinji / Siri)
 * 3. Never falls back silently to Mandarin (zh-CN, zh-TW, cmn)
 * 4. Clear missing voice detection and surfacing
 * 5. Dev-only inspector log (text, language code, voice name, source)
 */

import { acousticSimulator } from './acousticSimulator';

// Pre-recorded authentic Cantonese recordings
const BUNDLED_TONE_AUDIO = {
  '詩': '/audio/tones/si1.mp3',
  'si1': '/audio/tones/si1.mp3',
  '史': '/audio/tones/si2.mp3',
  'si2': '/audio/tones/si2.mp3',
  '試': '/audio/tones/si3.mp3',
  'si3': '/audio/tones/si3.mp3',
  '時': '/audio/tones/si4.mp3',
  'si4': '/audio/tones/si4.mp3',
  '市': '/audio/tones/si5.mp3',
  'si5': '/audio/tones/si5.mp3',
  '事': '/audio/tones/si6.mp3',
  'si6': '/audio/tones/si6.mp3',
  '買': '/audio/tones/maai5.mp3',
  'maai5': '/audio/tones/maai5.mp3',
  '賣': '/audio/tones/maai6.mp3',
  'maai6': '/audio/tones/maai6.mp3',
  '湯': '/audio/tones/tong1.mp3',
  'tong1': '/audio/tones/tong1.mp3',
  '糖': '/audio/tones/tong4.mp3',
  'tong4': '/audio/tones/tong4.mp3',
};

const MAX_CACHE_ENTRIES = 100;

class SpeechEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.preferredVoice = null;
    this.isSpeaking = false;
    this.rate = 0.9;
    this.pitch = 1.0;
    this._initialized = false;
    this.audioCache = new Map();
    this.currentAudio = null;
    this.debugLogs = [];

    if (this.synth) {
      this.initVoices();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  logPlayback(entry) {
    const record = {
      ...entry,
      timestamp: new Date().toLocaleTimeString(),
      id: Math.random().toString(36).slice(2, 7),
    };
    this.debugLogs.unshift(record);
    if (this.debugLogs.length > 50) this.debugLogs.pop();

    if (typeof window !== 'undefined') {
      window.__jyutAudioLastPlayback = record;
      window.__jyutAudioLogs = this.debugLogs;
      window.dispatchEvent(new CustomEvent('jyut_audio_playback', { detail: record }));
      console.info(
        '%c[CantoneseAudio]',
        'color: #00A040; font-weight: bold;',
        `${record.source} -> "${record.text}" [${record.lang}] voice: ${record.voice || 'none'} (${record.status})`
      );
    }
  }

  getPlaybackLogs() {
    return [...this.debugLogs];
  }

  getLastPlayback() {
    return this.debugLogs[0] || null;
  }

  initVoices() {
    if (!this.synth) return;
    const available = this.synth.getVoices() || [];
    if (!available.length) return;

    this.voices = available;
    this.preferredVoice = this.pickBestCantoneseVoice(available);
    this._initialized = true;
  }

  /**
   * Strict Cantonese voice scoring:
   * Severe rejection (-500) for ALL Mandarin dialects (zh-CN, zh-TW, zh-SG, Putonghua, Guoyu, Taiwan).
   * Positive score only for authentic Cantonese (zh-HK, zh-MO, yue, Cantonese, 粵語).
   */
  scoreCantoneseVoice(voice) {
    if (!voice) return -999;
    const lang = (voice.lang || '').toLowerCase().replace(/_/g, '-');
    const name = (voice.name || '').toLowerCase();
    const signature = `${lang} ${name}`;
    let score = 0;

    // Severe penalties for Mandarin/Putonghua/Taiwanese voices
    if (
      /mandarin|putonghua|guoyu|普通话|普通話|國語|国语|taiwan|bopomofo/.test(signature) ||
      /^zh-cn$|^zh-tw$|^zh-sg$|^cmn\b/.test(lang)
    ) {
      return -500;
    }

    // Strict Cantonese positive matches
    if (/cantonese|yue|粵語|粤语/.test(signature)) score += 150;
    if (/^zh-hk$|^zh-mo$|^yue\b/.test(lang)) score += 120;
    if (/hong kong|hongkong/.test(name)) score += 80;

    // Quality bonuses for enhanced Cantonese voices (Apple Siri, Google Enhanced)
    if (/\benhanced\b|\bneural\b|\bpremium\b|\bnatural\b|\bstudio\b/.test(signature)) score += 30;
    if (voice.localService === false) score += 10;

    return score;
  }

  pickBestCantoneseVoice(voices) {
    let best = null;
    let maxScore = 0;

    for (const v of voices) {
      const score = this.scoreCantoneseVoice(v);
      if (score > maxScore) {
        maxScore = score;
        best = v;
      }
    }

    return best;
  }

  getAvailableVoices() {
    if (!this._initialized) this.initVoices();
    return this.voices.filter(v => this.scoreCantoneseVoice(v) > 0);
  }

  hasCantoneseVoice() {
    if (!this._initialized) this.initVoices();
    return Boolean(this.preferredVoice || this.getAvailableVoices().length > 0);
  }

  cleanUtteranceText(text) {
    if (!text) return '';
    const str = String(text).trim();
    // Strip parenthetical Jyutping or English like "你好 (nei5 hou2) · Hello"
    return str
      .replace(/\([^)]*\)/g, '')
      .replace(/·.*/, '')
      .trim();
  }

  /**
   * Main Speak Method
   */
  async speak(text, options = {}) {
    if (!text) return false;
    const cleanStr = this.cleanUtteranceText(text);
    if (!cleanStr) return false;

    // Stop currently active audio
    this.stop();

    const { onStart, onEnd, onError } = options;

    this.isSpeaking = true;
    acousticSimulator.duck(true);
    if (typeof window !== 'undefined' && window.__jyutHabitRecorder) {
      window.__jyutHabitRecorder('audio_listen');
    }
    if (onStart) onStart();

    const cleanup = () => {
      this.isSpeaking = false;
      this.currentAudio = null;
      acousticSimulator.duck(false);
      if (onEnd) onEnd();
    };

    // Strategy 1: Pre-recorded authentic Cantonese bundled audio (Tones / minimal pairs)
    if (BUNDLED_TONE_AUDIO[cleanStr]) {
      try {
        const audioUrl = BUNDLED_TONE_AUDIO[cleanStr];
        const audioOk = await this.playAudioFile(audioUrl, cleanStr, 'bundled');
        if (audioOk) {
          cleanup();
          return true;
        }
      } catch (err) {
        console.warn('[SpeechEngine] Bundled audio playback failed, falling back to device TTS', err);
      }
    }

    // Strategy 2: Verified Device SpeechSynthesis (Strict Cantonese voice only)
    try {
      const synthOk = await this.playSpeechSynthesis(cleanStr, options);
      if (synthOk) {
        cleanup();
        return true;
      }
    } catch (err) {
      console.warn('[SpeechEngine] SpeechSynthesis error:', err);
    }

    // No Mandarin Fallback: If no Cantonese voice was available, fail cleanly and alert UI
    cleanup();
    if (onError) onError(new Error('NO_CANTONESE_VOICE_AVAILABLE'));
    return false;
  }

  /**
   * Play bundled audio file
   */
  playAudioFile(url, text, source = 'bundled') {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || typeof Audio === 'undefined') {
        return reject(new Error('HTML5 Audio not available'));
      }

      const cacheKey = `bundled:sinji:${text}`;
      let audio = this.audioCache.get(cacheKey);

      if (!audio) {
        audio = new Audio(url);
        if (this.audioCache.size >= MAX_CACHE_ENTRIES) {
          const firstKey = this.audioCache.keys().next().value;
          this.audioCache.delete(firstKey);
        }
        this.audioCache.set(cacheKey, audio);
      } else {
        audio.currentTime = 0;
      }

      this.currentAudio = audio;

      const timer = setTimeout(() => {
        this.logPlayback({
          text,
          lang: 'yue-HK',
          voice: 'Sinji (bundled audio)',
          source,
          status: 'timeout',
        });
        reject(new Error('Audio playback timed out'));
      }, 4000);

      const onEnded = () => {
        clearTimeout(timer);
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
        this.logPlayback({
          text,
          lang: 'yue-HK',
          voice: 'Sinji (bundled audio)',
          source,
          status: 'success',
        });
        resolve(true);
      };

      const onError = (e) => {
        clearTimeout(timer);
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
        this.logPlayback({
          text,
          lang: 'yue-HK',
          voice: 'Sinji (bundled audio)',
          source,
          status: 'error',
          error: e?.message,
        });
        reject(e);
      };

      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', onError);

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          clearTimeout(timer);
          audio.removeEventListener('ended', onEnded);
          audio.removeEventListener('error', onError);
          this.logPlayback({
            text,
            lang: 'yue-HK',
            voice: 'Sinji (bundled audio)',
            source,
            status: 'play_rejected',
            error: err?.message,
          });
          reject(err);
        });
      }
    });
  }

  /**
   * Safe SpeechSynthesis strictly using authentic Cantonese voices
   */
  playSpeechSynthesis(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synth) return reject(new Error('SpeechSynthesis not available'));

      if (!this.preferredVoice) {
        this.initVoices();
      }

      const voice = this.preferredVoice;
      if (!voice || this.scoreCantoneseVoice(voice) <= 0) {
        // STRICT: Never fall back to unverified voice or Mandarin!
        this.logPlayback({
          text,
          lang: 'none',
          voice: 'none',
          source: 'device-speech-synthesis',
          status: 'missing_cantonese_voice',
        });

        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('jyut_missing_cantonese_voice', {
              detail: { text, reason: 'No verified Cantonese (zh-HK / yue) voice on device' },
            })
          );
        }
        return reject(new Error('NO_CANTONESE_VOICE_INSTALLED'));
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.lang = voice.lang || 'zh-HK';
      utterance.rate = Math.max(0.6, Math.min(1.4, options.rate || this.rate));
      utterance.pitch = Math.max(0.7, Math.min(1.3, options.pitch || this.pitch));

      const timer = setTimeout(() => {
        try { this.synth.cancel(); } catch (e) {}
        this.logPlayback({
          text,
          lang: utterance.lang,
          voice: voice.name,
          source: 'device-speech-synthesis',
          status: 'timeout',
        });
        reject(new Error('SpeechSynthesis timed out'));
      }, 4000);

      utterance.onend = () => {
        clearTimeout(timer);
        this.logPlayback({
          text,
          lang: utterance.lang,
          voice: voice.name,
          source: 'device-speech-synthesis',
          status: 'success',
        });
        resolve(true);
      };

      utterance.onerror = (err) => {
        clearTimeout(timer);
        this.logPlayback({
          text,
          lang: utterance.lang,
          voice: voice.name,
          source: 'device-speech-synthesis',
          status: 'error',
          error: err?.error || err?.message,
        });
        reject(err);
      };

      // 30ms tick avoids iOS Safari cancel race condition
      setTimeout(() => {
        try {
          this.synth.speak(utterance);
        } catch (e) {
          clearTimeout(timer);
          reject(e);
        }
      }, 30);
    });
  }

  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }
    if (this.synth && this.isSpeaking) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.isSpeaking = false;
    acousticSimulator.duck(false);
  }
}

export const speechEngine = new SpeechEngine();
