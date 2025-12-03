import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { useMovies } from "../../src/contexts/MoviesContext";
import MovieCard from "../../src/components/MovieCard";

export default function QueroAssistirScreen() {
  const { wantToWatchMovies, isLoading, removeWantToWatchMovie } = useMovies();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (wantToWatchMovies.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nenhum filme na lista ainda</Text>
        <Text style={styles.emptySubtext}>
          Adicione filmes que você quer assistir na página inicial
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quero Assistir</Text>
      <Text style={styles.count}>{wantToWatchMovies.length} filme(s)</Text>
      <FlatList
        data={wantToWatchMovies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MovieCard movie={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f6f7fb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#12223b",
    marginBottom: 8,
    textAlign: "center",
  },
  count: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
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
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#12223b",
    textAlign: "center",
    marginTop: 50,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
});

