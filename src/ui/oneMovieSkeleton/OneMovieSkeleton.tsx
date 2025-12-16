import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import scss from "./oneMovieSkeleton.module.scss";

export default function OneMovieSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1a2e" highlightColor="#16213e">
      <div className={scss.container}>
        <div className={scss.backdrop}>
          <Skeleton height="100vh" />
        </div>

        <div className="container">
          <div className={scss.mainContent}>
            <div className={scss.poster}>
              <Skeleton height={750} width={500} borderRadius={12} />
            </div>

            <div className={scss.details}>
              <Skeleton height={48} width="70%" style={{ marginBottom: "16px" }} />
              
              <div className={scss.genres}>
                <Skeleton width={80} height={32} borderRadius={20} />
                <Skeleton width={70} height={32} borderRadius={20} />
                <Skeleton width={90} height={32} borderRadius={20} />
              </div>

              <Skeleton height={24} width="40%" style={{ marginTop: "20px" }} />
              
              <Skeleton count={4} style={{ marginTop: "20px" }} />
              
              <div className={scss.extraInfo}>
                <Skeleton height={20} width="30%" />
                <Skeleton height={20} width="35%" />
                <Skeleton height={20} width="25%" />
              </div>
            </div>
          </div>

          <div className={scss.castSection}>
            <Skeleton height={32} width="150px" style={{ marginBottom: "20px" }} />
            <div className={scss.casts}>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className={scss.cast}>
                  <Skeleton circle width={185} height={185} />
                  <Skeleton height={20} width={120} style={{ marginTop: "10px" }} />
                  <Skeleton height={16} width={100} style={{ marginTop: "8px" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

