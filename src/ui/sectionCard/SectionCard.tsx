"use client";
import { MovieType } from "@/constants/movieType";
import { lazy, Suspense, useRef } from "react";
import scss from "./sectionCard.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import CardSkeleton from "../cardSkeleton/CardSkeleton";

const Card = lazy(() => import("../card/Card"));

interface SectionCardProps {
  title: string;
  period?: "day" | "week";
  mediaType?: "movie" | "tv";
  isLoading: boolean;
  data: MovieType[];
  onPeriodChange?: (value: "day" | "week") => void;
  onMediaChange?: (value: "movie" | "tv") => void;
}


export default function SectionCard({
  title,
  period = "day",
  mediaType = "movie",
  data,
  isLoading,
  onPeriodChange,
  onMediaChange,
}: SectionCardProps) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          {/* ===== TOP ===== */}
          <div className={scss.top}>
            <h3>{title}</h3>

            <div className={scss.toggles}>
              {/* DAY / WEEK */}
              {onPeriodChange && (
                <div className={scss.toggleGroup}>
                  <button
                    className={period === "day" ? scss.active : ""}
                    onClick={() => onPeriodChange("day")}
                  >
                    Day
                  </button>
                  <button
                    className={period === "week" ? scss.active : ""}
                    onClick={() => onPeriodChange("week")}
                  >
                    Week
                  </button>
                </div>
              )}

              {/* MOVIE / TV */}
              {onMediaChange && (
                <div className={scss.toggleGroup}>
                  <button
                    className={mediaType === "movie" ? scss.active : ""}
                    onClick={() => onMediaChange("movie")}
                  >
                    Movies
                  </button>
                  <button
                    className={mediaType === "tv" ? scss.active : ""}
                    onClick={() => onMediaChange("tv")}
                  >
                    TV Shows
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ===== LIST ===== */}
          <div className={scss.list}>
            <button ref={prevRef} className={scss["btn-prev"]}>←</button>
            <button ref={nextRef} className={scss["btn-next"]}>→</button>

            {isLoading ? (
              <CardSkeleton count={6} />
            ) : (
              <Suspense fallback={<CardSkeleton count={6} />}>
                <Swiper
                  modules={[Navigation]}
                  onBeforeInit={(swiper) => {
                    // @ts-ignore
                    swiper.params.navigation.prevEl = prevRef.current;
                    // @ts-ignore
                    swiper.params.navigation.nextEl = nextRef.current;
                  }}
                  navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }}
                  spaceBetween={16}
                  slidesPerView={2}
                  breakpoints={{
                    1400: { slidesPerView: 6 },
                    1200: { slidesPerView: 5 },
                    1024: { slidesPerView: 4 },
                    768: { slidesPerView: 3 },
                    560: { slidesPerView: 2 },
                  }}
                >
                  {data.map((item) => (
                    <SwiperSlide key={item.id}>
                      <Card selected={mediaType} movie={item} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
