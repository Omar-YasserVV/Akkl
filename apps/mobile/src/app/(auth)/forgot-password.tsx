import { useAuth } from "@/context/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ResetStep = "email" | "code" | "password" | "success";

const OTP_LENGTH = 6;

function passwordReady(password: string, confirmPassword: string) {
  return password.length >= 8 && password === confirmPassword;
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, resetPassword } = useAuth();
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validEmail = /^\S+@\S+\.\S+$/.test(email.trim());
  const canVerify = otp.length === OTP_LENGTH;
  const canReset = passwordReady(password, confirmPassword);

  const goBack = () => {
    setError(null);
    setMessage(null);
    if (step === "email") router.back();
    if (step === "code") setStep("email");
    if (step === "password") setStep("code");
    if (step === "success") router.replace("/(auth)/sign-in");
  };

  const requestReset = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setMessage(null);
      await forgotPassword(email.trim().toLowerCase());
      setMessage("We sent a reset link to your email. Enter your OTP below.");
      setStep("code");
    } catch (requestError) {
      setError(errorMessage(requestError, "Unable to send reset email."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReset = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await resetPassword({
        email: email.trim().toLowerCase(),
        otp,
        newPassword: password,
      });
      setStep("success");
    } catch (resetError) {
      setError(errorMessage(resetError, "Unable to update password."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "success") {
    return (
      <View className="flex-1 bg-white px-8 justify-center">
        <TouchableOpacity onPress={goBack} className="absolute top-14 left-6">
          <Ionicons name="arrow-back" size={20} color="#20242A" />
        </TouchableOpacity>
        <View className="items-center mb-10">
          <View className="w-20 h-20 rounded-3xl bg-primary/10 items-center justify-center mb-8">
            <Ionicons name="mail" size={34} color="#0072F5" />
          </View>
          <Text className="text-sm text-[#20242A] text-center leading-5">
            We have sent an email to{"\n"}
            <Text className="font-bold">{email}</Text> with instructions to reset your password.
          </Text>
        </View>
        <TouchableOpacity
          className="bg-primary rounded-lg py-4 items-center"
          onPress={() => router.replace("/(auth)/sign-in")}
        >
          <Text className="text-white font-bold">Back to login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28, paddingTop: 64 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={goBack}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-8 -ml-1"
        >
          <Ionicons name="chevron-back" size={21} color="#20242A" />
        </TouchableOpacity>

        <Text className="text-[19px] font-extrabold text-[#20242A] mb-2">
          {step === "email"
            ? "Forgot password"
            : step === "code"
              ? "Check your email"
              : "Set a new password"}
        </Text>
        <Text className="text-[13px] text-[#697386] leading-5 mb-6">
          {step === "email"
            ? "Please enter your email to reset the password"
            : step === "code"
              ? `We sent a reset link to ${email}. Enter the OTP code below.`
              : "Create a new password. Ensure it differs from previous ones for security."}
        </Text>

        {message ? (
          <Text className="text-xs text-green-700 mb-3">{message}</Text>
        ) : null}
        {error ? <Text className="text-xs text-red-600 mb-3">{error}</Text> : null}

        {step === "email" ? (
          <View>
            <Text className="text-xs font-bold text-[#20242A] mb-2">Your Email</Text>
            <AuthInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              disabled={!validEmail || isSubmitting}
              onPress={requestReset}
              className={`rounded-lg py-4 items-center mt-5 ${validEmail ? "bg-primary" : "bg-primary/40"}`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold">Reset Password</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}

        {step === "code" ? (
          <View>
            <CodeInput value={otp} onChangeText={setOtp} />
            <TouchableOpacity
              disabled={!canVerify}
              onPress={() => setStep("password")}
              className={`rounded-lg py-4 items-center mt-5 ${canVerify ? "bg-primary" : "bg-primary/40"}`}
            >
              <Text className="text-white font-bold">Verify Code</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={requestReset} className="items-center mt-5">
              <Text className="text-xs text-[#697386]">
                Haven&apos;t got the email yet?{" "}
                <Text className="font-bold text-primary">Resend email</Text>
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {step === "password" ? (
          <View>
            <Text className="text-xs font-bold text-[#20242A] mb-2">Password</Text>
            <PasswordInput
              value={password}
              onChangeText={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              placeholder="Enter your new password"
            />
            <Text className="text-xs font-bold text-[#20242A] mt-4 mb-2">
              Confirm Password
            </Text>
            <PasswordInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              placeholder="Re-enter password"
            />
            <TouchableOpacity
              disabled={!canReset || isSubmitting}
              onPress={submitReset}
              className={`rounded-lg py-4 items-center mt-5 ${canReset ? "bg-primary" : "bg-primary/40"}`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold">Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function AuthInput(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      className="border border-[#DDE2EA] rounded-lg px-4 py-4 text-[14px] text-[#20242A]"
      placeholderTextColor="#A0A7B4"
      autoCorrect={false}
    />
  );
}

function CodeInput({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={(next) => onChangeText(next.replace(/\D/g, "").slice(0, OTP_LENGTH))}
      keyboardType="number-pad"
      className="tracking-[16px] text-center border border-primary rounded-lg px-4 py-4 text-[18px] text-primary font-bold"
      placeholder="______"
      placeholderTextColor="#CBD5E1"
    />
  );
}

function PasswordInput({
  value,
  onChangeText,
  showPassword,
  setShowPassword,
  placeholder,
}: {
  value: string;
  onChangeText: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  placeholder: string;
}) {
  return (
    <View className="relative">
      <AuthInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        placeholder={placeholder}
      />
      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-4"
      >
        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={19} color="#9BA5B7" />
      </TouchableOpacity>
    </View>
  );
}
