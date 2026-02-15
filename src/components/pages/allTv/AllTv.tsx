"use client";
import { useState, useMemo, useEffect } from "react";
import { useReadAllTv } from "@/hooks/readAllTv/useReadAllTv";
import scss from "./allTv.module.scss";
import MoviesCard from "@/ui/moviesCard/MoviesCard";
import { FiArrowUp } from "react-icons/fi";
import { useInView } from "react-intersection-observer";

// Соответствие ID жанров TMDB с названиями
const GENRES_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
};

const GENRE_OPTIONS = Object.entries(GENRES_MAP).map(([id, name]) => ({
  value: name.toLowerCase(),
  label: name,
}));

const SORT_OPTIONS = [
  { value: "", label: "Сортировка по умолчанию" },
  { value: "rating", label: "По рейтингу" },
  { value: "date", label: "По дате выхода" },
];

/**
 * Компонент для отображения всех ТВ-шоу с фильтрацией и сортировкой
 */
export default function AllTv() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useReadAllTv();

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const { ref, inView } = useInView();

  // Автоматически загружаем следующую страницу при пролистывании
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Показываем кнопку "Вверх" при прокрутке больше чем на 300px
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Плавная прокрутка к началу страницы
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Объединяем все страницы результатов в один массив
  const allTv = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.results || []);
  }, [data]);

  // Фильтруем и сортируем ТВ-шоу
  const filteredAndSortedTv = useMemo(() => {
    let result = [...allTv];

    // Фильтрация по жанру
    if (selectedGenre) {
      result = result.filter((item) =>
        item.genre_ids?.some(
          (id: number) =>
            GENRES_MAP[id]?.toLowerCase() === selectedGenre.toLowerCase(),
        ),
      );
    }

    // Сортировка
    if (sortBy === "rating") {
      result.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (sortBy === "date") {
      result.sort(
        (a, b) =>
          new Date(b.first_air_date || 0).getTime() -
          new Date(a.first_air_date || 0).getTime(),
      );
    }

    return result;
  }, [allTv, selectedGenre, sortBy]);

  return (
    <div className={scss.container}>
      <div className="container">
        <div className={scss.mainContainer}>
          <div className={scss.top}>
            <h2>Исследовать ТВ-шоу</h2>
            <div className={scss.selects}>
              {/* Фильтр по жанру */}
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                aria-label="Выбрать жанр"
              >
                <option value="">Все жанры</option>
                {GENRE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Параметры сортировки */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Выбрать сортировку"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Сетка ТВ-шоу */}
          <div className={scss.movies}>
            <MoviesCard
              isLoading={isLoading}
              data={filteredAndSortedTv}
              title="ТВ-шоу"
              toggle="day | week"
              selected="tv"
            />
          </div>

          {/* Триггер для бесконечной прокрутки */}
          <div ref={ref} style={{ height: "20px", margin: "20px 0" }}>
            {isFetchingNextPage && (
              <p style={{ textAlign: "center", color: "#ccc" }}>
                Загрузка дополнительных ТВ-шоу...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Кнопка для прокрутки в начало */}
      {showScrollTop && (
        <button
          className={scss.scrollToTop}
          onClick={scrollToTop}
          aria-label="Прокрутить в начало"
          title="Вернуться в начало"
        >
          <FiArrowUp />
        </button>
      )}
    </div>
  );
}
