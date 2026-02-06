"use client";
import { useState, useMemo, useEffect } from "react";
import { useReadAllTv } from "@/hooks/readAllTv/useReadAllTv";
import scss from "./allTv.module.scss";
import MoviesCard from "@/ui/moviesCard/MoviesCard";
import { FiArrowUp } from "react-icons/fi";

export default function AllTv() {
  const { data: tv, isLoading } = useReadAllTv();
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  // состояние фильтра и сортировки
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  // Маппинг жанров (примерный, можно расширить)
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

  // фильтрация и сортировка данных
  const filteredAndSortedTv = useMemo(() => {
    if (!tv) return [];

    let result = [...tv];

    // фильтр по жанру
    if (selectedGenre) {
      result = result.filter((item) =>
        item.genre_ids?.some(
          (id: number) =>
            genresMap[id]?.toLowerCase() === selectedGenre.toLowerCase(),
        ),
      );
    }

    // сортировка
    if (sortBy === "rating") {
      result.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === "date") {
      result.sort(
        (a, b) =>
          new Date(b.first_air_date).getTime() -
          new Date(a.first_air_date).getTime(),
      );
    }

    return result;
  }, [tv, selectedGenre, sortBy]);

  return (
    <div className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <div className={scss.top}>
            <h2>Explore TV Shows</h2>
            <div className={scss.selects}>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">All genres</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Animation">Animation</option>
                <option value="Comedy">Comedy</option>
                <option value="Crime">Crime</option>
                <option value="Documentary">Documentary</option>
                <option value="Drama">Drama</option>
                <option value="Family">Family</option>
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
              data={filteredAndSortedTv}
              title="All TV Shows"
              toggle="day | week"
              selected="tv"
            />
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
