import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { SearchBar } from "../../components/SearchBar";
import { MeditationCard } from "../../components/MeditationCard";
import { categories } from "../../data/categories";
import {
  meditations,
  searchMeditations,
  getMeditationsByCategory,
} from "../../data/meditations";
import Spacing from "../../constants/Spacing";
import Typography from "../../constants/Typography";
import { fontFamilies } from "@/constants/Fonts";
import { Meditation } from "../../types/Meditation";

export default function DiscoverScreen() {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredMeditations: Meditation[] = searchQuery
    ? searchMeditations(searchQuery)
    : selectedCategory
    ? getMeditationsByCategory(selectedCategory)
    : meditations;

  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
      setSearchQuery("");
    }
  };

  const renderItem = ({ item }: { item: Meditation }) => (
    <View style={styles.meditationCardContainer}>
      <MeditationCard meditation={item} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SearchBar
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          if (text) setSelectedCategory(null);
        }}
      />

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id
                  ? { backgroundColor: theme.accent }
                  : {
                      backgroundColor: isDark
                        ? theme.secondary
                        : theme.secondaryLight,
                    },
              ]}
              onPress={() => handleCategoryPress(category.id)}
            >
              <Text style={[styles.categoryText, { color: theme.neutral100 }]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.resultContainer}>
        <Text style={[styles.resultText, { color: theme.text }]}>
          {filteredMeditations.length}{" "}
          {filteredMeditations.length === 1 ? "Meditation" : "Meditations"}{" "}
          found
        </Text>
      </View>

      <FlatList
        data={filteredMeditations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No meditations found. Try adjusting your search.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesContainer: {
    marginBottom: Spacing.md,
  },
  categoriesScrollContent: {
    paddingHorizontal: Spacing.md,
  },
  categoryButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    marginRight: Spacing.sm,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryText: {
    fontSize: Typography.fontSizes.sm,
    fontFamily: fontFamilies.medium,
  },
  resultContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  resultText: {
    fontSize: Typography.fontSizes.sm,
    fontFamily: fontFamilies.regular,
  },
  listContent: {
    padding: Spacing.md,
  },
  meditationCardContainer: {
    width: "50%",
    padding: Spacing.xs,
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
