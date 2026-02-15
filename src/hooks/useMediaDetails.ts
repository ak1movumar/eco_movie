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
 * Функция для безопасной загрузки данных с повторами
 */
const fetchWithRetry = async (url: string, maxRetries = 3): Promise<any> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(url, {
        timeout: 10000, // 10 секунд timeout
      });
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      // Экспоненциальная задержка перед повтором
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000),
      );
    }
  }
  throw new Error("Max retries exceeded");
};

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
      try {
        // Загружаем основные данные (критичные)
        const [media, credits, videos] = await Promise.all([
          fetchWithRetry(
            `${BASE_HOST}/${type}/${id}?api_key=${API_KEY}&language=en-US`,
          ),
          fetchWithRetry(
            `${BASE_HOST}/${type}/${id}/credits?api_key=${API_KEY}&language=en-US`,
          ),
          fetchWithRetry(
            `${BASE_HOST}/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`,
          ),
        ]);

        // Загружаем дополнительные данные (не критичные) отдельно
        let similarData: any = { data: { results: [] } };
        let recommendationsData: any = { data: { results: [] } };

        try {
          const similarRes = await fetchWithRetry(
            `${BASE_HOST}/${type}/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`,
          );
          similarData = similarRes;
        } catch (error) {
          console.warn("Ошибка загрузки похожих фильмов:", error);
        }

        try {
          const recommendationsRes = await fetchWithRetry(
            `${BASE_HOST}/${type}/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`,
          );
          recommendationsData = recommendationsRes;
        } catch (error) {
          console.warn("Ошибка загрузки рекомендаций:", error);
        }

        return {
          media: media?.data || {},
          credits: credits?.data?.cast ? credits.data.cast.slice(0, 8) : [],
          videos: videos?.data?.results || [],
          similar: similarData?.data?.results || [],
          recommendations: recommendationsData?.data?.results || [],
        };
      } catch (error) {
        console.error("Критическая ошибка загрузки медиа:", error);
        throw error;
      }
    },
    retry: 2, // Повторять запрос 2 раза если ошибка
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
