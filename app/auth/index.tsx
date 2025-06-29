import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { signIn, signUp, resetPassword } from "../../firebase/auth";
import { useAuth } from "../../context/AuthContext";
import Spacing from "../../constants/Spacing";
import Typography from "../../constants/Typography";
import { fontFamilies } from "../../constants/Fonts";

type AuthMode = "signIn" | "signUp" | "forgotPassword";

export default function AuthScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const styles = createStyles(theme, isDark);

  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user, router]);

  // Handle resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const getFriendlyError = (code: string) => {
    switch (code) {
      case "auth/invalid-login-credentials":
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/user-disabled":
        return "This account has been disabled.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  const handleAuth = async () => {
    if (!email.trim() || (!password.trim() && mode !== "forgotPassword")) {
      setError("Please fill in all fields.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (mode === "signIn") {
        await signIn(email, password);
        router.replace("/(tabs)");
      } else if (mode === "signUp") {
        await signUp(email, password);
        router.replace("/(tabs)");
      } else if (mode === "forgotPassword") {
        await resetPassword(email);
        setSuccess(`Password reset email sent to ${email}!`);
        setResendCooldown(60); // 60 second cooldown
      }
    } catch (err: any) {
      setError(getFriendlyError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || !email.trim()) return;

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess(`Password reset email sent to ${email}!`);
      setResendCooldown(60);
    } catch (err: any) {
      setError(getFriendlyError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
    if (newMode !== "forgotPassword") {
      setPassword("");
    }
  };

  const handleGuestContinue = () => {
    router.replace("/(tabs)");
  };

  const renderToggle = () => {
    if (mode === "forgotPassword") return null;

    return (
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            mode === "signIn" && styles.toggleActive,
          ]}
          onPress={() => handleModeChange("signIn")}
        >
          <Text
            style={[
              styles.toggleText,
              mode === "signIn" && styles.toggleTextActive,
            ]}
          >
            Sign In
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            mode === "signUp" && styles.toggleActive,
          ]}
          onPress={() => handleModeChange("signUp")}
        >
          <Text
            style={[
              styles.toggleText,
              mode === "signUp" && styles.toggleTextActive,
            ]}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMessage = () => {
    if (!error && !success) return null;

    return (
      <View
        style={[
          styles.messageContainer,
          success && styles.successContainer,
        ]}
      >
        <Ionicons
          name={success ? "checkmark-circle" : "alert-circle"}
          size={20}
          color={success ? theme.success : theme.error}
        />
        <Text style={success ? styles.successText : styles.errorText}>
          {success || error}
        </Text>
      </View>
    );
  };

  const renderResendSection = () => {
    if (mode !== "forgotPassword" || !success) return null;

    return (
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          Didn't receive the email? Check your spam folder or try again.
        </Text>
        <TouchableOpacity
          style={[
            styles.resendButton,
            (resendCooldown > 0 || isLoading) && styles.resendButtonDisabled,
          ]}
          onPress={handleResendEmail}
          disabled={resendCooldown > 0 || isLoading}
        >
          <Ionicons name="mail" size={16} color="white" />
          <Text style={styles.resendButtonText}>
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Email"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const getTitle = () => {
    switch (mode) {
      case "signIn":
        return "Welcome Back";
      case "signUp":
        return "Create Account";
      case "forgotPassword":
        return "Reset Password";
      default:
        return "Desert Zen";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "signIn":
        return "Sign in to sync your favorites and track your meditation journey";
      case "signUp":
        return "Join Desert Zen to save your progress and access personalized features";
      case "forgotPassword":
        return "Enter your email address and we'll send you a link to reset your password";
      default:
        return "Reawakening the soul";
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {mode === "forgotPassword" ? "Desert Zen" : getTitle()}
          </Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        <View style={styles.form}>
          {mode === "forgotPassword" && (
            <View style={styles.forgotPasswordHeader}>
              <Text style={styles.forgotPasswordTitle}>Reset Password</Text>
              <Text style={styles.forgotPasswordSubtitle}>
                Enter your email address and we'll send you a link to reset your password
              </Text>
            </View>
          )}

          {renderToggle()}
          {renderMessage()}
          {renderResendSection()}

          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color={theme.textTertiary} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={theme.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {mode !== "forgotPassword" && (
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color={theme.textTertiary} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={theme.textTertiary}
                />
              </TouchableOpacity>
            </View>
          )}

          {mode === "signIn" && (
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => handleModeChange("forgotPassword")}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.authButton,
              isLoading && styles.authButtonDisabled,
            ]}
            onPress={handleAuth}
            disabled={isLoading}
          >
            <Text style={styles.authButtonText}>
              {isLoading
                ? "Loading..."
                : mode === "signIn"
                ? "Sign In"
                : mode === "signUp"
                ? "Create Account"
                : "Send Reset Email"}
            </Text>
          </TouchableOpacity>

          {mode !== "forgotPassword" && (
            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleGuestContinue}
            >
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
          )}

          {mode === "forgotPassword" && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => handleModeChange("signIn")}
            >
              <Text style={styles.backButtonText}>Back to Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    keyboardAvoid: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 24,
    },
    header: {
      alignItems: 'center',
      marginBottom: 48,
    },
    title: {
      fontSize: 48,
      fontFamily: fontFamilies.bold,
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: fontFamilies.regular,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    form: {
      backgroundColor: theme.card,
      borderRadius: 24,
      padding: 32,
      elevation: 8,
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      position: 'relative',
    },
    toggleContainer: {
      flexDirection: 'row',
      backgroundColor: theme.background,
      borderRadius: 20,
      padding: 4,
      marginBottom: 32,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 16,
    },
    toggleActive: {
      backgroundColor: theme.accent,
    },
    toggleText: {
      fontFamily: fontFamilies.medium,
      color: theme.textSecondary,
    },
    toggleTextActive: {
      color: '#ffffff',
    },
    messageContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: `${theme.error}15`,
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      gap: 8,
    },
    successContainer: {
      backgroundColor: `${theme.success}15`,
    },
    errorText: {
      flex: 1,
      fontSize: 14,
      fontFamily: fontFamilies.regular,
      color: theme.error,
      lineHeight: 20,
    },
    successText: {
      flex: 1,
      fontSize: 14,
      fontFamily: fontFamilies.regular,
      color: theme.success,
      lineHeight: 20,
    },
    resendContainer: {
      backgroundColor: `${theme.accent}10`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      alignItems: 'center',
    },
    resendText: {
      fontSize: 14,
      fontFamily: fontFamilies.regular,
      color: theme.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    resendButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.accent,
      borderRadius: 16,
      paddingHorizontal: 20,
      paddingVertical: 12,
      gap: 8,
      elevation: 2,
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    resendButtonDisabled: {
      opacity: 0.6,
    },
    resendButtonText: {
      fontSize: 14,
      fontFamily: fontFamilies.medium,
      color: 'white',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
      backgroundColor: theme.background,
    },
    input: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      fontFamily: fontFamilies.regular,
      color: theme.text,
    },
    forgotPasswordButton: {
      alignSelf: 'flex-end',
      marginBottom: 16,
      paddingVertical: 4,
    },
    forgotPasswordText: {
      fontSize: 14,
      fontFamily: fontFamilies.medium,
      color: theme.accent,
    },
    authButton: {
      backgroundColor: theme.accent,
      borderRadius: 20,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 16,
      elevation: 3,
      shadowColor: theme.secondary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    authButtonDisabled: {
      opacity: 0.6,
    },
    authButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontFamily: fontFamilies.medium,
    },
    guestButton: {
      alignItems: 'center',
      paddingVertical: 12,
      marginBottom: 20,
    },
    guestButtonText: {
      color: isDark ? '#ffffff' : theme.accent,
      fontSize: 16,
      fontFamily: fontFamilies.medium,
    },
    forgotPasswordHeader: {
      alignItems: 'center',
      marginBottom: 32,
    },
    forgotPasswordTitle: {
      fontSize: 24,
      fontFamily: fontFamilies.bold,
      color: theme.text,
      marginBottom: 8,
    },
    forgotPasswordSubtitle: {
      fontSize: 14,
      fontFamily: fontFamilies.regular,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    backButton: {
      alignItems: 'center',
      paddingVertical: 12,
      marginBottom: 20,
    },
    backButtonText: {
      color: theme.textSecondary,
      fontSize: 14,
      fontFamily: fontFamilies.medium,
    },
  });