import { create } from "zustand";
import { useEffect } from "react";
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

interface FavoritesState {
  favorites: string[];
  isLoading: boolean;
  addFavorite: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  setFavorites: (favorites: string[]) => void;
  setLoading: (loading: boolean) => void;
}

const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  addFavorite: async (id: string) => {
    const { user } = useAuth.getState ? useAuth.getState() : { user: null };
    if (!user) return;

    const currentFavorites = get().favorites;
    if (!currentFavorites.includes(id)) {
      // Optimistically update the UI
      set({ favorites: [...currentFavorites, id] });
      
      try {
        // Add to Firestore
        const favoriteRef = doc(db, `users/${user.uid}/favorites`, id);
        await setDoc(favoriteRef, { 
          meditationId: id,
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error adding favorite:", error);
        // Revert optimistic update on error
        set({ favorites: currentFavorites });
      }
    }
  },
  removeFavorite: async (id: string) => {
    const { user } = useAuth.getState ? useAuth.getState() : { user: null };
    if (!user) return;

    const currentFavorites = get().favorites;
    // Optimistically update the UI
    set({ favorites: currentFavorites.filter((favId) => favId !== id) });
    
    try {
      // Remove from Firestore
      const favoriteRef = doc(db, `users/${user.uid}/favorites`, id);
      await deleteDoc(favoriteRef);
    } catch (error) {
      console.error("Error removing favorite:", error);
      // Revert optimistic update on error
      set({ favorites: currentFavorites });
    }
  },
  isFavorite: (id: string) => {
    return get().favorites.includes(id);
  },
  setFavorites: (favorites: string[]) => set({ favorites }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

export function useFavoriteMeditations() {
  const { user } = useAuth();
  const store = useFavoritesStore();

  useEffect(() => {
    if (!user) {
      // Clear favorites when user logs out
      store.setFavorites([]);
      store.setLoading(false);
      return;
    }

    // Set up real-time listener for user's favorites
    store.setLoading(true);
    const favoritesRef = collection(db, `users/${user.uid}/favorites`);
    
    const unsubscribe = onSnapshot(
      favoritesRef,
      (snapshot) => {
        const favoriteIds = snapshot.docs.map(doc => doc.id);
        store.setFavorites(favoriteIds);
        store.setLoading(false);
      },
      (error) => {
        console.error("Error fetching favorites:", error);
        store.setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, store]);

  return {
    favorites: store.favorites,
    isLoading: store.isLoading,
    addFavorite: store.addFavorite,
    removeFavorite: store.removeFavorite,
    isFavorite: store.isFavorite,
  };
}