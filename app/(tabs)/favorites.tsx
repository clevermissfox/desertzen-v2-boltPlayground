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

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const { favorites, isLoading, isLoggedIn } = useFavoriteMeditations();

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
        meditation. Sign in to save favorites across devices.
      </Text>
    </View>
  );

  const LocalFavoritesNotice = () => (
    <View style={[styles.noticeContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.noticeHeader}>
        <Ionicons name="information-circle" color={theme.accent} size={20} />
        <Text style={[styles.noticeTitle, { color: theme.text }]}>
          Guest Mode
        </Text>
      </View>
      <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
        Your favorites are saved locally and won't sync across devices. Sign in to save them permanently.
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
      {!isLoggedIn && favoriteMeditations.length > 0 && <LocalFavoritesNotice />}
      
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
  noticeContainer: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  noticeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  noticeTitle: {
    fontFamily: fontFamilies.medium,
    fontSize: Typography.fontSizes.md,
    marginLeft: Spacing.sm,
  },
  noticeText: {
    fontFamily: fontFamilies.regular,
    fontSize: Typography.fontSizes.sm,
    lineHeight: Typography.lineHeights.body * Typography.fontSizes.sm,
  },
});