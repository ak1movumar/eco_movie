"use client";
import { API_KEY } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type MediaType = "movie" | "tv";

export const usePopular = () => {
  const [mediaType, setMediaType] = useState<MediaType>("movie");

  const query = useQuery({
    queryKey: ["popular", mediaType],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/${mediaType}/popular?api_key=${API_KEY}`
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
