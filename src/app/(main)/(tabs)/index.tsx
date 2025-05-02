import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "@/src/context/AuthProvider";
import Feather from "@expo/vector-icons/Feather";
import { formatCurrency } from "@/src/utils/helpingFunc";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DefaultLoader from "@/src/components/loaders/DefaultLoader";
import { useTransactionStore } from "@/src/store/TransactionStore";
import TransactionList from "@/src/components/home/TransactionList";
import AddMoneyModal from "@/src/components/modals/AddMoneyModal";
import { Link } from "expo-router";

const HomeScreen = () => {
  const [addMoneyModalVisible, setAddMoneyModalVisible] = useState(false);

  const { userId, user, userTotalBalance } = useAuthContext();
  const { userAllTransactionAmount, setAllExpenses } = useTransactionStore();
  const { allExpenses } = useTransactionStore();

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
    <SafeAreaView className="flex-1 px-4 pt-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl">Hii,</Text>
            <Text className="text-white text-2xl font-medium">
              {user?.name}
            </Text>
          </View>

          <Feather name="bell" size={24} color={"#fff"} />
        </View>

        <View className="bg-[#fff] rounded-xl p-4 h-32 flex-row justify-between items-center my-4">
          <View>
            <Text className="font-medium text-lg">Total Savings</Text>
            <Text className="text-4xl font-semibold">
              {formatCurrency(userRestBalance ?? 0)}
            </Text>
          </View>

          <Pressable
            onPress={() => setAddMoneyModalVisible(true)}
            className="rounded-full bg-[#000] p-3"
          >
            <Feather name="plus" color={"#fff"} size={26} />
          </Pressable>
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between">
            <Text className="text-[#e8e8e8] text-lg font-medium">Transactions</Text>
            <Link href={"/allTransactions"} asChild>
              <Text className="text-[#ffffff] text-lg font-medium">See all</Text>
            </Link>
          </View>

          <View className="mt-4">
            {!allExpenses || allExpenses.length === 0 ? (
              <View>
                <Text className="text-white text-center">No Transactions</Text>
              </View>
            ) : (
              allExpenses
                .slice(0, 10)
                .map((transaction) => (
                  <TransactionList
                    key={transaction._id}
                    transaction={transaction}
                  />
                ))
            )}
          </View>
        </View>
      </ScrollView>

      {addMoneyModalVisible && (
        <View className="absolute top-0 left-0 right-0">
          <AddMoneyModal
            modalVisible={addMoneyModalVisible}
            setModalVisible={setAddMoneyModalVisible}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
