import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://imdb8.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "43576de6c1msh964965aa5d47fb8p1cb472jsn00cacfa53200",
    "x-rapidapi-host": "imdb8.p.rapidapi.com",
  },
});

function extractId(path: string) {
  if (!path) return "";
  // Remove "/title/" do início e "/" do final
  let id = path.replace("/title/", "");
  id = id.replace(/\/$/, ""); // Remove barra final se existir
  return id;
}

// Cache por 1 hora (3600000 ms)
const CACHE_DURATION = 3600000;
const CACHE_KEY = "popularMoviesCache";

async function getCachedMovies() {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      if (now - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (error) {
    console.error("Erro ao ler cache:", error);
  }
  return null;
}

async function setCachedMovies(movies: any[]) {
  try {
    await AsyncStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: movies, timestamp: Date.now() })
    );
  } catch (error) {
    console.error("Erro ao salvar cache:", error);
  }
}

export default {
  async getPopularMovies() {
    // Verificar cache primeiro
    const cached = await getCachedMovies();
    if (cached) {
      console.log("📦 Usando filmes do cache");
      return cached;
    }

    console.log("🔍 Buscando filmes da API...");

    try {
      const res = await api.get("/title/get-most-popular-movies");

      console.log("Resposta da API:", res.data);
      console.log("Tipo de dados:", Array.isArray(res.data) ? "Array" : typeof res.data);

      if (!res.data || !Array.isArray(res.data)) {
        console.error("❌ Resposta da API não é um array:", res.data);
        throw new Error("Formato de resposta inválido da API");
      }

      const ids = res.data.map((rawId: string) => {
        const id = extractId(rawId);
        console.log(`Extraído: ${rawId} -> ${id}`);
        return id;
      }).filter(id => id); // Remove IDs vazios
      
      console.log("IDs extraídos:", ids);

      // Reduzir para apenas 5 filmes para evitar muitas requisições
      const movies = await Promise.all(
        ids.slice(0, 5).map(async (id: string, index: number) => {
          try {
            // Adicionar delay entre requisições para evitar rate limit
            await new Promise((resolve) => setTimeout(resolve, index * 300));

            console.log(`🔍 Buscando detalhes do filme ${index + 1}/5: ${id}`);
            const details = await api.get(`/title/get-overview-details`, {
              params: { tconst: id },
            });

            const movie = {
              id,
              title: details.data?.title?.title ?? "Título desconhecido",
              image: details.data?.title?.image?.url,
              rating: details.data?.ratings?.rating ?? "N/A",
              plot: details.data?.plotSummary?.text,
            };

            console.log(`✅ Filme ${index + 1} carregado:`, movie.title);
            return movie;
          } catch (error: any) {
            console.error(`❌ Erro ao carregar filme ${id}:`, error.response?.status || error.message);
            if (error.response?.status === 429) {
              console.warn("⚠️ Rate limit atingido para filme:", id);
            }
            return null;
          }
        })
      );

      const filteredMovies = movies.filter(Boolean);
      
      // Salvar no cache
      if (filteredMovies.length > 0) {
        await setCachedMovies(filteredMovies);
      }

      return filteredMovies;
    } catch (error: any) {
      if (error.response?.status === 429) {
        console.warn("⚠️ Erro 429: Muitas requisições. Tentando usar cache...");
        const cached = await getCachedMovies();
        if (cached) {
          return cached;
        }
        throw new Error("Limite de requisições excedido. Tente novamente mais tarde.");
      }
      throw error;
    }
  },

  async searchMovies(query: string) {
    const res = await api.get(`/title/auto-complete`, {
      params: { q: query },
    });

    return res.data.d.map((item: any) => ({
      id: item.id,
      title: item.l,
      image: item.i?.imageUrl,
      rating: item.r ?? "N/A",
      year: item.y,
      plot: item.s,
    }));
  },

  async getDetails(id: string) {
    const res = await api.get(`/title/get-overview-details`, {
      params: { tconst: id },
    });

    const info = res.data;

    return {
      id,
      title: info.title?.title ?? "Título desconhecido",
      plot: info.plotSummary?.text ?? "Sem sinopse disponível.",
      image: info.title?.image?.url,
      rating: info.ratings?.rating ?? "N/A",
    };
  },
};
