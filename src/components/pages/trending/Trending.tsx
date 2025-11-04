"use client";
import { useReadMovie } from "@/hooks/read/useReadMovies";
import SectionCard from "@/ui/sectionCard/SectionCard";

const Trending = () => {
  const {
    data: trendingMovies,
    isLoading,
    toggle,
    handleToggle,
  } = useReadMovie();

  return (
    <SectionCard
      isLoading={isLoading}
      data={trendingMovies}
      title={`Trending (${toggle})`}
      toggle={toggle}
      onToggle={handleToggle}
    />
  );
};

export default Trending;
