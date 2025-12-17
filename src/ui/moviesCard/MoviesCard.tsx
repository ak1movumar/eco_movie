"use client";
import { lazy, Suspense } from "react";
import scss from "./moviesCard.module.scss";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Card = lazy(() => import("../card/Card"));

interface MediaType {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
}

interface MoviesCardProps {
  title: string;
  toggle: string;
  isLoading: boolean;
  data: MediaType[];
  selected: "movie" | "tv";
}

function GridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <SkeletonTheme baseColor="#1a1a2e" highlightColor="#16213e">
      <div className={scss.skeletonList}>
        {Array.from({ length: count }).map((_, i) => (
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

export default function MoviesCard({
  data,
  isLoading,
  selected,
}: MoviesCardProps) {
  return (
    <div className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <div className={scss.list}>
            {isLoading ? (
              <GridSkeleton count={20} />
            ) : (
              <Suspense fallback={<GridSkeleton count={20} />}>
                {data.map((item: MediaType, idx: number) => (
                  <Card
                    key={`${selected}-${item?.id}-${idx}`}
                    movie={item}
                    selected={selected}
                  />
                ))}
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
