import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Movie } from "../types/movie"; 

interface WatchedMovie {
  id: string;
  title: string;
  image: string;
  year: string; 
  rating: string; 
  userRating: number; 
}

export default function MovieCard({ movie }: { movie: WatchedMovie | any }) { 
  const openDetails = () => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: movie.id },
    });
  };

  const hasUserRating = movie.userRating !== undefined && movie.userRating > 0;

  return (
    <Pressable
      onPress={openDetails}
      style={styles.card}
    >
      <Image
        source={{ uri: movie.image }}
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
        
        {movie.year && <Text style={styles.yearText}>Ano: {movie.year}</Text>}
        
        {movie.rating && <Text style={styles.ratingText}>⭐ Nota Geral: {movie.rating}</Text>}

        {hasUserRating && (
          <Text style={styles.userRatingText}>
            ✍️ Sua Nota: {movie.userRating.toFixed(1)}/10
          </Text>
        )}
      </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
    card: {
        flexDirection: "row", 
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 5,
        elevation: 1, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    image: {
        width: 70, 
        height: 100, 
        marginRight: 15,
        borderRadius: 4,
        resizeMode: 'cover',
    },
    infoContainer: {
        flex: 1,
        justifyContent: "space-around",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#12223b",
    },
    yearText: {
        fontSize: 14,
        color: "#666",
    },
    ratingText: {
        fontSize: 14,
        color: "#555",
        fontWeight: '500',
    },
    userRatingText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 4,
    }
});