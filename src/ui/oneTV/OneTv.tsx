"use client";

import { useParams } from "next/navigation";
import { useOneTv } from "@/hooks/oneTv/useOneTv";
import { PiPlayCircle } from "react-icons/pi";
import scss from "../oneMovie/oneMovie.module.scss";
import { useEffect, useState, useCallback } from "react";
import CardTwo from "../cardtwo/CardTwo";

export default function OneTv() {
  const { id } = useParams();
  const { data, isLoading, isError } = useOneTv(id as string);
  const [activeVideoKey, setActiveVideoKey] = useState<string | null>(null);

  const closeModal = useCallback(() => setActiveVideoKey(null), []);
  const openModal = useCallback((key: string) => setActiveVideoKey(key), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (activeVideoKey) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeVideoKey, closeModal]);

  if (isLoading) return <h2 className={scss.loading}>Loading...</h2>;
  if (isError || !data) return <h2 className={scss.error}>TV Show not found</h2>;

  const { tv, credits, videos, similar, recommendations } = data;
  const trailer = videos.find(
    (item: any) => item.type === "Trailer" && item.site === "YouTube"
  );

  return (
    <section className={scss.container}>
      <div className={scss.backdrop}>
        <img
          src={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
          alt={tv.name}
        />
      </div>

      <div className="container">
        <div className={scss.mainContent}>
          <div className={scss.poster}>
            <img
              src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
              alt={tv.name}
            />
          </div>

          <div className={scss.details}>
            <h1>
              {tv.name} <span>({tv.first_air_date?.split("-")[0]})</span>
            </h1>

            <div className={scss.genres}>
              {tv.genres?.map((item: any) => (
                <span key={item.id}>{item.name}</span>
              ))}
            </div>

            {trailer && (
              <div>
                <p>Rating: {tv.vote_average.toFixed(1)}</p>
                <button
                  type="button"
                  className={scss.trailer}
                  onClick={() => openModal(trailer.key)}
                >
                  <PiPlayCircle size={30} /> Watch Trailer
                </button>
              </div>
            )}
            <p className={scss.overview}>{tv.overview}</p>

            <div className={scss.extraInfo}>
              <p>Status: {tv.status}</p>
              <p>First Air Date: {tv.first_air_date}</p>
              <p>Episodes: {tv.number_of_episodes}</p>
              <p>Seasons: {tv.number_of_seasons}</p>
            </div>
          </div>
        </div>

        <div className={scss.castSection}>
          <h2>Top Cast</h2>
          <div className={scss.casts}>
            {credits.map((item: any) => (
              <div key={item.id} className={scss.cast}>
                <img
                  src={
                    item.profile_path
                      ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
                      : "/no-image.jpg"
                  }
                  alt={item.name}
                />
                <h4>{item.name}</h4>
                <p>{item.character}</p>
              </div>
            ))}
          </div>
        </div>

        {similar?.length > 0 && (
          <div className={scss.section}>
            <h2>Similar TV Shows</h2>
            <div className={scss.gridCards}>
              {similar.map((item: any) => (
                <CardTwo key={`similar-${item.id}`} movie={item} selected="tv" />
              ))}
            </div>
          </div>
        )}

        {recommendations?.length > 0 && (
          <div className={scss.section}>
            <h2>Recommendations</h2>
            <div className={scss.gridCards}>
              {recommendations.map((item: any) => (
                <CardTwo key={`rec-${item.id}`} movie={item} selected="tv" />
              ))}
            </div>
          </div>
        )}
      </div>

      {activeVideoKey && (
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
                src={`https://www.youtube.com/embed/${activeVideoKey}?autoplay=1`}
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
