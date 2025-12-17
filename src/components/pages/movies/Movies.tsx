"use client";
import { useReadAllMovies } from "@/hooks/readAllMovies/useReadAllMovies";
import scss from "./movies.module.scss";
import MoviesCard from "@/ui/moviesCard/MoviesCard";

export default function Movies() {
  const { data: movies, isLoading, isError, error } = useReadAllMovies();
  
  if (isError) {
    console.error("Ошибка загрузки фильмов:", error);
  }

  return (
    <div className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <div className={scss.top}>
            <h2>Explore Movies</h2>
            <div className={scss.selects}>
              <select>
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
              <select>
                <option value="">Sort by</option>
                <option value="action">Action</option>
                <option value="action">Action</option>
                <option value="action">Action</option>
                <option value="action">Action</option>
                <option value="action">Action</option>
                <option value="action">Action</option>
                <option value="action">Action</option>
                <option value="action">Action</option>
                <option value="action">Action</option>
              </select>
            </div>
          </div>
          <div className={scss.movies}>
            {
              <MoviesCard
                isLoading={isLoading}
                data={movies ?? []}
                title="Movies"
                toggle="day | week"
                selected="movie" // кош
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
