import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import scss from "./cardSkeleton.module.scss";

interface CardSkeletonProps {
  count?: number;
}

export default function CardSkeleton({ count = 5 }: CardSkeletonProps) {
  return (
    <SkeletonTheme baseColor="#1a1a2e" highlightColor="#16213e">
      <div className={scss.container}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={scss.card}>
            <Skeleton height={400} borderRadius={12} />
            <div className={scss.rating}>
              <Skeleton circle width={45} height={45} />
            </div>
            <div className={scss.title}>
              <Skeleton height={20} width="80%" />
              <Skeleton height={16} width="60%" style={{ marginTop: "8px" }} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

