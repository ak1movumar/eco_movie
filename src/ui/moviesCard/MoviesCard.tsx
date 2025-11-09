"use client";
import CardTwo from "../cardtwo/CardTwo";
import scss from "./moviesCard.module.scss";

interface MediaType {
  id: number;
  title?: string; // movie үчүн
  name?: string; // tv үчүн
  poster_path: string;
  overview: string;
  release_date?: string; // movie үчүн
  first_air_date?: string; // tv үчүн
}

interface MoviesCardProps {
  title: string;
  toggle: string;
  isLoading: boolean;
  data: MediaType[];
  selected: "movie" | "tv"; 
}


export default function MoviesCard({
  title,
  toggle,
  data,
  isLoading,
  selected,
}: MoviesCardProps) {
  return (
    <div className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <div className={scss.list}>
            {isLoading ? (
              <h1>Loading...</h1>
            ) : (
              data.map((item: MediaType, idx: number) => (
                <CardTwo key={`${selected}-${item?.id}-${idx}`} movie={item} selected={selected} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
