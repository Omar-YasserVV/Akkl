import { useAuth } from "@/context/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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

type SignupStep = "details" | "email" | "password" | "success";

const EMAIL_CODE_LENGTH = 5;

function normalizeUsername(email: string) {
  const base = email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  return `${base || "akkl_user"}_${Date.now().toString().slice(-5)}`;
}

function passwordStrength(password: string) {
  return {
    min: password.length >= 8,
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function SignUpScreen() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const [step, setStep] = useState<SignupStep>("details");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const generatedCode = useMemo(() => "11111", []);
  const strength = passwordStrength(password);
  const canContinueDetails =
    firstName.trim().length > 1 &&
    lastName.trim().length > 1 &&
    phone.trim().length >= 8;
  const canContinueEmail = /^\S+@\S+\.\S+$/.test(email.trim());
  const canVerifyEmail = code.length === EMAIL_CODE_LENGTH;
  const canSubmitPassword = strength.min && strength.number && strength.symbol;

  const goBack = () => {
    setApiError(null);
    if (step === "details") {
      router.back();
    } else if (step === "email") {
      setStep("details");
    } else if (step === "password") {
      setStep("email");
    }
  };

  const handleVerifyEmail = () => {
    setApiError(null);
    if (code !== generatedCode) {
      setApiError("Use verification code 11111 for this local flow.");
      return;
    }
    setStep("password");
  };

  const handleSignup = async () => {
    try {
      setApiError(null);
      await signup({
        email: email.trim().toLowerCase(),
        password,
        fullName,
        phone: phone.trim(),
        username: normalizeUsername(email),
        role: "CUSTOMER",
      });
      setStep("success");
    } catch (error) {
      setApiError(errorMessage(error, "Unable to create account."));
    }
  };

  if (step === "success") {
    return (
      <View className="flex-1 bg-white px-8 justify-center">
        <View className="items-center mb-10">
          <View className="w-20 h-20 rounded-3xl bg-primary/10 items-center justify-center mb-8">
            <Ionicons name="checkmark" size={38} color="#0072F5" />
          </View>
          <Text className="text-xl font-extrabold text-[#20242A] text-center">
            Your account was successfully created!
          </Text>
          <Text className="text-sm text-[#697386] text-center mt-3 leading-5">
            Only one click to explore online education.
          </Text>
        </View>
        <TouchableOpacity
          className="bg-primary rounded-lg py-4 items-center"
          onPress={() => router.replace("/select-restaurant")}
        >
          <Text className="text-white font-bold">Log In</Text>
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
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28, paddingVertical: 56 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={goBack} className="w-9 h-9 items-center justify-center -ml-2">
            <Ionicons name="arrow-back" size={20} color="#20242A" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-center text-[15px] font-extrabold text-[#20242A]">
              {step === "details"
                ? "Create Account"
                : step === "email"
                  ? "Verify your email 2 / 3"
                  : "Create your password 3 / 3"}
            </Text>
            <View className="h-1 bg-[#E8EEF8] rounded-full mt-3 mx-20">
              <View
                className="h-full bg-primary rounded-full"
                style={{
                  width:
                    step === "details"
                      ? "33%"
                      : step === "email"
                        ? "66%"
                        : "100%",
                }}
              />
            </View>
          </View>
          <View className="w-9" />
        </View>

        {apiError ? (
          <Text className="text-sm text-red-600 text-center mb-4">{apiError}</Text>
        ) : null}

        {step === "details" ? (
          <View className="gap-y-4">
            <AuthInput placeholder="First name" value={firstName} onChangeText={setFirstName} />
            <AuthInput placeholder="Last name" value={lastName} onChangeText={setLastName} />
            <AuthInput
              placeholder="Phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              disabled={!canContinueDetails}
              className={`rounded-lg py-4 items-center mt-2 ${canContinueDetails ? "bg-primary" : "bg-primary/40"}`}
              onPress={() => setStep("email")}
            >
              <Text className="text-white font-bold">Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")} className="items-center mt-3">
              <Text className="text-xs text-[#697386]">Already have an account</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {step === "email" ? (
          <View>
            <Text className="text-sm text-[#697386] text-center mb-5 leading-5">
              We just sent 5-digit code to{"\n"}
              {email || "your email"}, enter it below.
            </Text>
            <AuthInput
              placeholder="example@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {canContinueEmail ? (
              <>
                <CodeInput value={code} onChangeText={setCode} />
                <TouchableOpacity
                  disabled={!canVerifyEmail}
                  className={`rounded-lg py-4 items-center mt-4 ${canVerifyEmail ? "bg-primary" : "bg-primary/40"}`}
                  onPress={handleVerifyEmail}
                >
                  <Text className="text-white font-bold">Verify email</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCode(generatedCode)} className="items-center mt-4">
                  <Text className="text-xs font-bold text-[#20242A]">
                    Wrong email? Send to different email
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                disabled={!canContinueEmail}
                className="rounded-lg py-4 items-center mt-2 bg-primary/40"
              >
                <Text className="text-white font-bold">Create an account</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        {step === "password" ? (
          <View>
            <View className="relative">
              <AuthInput
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-3"
              >
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={19} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <PasswordRule met={strength.min} label="8 characters minimum" />
            <PasswordRule met={strength.number} label="a number" />
            <PasswordRule met={strength.symbol} label="a symbol" />
            <TouchableOpacity
              disabled={!canSubmitPassword || isLoading}
              className={`rounded-lg py-4 items-center mt-5 ${canSubmitPassword ? "bg-primary" : "bg-primary/40"}`}
              onPress={handleSignup}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold">Continue</Text>
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
      className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-4 text-[14px] text-[#20242A]"
      placeholderTextColor="#9BA5B7"
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
      onChangeText={(next) => onChangeText(next.replace(/\D/g, "").slice(0, EMAIL_CODE_LENGTH))}
      keyboardType="number-pad"
      className="tracking-[14px] text-center border border-primary rounded-lg px-4 py-4 text-[18px] text-primary font-bold"
      placeholder="_____"
      placeholderTextColor="#CBD5E1"
    />
  );
}

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <View className="flex-row items-center mt-2">
      <View className={`w-2 h-2 rounded-full mr-2 ${met ? "bg-green-600" : "bg-gray-300"}`} />
      <Text className="text-xs text-[#697386]">{label}</Text>
    </View>
  );
}
