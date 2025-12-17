import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import scss from "./detailsSkeleton.module.scss";

export default function DetailsSkeleton() {
  return (
    <SkeletonTheme baseColor="#1a1a2e" highlightColor="#16213e">
      <div className={scss.container}>
        {/* Backdrop */}
        <div className={scss.backdrop}>
          <Skeleton height="100%" />
        </div>

        <div className="container">
          {/* Main Content */}
          <div className={scss.mainContent}>
            <div className={scss.poster}>
              <Skeleton height={420} width={280} borderRadius={12} />
            </div>

            <div className={scss.details}>
              <Skeleton height={40} width="70%" />
              
              <div className={scss.genres}>
                <Skeleton height={30} width={80} borderRadius={20} />
                <Skeleton height={30} width={100} borderRadius={20} />
                <Skeleton height={30} width={70} borderRadius={20} />
              </div>

              <div className={scss.rating}>
                <Skeleton height={24} width={120} />
                <Skeleton height={45} width={160} borderRadius={8} />
              </div>

              <div className={scss.overview}>
                <Skeleton count={4} />
              </div>

              <div className={scss.extraInfo}>
                <Skeleton height={20} width={150} />
                <Skeleton height={20} width={180} />
                <Skeleton height={20} width={120} />
              </div>
            </div>
          </div>

          {/* Videos Section */}
          <div className={scss.section}>
            <Skeleton height={30} width={200} style={{ marginBottom: 20 }} />
            <div className={scss.videosList}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={scss.videoCard}>
                  <Skeleton height={157} borderRadius={12} />
                  <Skeleton height={18} width="90%" style={{ marginTop: 12 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Similar Section */}
          <div className={scss.section}>
            <Skeleton height={30} width={150} style={{ marginBottom: 20 }} />
            <div className={scss.cardsList}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={scss.card}>
                  <Skeleton height={345} borderRadius={12} />
                  <Skeleton height={18} width="80%" style={{ marginTop: 10 }} />
                  <Skeleton height={14} width="50%" style={{ marginTop: 5 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Cast Section */}
          <div className={scss.section}>
            <Skeleton height={30} width={120} style={{ marginBottom: 20 }} />
            <div className={scss.castList}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={scss.castCard}>
                  <Skeleton circle height={150} width={150} />
                  <Skeleton height={16} width={100} style={{ marginTop: 10 }} />
                  <Skeleton height={14} width={80} style={{ marginTop: 5 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

