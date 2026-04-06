import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 px-8 justify-center pt-safe bg-white">
      {/* Header */}
      <View className="mb-10">
        <Text className="text-4xl font-bold text-primary text-center mb-2">
          Create Account
        </Text>
        <Text className="text-base font-semibold text-center leading-6 px-4">
          Create an account so you can explore all the existing jobs
        </Text>
      </View>

      {/* Form Section */}
      <View className="gap-y-4 mb-12">
        <View className="bg-primary/10 p-2 rounded-lg border border-primary/20">
          <TextInput
            placeholder="Email"
            className="text-base"
            placeholderTextColor="#999"
          />
        </View>

        <View className="bg-primary/10 p-2 rounded-lg border border-primary/20">
          <TextInput
            placeholder="Password"
            secureTextEntry
            className="text-base"
            placeholderTextColor="#999"
          />
        </View>

        <View className="bg-primary/10 p-2 rounded-lg border border-primary/20">
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            className="text-base"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Actions */}
      <View className="gap-y-4 mb-10">
        <TouchableOpacity className="bg-primary rounded-lg py-4 shadow-md shadow-black/25">
          <Text className="text-white font-bold text-center text-lg">
            Sign up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
          <Text className="text-sm font-semibold text-center text-gray-700">
            Already have an account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Social Footer */}
      <View className="items-center">
        <Text className="text-sm font-semibold text-primary mb-6">
          Or continue with
        </Text>
        <View className="flex-row gap-x-4">
          {["logo-google", "logo-facebook", "logo-apple"].map((icon) => (
            <TouchableOpacity
              key={icon}
              className="w-14 h-12 rounded-lg bg-gray-100 items-center justify-center border border-gray-200"
            >
              <Ionicons name={icon as any} size={24} color="#303030" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
