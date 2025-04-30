import { AnimatedCircle } from "@/src/constants/Animation";
import { useAuthContext } from "@/src/context/AuthProvider";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Svg, { G, Circle } from "react-native-svg";

const BalanceDetails = ({ totalSpend }: { totalSpend: number }) => {
  const { userBalance } = useAuthContext();
  const totalBalance = userBalance?.balance ?? 0;
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

const DonutChart = ({
  radius = 60,
  strokeWidth = 10,
  spent,
  total,
}: {
  radius?: number;
  strokeWidth?: number;
  spent: number;
  total: number;
}) => {
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const percent = (spent / total) * 100;
  const strokeDashoffset =
    circumference - (circumference * Math.min(percent, 100)) / 100;

  return (
    <View>
      <Svg height={radius * 2} width={radius * 2}>
        <G rotation="-90" origin={`${radius}, ${radius}`}>
          {/* Background circle */}
          <Circle
            stroke="#3f3f46"
            fill="transparent"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeWidth={strokeWidth}
          />

          {/* Spent arc */}
          <AnimatedCircle
            stroke="#ef4444"
            fill="transparent"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <TextInput
        underlineColorAndroid="transparent"
        editable={false}
        defaultValue={String(total)}
        style={[
          StyleSheet.absoluteFillObject,
          { fontSize: radius / 4, color: "#fff" },
          { fontWeight: "900", textAlign: "center" },
        ]}
      />
    </View>
  );
};

export default BalanceDetails;
