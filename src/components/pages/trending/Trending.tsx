"use client";
import { useReadMovie } from "@/hooks/read/useReadMovies";
import SectionCard from "@/ui/sectionCard/SectionCard";

const Trending = () => {
  const {
    data: trendingMovies,
    isLoading,
    period,
    setPeriod,
  } = useReadMovie();

  return (
    <SectionCard
      title="Trending"
      isLoading={isLoading}
      data={trendingMovies}
      period={period}
      onPeriodChange={setPeriod}
    />
  );
};

export default Trending;
