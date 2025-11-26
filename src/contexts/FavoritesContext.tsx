import { createContext, useContext, useEffect, useState } from "react";
import { loadFavorites, saveFavorites } from "../storage/favoritesStorage";

type Movie = {
  id: string;
  title?: string;
  image?: string;
  year?: number;
  plot?: string;
  rating?: string;
};

type FavoritesContextType = {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    loadFavorites().then((f) => setFavorites(f));
  }, []);

  function addFavorite(movie: Movie) {
    const updated = [...favorites, movie];
    setFavorites(updated);
    saveFavorites(updated);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites deve ser usado dentro de FavoritesProvider");
  }
  return ctx;
}
