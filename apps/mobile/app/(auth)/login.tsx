import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AuthContext } from "@/context/auth-context";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useContext } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const { colors } = useTheme();

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        contentFit="contain"
        style={[{ marginBottom: 15, width: 120, height: 120 }]}
      />

      <ThemedText
        style={[{ color: colors.text, fontSize: 28, fontWeight: "bold" }]}
      >
        Welcome back
      </ThemedText>
      <Text
        style={[{ fontSize: 28, fontWeight: "bold" }]}
        className="text-red-500 font-bold"
      >
        Welcome back
      </Text>
      <ThemedText style={[{ color: "gray", marginBottom: 24 }]}>
        Log in to manage your restaurant operations
      </ThemedText>

      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.text}
      />

      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text },
        ]}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor={colors.text}
      />

      <Pressable
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => login()}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>Log in</Text>
      </Pressable>

      <Link href="/(auth)/register">
        <ThemedText style={{ color: colors.text }}>
          Don't have an account? Register
        </ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    fontWeight: "600",
  },
});
