"use client";
import { API_KEY } from "@/constants/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export const useReadAllTv = () => {
  return useInfiniteQuery({
    queryKey: ["allTv"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&page=${pageParam}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= Math.min(lastPage.total_pages, 500) ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
};