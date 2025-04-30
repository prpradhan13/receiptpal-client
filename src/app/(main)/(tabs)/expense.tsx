import { View, Text, FlatList } from "react-native";
import React, { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthContext } from "@/src/context/AuthProvider";
import DefaultLoader from "@/src/components/loaders/DefaultLoader";
import { Stack } from "expo-router";
import CardsByMonthly from "@/src/components/expenses/CardsByMonthly";

const Expense = () => {
  const { userId } = useAuthContext();
  const expenseQueryData = useQuery(
    api.expenseData.getUsersAllExpenses,
    userId ? { userId } : "skip"
  );
  const isLoading = !userId || expenseQueryData === undefined;

  const groupedExpenses = useMemo(() => {
    if (!expenseQueryData) return [];

    const grpObject = expenseQueryData.reduce<
      Record<string, typeof expenseQueryData>
    >((acc, expense) => {
      const date = new Date(expense._creationTime);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }

      acc[monthKey].push(expense);
      return acc;
    }, {});
    
    // Transform to array
    return Object.entries(grpObject).map(([month, expenses]) => ({
      month,
      expenses,
    }));
  }, [expenseQueryData]);

  if (isLoading) return <DefaultLoader />;

  return (
    <View className="flex-1 px-4">
      <Stack.Screen options={{ headerShown: true, headerTitle: "2025" }} />
      <FlatList
        data={groupedExpenses}
        keyExtractor={(item) => item.month}
        renderItem={({ item }) => <CardsByMonthly monthItems={item} />}
      />
    </View>
  );
};

export default Expense;
