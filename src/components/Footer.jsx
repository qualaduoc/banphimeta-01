"use client"

import { motion } from "framer-motion"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 py-3 px-4 z-40"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>© Code Thuận Nguyễn</span>
          <span className="hidden sm:inline">|</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Phát triển: Nguyễn Thành Được - ETA</span>
          <span className="hidden sm:inline">|</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="tel:0904059866" className="hover:text-purple-600 transition-colors">
            📞 0904059866
          </a>
          <span className="hidden sm:inline">|</span>
          <a href="mailto:Nguyenthanhduocathy@gmail.com" className="hover:text-purple-600 transition-colors">
            ✉️ Nguyenthanhduocathy@gmail.com
          </a>
        </div>
      </div>
    </motion.footer>
  )
}
