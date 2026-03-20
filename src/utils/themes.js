// 5 giao diện khác nhau cho bàn phím + Dark mode + Eye-friendly mode

export const themes = {
  default: {
    name: '🌈 Màu Sắc Vui Tươi',
    id: 'default',
    mode: 'light',
    colors: {
      primary: 'from-pink-400 to-pink-600',
      secondary: 'from-blue-400 to-blue-600',
      background: 'from-pink-100 via-purple-50 to-blue-100',
      active: 'ring-yellow-300',
      text: 'text-purple-700',
      glow: 'rgba(255, 215, 0, 0.6)',
    },
    keyStyle: {
      even: 'from-pink-400 to-pink-600',
      odd: 'from-blue-400 to-blue-600',
    },
  },
  defaultDark: {
    name: '🌙 Màu Sắc Vui Tươi (Tối)',
    id: 'defaultDark',
    mode: 'dark',
    colors: {
      primary: 'from-pink-500 to-pink-700',
      secondary: 'from-blue-500 to-blue-700',
      background: 'from-gray-800 via-gray-900 to-gray-800',
      active: 'ring-yellow-400',
      text: 'text-purple-200',
      glow: 'rgba(255, 215, 0, 0.8)',
    },
    keyStyle: {
      even: 'from-pink-500 to-pink-700',
      odd: 'from-blue-500 to-blue-700',
    },
  },
  eyeFriendly: {
    name: '👁️ Dịu Mắt (Sáng)',
    id: 'eyeFriendly',
    mode: 'light',
    colors: {
      primary: 'from-amber-200 to-amber-300',
      secondary: 'from-green-200 to-green-300',
      background: 'from-amber-50 via-yellow-50 to-green-50',
      active: 'ring-amber-400',
      text: 'text-amber-800',
      glow: 'rgba(251, 191, 36, 0.4)',
    },
    keyStyle: {
      even: 'from-amber-200 to-amber-300',
      odd: 'from-green-200 to-green-300',
    },
  },
  eyeFriendlyDark: {
    name: '👁️ Dịu Mắt (Tối)',
    id: 'eyeFriendlyDark',
    mode: 'dark',
    colors: {
      primary: 'from-amber-600 to-amber-700',
      secondary: 'from-green-600 to-green-700',
      background: 'from-gray-900 via-gray-800 to-gray-900',
      active: 'ring-amber-500',
      text: 'text-amber-200',
      glow: 'rgba(251, 191, 36, 0.5)',
    },
    keyStyle: {
      even: 'from-amber-600 to-amber-700',
      odd: 'from-green-600 to-green-700',
    },
  },
  ocean: {
    name: '🌊 Đại Dương Xanh',
    id: 'ocean',
    mode: 'light',
    colors: {
      primary: 'from-cyan-400 to-cyan-600',
      secondary: 'from-teal-400 to-teal-600',
      background: 'from-cyan-100 via-blue-50 to-teal-100',
      active: 'ring-blue-300',
      text: 'text-cyan-700',
      glow: 'rgba(59, 130, 246, 0.6)',
    },
    keyStyle: {
      even: 'from-cyan-400 to-cyan-600',
      odd: 'from-teal-400 to-teal-600',
    },
  },
  oceanDark: {
    name: '🌊 Đại Dương Xanh (Tối)',
    id: 'oceanDark',
    mode: 'dark',
    colors: {
      primary: 'from-cyan-500 to-cyan-700',
      secondary: 'from-teal-500 to-teal-700',
      background: 'from-gray-800 via-blue-900 to-gray-800',
      active: 'ring-blue-400',
      text: 'text-cyan-200',
      glow: 'rgba(59, 130, 246, 0.8)',
    },
    keyStyle: {
      even: 'from-cyan-500 to-cyan-700',
      odd: 'from-teal-500 to-teal-700',
    },
  },
  forest: {
    name: '🌲 Rừng Xanh',
    id: 'forest',
    mode: 'light',
    colors: {
      primary: 'from-green-400 to-green-600',
      secondary: 'from-emerald-400 to-emerald-600',
      background: 'from-green-100 via-emerald-50 to-lime-100',
      active: 'ring-green-300',
      text: 'text-green-700',
      glow: 'rgba(34, 197, 94, 0.6)',
    },
    keyStyle: {
      even: 'from-green-400 to-green-600',
      odd: 'from-emerald-400 to-emerald-600',
    },
  },
  forestDark: {
    name: '🌲 Rừng Xanh (Tối)',
    id: 'forestDark',
    mode: 'dark',
    colors: {
      primary: 'from-green-500 to-green-700',
      secondary: 'from-emerald-500 to-emerald-700',
      background: 'from-gray-800 via-green-900 to-gray-800',
      active: 'ring-green-400',
      text: 'text-green-200',
      glow: 'rgba(34, 197, 94, 0.8)',
    },
    keyStyle: {
      even: 'from-green-500 to-green-700',
      odd: 'from-emerald-500 to-emerald-700',
    },
  },
  sunset: {
    name: '🌅 Hoàng Hôn',
    id: 'sunset',
    mode: 'light',
    colors: {
      primary: 'from-orange-400 to-orange-600',
      secondary: 'from-red-400 to-red-600',
      background: 'from-orange-100 via-rose-50 to-red-100',
      active: 'ring-orange-300',
      text: 'text-orange-700',
      glow: 'rgba(249, 115, 22, 0.6)',
    },
    keyStyle: {
      even: 'from-orange-400 to-orange-600',
      odd: 'from-red-400 to-red-600',
    },
  },
  sunsetDark: {
    name: '🌅 Hoàng Hôn (Tối)',
    id: 'sunsetDark',
    mode: 'dark',
    colors: {
      primary: 'from-orange-500 to-orange-700',
      secondary: 'from-red-500 to-red-700',
      background: 'from-gray-800 via-orange-900 to-gray-800',
      active: 'ring-orange-400',
      text: 'text-orange-200',
      glow: 'rgba(249, 115, 22, 0.8)',
    },
    keyStyle: {
      even: 'from-orange-500 to-orange-700',
      odd: 'from-red-500 to-red-700',
    },
  },
  rainbow: {
    name: '🌈 Cầu Vồng',
    id: 'rainbow',
    mode: 'light',
    colors: {
      primary: 'from-purple-400 to-purple-600',
      secondary: 'from-indigo-400 to-indigo-600',
      background: 'from-purple-100 via-pink-50 to-indigo-100',
      active: 'ring-purple-300',
      text: 'text-purple-700',
      glow: 'rgba(168, 85, 247, 0.6)',
    },
    keyStyle: {
      even: 'from-purple-400 to-purple-600',
      odd: 'from-indigo-400 to-indigo-600',
    },
  },
  rainbowDark: {
    name: '🌈 Cầu Vồng (Tối)',
    id: 'rainbowDark',
    mode: 'dark',
    colors: {
      primary: 'from-purple-500 to-purple-700',
      secondary: 'from-indigo-500 to-indigo-700',
      background: 'from-gray-800 via-purple-900 to-gray-800',
      active: 'ring-purple-400',
      text: 'text-purple-200',
      glow: 'rgba(168, 85, 247, 0.8)',
    },
    keyStyle: {
      even: 'from-purple-500 to-purple-700',
      odd: 'from-indigo-500 to-indigo-700',
    },
  },
};

// Get theme by ID
export const getTheme = (themeId) => {
  return themes[themeId] || themes.default;
};

// Get all theme IDs
export const getAllThemeIds = () => {
  return Object.keys(themes);
};
