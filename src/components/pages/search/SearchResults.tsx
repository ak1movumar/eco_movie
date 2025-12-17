"use client";
import { useSearch } from "@/hooks/search/useSearch";
import { lazy, Suspense } from "react";
import scss from "./searchResults.module.scss";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Card = lazy(() => import("@/ui/card/Card"));

interface SearchResultsProps {
  query: string;
}

function SearchSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1a2e" highlightColor="#16213e">
      <div className={scss.skeletonGrid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={scss.skeletonCard}>
            <Skeleton height={345} borderRadius={12} />
            <Skeleton height={18} width="80%" style={{ marginTop: 10 }} />
            <Skeleton height={14} width="50%" style={{ marginTop: 5 }} />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

export default function SearchResults({ query }: SearchResultsProps) {
  const { data, isLoading, isError } = useSearch(query);

  if (isLoading) {
    return (
      <div className={scss.container}>
        <div className="container">
          <h1 className={scss.title}>Search results of '{query}'</h1>
          <SearchSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={scss.container}>
        <div className="container">
          <h2 className={scss.error}>Error occurred while searching</h2>
        </div>
      </div>
    );
  }

  const allResults = [
    ...(data?.movies?.map((item: any) => ({ ...item, mediaType: "movie" })) || []),
    ...(data?.tv?.map((item: any) => ({ ...item, mediaType: "tv" })) || []),
  ];

  return (
    <div className={scss.container}>
      <div className="container">
        <h1 className={scss.title}>Search results of '{query}'</h1>

        {allResults.length === 0 ? (
          <p className={scss.noResults}>No results found for '{query}'</p>
        ) : (
          <div className={scss.results}>
            <Suspense fallback={<SearchSkeleton />}>
              {allResults.map((item: any) => (
                <Card
                  key={`${item.mediaType}-${item.id}`}
                  movie={item}
                  selected={item.mediaType}
                />
              ))}
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}

