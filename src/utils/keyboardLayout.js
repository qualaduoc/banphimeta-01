// Layout bàn phím QWERTY chuẩn giống bàn phím vật lý

export const keyboardLayout = {
  // Hàng 0: ~ ` | 1 2 3 4 5 6 7 8 9 0 - =
  row0: ['~', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  
  // Hàng 1: Q W E R T Y U I O P [ ] \
  row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  
  // Hàng 2: Shift | A S D F G H J K L ; '
  row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'"],
  
  // Hàng 3: Z X C V B N M , . / | Shift
  row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'],
};

// Shift mapping - ký tự thay thế khi bấm Shift
export const shiftMap = {
  '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
  '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
  '-': '_', '=': '+', '[': '{', ']': '}', '\\': '|',
  ';': ':', "'": '"', ',': '<', '.': '>', '/': '?',
  '~': '`', // Tilde với shift
};

// Get shift character for a key
export const getShiftChar = (key) => {
  return shiftMap[key] || key.toUpperCase();
};

// Get display character (base or shift)
export const getDisplayChar = (key, isShiftPressed) => {
  if (isShiftPressed) {
    // Nếu là chữ cái, uppercase (đã uppercase rồi)
    if (key >= 'A' && key <= 'Z') {
      return key; // Đã uppercase
    }
    // Nếu có shift mapping, dùng shift char
    if (shiftMap[key]) {
      return shiftMap[key];
    }
  }
  return key;
};

// Get all keys in layout order
export const getAllLetters = () => {
  return [
    ...keyboardLayout.row0,
    ...keyboardLayout.row1,
    ...keyboardLayout.row2,
    ...keyboardLayout.row3,
  ];
};

// Check if key exists in layout
export const isLetterInLayout = (key) => {
  const upperKey = key.toUpperCase();
  if (upperKey === 'BACKSPACE') return true;
  return getAllLetters().includes(upperKey);
};
