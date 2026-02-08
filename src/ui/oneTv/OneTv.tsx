"use client";

import { useOneTv } from "@/hooks/oneTv/useOneTv";
import { useMemo } from "react";
import MediaDetails from "../MediaDetails/MediaDetails";

interface OneTvProps {
  tvId: string;
}

export default function OneTv({ tvId }: OneTvProps) {
  const { data, isLoading, isError } = useOneTv(tvId);

  // Преобразуем данные из формата API в формат компонента
  const adaptedData = useMemo(() => {
    if (!data) return undefined;

    return {
      media: data.tv, // переименовываем tv -> media
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
      mediaType="tv"
    />
  );
}