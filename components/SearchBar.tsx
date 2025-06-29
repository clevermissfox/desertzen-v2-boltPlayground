import React from "react";
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import { Search, X } from "lucide-react-native";
import { useTheme } from "../hooks/useTheme";
import Spacing from "../constants/Spacing";
import Typography from "../constants/Typography";
import { fontFamilies } from "@/constants/Fonts";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search meditations...",
}: SearchBarProps) {
  const { theme, isDark } = useTheme();

  const handleClear = () => {
    onChangeText("");
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? theme.secondary : theme.primaryLight,
          borderColor: theme.border,
        },
      ]}
    >
      <Ionicons
        name="search"
        size={20}
        color={theme.textSecondary}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close" size={16} color={theme.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.md,
    height: 48,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
    fontFamily: fontFamilies.regular,
    height: "100%",
  },
  clearButton: {
    padding: Spacing.xs,
  },
});

export { SearchBar };
