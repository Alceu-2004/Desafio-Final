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
  StyleSheet,
  Modal,
  TextInput,
  Keyboard,
} from "react-native";
import imdbApi from "../../src/api/imdbApi"; 
import { Movie } from "../../src/types/movie";
import { router } from "expo-router";
import { useMovies } from "../../src/contexts/MoviesContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
interface MovieSearchModalProps {
  isVisible: boolean;
  onClose: () => void;
  addWatchedMovie: (movie: Movie, userRating: number) => Promise<void>;
  addWantToWatchMovie: (movie: Movie) => Promise<void>;
  isMovieWatched: (id: string) => boolean;
  isMovieWantToWatch: (id: string) => boolean;
  router: any; 
}

const MovieSearchModal = ({
  isVisible,
  onClose,
  addWatchedMovie,
  addWantToWatchMovie,
  isMovieWatched,
  isMovieWantToWatch,
  router,
}: MovieSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [userRating, setUserRating] = useState<string>('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedMovie(null);
      setUserRating('');
    }
  }, [isVisible]);

  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    const handler = setTimeout(async () => {
      try {
        const results = await imdbApi.searchMovies(searchQuery); 
        setSearchResults(results.slice(0, 10)); 
      } catch (error) {
        Alert.alert('Erro', 'Falha ao buscar filmes.');
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleAddToList = async (listType: 'watched' | 'toWatch') => {
    if (!selectedMovie) return;

    if (listType === 'watched') {
      const rating = parseFloat(userRating.replace(',', '.'));
      if (isNaN(rating) || rating < 0 || rating > 10) {
        Alert.alert('Avaliação Inválida', 'Por favor, insira uma nota válida de 0 a 10.');
        return;
      }
      if (isMovieWatched(selectedMovie.id)) {
        Alert.alert('Aviso', 'Este filme já está na sua lista de Assistidos!');
        return router.push("/(drawer)/assistidos");
      }
      await addWatchedMovie(selectedMovie, rating); 
      Alert.alert('Sucesso', `${selectedMovie.title} adicionado a Assistidos com nota ${rating}!`);

    } else { 
      if (isMovieWantToWatch(selectedMovie.id)) {
        Alert.alert('Aviso', 'Este filme já está na sua lista Quero Assistir!');
        return router.push("/(drawer)/quero-assistir");
      }
      await addWantToWatchMovie(selectedMovie); 
      Alert.alert('Sucesso', `${selectedMovie.title} adicionado à lista Quero Assistir!`);
    }

    onClose();
    Keyboard.dismiss();
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    Keyboard.dismiss();
  };


  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={modalStyles.modalContainer}>
        <Text style={modalStyles.modalHeader}>Adicionar Filme</Text>
        
        <TextInput
          style={modalStyles.searchInput}
          placeholder="Busque o nome do filme..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {searchLoading && <ActivityIndicator size="small" color="#12223b" />}

        <ScrollView style={{ flex: 1, marginTop: 15 }}>
          {!selectedMovie ? (
            searchResults.length > 0 ? (
              searchResults.map(movie => (
                <TouchableOpacity
                  key={movie.id}
                  style={modalStyles.resultItem}
                  onPress={() => handleSelectMovie(movie)}
                >
                  <Image
                    source={{ uri: movie.image || 'https://via.placeholder.com/50' }}
                    style={modalStyles.resultImage}
                  />
                  <Text style={modalStyles.resultText} numberOfLines={1}>{movie.title}</Text>
                  <Text style={modalStyles.resultRating}>⭐ {movie.rating}</Text>
                </TouchableOpacity>
              ))
            ) : searchQuery.length >= 3 && !searchLoading && (
              <Text style={modalStyles.noResultsText}>Nenhum filme encontrado.</Text>
            )
          ) : (
            <View style={modalStyles.selectionContainer}>
              <Text style={modalStyles.selectionTitle}>Filme Selecionado:</Text>
              <Text style={modalStyles.selectedMovieTitle}>{selectedMovie.title}</Text>
              
              <Text style={modalStyles.listLabel}>Onde adicionar?</Text>

              <TouchableOpacity
                style={[styles.actionButton, modalStyles.watchedButton]}
                onPress={() => handleAddToList('watched')}
              >
                <Text style={styles.actionText}>Adicionar aos Assistidos</Text>
              </TouchableOpacity>

              <View style={modalStyles.ratingBox}>
                <Text style={modalStyles.ratingLabel}>Nota (0-10):</Text>
                <TextInput
                  style={modalStyles.ratingInput}
                  keyboardType="numeric"
                  maxLength={4}
                  value={userRating}
                  onChangeText={(text) => setUserRating(text.replace(/[^0-9.,]/g, '').substring(0, 4))}
                  placeholder="Ex: 8.5"
                />
              </View>

              <TouchableOpacity
                style={[styles.actionButton, modalStyles.toWatchButton]}
                onPress={() => handleAddToList('toWatch')}
              >
                <Text style={styles.actionText}>Adicionar à lista Quero Assistir</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={modalStyles.changeSelectionButton}
                onPress={() => setSelectedMovie(null)}
              >
                <Text style={modalStyles.changeSelectionText}>← Mudar Seleção</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        
        <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
          <Text style={modalStyles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};


export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { addWatchedMovie, addWantToWatchMovie, isMovieWatched, isMovieWantToWatch } = useMovies();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); 
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
    await addWatchedMovie(movie, 0); 

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
      
      <View style={styles.headerRow}> 
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => router.push("/(drawer)/assistidos")}
          >
            <Text style={styles.tabText}>Assistidos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => router.push("/(drawer)/quero-assistir")}
          >
            <Text style={styles.tabText}>Quero Assistir</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Adicionar Filme</Text>
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

      <MovieSearchModal 
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        addWatchedMovie={addWatchedMovie}
        addWantToWatchMovie={addWantToWatchMovie}
        isMovieWatched={isMovieWatched}
        isMovieWantToWatch={isMovieWantToWatch}
        router={router}
      />
    </View>
  );
}

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#12223b',
  },
  searchInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    elevation: 1,
  },
  resultImage: {
    width: 40,
    height: 60,
    marginRight: 10,
    borderRadius: 3,
  },
  resultText: {
    fontSize: 15,
    flex: 1,
  },
  resultRating: {
    fontSize: 14,
    color: '#12223b',
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#12223b',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectionContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#12223b',
  },
  selectedMovieTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  listLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
  },
  watchedButton: {
    backgroundColor: '#4CAF50', 
    marginBottom: 5,
  },
  toWatchButton: {
    backgroundColor: '#1565C0', 
    marginTop: 5,
    marginBottom: 10,
  },
  ratingBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  ratingInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: 80,
    textAlign: 'center',
    fontSize: 16,
  },
  changeSelectionButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  changeSelectionText: {
    color: '#888',
    fontSize: 14,
  }
});


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
  headerRow: {
    width: "90%",
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: "row",
    gap: 5,
    marginRight: 10,
  },
  tabButton: {
    backgroundColor: "#12223b",
    paddingVertical: 10,
    paddingHorizontal: 15, 
    borderRadius: 8
  },
  tabText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14 
  },
  addButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'flex-end',
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: 'right',
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