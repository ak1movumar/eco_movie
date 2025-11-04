"use client";
import { useRouter } from "next/navigation";
import scss from "./card.module.scss";

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

const Card = ({ movie, selected }: CardProps) => {
  const { push } = useRouter();

  // Movie же TV аты
  const displayTitle = movie.title || movie.name || "Untitled";

  // Movie же TV дата
  const displayDate = movie.release_date || movie.first_air_date || "N/A";

  return (
    <div
      className={scss.card}
      onClick={() => push(`/${selected}/${movie.id}`)}
    >
      <img
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
        alt={displayTitle}
        width={220}
        // 
      />

      {movie.vote_average !== undefined && (
        <div className={scss.scale}>{movie.vote_average.toFixed(1)}</div>
      )}

      {/* {movie.genre_ids && (
        <div className={scss.genres}>
          {movie.genre_ids.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      )} */}

      <div className={scss.title}>
        <h4>{displayTitle}</h4>
        <p>{displayDate}</p>
      </div>
    </div>
  );
};

export default Card;
