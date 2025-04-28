import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import AuthProvider from "@/src/context/AuthProvider";

const MainLayout = () => {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
};

export default MainLayout;
