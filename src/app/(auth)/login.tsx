import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
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
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 items-center">
      <Text className="text-white font-bold text-xl mb-6">Login</Text>
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
          <Text className="text-lg font-medium">Login</Text>
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
