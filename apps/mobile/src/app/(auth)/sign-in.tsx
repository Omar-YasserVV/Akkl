import { useAuth } from "@/context/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SignInScreen() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setApiError(null);
      await login(data);
    } catch (err: any) {
      setApiError(
        err?.response?.data?.message || err?.message || "Failed to sign in.",
      );
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-8 pt-safe relative">
      {/* HEADER SECTION */}
      <View className="mb-10">
        <Text className="text-4xl font-bold text-primary text-center mb-2">
          Login here
        </Text>
        <Text className="text-xl font-semibold text-center leading-6 px-4 text-gray-600">
          Welcome back you've{"\n"}been missed!
        </Text>
      </View>

      {/* ERROR HANDLER */}
      {apiError && (
        <View className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <Text className="text-red-600 text-sm font-medium text-center">
            {apiError}
          </Text>
        </View>
      )}

      {/* FORM CORE */}
      <View className="gap-y-4 mb-4">
        {/* Email Field */}
        <View>
          <View
            className={`bg-primary/10 p-2 rounded-lg border ${errors.email ? "border-red-500" : "border-primary/20"}`}
          >
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Email"
                  className="text-base text-gray-800 px-2 py-1"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={!isLoading}
                />
              )}
            />
          </View>
          {errors.email && (
            <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">
              {errors.email.message}
            </Text>
          )}
        </View>

        {/* Password Field */}
        <View>
          <View
            className={`bg-primary/10 p-2 rounded-lg border ${errors.password ? "border-red-500" : "border-primary/20"}`}
          >
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Password"
                  secureTextEntry
                  className="text-base text-gray-800 px-2 py-1"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={!isLoading}
                />
              )}
            />
          </View>
          {errors.password && (
            <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">
              {errors.password.message}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity className="self-end mb-8" disabled={isLoading}>
        <Text className="text-sm font-semibold text-primary">
          Forgot your password?
        </Text>
      </TouchableOpacity>

      {/* ACTION TRIGGERS */}
      <View className="gap-y-4 mb-10">
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className={`bg-primary rounded-lg py-4 shadow-md shadow-black/25 items-center justify-center ${
            isLoading ? "opacity-70" : ""
          }`}
        >
          <Text className="text-white font-bold text-center text-lg">
            Sign in
          </Text>
        </TouchableOpacity>
      </View>

      {/* FULL SCREEN SUBMISSION LOADER OVERLAY */}
      {isLoading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-white/80 items-center justify-center z-50">
          <ActivityIndicator color="#000" size="large" />
        </View>
      )}
    </View>
  );
}
