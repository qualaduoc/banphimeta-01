"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, Sun, Moon, Palette, Volume2, VolumeX, Clock, Play, Pause, Square, Check, Mic, BookOpen } from "lucide-react"
import { themes, getTheme } from "../utils/themes"
import { timerManager } from "../utils/timer"
import { speechManager } from "../utils/speech"

export default function SettingsPanel({
  currentThemeId,
  settings,
  onThemeChange,
  onModeChange,
  onVolumeChange,
  onSoundToggle,
  onTimerToggle,
  onVoiceChange,
  updateSettings,
}) {
  const [showPanel, setShowPanel] = useState(false)
  const [activeTab, setActiveTab] = useState("mode") // mode, theme, sound, timer, syllable
  const [availableVoices, setAvailableVoices] = useState([])
  const [voiceFilter, setVoiceFilter] = useState("female") // female, male
  const panelRef = useRef(null)
  const buttonRef = useRef(null)

  // Timer states
  const [isVisible, setIsVisible] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState("20:00")
  const [isRunning, setIsRunning] = useState(false)
  const [duration, setDuration] = useState(20)
  const [showNotification, setShowNotification] = useState(false)

  // Get current theme để xác định mode
  const currentTheme = getTheme(currentThemeId)
  const isDark = currentTheme?.mode === "dark"

  // Setup timer callbacks (phải define trước useEffect)
  const handleTick = (remaining, formatted) => {
    setTimeRemaining(formatted)
  }

  const handleComplete = () => {
    setIsRunning(false)
    setShowNotification(true)
    playNotificationSound()
    showBrowserNotification()
  }

  // Timer effects
  useEffect(() => {
    if (!settings.timerEnabled) {
      timerManager.stop()
      setIsRunning(false)
      setTimeRemaining(timerManager.getCurrentFormattedTime())
      // Remove callbacks khi disabled
      timerManager.removeTickCallback(handleTick)
      timerManager.removeCompleteCallback(handleComplete)
      return
    }

    timerManager.setDuration(duration)
    setTimeRemaining(timerManager.getCurrentFormattedTime())

    // Register callbacks
    timerManager.addTickCallback(handleTick)
    timerManager.addCompleteCallback(handleComplete)

    // Sync state từ timerManager
    setIsRunning(timerManager.isRunning && !timerManager.isPaused)

    return () => {
      // Cleanup callbacks khi component unmount hoặc settings change
      timerManager.removeTickCallback(handleTick)
      timerManager.removeCompleteCallback(handleComplete)
    }
  }, [settings.timerEnabled, duration])

  // Sync state từ timerManager mỗi giây để đảm bảo đồng bộ
  useEffect(() => {
    if (!settings.timerEnabled) return

    const syncInterval = setInterval(() => {
      // Sync timeRemaining
      const currentTime = timerManager.getCurrentFormattedTime()
      if (currentTime !== timeRemaining) {
        setTimeRemaining(currentTime)
      }

      // Sync isRunning
      const shouldBeRunning = timerManager.isRunning && !timerManager.isPaused
      if (shouldBeRunning !== isRunning) {
        setIsRunning(shouldBeRunning)
      }
    }, 1000) // Sync mỗi giây

    return () => clearInterval(syncInterval)
  }, [settings.timerEnabled, isRunning, timeRemaining])

  const handleStart = () => {
    timerManager.setDuration(duration)
    // Ensure callbacks are registered
    timerManager.addTickCallback(handleTick)
    timerManager.addCompleteCallback(handleComplete)
    timerManager.start(handleTick, handleComplete)
    setIsRunning(true)
    setTimeRemaining(timerManager.getCurrentFormattedTime())
  }

  const handlePause = () => {
    timerManager.pause()
    setIsRunning(false)
  }

  const handleResume = () => {
    timerManager.resume()
    setIsRunning(true)
  }

  const handleStop = () => {
    timerManager.stop()
    setIsRunning(false)
    setTimeRemaining(timerManager.getCurrentFormattedTime())
  }

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration)
    if (isRunning) {
      handleStop()
      timerManager.setDuration(newDuration)
      handleStart()
    } else {
      timerManager.setDuration(newDuration)
      setTimeRemaining(timerManager.getCurrentFormattedTime())
    }
  }

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 1)
    } catch (error) {
      console.warn("Notification sound error:", error)
    }
  }

  const showBrowserNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("⏰ Đã đến lúc nghỉ ngơi!", {
        body: "Bé đã học được một lúc rồi! Hãy nghỉ ngơi một chút nhé! 👏",
        icon: "/vite.svg",
        tag: "study-reminder",
      })
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("⏰ Đã đến lúc nghỉ ngơi!", {
            body: "Bé đã học được một lúc rồi! Hãy nghỉ ngơi một chút nhé! 👏",
            icon: "/vite.svg",
            tag: "study-reminder",
          })
        }
      })
    }
  }

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  // Click outside to close panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showPanel &&
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPanel(false)
      }
    }

    if (showPanel) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [showPanel])

  // Load available voices (chỉ female và male)
  useEffect(() => {
    const loadVoices = () => {
      // Chỉ lấy voices hợp lệ (female và male)
      const validVoices = speechManager.getValidVoices()
      setAvailableVoices(validVoices)
    }

    // Load voices ngay lập tức
    loadVoices()

    // Load voices khi có sự thay đổi (một số browser cần delay)
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  // Get filtered voices (chỉ female hoặc male)
  const getFilteredVoices = () => {
    return speechManager.getVoicesByType(voiceFilter)
  }

  // Get voice type label
  const getVoiceTypeLabel = (type) => {
    const labels = {
      female: "Giọng nữ",
      male: "Giọng nam",
    }
    return labels[type] || type
  }

  // Handle voice change
  const handleVoiceChange = (voiceName) => {
    speechManager.setVoice(voiceName)
    if (onVoiceChange) {
      onVoiceChange(voiceName)
    }
  }

  // Preview voice
  const handlePreviewVoice = (voiceName) => {
    if (!("speechSynthesis" in window)) return

    const oldVoiceName = speechManager.getCurrentVoiceName()
    const previewVoice = speechManager.findVoiceByName(voiceName)

    if (!previewVoice) return

    // Tạm thời set voice để preview
    const tempUtterance = new SpeechSynthesisUtterance("A")
    tempUtterance.voice = previewVoice
    tempUtterance.lang = "en-US"
    tempUtterance.rate = 0.8
    tempUtterance.pitch = 1.2
    tempUtterance.volume = 1.0

    // Khôi phục voice cũ sau khi preview xong
    tempUtterance.onend = () => {
      if (oldVoiceName) {
        speechManager.setVoice(oldVoiceName)
      }
    }

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(tempUtterance)
  }

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDark

    let baseThemeId = currentThemeId?.replace("Dark", "").replace("eyeFriendly", "") || "default"

    if (baseThemeId === "eyeFriendly" || baseThemeId === "") {
      baseThemeId = "default"
    }

    const newThemeId = newDarkMode ? `${baseThemeId}Dark` : baseThemeId

    onThemeChange(newThemeId)
    onModeChange({ darkMode: newDarkMode, eyeFriendly: false })
  }

  // Tabs configuration
  const tabs = [
    { id: "mode", label: "Chế độ", icon: isDark ? Moon : Sun },
    { id: "syllable", label: "Học", icon: BookOpen },
    { id: "theme", label: "Giao diện", icon: Palette },
    { id: "sound", label: "Âm thanh", icon: Volume2 },
    { id: "timer", label: "Hẹn giờ", icon: Clock },
  ]

  return (
    <>
      {/* Settings Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          ref={buttonRef}
          onClick={() => setShowPanel(!showPanel)}
          className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
          aria-label="Cài đặt"
        >
          <Settings className="w-6 h-6 text-purple-600" />
        </button>

        {/* Settings Panel */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl min-w-[320px] max-w-[400px] max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-purple-700 text-center">⚙️ Cài Đặt</h2>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm font-semibold transition-colors ${
                        activeTab === tab.id
                          ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Mode Tab */}
                {activeTab === "mode" && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {isDark ? (
                            <Moon className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Sun className="w-5 h-5 text-yellow-600" />
                          )}
                          <span className="text-sm font-semibold text-gray-700">
                            {isDark ? "Chế độ tối" : "Chế độ sáng"}
                          </span>
                        </div>
                        <button
                          onClick={handleDarkModeToggle}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            isDark ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                              isDark ? "translate-x-6" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Learning Mode Tab */}
                {activeTab === "syllable" && (
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Chọn chế độ học:</label>
                    <div className="space-y-2">
                      {/* Chế độ Chữ cái */}
                      <button
                        onClick={() => updateSettings({ wordMode: false })}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          !settings.wordMode
                            ? "bg-purple-100 border-2 border-purple-400 shadow-md"
                            : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">🔤</span>
                            <div>
                              <div className="font-bold text-gray-800">Chữ cái riêng lẻ</div>
                              <div className="text-xs text-gray-500 mt-0.5">Gõ A → nghe "A", gõ B → nghe "B"</div>
                            </div>
                          </div>
                          {!settings.wordMode && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-purple-600">
                              <Check className="w-5 h-5" />
                            </motion.div>
                          )}
                        </div>
                      </button>

                      {/* Chế độ Ghép từ */}
                      <button
                        onClick={() => updateSettings({ wordMode: true })}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          settings.wordMode
                            ? "bg-green-100 border-2 border-green-400 shadow-md"
                            : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">📝</span>
                            <div>
                              <div className="font-bold text-gray-800">Ghép từ tiếng Anh</div>
                              <div className="text-xs text-gray-500 mt-0.5">Gõ D → O → G = "Dog" 🐶</div>
                            </div>
                          </div>
                          {settings.wordMode && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-600">
                              <Check className="w-5 h-5" />
                            </motion.div>
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Hướng dẫn */}
                    <div className={`mt-4 p-3 rounded-lg ${settings.wordMode ? 'bg-green-50' : 'bg-blue-50'}`}>
                      {settings.wordMode ? (
                        <div className="text-xs text-green-700">
                          <p className="font-bold mb-1">📝 Chế độ Ghép từ:</p>
                          <ul className="list-disc pl-4 space-y-0.5">
                            <li>Gõ từng chữ cái để ghép thành từ tiếng Anh</li>
                            <li>Ví dụ: <strong>D → O → G</strong> = "Dog" 🐶</li>
                            <li>Có gợi ý từ khi đang gõ</li>
                            <li>Nhấn <strong>Space</strong> hoặc chờ 3 giây để bắt đầu từ mới</li>
                            <li>Nhấn <strong>Backspace</strong> để xóa chữ cái cuối</li>
                          </ul>
                        </div>
                      ) : (
                        <p className="text-xs text-blue-700">
                          💡 <strong>Chế độ Chữ cái:</strong> Gõ mỗi phím sẽ đọc tên chữ cái đó bằng tiếng Anh
                          và hiển thị emoji minh họa.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Theme Tab */}
                {activeTab === "theme" && (
                  <div className="space-y-2">
                    {Object.values(themes)
                      .filter((theme) => !theme.id.includes("eyeFriendly"))
                      .map((theme) => (
                        <motion.button
                          key={theme.id}
                          onClick={() => {
                            onThemeChange(theme.id)
                          }}
                          className={`w-full text-left p-3 rounded-xl transition-all ${
                            currentThemeId === theme.id
                              ? "bg-purple-100 border-2 border-purple-400"
                              : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-700">{theme.name}</span>
                            {currentThemeId === theme.id && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-purple-600">
                                <Check className="w-5 h-5" />
                              </motion.div>
                            )}
                          </div>

                          {/* Preview colors */}
                          <div className="flex gap-2 mt-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.keyStyle.even}`} />
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.keyStyle.odd}`} />
                          </div>
                        </motion.button>
                      ))}
                  </div>
                )}

                {/* Sound Tab */}
                {activeTab === "sound" && (
                  <div className="space-y-4">
                    {/* Sound Toggle */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {settings.soundEnabled ? (
                            <Volume2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <VolumeX className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="text-sm font-semibold text-gray-700">Âm thanh gõ phím</span>
                        </div>
                        <button
                          onClick={onSoundToggle}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.soundEnabled ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                              settings.soundEnabled ? "translate-x-6" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Volume Slider */}
                    {settings.soundEnabled && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          🔊 Âm lượng: {Math.round(settings.volume * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.volume * 100}
                          onChange={(e) => onVolumeChange(Number.parseInt(e.target.value) / 100)}
                          className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                      </div>
                    )}

                    {/* Vietnamese Toggle */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🇻🇳</span>
                          <div>
                            <span className="text-sm font-semibold text-gray-700">Đọc nghĩa tiếng Việt</span>
                            <div className="text-xs text-gray-400">Đọc nối tiếp nghĩa TV sau tiếng Anh</div>
                          </div>
                        </div>
                        <button
                          onClick={() => updateSettings({ vietnameseEnabled: !settings.vietnameseEnabled })}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.vietnameseEnabled ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                              settings.vietnameseEnabled ? "translate-x-6" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                      {settings.vietnameseEnabled && (
                        <div className="p-2 bg-green-50 rounded-lg">
                          <p className="text-xs text-green-700">
                            🔊 Ví dụ: Gõ "D" → đọc <strong>"D"</strong> rồi đọc <strong>"Con chó"</strong>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Voice Selector */}
                    <div className="border-t pt-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">🎤 Giọng đọc</label>

                      {/* Voice Filter - Chỉ Female và Male */}
                      <div className="mb-3">
                        <div className="flex gap-2">
                          {["female", "male"].map((type) => (
                            <button
                              key={type}
                              onClick={() => setVoiceFilter(type)}
                              className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                voiceFilter === type
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {getVoiceTypeLabel(type)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Voice List */}
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {getFilteredVoices().map((voice) => {
                          const isSelected = settings.voice === voice.name

                          return (
                            <div
                              key={voice.name}
                              className={`flex items-center justify-between p-2 rounded-lg border-2 transition-colors ${
                                isSelected
                                  ? "bg-purple-50 border-purple-400"
                                  : "bg-gray-50 border-transparent hover:bg-gray-100"
                              }`}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Mic className="w-4 h-4 text-purple-600" />
                                  <span className="text-sm font-semibold text-gray-700">{voice.name}</span>
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">{voice.lang}</div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handlePreviewVoice(voice.name)}
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                  title="Nghe thử"
                                >
                                  ▶️
                                </button>
                                <button
                                  onClick={() => handleVoiceChange(voice.name)}
                                  className={`px-2 py-1 text-xs rounded transition-colors ${
                                    isSelected
                                      ? "bg-purple-600 text-white"
                                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  }`}
                                >
                                  {isSelected ? "✓" : "Chọn"}
                                </button>
                              </div>
                            </div>
                          )
                        })}

                        {getFilteredVoices().length === 0 && (
                          <div className="text-center text-sm text-gray-500 py-4">
                            Không tìm thấy giọng {voiceFilter === "female" ? "nữ" : "nam"} nào
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Timer Tab */}
                {activeTab === "timer" && (
                  <div className="space-y-4">
                    {/* Timer Toggle */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-semibold text-gray-700">Hẹn giờ học tập</span>
                        </div>
                        <button
                          onClick={onTimerToggle}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            settings.timerEnabled ? "bg-purple-500" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                              settings.timerEnabled ? "translate-x-6" : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Timer Controls - Only show if enabled */}
                    {settings.timerEnabled && (
                      <>
                        {/* Duration Selector */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Thời gian học (phút):
                          </label>
                          <div className="flex gap-2 flex-wrap">
                            {[10, 15, 20, 30, 45].map((mins) => (
                              <button
                                key={mins}
                                onClick={() => handleDurationChange(mins)}
                                className={`flex-1 min-w-[60px] py-2 px-3 rounded-lg font-semibold transition-colors ${
                                  duration === mins
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {mins}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Timer Display */}
                        <div className="text-center p-4 bg-purple-50 rounded-xl">
                          <div className="text-3xl font-bold text-purple-700 mb-2">{timeRemaining}</div>
                          <div className="text-sm text-gray-500">{isRunning ? "⏱️ Đang học..." : "⏸️ Đã dừng"}</div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-2">
                          {!isRunning ? (
                            <button
                              onClick={handleStart}
                              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                            >
                              <Play className="w-4 h-4" />
                              Bắt đầu
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={handlePause}
                                className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                              >
                                <Pause className="w-4 h-4" />
                                Tạm dừng
                              </button>
                              <button
                                onClick={handleStop}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                              >
                                <Square className="w-4 h-4" />
                                Dừng
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notification Modal */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNotification(false)}
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">⏰</div>
              <h2 className="text-2xl font-bold text-purple-700 mb-2">Đã đến lúc nghỉ ngơi!</h2>
              <p className="text-gray-600 mb-6">Bé đã học được một lúc rồi! Hãy nghỉ ngơi một chút nhé! 👏</p>
              <button
                onClick={() => {
                  setShowNotification(false)
                  handleStop()
                }}
                className="bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Đã hiểu! 👍
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
