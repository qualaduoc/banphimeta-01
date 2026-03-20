"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

export default function ZaloPopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 40000) // 40 seconds

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={() => setIsVisible(false)}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">📱</div>
            <h2 className="text-2xl font-bold text-purple-700 mb-2">Tham gia nhóm Zalo</h2>
            <p className="text-gray-600 text-sm">Nhận học liệu và tài liệu học tập miễn phí</p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <a
              href="https://zalo.me/g/uditpr888"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <span>📚</span>
                <span>Nhóm nhận học liệu</span>
              </div>
            </a>

            <a
              href="https://zalo.me/g/tncmdq530"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <span>🎬</span>
                <span>Nhóm tạo Video từ SGK</span>
              </div>
            </a>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-500 text-center mt-4">Tham gia cùng hàng ngàn phụ huynh và giáo viên</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
