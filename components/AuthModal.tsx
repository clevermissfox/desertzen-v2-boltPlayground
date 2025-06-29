import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import Colors from "@/constants/Colors";
import Spacing from "@/constants/Spacing";
import Typography from "@/constants/Typography";
import { fontFamilies } from "@/constants/Fonts";

type AuthModalProps = {
  visible: boolean;
  mode: "signIn" | "signUp";
  onModeChange: (mode: "signIn" | "signUp") => void;
  onClose: () => void;
  onAuth: (email: string, password: string, mode: "signIn" | "signUp") => void;
  error: string | null;
};

export const AuthModal = ({
  visible,
  mode,
  onModeChange,
  onClose,
  onAuth,
  error,
}: AuthModalProps) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onAuth(email, password, mode);
    setEmail("");
    setPassword("");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={viewStyles.overlay}>
        <View
          style={[
            viewStyles.container,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              elevation: 1,
              shadowColor: theme.secondary,
              shadowOpacity: 0.02,
            },
          ]}
        >
          <Text style={[textStyles.title, { color: theme.text }]}>
            {mode === "signIn" ? "Sign In" : "Sign Up"}
          </Text>
          {error && (
            <Text
              style={{
                color: theme.accent,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              {error}
            </Text>
          )}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={[
              styles.input,
              { borderColor: theme.border, color: theme.text },
            ]}
            placeholderTextColor={theme.textTertiary}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={[
              styles.input,
              { borderColor: theme.border, color: theme.text },
            ]}
            placeholderTextColor={theme.textTertiary}
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.accent }]}
            onPress={handleSubmit}
          >
            <Text style={[textStyles.buttonText, , { color: theme.neutral0 }]}>
              {mode === "signIn" ? "Sign In" : "Sign Up"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text
              style={[textStyles.closeText, { color: theme.textSecondary }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              onModeChange(mode === "signIn" ? "signUp" : "signIn")
            }
          >
            <Text
              style={[textStyles.modeSwitchText, { color: theme.textTertiary }]}
            >
              {mode === "signIn"
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const viewStyles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
    width: "80%",
    // shadowOffset: { width: 0, height: 1 },
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(50, 46, 38, 0.7)",
  },
});

const textStyles = StyleSheet.create({
  title: {
    fontSize: Typography.fontSizes.lg,
    // fontWeight: Typography.fontWeights.bold,
    fontFamily: fontFamilies.bold,
    marginBottom: Spacing.xs,
  },
  buttonText: {
    fontFamily: fontFamilies.medium,
    fontSize: Typography.fontSizes.md,
    textAlign: "center",
  },
  closeText: { textAlign: "center", marginTop: 8 },
  modeSwitchText: {
    textAlign: "center",
    marginTop: 8,
  },
});

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  input: { borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 8 },
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: 24,
  },
});
