import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TMDB_API_KEY = "7e562039e6fb76eab5c0f5b39ff91460"; 

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

const CACHE_DURATION = 3600000;
const CACHE_KEY = "popularMoviesCache";

async function getCachedMovies() {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (e) {
    console.log("Erro ao ler cache:", e);
  }
  return null;
}

async function setCachedMovies(movies: any[]) {
  try {
    await AsyncStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: movies, timestamp: Date.now() })
    );
  } catch (e) {
    console.log("Erro ao salvar cache:", e);
  }
}

const baseParams = {
  api_key: TMDB_API_KEY,
  language: "pt-BR",
};

export default {
  async getPopularMovies() {
    const cached = await getCachedMovies();
    if (cached) {
      console.log("📦 Usando filmes do cache");
      return cached;
    }

    console.log("🔍 Buscando filmes populares da API TMDb...");

    try {
      const res = await api.get("/movie/popular", {
        params: {
          ...baseParams,
          page: 1,
        },
      });

      console.log("Resposta da API:", res.data);

      if (!res.data || !Array.isArray(res.data.results)) {
        throw new Error("Formato inesperado da API TMDb");
      }

      const movies = res.data.results.slice(0, 5).map((movie: any) => ({
        id: movie.id.toString(),
        title: movie.title ?? "Título desconhecido",
        image: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,
        rating: movie.vote_average?.toFixed(1) ?? "N/A", 
        plot: movie.overview,
        release_date: movie.release_date, 
      }));

    
      const filtered = movies.filter(Boolean);

      if (filtered.length > 0) {
        await setCachedMovies(filtered);
      }

      return filtered;
    } catch (err: any) {
      console.log("Erro geral TMDb:", err.message);

      if (err.response?.status === 429) {
        const cache = await getCachedMovies();
        if (cache) return cache;
      }

      throw err;
    }
  },

  async searchMovies(query: string) {
    const res = await api.get(`/search/movie`, {
      params: {
        ...baseParams,
        query: query,
      },
    });

    return res.data.results.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      image: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : null,
      rating: item.vote_average?.toFixed(1) ?? "N/A",
      year: item.release_date?.substring(0, 4), 
      plot: item.overview,
    }));
  },

  async getDetails(id: string) {
    const res = await api.get(`/movie/${id}`, {
      params: baseParams,
    });

    const info = res.data;

    return {
      id: info.id.toString(),
      title: info.title ?? "Título desconhecido",
      plot: info.overview ?? "Sem sinopse.",
      image: info.poster_path
        ? `https://image.tmdb.org/t/p/w500${info.poster_path}`
        : null,
      rating: info.vote_average?.toFixed(1) ?? "N/A",
      runtime: info.runtime ? `${info.runtime} min` : "N/A", 
      genres: info.genres?.map((g: any) => g.name).join(", "),
    };
  },
};