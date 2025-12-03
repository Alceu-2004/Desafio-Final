import { useEffect, useState } from "react";
import { View, Button, Alert, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import imdbApi from "../../src/api/imdbApi";
import MovieCard from "../../src/components/MovieCard";
import { useAuth } from "../../src/contexts/AuthContext";  
import { useMovies } from "../../src/contexts/MoviesContext";
import { router } from "expo-router";  
import { Movie } from "../../src/types/movie";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'popular' | 'favorites'>('popular');
  const { logout } = useAuth();
  const { addWatchedMovie, addWantToWatchMovie, isMovieWatched, isMovieWantToWatch } = useMovies();  

  async function load() {
    setIsLoading(true);
    try {
      console.log("🔄 Iniciando carregamento de filmes...");
      const data = await imdbApi.getPopularMovies();
      console.log("✅ Filmes carregados:", data?.length || 0, "filmes");
      console.log("📋 Dados:", data);
      
      if (data && Array.isArray(data) && data.length > 0) {
        setMovies(data);
      } else {
        console.warn("⚠️ Nenhum filme retornado da API");
        setMovies([]);
      }
    } catch (e: any) {
      console.error("❌ Erro ao carregar filmes:", e);
      console.error("Detalhes do erro:", e.response?.data || e.message);
      Alert.alert(
        "Erro",
        e.message || "Não foi possível carregar os filmes. Verifique sua conexão."
      );
      setMovies([]);
    } finally {
      setIsLoading(false);
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

  function handleAssistidosPress() {
    router.push("/(drawer)/assistidos");
  }

  async function handleMarkAsWatched(movie: Movie) {
    if (isMovieWatched(movie.id)) {
      router.push("/(drawer)/assistidos");
      return;
    }
    await addWatchedMovie(movie);
    Alert.alert("Sucesso", `${movie.title} foi adicionado aos assistidos!`, [
      {
        text: "Ver Assistidos",
        onPress: () => router.push("/(drawer)/assistidos"),
      },
      { text: "OK" },
    ]);
  }

  async function handleWantToWatch(movie: Movie) {
    if (isMovieWantToWatch(movie.id)) {
      router.push("/(drawer)/quero-assistir");
      return;
    }
    await addWantToWatchMovie(movie);
    Alert.alert("Sucesso", `${movie.title} foi adicionado à lista de quero assistir!`, [
      {
        text: "Ver Lista",
        onPress: () => router.push("/(drawer)/quero-assistir"),
      },
      { text: "OK" },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.vies}>
      <Image source={require("../../assets/cinevault.png")}  style={styles.image}/>
      </View>
      
      {/* Botões de Tab Navigation */}
      <View style={styles.tabContainer}>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'popular' && styles.activeTab]}
          onPress={handleAssistidosPress}
        >
          <Text style={[styles.tabText, activeTab === 'popular' && styles.activeTabText]}>
            Assistidos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => router.push("/(drawer)/quero-assistir")}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            Quero Assitir
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo baseado na tab ativa */}
      {activeTab === 'popular' ? (
        <View style={styles.moviesContainer}>
          
          {isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Carregando filmes...</Text>
            </View>
          ) : movies.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum filme encontrado</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={load}
              >
                <Text style={styles.retryButtonText}>Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.carousel}
              contentContainerStyle={styles.carouselContent}
            >
              {movies.map((movie) => (
                <View key={movie.id} style={styles.carouselItem}>
                  <View style={styles.movieCardContainer}>
                    <Image
                      source={{ uri: movie.image }}
                      style={styles.movieImage}
                      resizeMode="cover"
                    />
                    <View style={styles.movieInfo}>
                      <Text style={styles.movieTitle}>{movie.title}</Text>
                      <Text style={styles.movieRating}>⭐ {movie.rating}</Text>
                      {movie.plot && (
                        <Text style={styles.moviePlot} numberOfLines={3}>
                          {movie.plot}
                        </Text>
                      )}
                      <TouchableOpacity
                        style={styles.movieDetailsButton}
                        onPress={() => router.push(`/movie/${movie.id}`)}
                      >
                        <Text style={styles.movieDetailsButtonText}>Ver Detalhes</Text>
                      </TouchableOpacity>
                      <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            styles.watchedButton,
                            isMovieWatched(movie.id) && styles.watchedButtonActive
                          ]}
                          onPress={() => handleMarkAsWatched(movie)}
                        >
                          <Text style={styles.actionButtonText}>
                            {isMovieWatched(movie.id) ? "✓ Já Assistido" : "Já Assistido"}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.actionButton,
                            styles.wantToWatchButton,
                            isMovieWantToWatch(movie.id) && styles.wantToWatchButtonActive
                          ]}
                          onPress={() => handleWantToWatch(movie)}
                        >
                          <Text style={styles.actionButtonText}>
                            {isMovieWantToWatch(movie.id) ? "✓ Quero Assistir" : "Quero Assistir"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
          <Text style={styles.emptyText}>Conteúdo de Favoritos</Text>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 16,
    color: "#12223b"
  },
  image: {
    width: 900,
    height: 180,
    resizeMode: "contain"
  },
  vies:{
    // backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    alignSelf: "center",
    width: 400,
    alignItems: "center",
  },
  container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  moviesContainer: {
    flex: 1,
    width: "100%",
  },
  carousel: {
    flex: 1,
  },
  carouselContent: {
    alignItems: "center",
  },
  carouselItem: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  movieCardContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  movieImage: {
    width: "100%",
    height: 400,
  },
  movieInfo: {
    padding: 20,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#12223b",
    marginBottom: 8,
  },
  movieRating: {
    fontSize: 18,
    color: "#666",
    marginBottom: 12,
  },
  moviePlot: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  movieDetailsButton: {
    backgroundColor: "#12223b",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  movieDetailsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  watchedButton: {
    backgroundColor: "#4CAF50",
  },
  watchedButtonActive: {
    backgroundColor: "#2E7D32",
  },
  wantToWatchButton: {
    backgroundColor: "#2196F3",
  },
  wantToWatchButtonActive: {
    backgroundColor: "#1565C0",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
    alignSelf: 'center',
    width: 400,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  activeTab: {
    backgroundColor: '#12223b',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#12223b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  markButton: {
    backgroundColor: '#12223b',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  markButtonWatched: {
    backgroundColor: '#4CAF50',
  },
  markButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});