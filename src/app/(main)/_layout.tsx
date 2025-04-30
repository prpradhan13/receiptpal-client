import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import AuthProvider from "@/src/context/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const MainLayout = () => {
  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="expenses" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default MainLayout;
