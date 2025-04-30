import "../global.css";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import ConvexClerkProvidder from "../providers/ConvexClerkProvider";
import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, View } from "react-native";
import DefaultLoader from "../components/loaders/DefaultLoader";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ConvexClerkProvidder>
      <Layout />
    </ConvexClerkProvidder>
  );
}

const Layout = () => {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <ThemeProvider value={DarkTheme}>
        <DefaultLoader />
        <StatusBar style="light" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
};
