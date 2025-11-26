import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import imdbApi from "../../src/api/imdbApi";
import { Movie } from "../../src/types/movie";

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<Movie | null>(null);

  async function loadMovieDetails() {
    const data = await imdbApi.getDetails(String(id));

    const mapped: Movie = {
      id: data.id,
      title: data.title,
      image: data.image,
      rating: data.rating,
      plot: data.plot,
    };

    setMovie(mapped);
  }

  useEffect(() => {
    loadMovieDetails();
  }, []);

  if (!movie) return <Text>Carregando...</Text>;

  return (
    <ScrollView style={{ padding: 16 }}>
      <Image 
        source={{ uri: movie.image }}
        style={{ width: "100%", height: 350, borderRadius: 8 }}
      />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 16 }}>
        {movie.title}
      </Text>
      <Text style={{ fontSize: 18 }}>⭐ {movie.rating}</Text>
      <Text style={{ marginTop: 16 }}>{movie.plot}</Text>
    </ScrollView>
  );
}
