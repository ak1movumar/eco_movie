"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchMediaData } from "@/lib/fetchMediaData";

export type { MediaType, MediaDetailsResponse } from "@/lib/fetchMediaData";

export const useMediaDetails = (
  id: string | number,
  type: "movie" | "tv",
  initialData?: import("@/lib/fetchMediaData").MediaDetailsResponse,
) => {
  return useQuery({
    queryKey: [type, id],
    queryFn: () => fetchMediaData(id, type),
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    retryDelay: 2000,
  });
};
