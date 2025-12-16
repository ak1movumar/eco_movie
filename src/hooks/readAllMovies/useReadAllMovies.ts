"use client";
import { API_KEY } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Ограничиваем количество страниц для оптимизации
const INITIAL_PAGES = 5; // Загружаем только первые 5 страниц (100 фильмов)
const PAGE_SIZE = 20;

interface UseReadAllMoviesOptions {
  page?: number;
  pagesToLoad?: number;
}

export const useReadAllMovies = (options: UseReadAllMoviesOptions = {}) => {
  const { page = 1, pagesToLoad = INITIAL_PAGES } = options;

  return useQuery({
    queryKey: ["allMovies", page, pagesToLoad],
    queryFn: async () => {
      try {
        // Загружаем страницы последовательно или небольшими батчами
        const endPage = Math.min(page + pagesToLoad - 1, 500); // TMDB ограничение
        const requests: Promise<any>[] = [];

        // Ограничиваем одновременные запросы до 3 для избежания rate limiting
        const CONCURRENT_LIMIT = 3;
        
        for (let i = page; i <= endPage; i++) {
          requests.push(
            axios.get(
              `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&page=${i}`,
              {
                timeout: 10000, // 10 секунд таймаут
                headers: {
                  'Accept': 'application/json',
                },
              }
            ).catch((error) => {
              console.error(`Ошибка загрузки страницы ${i}:`, error.message);
              // Возвращаем пустой результат вместо ошибки
              return { data: { results: [] } };
            })
          );

          // Выполняем запросы батчами по CONCURRENT_LIMIT
          if (requests.length >= CONCURRENT_LIMIT || i === endPage) {
            const batchResponses = await Promise.all(requests);
            const batchMovies = batchResponses.flatMap((res) => res.data?.results || []);
            
            // Если это не последний батч, очищаем массив для следующего батча
            if (i < endPage) {
              requests.length = 0;
              // Небольшая задержка между батчами
              await new Promise(resolve => setTimeout(resolve, 200));
              continue;
            }

            return batchMovies;
          }
        }

        const responses = await Promise.all(requests);
        const allMovies = responses.flatMap((res) => res.data?.results || []);

        return allMovies;
      } catch (error: any) {
        console.error("Ошибка загрузки фильмов:", error);
        throw new Error(
          error.response?.status === 429
            ? "Слишком много запросов. Пожалуйста, попробуйте позже."
            : error.message || "Не удалось загрузить фильмы"
        );
      }
    },
    retry: 2, // Повторяем попытку максимум 2 раза
    retryDelay: 1000, // Задержка 1 секунда между попытками
    staleTime: 5 * 60 * 1000, // Кэшируем на 5 минут
  });
};
