// Utility để đọc tiếng Anh (text-to-speech) + tiếng Việt
export class SpeechManager {
  constructor() {
    this.speechEnabled = true;
    this.vietnameseEnabled = false; // Đọc nghĩa tiếng Việt
    this.voice = null;
    this.viVoice = null; // Cache voice tiếng Việt
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

  // Tìm voice tiếng Việt tốt nhất
  findVietnameseVoice() {
    if (!('speechSynthesis' in window)) return null;
    
    const allVoices = window.speechSynthesis.getVoices();
    
    // Ưu tiên 1: voice có lang chính xác là vi-VN
    let viVoice = allVoices.find(v => v.lang === 'vi-VN');
    if (viVoice) return viVoice;
    
    // Ưu tiên 2: voice có lang bắt đầu bằng vi
    viVoice = allVoices.find(v => v.lang.startsWith('vi'));
    if (viVoice) return viVoice;
    
    // Ưu tiên 3: voice có lang dạng vi_VN (một số browser dùng underscore)
    viVoice = allVoices.find(v => v.lang === 'vi_VN');
    if (viVoice) return viVoice;
    
    // Ưu tiên 4: voice có tên chứa "Vietnamese" hoặc "Viet"
    viVoice = allVoices.find(v => 
      v.name.toLowerCase().includes('vietnamese') || 
      v.name.toLowerCase().includes('viet')
    );
    if (viVoice) return viVoice;
    
    return null;
  }

  // Phân loại voice theo type (chỉ female hoặc male)
  getVoiceType(voice) {
    if (voice.gender === 'female') return 'female';
    if (voice.gender === 'male') return 'male';
    
    const name = voice.name.toLowerCase();
    
    const femalePatterns = [
      'female', 'woman', 'samantha', 'karen', 'susan', 'linda',
      'hazel', 'victoria', 'zira', 'helen', 'aria', 'eva',
      'ivy', 'jenny', 'michelle', 'serena', 'veena'
    ];
    if (femalePatterns.some(pattern => name.includes(pattern))) return 'female';
    
    const malePatterns = [
      'male', 'man', 'david', 'mark', 'richard', 'james',
      'george', 'paul', 'daniel', 'adam', 'alex', 'bruce',
      'fred', 'jorge', 'ravi', 'roger', 'tom', 'will'
    ];
    if (malePatterns.some(pattern => name.includes(pattern))) return 'male';
    
    return null;
  }

  // Lấy voices theo type (chỉ female hoặc male)
  getVoicesByType(type) {
    const voices = this.getAvailableVoices();
    return voices.filter(voice => {
      const voiceType = this.getVoiceType(voice);
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

  // Khởi tạo voice (tìm voice tiếng Anh + cache voice tiếng Việt)
  init(voiceName = null) {
    if ('speechSynthesis' in window) {
      const voices = this.getAvailableVoices();
      
      // Cache voice tiếng Việt ngay khi init
      this.viVoice = this.findVietnameseVoice();
      
      if (voiceName) {
        const selectedVoice = this.findVoiceByName(voiceName);
        if (selectedVoice) {
          this.voice = selectedVoice;
          this.selectedVoiceName = voiceName;
          return;
        }
      }
      
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

  // Đọc CHỈ tiếng Việt (dùng voice vi-VN riêng)
  speakVietnamese(vietnameseWord) {
    if (!this.speechEnabled || !('speechSynthesis' in window)) return;
    if (!vietnameseWord) return;

    const viUtterance = new SpeechSynthesisUtterance(vietnameseWord);
    
    // QUAN TRỌNG: Set voice TRƯỚC khi set lang
    // Nếu có voice tiếng Việt đã cache → dùng nó
    if (this.viVoice) {
      viUtterance.voice = this.viVoice;
      viUtterance.lang = this.viVoice.lang; // Dùng lang chính xác của voice đó
    } else {
      // Thử tìm lại voice tiếng Việt (browser có thể load muộn)
      const freshViVoice = this.findVietnameseVoice();
      if (freshViVoice) {
        this.viVoice = freshViVoice;
        viUtterance.voice = freshViVoice;
        viUtterance.lang = freshViVoice.lang;
      } else {
        // Không có voice Việt → set lang vi-VN để browser tự xử lý
        viUtterance.lang = 'vi-VN';
      }
    }
    
    viUtterance.rate = 0.85; // Chậm hơn cho rõ ràng
    viUtterance.pitch = 1.0;
    viUtterance.volume = this.volume;

    window.speechSynthesis.speak(viUtterance);
  }

  // Đọc tiếng Anh + nối tiếp tiếng Việt
  speakWithVietnamese(englishWord, vietnameseWord) {
    if (!this.speechEnabled || !('speechSynthesis' in window)) return;
    if (!vietnameseWord || !this.vietnameseEnabled) {
      this.speak(englishWord);
      return;
    }

    window.speechSynthesis.cancel();

    // Đọc tiếng Anh trước
    const enUtterance = new SpeechSynthesisUtterance(englishWord);
    if (this.voice) {
      enUtterance.voice = this.voice;
    }
    enUtterance.lang = 'en-US';
    enUtterance.rate = this.rate;
    enUtterance.pitch = this.pitch;
    enUtterance.volume = this.volume;

    // Khi đọc xong tiếng Anh → đọc tiếng Việt bằng voice Việt
    enUtterance.onend = () => {
      setTimeout(() => {
        this.speakVietnamese(vietnameseWord);
      }, 350); // Delay nhỏ giữa 2 ngôn ngữ cho tự nhiên
    };

    window.speechSynthesis.speak(enUtterance);
  }

  setVietnameseEnabled(enabled) {
    this.vietnameseEnabled = enabled;
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
    if (!enabled && 'speechSynthesis' in window) {
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
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechManager.init();
  
  // Một số browser cần load voices sau khi page load
  window.speechSynthesis.onvoiceschanged = () => {
    speechManager.init();
  };
}
