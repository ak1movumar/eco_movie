"use client";
import { useRouter } from "next/navigation";
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

const Card = ({ movie, selected }: CardProps) => {
  const { push } = useRouter();

  // Movie же TV аты
  const displayTitle = movie.title || movie.name || "Untitled";

  // Movie же TV дата
  const displayDate = movie.release_date || movie.first_air_date || "N/A";

  const rating = movie.vote_average || 0;

  return (
    <div className={scss.card} onClick={() => push(`/${selected}/${movie.id}`)}>
      <Image
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={displayTitle}
        width={220}
        height={330}
        placeholder="empty"
        quality={75}
        loading="lazy"
        // loading="eager"
      />

      {movie.vote_average !== undefined && (
        <div className={scss.scale}>
          <CircularProgressbar
            value={rating}
            maxValue={10}
            text={rating.toFixed(1)}
            styles={buildStyles({
              textSize: "30px",
              pathColor:
                rating >= 7 ? "#21d07a" : rating >= 5 ? "#d2d531" : "#db2360",
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
};

export default Card;
