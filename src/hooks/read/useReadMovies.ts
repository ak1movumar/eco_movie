"use client";
import { API_KEY } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type Period = "day" | "week";

export const useReadMovie = () => {
  const [period, setPeriod] = useState<Period>("day");

  const query = useQuery({
    queryKey: ["trending", period],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/${period}?api_key=${API_KEY}`
      );
      return response.data.results;
    },
  });

  return {
    ...query,
    period,
    setPeriod,
  };
};
