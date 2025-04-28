import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUpScreen = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    console.log(emailAddress, password);
    try {
      await signUp.create({
        emailAddress,
        password,
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
        router.replace("/(tabs)");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1">
        <Text>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity onPress={onVerifyPress}>
          <Text>Verify</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 items-center">
      <Text className="text-white font-bold text-xl mb-6">Sign up</Text>

      <View className="w-full">
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          className="text-white p-3 mb-4 rounded-xl border border-gray-600 bg-gray-800"
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          className="text-white p-3 mb-4 rounded-xl border border-gray-600 bg-gray-800"
        />
        <TouchableOpacity onPress={onSignUpPress} className="bg-white p-2 rounded-xl items-center">
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
