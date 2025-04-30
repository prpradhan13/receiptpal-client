import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useAuthContext } from "@/src/context/AuthProvider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Feather from "@expo/vector-icons/Feather";
import CategoryItems from "@/src/components/expenses/CategoryItems";
import BalanceDetails from "@/src/components/expenses/BalanceDetails";

interface TCategoryItems {
  itemName: string;
  price: number;
  _creationTime: number;
}

const ExpenseDetailsScreen = () => {
  const { month } = useLocalSearchParams();
  const { userId } = useAuthContext();

  const expenseQueryData = useQuery(
    api.expenseData.getUsersAllExpenses,
    userId ? { userId } : "skip"
  );

  const filteredExpenses = useMemo(() => {
    if (!expenseQueryData || !month) return [];

    return expenseQueryData.filter((expense) => {
      const date = new Date(expense._creationTime);
      const expenseMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return expenseMonth === month;
    });
  }, [expenseQueryData, month]);

  const totalSpend = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + (e.price || 0), 0);
  }, [filteredExpenses]);

  const grpByCategory = filteredExpenses.reduce<
    Record<string, TCategoryItems[]>
  >((acc, expense) => {
    const categoryKey = expense.category || "Uncategorized";

    const item: TCategoryItems = {
      itemName: expense.itemName,
      price: expense.price,
      _creationTime: expense._creationTime,
    };

    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }

    acc[categoryKey].push(item);

    return acc;
  }, {});

  const groupedArray = Object.entries(grpByCategory).map(
    ([category, items]) => ({
      category,
      items,
    })
  );

  return (
    <SafeAreaView className="flex-1 p-4">
      <View className="flex-row justify-between">
        <Pressable
          onPress={() => router.back()}
          className="bg-white p-2 rounded-xl"
        >
          <Feather name="chevron-left" color={"#000"} size={24} />
        </Pressable>
        <Pressable
          className="bg-white p-2 rounded-xl"
        >
          <Feather name="calendar" color={"#000"} size={24} />
        </Pressable>
      </View>

      <ScrollView className="mt-8">
        <BalanceDetails totalSpend={totalSpend} />

        <View className="mt-6 gap-2">
          {groupedArray.map((c, index) => (
            <CategoryItems key={index} category={c.category} items={c.items} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExpenseDetailsScreen;
