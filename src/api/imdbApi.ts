import axios from "axios";

const api = axios.create({
  baseURL: "https://imdb8.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": "43576de6c1msh964965aa5d47fb8p1cb472jsn00cacfa53200",
    "x-rapidapi-host": "imdb8.p.rapidapi.com",
  },
});

function extractId(path: string) {
  return path.replace("/title/", "").replace("/", "");
}

export default {
  async getPopularMovies() {
    console.log("🔍 Testando conexão com a API...");

    const res = await api.get("/title/get-most-popular-movies");

     console.log("Resposta da API:", res.data);

    const ids = res.data.map((rawId: string) => extractId(rawId));

    const movies = await Promise.all(
      ids.slice(0, 20).map(async (id: string) => {
        try {
          const details = await api.get(`/title/get-overview-details`, {
            params: { tconst: id },
          });

          return {
            id,
            title: details.data?.title?.title ?? "Título desconhecido",
            image: details.data?.title?.image?.url,
            rating: details.data?.ratings?.rating ?? "N/A",
            plot: details.data?.plotSummary?.text,
          };
        } catch {
          return null;
        }
      })
    );

    return movies.filter(Boolean);
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
