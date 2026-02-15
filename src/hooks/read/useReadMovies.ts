// Хук для загрузки трендовых фильмов
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_KEY, BASE_HOST } from "@/constants/api";
import { useState } from "react";

type Period = "day" | "week";

/**
 * Хук для загрузки трендовых фильмов с возможностью выбора периода
 * @returns объект с данными фильмов, статусом и методом изменения периода
 */
export const useReadMovie = () => {
  const [period, setPeriod] = useState<Period>("day");

  const query = useQuery({
    queryKey: ["trending", "movie", period],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${BASE_HOST}/trending/movie/${period}?api_key=${API_KEY}&language=en-US`,
          { timeout: 10000 },
        );
        return response.data.results || [];
      } catch (error) {
        console.error("Ошибка загрузки трендовых фильмов:", error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    ...query,
    period,
    setPeriod,
  };
};
