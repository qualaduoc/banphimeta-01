// Utility để phát âm thanh gõ phím
export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.soundEnabled = true;
    this.volume = 1.0;
  }

  // Khởi tạo audio context (cần user interaction)
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Phát âm thanh gõ phím (tone đơn giản, vui nhộn)
  playKeySound() {
    if (!this.soundEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Tạo tone vui nhộn (frequency cao, ngắn)
      oscillator.frequency.value = 800 + Math.random() * 200; // 800-1000 Hz
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  }

  // Phát âm thanh success (khi gõ đúng)
  playSuccessSound() {
    if (!this.soundEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Tạo tone success (tăng dần)
      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.2);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, this.audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

export const audioManager = new AudioManager();
