// Универсальный хук для пагинированной загрузки медиа
"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_KEY, BASE_HOST } from "@/constants/api";

type MediaType = "movie" | "tv";
type DiscoverCategory = "discover" | "trending" | "popular";

interface UseMediaPaginationProps {
  endpoint: DiscoverCategory | "discover";
  mediaType: MediaType;
  period?: "day" | "week"; // для trending
  queryKey: (string | MediaType)[];
}

/**
 * Универсальный хук для загрузки отпагинированного списка медиа
 * @param endpoint - тип эндпоинта (discover, trending, popular)
 * @param mediaType - тип медиа (movie, tv)
 * @param period - период для trending (day/week)
 * @param queryKey - уникальный ключ для кеша
 * @returns объект с данными, статусом и методами навигации
 */
export const useMediaPagination = ({
  endpoint,
  mediaType,
  period,
  queryKey,
}: UseMediaPaginationProps) => {
  const buildUrl = (pageParam: number) => {
    const baseUrl = `${BASE_HOST}/${endpoint}/${mediaType}`;
    const params = `api_key=${API_KEY}&language=en-US&page=${pageParam}`;

    if (endpoint === "trending" && period) {
      return `${BASE_HOST}/trending/${mediaType}/${period}?${params}`;
    }

    return `${baseUrl}?${params}`;
  };

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await axios.get(buildUrl(pageParam), {
          timeout: 10000,
        });
        return response.data;
      } catch (error) {
        console.error(`Ошибка загрузки ${endpoint}:`, error);
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      // максимальное количество страниц 500
      return nextPage <= Math.min(lastPage.total_pages, 500)
        ? nextPage
        : undefined;
    },
    initialPageParam: 1,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
