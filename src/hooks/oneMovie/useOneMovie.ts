"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_KEY } from "@/constants/api";

export const useOneMovie = (id: string | number) => {
  return useQuery({
    queryKey: ["oneMovie", id],
    queryFn: async () => {
      const [movie, credits, videos, similar, recommendations] = await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
        ),
      ]);

      return {
        movie: movie.data,
        credits: credits.data.cast.slice(0, 8),
        videos: videos.data.results,
        similar: similar.data.results,
        recommendations: recommendations.data.results,
      };
    },
  });
};
