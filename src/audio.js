// Web Audio API Synthesizer for Space Drone, Hover Sounds, and Warp FX

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.masterGain = null;
    this.droneGain = null;
    this.isPlayingDrone = false;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  startDrone() {
    this.init();
    if (!this.ctx || this.isPlayingDrone || this.isMuted) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.001, t);
    this.droneGain.gain.exponentialRampToValueAtTime(0.12, t + 3);

    // Deep sub bass
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(55, t); // A1 note

    // Ambient shimmer synth
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sawtooth';
    this.droneOsc2.frequency.setValueAtTime(110.5, t);

    // Filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, t);

    // Filter modulation LFO
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 80;
    lfo.connect(filter.frequency);
    lfo.start();

    this.droneOsc1.connect(filter);
    this.droneOsc2.connect(filter);
    filter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    this.droneOsc1.start();
    this.droneOsc2.start();
    this.isPlayingDrone = true;
  }

  playScrollTick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.04);

    gain.gain.setValueAtTime(0.03, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  playWarpSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.exponentialRampToValueAtTime(1800, t + 0.8);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(3000, t + 0.8);
    filter.Q.value = 3;

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.9);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime);
    }
    return this.isMuted;
  }
}

export const sound = new SoundEngine();
