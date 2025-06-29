import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesState {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const useFavoriteMeditations = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (id: string) => {
        const currentFavorites = get().favorites;
        if (!currentFavorites.includes(id)) {
          set({ favorites: [...currentFavorites, id] });
        }
      },
      removeFavorite: (id: string) => {
        const currentFavorites = get().favorites;
        set({ favorites: currentFavorites.filter((favId) => favId !== id) });
      },
      isFavorite: (id: string) => {
        return get().favorites.includes(id);
      },
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { useFavoriteMeditations };
