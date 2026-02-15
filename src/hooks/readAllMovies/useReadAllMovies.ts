// Хук для загрузки всех фильмов с пагинацией
"use client";
import { useMediaPagination } from "../useMediaPagination";

/**
 * Хук для загрузки всех доступных фильмов с воможностью пролистывания
 * @returns объект с данными, статусом и методом загрузки следующей страницы
 */
export const useReadAllMovies = () => {
  return useMediaPagination({
    endpoint: "discover",
    mediaType: "movie",
    queryKey: ["allMovies"],
  });
};
