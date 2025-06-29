import React from "react";
import { StyleSheet, TouchableOpacity, View, Text, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import { Sun, Moon } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useTheme } from "../hooks/useTheme";
import Spacing from "../constants/Spacing";
import { fontFamilies } from "@/constants/Fonts";

export default function ThemeToggle() {
  const { isDark, setTheme, theme } = useTheme();

  const toggleColorScheme = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setTheme(!isDark);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isDark ? theme.secondaryLight : theme.primaryLight },
        !isDark && { borderWidth: 1, borderColor: theme.border },
      ]}
      onPress={toggleColorScheme}
    >
      <View style={styles.iconContainer}>
        {isDark ? (
          <Ionicons name="sunny" size={18} color={theme.accent} />
        ) : (
          <Ionicons name="moon" size={18} color={theme.accent} />
        )}
      </View>
      <Text style={[styles.text, { color: theme.text }]}>
        {isDark ? "Light Mode" : "Dark Mode"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  text: {
    fontFamily: fontFamilies.medium,
  },
});

export { ThemeToggle };
