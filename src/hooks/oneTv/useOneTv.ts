"use client";
import { useMediaDetails, MediaDetailsResponse } from "../useMediaDetails";

export const useOneTv = (
  id: string | number,
  initialData?: MediaDetailsResponse,
) => {
  return useMediaDetails(id, "tv", initialData);
};
