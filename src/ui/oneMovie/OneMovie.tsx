"use client";

import { useOneMovie } from "@/hooks/oneMovie/useOneMovie";
import { useMemo } from "react";
import MediaDetails from "../MediaDetails/MediaDetails";

interface OneMovieProps {
  movieId: string;
}

/**
 * Компонент для отображения полной информации о фильме
 */
export default function OneMovie({ movieId }: OneMovieProps) {
  const { data, isLoading, isError } = useOneMovie(movieId);

  // Преобразуем данные из формата хука в формат компонента MediaDetails
  const adaptedData = useMemo(() => {
    if (!data) return undefined;

    return {
      media: data.media,
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
