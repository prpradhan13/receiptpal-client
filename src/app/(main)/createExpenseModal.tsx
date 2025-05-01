import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useForm, Controller } from "react-hook-form";
import {
  TCreateExpenseSchema,
  createExpenseSchema,
} from "@/src/validation/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { categoryColorMap } from "@/src/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthContext } from "@/src/context/AuthProvider";
import { Id } from "@/convex/_generated/dataModel";

const categories = Object.keys(categoryColorMap);

const CreateExpenseModal = () => {
  const { user } = useAuthContext();
  const userId = user?._id;
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openCategoryBox, setOpenCategoryBox] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const createExpense = useMutation(api.expenseData.createExpense)

  const {
    control,
    reset,
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
  } = useForm<TCreateExpenseSchema>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      category: "",
      itemName: "",
      quantity: "",
      price: 0,
      purchasedAt: "",
      notes: ""
    },
  });

  useEffect(() => {
    if (selectedCategory) {
      setValue("category", selectedCategory);
    }
  }, [selectedCategory]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setOpenCategoryBox(false);
  };

  const handleSave = async (data: TCreateExpenseSchema) => {
    if (!userId) {
      alert("User id is missing!");
      return;
    }

    const quantity = parseInt(data.quantity || "1", 10);
    const total = data.price * quantity;

    const payload = {
      ...data,
      userId: userId as Id<"users">,
      quantity: data.quantity || "1",
      total,
      purchasedAt: Number(data.purchasedAt),
      notes: data.notes ?? "",
    };

    try {
      await createExpense(payload);
      reset();
      router.back();
    } catch (error) {
      console.error("Error creating expense:", error);
      // Optionally show a toast or alert
    }

    reset();
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 p-4">
      <View className="flex-row justify-between">
        <Pressable
          onPress={() => router.back()}
          className="bg-white p-2 rounded-xl"
        >
          <Feather name="x" size={22} />
        </Pressable>
        <Pressable
          onPress={handleSubmit(handleSave)}
          className="bg-white p-2 rounded-xl"
        >
          <Feather name="check" size={22} />
        </Pressable>
      </View>

      <Text className="text-white font-bold text-3xl mt-6 mb-4">
        Create Expense
      </Text>

      <ScrollView className="">
        {/* Category Selector */}
        <View>
          <Text className="text-white text-xl">Category</Text>
          <View className="relative">
            <Pressable
              onPress={() => setOpenCategoryBox(true)}
              className="bg-[#3d3d3d] rounded-xl px-4 py-3"
            >
              <Text className="text-white capitalize">
                {selectedCategory || "Select one"}
              </Text>
            </Pressable>

            {openCategoryBox && (
              <View className="bg-[#c2c2c2] w-52 p-3 rounded-xl absolute z-50 top-12 gap-2">
                {categories.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => handleSelectCategory(cat)}
                    className={`px-3 py-2 rounded-xl ${selectedCategory === cat ? "border-2 border-white" : ""}`}
                    style={{ backgroundColor: categoryColorMap[cat] }}
                  >
                    <Text className="text-black font-semibold capitalize">
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
            {errors.category && (
              <Text className="text-red-500">{errors.category.message}</Text>
            )}
          </View>
        </View>

        <View>
          <Text className="text-white text-xl">Item Name</Text>
          <Controller
            control={control}
            name="itemName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Item Name"
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                className="bg-[#3d3d3d] rounded-xl px-4 py-3 text-white"
              />
            )}
          />
          {errors.itemName && (
            <Text className="text-red-500">{errors.itemName.message}</Text>
          )}
        </View>

        <View>
          <Text className="text-white text-xl">Quantity (Optional)</Text>
          <Controller
            control={control}
            name="quantity"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Quantity (default 1)"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={value}
                onChangeText={onChange}
                className="bg-[#3d3d3d] text-white rounded-xl px-4 py-3"
              />
            )}
          />
        </View>

        <View>
          <Text className="text-white text-xl">Price</Text>
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Price"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                className="bg-[#3d3d3d] text-white rounded-xl px-4 py-3"
              />
            )}
          />
          {errors.price && (
            <Text className="text-red-500">{errors.price.message}</Text>
          )}
        </View>

        <View>
          <Text className="text-white text-xl">Purchased At</Text>
          <Controller
            control={control}
            name="purchasedAt"
            render={({ field: { value, onChange } }) => {
              const handleDateChange = (event: any, selectedDate?: Date) => {
                if (event.type === "set" && selectedDate) {
                  onChange(selectedDate.getTime().toString()); // update form value
                  setShowDatePicker(false);
                } else if (event.type === "dismissed") {
                  setShowDatePicker(false);
                }
              };

              return (
                <>
                  <View className="bg-[#3d3d3d] rounded-md p-3 flex flex-row items-center justify-between mb-2">
                    <Text className="text-white">
                      {value
                        ? new Date(Number(value)).toLocaleDateString()
                        : "Select Date"}
                    </Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                      <Feather name="calendar" size={24} color="#CFCFCF" />
                    </TouchableOpacity>
                  </View>

                  {showDatePicker && (
                    <DateTimePicker
                      value={value ? new Date(Number(value)) : new Date()}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                </>
              );
            }}
          />
          {errors.purchasedAt && (
            <Text className="text-red-500">{errors.purchasedAt.message}</Text>
          )}
        </View>

        <View>
          <Text className="text-white text-xl">Purchased At</Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <TextInput
                multiline
                placeholder="Any notes"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={value?.toString()}
                onChangeText={(text) => onChange(text)}
                className="bg-[#3d3d3d] text-white rounded-xl px-4 py-3"
              />
            )}
          />
          {errors.notes && (
            <Text className="text-red-500">{errors.notes.message}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateExpenseModal;
