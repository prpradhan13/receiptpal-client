import { AnimatedCircle } from "@/src/constants/Animation";
import { View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

export const DonutChart = ({
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
    </View>
  );
};