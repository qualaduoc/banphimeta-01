import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, Pause, Square } from 'lucide-react';
import { timerManager } from '../utils/timer';

export default function TimerReminder({ enabled, onToggle }) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('20:00');
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(20); // minutes
  const [showNotification, setShowNotification] = useState(false);

  // Setup timer callbacks
  const handleTick = (remaining, formatted) => {
    setTimeRemaining(formatted);
  };

  const handleComplete = () => {
    setIsRunning(false);
    setShowNotification(true);
    playNotificationSound();
    showBrowserNotification();
  };

  useEffect(() => {
    if (!enabled) {
      timerManager.stop();
      setIsRunning(false);
      setTimeRemaining(timerManager.getCurrentFormattedTime());
      // Remove callbacks khi disabled
      timerManager.removeTickCallback(handleTick);
      timerManager.removeCompleteCallback(handleComplete);
      return;
    }

    // Initialize timer với duration mới
    timerManager.setDuration(duration);
    setTimeRemaining(timerManager.getCurrentFormattedTime());
    
    // Register callbacks
    timerManager.addTickCallback(handleTick);
    timerManager.addCompleteCallback(handleComplete);

    // Sync isRunning state với timerManager
    setIsRunning(timerManager.isRunning && !timerManager.isPaused);
    
    return () => {
      // Cleanup callbacks khi component unmount
      timerManager.removeTickCallback(handleTick);
      timerManager.removeCompleteCallback(handleComplete);
    };
  }, [enabled, duration]);

  // Sync state từ timerManager mỗi giây để đảm bảo đồng bộ
  useEffect(() => {
    if (!enabled) return;

    const syncInterval = setInterval(() => {
      // Sync timeRemaining
      const currentTime = timerManager.getCurrentFormattedTime();
      if (currentTime !== timeRemaining) {
        setTimeRemaining(currentTime);
      }
      
      // Sync isRunning
      const shouldBeRunning = timerManager.isRunning && !timerManager.isPaused;
      if (shouldBeRunning !== isRunning) {
        setIsRunning(shouldBeRunning);
      }
    }, 1000); // Sync mỗi giây

    return () => clearInterval(syncInterval);
  }, [enabled, isRunning, timeRemaining]);

  const handleStart = () => {
    timerManager.setDuration(duration);
    // Ensure callbacks are registered
    timerManager.addTickCallback(handleTick);
    timerManager.addCompleteCallback(handleComplete);
    timerManager.start(handleTick, handleComplete);
    setIsRunning(true);
    setTimeRemaining(timerManager.getCurrentFormattedTime());
  };

  const handlePause = () => {
    timerManager.pause();
    setIsRunning(false);
  };

  const handleResume = () => {
    timerManager.resume();
    setIsRunning(true);
  };

  const handleStop = () => {
    timerManager.stop();
    setIsRunning(false);
    setTimeRemaining(timerManager.getCurrentFormattedTime());
  };

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
    if (isRunning) {
      handleStop();
      timerManager.setDuration(newDuration);
      handleStart();
    } else {
      timerManager.setDuration(newDuration);
      setTimeRemaining(timerManager.getCurrentFormattedTime());
    }
  };

  const playNotificationSound = () => {
    // Tạo tone đơn giản để nhắc nhở
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Tạo tone nhẹ nhàng
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.warn('Notification sound error:', error);
    }
  };

  const showBrowserNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('⏰ Đã đến lúc nghỉ ngơi!', {
        body: 'Bé đã học được một lúc rồi! Hãy nghỉ ngơi một chút nhé! 👏',
        icon: '/vite.svg',
        tag: 'study-reminder',
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('⏰ Đã đến lúc nghỉ ngơi!', {
            body: 'Bé đã học được một lúc rồi! Hãy nghỉ ngơi một chút nhé! 👏',
            icon: '/vite.svg',
            tag: 'study-reminder',
          });
        }
      });
    }
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <>
      {/* Timer popup nhỏ trên góc trái - Chỉ hiển thị khi timer đang chạy */}
      {enabled && isRunning && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-4 z-40 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-3 min-w-[200px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Hẹn giờ</span>
            </div>
            <button
              onClick={() => {
                handleStop();
                onToggle();
              }}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              aria-label="Tắt hẹn giờ"
              title="Tắt hẹn giờ"
            >
              ×
            </button>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-3">
            <div className="text-2xl font-bold text-purple-700 mb-1">
              {timeRemaining}
            </div>
            <div className="text-xs text-gray-500">
              {isRunning ? '⏱️ Đang học...' : '⏸️ Đã dừng'}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white py-1.5 px-3 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
              >
                <Play className="w-3 h-3" />
                Bắt đầu
              </button>
            ) : (
              <>
                <button
                  onClick={handlePause}
                  className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 text-white py-1.5 px-3 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors"
                >
                  <Pause className="w-3 h-3" />
                  Tạm dừng
                </button>
                <button
                  onClick={handleStop}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-500 text-white py-1.5 px-3 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  <Square className="w-3 h-3" />
                  Dừng
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}

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
              <h2 className="text-2xl font-bold text-purple-700 mb-2">
                Đã đến lúc nghỉ ngơi!
              </h2>
              <p className="text-gray-600 mb-6">
                Bé đã học được một lúc rồi! Hãy nghỉ ngơi một chút nhé! 👏
              </p>
              <button
                onClick={() => {
                  setShowNotification(false);
                  handleStop();
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
  );
}
