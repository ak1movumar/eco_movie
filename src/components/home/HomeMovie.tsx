"use client";
import { useReadMovie } from "@/hooks/read/useReadMovies";
import scss from "./home.module.scss";
import Card from "@/ui/card/Card";
import { Typewriter } from "react-simple-typewriter";

export default function HomeMovie() {
  // const {data: movies} = useReadMovie()
  const bannerQuotes = [
    "Welcome to TmdbMovie - Enjoy the Show!",
    "Discover Movie Magic at TmdbMovie",
    "Get Ready for Cinematic Bliss",
  ];

  return (
    <main className={scss.container}>
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
              placeholder="Search for a movie or tv show>..."
            />
            <button>Search</button>
          </div>
        </div>
        <div className={scss.movies}>
          {/* {movies?.map((movie: any) => (
            <Card key={movie.id} movie={movie} selected="movie" />
          ))} */}
        </div>
      </div>
    </main>
  );
}
