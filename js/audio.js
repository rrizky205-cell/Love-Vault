/**
 * LoveVault - Romantic Sound & Music Engine (Tahap 2)
 * Features:
 * - Ultra-cute Web Audio API "Pop/Boop" Keypad synthesizers (pure client-side oscillator, zero external files)
 * - Comical & cute "womp-womp" error tone for wrong PIN
 * - Soft mechanical typewriter clicks for the secret love letter
 * - Harmonious harp glissando fanfare for vault opening
 * - 3 procedural background music moods (Music Box, Acoustic Sweet, Lo-Fi Bucin) + Custom MP3 support
 */

class RomanticAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentMood = 'music_box';
    this.customAudio = null;
    this.customUrl = '';
    this.timerId = null;
    this.step = 0;
    this.volume = 0.6;
    this.isMuted = false;
    
    // Musical Chords & Melodies (Key of F / C Major - Super romantic & warm)
    this.musicBoxNotes = [
      523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
      587.33, 698.46, 880.00, 1174.66, // D5, F5, A5, D6
      659.25, 783.99, 987.77, 1318.51, // E5, G5, B5, E6
      523.25, 698.46, 880.00, 1046.50  // C5, F5, A5, C6
    ];

    this.acousticChords = [
      [261.63, 329.63, 392.00, 523.25], // C
      [220.00, 261.63, 329.63, 440.00], // Am
      [174.61, 220.00, 261.63, 349.23], // F
      [196.00, 246.94, 293.66, 392.00]  // G
    ];

    this.lofiChords = [
      [261.63, 311.13, 392.00, 466.16], // Cm7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ];

    // Cute Pentatonic Boop Frequencies for Keypad 0-9
    // C5, D5, E5, G5, A5, C6, D6, E6, G6, A6
    this.boopFrequencies = [
      523.25, // 0: C5
      587.33, // 1: D5
      659.25, // 2: E5
      783.99, // 3: G5
      880.00, // 4: A5
      1046.50,// 5: C6
      1174.66,// 6: D6
      1318.51,// 7: E6
      1567.98,// 8: G6
      1760.00 // 9: A6
    ];
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play Bubbly Button Pop
  playPop() {
    try {
      this.initAudio();
      if (this.isMuted) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      const now = this.audioCtx.currentTime;
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.07);

      gain.gain.setValueAtTime(this.volume * 0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn('Audio effect error:', e);
    }
  }

  /**
   * Tahap 2: Super Cute "Boop/Pop" Keypad Sound
   * Bubbly pitch-drop oscillator creating the signature juicy bubble/boop sound!
   */
  playKeypad(digit) {
    try {
      this.initAudio();
      if (this.isMuted) return;

      const num = parseInt(digit);
      const baseFreq = this.boopFrequencies[num % this.boopFrequencies.length] || 659.25;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      // Bubble drop effect: quick chirp then pitch settle
      osc.frequency.setValueAtTime(baseFreq * 1.25, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.035);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.88, now + 0.16);

      gain.gain.setValueAtTime(this.volume * 0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      console.warn('Keypad audio error:', e);
    }
  }

  /**
   * Tahap 2: Soft Typewriter Click
   * Creates a delicate mechanical key-strike sound for letter streaming
   */
  playTypewriterClick() {
    try {
      this.initAudio();
      if (this.isMuted) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);

      gain.gain.setValueAtTime(this.volume * 0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {
      // ignore
    }
  }

  playLockSound() {
    try {
      this.initAudio();
      if (this.isMuted) return;

      const now = this.audioCtx.currentTime;
      const freqs = [392.00, 523.25, 659.25, 783.99];
      freqs.forEach((f, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.07);

        gain.gain.setValueAtTime(this.volume * 0.2, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.4);
      });
    } catch (e) {
      console.warn('Lock sound error:', e);
    }
  }

  playUnlockCelebration() {
    try {
      this.initAudio();
      if (this.isMuted) return;

      const now = this.audioCtx.currentTime;
      // Majestic harp glissando
      const harpNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
      harpNotes.forEach((f, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.065);

        gain.gain.setValueAtTime(this.volume * 0.26, now + idx * 0.065);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.065 + 0.85);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.065);
        osc.stop(now + idx * 0.065 + 0.85);
      });
    } catch (e) {
      console.warn('Unlock sound error:', e);
    }
  }

  /**
   * Tahap 2: Comical Cute "Womp-Womp" Error Tone
   */
  playWrongPIN() {
    try {
      this.initAudio();
      if (this.isMuted) return;

      const now = this.audioCtx.currentTime;
      
      // Tone 1: 300Hz dropping to 240Hz
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.exponentialRampToValueAtTime(220, now + 0.18);
      gain1.gain.setValueAtTime(this.volume * 0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.2);

      // Tone 2: 240Hz dropping to 160Hz (sadder "womp")
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(250, now + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(160, now + 0.42);
      gain2.gain.setValueAtTime(this.volume * 0.28, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.45);

    } catch (e) {
      console.warn('Wrong PIN audio error:', e);
    }
  }

  // Background Music Controller
  startMusic(mood = 'music_box', customUrl = '') {
    this.initAudio();
    this.stopMusic();

    this.currentMood = mood;
    this.customUrl = customUrl;
    this.isPlaying = true;

    if (mood === 'custom' && customUrl && customUrl.trim() !== '') {
      this.playCustomAudio(customUrl.trim());
    } else {
      this.startSynthesizedMusic();
    }

    this.updateVisualizerUI(true);
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.currentTime = 0;
      this.customAudio = null;
    }
    this.updateVisualizerUI(false);
  }

  playCustomAudio(url) {
    try {
      if (this.customAudio) {
        this.customAudio.pause();
      }
      this.customAudio = new Audio(url);
      this.customAudio.loop = true;
      this.customAudio.volume = this.isMuted ? 0 : this.volume;
      this.customAudio.play().catch(err => {
        console.warn('Custom audio playback blocked, fallback to music box:', err);
        this.startSynthesizedMusic();
      });
    } catch (e) {
      console.warn('Error loading custom audio:', e);
      this.startSynthesizedMusic();
    }
  }

  startSynthesizedMusic() {
    if (this.timerId) clearInterval(this.timerId);
    this.step = 0;

    const interval = this.currentMood === 'lofi' ? 1400 : 750;

    const tick = () => {
      if (!this.isPlaying || this.isMuted) return;

      const now = this.audioCtx.currentTime;

      if (this.currentMood === 'music_box') {
        const noteIdx = this.step % this.musicBoxNotes.length;
        const freq = this.musicBoxNotes[noteIdx];
        
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(this.volume * 0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 1.2);

      } else if (this.currentMood === 'acoustic') {
        const chordIdx = Math.floor(this.step / 4) % this.acousticChords.length;
        const noteInChord = this.step % 4;
        const freq = this.acousticChords[chordIdx][noteInChord];

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(this.volume * 0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 1.4);

      } else if (this.currentMood === 'lofi') {
        const chordIdx = this.step % this.lofiChords.length;
        const chord = this.lofiChords[chordIdx];

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, now);

        chord.forEach(f => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f + (Math.random() - 0.5) * 1.5, now);

          gain.gain.setValueAtTime(this.volume * 0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 2.1);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 2.1);
        });
      }

      this.step++;
    };

    tick();
    this.timerId = setInterval(tick, interval);
  }

  togglePlayPause(mood, customUrl) {
    if (this.isPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic(mood, customUrl);
      return true;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.customAudio) {
      this.customAudio.muted = this.isMuted;
    }
    return this.isMuted;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
  }

  updateVisualizerUI(active) {
    const bars = document.querySelectorAll('.music-bar');
    bars.forEach(b => {
      b.style.animationPlayState = active ? 'running' : 'paused';
      b.style.opacity = active ? '1' : '0.4';
    });
  }
}

window.RomanticAudioEngine = RomanticAudioEngine;
