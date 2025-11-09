"use client";
import { useRouter } from "next/navigation";
import scss from "./cardtwo.module.scss";
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

const CardTwo = ({ movie, selected }: CardProps) => {
  const { push } = useRouter();

  const displayTitle = movie.title || movie.name || "Untitled";

  const displayDate = movie.release_date || movie.first_air_date || "N/A";

  return (
    <div className={scss.card} onClick={() => push(`/${selected}/${movie.id}`)}>
      <img
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
        alt={displayTitle}
        // width={200}
        //
      />

      {movie.vote_average !== undefined && (
        <div className={scss.scale}>
          <CircularProgressbar
            value={movie.vote_average}
            maxValue={10}
            text={movie.vote_average.toFixed(1)}
            styles={buildStyles({
              textSize: "30px",
              pathColor:
                movie.vote_average >= 8
                  ? "blue"
                  : movie.vote_average >= 7
                  ? "#21d07a"
                  : movie.vote_average >= 5
                  ? "#d2d531"
                  : "#db2360",
              textColor: "#000",
              trailColor: "#fff",
              backgroundColor: "#101c3a",
            })}
          />
        </div>
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

export default CardTwo;
