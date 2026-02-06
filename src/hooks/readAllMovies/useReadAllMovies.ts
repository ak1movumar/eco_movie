"use client";
import { API_KEY } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useReadAllMovies = () => {
  return useQuery({
    queryKey: ["allMovies"],
    queryFn: async () => {
      const allMovies = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&page=${page}`,
          );

          allMovies.push(...(response.data.results || []));

          // TMDB API does not allow page > 500 — cap total pages and guard missing values
          const totalPages: number = Math.min(
            Number(response.data?.total_pages) || page,
            500,
          );

          if (page >= totalPages) {
            hasMore = false;
          } else {
            page++;
          }
        } catch (error) {
          console.error(`Error fetching movies page ${page}:`, error);
          hasMore = false;
        }
      }

      return allMovies;
    },
  });
};
