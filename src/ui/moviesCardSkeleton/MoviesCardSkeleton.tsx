import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import scss from "./moviesCardSkeleton.module.scss";

interface MoviesCardSkeletonProps {
  count?: number;
}

export default function MoviesCardSkeleton({ count = 20 }: MoviesCardSkeletonProps) {
  return (
    <SkeletonTheme baseColor="#1a1a2e" highlightColor="#16213e">
      <div className={scss.container}>
        <div className={scss.grid}>
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className={scss.card}>
              <Skeleton height={300} borderRadius={12} />
              <div className={scss.content}>
                <Skeleton height={20} width="80%" style={{ marginTop: "12px" }} />
                <Skeleton height={16} width="60%" style={{ marginTop: "8px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
}

