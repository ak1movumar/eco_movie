"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, memo } from "react";
import Image from "next/image";
import scss from "./card.module.scss";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

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

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const getRatingColor = (rating: number): string => {
  if (rating >= 7) return "#21d07a";
  if (rating >= 5) return "#d2d531";
  return "#db2360";
};

const Card = memo(({ movie, selected }: CardProps) => {
  const { push } = useRouter();

  const displayTitle = useMemo(
    () => movie.title || movie.name || "Untitled",
    [movie.title, movie.name],
  );
  const displayDate = useMemo(
    () => movie.release_date || movie.first_air_date || "N/A",
    [movie.release_date, movie.first_air_date],
  );
  const rating = useMemo(() => movie.vote_average || 0, [movie.vote_average]);

  const handleNavigate = useCallback(() => {
    push(`/${selected}/${movie.id}`);
  }, [push, selected, movie.id]);

  return (
    <div
      className={scss.card}
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleNavigate()}
    >
      <Image
        src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
        alt={displayTitle}
        width={220}
        height={330}
        placeholder="empty"
        quality={75}
        loading="lazy"
      />

      {movie.vote_average !== undefined && (
        <div className={scss.scale}>
          <CircularProgressbar
            value={rating}
            maxValue={10}
            text={rating.toFixed(1)}
            styles={buildStyles({
              textSize: "30px",
              pathColor: getRatingColor(rating),
              textColor: "#fff",
              trailColor: "#333",
              backgroundColor: "#101c3a",
            })}
          />
        </div>
      )}

      <div className={scss.title}>
        <h4>{displayTitle}</h4>
        <p>{displayDate}</p>
      </div>
    </div>
  );
});

Card.displayName = "Card";

export default Card;
