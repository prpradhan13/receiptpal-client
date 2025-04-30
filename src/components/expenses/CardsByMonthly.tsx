import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import { MonthExpenseType } from "@/src/types/expense.type";
import dayjs from "dayjs";

interface CardsByMonthlyProps {
  monthItems: MonthExpenseType;
}

const CardsByMonthly = ({ monthItems }: CardsByMonthlyProps) => {

    const totalMoneySpend = monthItems.expenses.reduce((acc, item) => {
        acc += item.price

        return acc;
    }, 0)

  return (
    <TouchableOpacity className="bg-gray-800 p-3 rounded-xl w-full h-36">
      <Text className="text-white text-2xl font-medium">
        {dayjs(monthItems.month).format('MMMM')}
      </Text>
      <Text className="text-[#c2c2c2] font-medium text-lg">Total Spend: {totalMoneySpend}</Text>
    </TouchableOpacity>
  );
};

export default CardsByMonthly;
