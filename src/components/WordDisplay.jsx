"use client"

import { motion, AnimatePresence } from "framer-motion"
import { keyboardData, vocabularyData } from "../data/keyboardData"

// Map các ký tự đặc biệt (shift chars) sang tên tiếng Anh
const charNames = {
  "!": "exclamation mark",
  "@": "at symbol",
  "#": "hash",
  $: "dollar sign",
  "%": "percent",
  "^": "caret",
  "&": "ampersand",
  "*": "asterisk",
  "(": "left parenthesis",
  ")": "right parenthesis",
  _: "underscore",
  "+": "plus",
  "{": "left brace",
  "}": "right brace",
  "|": "pipe",
  ":": "colon",
  '"': "double quote",
  "<": "less than",
  ">": "greater than",
  "?": "question mark",
  "`": "backtick",
  "~": "tilde",
}

export default function WordDisplay({ letter, theme, wordMode, matchedWord, wordHint, possibleWords, wordBuffer }) {
  if (
    !letter ||
    letter === "BACKSPACE" ||
    letter === "SHIFT" ||
    letter === "SPACE" ||
    letter === "CAPSLOCK" ||
    letter === " "
  )
    return null

  const letterStr = String(letter).trim()
  if (!letterStr) return null

  const textColor = theme?.colors?.text || "text-purple-600"

  // === WORD MODE: Hiển thị trạng thái ghép từ ===
  if (wordMode) {
    // Đã match thành công một từ
    if (matchedWord) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key={`matched-${matchedWord.phrase}`}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-center w-full"
          >
            {/* Từ đã ghép thành công */}
            <div className={`text-5xl sm:text-6xl md:text-7xl font-bold ${textColor} mb-1 drop-shadow-lg`}>
              {matchedWord.phrase}
            </div>

            {/* Emoji lớn + từ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="text-5xl sm:text-6xl md:text-7xl"
                style={{ fontFamily: "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif" }}
              >
                {matchedWord.emoji}
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl text-gray-600 font-semibold">
                {matchedWord.word}
              </div>
            </motion.div>

            {/* Badge thành công */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              className="mt-2 inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold"
            >
              ✅ Chính xác!
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )
    }

    // Đang gõ dở (có buffer nhưng chưa match)
    if (wordBuffer && wordBuffer.length > 0) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key={`buffer-${wordBuffer}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-center w-full"
          >
            {/* Buffer đang gõ */}
            <div className={`text-5xl sm:text-6xl md:text-7xl font-bold ${textColor} mb-2 drop-shadow-lg tracking-wider`}>
              {wordBuffer.split("").map((char, i) => (
                <motion.span
                  key={`${i}-${char}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {char}
                </motion.span>
              ))}
              <span className="animate-pulse text-gray-300">_</span>
            </div>

            {/* Gợi ý từ có thể ghép */}
            {possibleWords && possibleWords.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-2"
              >
                <div className="text-xs text-gray-400 mb-1">💡 Gợi ý:</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {possibleWords.map((w, i) => (
                    <motion.div
                      key={w.phrase}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 border border-purple-200 rounded-full text-sm shadow-sm"
                    >
                      <span>{w.emoji}</span>
                      <span className="font-semibold text-purple-700">
                        <span className="text-purple-500">{wordBuffer}</span>
                        <span className="text-gray-400">{w.phrase.slice(wordBuffer.length)}</span>
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Không có từ nào match */}
            {(!possibleWords || possibleWords.length === 0) && wordBuffer.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-sm text-orange-500"
              >
                🤔 Chưa tìm thấy từ phù hợp. Thử gõ tiếp hoặc nhấn Space để bắt đầu lại!
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )
    }

    return null
  }

  // === SINGLE LETTER MODE: Hiển thị chữ cái riêng lẻ (logic cũ) ===

  // Check nếu letter match với một từ trong phraseData (backward compat)
  const phraseMatch = vocabularyData.find((p) => p.phrase === letterStr.toUpperCase())

  if (phraseMatch) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={phraseMatch.phrase}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-center w-full"
        >
          <div className={`text-6xl sm:text-7xl md:text-8xl font-bold ${textColor} mb-2 drop-shadow-lg`}>
            {phraseMatch.phrase}
          </div>
          <div className="flex flex-col items-center gap-2 min-h-[80px]">
            <div
              className="text-5xl sm:text-6xl md:text-7xl"
              style={{ fontFamily: "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif" }}
            >
              {phraseMatch.emoji}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl text-gray-600 font-semibold">{phraseMatch.word}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Single letter display
  const letterStrUpper = letterStr.toUpperCase()
  const displayLetter = letterStr
  const searchKey = letterStr >= "a" && letterStr <= "z" ? letterStrUpper : letterStrUpper
  const keyData = keyboardData.find((k) => k.key === searchKey)
  const displayWord = keyData?.word || charNames[letterStrUpper] || letterStrUpper
  const displayEmoji = keyData?.emoji || ""

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={letterStrUpper}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="text-center w-full"
      >
        <div className={`text-7xl sm:text-8xl md:text-9xl font-bold ${textColor} mb-2 drop-shadow-lg`}>
          {displayLetter}
        </div>
        <div className="flex flex-col items-center gap-1 min-h-[60px]">
          {displayEmoji && (
            <div
              className="text-3xl sm:text-4xl md:text-5xl"
              style={{ fontFamily: "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif" }}
            >
              {displayEmoji}
            </div>
          )}
          {displayWord && <div className="text-sm sm:text-base md:text-lg text-gray-500 italic">{displayWord}</div>}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
