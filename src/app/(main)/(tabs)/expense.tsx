import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
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
import Feather from "@expo/vector-icons/Feather";
import BalanceDropdown from "@/src/components/expenses/BalanceDropdown";
import { formatCurrency } from "@/src/utils/helpingFunc";
import { _layout, AnimatedPressable } from "@/src/constants/Animation";
import { useTransactionStore } from "@/src/store/TransactionStore";
import {
  groupedExpensesFunc,
  grpByCategoryReducer,
} from "@/src/utils/expenseHelper";

const Expense = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [openBalanceCategoryBox, setOpenBalanceCategoryBox] = useState(false);

  const { userId, monthlyBalance } = useAuthContext();
  const { allExpenses: expenseQueryData } = useTransactionStore();

  const balanceForMonth =
    (selectedMonth && monthlyBalance?.[selectedMonth]) || 0;

  const [showBalance, setShowBalance] = useState(balanceForMonth);

  const isLoading = !userId || expenseQueryData === undefined;

  // Group expenses by month
  const groupedExpenses = useMemo(
    () => groupedExpensesFunc(expenseQueryData),
    [expenseQueryData]
  );

  useEffect(() => {
    if (groupedExpenses.length > 0 && !selectedMonth) {
      setSelectedMonth(groupedExpenses[0].month);
    }
  }, [groupedExpenses, selectedMonth]);

  useEffect(() => {
    if (selectedMonth) {
      setShowBalance(balanceForMonth);
    }
  }, [selectedMonth]);

  const filteredExpenses = useMemo(() => {
    if (!expenseQueryData || !selectedMonth) return [];

    return expenseQueryData.filter((expense) => {
      const expenseMonth = getMonthKey(new Date(expense.purchasedAt));
      return expenseMonth === selectedMonth;
    });
  }, [expenseQueryData, selectedMonth]);

  const grpByCategory = filteredExpenses.reduce<Record<string, TCategoryItems[]>>(grpByCategoryReducer, {});

  const categoryArray = Object.entries(grpByCategory).map(
    ([category, items]) => ({
      category,
      items,
    })
  );

  const totalSpend = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + (e.total || 0), 0);
  }, [filteredExpenses]);

  const remainingBalance = balanceForMonth - totalSpend;

  const weeklyBarData = filteredExpenses.map((e) => ({
    price: e.total,
    purchasedAt: e.purchasedAt,
  }));

  if (isLoading || (groupedExpenses.length > 0 && !selectedMonth))
    return <DefaultLoader />;

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
          <View className="relative">
            <AnimatedPressable
              layout={_layout}
              onPress={() => setOpenBalanceCategoryBox((prev) => !prev)}
              className="justify-center items-center"
            >
              <Text className="text-white text-lg font-semibold">
                {formatCurrency(showBalance)}
              </Text>
              <View className="flex-row gap-1 items-center">
                <Text className="text-[#c2c2c2] text-sm font-semibold">
                  This month
                </Text>

                <Feather name="chevron-down" color={"#c2c2c2"} size={14} />
              </View>
            </AnimatedPressable>

            {openBalanceCategoryBox && (
              <BalanceDropdown
                monthlyBalance={balanceForMonth}
                remainingBalance={remainingBalance}
                setShowBalance={setShowBalance}
                closeDropdown={() => setOpenBalanceCategoryBox(false)}
              />
            )}
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
