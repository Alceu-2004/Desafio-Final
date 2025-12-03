import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Movie } from "../types/movie";

interface MoviesContextType {
  watchedMovies: Movie[];
  wantToWatchMovies: Movie[];
  isLoading: boolean;
  addWatchedMovie: (movie: Movie) => Promise<void>;
  removeWatchedMovie: (movieId: string) => Promise<void>;
  addWantToWatchMovie: (movie: Movie) => Promise<void>;
  removeWantToWatchMovie: (movieId: string) => Promise<void>;
  isMovieWatched: (movieId: string) => boolean;
  isMovieWantToWatch: (movieId: string) => boolean;
}

const MoviesContext = createContext<MoviesContextType>({} as MoviesContextType);

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [wantToWatchMovies, setWantToWatchMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWatchedMovies();
    loadWantToWatchMovies();
  }, []);

  async function loadWatchedMovies() {
    try {
      const stored = await AsyncStorage.getItem("watchedMovies");
      if (stored) {
        const movies = JSON.parse(stored);
        setWatchedMovies(movies);
      }
    } catch (error) {
      console.error("Erro ao carregar filmes assistidos:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addWatchedMovie(movie: Movie) {
    try {
      const updatedMovies = [...watchedMovies, movie];
      await AsyncStorage.setItem("watchedMovies", JSON.stringify(updatedMovies));
      setWatchedMovies(updatedMovies);
    } catch (error) {
      console.error("Erro ao adicionar filme assistido:", error);
    }
  }

  async function removeWatchedMovie(movieId: string) {
    try {
      const updatedMovies = watchedMovies.filter((movie) => movie.id !== movieId);
      await AsyncStorage.setItem("watchedMovies", JSON.stringify(updatedMovies));
      setWatchedMovies(updatedMovies);
    } catch (error) {
      console.error("Erro ao remover filme assistido:", error);
    }
  }

  async function loadWantToWatchMovies() {
    try {
      const stored = await AsyncStorage.getItem("wantToWatchMovies");
      if (stored) {
        const movies = JSON.parse(stored);
        setWantToWatchMovies(movies);
      }
    } catch (error) {
      console.error("Erro ao carregar filmes que quero assistir:", error);
    }
  }

  async function addWantToWatchMovie(movie: Movie) {
    try {
      const updatedMovies = [...wantToWatchMovies, movie];
      await AsyncStorage.setItem("wantToWatchMovies", JSON.stringify(updatedMovies));
      setWantToWatchMovies(updatedMovies);
    } catch (error) {
      console.error("Erro ao adicionar filme que quero assistir:", error);
    }
  }

  async function removeWantToWatchMovie(movieId: string) {
    try {
      const updatedMovies = wantToWatchMovies.filter((movie) => movie.id !== movieId);
      await AsyncStorage.setItem("wantToWatchMovies", JSON.stringify(updatedMovies));
      setWantToWatchMovies(updatedMovies);
    } catch (error) {
      console.error("Erro ao remover filme que quero assistir:", error);
    }
  }

  function isMovieWatched(movieId: string): boolean {
    return watchedMovies.some((movie) => movie.id === movieId);
  }

  function isMovieWantToWatch(movieId: string): boolean {
    return wantToWatchMovies.some((movie) => movie.id === movieId);
  }

  return (
    <MoviesContext.Provider
      value={{
        watchedMovies,
        wantToWatchMovies,
        isLoading,
        addWatchedMovie,
        removeWatchedMovie,
        addWantToWatchMovie,
        removeWantToWatchMovie,
        isMovieWatched,
        isMovieWantToWatch,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  return useContext(MoviesContext);
}

