import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { themes } from '../utils/themes';

export default function ThemeSelector({ currentTheme, onThemeChange }) {
  const [showThemes, setShowThemes] = useState(false);

  return (
    <div className="fixed right-4 z-50" style={{ bottom: '80px' }}>
      <button
        onClick={() => setShowThemes(!showThemes)}
        className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
        aria-label="Chọn giao diện"
      >
        <Palette className="w-6 h-6 text-purple-600" />
      </button>

      <AnimatePresence>
        {showThemes && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl min-w-[280px] max-w-[320px]"
          >
            <h3 className="text-lg font-bold text-purple-700 mb-4 text-center">
              🎨 Chọn Giao Diện
            </h3>

            <div className="space-y-2">
              {Object.values(themes)
                .filter((theme) => !theme.id.includes('eyeFriendly')) // Ẩn các theme dịu mắt
                .map((theme) => (
                <motion.button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id);
                    setShowThemes(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    currentTheme === theme.id
                      ? 'bg-purple-100 border-2 border-purple-400'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">
                      {theme.name}
                    </span>
                    {currentTheme === theme.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-purple-600"
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Preview colors */}
                  <div className="flex gap-2 mt-2">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.keyStyle.even}`}
                    />
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.keyStyle.odd}`}
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
