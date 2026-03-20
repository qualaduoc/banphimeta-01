import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Settings } from 'lucide-react';
import { getTheme } from '../utils/themes';

export default function ModeSelector({ currentThemeId, onThemeChange, onModeChange }) {
  const [showModes, setShowModes] = useState(false);
  
  // Get current theme để xác định mode
  const currentTheme = getTheme(currentThemeId);
  const isDark = currentTheme?.mode === 'dark';
  const isEyeFriendly = currentThemeId?.includes('eyeFriendly');

  // Nếu đang ở theme eye-friendly, chuyển về default theme
  useEffect(() => {
    if (isEyeFriendly) {
      const defaultThemeId = isDark ? 'defaultDark' : 'default';
      onThemeChange(defaultThemeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDark;
    
    // Switch theme based on current theme and mode
    // Tìm base theme (loại bỏ Dark và eyeFriendly)
    let baseThemeId = currentThemeId?.replace('Dark', '').replace('eyeFriendly', '') || 'default';
    
    // Đảm bảo không chọn eye-friendly theme
    if (baseThemeId === 'eyeFriendly' || baseThemeId === '') {
      baseThemeId = 'default';
    }
    
    const newThemeId = newDarkMode ? `${baseThemeId}Dark` : baseThemeId;
    
    onThemeChange(newThemeId);
    onModeChange({ darkMode: newDarkMode, eyeFriendly: false });
  };


  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setShowModes(!showModes)}
        className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
        aria-label="Chế độ"
      >
        <Settings className="w-6 h-6 text-purple-600" />
      </button>

      <AnimatePresence>
        {showModes && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl min-w-[280px]"
          >
            <h3 className="text-lg font-bold text-purple-700 mb-4 text-center">
              ⚙️ Chế Độ Hiển Thị
            </h3>

            {/* Dark Mode Toggle */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isDark ? (
                    <Moon className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-600" />
                  )}
                  <span className="text-sm font-semibold text-gray-700">
                    {isDark ? 'Chế độ tối' : 'Chế độ sáng'}
                  </span>
                </div>
                <button
                  onClick={handleDarkModeToggle}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    isDark ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      isDark ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
