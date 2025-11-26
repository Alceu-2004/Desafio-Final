import { useFavorites } from "../../src/contexts/FavoritesContext";
import MovieList from "../../src/components/MovieList";

export default function FavoritesScreen() {
  const { favorites } = useFavorites();

  return <MovieList movies={favorites} />;
}
