import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useTheme } from "../../hooks/useTheme";
import { MeditationCard } from "../../components/MeditationCard";
import { categories } from "../../data/categories";
import { getMeditationsByCategory } from "../../data/meditations";
import Spacing from "../../constants/Spacing";
import Typography from "../../constants/Typography";
import { fontFamilies } from "@/constants/Fonts";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
// import { ArrowLeft } from "lucide-react-native";
import { Meditation, MeditationLength } from "../../types/Meditation";

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme, isDark } = useTheme();

  const category = categories.find((cat) => cat.id === id);
  const meditations = getMeditationsByCategory(id as string);

  if (!category) {
    router.back();
    return null;
  }

  // Get unique lengths from actual meditations
  const availableLengths = Array.from(
    new Set(meditations.map((m) => m.length))
  ) as MeditationLength[];

  const renderItem = ({ item, index }: { item: Meditation; index: number }) => (
    <View
      style={[
        styles.meditationCardContainer,
        index % 2 === 0
          ? { paddingRight: Spacing.xs }
          : { paddingLeft: Spacing.xs },
      ]}
    >
      <MeditationCard meditation={item} />
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { backgroundColor: theme.background }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" color={theme.text} size={24} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {category.name}
            </Text>
            <Text
              style={[styles.headerDescription, { color: theme.textSecondary }]}
            >
              {category.description}
            </Text>

            <View style={styles.lengthsContainer}>
              <Text style={[styles.lengthsTitle, { color: theme.text }]}>
                Available Durations:
              </Text>
              <View style={styles.lengthBadgesContainer}>
                {availableLengths.map((length, index) => (
                  <View
                    key={index}
                    style={[
                      styles.lengthBadge,
                      {
                        backgroundColor: isDark
                          ? theme.secondary
                          : theme.textSecondary,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.lengthText, { color: theme.neutral100 }]}
                    >
                      {length}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.meditationsContainer}>
          <Text style={[styles.meditationsTitle, { color: theme.text }]}>
            {meditations.length}{" "}
            {meditations.length === 1 ? "Meditation" : "Meditations"}
          </Text>

          <FlatList
            data={meditations}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text
                  style={[styles.emptyText, { color: theme.textSecondary }]}
                >
                  No meditations available in this category yet.
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Spacing.xxxl,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  headerContent: {
    paddingTop: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.xxl,
    fontFamily: fontFamilies.bold,
    marginBottom: Spacing.sm,
  },
  headerDescription: {
    fontSize: Typography.fontSizes.md,
    fontFamily: fontFamilies.regular,
    marginBottom: Spacing.lg,
    lineHeight: Typography.lineHeights.body * Typography.fontSizes.md,
  },
  lengthsContainer: {
    marginBottom: Spacing.md,
  },
  lengthsTitle: {
    fontSize: Typography.fontSizes.md,
    fontFamily: fontFamilies.medium,
    marginBottom: Spacing.sm,
  },
  lengthBadgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  lengthBadge: {
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  lengthText: {
    fontSize: Typography.fontSizes.sm,
    fontFamily: fontFamilies.medium,
  },
  divider: {
    height: 2,
  },
  meditationsContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  meditationsTitle: {
    fontSize: Typography.fontSizes.lg,
    fontFamily: fontFamilies.bold,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingBottom: Spacing.lg,
  },
  meditationCardContainer: {
    width: "50%",
    marginBottom: Spacing.md,
  },
  emptyContainer: {
    padding: Spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: fontFamilies.regular,
    textAlign: "center",
  },
});
