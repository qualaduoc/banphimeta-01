// Utility để quản lý nhạc nền
export class MusicManager {
  constructor() {
    this.audio = null;
    this.playlist = [];
    this.currentIndex = -1;
    this.musicEnabled = false;
    this.volume = 0.2; // Volume mặc định cho nhạc nền (20%) - nhẹ nhàng cho trẻ em
    this.isPlaying = false;
    this.isLoading = false;
  }

  // Khởi tạo với playlist
  init(playlist) {
    this.playlist = playlist;
    if (playlist.length > 0) {
      this.loadRandomMusic();
    }
  }

  // Load bài nhạc ngẫu nhiên
  loadRandomMusic() {
    if (this.playlist.length === 0) return;

    // Chọn bài ngẫu nhiên
    const randomIndex = Math.floor(Math.random() * this.playlist.length);
    this.currentIndex = randomIndex;
    this.loadMusic(this.playlist[randomIndex]);
  }

  // Load bài nhạc cụ thể
  loadMusic(music) {
    if (!music || !music.url) return;

    // Dừng và giải phóng audio cũ
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }

    this.isLoading = true;

    // Tạo audio element mới
    this.audio = new Audio(music.url);
    this.audio.volume = this.volume;
    this.audio.loop = false; // Không loop, sẽ chuyển bài khi kết thúc

    // Event listeners
    this.audio.addEventListener('loadeddata', () => {
      this.isLoading = false;
      // Đảm bảo volume được set đúng sau khi load
      this.audio.volume = this.volume;
      if (this.musicEnabled) {
        this.play();
      }
    });

    this.audio.addEventListener('ended', () => {
      // Tự động chuyển sang bài tiếp theo
      this.next();
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Music loading error:', e);
      this.isLoading = false;
      // Thử load bài tiếp theo nếu có lỗi
      if (this.playlist.length > 1) {
        this.next();
      }
    });

    // Load audio
    this.audio.load();
  }

  // Phát nhạc
  play() {
    if (!this.audio || this.isLoading) return;

    // Đảm bảo volume được set trước khi phát
    this.audio.volume = this.volume;
    
    this.musicEnabled = true;
    this.isPlaying = true;

    this.audio.play().catch(error => {
      console.warn('Music play error:', error);
      // Một số browser yêu cầu user interaction trước khi phát audio
      this.isPlaying = false;
    });
  }

  // Tạm dừng nhạc
  pause() {
    if (!this.audio) return;

    this.isPlaying = false;
    this.audio.pause();
  }

  // Dừng nhạc
  stop() {
    if (!this.audio) return;

    this.musicEnabled = false;
    this.isPlaying = false;
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  // Chuyển sang bài tiếp theo
  next() {
    if (this.playlist.length === 0) return;

    // Chọn bài ngẫu nhiên (có thể không phải bài tiếp theo)
    this.loadRandomMusic();
  }

  // Toggle play/pause
  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  // Set volume
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    // Cập nhật volume ngay lập tức nếu audio đã được tạo
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  // Set music enabled
  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (enabled) {
      if (!this.audio || this.audio.ended) {
        this.loadRandomMusic();
      } else {
        this.play();
      }
    } else {
      this.pause();
    }
  }

  // Get current music info
  getCurrentMusic() {
    if (this.currentIndex >= 0 && this.currentIndex < this.playlist.length) {
      return this.playlist[this.currentIndex];
    }
    return null;
  }
}

export const musicManager = new MusicManager();
