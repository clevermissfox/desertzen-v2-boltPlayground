import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { Moon, Sun, Wind, Activity, Map } from "lucide-react-native";
import { Category } from "@/types/Meditation";
import Spacing from "../constants/Spacing";
import Typography from "../constants/Typography";
import { fontFamilies } from "@/constants/Fonts";
import { getMeditationsByCategory } from "../data/meditations";
import { useTheme } from "../hooks/useTheme";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();
  const { theme, isDark } = useTheme();

  // Get actual meditations for this category
  const categoryMeditations = getMeditationsByCategory(category.id);

  // Get unique lengths from actual meditations
  const availableLengths = Array.from(
    new Set(categoryMeditations.map((m) => m.length))
  );

  const getIcon = () => {
    const name = category.iconName;
    // return <Ionicons name={`#{name}`} color={theme.accent} size={24} />;
    switch (category.iconName) {
      case "sunny":
        return <Ionicons name="sunny" color={theme.accent} size={24} />;
      case "moon":
        return <Ionicons name="moon" color={theme.accent} size={24} />;
      case "wind":
        return <Ionicons name="cloudy" color={theme.accent} size={24} />;
      case "pulse":
        return <Ionicons name="pulse" color={theme.accent} size={24} />;
      case "map":
        return <Ionicons name="map" color={theme.accent} size={24} />;
      case "triangle":
        return <Ionicons name="triangle" color={theme.accent} size={24} />;
      case "logo-electron":
        return <Ionicons name="logo-electron" color={theme.accent} size={24} />;
      case "female-outline":
        return (
          <Ionicons name="female-outline" color={theme.accent} size={24} />
        );
      default:
        return <Ionicons name="color-filter" color={theme.accent} size={24} />;
    }
  };

  const handlePress = () => {
    router.push(`/category/${category.id}`);
  };

  return (
    <TouchableOpacity
      style={[
        viewStyles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          shadowColor: theme.secondary,
          elevation: 1,
          shadowOpacity: 0.02,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={viewStyles.iconContainer}>{getIcon()}</View>
      <View style={viewStyles.textContainer}>
        <Text
          style={[textStyles.title, { color: theme.text }]}
          numberOfLines={1}
        >
          {category.name}
        </Text>
        <Text
          style={[textStyles.description, { color: theme.textSecondary }]}
          numberOfLines={2}
        >
          {category.description}
        </Text>
        <View style={viewStyles.lengthsContainer}>
          {availableLengths.map((length, index) => (
            <View
              key={index}
              style={[
                viewStyles.lengthBadge,
                {
                  backgroundColor: isDark
                    ? theme.secondary
                    : theme.textSecondary,
                },
              ]}
            >
              <Text
                style={[textStyles.lengthText, { color: theme.neutral100 }]}
              >
                {length}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const viewStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    // shadowOffset: { width: 0, height: 1 },
    // shadowRadius: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },

  lengthsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  lengthBadge: {
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
});

const styles = StyleSheet.create({
  // container: {
  //   flexDirection: "row",
  //   borderRadius: 12,
  //   padding: Spacing.md,
  //   marginBottom: Spacing.md,
  //   borderWidth: 1,
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowRadius: 2,
  // },
  // iconContainer: {
  //   width: 48,
  //   height: 48,
  //   borderRadius: 24,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginRight: Spacing.md,
  // },
  // textContainer: {
  //   flex: 1,
  // },
  // title: {
  //   fontSize: Typography.fontSizes.lg,
  //   // fontWeight: Typography.fontWeights.bold,
  //   fontFamily: fontFamilies.bold,
  //   marginBottom: Spacing.xs,
  // },
  // description: {
  //   fontSize: Typography.fontSizes.sm,
  //   marginBottom: Spacing.sm,
  // },
  // lengthsContainer: {
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  // },
  // lengthBadge: {
  //   borderRadius: 12,
  //   paddingHorizontal: Spacing.sm,
  //   paddingVertical: 2,
  //   marginRight: Spacing.xs,
  //   marginBottom: Spacing.xs,
  // },
  // lengthText: {
  //   fontSize: Typography.fontSizes.xs,
  //   fontWeight: Typography.fontWeights.medium,
  //   fontFamily: fontFamilies.regular,
  // },
});

const textStyles = StyleSheet.create({
  title: {
    fontSize: Typography.fontSizes.lg,
    // fontWeight: Typography.fontWeights.bold,
    fontFamily: fontFamilies.bold,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: Typography.fontSizes.sm,
    marginBottom: Spacing.sm,
  },
  lengthText: {
    fontSize: Typography.fontSizes.xs,
    // fontWeight: Typography.fontWeights.medium,
    fontFamily: fontFamilies.medium,
  },
});

export { CategoryCard };
