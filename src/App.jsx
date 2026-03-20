"use client"

import { useState, useEffect } from "react"
import WordDisplay from "./components/WordDisplay"
import VirtualKeyboard from "./components/VirtualKeyboard"
import SettingsPanel from "./components/SettingsPanel"
import Footer from "./components/Footer"
import ZaloPopup from "./components/ZaloPopup"
import CategorySelector from "./components/CategorySelector"
import { getTheme } from "./utils/themes"
import { audioManager } from "./utils/audio"
import { speechManager } from "./utils/speech"
import { settingsManager } from "./utils/settings"
import { useKeyboard } from "./hooks/useKeyboard"

function App() {
  const [settings, setSettings] = useState(() => {
    const loaded = settingsManager.load()
    return {
      ...loaded,
      theme: loaded.theme || "default",
      timerEnabled: loaded.timerEnabled || false,
      darkMode: loaded.darkMode || false,
      eyeFriendly: loaded.eyeFriendly || false,
      syllableMode: loaded.syllableMode || 1,
      category: loaded.category || "all",
      wordMode: loaded.wordMode || false, // false = chữ cái, true = ghép từ
    }
  })
  const [currentTheme, setCurrentTheme] = useState(() => getTheme(settings.theme))

  // Custom hook quản lý toàn bộ logic bàn phím
  const {
    activeLetter,
    isShiftActive,
    handleKeyPress,
    resetBuffers,
    wordBuffer,
    matchedWord,
    wordHint,
    possibleWords,
  } = useKeyboard(settings)

  // Khởi tạo managers
  useEffect(() => {
    audioManager.init()
    audioManager.setSoundEnabled(settings.soundEnabled)
    audioManager.setVolume(settings.volume)

    speechManager.setSpeechEnabled(settings.speechEnabled)
    speechManager.setVolume(settings.volume)

    setTimeout(() => {
      speechManager.init(settings.voice || null)
    }, 100)

    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        speechManager.init(settings.voice || null)
      }
    }
  }, [])

  // Cập nhật settings
  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    settingsManager.save(updated)

    if (newSettings.soundEnabled !== undefined) {
      audioManager.setSoundEnabled(newSettings.soundEnabled)
    }
    if (newSettings.volume !== undefined) {
      audioManager.setVolume(newSettings.volume)
      speechManager.setVolume(newSettings.volume)
    }
    if (newSettings.speechEnabled !== undefined) {
      speechManager.setSpeechEnabled(newSettings.speechEnabled)
    }
    if (newSettings.voice !== undefined) {
      speechManager.setVoice(newSettings.voice)
    }
    if (newSettings.theme !== undefined) {
      setCurrentTheme(getTheme(newSettings.theme))
    }
    if (newSettings.syllableMode !== undefined || newSettings.wordMode !== undefined || newSettings.category !== undefined) {
      resetBuffers()
    }
  }

  // Handle mode change
  const handleModeChange = (modes) => {
    updateSettings({
      darkMode: modes.darkMode,
      eyeFriendly: modes.eyeFriendly,
    })
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentTheme.colors.background}`}
      style={{ minHeight: "100vh", position: "relative", paddingBottom: "60px" }}
    >
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 text-center z-10 w-full px-4 pointer-events-none">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 sm:h-10 md:h-12 w-auto object-contain pointer-events-auto"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${currentTheme.colors.text}`}>
            Vui học từ mới với bàn phím ảo ETA
          </h1>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-gray-600">Gõ phím để nghe và học chữ cái tiếng Anh!</p>
      </div>

      {/* Word Display */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-4xl px-4 pointer-events-none">
        <div className="h-[160px] sm:h-[200px] md:h-[240px] flex items-center justify-center relative">
          {(activeLetter || (settings.wordMode && wordBuffer)) ? (
            <WordDisplay
              letter={activeLetter}
              theme={currentTheme}
              wordMode={settings.wordMode}
              matchedWord={matchedWord}
              wordHint={wordHint}
              possibleWords={possibleWords}
              wordBuffer={wordBuffer}
            />
          ) : (
            <div className="text-center">
              <div
                className="text-6xl sm:text-7xl md:text-8xl font-bold mb-2 opacity-30"
                style={{
                  color: currentTheme.colors.text.includes("purple")
                    ? "#c084fc"
                    : currentTheme.colors.text.includes("cyan")
                      ? "#67e8f9"
                      : currentTheme.colors.text.includes("green")
                        ? "#86efac"
                        : currentTheme.colors.text.includes("orange")
                          ? "#fb923c"
                          : currentTheme.colors.text.includes("amber")
                            ? "#fcd34d"
                            : "#a855f7",
                }}
              >
                {settings.wordMode ? "DOG" : "ABC"}
              </div>
              <div className="text-sm sm:text-base md:text-lg text-gray-400">
                {settings.wordMode
                  ? "👆 Gõ từng chữ cái để ghép thành từ!"
                  : "👆 Gõ phím để bắt đầu!"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Virtual Keyboard */}
      <VirtualKeyboard
        activeLetter={activeLetter}
        isShiftActive={isShiftActive}
        currentTheme={currentTheme}
        onKeyPress={handleKeyPress}
      />

      <div className="fixed top-4 left-4 z-20">
        <CategorySelector
          currentCategory={settings.category}
          onCategoryChange={(category) => updateSettings({ category })}
        />
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        currentThemeId={settings.theme}
        settings={settings}
        onThemeChange={(themeId) => updateSettings({ theme: themeId })}
        onModeChange={handleModeChange}
        onVolumeChange={(volume) => updateSettings({ volume })}
        onSoundToggle={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
        onTimerToggle={() => updateSettings({ timerEnabled: !settings.timerEnabled })}
        onVoiceChange={(voice) => updateSettings({ voice })}
        updateSettings={updateSettings}
      />

      {/* Footer */}
      <Footer />

      {/* Zalo Popup */}
      <ZaloPopup />
    </div>
  )
}

export default App
