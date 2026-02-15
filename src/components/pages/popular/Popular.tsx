"use client";
import SectionCard from "@/ui/sectionCard/SectionCard";
import { usePopular } from "@/hooks/popular/usePopular";

/**
 * Компонент для отображения популярного контента с выбором типа медиа
 */
export default function Popular() {
  const {
    data: popularMovies,
    isLoading,
    mediaType,
    setMediaType,
  } = usePopular();

  return (
    <SectionCard
      title="Популярное"
      isLoading={isLoading}
      data={popularMovies || []}
      mediaType={mediaType}
      onMediaChange={setMediaType}
    />
  );
}
