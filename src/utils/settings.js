// Utility để quản lý settings (LocalStorage)
const SETTINGS_KEY = 'tapGoBanPhim_settings';

const defaultSettings = {
  soundEnabled: true,
  musicEnabled: true,
  speechEnabled: true,
  volume: 1.0, // Volume tổng (0-1)
  musicVolume: 0.2, // Volume nhạc nền mặc định thấp hơn (20%) - nhẹ nhàng cho trẻ em
  theme: 'default', // Theme mặc định
  timerEnabled: false, // Timer disabled by default
  darkMode: false,
  eyeFriendly: false,
};

export const settingsManager = {
  // Load settings từ LocalStorage
  load() {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
      console.warn('Error loading settings:', error);
    }
    return { ...defaultSettings };
  },

  // Save settings vào LocalStorage
  save(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Error saving settings:', error);
    }
  },

  // Get setting cụ thể
  get(key) {
    const settings = this.load();
    return settings[key];
  },

  // Set setting cụ thể
  set(key, value) {
    const settings = this.load();
    settings[key] = value;
    this.save(settings);
    return settings;
  },

  // Reset về mặc định
  reset() {
    this.save(defaultSettings);
    return { ...defaultSettings };
  },
};
