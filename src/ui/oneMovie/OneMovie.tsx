"use client";

import { useEffect } from "react";
import { useOneMovie } from "@/hooks/oneMovie/useOneMovie";
import { MediaDetailsResponse } from "@/hooks/useMediaDetails";
import MediaDetails from "../MediaDetails/MediaDetails";

interface OneMovieProps {
  movieId: string;
  initialData?: MediaDetailsResponse;
}

export default function OneMovie({ movieId, initialData }: OneMovieProps) {
  const { data, isLoading, isError } = useOneMovie(movieId, initialData);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [movieId]);

  return (
    <MediaDetails
      data={data}
      isLoading={isLoading}
      isError={isError}
      mediaType="movie"
    />
  );
}
