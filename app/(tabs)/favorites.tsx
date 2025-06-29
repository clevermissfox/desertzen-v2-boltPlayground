import React from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { MeditationCard } from "../../components/MeditationCard";
import { useFavoriteMeditations } from "../../hooks/useFavoriteMeditations";
import { meditations } from "../../data/meditations";
import Spacing from "../../constants/Spacing";
import Typography from "../../constants/Typography";
import { Meditation } from "@/types/Meditation";
import { Ionicons } from "@expo/vector-icons";
import { fontFamilies } from "@/constants/Fonts";
// import { Heart } from 'lucide-react-native';

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const { favorites, isLoading } = useFavoriteMeditations();

  const favoriteMeditations = meditations.filter((meditation) =>
    favorites.includes(meditation.id)
  );

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

  const EmptyFavorites = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="heart"
        color={theme.accent}
        size={48}
        style={styles.emptyIcon}
      />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No Favorites Yet
      </Text>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        Add meditations to your favorites by tapping the heart icon on any
        meditation.
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Loading your favorites...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Your Favorites
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          {favoriteMeditations.length}{" "}
          {favoriteMeditations.length === 1 ? "meditation" : "meditations"}
        </Text>
      </View> */}

      <FlatList
        data={favoriteMeditations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        ListEmptyComponent={EmptyFavorites}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: fontFamilies.regular,
    fontSize: Typography.fontSizes.md,
  },
  headerContainer: {
    padding: Spacing.md,
  },
  headerTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: Typography.fontSizes.xxl,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontFamily: fontFamilies.regular,
    fontSize: Typography.fontSizes.md,
  },
  listContent: {
    padding: Spacing.md,
  },
  meditationCardContainer: {
    width: "50%",
    marginBottom: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  emptyIcon: {
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: Typography.fontSizes.xl,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  emptyText: {
    fontFamily: fontFamilies.regular,
    fontSize: Typography.fontSizes.md,
    textAlign: "center",
    lineHeight: Typography.lineHeights.body * Typography.fontSizes.md,
  },
});
