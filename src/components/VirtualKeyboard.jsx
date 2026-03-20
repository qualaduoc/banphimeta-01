import Key from "./Key"
import { keyboardLayout, shiftMap } from "../utils/keyboardLayout"

const VirtualKeyboard = ({ activeLetter, isShiftActive, currentTheme, onKeyPress }) => {
  // Layout bàn phím QWERTY chuẩn (giống bàn phím vật lý)
  const rows = [
    keyboardLayout.row0, // ~ 1 2 3 4 5 6 7 8 9 0 - =
    keyboardLayout.row1, // Q W E R T Y U I O P [ ] \
    keyboardLayout.row2, // A S D F G H J K L ; '
    keyboardLayout.row3, // Z X C V B N M , . /
  ]

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-5xl px-4 z-10">
      <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4">
        {/* Row 0: ~ 1 2 3 4 5 6 7 8 9 0 - = Backspace */}
        <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-2.5 w-full">
          {rows[0].map((key) => (
            <Key
              key={key}
              letter={key}
              onKeyPress={onKeyPress}
              isActive={activeLetter === key || (isShiftActive && shiftMap[key] && activeLetter === shiftMap[key])}
              theme={currentTheme}
              isShiftActive={isShiftActive}
            />
          ))}
          {/* Backspace key - phím đặc biệt, rộng hơn */}
          <Key
            key="BACKSPACE"
            letter="BACKSPACE"
            onKeyPress={onKeyPress}
            isActive={activeLetter === "BACKSPACE"}
            theme={currentTheme}
            isSpecial={true}
            isShiftActive={isShiftActive}
          />
        </div>

        {/* Row 1: Q W E R T Y U I O P [ ] \ */}
        <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 w-full">
          {rows[1].map((letter) => (
            <Key
              key={letter}
              letter={letter}
              onKeyPress={onKeyPress}
              isActive={
                activeLetter === letter || (isShiftActive && shiftMap[letter] && activeLetter === shiftMap[letter])
              }
              theme={currentTheme}
              isShiftActive={isShiftActive}
            />
          ))}
        </div>

        {/* Row 2: Shift | A S D F G H J K L ; ' */}
        <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 w-full">
          {/* Shift trái */}
          <Key
            key="SHIFT_LEFT"
            letter="SHIFT"
            onKeyPress={onKeyPress}
            isActive={isShiftActive}
            theme={currentTheme}
            isSpecial={true}
            isShiftActive={isShiftActive}
          />
          {rows[2].map((letter) => (
            <Key
              key={letter}
              letter={letter}
              onKeyPress={onKeyPress}
              isActive={
                activeLetter === letter || (isShiftActive && shiftMap[letter] && activeLetter === shiftMap[letter])
              }
              theme={currentTheme}
              isShiftActive={isShiftActive}
            />
          ))}
        </div>

        {/* Row 3: Z X C V B N M , . / | Shift */}
        <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 w-full">
          {rows[3].map((letter) => (
            <Key
              key={letter}
              letter={letter}
              onKeyPress={onKeyPress}
              isActive={
                activeLetter === letter || (isShiftActive && shiftMap[letter] && activeLetter === shiftMap[letter])
              }
              theme={currentTheme}
              isShiftActive={isShiftActive}
            />
          ))}
          {/* Shift phải */}
          <Key
            key="SHIFT_RIGHT"
            letter="SHIFT"
            onKeyPress={onKeyPress}
            isActive={isShiftActive}
            theme={currentTheme}
            isSpecial={true}
            isShiftActive={isShiftActive}
          />
        </div>

        {/* Row 4: Space Bar */}
        <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 w-full px-4">
          <Key
            key="SPACE"
            letter="SPACE"
            onKeyPress={onKeyPress}
            isActive={activeLetter === "SPACE" || activeLetter === " "}
            theme={currentTheme}
            isSpecial={true}
            isShiftActive={isShiftActive}
          />
        </div>
      </div>
    </div>
  )
}

export default VirtualKeyboard
