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
          <Stack.Screen name="allTransactions" options={{ title: "All Tansactions" }} />
          <Stack.Screen
            name="createExpenseModal"
            options={{ headerShown: false, presentation: "modal", animation: "fade_from_bottom" }}
          />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default MainLayout;
