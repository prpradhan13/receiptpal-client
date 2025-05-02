import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthContext } from "@/src/context/AuthProvider";
import DefaultLoader from "@/src/components/loaders/DefaultLoader";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import { DonutChart } from "@/src/components/expenses/DonutChart";
import WeeklyBarChart from "@/src/components/expenses/WeeklyBarChart";
import { TCategoryItems } from "@/src/types/expense.type";
import CategoryItems from "@/src/components/expenses/CategoryItems";
import { getMonthKey } from "@/src/utils/helpingFunc";
import ExpenseMonthModal from "@/src/components/expenses/ExpenseMonthModal";
import AddMoneyModal from "@/src/components/modals/AddMoneyModal";

const Expense = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const { userId, monthlyBalance } = useAuthContext();

  const expenseQueryData = useQuery(
    api.expenseData.getUsersAllExpenses,
    userId ? { userId } : "skip"
  );

  const isLoading = !userId || expenseQueryData === undefined;

  // Group expenses by month
  const groupedExpenses = useMemo(() => {
    if (!expenseQueryData) return [];

    const grpObject = expenseQueryData.reduce<
      Record<string, typeof expenseQueryData>
    >((acc, expense) => {
      const monthKey = getMonthKey(new Date(expense.purchasedAt));

      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }

      acc[monthKey].push(expense);
      return acc;
    }, {});

    return Object.entries(grpObject)
      .sort(([a], [b]) => (dayjs(b).isAfter(dayjs(a)) ? 1 : -1))
      .map(([month, expenses]) => ({
        month,
        expenses,
      }));
  }, [expenseQueryData]);

  // Set default to latest month
  useEffect(() => {
    if (groupedExpenses.length > 0 && !selectedMonth) {
      setSelectedMonth(groupedExpenses[0].month);
    }
  }, [groupedExpenses, selectedMonth]);

  // Filter for selected month
  const filteredExpenses = useMemo(() => {
    if (!expenseQueryData || !selectedMonth) return [];

    return expenseQueryData.filter((expense) => {
      const expenseMonth = getMonthKey(new Date(expense.purchasedAt));
      return expenseMonth === selectedMonth;
    });
  }, [expenseQueryData, selectedMonth]);

  // Group by category
  const grpByCategory = filteredExpenses.reduce<
    Record<string, TCategoryItems[]>
  >((acc, expense) => {
    const categoryKey = expense.category || "Uncategorized";

    const item: TCategoryItems = {
      itemName: expense.itemName,
      price: expense.price,
      purchasedAt: expense.purchasedAt,
    };

    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }

    acc[categoryKey].push(item);

    return acc;
  }, {});

  const categoryArray = Object.entries(grpByCategory).map(
    ([category, items]) => ({
      category,
      items,
    })
  );

  const totalSpend = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + (e.price || 0), 0);
  }, [filteredExpenses]);

  const weeklyBarData = filteredExpenses.map((e) => ({
    price: e.price,
    purchasedAt: e.purchasedAt,
  }));

  const balanceForMonth =
    (selectedMonth && monthlyBalance?.[selectedMonth]) || 0;

  if (isLoading) return <DefaultLoader />;

  return (
    <SafeAreaView className="flex-1 p-3">
      <ScrollView>
        <View className="flex-row justify-between items-center mb-6">
          <Pressable onPress={() => setShowMonthPicker(true)}>
            <Text className="text-[#c2c2c2] font-semibold">
              {dayjs(selectedMonth).format("YYYY")}
            </Text>
            <Text className="text-white font-semibold text-2xl">
              {dayjs(selectedMonth).format("MMMM")}
            </Text>
          </Pressable>

          {/* Balance Details */}
          <View className="justify-center items-center">
            <Text className="text-white text-lg font-semibold">
              {balanceForMonth}
            </Text>
            <View>
              <Text className="text-[#c2c2c2] text-sm font-semibold">
                Total Balance
              </Text>
            </View>
          </View>

          <DonutChart
            total={balanceForMonth}
            spent={totalSpend}
            radius={23}
            strokeWidth={8}
          />
        </View>

        <WeeklyBarChart data={weeklyBarData} />

        <View className="mt-6 gap-2">
          {categoryArray.map((c, index) => (
            <CategoryItems
              key={index}
              category={c.category}
              items={c.items}
              month={selectedMonth}
            />
          ))}
        </View>
      </ScrollView>

      <View>
        {showMonthPicker && (
          <ExpenseMonthModal
            groupedExpenses={groupedExpenses}
            setSelectedMonth={setSelectedMonth}
            setShowMonthPicker={setShowMonthPicker}
            showMonthPicker={showMonthPicker}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Expense;
