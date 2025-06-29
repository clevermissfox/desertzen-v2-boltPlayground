import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  onForgotPassword: (email: string) => void;
  error: string | null;
};

export const AuthModal = ({
  visible,
  mode,
  onModeChange,
  onClose,
  onAuth,
  onForgotPassword,
  error,
}: AuthModalProps) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    onAuth(email, password, mode);
    setEmail("");
    setPassword("");
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      return;
    }
    onForgotPassword(email);
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    onClose();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            <View style={styles.errorContainer}>
              <Text
                style={[
                  styles.errorText,
                  {
                    color: error.includes("sent to")
                      ? theme.accent
                      : theme.error,
                  },
                ]}
              >
                {error}
              </Text>
            </View>
          )}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={[
              styles.input,
              { 
                borderColor: theme.border, 
                color: theme.text,
                backgroundColor: theme.background,
              },
            ]}
            placeholderTextColor={theme.textTertiary}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={[
                styles.passwordInput,
                { 
                  borderColor: theme.border, 
                  color: theme.text,
                  backgroundColor: theme.background,
                },
              ]}
              placeholderTextColor={theme.textTertiary}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={togglePasswordVisibility}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={theme.textTertiary}
              />
            </TouchableOpacity>
          </View>
          
          {mode === "signIn" && (
            <TouchableOpacity 
              onPress={handleForgotPassword}
              style={styles.forgotPasswordContainer}
              disabled={!email.trim()}
            >
              <Text 
                style={[
                  styles.forgotPasswordText, 
                  { 
                    color: email.trim() ? theme.accent : theme.textTertiary,
                  }
                ]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.accent }]}
            onPress={handleSubmit}
          >
            <Text style={[textStyles.buttonText, { color: theme.neutral0 }]}>
              {mode === "signIn" ? "Sign In" : "Sign Up"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleClose}>
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
    maxWidth: 400,
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
    fontFamily: fontFamilies.bold,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  buttonText: {
    fontFamily: fontFamilies.medium,
    fontSize: Typography.fontSizes.md,
    textAlign: "center",
  },
  closeText: { 
    textAlign: "center", 
    marginTop: Spacing.sm,
    fontFamily: fontFamilies.regular,
  },
  modeSwitchText: {
    textAlign: "center",
    marginTop: Spacing.sm,
    fontFamily: fontFamilies.regular,
    fontSize: Typography.fontSizes.sm,
  },
});

const styles = StyleSheet.create({
  input: { 
    borderWidth: 1, 
    marginBottom: Spacing.sm, 
    padding: Spacing.sm, 
    borderRadius: 8,
    fontFamily: fontFamilies.regular,
    height: 48,
  },
  passwordContainer: {
    position: "relative",
    marginBottom: Spacing.sm,
  },
  passwordInput: {
    borderWidth: 1,
    padding: Spacing.sm,
    paddingRight: 48, // Make room for the eye icon
    borderRadius: 8,
    fontFamily: fontFamilies.regular,
    height: 48,
  },
  eyeButton: {
    position: "absolute",
    right: 4,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
  },
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: 24,
    marginTop: Spacing.sm,
  },
  errorContainer: {
    marginBottom: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: 8,
  },
  errorText: {
    textAlign: "center",
    fontFamily: fontFamilies.regular,
    fontSize: Typography.fontSizes.sm,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: Spacing.md,
  },
  forgotPasswordText: {
    fontFamily: fontFamilies.regular,
    fontSize: Typography.fontSizes.sm,
  },
});