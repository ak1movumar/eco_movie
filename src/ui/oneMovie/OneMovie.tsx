"use client";

import { useOneMovie } from "@/hooks/oneMovie/useOneMovie";
import { PiPlayCircle } from "react-icons/pi";
import scss from "./oneMovie.module.scss";
import { useEffect, useState, useCallback } from "react";

interface OneMovieProps {
  movieId: string;
}

export default function OneMovie({ movieId }: OneMovieProps) {
  const { data, isLoading, isError } = useOneMovie(movieId);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const closeModal = useCallback(() => setIsTrailerOpen(false), []);
  const openModal = useCallback(() => setIsTrailerOpen(true), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isTrailerOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isTrailerOpen, closeModal]);

  if (isLoading) return <h2 className={scss.loading}>Loading...</h2>;
  if (isError || !data) return <h2 className={scss.error}>Movie not found</h2>;

  const { movie, credits, videos } = data;
  const trailer = videos.find(
    (item: any) => item.type === "Trailer" && item.site === "YouTube"
  );

  return (
    <section className={scss.container}>
      <div className={scss.backdrop}>
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
        />
      </div>

      <div className="container">
        <div className={scss.mainContent}>
          <div className={scss.poster}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          </div>

          <div className={scss.details}>
            <h1>
              {movie.title} <span>({movie.release_date?.split("-")[0]})</span>
            </h1>

            <div className={scss.genres}>
              {movie.genres?.map((g: any) => (
                <span key={g.id}>{g.name}</span>
              ))}
            </div>

            {trailer && (
              <div>
                <p>Rating: ⭐️ {movie.vote_average.toFixed(1)}</p>
                <button
                  type="button"
                  className={scss.trailer}
                  onClick={openModal}
                >
                  <PiPlayCircle size={30} /> Watch Trailer
                </button>
              </div>
            )}
            <p className={scss.overview}>{movie.overview}</p>

            <div className={scss.extraInfo}>
              <p>Status: {movie.status}</p>
              <p>Release Date: {movie.release_date}</p>
              <p>Runtime: {movie.runtime} min</p>
            </div>
          </div>
        </div>

        <div className={scss.castSection}>
          <h2>Top Cast</h2>
          <div className={scss.casts}>
            {credits.map((actor: any) => (
              <div key={actor.id} className={scss.cast}>
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : "/no-image.jpg"
                  }
                  alt={actor.name}
                />
                <h4>{actor.name}</h4>
                <p>{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isTrailerOpen && trailer && (
        <div className={scss.modalOverlay} onClick={closeModal}>
          <div
            className={scss.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={scss.modalClose}
              onClick={closeModal}
              aria-label="Close trailer"
            >
              ✕
            </button>
            <div className={scss.videoWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
