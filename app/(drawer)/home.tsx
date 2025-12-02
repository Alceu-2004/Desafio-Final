import { useEffect, useState } from "react";
import { View, FlatList, Button, Alert, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import imdbApi from "../../src/api/imdbApi";
import MovieCard from "../../src/components/MovieCard";
import { useAuth } from "../../src/contexts/AuthContext";  
import { router } from "expo-router";  
import { Movie } from "../../src/types/movie";

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<'popular' | 'favorites'>('popular');
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
    <View style={styles.container}>
      <View style={styles.vies}>
      <Image source={require("../../assets/cinevault.png")}  style={styles.image}/>
      </View>
      
      {/* Botões de Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'popular' && styles.activeTab]}
          onPress={() => setActiveTab('popular')}
        >
          <Text style={[styles.tabText, activeTab === 'popular' && styles.activeTabText]}>
            Populares
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            Favoritos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo baseado na tab ativa */}
      {activeTab === 'popular' ? (
        <FlatList
          style={{ marginTop: 10 }}
          data={movies}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <MovieCard movie={item} />}
        />
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
    width: 500,
    height: 280,
    resizeMode: "contain"
  },
  vies:{
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    alignSelf: "center",
    width: 400,
    alignItems: "center",
  },
  container:{
    justifyContent: "center",
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
  },
});