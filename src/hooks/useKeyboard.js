"use client"

import { useState, useEffect, useCallback } from "react"
import { shiftMap } from "../utils/keyboardLayout"
import { audioManager } from "../utils/audio"
import { speechManager } from "../utils/speech"
import { vocabularyData, keyboardData } from "../data/keyboardData"

// Mapping tên ký tự đặc biệt cho speech
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
  "[": "left bracket",
  "]": "right bracket",
  "\\": "backslash",
  ";": "semicolon",
  "'": "single quote",
  ",": "comma",
  ".": "period",
  "/": "slash",
  "-": "minus",
  "=": "equals",
}

// Tìm tất cả các từ bắt đầu bằng prefix đã cho
function findMatchingWords(prefix, category) {
  const upperPrefix = prefix.toUpperCase()
  const filteredData = category === "all"
    ? vocabularyData
    : vocabularyData.filter((v) => v.category === category)

  return filteredData.filter((v) => v.phrase.startsWith(upperPrefix))
}

// Tìm từ khớp chính xác
function findExactMatch(buffer, category) {
  const upperBuffer = buffer.toUpperCase()
  const filteredData = category === "all"
    ? vocabularyData
    : vocabularyData.filter((v) => v.category === category)

  return filteredData.find((v) => v.phrase === upperBuffer)
}

