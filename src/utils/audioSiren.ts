class AudioSirenPlayer {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private isPlaying = false;

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public start() {
    try {
      if (this.isPlaying) return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master gain
      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0.08, this.ctx.currentTime); // Safe, gentle volume
      this.gain.connect(this.ctx.destination);

      // Main siren oscillator
      this.osc = this.ctx.createOscillator();
      this.osc.type = 'sawtooth';
      this.osc.frequency.setValueAtTime(650, this.ctx.currentTime);

      // LFO for wailing effect (0.4 Hz pitch sweep between 500Hz and 850Hz)
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.4, this.ctx.currentTime);

      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(200, this.ctx.currentTime);

      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.osc.frequency);

      this.osc.connect(this.gain);

      this.lfo.start();
      this.osc.start();
      this.isPlaying = true;
    } catch {
      // Audio context might be restricted before user gesture
      this.isPlaying = false;
    }
  }

  public stop() {
    try {
      if (this.osc) {
        this.osc.stop();
        this.osc.disconnect();
      }
      if (this.lfo) {
        this.lfo.stop();
        this.lfo.disconnect();
      }
      if (this.ctx && this.ctx.state !== 'closed') {
        this.ctx.close();
      }
    } catch {
      // Ignore
    } finally {
      this.osc = null;
      this.lfo = null;
      this.ctx = null;
      this.isPlaying = false;
    }
  }
}

export const sirenPlayer = new AudioSirenPlayer();
