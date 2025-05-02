import Feather from '@expo/vector-icons/Feather';

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

export const categoryData = [
  {
    cName: "food",
    color: "#38b000",
    iconComponent: Feather,
    iconProps: { name: "coffee", size: 24, color: "black" },
  },
  {
    cName: "travel",
    color: "#facc15",
    iconComponent: Feather,
    iconProps: { name: "map", size: 24, color: "black" },
  },
  {
    cName: "shopping",
    color: "#f472b6",
    iconComponent: Feather,
    iconProps: { name: "shopping-bag", size: 24, color: "black" },
  },
  {
    cName: "utilities",
    color: "#a78bfa",
    iconComponent: Feather,
    iconProps: { name: "slack", size: 24, color: "black" },
  },
  {
    cName: "uncategorized",
    color: "#9ca3af",
    iconComponent: null,
    iconProps: {},
  },
];
