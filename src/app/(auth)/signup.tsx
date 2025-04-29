import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import React from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, signUpSchema } from "@/src/validation/auth";

const CELL_COUNT = 6;

const SignUpScreen = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  const onSignUpPress = async (data: SignUpFormData) => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: data.emailAddress,
        password: data.password,
        unsafeMetadata: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(main)/(tabs)");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator color={"#fff"} size={"large"} />
      </View>
    );
  }

  if (pendingVerification) {
    const { emailAddress } = getValues();

    return (
      <SafeAreaView className="flex-1 p-4 items-center justify-center">
        <Text className="text-white font-bold text-3xl">Enter PIN</Text>
        <Text className="text-[#c2c2c2] mt-2 text-center">
          Enter your PIN which you get your provided emil address. We send a
          6-digit PIN to {emailAddress}.
        </Text>
        <CodeField
          ref={ref}
          {...props}
          value={code}
          onChangeText={setCode}
          cellCount={CELL_COUNT}
          rootStyle={{ marginTop: 20 }}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              className={`w-14 h-16 rounded-xl border-2 mx-1 mt-4 items-center justify-center ${
                isFocused ? "border-blue-500" : "border-gray-600"
              }`}
            >
              <Text className="text-2xl text-white">
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          onPress={onVerifyPress}
          className="w-full mt-6 p-3 bg-white rounded-xl items-center"
        >
          <Text className="text-lg font-medium">Verify</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 items-center justify-center">
      <Text className="text-white font-bold text-3xl mb-6">Sign up</Text>

      <View className="w-full gap-3">
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                value={value}
                placeholder="First Name"
                onChangeText={onChange}
                autoCapitalize="words"
                placeholderTextColor="rgba(255,255,255,0.6)"
                className="text-white p-3 mb-1 rounded-xl border border-gray-600 bg-gray-800"
              />
              {errors.firstName && (
                <Text className="text-red-400 mb-2">
                  {errors.firstName.message}
                </Text>
              )}
            </>
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                value={value}
                placeholder="Last Name"
                onChangeText={onChange}
                autoCapitalize="words"
                placeholderTextColor="rgba(255,255,255,0.6)"
                className="text-white p-3 mb-1 rounded-xl border border-gray-600 bg-gray-800"
              />
              {errors.lastName && (
                <Text className="text-red-400 mb-2">
                  {errors.lastName.message}
                </Text>
              )}
            </>
          )}
        />
        <Controller
          control={control}
          name="emailAddress"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                value={value}
                placeholder="Email"
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="rgba(255,255,255,0.6)"
                className="text-white p-3 mb-1 rounded-xl border border-gray-600 bg-gray-800"
              />
              {errors.emailAddress && (
                <Text className="text-red-400 mb-2">
                  {errors.emailAddress.message}
                </Text>
              )}
            </>
          )}
        />

        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <>
              <TextInput
                value={value}
                placeholder="Password"
                onChangeText={onChange}
                secureTextEntry
                placeholderTextColor="rgba(255,255,255,0.6)"
                className="text-white p-3 mb-4 rounded-xl border border-gray-600 bg-gray-800"
              />
              {errors.password && (
                <Text className="text-red-400 mb-2">
                  {errors.password.message}
                </Text>
              )}
            </>
          )}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSignUpPress)}
          className="bg-white p-2 rounded-xl items-center"
        >
          <Text className="text-lg font-medium">Continue</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-1 items-baseline mt-4">
        <Text className="text-white">Already have an account?</Text>
        <Link href="/login">
          <Text className="text-blue-400 text-lg">Log in</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
