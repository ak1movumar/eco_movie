// Хук для загрузки всех ТВ-шоу с пагинацией
"use client";
import { useMediaPagination } from "../useMediaPagination";

/**
 * Хук для загрузки всех доступных ТВ-шоу с возможностью пролистывания
 * @returns объект с данными, статусом и методом загрузки следующей страницы
 */
export const useReadAllTv = () => {
  return useMediaPagination({
    endpoint: "discover",
    mediaType: "tv",
    queryKey: ["allTv"],
  });
};
