import { View, Text } from "react-native";
import React from "react";
import dayjs from "dayjs";
import { ReceiptExpenseType } from "@/src/types/expense.type";
import { categoryData } from "@/src/constants/Colors";
import { formatCurrency } from "@/src/utils/helpingFunc";

interface TransactionListProps {
  transaction: ReceiptExpenseType;
}

const TransactionList = ({ transaction }: TransactionListProps) => {
  const transactionDate = dayjs(transaction.purchasedAt).format("DD MMMM YY");
  const cData = categoryData.filter((c) => c.cName === transaction.category);
  const IconComponent = cData[0].iconComponent;

  return (
    <View
      key={transaction._id}
      className="flex-row justify-between items-center mb-4"
    >
      <View className="flex-row items-center gap-5">
        <View className="rounded-full">
          {IconComponent && (
            <IconComponent
              {...cData[0].iconProps}
              name={cData[0].iconProps?.name as any}
              color={cData[0].color}
            />
          )}
        </View>

        <View className="w-[69%]">
          <Text className="text-white text-xl font-medium capitalize">
            {transaction.itemName}
          </Text>
          <Text className="text-[#c2c2c2]">{transactionDate}</Text>
        </View>
      </View>

      <Text className="text-white text-lg font-medium">
        -{formatCurrency(transaction.total)}
      </Text>
    </View>
  );
};

export default TransactionList;
