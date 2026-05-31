"use client";
import { useMediaDetails, MediaDetailsResponse } from "../useMediaDetails";

export const useOneMovie = (
  id: string | number,
  initialData?: MediaDetailsResponse,
) => {
  return useMediaDetails(id, "movie", initialData);
};
