"use client";
import { useReadMovie } from "@/hooks/read/useReadMovies";
import scss from "./home.module.scss";
import Card from "@/ui/card/Card";
import { Typewriter } from "react-simple-typewriter";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_KEY, BASE_HOST } from "@/constants/api";
import { getTmdbImageUrl } from "@/utils/apiClient";

const BANNER_QUOTES = [
  "Добро пожаловать в EcoMovie - Наслаждайтесь шоу!",
  "Откройте для себя магию кино в EcoMovie",
  "Готовьтесь к кинематографическому удовольствию",
];

const BG_TRANSITION_INTERVAL = 8000; // интервал смены фонового изображения (мс)
const FALLBACK_IMAGE =
  "https://image.tmdb.org/t/p/w500/rMCTzLujqBbdc50D6fxrJgACDDV.jpg";

export default function HomeMovie() {
  const { data: movies } = useReadMovie();
  const [searchQuery, setSearchQuery] = useState("");
  const [tvBackdrops, setTvBackdrops] = useState<string[]>([]);
  const [bgIndex, setBgIndex] = useState(0);
  const router = useRouter();

  // Загружаем тренды ТВ-шоу для фонового слайдера
  useEffect(() => {
    let mounted = true;

    const fetchTvBackdrops = async () => {
      try {
        const res = await axios.get(
          `${BASE_HOST}/trending/tv/day?api_key=${API_KEY}&language=en-US`,
          { timeout: 10000 },
        );
        if (!mounted) return;

        // Извлекаем пути к фоновым изображениям
        const urls: string[] = (res.data.results || [])
          .map((item: any) => item.backdrop_path || item.poster_path)
          .filter(Boolean)
          .map((path: string) => getTmdbImageUrl(path, "original"));

        setTvBackdrops(urls);
      } catch (error) {
        // Игнорируем ошибки загрузки
        console.warn("Ошибка загрузки фоновых изображений ТВ:", error);
      }
    };

    fetchTvBackdrops();
    return () => {
      mounted = false;
    };
  }, []);

  // Получаем пути фоновых изображений из фильмов
  const movieBackdrops = useMemo(() => {
    return (movies || [])
      .map((m: any) => m.backdrop_path || m.poster_path)
      .filter(Boolean)
      .map((path: string) => getTmdbImageUrl(path, "original"));
  }, [movies]);

  // Объединяем фоны из фильмов и ТВ-шоу
  const allBackdrops = useMemo(() => {
    const merged = [...movieBackdrops, ...tvBackdrops];
    return merged.length ? merged : [FALLBACK_IMAGE];
  }, [movieBackdrops, tvBackdrops]);

  // Автоматически меняем фоновое изображение
  useEffect(() => {
    if (!allBackdrops.length) return;

    const timer = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % allBackdrops.length);
    }, BG_TRANSITION_INTERVAL);

    return () => clearInterval(timer);
  }, [allBackdrops]);

  // Обработчик поиска
  const handleSearch = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (searchQuery.trim()) {
          router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
          setSearchQuery("");
        }
      }
    },
    [searchQuery, router],
  );

  // Обработчик клика на кнопку поиска
  const handleSearchRequest = useCallback(() => {
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  }, [searchQuery, router]);

  const currentBg = allBackdrops[bgIndex] || undefined;

  return (
    <main
      className={scss.container}
      style={
        {
          // CSS-переменная для фонового изображения
          ["--bg-image"]: currentBg ? `url("${currentBg}")` : undefined,
        } as React.CSSProperties
      }
    >
      <div className="container">
        <div className={scss.mainContainer}>
          {/* Анимированный текст привета */}
          <span>
            <Typewriter
              words={BANNER_QUOTES}
              loop={0}
              typeSpeed={70}
              deleteSpeed={50}
            />
          </span>

          <p>
            Миллионы фильмов, ТВ-шоу и люди, которых можно открыть. Исследуйте
            сейчас
          </p>

          {/* Поле поиска */}
          <div className={scss.inputs}>
            <input
              type="text"
              placeholder="Поиск фильмов или ТВ-шоу..."
              className={scss.modalInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button onClick={handleSearchRequest} aria-label="Начать поиск">
              Поиск
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
