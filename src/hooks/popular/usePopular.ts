"use client";
import { API_KEY } from "@/constants/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type TogglePopular = "Movies" | "TV Shows";

export const usePopular = () => {
  const [toggle, setToggle] = useState<TogglePopular>("Movies");
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["popular", toggle],
    queryFn: async () => {
      const type = toggle === "Movies" ? "movie" : "tv";
      const response = await axios.get(
        `https://api.themoviedb.org/3/${type}/popular?api_key=${API_KEY}`
      );
      return response.data.results;
    },
  });

  const handleToggle = () => {
    const newToggle = toggle === "Movies" ? "TV Shows" : "Movies";
    setToggle(newToggle);
    queryClient.invalidateQueries({ queryKey: ["popular", newToggle] });
  };

  return { ...query, toggle, handleToggle };
};
