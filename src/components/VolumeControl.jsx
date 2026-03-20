import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Volume } from 'lucide-react';

export default function VolumeControl({ 
  volume, 
  musicVolume,
  onVolumeChange, 
  onMusicVolumeChange,
  soundEnabled,
  musicEnabled,
  onSoundToggle,
  onMusicToggle,
}) {
  const [showControls, setShowControls] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setShowControls(!showControls)}
        className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
        aria-label="Settings"
      >
        <Volume className="w-6 h-6 text-purple-600" />
      </button>

      {showControls && (
        <div className="absolute top-16 right-0 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl min-w-[280px]">
          <h3 className="text-lg font-bold text-purple-700 mb-4 text-center">
            🎵 Cài Đặt Âm Thanh
          </h3>

          {/* Sound Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-green-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm font-semibold text-gray-700">
                  Âm thanh gõ phím
                </span>
              </div>
              <button
                onClick={onSoundToggle}
                className={`w-12 h-6 rounded-full transition-colors ${
                  soundEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Volume Slider */}
          {soundEnabled && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🔊 Âm lượng: {Math.round(volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => onVolumeChange(parseInt(e.target.value) / 100)}
                className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          )}

          {/* Music Toggle */}
          <div className="mb-4 border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {musicEnabled ? (
                  <Music className="w-5 h-5 text-blue-600" />
                ) : (
                  <Music className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm font-semibold text-gray-700">
                  Nhạc nền
                </span>
              </div>
              <button
                onClick={onMusicToggle}
                className={`w-12 h-6 rounded-full transition-colors ${
                  musicEnabled ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    musicEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Music Volume Slider */}
          {musicEnabled && (
            <div className="mb-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎵 Âm lượng nhạc: {Math.round(musicVolume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume * 100}
                onChange={(e) => onMusicVolumeChange(parseInt(e.target.value) / 100)}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
