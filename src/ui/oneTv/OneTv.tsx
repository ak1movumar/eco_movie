"use client";

import { useEffect } from "react";
import { useOneTv } from "@/hooks/oneTv/useOneTv";
import { MediaDetailsResponse } from "@/hooks/useMediaDetails";
import MediaDetails from "../MediaDetails/MediaDetails";

interface OneTvProps {
  tvId: string;
  initialData?: MediaDetailsResponse;
}

export default function OneTv({ tvId, initialData }: OneTvProps) {
  const { data, isLoading, isError } = useOneTv(tvId, initialData);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [tvId]);

  return (
    <MediaDetails
      data={data}
      isLoading={isLoading}
      isError={isError}
      mediaType="tv"
    />
  );
}
