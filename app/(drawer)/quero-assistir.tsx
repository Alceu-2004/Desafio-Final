import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useMovies } from "../../src/contexts/MoviesContext";
import MovieCard from "../../src/components/MovieCard";
import { Movie } from "../../src/types/movie";

interface RatingModalProps {
  isVisible: boolean;
  onClose: () => void;
  movieToRate: Movie | null;
  onConfirmMove: (movie: Movie, rating: number) => void;
}

const RatingModal = ({ isVisible, onClose, movieToRate, onConfirmMove }: RatingModalProps) => {
  const [userRating, setUserRating] = useState('');

  if (!movieToRate) return null;

  const handleConfirm = () => {
    const rating = parseFloat(userRating.replace(',', '.'));
    if (isNaN(rating) || rating < 0 || rating > 10) {
      Alert.alert('Avaliação Inválida', 'Por favor, insira uma nota válida de 0 a 10.');
      return;
    }
    onConfirmMove(movieToRate, rating);
    setUserRating('');
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>Avaliar e Mover Filme</Text>
          <Text style={modalStyles.movieTitle} numberOfLines={2}>{movieToRate.title}</Text>
          
          <Text style={modalStyles.ratingLabel}>Sua Nota (0-10):</Text>
          <TextInput
            style={modalStyles.ratingInput}
            keyboardType="numeric"
            maxLength={4}
            value={userRating}
            onChangeText={(text) => setUserRating(text.replace(/[^0-9.,]/g, '').substring(0, 4))}
            placeholder="Ex: 8.5"
            placeholderTextColor="#999"
          />

          <View style={modalStyles.buttonRow}>
            <TouchableOpacity style={modalStyles.cancelButton} onPress={() => { setUserRating(''); onClose(); }}>
              <Text style={modalStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.confirmButton} onPress={handleConfirm}>
              <Text style={modalStyles.confirmButtonText}>Mover para Assistidos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function QueroAssistirScreen() {
  const { wantToWatchMovies, isLoading, removeWantToWatchMovie, moveFromWantToWatchToWatched } = useMovies();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleConfirmMove = async (movie: Movie, rating: number) => {
    try {
      await moveFromWantToWatchToWatched(movie.id, movie, rating);
      Alert.alert('Sucesso', `${movie.title} movido para Assistidos com nota ${rating}!`);
    } catch (error) {
       Alert.alert('Erro', 'Não foi possível mover o filme.');
    }
  };

  const handleMoveToWatched = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalVisible(true);
  };
  
  const handleRemove = (movieTitle: string, movieId: string) => {
    Alert.alert(
      "Confirmar Remoção",
      `Tem certeza que deseja remover "${movieTitle}" da sua lista Quero Assistir?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", onPress: () => removeWantToWatchMovie(movieId), style: "destructive" }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quero Assistir</Text>
      <Text style={styles.count}>{wantToWatchMovies.length} filme(s)</Text>

      {wantToWatchMovies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Sua lista Quero Assistir está vazia.</Text>
          <Text style={styles.emptySubtext}>
             Adicione filmes que você quer assistir na página inicial
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push("/(drawer)/home")}
          >
            <Text style={styles.addButtonText}>Adicionar Filme na Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wantToWatchMovies.slice().reverse()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <MovieCard movie={item} />
              
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.watchedButton}
                  onPress={() => handleMoveToWatched(item)}
                >
                  <Text style={styles.actionButtonText}>✓ Já Assisti</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(item.title, item.id)}
                >
                  <Text style={styles.actionButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <RatingModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        movieToRate={selectedMovie}
        onConfirmMove={handleConfirmMove}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f7fb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#12223b',
    marginBottom: 8,
    textAlign: 'center',
  },
  count: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
  cardContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  watchedButton: {
    flex: 1,
    backgroundColor: '#4CAF50', 
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  removeButton: {
    flex: 1,
    backgroundColor: '#D32F2F', 
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  actionButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#12223b',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#12223b',
  },
  movieTitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  ratingInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginLeft: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginRight: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});