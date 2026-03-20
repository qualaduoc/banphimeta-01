// Utility để đọc tiếng Anh (text-to-speech)
export class SpeechManager {
  constructor() {
    this.speechEnabled = true;
    this.voice = null;
    this.selectedVoiceName = null; // Lưu tên voice đã chọn
    this.rate = 0.8; // Chậm hơn một chút cho trẻ em
    this.pitch = 1.2; // Cao hơn một chút, vui nhộn hơn
    this.volume = 1.0;
    this.voices = []; // Cache voices
  }

  // Lấy tất cả voices available
  getAvailableVoices() {
    if (!('speechSynthesis' in window)) return [];
    
    const voices = window.speechSynthesis.getVoices();
    this.voices = voices;
    
    // Filter chỉ lấy voices tiếng Anh
    return voices.filter(voice => voice.lang.startsWith('en'));
  }

  // Phân loại voice theo type (chỉ female hoặc male)
  getVoiceType(voice) {
    // Ưu tiên gender property nếu có
    if (voice.gender === 'female') {
      return 'female';
    }
    if (voice.gender === 'male') {
      return 'male';
    }
    
    // Fallback: check voice name patterns
    const name = voice.name.toLowerCase();
    
    // Giọng nữ - common female voice names
    const femalePatterns = [
      'female', 'woman', 'samantha', 'karen', 'susan', 'linda',
      'hazel', 'victoria', 'zira', 'helen', 'aria', 'eva',
      'ivy', 'jenny', 'michelle', 'serena', 'veena', 'zira'
    ];
    if (femalePatterns.some(pattern => name.includes(pattern))) {
      return 'female';
    }
    
    // Giọng nam - common male voice names
    const malePatterns = [
      'male', 'man', 'david', 'mark', 'richard', 'james',
      'george', 'paul', 'daniel', 'adam', 'alex', 'bruce',
      'fred', 'jorge', 'ravi', 'roger', 'tom', 'will'
    ];
    if (malePatterns.some(pattern => name.includes(pattern))) {
      return 'male';
    }
    
    // Không xác định được - return null để ẩn voice này
    return null;
  }

  // Lấy voices theo type (chỉ female hoặc male)
  getVoicesByType(type) {
    const voices = this.getAvailableVoices();
    
    // Chỉ lấy voices được phân loại là female hoặc male
    return voices.filter(voice => {
      const voiceType = this.getVoiceType(voice);
      // Chỉ return voices có type là female hoặc male
      return voiceType === type && (voiceType === 'female' || voiceType === 'male');
    });
  }

  // Lấy tất cả voices hợp lệ (chỉ female và male)
  getValidVoices() {
    const voices = this.getAvailableVoices();
    return voices.filter(voice => {
      const voiceType = this.getVoiceType(voice);
      return voiceType === 'female' || voiceType === 'male';
    });
  }

  // Tìm voice theo tên
  findVoiceByName(voiceName) {
    const voices = this.getAvailableVoices();
    return voices.find(voice => voice.name === voiceName) || null;
  }

  // Set voice cụ thể
  setVoice(voiceName) {
    const voice = this.findVoiceByName(voiceName);
    if (voice) {
      this.voice = voice;
      this.selectedVoiceName = voiceName;
    }
  }

  // Khởi tạo voice (tìm voice tiếng Anh phù hợp)
  init(voiceName = null) {
    if ('speechSynthesis' in window) {
      const voices = this.getAvailableVoices();
      
      if (voiceName) {
        // Sử dụng voice đã chọn
        const selectedVoice = this.findVoiceByName(voiceName);
        if (selectedVoice) {
          this.voice = selectedVoice;
          this.selectedVoiceName = voiceName;
          return;
        }
      }
      
      // Nếu không có voice name, tìm voice mặc định
      // Ưu tiên giọng nữ (thân thiện hơn), sau đó giọng nam
      const validVoices = this.getValidVoices();
      this.voice = validVoices.find(voice => 
        this.getVoiceType(voice) === 'female'
      ) || validVoices.find(voice => 
        this.getVoiceType(voice) === 'male'
      ) || validVoices[0] || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      
      if (this.voice) {
        this.selectedVoiceName = this.voice.name;
      }
    }
  }

  // Đọc từ tiếng Anh
  speak(word) {
    if (!this.speechEnabled || !('speechSynthesis' in window)) return;

    // Dừng speech hiện tại nếu có
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.lang = 'en-US';
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;

    window.speechSynthesis.speak(utterance);
  }

  // Preview voice (đọc thử)
  previewVoice(text = 'A') {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.lang = 'en-US';
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;
    
    window.speechSynthesis.speak(utterance);
  }

  setSpeechEnabled(enabled) {
    this.speechEnabled = enabled;
    if (!enabled) {
      window.speechSynthesis.cancel();
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Get current voice name
  getCurrentVoiceName() {
    return this.selectedVoiceName || (this.voice ? this.voice.name : null);
  }
}

export const speechManager = new SpeechManager();

// Khởi tạo voices khi load (có thể cần delay)
if ('speechSynthesis' in window) {
  speechManager.init();
  
  // Một số browser cần load voices sau khi page load
  window.speechSynthesis.onvoiceschanged = () => {
    speechManager.init();
  };
}
