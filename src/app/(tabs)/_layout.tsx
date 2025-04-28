import React from "react";
import { Redirect, Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "@clerk/clerk-expo";

const TabLayout = () => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/login"} />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
