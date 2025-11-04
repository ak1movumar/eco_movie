"use client";
import { API_KEY } from "@/constants/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useReadAllTv = () => {
  return useQuery({
    queryKey: ["allTv"],
    queryFn: async () => {
      const totalPages = 29;
      const requests = [];

      for (let i = 1; i <= totalPages; i++) {
        requests.push(
          axios.get(
            `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=en-US&page=${i}`
          )
        );
      }
      const responses = await Promise.all(requests);
      const allTv = responses.flatMap((res) => res.data.results);

      return allTv;
    },
  });
};
