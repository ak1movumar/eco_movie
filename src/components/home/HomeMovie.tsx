"use client";
import { useRouter } from "next/navigation";
import scss from "./home.module.scss";
import { Typewriter } from "react-simple-typewriter";
import { useState } from "react";

export default function HomeMovie() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const bannerQuotes = [
    "Welcome to TmdbMovie - Enjoy the Show!",
    "Discover Movie Magic at TmdbMovie",
    "Get Ready for Cinematic Bliss",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      router.push(`/searchPage?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <main
      className={scss.container}
      style={{
        backgroundImage:
          "url(https://image.tmdb.org/t/p/original/rMCTzLujqBbdc50D6fxrJgACDDV.jpg)",
      }}
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

          <form onSubmit={handleSearch} className={scss.inputs}>
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search for a movie or TV show..."
              value={searchTerm}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </div>
    </main>
  );
}
