// Хук для загрузки деталей фильма
"use client";
import { useMediaDetails } from "../useMediaDetails";

/**
 * Хук для загрузки полной информации о фильме (детали, актёры, видео и рекомендации)
 * @param id - ID фильма
 * @returns объект с данными фильма, статусом загрузки и ошибками
 */
export const useOneMovie = (id: string | number) => {
  return useMediaDetails(id, "movie");
};
