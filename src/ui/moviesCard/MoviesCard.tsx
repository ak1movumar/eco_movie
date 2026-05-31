"use client";
import { lazy, Suspense } from "react";
import scss from "./moviesCard.module.scss";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Card = lazy(() => import("../card/Card"));

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

interface MoviesCardProps {
  isLoading: boolean;
  data: MediaItem[];
  selected: "movie" | "tv";
}

function GridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <SkeletonTheme baseColor="#1a1a2e" highlightColor="#16213e">
      <div className={scss.grid}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={scss.skeletonCard}>
            <Skeleton height={330} borderRadius={12} />
            <Skeleton height={18} width="80%" style={{ marginTop: 10 }} />
            <Skeleton height={14} width="50%" style={{ marginTop: 5 }} />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

export default function MoviesCard({ data, isLoading, selected }: MoviesCardProps) {
  if (isLoading) return <GridSkeleton />;

  return (
    <Suspense fallback={<GridSkeleton />}>
      <div className={scss.grid}>
        {data.map((item, idx) => (
          <Card
            key={`${selected}-${item.id}-${idx}`}
            movie={item}
            selected={selected}
          />
        ))}
      </div>
    </Suspense>
  );
}
