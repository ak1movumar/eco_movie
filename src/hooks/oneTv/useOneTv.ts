"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_KEY } from "@/constants/api";

export const useOneTv = (id: string | number) => {
  return useQuery({
    queryKey: ["oneTv", id],
    queryFn: async () => {
      const [tv, credits, videos, similar, recommendations] = await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`
        ),
        axios.get(
          `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}&language=en-US`
        ),
        axios.get(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=en-US`
        ),
        axios.get(
          `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`
        ),
        axios.get(
          `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
        ),
      ]);

      return {
        tv: tv.data,
        credits: credits.data.cast.slice(0, 8),
        videos: videos.data.results,
        similar: similar.data.results?.slice(0, 12) ?? [],
        recommendations: recommendations.data.results?.slice(0, 12) ?? [],
      };
    },
  });
};
