// Утилита для работы с API TMDB
import axios from "axios";
import { API_KEY, BASE_HOST } from "@/constants/api";

// Базовая конфигурация API клиента
const apiClient = axios.create({
  baseURL: BASE_HOST,
  params: {
    api_key: API_KEY,
    language: "en-US",
  },
});

/**
 * Создает параметры запроса для API
 * @param additionalParams - дополнительные параметры
 * @returns объект с параметрами запроса
 */
export const createApiParams = (additionalParams?: Record<string, any>) => ({
  ...additionalParams,
});

/**
 * Образует URL изображения TMDB
 * @param path - путь к изображению
 * @param size - размер (w500, original и т.д.)
 * @returns полный URL изображения
 */
export const getTmdbImageUrl = (
  path: string,
  size: string = "w500",
): string => {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

/**
 * Образует URL видео YouTube
 * @param videoKey - ключ видео YouTube
 * @param type - тип URL (thumbnail или embed)
 * @returns полный URL видео
 */
export const getYoutubeUrl = (
  videoKey: string,
  type: "thumbnail" | "embed" = "embed",
): string => {
  if (type === "thumbnail") {
    return `https://img.youtube.com/vi/${videoKey}/maxresdefault.jpg`;
  }
  return `https://www.youtube.com/embed/${videoKey}`;
};

export default apiClient;
