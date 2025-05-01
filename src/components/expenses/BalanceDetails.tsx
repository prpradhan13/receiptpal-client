import { AnimatedCircle } from "@/src/constants/Animation";
import { useAuthContext } from "@/src/context/AuthProvider";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Svg, { G, Circle } from "react-native-svg";
import { DonutChart } from "./DonutChart";

const BalanceDetails = ({ totalSpend, month }: { totalSpend: number, month: string }) => {
  const { monthlyBalance } = useAuthContext();

  const totalBalance = month ? monthlyBalance[month] || 0 : 0;
  const remaining = totalBalance - totalSpend;

  return (
    <View className="flex-row justify-between items-center">
      <View>
        <Text className="text-[#c2c2c2] text-xl font-medium">My Balance</Text>

        <View className="mt-2">
          <Text className="text-3xl font-bold text-white">${remaining}</Text>
          <View className="flex-row gap-1 items-center">
            <Feather name="minus" size={20} color="#ef4444" />
            <Text className="text-xl font-bold text-white">${totalSpend}</Text>
          </View>
        </View>
      </View>

      <DonutChart spent={totalSpend} total={totalBalance} />
    </View>
  );
};

export default BalanceDetails;
