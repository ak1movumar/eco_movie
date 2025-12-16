"use client";
import { MovieType } from "@/constants/movieType";
import Card from "../card/Card";
import scss from "./sectionCard.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";

interface SectionCardProps {
  title: string;
  toggle: string;
  isLoading: boolean;
  data: MovieType[];
  onToggle?: () => void;
  selected?: "movie" | "tv";
}

export default function SectionCard({
  title,
  toggle,
  data,
  isLoading,
  onToggle,
  selected = "movie",
}: SectionCardProps) {
  return (
    <div className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <div className={scss.top}>
            <h3>{title}</h3>
            {onToggle && (
              <button onClick={onToggle}>
                {toggle === "day" ? "week" : "day"}
              </button>
            )}
          </div>

          <div className={scss.list}>
            <button className={`btn-prev ${scss["btn-prev"]}`}>{"<-"}</button>
            <button className={`btn-next ${scss["btn-next"]}`}>{"->"}</button>
            {isLoading ? (
              <h1>Loading...</h1>
            ) : (
              <Swiper
                modules={[Navigation ]}
                navigation={{
                  nextEl: ".btn-next",
                  prevEl: ".btn-prev",
                }}
                spaceBetween={16}
                slidesPerView={5}
                breakpoints={{
                  1400: { slidesPerView: 6, spaceBetween: 20 },
                  1200: { slidesPerView: 5, spaceBetween: 18 },
                  1024: { slidesPerView: 4, spaceBetween: 16 },
                  768: { slidesPerView: 3, spaceBetween: 14 },
                  560: { slidesPerView: 2, spaceBetween: 12 },
                  0: { slidesPerView: 2, spaceBetween: 10 },
                }}>
                {data?.map((item: MovieType, idx: number) => (
                  <SwiperSlide key={item.id ?? idx}>
                    <Card selected={selected} movie={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