export function useKeyboard(settings) {
  const [activeLetter, setActiveLetter] = useState("")
  const [isShiftPressed, setIsShiftPressed] = useState(false)
  const [shiftToggle, setShiftToggle] = useState(false)
  const [lastSoundTime, setLastSoundTime] = useState(0)
  const [lastKeyTime, setLastKeyTime] = useState(0)

  // Word mode states
  const [wordBuffer, setWordBuffer] = useState("") // Chuỗi ký tự đang gõ trong word mode
  const [matchedWord, setMatchedWord] = useState(null) // Từ đã match thành công
  const [wordHint, setWordHint] = useState(null) // Gợi ý từ có thể ghép
  const [possibleWords, setPossibleWords] = useState([]) // Danh sách từ có thể ghép

  // Shift active state (hold hoặc toggle)
  const isShiftActive = isShiftPressed || shiftToggle

  // Xử lý khi gõ phím
  const handleKeyPress = useCallback(
    (letter) => {
      const now = Date.now()
      const timeSinceLastKey = now - lastKeyTime
      setLastKeyTime(now)

      // === SHIFT ===
      if (letter === "SHIFT") {
        setShiftToggle((prev) => !prev)
        audioManager.playKeySound()
        return
      }

      // === SPACE ===
      if (letter === "SPACE") {
        setActiveLetter(" ")
        audioManager.playKeySound()
        speechManager.speak("space")
        // Reset word buffer
        setWordBuffer("")
        setMatchedWord(null)
        setWordHint(null)
        setPossibleWords([])
        setTimeout(() => setActiveLetter(""), 800)
        return
      }

      // === Resolve actual letter (shift handling) ===
      const isShiftActive = isShiftPressed || shiftToggle
      let actualLetter = letter
      let displayLetter = letter

      const letterStr = String(letter)
      const shiftChars = Object.values(shiftMap)
      const isShiftChar = shiftChars.includes(letterStr)

      if (letterStr !== "BACKSPACE" && letterStr !== "SHIFT" && letterStr !== "SPACE") {
        if (isShiftChar) {
          actualLetter = letterStr
          displayLetter = letterStr
        } else if (isShiftActive) {
          if (shiftMap[letterStr]) {
            actualLetter = shiftMap[letterStr]
            displayLetter = shiftMap[letterStr]
          } else if (letterStr >= "a" && letterStr <= "z") {
            actualLetter = letterStr.toUpperCase()
            displayLetter = letterStr.toUpperCase()
          } else if (letterStr >= "A" && letterStr <= "Z") {
            actualLetter = letterStr
            displayLetter = letterStr
          }
        }
      }

      // === WORD MODE (ghép từ) ===
      if (settings.wordMode && displayLetter.match(/^[A-Za-z]$/)) {
        // Reset buffer nếu đã lâu không gõ
        let currentWordBuffer = wordBuffer
        if (timeSinceLastKey > 3000) {
          currentWordBuffer = ""
        }

        const newBuffer = currentWordBuffer + displayLetter.toUpperCase()
        setWordBuffer(newBuffer)

        // Phát âm thanh gõ phím
        audioManager.playKeySound()
        setLastSoundTime(now)

        // Hiển thị buffer đang gõ
        setActiveLetter(newBuffer)
        setMatchedWord(null)

        // Kiểm tra xem có từ nào exact match không
        const exactMatch = findExactMatch(newBuffer, settings.category)
        if (exactMatch) {
          // Tìm thấy từ khớp chính xác!
          setMatchedWord(exactMatch)
          speechManager.speakWithVietnamese(exactMatch.word, exactMatch.vi)

          // Kiểm tra xem có thể ghép tiếp không
          const canContinue = findMatchingWords(newBuffer, settings.category)
            .filter((w) => w.phrase !== newBuffer).length > 0

          if (!canContinue) {
            // Không thể ghép tiếp → auto reset sau delay
            setTimeout(() => {
              setActiveLetter("")
              setWordBuffer("")
              setMatchedWord(null)
              setWordHint(null)
              setPossibleWords([])
            }, 1500)
          }
          // Nếu còn từ dài hơn, giữ buffer để user có thể gõ tiếp
          return
        }

        // Kiểm tra xem có từ nào bắt đầu bằng buffer không
        const matches = findMatchingWords(newBuffer, settings.category)
        if (matches.length > 0) {
          // Có từ có thể ghép → show gợi ý
          setWordHint(matches[0]) // Gợi ý từ đầu tiên
          setPossibleWords(matches.slice(0, 5)) // Tối đa 5 gợi ý
        } else {
          // Không match → reset và bắt đầu từ đây
          setWordBuffer(displayLetter.toUpperCase())
          setActiveLetter(displayLetter.toUpperCase())
          setWordHint(null)
          setPossibleWords([])

          const singleMatches = findMatchingWords(displayLetter.toUpperCase(), settings.category)
          if (singleMatches.length > 0) {
            setWordHint(singleMatches[0])
            setPossibleWords(singleMatches.slice(0, 5))
          }
        }

        // Không auto-clear khi ở word mode
        return
      }

      // === SINGLE LETTER MODE (chế độ chữ cái riêng lẻ) ===
      // Reset word buffer
      setWordBuffer("")
      setMatchedWord(null)
      setWordHint(null)
      setPossibleWords([])

      setActiveLetter(displayLetter)

      // Phát âm thanh
      const nowSound = Date.now()
      const timeSinceLastSound = nowSound - lastSoundTime
      if (isShiftPressed && !shiftToggle) {
        if (timeSinceLastSound > 300) {
          audioManager.playKeySound()
          setLastSoundTime(nowSound)
        }
      } else {
        audioManager.playKeySound()
        setLastSoundTime(nowSound)
      }

      // Đọc tên ký tự
      if (
        actualLetter &&
        actualLetter !== "BACKSPACE" &&
        actualLetter !== "SHIFT" &&
        actualLetter !== "SPACE"
      ) {
        const actualLetterStr = String(actualLetter)
        if (charNames[actualLetterStr]) {
          speechManager.speak(charNames[actualLetterStr])
        } else {
          // Tìm nghĩa tiếng Việt của chữ cái
          const keyInfo = keyboardData.find(k => k.key === actualLetterStr.toUpperCase())
          if (keyInfo && keyInfo.vi) {
            speechManager.speakWithVietnamese(actualLetterStr, keyInfo.vi)
          } else {
            speechManager.speak(actualLetterStr)
          }
        }
      }

      setTimeout(() => setActiveLetter(""), 800)
    },
    [
      isShiftPressed,
      shiftToggle,
      lastSoundTime,
      lastKeyTime,
      wordBuffer,
      settings.wordMode,
      settings.category,
    ],
  )

  // Xử lý phím bàn phím thật
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Shift" || e.key === "ShiftLeft" || e.key === "ShiftRight") {
        setIsShiftPressed(true)
        return
      }

      let key = e.key.toUpperCase()

      if (e.key === " ") {
        e.preventDefault()
        handleKeyPress("SPACE")
        return
      }

      if (e.key === "Backspace") {
        e.preventDefault()
        // Trong word mode, xóa ký tự cuối trong buffer
        if (settings.wordMode && wordBuffer.length > 0) {
          const newBuffer = wordBuffer.slice(0, -1)
          setWordBuffer(newBuffer)
          if (newBuffer.length === 0) {
            setActiveLetter("")
            setWordHint(null)
            setPossibleWords([])
            setMatchedWord(null)
          } else {
            setActiveLetter(newBuffer)
            const matches = findMatchingWords(newBuffer, settings.category)
            if (matches.length > 0) {
              setWordHint(matches[0])
              setPossibleWords(matches.slice(0, 5))
            } else {
              setWordHint(null)
              setPossibleWords([])
            }
            const exactMatch = findExactMatch(newBuffer, settings.category)
            setMatchedWord(exactMatch || null)
          }
          audioManager.playKeySound()
          return
        }
        handleKeyPress("BACKSPACE")
        return
      }

      const shiftChars = Object.values(shiftMap)
      if (shiftChars.includes(e.key)) {
        e.preventDefault()
        handleKeyPress(e.key)
        return
      }

      if (e.shiftKey || isShiftPressed) {
        const baseChars = Object.keys(shiftMap)
        if (baseChars.includes(e.key)) {
          e.preventDefault()
          const shiftChar = shiftMap[e.key] || e.key
          handleKeyPress(shiftChar)
          return
        }
        if (key >= "A" && key <= "Z") {
          e.preventDefault()
          handleKeyPress(e.key.toUpperCase())
          return
        }
      }

      if (key >= "0" && key <= "9") {
        e.preventDefault()
        handleKeyPress(e.key)
        return
      }

      if (key >= "A" && key <= "Z") {
        e.preventDefault()
        handleKeyPress(e.key)
        return
      }

      const specialKeys = ["~", "`", "-", "=", "[", "]", "\\", ";", "'", ",", ".", "/"]
      if (specialKeys.includes(e.key)) {
        e.preventDefault()
        handleKeyPress(e.key)
        return
      }
    }

    const handleKeyUp = (e) => {
      if (e.key === "Shift" || e.key === "ShiftLeft" || e.key === "ShiftRight") {
        setIsShiftPressed(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [handleKeyPress, isShiftPressed, shiftToggle, wordBuffer, settings.wordMode, settings.category])

  // Reset buffers khi thay đổi settings
  const resetBuffers = useCallback(() => {
    setWordBuffer("")
    setMatchedWord(null)
    setWordHint(null)
    setPossibleWords([])
    setActiveLetter("")
  }, [])

  return {
    activeLetter,
    isShiftActive,
    handleKeyPress,
    resetBuffers,
    // Word mode states
    wordBuffer,
    matchedWord,
    wordHint,
    possibleWords,
  }
}
