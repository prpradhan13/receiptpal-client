import { ActivityIndicator, Button, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClerk, useAuth } from "@clerk/clerk-expo";
import { useUploadReceipt } from "@/src/hooks/useUploadReceipt";

const HomeScreen = () => {
  const { signOut } = useClerk();
  const { userId } = useAuth();
  const { uploadReceipt, isUploading } = useUploadReceipt();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleUpload = async () => {
    if (!userId) throw new Error("User id can not get");
    
    try {
      await uploadReceipt();
      alert("Receipt uploaded!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text className="text-white">Home Screen</Text>
      <TouchableOpacity className="bg-white my-4" onPress={handleSignOut}>
        <Text>Sign out</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleUpload} className="bg-white w-36 p-2 justify-center items-center rounded-xl">
        {isUploading ? (
          <ActivityIndicator color={"#000"} size={22} />
        ) : (
          <Text className="font-medium text-lg">Upload Receipt</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
