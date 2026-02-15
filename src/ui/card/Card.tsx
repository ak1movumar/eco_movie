"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, memo } from "react";
import Image from "next/image";
import scss from "./card.module.scss";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { formatDate, getRatingColor, formatRating } from "@/utils/formatters";
import { getTmdbImageUrl } from "@/utils/apiClient";

interface ICard {
  id: number;
  poster_path: string;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
}

interface CardProps {
  movie: ICard;
  selected: "movie" | "tv";
}

// Константы
const PLACEHOLDER_IMAGE = "/placeholder-poster.jpg";

/**
 * Компонент карточки фильма/шоу с изображением, рейтингом и информацией
 */
const Card = memo(({ movie, selected }: CardProps) => {
  const { push } = useRouter();

  // Определяем отображаемое имя
  const displayTitle = useMemo(
    () => movie.title || movie.name || "Untitled",
    [movie.title, movie.name],
  );

  // Форматируем дату
  const displayDate = useMemo(() => {
    const rawDate = movie.release_date || movie.first_air_date || "N/A";
    return formatDate(rawDate);
  }, [movie.release_date, movie.first_air_date]);

  // Закругляем рейтинг
  const rating = useMemo(
    () => formatRating(movie.vote_average || 0),
    [movie.vote_average],
  );

  // Получаем URL постера
  const posterUrl = useMemo(
    () => getTmdbImageUrl(movie.poster_path) || PLACEHOLDER_IMAGE,
    [movie.poster_path],
  );

  // Обработчик навигации
  const handleNavigate = useCallback(() => {
    push(`/${selected}/${movie.id}`);
  }, [push, selected, movie.id]);

  // Обработчик клавиш
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNavigate();
      }
    },
    [handleNavigate],
  );

  return (
    <article
      className={scss.card}
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Просмотр информации о ${displayTitle}`}
    >
      <div className={scss.imageWrapper}>
        <Image
          src={posterUrl}
          alt={displayTitle}
          width={220}
          height={330}
          sizes="(max-width: 480px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 180px, 220px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAUABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAQFBgP/xAAjEAACAQQBBAMAAAAAAAAAAAABAgMABAUREiExQQYTIlFh/8QAFgEBAQEAAAAAAAAAAAAAAAAAAgAB/8QAGREAAwEBAQAAAAAAAAAAAAAAAAECERIh/9oADAMBAAIRAxEAPwDn5TkryLJbvG8kaAKGPfJ61z8dykl1mY/dZVt5ZpXLuU6x16VXuoIb/LwwSyO0jt3bvT+Hw4s7U3UcmIuLxz16lBU0rbdUTFppaA8hx/IJgfOYiU/F2BDgfprTkIUsgMjBAe/xqpo0dF+BH//Z"
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
    </article>
  );
});

Card.displayName = "Card";

export default Card;
