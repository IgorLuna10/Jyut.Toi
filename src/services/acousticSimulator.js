/**
 * Web Audio API Acoustic Simulator
 * Generates procedural Hong Kong urban soundscapes:
 * 1. Cha Chaan Teng (porcelain cup clatter, warm diner murmur)
 * 2. Wet Market (lively spatial chatter, water splash textures)
 * 3. Street Traffic (urban rumble, iconic "Ding Ding" double tram bell)
 *
 * Includes dynamic auto-ducking when speech playback is active.
 */

class AcousticSimulator {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.duckGain = null;
    this.activeType = 'none'; // 'none' | 'cha-chaan-teng' | 'wet-market' | 'street-traffic'
    this.volume = 0.25;
    this.isPlaying = false;
    this.nodes = [];
    this._tramTimer = null;

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.ctx && this.ctx.state === 'running') {
            this.ctx.suspend().catch(() => {});
          }
        } else {
          if (this.isPlaying && this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
          }
        }
      });
    }
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        
        // Master Volume
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

        // Ducking Gain Node (1.0 default -> 0.4 when speech is playing)
        this.duckGain = this.ctx.createGain();
        this.duckGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

        this.duckGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generate pink/brownian noise buffer for warm ambient texture
  createNoiseBuffer(type = 'pink') {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 3; // 3-second loop
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else {
        // Brown/Urban rumble
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    }
    return buffer;
  }

  startSoundscape(type) {
    this.stopSoundscape();
    if (!type || type === 'none') {
      this.activeType = 'none';
      return;
    }

    this.initContext();
    if (!this.ctx) return;

    this.activeType = type;
    this.isPlaying = true;

    if (type === 'cha-chaan-teng') {
      this._buildChaChaanTeng();
    } else if (type === 'wet-market') {
      this._buildWetMarket();
    } else if (type === 'street-traffic') {
      this._buildStreetTraffic();
    }
  }

  // Cha Chaan Teng: Warm conversational murmur + gentle ceramic clatter
  _buildChaChaanTeng() {
    const pinkNoise = this.createNoiseBuffer('pink');
    const source = this.ctx.createBufferSource();
    source.buffer = pinkNoise;
    source.loop = true;

    // Filter to human conversational vocal range (300Hz - 2200Hz)
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(850, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    source.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.duckGain);

    source.start();
    this.nodes.push(source, bandpass, gain);

    // Periodic porcelain clink interval (simulating tea cup / saucer clink)
    const clinkInterval = setInterval(() => {
      if (!this.isPlaying || this.activeType !== 'cha-chaan-teng') return;
      this._triggerPorcelainClink();
    }, 2800 + Math.random() * 2500);

    this._tramTimer = clinkInterval;
  }

  // Synthesize delicate high-frequency ceramic impact (2400Hz - 3800Hz)
  _triggerPorcelainClink() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const freq = 2600 + Math.random() * 800;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.duckGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Wet Market: High-energy spatial chatter and splashing textures
  _buildWetMarket() {
    const pinkNoise = this.createNoiseBuffer('pink');
    const source = this.ctx.createBufferSource();
    source.buffer = pinkNoise;
    source.loop = true;

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(450, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    source.connect(highpass);
    highpass.connect(gain);
    gain.connect(this.duckGain);

    source.start();
    this.nodes.push(source, highpass, gain);
  }

  // Street Traffic & Ding Ding Tram Bell
  _buildStreetTraffic() {
    const brownNoise = this.createNoiseBuffer('brown');
    const source = this.ctx.createBufferSource();
    source.buffer = brownNoise;
    source.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(280, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);

    source.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(this.duckGain);

    source.start();
    this.nodes.push(source, lowpass, gain);

    // Iconic Hong Kong Tram double bell ("Ding! Ding!") every 8 seconds
    const tramInterval = setInterval(() => {
      if (!this.isPlaying || this.activeType !== 'street-traffic') return;
      this.playTramBell();
    }, 7000 + Math.random() * 4000);

    this._tramTimer = tramInterval;
  }

  // Authentic Hong Kong "Ding Ding" (叮叮) Tram Bell
  playTramBell() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const strikes = [0, 0.22]; // Two crisp strikes

    strikes.forEach((offset) => {
      // Primary resonant frequency + overtone
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1040, now + offset); // ~C6

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2080, now + offset); // Harmonics

      bellGain.gain.setValueAtTime(0, now + offset);
      bellGain.gain.linearRampToValueAtTime(0.18, now + offset + 0.01);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.45);

      osc1.connect(bellGain);
      osc2.connect(bellGain);
      bellGain.connect(this.duckGain);

      osc1.start(now + offset);
      osc2.start(now + offset);
      osc1.stop(now + offset + 0.5);
      osc2.stop(now + offset + 0.5);
    });
  }

  // Smoothly duck ambient noise by 40% when Cantonese speech begins
  duck(isDucking) {
    if (!this.ctx || !this.duckGain) return;
    const targetGain = isDucking ? 0.35 : 1.0;
    const rampTime = isDucking ? 0.15 : 0.4;

    this.duckGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.duckGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + rampTime);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  stopSoundscape() {
    this.isPlaying = false;
    if (this._tramTimer) {
      clearInterval(this._tramTimer);
      this._tramTimer = null;
    }
    this.nodes.forEach(n => {
      try { n.stop?.(); n.disconnect?.(); } catch (_) {}
    });
    this.nodes = [];
  }
}

export const acousticSimulator = new AcousticSimulator();
