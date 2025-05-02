import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useForm, Controller } from "react-hook-form";
import {
  TCreateExpenseSchema,
  createExpenseSchema,
} from "@/src/validation/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { categoryColorMap, categoryData } from "@/src/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuthContext } from "@/src/context/AuthProvider";
import { Id } from "@/convex/_generated/dataModel";
import {
  _entering,
  _exiting,
  _layout,
  AnimatedPressable,
} from "@/src/constants/Animation";

const categoryMap = Object.fromEntries(
  categoryData.map((cat) => [cat.cName, cat])
);

const CreateExpenseModal = () => {
  const { user } = useAuthContext();
  const userId = user?._id;
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryData, setSelectedCategoryData] = useState<
    (typeof categoryData)[0] | null
  >(null);
  const [openCategoryBox, setOpenCategoryBox] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const createExpense = useMutation(api.expenseData.createExpense);

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<TCreateExpenseSchema>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      category: "",
      itemName: "",
      quantity: "",
      price: 0,
      purchasedAt: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (selectedCategory) {
      setValue("category", selectedCategory);
    }
  }, [selectedCategory]);

  const handleSelectCategory = (categoryName: string) => {
    const data = categoryMap[categoryName];
    setSelectedCategory(categoryName);
    setSelectedCategoryData(data);
    setOpenCategoryBox(false);
  };

  const watchedPrice = watch("price");
  const watchedQuantity = watch("quantity");
  const total = (parseFloat(watchedQuantity || "1") || 1) * (watchedPrice || 0);

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

      <ScrollView className="mt-5">
        <View className="flex-row items-center justify-between w-full">
          <View className="w-[48.5%] relative">
            <AnimatedPressable
              layout={_layout}
              onPress={() => setOpenCategoryBox((prev) => !prev)}
              className="rounded-2xl p-4"
              style={{
                backgroundColor: selectedCategoryData?.color || "#3d3d3d",
              }}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  {selectedCategoryData?.iconComponent &&
                    React.createElement(selectedCategoryData.iconComponent, {
                      ...selectedCategoryData.iconProps,
                      name: selectedCategoryData.iconProps.name as any,
                      color: "#fff"
                    })}
                  <Text className="text-white capitalize text-lg font-medium">
                    {selectedCategory || "Select one"}
                  </Text>
                </View>
                <Feather name="chevron-down" size={24} color={"#fff"} />
              </View>
            </AnimatedPressable>

            {openCategoryBox && (
              <View className="absolute top-full left-0 w-full mt-2 z-20 bg-white rounded-xl overflow-hidden">
                {categoryData.map((cat) => {
                  const IconComponent = cat.iconComponent;
                  return (
                    <AnimatedPressable
                      entering={_entering}
                      layout={_layout}
                      key={cat.cName}
                      onPress={() => handleSelectCategory(cat.cName)}
                      className={`px-3 py-2 flex-row items-center gap-2 ${
                        selectedCategory === cat.cName
                          ? "bg-gray-200"
                          : "bg-white"
                      }`}
                    >
                      {IconComponent && (
                        <IconComponent
                          {...cat.iconProps}
                          name={cat.iconProps?.name as any}
                        />
                      )}
                      <Text className="text-black font-semibold capitalize">
                        {cat.cName}
                      </Text>
                    </AnimatedPressable>
                  );
                })}
              </View>
            )}

            {errors.category && (
              <Text className="text-red-500">{errors.category.message}</Text>
            )}
          </View>

          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="w-[48.5%] rounded-2xl p-4 bg-[#3d3d3d]"
          >
            <Controller
              control={control}
              name="purchasedAt"
              render={({ field: { value, onChange } }) => {
                const handleDateChange = (event: any, selectedDate?: Date) => {
                  if (event.type === "set" && selectedDate) {
                    onChange(selectedDate.getTime().toString());
                    setShowDatePicker(false);
                  } else if (event.type === "dismissed") {
                    setShowDatePicker(false);
                  }
                };

                return (
                  <>
                    <View className="bg-[#3d3d3d] rounded-md flex flex-row items-center justify-between">
                      <Text className="text-white text-lg font-medium">
                        {value
                          ? new Date(Number(value)).toLocaleDateString()
                          : "Select Date"}
                      </Text>
                      <Feather name="calendar" size={24} color="#CFCFCF" />
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
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between w-full mt-4">
          <View className="w-[48.5%]">
            <Text className="text-white">Quantity (Optional)</Text>
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
                  className="bg-[#3d3d3d] text-white rounded-2xl p-4 h-14"
                />
              )}
            />
          </View>

          <View className="w-[48.5%]">
            <Text className="text-white">Price</Text>
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
                  className="bg-[#3d3d3d] text-white rounded-2xl p-4 h-14"
                />
              )}
            />
            {errors.price && (
              <Text className="text-red-500">{errors.price.message}</Text>
            )}
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-white">Item Name</Text>
          <Controller
            control={control}
            name="itemName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Item Name"
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                className="bg-[#3d3d3d] rounded-2xl p-4 text-white"
              />
            )}
          />
          {errors.itemName && (
            <Text className="text-red-500">{errors.itemName.message}</Text>
          )}
        </View>

        <View className="mt-8 justify-center items-center">
          <Text className="text-[#c2c2c2]">Total</Text>
          <Text className="text-5xl text-white mt-2">
            {total}
          </Text>
        </View>

        <View className="justify-center items-center">
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <TextInput
                multiline
                placeholder="Any notes"
                placeholderTextColor="#9ca3af"
                value={value?.toString()}
                onChangeText={(text) => onChange(text)}
                className="text-white rounded-xl px-4 py-3 text-lg" 
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
