import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";

const ProfileScreen = () => {
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
      <Text className="text-white">Profile</Text>
      <TouchableOpacity className="bg-white my-4" onPress={handleSignOut}>
        <Text>Sign out</Text>
      </TouchableOpacity>

      <Pressable onPress={() => router.push('/createExpenseModal')} className="bg-white p-2 rounded-lg">
        <Text>Add Expense</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ProfileScreen;
