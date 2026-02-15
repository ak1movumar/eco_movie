// Хук для загрузки популярного контента
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_KEY, BASE_HOST } from "@/constants/api";
import { useState } from "react";

type MediaType = "movie" | "tv";

/**
 * Хук для загрузки популярного контента с возможностью выбора типа медиа
 * @returns объект с данными, статусом и методом изменения типа медиа
 */
export const usePopular = () => {
  const [mediaType, setMediaType] = useState<MediaType>("movie");

  const query = useQuery({
    queryKey: ["popular", mediaType],
    queryFn: async () => {
      const response = await axios.get(
        `${BASE_HOST}/${mediaType}/popular?api_key=${API_KEY}&language=en-US`,
      );
      return response.data.results;
    },
  });

  return {
    ...query,
    mediaType,
    setMediaType,
  };
};
