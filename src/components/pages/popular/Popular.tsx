"use client";
import SectionCard from "@/ui/sectionCard/SectionCard";
import { usePopular } from "@/hooks/popular/usePopular";

export default function Popular() {
  const { data: popularMovies, isLoading, toggle, handleToggle } = usePopular();

  return (
    <SectionCard
      isLoading={isLoading}
      data={popularMovies || []}
      title={`Popular (${toggle})`}
      toggle={toggle}
      onToggle={handleToggle}
      selected={toggle === "Movies" ? "movie" : "tv"}
      key={0}
    />
  );
}
