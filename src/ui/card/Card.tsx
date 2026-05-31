"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import scss from "./card.module.scss";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { formatDate, getRatingColor, formatRating } from "@/utils/formatters";
import { getTmdbImageUrl } from "@/utils/apiClient";
import { fetchMediaData } from "@/lib/fetchMediaData";

interface ICard {
  id: number;
  poster_path: string;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

interface CardProps {
  movie: ICard;
  selected: "movie" | "tv";
}

const PLACEHOLDER_IMAGE = "/placeholder-poster.jpg";
const BLUR_PLACEHOLDER =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAARCAAUABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAQFBgP/xAAjEAACAQQBBAMAAAAAAAAAAAABAgMABAUREiExBgYT/8QAFgEBAQEAAAAAAAAAAAAAAAAAAgAB/8QAGREAAwEBAQAAAAAAAAAAAAAAAAECERIh/9oADAMBAAIRAxEAPwDn5TkryLJbvG8kaAKGPfJ61z8dykl1mY/dZVt5ZpXLuU6x16VXuoIb/LwwSyO0jt3bvT+Hw4s7U3UcmIuLxz16lBU0rbdUTFppaA8hx/IJgfOYiU/F2BDgfprTkIUsgMjBAe/xqpo0dF+BH//Z";

const Card = memo(({ movie, selected }: CardProps) => {
  const queryClient = useQueryClient();

  const displayTitle = useMemo(
    () => movie.title || movie.name || "Untitled",
    [movie.title, movie.name],
  );

  const displayDate = useMemo(() => {
    const raw = movie.release_date || movie.first_air_date || "N/A";
    return formatDate(raw);
  }, [movie.release_date, movie.first_air_date]);

  const rating = useMemo(
    () => formatRating(movie.vote_average || 0),
    [movie.vote_average],
  );

  const posterUrl = useMemo(
    () => getTmdbImageUrl(movie.poster_path) || PLACEHOLDER_IMAGE,
    [movie.poster_path],
  );

  // Prefetch React Query data on hover so the detail page loads instantly
  const handlePrefetch = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: [selected, movie.id],
      queryFn: () => fetchMediaData(movie.id, selected),
      staleTime: 10 * 60 * 1000,
    });
  }, [queryClient, selected, movie.id]);

  return (
    <motion.article
      className={scss.card}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onMouseEnter={handlePrefetch}
    >
      <Link
        href={`/${selected}/${movie.id}`}
        className={scss.cardLink}
        aria-label={`Посмотреть ${displayTitle}`}
        prefetch={false}
      >
        <div className={scss.imageWrapper}>
          <Image
            src={posterUrl}
            alt={displayTitle}
            width={220}
            height={330}
            sizes="(max-width: 480px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 180px, 220px"
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
            quality={75}
            loading="lazy"
            className={scss.poster}
          />

          {rating > 0 && (
            <div className={scss.scale} aria-label={`Рейтинг: ${rating} из 10`}>
              <CircularProgressbar
                value={rating}
                maxValue={10}
                text={rating.toFixed(1)}
                styles={buildStyles({
                  textSize: "34px",
                  pathColor: getRatingColor(rating),
                  textColor: "#fff",
                  trailColor: "rgba(255, 255, 255, 0.1)",
                  backgroundColor: "#04152d",
                })}
              />
            </div>
          )}
        </div>

        <div className={scss.info}>
          <h3 className={scss.title}>{displayTitle}</h3>
          <time
            className={scss.date}
            dateTime={movie.release_date || movie.first_air_date}
          >
            {displayDate}
          </time>
        </div>
      </Link>
    </motion.article>
  );
});

Card.displayName = "Card";

export default Card;
