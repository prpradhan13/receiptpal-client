import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClerk } from "@clerk/clerk-expo";

const HomeScreen = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text className="text-white">Home Screen</Text>
      <TouchableOpacity className="bg-white mt-4 " onPress={handleSignOut}>
        <Text>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
