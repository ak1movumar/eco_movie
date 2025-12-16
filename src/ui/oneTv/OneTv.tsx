"use client";

import { useOneTv } from "@/hooks/oneTv/useOneTv";
import { PiPlayCircle } from "react-icons/pi";
import scss from "./oneTv.module.scss";
import { useEffect, useState, useCallback } from "react";
import Card from "../card/Card";

interface OneTvProps {
  tvId: string;
}

export default function OneTv({ tvId }: OneTvProps) {
  const { data, isLoading, isError } = useOneTv(tvId);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const closeModal = useCallback(() => {
    setIsTrailerOpen(false);
    setSelectedVideo(null);
  }, []);
  
  const openModal = useCallback((video: any) => {
    setSelectedVideo(video);
    setIsTrailerOpen(true);
  }, []);

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
  if (isError || !data) return <h2 className={scss.error}>TV Show not found</h2>;

  const { tv, credits, videos, similar, recommendations } = data;
  
  // Фильтруем видео по YouTube и типам
  const youtubeVideos = videos.filter(
    (item: any) => item.site === "YouTube"
  );

  // Разделяем на официальные и другие
  const officialVideos = youtubeVideos.filter((item: any) => item.official === true);

  // Находим главный трейлер (официальный трейлер или первый трейлер)
  const mainTrailer = officialVideos.find((item: any) => item.type === "Trailer") ||
                      youtubeVideos.find((item: any) => item.type === "Trailer");

  // TV shows have episode_run_time as an array, get the first value or average
  const runtime = tv.episode_run_time && tv.episode_run_time.length > 0
    ? tv.episode_run_time[0]
    : null;

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
              {tv.genres?.map((g: any) => (
                <span key={g.id}>{g.name}</span>
              ))}
            </div>

            <div className={scss.ratingAndVideos}>
              <p>Rating: ⭐️ {tv.vote_average.toFixed(1)}</p>
              {mainTrailer && (
                <button
                  type="button"
                  className={scss.trailer}
                  onClick={() => openModal(mainTrailer)}
                >
                  <PiPlayCircle size={30} /> Watch Trailer
                </button>
              )}
            </div>
            <p className={scss.overview}>{tv.overview}</p>

            <div className={scss.extraInfo}>
              <p>Status: {tv.status}</p>
              <p>First Air Date: {tv.first_air_date}</p>
              {tv.number_of_seasons && (
                <p>Seasons: {tv.number_of_seasons}</p>
              )}
              {tv.number_of_episodes && (
                <p>Episodes: {tv.number_of_episodes}</p>
              )}
              {runtime && (
                <p>Episode Runtime: {runtime} min</p>
              )}
            </div>
          </div>
        </div>

        {officialVideos.length > 0 && (
          <div className={scss.videosSection}>
            <div className={scss.videoGroup}>
              <h2>Official Videos</h2>
              <div className={scss.videosList}>
                {officialVideos.map((video: any) => (
                  <button
                    key={video.id}
                    type="button"
                    className={`${scss.videoCard} ${
                      selectedVideo?.id === video.id ? scss.active : ""
                    }`}
                    onClick={() => openModal(video)}
                  >
                    <PiPlayCircle size={24} />
                    <div className={scss.videoInfo}>
                      <span className={scss.videoName}>{video.name}</span>
                      <span className={scss.videoType}>{video.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {similar && similar.length > 0 && (
          <div className={scss.similarSection}>
            <h2>Similar</h2>
            <div className={scss.similarList}>
              {similar.slice(0, 20).map((item: any) => (
                <Card key={item.id} movie={item} selected="tv" />
              ))}
            </div>
          </div>
        )}

        {recommendations && recommendations.length > 0 && (
          <div className={scss.recommendationsSection}>
            <h2>Recommendations</h2>
            <div className={scss.recommendationsList}>
              {recommendations.slice(0, 20).map((item: any) => (
                <Card key={item.id} movie={item} selected="tv" />
              ))}
            </div>
          </div>
        )}

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

      {isTrailerOpen && selectedVideo && (
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
                src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
                title={selectedVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className={scss.videoTitle}>{selectedVideo.name}</div>
          </div>
        </div>
      )}
    </section>
  );
}

