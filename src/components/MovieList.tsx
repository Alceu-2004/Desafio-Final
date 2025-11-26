import { FlatList } from "react-native";
import MovieCard from "./MovieCard";

export default function MovieList({ movies }: any) {
  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MovieCard movie={item} />}
    />
  );
}
