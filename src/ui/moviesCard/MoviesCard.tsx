"use client";
import Card from "../card/Card";
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
  selected: "movie" | "tv"; // параметр
}


export default function MoviesCard({
  title,
  toggle,
  data,
  isLoading,
  selected,// колдоном
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
                <Card key={`${selected}-${item.id}-${idx}`} movie={item} selected={selected} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
