"use client";
import { API_KEY } from "@/constants/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type ToggleTrend = "day" | "week";

export const useReadMovie = () => {
  const [toggle, setToggle] = useState<ToggleTrend>("day");
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["movies", toggle], 
    queryFn: async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/${toggle}?api_key=${API_KEY}`
      );
      return response.data.results;
    },
  });

  const handleToggle = () => {
    const newToggle = toggle === "day" ? "week" : "day";
    setToggle(newToggle);
    queryClient.invalidateQueries({ queryKey: ["movies", newToggle] });
  };

  return { ...query, toggle, handleToggle };
};
