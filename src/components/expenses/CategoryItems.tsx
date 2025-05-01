import { View, Text } from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  _entering,
  _exiting,
  _layout,
  AnimatedPressable,
} from "@/src/constants/Animation";
import { categoryColorMap } from "@/src/constants/Colors";
import { useEffect } from "react";
import { useAuthContext } from "@/src/context/AuthProvider";

interface CategoryItemsProps {
  month: string;
  category: string;
  items: {
    itemName: string;
    price: number;
    purchasedAt: number;
  }[];
}

const CategoryItems = ({ category, items, month }: CategoryItemsProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { monthlyBalance } = useAuthContext();
  const totalBalance = month ? monthlyBalance[month] || 0 : 0

  const isOpen = expanded[category];
  const progress = useSharedValue(0);
  const opacity = useSharedValue(isOpen ? 0 : 1);

  const categoryTotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const percentUsed = Math.min((categoryTotal / totalBalance) * 100, 100);
  const categoryColor = categoryColorMap[category] || "#6b7280";

  useEffect(() => {
    progress.value = withTiming(percentUsed, { duration: 600 });
    opacity.value = withTiming(isOpen ? 0 : 1, { duration: 300 });
  }, [isOpen]);

  const animatedBarStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
      opacity: opacity.value,
    };
  });

  const toggleCategory = (category: string) => {
    setExpanded((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <Animated.View
      layout={_layout}
      className="mb-3 rounded-xl overflow-hidden p-3"
    >
      {!isOpen && (
        <View className="absolute left-0 right-0 top-0 bottom-0 bg-white/10">
          <Animated.View
            style={[{ backgroundColor: categoryColor }, animatedBarStyle]}
            className="h-full opacity-30"
          />
        </View>
      )}

      <AnimatedPressable
        layout={_layout}
        className="flex-row justify-between items-center"
        onPress={() => toggleCategory(category)}
      >
        <View className="flex-row gap-2 items-center">
          <Feather
            name={isOpen ? "chevron-up" : "chevron-down"}
            color={"#fff"}
            size={24}
          />
          <Text className="text-white text-2xl font-medium capitalize">
            {category}
          </Text>
        </View>

        <Text className="text-white text-2xl font-medium">{categoryTotal}</Text>
      </AnimatedPressable>

      {isOpen && (
        <Animated.View
          entering={_entering}
          layout={_layout}
          className="pl-6 mt-2 gap-1"
        >
          {items.map((item, idx) => (
            <View
              key={`${item.itemName}-${idx}`}
              className="flex-row justify-between"
            >
              <Text className="text-white">{item.itemName}</Text>
              <Text className="text-white">{item.price}</Text>
            </View>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default CategoryItems;
