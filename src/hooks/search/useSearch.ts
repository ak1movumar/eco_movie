// Хук для поиска фильмов и ТВ-шоу
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_KEY, BASE_HOST } from "@/constants/api";

/**
 * Хук для поиска фильмов и ТВ-шоу по запросу
 * @param query - поисковый запрос
 * @returns объект с результатами поиска, статусом и ошибками
 */
export const useSearch = (query: string) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      // Проверка валидности запроса
      if (!query || query.trim() === "") {
        return { movies: [], tv: [] };
      }

      // Параллельный поиск фильмов и ТВ-шоу
      const encodedQuery = encodeURIComponent(query.trim());
      const [moviesRes, tvRes] = await Promise.all([
        axios.get(
          `${BASE_HOST}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodedQuery}&page=1`,
        ),
        axios.get(
          `${BASE_HOST}/search/tv?api_key=${API_KEY}&language=en-US&query=${encodedQuery}&page=1`,
        ),
      ]);

      return {
        movies: moviesRes.data.results,
        tv: tvRes.data.results,
      };
    },
    // Запрос активирует только если есть непустой запрос
    enabled: !!query && query.trim() !== "",
  });
};
