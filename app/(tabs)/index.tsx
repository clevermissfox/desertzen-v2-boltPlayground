import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { MeditationCard } from "../../components/MeditationCard";
import { useTheme } from "../../hooks/useTheme";
import Spacing from "../../constants/Spacing";
import Typography from "../../constants/Typography";
import { getFeaturedMeditations } from "../../data/meditations";
import { categories } from "../../data/categories";
import { CategoryCard } from "../../components/CategoryCard";
import { ThemeToggle } from "../../components/ThemeToggle";
import { fontFamilies } from "@/constants/Fonts";

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const featuredMeditations = getFeaturedMeditations();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: theme.textSecondary }]}>
            Welcome to
          </Text>
          <Text style={[styles.title, { color: theme.text }]}>Desert Zen</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Reawakening the soul
          </Text>
        </View>
        <ThemeToggle />
      </View>

      <View style={styles.heroContainer}>
        <Image
          source={{
            uri: "https://images.pexels.com/photos/163848/road-mountains-sunset-path-163848.jpeg",
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View
          style={[
            styles.heroOverlay,
            { backgroundColor: "rgba(50,46,38,0.3)" },
          ]}
        >
          <Text style={styles.heroText}>Find your inner peace</Text>
          <TouchableOpacity
            style={[styles.heroButton, { backgroundColor: theme.accent }]}
            onPress={() => router.push("/discover")}
          >
            <Text style={styles.heroButtonText}>Explore Meditations</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Featured Meditations
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContainer}
        >
          {featuredMeditations.map((meditation, index) => (
            <View
              key={meditation.id}
              style={[
                styles.featuredCardContainer,
                index === 0 && styles.firstFeaturedCard,
                index === featuredMeditations.length - 1 &&
                  styles.lastFeaturedCard,
              ]}
            >
              <MeditationCard meditation={meditation} featured={true} />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Categories
        </Text>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  welcomeText: {
    fontSize: Typography.fontSizes.md,
    fontFamily: fontFamilies.regular,
  },
  title: {
    fontSize: Typography.fontSizes.xxxl,
    fontFamily: fontFamilies.bold,
    marginVertical: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSizes.md,
    fontFamily: fontFamilies.italic,
    // fontStyle: "italic",
  },
  heroContainer: {
    height: 200,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    borderRadius: 16,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  heroText: {
    color: "white",
    fontSize: Typography.fontSizes.xxl,
    fontFamily: fontFamilies.bold,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  heroButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 24,
  },
  heroButtonText: {
    color: "white",
    fontSize: Typography.fontSizes.md,
    fontFamily: fontFamilies.medium,
  },
  sectionContainer: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xl,
    fontFamily: fontFamilies.bold,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  featuredContainer: {
    paddingHorizontal: Spacing.md,
  },
  featuredCardContainer: {
    marginRight: Spacing.md,
  },
  firstFeaturedCard: {
    marginLeft: Spacing.md,
  },
  lastFeaturedCard: {
    marginRight: Spacing.md * 2,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.md,
  },
});
