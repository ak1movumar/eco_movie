// Хук для загрузки деталей ТВ-шоу
"use client";
import { useMediaDetails } from "../useMediaDetails";

/**
 * Хук для загрузки полной информации о ТВ-шоу (детали, актёры, видео и рекомендации)
 * @param id - ID ТВ-шоу
 * @returns объект с данными ТВ-шоу, статусом загрузки и ошибками
 */
export const useOneTv = (id: string | number) => {
  return useMediaDetails(id, "tv");
};
