"use client";

import { useOneMovie } from "@/hooks/oneMovie/useOneMovie";
import { useMemo } from "react";
import MediaDetails from "../MediaDetails/MediaDetails";

interface OneMovieProps {
  movieId: string;
}

export default function OneMovie({ movieId }: OneMovieProps) {
  const { data, isLoading, isError } = useOneMovie(movieId);

  // Преобразуем данные из формата API в формат компонента
  const adaptedData = useMemo(() => {
    if (!data) return undefined;

    return {
      media: data.movie, // переименовываем movie -> media
      credits: data.credits,
      videos: data.videos,
      similar: data.similar,
      recommendations: data.recommendations,
    };
  }, [data]);

  return (
    <MediaDetails
      data={adaptedData}
      isLoading={isLoading}
      isError={isError}
      mediaType="movie"
    />
  );
}