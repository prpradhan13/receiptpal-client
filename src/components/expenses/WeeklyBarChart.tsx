import { View, Text, Pressable } from "react-native";
import React, { useMemo, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import Feather from "@expo/vector-icons/Feather";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);
dayjs.extend(isoWeek);

interface WeeklyBarChartProps {
  data: {
    price: number;
    purchasedAt: number;
  }[];
}

const WeeklyBarChart = ({ data }: WeeklyBarChartProps) => {
  const [monthIndex, setMonthIndex] = useState(0);

  const monthsWithData = useMemo(() => {
    const map = new Map<string, typeof data>();

    data.forEach((item) => {
      const timestamp = Math.floor(item.purchasedAt);
      const monthStart = dayjs(timestamp).startOf("month").toISOString();
      if (!map.has(monthStart)) {
        map.set(monthStart, []);
      }
      map.get(monthStart)?.push(item);
    });

    return Array.from(map.entries()).sort(
      ([a], [b]) => dayjs(a).valueOf() - dayjs(b).valueOf()
    );
  }, [data]);

  const currentMonthStart = useMemo(() => {
    if (!monthsWithData.length) return dayjs().startOf("month");
    return dayjs(monthsWithData[monthIndex][0]);
  }, [monthIndex, monthsWithData]);

  const currentMonthData = useMemo(() => {
    return monthsWithData[monthIndex]?.[1] ?? [];
  }, [monthIndex, monthsWithData]);

  const rangeStart = currentMonthStart;
  const rangeEnd = currentMonthStart.endOf("month");

  const barData = useMemo(() => {
    const dayTotals = Array(rangeEnd.date()).fill(0);

    currentMonthData.forEach((item) => {
      const dayOfMonth = dayjs(item.purchasedAt).date() - 1;
      dayTotals[dayOfMonth] += item.price;
    });

    return dayTotals.map((value, i) => ({
      label: `${i + 1}`,
      value,
      frontColor: "#177AD5",
    }));
  }, [currentMonthData, rangeEnd]);

  return (
    <View className="bg-[#2a2a2a] p-2 rounded-xl">
      <Text className="text-2xl font-bold mb-4 text-white">
        {rangeStart.format("MMM D")} - {rangeEnd.format("MMM D")}
      </Text>

      <BarChart
        barWidth={22}
        noOfSections={4}
        barBorderRadius={4}
        frontColor="lightgray"
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        xAxisLabelTextStyle={{ color: "#fff" }}
        yAxisTextStyle={{ color: "#fff" }}
      />

      <View className="flex-row justify-between mt-4">
        <Pressable
          onPress={() => setMonthIndex((i) => i - 1)}
          disabled={monthIndex === 0}
          className={`${monthIndex === 0 ? "opacity-[0.4]" : "optional-[1]"} bg-[#c2c2c2] p-1 rounded-full`}
        >
          <Feather name="chevron-left" size={24} />
        </Pressable>

        <Pressable
          onPress={() => setMonthIndex((i) => i + 1)}
          disabled={monthIndex === monthsWithData.length - 1}
          className={`${monthIndex === monthsWithData.length - 1 ? "opacity-[0.4]" : "optional-[1]"} bg-[#c2c2c2] p-1 rounded-full`}
        >
          <Feather name="chevron-right" size={24} />
        </Pressable>
      </View>
    </View>
  );
};

export default WeeklyBarChart;
