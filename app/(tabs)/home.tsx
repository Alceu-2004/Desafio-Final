import { useEffect, useState } from "react";
import { View, FlatList, Button } from "react-native";
import imdbApi from "../../src/api/imdbApi";
import MovieCard from "../../src/components/MovieCard";
import { router } from "expo-router";
import { Movie } from "../../src/types/movie";

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);

  async function load() {
    try {
      const data = await imdbApi.getPopularMovies();
      setMovies(data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Button title="Adicionar Filme" onPress={() => router.push("/add-movie")} />

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MovieCard movie={item} />}
      />
    </View>
  );
}
