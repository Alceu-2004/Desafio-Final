import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Movie } from "../../src/types/movie";
import imdbApi from "../../src/api/imdbApi";
import { router } from "expo-router";

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);

  async function loadMovies() {
    const data = await imdbApi.getPopularMovies();

    const mapped: Movie[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      rating: item.imDbRating || "N/A",
    }));

    setMovies(mapped);
  }

  useEffect(() => {
    loadMovies();
  }, []);

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/movie/${item.id}`)}>
            <View style={{ marginBottom: 16 }}>
              <Image
                source={{ uri: item.image }}
                style={{ width: "100%", height: 200, borderRadius: 8 }}
              />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
              <Text>⭐ {item.rating}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
