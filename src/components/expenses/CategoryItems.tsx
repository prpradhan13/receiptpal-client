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
import { categoryData } from "@/src/constants/Colors";
import { formatCurrency } from "@/src/utils/helpingFunc";

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
  const totalBalance = month ? monthlyBalance[month] || 0 : 0;

  const isOpen = expanded[category];

  const categoryTotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const percentUsed =
    totalBalance > 0 ? Math.min((categoryTotal / totalBalance) * 100, 100) : 0;

  const toggleCategory = (category: string) => {
    setExpanded((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const cData = categoryData.filter((c) => c.cName === category);
  const IconComponent = cData[0].iconComponent;

  return (
    <Animated.View layout={_layout} className="mb-5 rounded-xl overflow-hidden">
      <AnimatedPressable
        layout={_layout}
        className="flex-row justify-between items-center"
        onPress={() => toggleCategory(category)}
      >
        <View className="flex-row gap-4 items-center">
          <View
            className="p-4 rounded-full"
            style={{ backgroundColor: cData[0].color }}
          >
            {IconComponent && (
              <IconComponent
                {...cData[0].iconProps}
                name={cData[0].iconProps?.name as any}
                color={"#fff"}
              />
            )}
          </View>
          <View>
            <Text className="text-white text-2xl font-medium capitalize">
              {category}
            </Text>
            <Text className="text-[#c2c2c2] font-medium capitalize">
              {Math.round(percentUsed)}%
            </Text>
          </View>
        </View>

        <Text className="text-white text-2xl font-medium">{formatCurrency(categoryTotal)}</Text>
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
              <Text className="text-white capitalize font-medium text-lg">
                {item.itemName}
              </Text>
              <Text className="text-white font-medium text-lg">
                {item.price}
              </Text>
            </View>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default CategoryItems;
