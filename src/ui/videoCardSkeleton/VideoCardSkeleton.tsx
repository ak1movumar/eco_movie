import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import scss from "./videoCardSkeleton.module.scss";

interface VideoCardSkeletonProps {
  count?: number;
}

export default function VideoCardSkeleton({ count = 4 }: VideoCardSkeletonProps) {
  return (
    <SkeletonTheme baseColor="#1a1a2e" highlightColor="#16213e">
      <div className={scss.container}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={scss.card}>
            <div className={scss.thumbnail}>
              <Skeleton height="100%" borderRadius={12} />
            </div>
            <Skeleton height={18} width="90%" style={{ marginTop: 12 }} />
            <Skeleton height={14} width="60%" style={{ marginTop: 6 }} />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

