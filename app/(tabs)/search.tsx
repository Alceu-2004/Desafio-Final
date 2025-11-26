import { useState } from "react";
import { View, TextInput, FlatList, Text, Image, TouchableOpacity } from "react-native";
import imdbApi from "../../src/api/imdbApi";
import { Movie } from "../../src/types/movie";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);

  async function searchMovies() {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const data = await imdbApi.searchMovies(query);

      const mapped: Movie[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        image: item.image,
        rating: item.rating ?? "N/A",
      }));

      setResults(mapped);
    } catch (e) {
      console.log("Erro ao buscar:", e);
      setResults([]);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Buscar filmes..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchMovies}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
          marginBottom: 16,
        }}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <View style={{ flexDirection: "row", marginBottom: 16 }}>
              <Image
                source={{ uri: item.image }}
                style={{ width: 80, height: 120, marginRight: 12 }}
              />
              <View>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
                <Text>⭐ {item.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
