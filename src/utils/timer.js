// Utility để quản lý timer/reminder

export class TimerManager {
  constructor() {
    this.timer = null;
    this.duration = 20 * 60; // 20 phút mặc định (giây)
    this.remaining = 20 * 60;
    this.isRunning = false;
    this.isPaused = false;
    this.onTickCallbacks = []; // Array of callbacks
    this.onCompleteCallbacks = []; // Array of callbacks
  }

  // Set duration (minutes)
  setDuration(minutes) {
    this.duration = minutes * 60;
    this.remaining = this.duration;
  }

  // Start timer
  start(onTick, onComplete) {
    if (this.isRunning) return;

    // Add callbacks if provided
    if (onTick) {
      this.addTickCallback(onTick);
    }
    if (onComplete) {
      this.addCompleteCallback(onComplete);
    }

    this.isRunning = true;
    this.isPaused = false;
    this.remaining = this.duration;

    this.timer = setInterval(() => {
      if (this.remaining > 0) {
        this.remaining--;
        // Call all tick callbacks
        this.onTickCallbacks.forEach(callback => {
          if (callback) {
            callback(this.remaining, this.getFormattedTime(this.remaining));
          }
        });
      } else {
        this.stop();
        // Call all complete callbacks
        this.onCompleteCallbacks.forEach(callback => {
          if (callback) {
            callback();
          }
        });
      }
    }, 1000);
  }

  // Pause timer
  pause() {
    if (!this.isRunning || this.isPaused) return;
    this.isPaused = true;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // Resume timer
  resume() {
    if (!this.isRunning || !this.isPaused) return;
    this.isPaused = false;

    this.timer = setInterval(() => {
      if (this.remaining > 0) {
        this.remaining--;
        // Call all tick callbacks
        this.onTickCallbacks.forEach(callback => {
          if (callback) {
            callback(this.remaining, this.getFormattedTime(this.remaining));
          }
        });
      } else {
        this.stop();
        // Call all complete callbacks
        this.onCompleteCallbacks.forEach(callback => {
          if (callback) {
            callback();
          }
        });
      }
    }, 1000);
  }

  // Stop timer
  stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.remaining = this.duration;
  }

  // Reset timer
  reset() {
    this.stop();
    this.remaining = this.duration;
  }

  // Get formatted time (MM:SS)
  getFormattedTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Get current formatted time
  getCurrentFormattedTime() {
    return this.getFormattedTime(this.remaining);
  }

  // Get progress (0-1)
  getProgress() {
    if (this.duration === 0) return 0;
    return (this.duration - this.remaining) / this.duration;
  }

  // Add tick callback
  addTickCallback(callback) {
    if (callback && !this.onTickCallbacks.includes(callback)) {
      this.onTickCallbacks.push(callback);
    }
  }

  // Remove tick callback
  removeTickCallback(callback) {
    this.onTickCallbacks = this.onTickCallbacks.filter(cb => cb !== callback);
  }

  // Add complete callback
  addCompleteCallback(callback) {
    if (callback && !this.onCompleteCallbacks.includes(callback)) {
      this.onCompleteCallbacks.push(callback);
    }
  }

  // Remove complete callback
  removeCompleteCallback(callback) {
    this.onCompleteCallbacks = this.onCompleteCallbacks.filter(cb => cb !== callback);
  }

  // Clear all callbacks
  clearCallbacks() {
    this.onTickCallbacks = [];
    this.onCompleteCallbacks = [];
  }
}

export const timerManager = new TimerManager();
