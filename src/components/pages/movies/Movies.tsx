"use client";
import { useReadAllMovies } from "@/hooks/readAllMovies/useReadAllMovies";
import scss from "./movies.module.scss";
import MoviesCard from "@/ui/moviesCard/MoviesCard";
import { useMemo, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";

export default function Movies() {
  const { data: movies, isLoading } = useReadAllMovies();
  // console.log(movies);

  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  const genresMap: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
  };

  const filteredAndSortedMovies = useMemo(() => {
    if (!movies) return [];

    let result = [...movies];

    if (selectedGenre) {
      result = result.filter((item) =>
        item.genre_ids?.some(
          (id: number) =>
            genresMap[id]?.toLowerCase() === selectedGenre.toLowerCase()
        )
      );
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === "date") {
      result.sort(
        (a, b) =>
          new Date(b.first_air_date).getTime() -
          new Date(a.first_air_date).getTime()
      );
    }

    return result;
  }, [movies, selectedGenre, sortBy]);

  return (
    <div className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <div className={scss.top}>
            <h2>Explore Movies</h2>
            <div className={scss.selects}>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">Select genres</option>
                <option value="action">Action</option>
                <option value="adventure">Adventure</option>
                <option value="animation">Animation</option>
                <option value="comedy">Comedy</option>
                <option value="crime">Crime</option>
                <option value="documentary">Documentary</option>
                <option value="drama">Drama</option>
                <option value="family">Family</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Default</option>
                <option value="rating">Sort by Rating</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>
          </div>
          <div className={scss.movies}>
            {
              <MoviesCard
                isLoading={isLoading}
                data={filteredAndSortedMovies ?? []}
                title="Movies"
                toggle="day | week"
                selected="movie"
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
