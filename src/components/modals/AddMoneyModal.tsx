import { View, Text, Modal, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthContext } from "@/src/context/AuthProvider";
import { Id } from "@/convex/_generated/dataModel";
import dayjs from "dayjs";
import DateTimePicker from "@react-native-community/datetimepicker";
import Feather from "@expo/vector-icons/Feather";

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
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to the current date
  const [showDatePicker, setShowDatePicker] = useState(false);

  const enterBalance = useMutation(api.users.enterBalance);

  const handleSave = async () => {
    const numericMoney = parseFloat(money);

    if (isNaN(numericMoney) || numericMoney <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    const timestamp = selectedDate.getTime();

    try {
      await enterBalance({
        userId: userId as Id<"users">,
        balance: numericMoney,
        month: timestamp,
      });

      setMoney("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving balance:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate); // Update the selected date
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/70">
        <View className="bg-white rounded-lg p-4 ">
          <View className="justify-center items-center">
            <Text className="font-medium text-lg text-center">
              How much money you want to add?
            </Text>
            <TextInput
              keyboardType="numeric"
              value={money}
              onChangeText={(value) => setMoney(value)}
              placeholder="0"
              className="mt-2 text-4xl"
            />

            <Pressable
              onPress={() => setShowDatePicker(true)} // Show the date picker when pressed
              className="mt-4 bg-gray-200 px-4 py-2 rounded-lg flex-row items-center gap-3"
            >
              <Feather name="calendar" size={24} />
              <Text className="text-black font-medium text-lg">
                {dayjs(selectedDate).format("DD MMMM YYYY")}
              </Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          <View className="flex-row gap-3 mt-4">
            <Pressable
              onPress={() => setModalVisible(false)}
              className="border px-4 py-2 rounded-xl w-[48.5%]"
            >
              <Text className="font-medium text-lg text-center">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              className="bg-black px-4 py-2 rounded-xl w-[48.5%]"
            >
              <Text className="text-white font-medium text-lg text-center">Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddMoneyModal;
