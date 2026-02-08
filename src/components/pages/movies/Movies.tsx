"use client";
import { useReadAllMovies } from "@/hooks/readAllMovies/useReadAllMovies";
import scss from "./movies.module.scss";
import MoviesCard from "@/ui/moviesCard/MoviesCard";
import { useMemo, useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";
import { useInView } from "react-intersection-observer";

export default function Movies() {
  const { 
    data, 
    isLoading, 
    isError, 
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useReadAllMovies();
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { ref, inView } = useInView();

  // Автозагрузка при прокрутке
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isError) {
    console.error("Ошибка загрузки фильмов:", error);
  }

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

  // Объединяем все страницы в один массив
  const allMovies = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.results || []);
  }, [data]);

  // Фильтрация и сортировка
  const filteredAndSortedMovies = useMemo(() => {
    let result = [...allMovies];

    if (selectedGenre) {
      result = result.filter((item) =>
        item.genre_ids?.some(
          (id: number) =>
            genresMap[id]?.toLowerCase() === selectedGenre.toLowerCase(),
        ),
      );
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === "date") {
      result.sort(
        (a, b) =>
          new Date(b.release_date || b.first_air_date).getTime() -
          new Date(a.release_date || a.first_air_date).getTime(),
      );
    }

    return result;
  }, [allMovies, selectedGenre, sortBy]);

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
            <MoviesCard
              isLoading={isLoading}
              data={filteredAndSortedMovies}
              title="Movies"
              toggle="day | week"
              selected="movie"
            />
          </div>

          {/* Триггер для загрузки следующей страницы */}
          <div ref={ref} style={{ height: '20px', margin: '20px 0' }}>
            {isFetchingNextPage && (
              <p style={{ textAlign: 'center' }}>Загрузка...</p>
            )}
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          className={scss.scrollToTop}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Back to top"
        >
          <FiArrowUp />
        </button>
      )}
    </div>
  );
}