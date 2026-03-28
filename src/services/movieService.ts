import axios from "axios";
import type { Movie } from "../types/movie";

interface TMDBResponse {
  results: Movie[];
  total_pages: number;
}

axios.defaults.baseURL = "https://api.themoviedb.org/3";

export const fetchMovies = async (query: string, page: number):
  Promise<Movie[]> => {
  try {
    const response = await axios.get<TMDBResponse>("/search/movie", {
      params: { query: query.trim(), page},
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    });

    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

