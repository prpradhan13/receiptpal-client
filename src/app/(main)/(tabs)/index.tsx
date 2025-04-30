import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUploadReceipt } from "@/src/hooks/useUploadReceipt";
import * as ImagePicker from "expo-image-picker";

const HomeScreen = () => {
  const [selecetdImgUri, setSelectedImgUri] = useState("")
  const { uploadReceipt, isUploading } = useUploadReceipt();

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.assets || result.assets.length === 0) {
      alert("No image selected.");
      console.error("No image selected.");
      return;
    }

    const asset = result.assets[0];

    if (!asset.uri) throw new Error("No asset URI");

    setSelectedImgUri(asset.uri);
  };

  const handleImageCancel = () => {
    setSelectedImgUri("");
  };

  const handleUpload = async () => {
    if (!selecetdImgUri) {
      alert("No Image");
      return;
    }

    try {
      await uploadReceipt(selecetdImgUri);
      setSelectedImgUri("");
      alert("Receipt uploaded!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center p-4">
      <Text className="text-3xl font-bold text-white mb-2">
        Welcome to Receipt Pal 👋
      </Text>
      <Text className="text-[#c2c2c2] text-center mb-6">
        Easily upload your receipts and let our AI automatically categorize and
        organize them for you!
      </Text>

      <View className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm items-center">
        {selecetdImgUri && (
          <View className="w-full h-32 bg-[#c2c2c2] mb-3 rounded-xl flex-row gap-3 p-2 items-center">
            <Image
              source={{ uri: selecetdImgUri }}
              style={{
                width: 80,
                height: "100%",
                borderRadius: 10,
              }}
            />
          </View>
        )}

        {selecetdImgUri ? (
          <>
            <TouchableOpacity
              onPress={handleUpload}
              disabled={isUploading}
              className="bg-blue-500 w-full py-3 rounded-xl justify-center items-center"
            >
              {isUploading ? (
                <View className="flex-row items-center gap-x-2">
                  <ActivityIndicator color={"#fff"} size="small" />
                  <Text className="text-white font-semibold text-lg">
                    Uploading...
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-semibold text-lg">
                  Upload Receipt
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleImageCancel}
              disabled={isUploading}
              className="border-2 rounded-xl mt-3 w-full py-2 justify-center items-center"
            >
              <Text className="text-black font-semibold text-lg">Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={handlePickImage}
            disabled={isUploading}
            className="bg-blue-500 w-full py-3 rounded-xl justify-center items-center"
          >
            <Text className="text-white font-semibold text-lg">
              Select Receipt
            </Text>
          </TouchableOpacity>
        )}

        <Text className="text-gray-500 text-sm mt-3">
          Takes just a few seconds 🚀
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
