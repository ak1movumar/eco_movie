"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_KEY } from "@/constants/api";

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query || query.trim() === "") {
        return { movies: [], tv: [] };
      }

      const [moviesRes, tvRes] = await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
        ),
        axios.get(
          `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
        ),
      ]);

      return {
        movies: moviesRes.data.results,
        tv: tvRes.data.results,
      };
    },
    enabled: !!query && query.trim() !== "",
  });
};

