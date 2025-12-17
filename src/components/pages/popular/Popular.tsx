"use client";
import SectionCard from "@/ui/sectionCard/SectionCard";
import { usePopular } from "@/hooks/popular/usePopular";

export default function Popular() {
  const {
    data: popularMovies,
    isLoading,
    mediaType,
    setMediaType,
  } = usePopular();

  return (
    <SectionCard
      title="Popular"
      isLoading={isLoading}
      data={popularMovies || []}
      mediaType={mediaType}
      onMediaChange={setMediaType}
    />
  );
}
