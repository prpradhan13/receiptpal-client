const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const categoryColorMap: Record<string, string> = {
  food: "#38b000", // Green
  entertainment: "#60a5fa", // Blue
  travel: "#facc15", // Yellow
  shopping: "#f472b6", // Pink
  utilities: "#a78bfa", // Purple
  uncategorized: "#9ca3af", // Gray
};
