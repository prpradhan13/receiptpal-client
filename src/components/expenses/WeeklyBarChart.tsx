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
    _creationTime: number;
  }[];
}

const WeeklyBarChart = ({ data }: WeeklyBarChartProps) => {
  const [weekIndex, setWeekIndex] = useState(0);

  const weeksWithData = useMemo(() => {
    const map = new Map<string, typeof data>();

    data.forEach((item) => {
      const timestamp = Math.floor(item._creationTime);
      const weekStart = dayjs(timestamp).startOf("isoWeek").toISOString();
      if (!map.has(weekStart)) {
        map.set(weekStart, []);
      }
      map.get(weekStart)?.push(item);
    });

    return Array.from(map.entries()).sort(
      ([a], [b]) => dayjs(a).valueOf() - dayjs(b).valueOf()
    );
  }, [data]);

  const currentWeekStart = useMemo(() => {
    if (!weeksWithData.length) return dayjs().startOf("isoWeek");
    return dayjs(weeksWithData[weekIndex][0]);
  }, [weekIndex, weeksWithData]);

  const currentWeekData = useMemo(() => {
    return weeksWithData[weekIndex]?.[1] ?? [];
  }, [weekIndex, weeksWithData]);

  const rangeStart = currentWeekStart;
  const rangeEnd = currentWeekStart.endOf("isoWeek");

  const barData = useMemo(() => {
    const dayTotals = Array(7).fill(0);

    currentWeekData.forEach((item) => {
      const index = dayjs(item._creationTime).isoWeekday() - 1;
      dayTotals[index] += item.price;
    });

    const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

    return dayTotals.map((value, i) => ({
      label: dayLabels[i],
      value,
      frontColor: "#177AD5",
    }));
  }, [currentWeekData]);

  return (
    <View className="bg-[#2a2a2a] p-2 rounded-xl mt-6">
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
        xAxisLabelTextStyle={{ color: '#fff' }}
        yAxisTextStyle={{ color: '#fff' }}
      />

      <View className="flex-row justify-between mt-4">
        <Pressable
          onPress={() => setWeekIndex((i) => i - 1)}
          disabled={weekIndex === 0}
          className={`${weekIndex === 0 ? "opacity-[0.4]" : "optional-[1]"} bg-[#c2c2c2] p-1 rounded-full`}
        >
          <Feather name="chevron-left" size={24} />
        </Pressable>

        <Pressable
          onPress={() => setWeekIndex((i) => i + 1)}
          disabled={weekIndex === weeksWithData.length - 1}
          className={`${weekIndex === weeksWithData.length - 1 ? "opacity-[0.4]" : "optional-[1]"} bg-[#c2c2c2] p-1 rounded-full`}
        >
          <Feather name="chevron-right" size={24} />
        </Pressable>
      </View>
    </View>
  );
};

export default WeeklyBarChart;
