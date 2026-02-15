// Универсальный хук для загрузки деталей медиа (фильм или ТВ-шоу)
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_KEY, BASE_HOST } from "@/constants/api";

type MediaType = "movie" | "tv";

interface MediaDetailsResponse {
  media: any;
  credits: any[];
  videos: any[];
  similar: any[];
  recommendations: any[];
}

/**
 * Универсальный хук для загрузки деталей медиа на основе типа
 * @param id - ID медиа
 * @param type - тип медиа ('movie' или 'tv')
 * @returns объект с данными, статусом загрузки и ошибками
 */
export const useMediaDetails = (id: string | number, type: MediaType) => {
  return useQuery({
    queryKey: [type, id],
    queryFn: async (): Promise<MediaDetailsResponse> => {
      // Параллельная загрузка всех необходимых данных
      const [media, credits, videos, similar, recommendations] =
        await Promise.all([
          axios.get(
            `${BASE_HOST}/${type}/${id}?api_key=${API_KEY}&language=en-US`,
          ),
          axios.get(
            `${BASE_HOST}/${type}/${id}/credits?api_key=${API_KEY}&language=en-US`,
          ),
          axios.get(
            `${BASE_HOST}/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`,
          ),
          axios.get(
            `${BASE_HOST}/${type}/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`,
          ),
          axios.get(
            `${BASE_HOST}/${type}/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`,
          ),
        ]);

      return {
        media: media.data,
        credits: credits.data.cast.slice(0, 8), // первые 8 актёров
        videos: videos.data.results,
        similar: similar.data.results,
        recommendations: recommendations.data.results,
      };
    },
  });
};
