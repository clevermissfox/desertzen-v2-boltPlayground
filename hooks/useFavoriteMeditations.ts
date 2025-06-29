import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useCallback } from "react";
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

interface User {
  uid: string;
  // Add other user properties as needed
}

interface FavoritesState {
  favorites: string[];
  localFavorites: string[];
  isLoading: boolean;
  _hasHydrated: boolean;
  addFavorite: (id: string, user: User | null) => Promise<void>;
  removeFavorite: (id: string, user: User | null) => Promise<void>;
  isFavorite: (id: string, user: User | null) => boolean;
  setFavorites: (favorites: string[]) => void;
  setLocalFavorites: (favorites: string[]) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  syncLocalToFirebase: (user: User) => Promise<void>;
}

const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      localFavorites: [],
      isLoading: false,
      _hasHydrated: false,
      
      addFavorite: async (id: string, user: User | null) => {
        if (!user) {
          // Handle local favorites for non-logged-in users
          const currentLocal = get().localFavorites;
          if (!currentLocal.includes(id)) {
            set({ localFavorites: [...currentLocal, id] });
          }
          return;
        }

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
      
      removeFavorite: async (id: string, user: User | null) => {
        if (!user) {
          // Handle local favorites for non-logged-in users
          const currentLocal = get().localFavorites;
          set({ localFavorites: currentLocal.filter((favId) => favId !== id) });
          return;
        }

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
      
      isFavorite: (id: string, user: User | null) => {
        if (!user) {
          return get().localFavorites.includes(id);
        }
        return get().favorites.includes(id);
      },
      
      setFavorites: (favorites: string[]) => set({ favorites }),
      setLocalFavorites: (favorites: string[]) => set({ localFavorites: favorites }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setHasHydrated: (hasHydrated: boolean) => set({ _hasHydrated: hasHydrated }),
      
      syncLocalToFirebase: async (user: User) => {
        const localFavorites = get().localFavorites;
        if (localFavorites.length === 0) return;

        try {
          // Add all local favorites to Firebase
          const promises = localFavorites.map(async (id) => {
            const favoriteRef = doc(db, `users/${user.uid}/favorites`, id);
            await setDoc(favoriteRef, { 
              meditationId: id,
              createdAt: new Date().toISOString(),
            });
          });
          
          await Promise.all(promises);
          
          // Clear local favorites after successful sync
          set({ localFavorites: [] });
        } catch (error) {
          console.error("Error syncing local favorites to Firebase:", error);
        }
      },
    }),
    {
      name: "local-favorites-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ localFavorites: state.localFavorites }),
      onRehydrateStorage: () => (state) => {
        // This callback is called after the store has been rehydrated from AsyncStorage
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

export function useFavoriteMeditations() {
  const { user } = useAuth();
  const store = useFavoritesStore();

  useEffect(() => {
    if (!user) {
      // Clear Firebase favorites when user logs out, keep local favorites
      store.setFavorites([]);
      store.setLoading(false);
      return;
    }

    // Sync local favorites to Firebase when user logs in
    if (store.localFavorites.length > 0) {
      store.syncLocalToFirebase(user);
    }

    // Set up real-time listener for user's favorites
    store.setLoading(true);
    
    try {
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
    } catch (error) {
      console.error("Error setting up favorites listener:", error);
      store.setLoading(false);
    }
  }, [user, store.localFavorites.length]);

  // Memoize the functions to prevent infinite re-renders
  const addFavorite = useCallback(
    (id: string) => store.addFavorite(id, user),
    [store.addFavorite, user]
  );

  const removeFavorite = useCallback(
    (id: string) => store.removeFavorite(id, user),
    [store.removeFavorite, user]
  );

  const isFavorite = useCallback(
    (id: string) => store.isFavorite(id, user),
    [store.isFavorite, user]
  );

  // Return the appropriate favorites based on auth state
  const currentFavorites = user ? store.favorites : store.localFavorites;

  // Calculate loading state: show loading if store hasn't hydrated yet (for guest mode)
  // or if user is logged in and Firebase data is still loading
  const isLoading = !store._hasHydrated || (user && store.isLoading);

  return {
    favorites: currentFavorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    isLoggedIn: !!user,
  };
}