"use client";
import { useReadMovie } from "@/hooks/read/useReadMovies";
import scss from "./home.module.scss";
import Card from "@/ui/card/Card";
import { Typewriter } from "react-simple-typewriter";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_KEY } from "@/constants/api";

export default function HomeMovie() {
  const { data: movies } = useReadMovie();
  const bannerQuotes = [
    "Welcome to TmdbMovie - Enjoy the Show!",
    "Discover Movie Magic at TmdbMovie",
    "Get Ready for Cinematic Bliss",
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  // Background carousel state
  const [tvBackdrops, setTvBackdrops] = useState<string[]>([]);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchTv = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}`,
        );
        if (!mounted) return;
        const urls: string[] = (res.data.results || [])
          .map((it: any) => it.backdrop_path || it.poster_path)
          .filter(Boolean)
          .map((p: string) => `https://image.tmdb.org/t/p/original${p}`);
        setTvBackdrops(urls);
      } catch (e) {
        // ignore
      }
    };

    fetchTv();
    return () => {
      mounted = false;
    };
  }, []);

  const movieBackdrops = useMemo(() => {
    return (movies || [])
      .map((m: any) => m.backdrop_path || m.poster_path)
      .filter(Boolean)
      .map((p: string) => `https://image.tmdb.org/t/p/original${p}`);
  }, [movies]);

  const allBackdrops = useMemo(() => {
    const merged = [...movieBackdrops, ...tvBackdrops];
    return merged.length
      ? merged
      : ["https://image.tmdb.org/t/p/w500/rMCTzLujqBbdc50D6fxrJgACDDV.jpg"];
  }, [movieBackdrops, tvBackdrops]);

  useEffect(() => {
    if (!allBackdrops.length) return;
    const id = setInterval(() => {
      setBgIndex((i) =>
        allBackdrops.length ? (i + 1) % allBackdrops.length : 0,
      );
    }, 8000);
    return () => clearInterval(id);
  }, [allBackdrops]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const currentBg = allBackdrops[bgIndex] || undefined;

  return (
    <main
      className={scss.container}
      style={
        {
          // @ts-ignore — устанавливаем CSS-переменную используемую в scss
          ["--bg-image"]: currentBg ? `url("${currentBg}")` : undefined,
        } as React.CSSProperties
      }
    >
      <div className="container">
        <div className={scss.mainContainer}>
          <span>
            <Typewriter
              words={bannerQuotes}
              loop={0}
              typeSpeed={70}
              deleteSpeed={50}
            />
          </span>

          <p>
            Millions of movies, TV shows and people to discover. Explore now
          </p>
          <div className={scss.inputs}>
            <input
              type="text"
              placeholder="Search movies or TV shows..."
              className={scss.modalInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              autoFocus
            />
            <button onClick={handleSearchSubmit}>Search</button>
          </div>
        </div>
      </div>
    </main>
  );
}
