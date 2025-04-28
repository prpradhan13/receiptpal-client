import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  
  const [loginLoading, setLoginLoading]= useState(false);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      setLoginLoading(true);
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoginLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator color={"#fff"} size={"large"}/>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 p-4 items-center justify-center">
      <Text className="text-white font-bold text-3xl mb-6">Login</Text>
      <View className="w-full">
        {/* Email Input */}
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          className="text-white p-3 mb-4 rounded-md border border-gray-600 bg-gray-800"
        />

        {/* Password Input */}
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          placeholderTextColor="rgba(255, 255, 255, 0.6)"
          className="text-white p-3 mb-6 rounded-md border border-gray-600 bg-gray-800"
        />

        <TouchableOpacity
          onPress={onSignInPress}
          className="bg-white p-2 rounded-xl items-center"
        >
          {loginLoading ? (
            <View className="flex-row gap-2 items-center">
              <ActivityIndicator color={"#000"} size={22} />
              <Text className="text-lg font-medium">Please wait...</Text>
            </View>
          ): (
            <Text className="text-lg font-medium">Login</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
        <Text className="text-white">Don't have an account? </Text>
        <Link href="/signup">
          <Text className="text-blue-400">Sign up</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
