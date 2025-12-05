import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  StyleSheet
} from "react-native";
import imdbApi from "../../src/api/imdbApi";
import { Movie } from "../../src/types/movie";
import { router } from "expo-router";
import { useMovies } from "../../src/contexts/MoviesContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { addWatchedMovie, addWantToWatchMovie, isMovieWatched, isMovieWantToWatch } = useMovies();

  const [loadedOnce, setLoadedOnce] = useState(false);

  function pickRandomMovies(list: Movie[]) {
    if (!list || list.length === 0) return [];
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }

  async function loadPopularMovies() {
    try {
      setLoading(true);
      const data = await imdbApi.getPopularMovies();

      const randomFive = pickRandomMovies(data || []);
      setMovies(randomFive);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar os filmes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loadedOnce) return;
    setLoadedOnce(true);
    loadPopularMovies();
  }, [loadedOnce]);

  async function handleMarkAsWatched(movie: Movie) {
    if (isMovieWatched(movie.id)) {
      return router.push("/(drawer)/assistidos");
    }
    await addWatchedMovie(movie);

    Alert.alert(
      "Sucesso",
      `${movie.title} foi adicionado aos Assistidos!`,
      [
        { text: "Ver Assistidos", onPress: () => router.push("/(drawer)/assistidos") },
        { text: "OK" }
      ]
    );
  }

  async function handleWantToWatch(movie: Movie) {
    if (isMovieWantToWatch(movie.id)) {
      return router.push("/(drawer)/quero-assistir");
    }

    await addWantToWatchMovie(movie);

    Alert.alert(
      "Sucesso",
      `${movie.title} foi adicionado à lista Quero Assistir!`,
      [
        { text: "Ver Lista", onPress: () => router.push("/(drawer)/quero-assistir") },
        { text: "OK" }
      ]
    );
  }

  return (
    <View style={styles.container}>

      <Image
        source={require("../../assets/cinevault.png")}
        style={styles.logo}
      />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton]}
          onPress={() => router.push("/(drawer)/assistidos")}
        >
          <Text style={styles.tabText}>Assistidos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton]}
          onPress={() => router.push("/(drawer)/quero-assistir")}
        >
          <Text style={styles.tabText}>Quero Assistir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#12223b" style={{ marginTop: 40 }} />
        ) : (
          <View style={{ marginTop: 10 }}>
            {movies.map((movie) => (
              <View key={movie.id} style={styles.movieCard}>
                <Image
                  source={{ uri: movie.image }}
                  style={styles.movieImage}
                />

                <View style={styles.infoBox}>
                  <Text style={styles.movieTitle}>{movie.title}</Text>
                  <Text style={styles.rating}>⭐ {movie.rating}</Text>

                  <TouchableOpacity
                    style={styles.buttonDetails}
                    onPress={() => router.push(`/movie/${movie.id}`)}
                  >
                    <Text style={styles.buttonDetailsText}>Ver Detalhes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      isMovieWatched(movie.id) && styles.actionActive
                    ]}
                    onPress={() => handleMarkAsWatched(movie)}
                  >
                    <Text style={styles.actionText}>
                      {isMovieWatched(movie.id) ? "✓ Já Assistido" : "Já Assistido"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      isMovieWantToWatch(movie.id) && styles.actionActiveBlue
                    ]}
                    onPress={() => handleWantToWatch(movie)}
                  >
                    <Text style={styles.actionText}>
                      {isMovieWantToWatch(movie.id) ? "✓ Quero Assistir" : "Quero Assistir"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: "center"
  },
  logo: {
    width: 300,
    height: 90,
    resizeMode: "contain"
  },
  tabContainer: {
    flexDirection: "row",
    width: "90%",
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "space-between"
  },
  tabButton: {
    backgroundColor: "#12223b",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  tabText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  movieCard: {
    width: SCREEN_WIDTH * 0.9,
    alignSelf: "center",
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden"
  },
  movieImage: {
    width: "100%",
    height: 420
  },
  infoBox: {
    padding: 15
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#12223b"
  },
  rating: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10
  },
  buttonDetails: {
    backgroundColor: "#12223b",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  buttonDetailsText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },
  actionButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  actionText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },
  actionActive: {
    backgroundColor: "#2E7D32"
  },
  actionActiveBlue: {
    backgroundColor: "#1565C0"
  }
});
