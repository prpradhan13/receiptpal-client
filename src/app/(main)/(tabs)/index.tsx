import {
  View,
  Text,
  Pressable,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "@/src/context/AuthProvider";
import Feather from "@expo/vector-icons/Feather";
import { formatCurrency } from "@/src/utils/helpingFunc";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DefaultLoader from "@/src/components/loaders/DefaultLoader";
import { useTransactionStore } from "@/src/store/TransactionStore";

const HomeScreen = () => {
  const { userId, user, userTotalBalance } = useAuthContext();
  const { userAllTransactionAmount, setAllExpenses } = useTransactionStore();

  const expenseQueryData = useQuery(
    api.expenseData.getUsersAllExpenses,
    userId ? { userId } : "skip"
  );

  const isLoading = !userId || expenseQueryData === undefined;

  useEffect(() => {
    if (expenseQueryData) {
      setAllExpenses(expenseQueryData);
    }
  }, [expenseQueryData]);

  const userRestBalance = userTotalBalance - userAllTransactionAmount;

  if (isLoading) return <DefaultLoader />;

  return (
    <SafeAreaView className="flex-1 p-4">
      {/* User Profile Details */}
      <View className="flex-row justify-between">
        <View>
          <Text className="text-white text-2xl">Hii,</Text>
          <Text className="text-white text-2xl font-medium">{user?.name}</Text>
        </View>

        <Feather name="bell" size={24} color={"#fff"} />
      </View>

      <View className="bg-[#fff] rounded-xl p-3 flex-row justify-between items-center my-4">
        <View>
          <Text className="font-medium text-lg">Total Savings</Text>
          <Text className="text-5xl font-semibold">
            {formatCurrency(userRestBalance)}
          </Text>
        </View>
        <Pressable className="rounded-full bg-[#000] p-3">
          <Feather name="plus" color={"#fff"} size={26} />
        </Pressable>
      </View>

    </SafeAreaView>
  );
};

export default HomeScreen;
