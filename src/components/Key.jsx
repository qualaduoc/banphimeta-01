import { motion } from 'framer-motion';
import { keyboardData } from '../data/keyboardData';
import { getDisplayChar, shiftMap } from '../utils/keyboardLayout';

export default function Key({ letter, onKeyPress, isActive = false, theme, isSpecial = false, isShiftActive = false, capsLock = false }) {
  // Tìm keyData - chỉ tìm cho chữ cái (A-Z) để lấy emoji
  // Số và ký tự đặc biệt không cần emoji từ keyboardData
  const keyData = (letter >= 'A' && letter <= 'Z') ? keyboardData.find(k => k.key === letter) : null;
  const word = keyData?.word || letter;
  // Chỉ lấy emoji cho chữ cái (A-Z), không lấy cho số và ký tự đặc biệt
  const emoji = (letter >= 'A' && letter <= 'Z') ? (keyData?.emoji || '') : '';
  
  // Hiển thị cả ký tự gốc và shift char nếu có (chỉ khai báo 1 lần)
  const hasShiftChar = shiftMap[letter] && letter !== 'SHIFT' && letter !== 'BACKSPACE' && letter !== 'SPACE' && letter !== 'CAPSLOCK';
  
  // Xác định ký tự hiển thị (có Shift hay Caps Lock hay không)
  // Khi Shift active, ẩn ký tự chính và để ký tự secondary "nổi lên" qua animation riêng
  let displayChar = letter;
  let showMainChar = true;
  
  // Kiểm tra xem letter có phải là chữ cái không
  const isLetter = (letter >= 'A' && letter <= 'Z');
  
  if (isShiftActive && letter !== 'BACKSPACE' && letter !== 'SHIFT' && letter !== 'SPACE' && letter !== 'CAPSLOCK' && hasShiftChar) {
    // Khi Shift active và có shift char, ẩn ký tự chính (sẽ hiển thị qua animation riêng)
    showMainChar = false;
  } else if (isShiftActive && letter !== 'BACKSPACE' && letter !== 'SHIFT' && letter !== 'SPACE' && letter !== 'CAPSLOCK') {
    // Shift active → uppercase (Shift override Caps Lock)
    if (isLetter) {
      displayChar = letter.toUpperCase();
    } else {
      displayChar = getDisplayChar(letter, true);
    }
  } else if (!isShiftActive && isLetter) {
    // Không có Shift active → xử lý Caps Lock cho chữ cái
    if (capsLock) {
      // Caps Lock ON → uppercase
      displayChar = letter.toUpperCase();
    } else {
      // Caps Lock OFF → lowercase
      displayChar = letter.toLowerCase();
    }
  }
  
  // Xác định màu phím dựa trên loại phím
  let keyColorClass;
  if (isSpecial || letter === 'BACKSPACE' || letter === 'SHIFT' || letter === 'SPACE' || letter === 'CAPSLOCK') {
    // Phím đặc biệt: màu xám (Shift, Backspace, Space, Caps Lock)
    if (letter === 'SHIFT' && isShiftActive) {
      keyColorClass = 'bg-gradient-to-br from-blue-500 to-blue-700'; // Shift active: màu xanh
    } else if (letter === 'CAPSLOCK' && capsLock) {
      keyColorClass = 'bg-gradient-to-br from-green-500 to-green-700'; // Caps Lock active: màu xanh lá
    } else if (letter === 'SPACE') {
      keyColorClass = 'bg-gradient-to-br from-gray-400 to-gray-600'; // Space: màu xám nhạt hơn
    } else {
      keyColorClass = 'bg-gradient-to-br from-gray-500 to-gray-700';
    }
  } else if (/[0-9]/.test(letter)) {
    // Số: màu vàng cam
    keyColorClass = letter.charCodeAt(0) % 2 === 0 
      ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
      : 'bg-gradient-to-br from-orange-400 to-red-500';
  } else if (['-', '=', '[', ']', '\\', ';', "'", ',', '.', '/', '~'].includes(letter)) {
    // Phím ký tự đặc biệt: màu xanh lá
    keyColorClass = 'bg-gradient-to-br from-green-400 to-green-600';
  } else {
    // Chữ cái: dùng theme colors
    keyColorClass = letter.charCodeAt(0) % 2 === 0 
      ? `bg-gradient-to-br ${theme?.keyStyle?.even || 'from-pink-400 to-pink-600'}`
      : `bg-gradient-to-br ${theme?.keyStyle?.odd || 'from-blue-400 to-blue-600'}`;
  }
  
  const activeRingClass = theme?.colors?.active || 'ring-yellow-300';
  const glowColor = theme?.colors?.glow || 'rgba(255, 215, 0, 0.6)';
  
  // Text hiển thị trên phím
  let displayText = letter;
  if (letter === 'SPACE') {
    displayText = 'Space';
  } else if (letter === 'CAPSLOCK') {
    displayText = 'Caps';
  } else if (letter === 'BACKSPACE') {
    displayText = '⌫';
  } else if (letter === 'SHIFT') {
    displayText = '⇧';
  } else {
    displayText = displayChar;
  }
  
  // Kích thước phím: phím đặc biệt rộng hơn
  const keyWidthClass = isSpecial || letter === 'BACKSPACE' || letter === 'SHIFT' || letter === 'SPACE' || letter === 'CAPSLOCK'
    ? letter === 'SPACE' 
      ? 'w-full max-w-3xl sm:max-w-4xl' // Space: rộng nhất
      : 'w-20 sm:w-24 md:w-28' 
    : 'w-12 sm:w-14 md:w-16';
  const keyHeightClass = isSpecial || letter === 'BACKSPACE' || letter === 'SHIFT' || letter === 'SPACE' || letter === 'CAPSLOCK'
    ? 'h-12 sm:h-14 md:h-16'
    : 'h-12 sm:h-14 md:h-16';

  return (
    <motion.button
      className={`
        key-button
        ${keyColorClass}
        ${keyWidthClass}
        ${keyHeightClass}
        ${isActive ? `key-button-active ${activeRingClass}` : ''}
        relative text-white rounded-xl sm:rounded-2xl
        flex items-center justify-center
      `}
      onClick={() => onKeyPress(letter)}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95, y: 2 }}
      animate={isActive ? { 
        scale: [1, 1.3, 1.15, 1],
        y: [0, -10, 0],
        rotate: [0, -8, 8, 0],
        boxShadow: [
          '0 10px 25px rgba(0,0,0,0.2)',
          `0 20px 40px ${glowColor}`,
          `0 15px 35px ${glowColor}`,
          '0 10px 25px rgba(0,0,0,0.2)',
        ],
      } : isShiftActive && hasShiftChar ? {
        // Khi Shift active nhưng chưa click, có thể thêm subtle animation
        scale: 1,
        y: 0,
        rotate: 0,
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      } : {
        scale: 1,
        y: 0,
        rotate: 0,
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      }}
      transition={{ 
        duration: 0.5,
        ease: "easeOut"
      }}
    >
      <div className="flex flex-col items-center justify-center h-full relative z-10">
        {/* Hiển thị ký tự chính (ẩn khi Shift active và có shift char) */}
        {showMainChar && (
          <motion.span 
            className={`${letter === 'SPACE' ? 'text-lg sm:text-xl md:text-2xl' : 'text-2xl sm:text-3xl md:text-4xl'} font-bold relative`}
            animate={isActive ? {
              scale: [1, 1.3, 1.1],
              color: ['inherit', '#FFD700', 'inherit'],
            } : {}}
            transition={{ duration: 0.5 }}
            style={{
              opacity: isShiftActive && hasShiftChar ? 0.3 : 1,
            }}
          >
            {displayText}
          </motion.span>
        )}
        
        {/* Hiển thị shift char (nhỏ, ở góc trên, "chìm") nếu có và không phải Shift active */}
        {hasShiftChar && !isShiftActive && letter !== 'SHIFT' && (
          <motion.span 
            className="text-xs sm:text-sm absolute top-0.5 right-0.5 text-white/40"
            initial={{ opacity: 0.4, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {shiftMap[letter]}
          </motion.span>
        )}
        
        {/* Ký tự secondary "nổi lên" khi Shift active - animation đặc biệt */}
        {hasShiftChar && isShiftActive && letter !== 'SHIFT' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            key={`shift-${letter}-${isShiftActive}`}
            initial={{ opacity: 0, scale: 0.6, y: 8, filter: 'blur(2px)' }}
            animate={{ 
              opacity: isActive ? 1 : 0.95, // Khi active, opacity cao hơn
              scale: isActive ? 1.2 : 1.1, // Khi active, scale lớn hơn
              y: isActive ? -2 : 0, // Khi active, nổi lên cao hơn
              filter: 'blur(0px)',
            }}
            transition={{ 
              duration: isActive ? 0.3 : 0.6, // Khi active, animation nhanh hơn
              ease: [0.34, 1.56, 0.64, 1], // Bounce effect
            }}
          >
            <motion.span
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
              style={{
                textShadow: isActive 
                  ? '0 0 20px rgba(255, 215, 0, 1), 0 0 40px rgba(255, 215, 0, 0.6)' 
                  : '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.4)',
                filter: 'drop-shadow(0 2px 8px rgba(255, 255, 255, 0.6))',
              }}
              animate={isActive ? {
                scale: [1, 1.15, 1.05, 1],
                color: ['#ffffff', '#FFD700', '#ffffff'],
              } : {
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: isActive ? 0.5 : 1.5,
                repeat: isActive ? 0 : Infinity, 
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              {shiftMap[letter]}
            </motion.span>
          </motion.div>
        )}
        
        {/* Hiển thị ký tự gốc (nhỏ, ở dưới, "chìm xuống") khi Shift active */}
        {hasShiftChar && isShiftActive && letter !== 'SHIFT' && (
          <motion.span 
            className="text-xs absolute bottom-0.5 text-white/25"
            initial={{ opacity: 0.25, scale: 0.6, y: -2 }}
            animate={{ opacity: 0.25, scale: 0.6, y: 4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {letter}
          </motion.span>
        )}
        
        {/* Chỉ hiển thị emoji cho chữ cái (A-Z), không hiển thị cho số và ký tự đặc biệt */}
        {/* Emoji hiển thị ở dưới ký tự chính, chỉ khi không có Shift active */}
        {emoji && letter >= 'A' && letter <= 'Z' && letter !== 'BACKSPACE' && letter !== 'SHIFT' && !isShiftActive && (
          <motion.span 
            className="text-sm sm:text-base md:text-lg mt-0.5 absolute bottom-0.5 z-10"
            animate={isActive ? {
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            } : {}}
            transition={{ duration: 0.5 }}
          >
            {emoji}
          </motion.span>
        )}
      </div>
      
      {/* Glow effect khi active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            boxShadow: [
              `0 0 0px ${glowColor.replace('0.6', '0')}`,
              `0 0 30px ${glowColor.replace('0.6', '0.8')}`,
              `0 0 0px ${glowColor.replace('0.6', '0')}`,
            ],
          }}
          transition={{ duration: 0.6 }}
          style={{
            background: `radial-gradient(circle, ${glowColor.replace('0.6', '0.3')} 0%, transparent 70%)`,
            zIndex: -1,
          }}
        />
      )}
      
      {/* Particle effect khi active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full"
              initial={{ 
                x: '50%', 
                y: '50%',
                scale: 0,
              }}
              animate={{ 
                x: `${50 + (Math.random() - 0.5) * 100}%`,
                y: `${50 + (Math.random() - 0.5) * 100}%`,
                scale: [0, 1, 0],
              }}
              transition={{ 
                duration: 0.6,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.button>
  );
}
