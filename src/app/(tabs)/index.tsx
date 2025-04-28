import { Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text className="text-white">Home Screen</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
