import { AuthContext } from "@/context/auth-context";
import { useTheme } from "@react-navigation/native";
import { Link } from "expo-router";
import { useContext } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>

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
        <Text style={{ color: colors.text }}>
          Don't have an account? Register
        </Text>
      </Link>
    </View>
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
