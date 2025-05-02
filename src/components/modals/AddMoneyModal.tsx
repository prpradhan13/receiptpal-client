import { View, Text, Modal, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthContext } from "@/src/context/AuthProvider";
import { Id } from "@/convex/_generated/dataModel";

interface AddMoneyModalProps {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
}

const AddMoneyModal = ({
  modalVisible,
  setModalVisible,
}: AddMoneyModalProps) => {
    const { userId } = useAuthContext();
  const [money, setMoney] = useState("");

    const enterBalance = useMutation(api.users.enterBalance);

    const handleSave = async () => {
        const numericMoney = parseFloat(money);

        if (isNaN(numericMoney) || numericMoney <= 0) {
            alert("Please enter a valid positive number.");
            return;
        }
        

        try {
            await enterBalance({
              userId: userId as Id<"users">,
              balance: numericMoney,
            });
        
            setMoney("");
            setModalVisible(false);
          } catch (error) {
            console.error("Error saving balance:", error);
            alert("Something went wrong. Please try again.");
          }
    }

  return (
    <Modal
      visible={modalVisible}
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/70">
        <View className="bg-white rounded-lg p-4 justify-center items-center">
          <Text className="font-medium text-lg text-center">
            How much money you want to add today?
          </Text>
          <TextInput
            keyboardType="numeric"
            value={money}
            onChangeText={(value) => setMoney(value)}
            placeholder="0"
            className="mt-2 text-4xl"
          />

          <Pressable onPress={handleSave} className="bg-black px-4 py-2 rounded-xl">
            <Text className="text-white font-medium text-lg">Save</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default AddMoneyModal;
