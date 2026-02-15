"use client";
import { useReadMovie } from "@/hooks/read/useReadMovies";
import SectionCard from "@/ui/sectionCard/SectionCard";

/**
 * Компонент для отображения трендовых фильмов с выбором периода
 */
const Trending = () => {
  const { data: trendingMovies, isLoading, period, setPeriod } = useReadMovie();

  return (
    <SectionCard
      title="Тренды"
      isLoading={isLoading}
      data={trendingMovies}
      period={period}
      onPeriodChange={setPeriod}
    />
  );
};

export default Trending;
