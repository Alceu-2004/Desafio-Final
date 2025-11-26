import { useEffect, useState } from "react";
import { View, FlatList, Button, Alert } from "react-native";
import imdbApi from "../../src/api/imdbApi";
import MovieCard from "../../src/components/MovieCard";
import { useAuth } from "../../src/contexts/AuthContext";
import { router } from "expo-router";
import { Movie } from "../../src/types/movie";

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const { logout } = useAuth();

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

  async function handleLogout() {
    try {
      await logout();
      router.replace("(auth)/login");
    } catch (e) {
      console.log("Erro no logout:", e);
      Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
    }
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
        <Button title="Sair" onPress={handleLogout} />
        <Button
          title="Adicionar Filme"
          onPress={() => router.push("/add-movie")}
        />
      </View>
      <FlatList
        style={{ marginTop: 10 }}
        data={movies}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <MovieCard movie={item} />}
      />
    </View>
  );
}
