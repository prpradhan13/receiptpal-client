import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";

interface TCategoryItems {
  category: string;
  items: {
    itemName: string;
    price: number;
    _creationTime: number;
  }[];
}

const CategoryItems = ({ category, items }: TCategoryItems) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setExpanded((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const isOpen = expanded[category];
  const categoryTotal = items.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <View key={category} className="mb-3">
      <Pressable
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
      </Pressable>

      {isOpen && (
        <View className="pl-6 mt-2 gap-1">
          {items.map((item, idx) => (
            <View
              key={`${item.itemName}-${idx}`}
              className="flex-row justify-between"
            >
              <Text className="text-white">{item.itemName}</Text>
              <Text className="text-white">{item.price}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default CategoryItems;
