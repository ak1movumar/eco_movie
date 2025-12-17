"use client";

import { useOneMovie } from "@/hooks/oneMovie/useOneMovie";
import { PiPlayCircle } from "react-icons/pi";
import scss from "./oneMovie.module.scss";
import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import Image from "next/image";
import DetailsSkeleton from "../detailsSkeleton/DetailsSkeleton";
import CardSkeleton from "../cardSkeleton/CardSkeleton";

const Card = lazy(() => import("../card/Card"));

interface OneMovieProps {
  movieId: string;
}

export default function OneMovie({ movieId }: OneMovieProps) {
  const { data, isLoading, isError } = useOneMovie(movieId);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  if (isLoading) return <DetailsSkeleton />;
  if (isError || !data) return <h2 className={scss.error}>Movie not found</h2>;

  const { movie, credits, videos, similar, recommendations } = data;

  // Фильтруем видео по YouTube и типам
  const youtubeVideos = videos.filter((item: any) => item.site === "YouTube");

  // Разделяем на официальные и другие
  const officialVideos = youtubeVideos.filter(
    (item: any) => item.official === true
  );

  // Находим главный трейлер (официальный трейлер или первый трейлер)
  const mainTrailer =
    officialVideos.find((item: any) => item.type === "Trailer") ||
    youtubeVideos.find((item: any) => item.type === "Trailer");

  return (
    <section className={scss.container}>
      <div className={scss.backdrop}>
        <Image
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt={movie.title}
          fill
          priority
          quality={75}
          sizes="100vw"
          style={{ objectFit: "cover" }}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="container">
        <div className={scss.mainContent}>
          <div className={scss.poster}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={280}
              height={420}
              quality={85}
              loading="eager"
              style={{ borderRadius: 12 }}
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

            <div className={scss.ratingAndVideos}>
              <p>Rating: ⭐️ {movie.vote_average.toFixed(1)}</p>
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
            <p className={scss.overview}>{movie.overview}</p>

            <div className={scss.extraInfo}>
              <p>Status: {movie.status}</p>
              <p>Release Date: {movie.release_date}</p>
              <p>Runtime: {movie.runtime} min</p>
            </div>
          </div>
        </div>

        {officialVideos.length > 0 && (
          <div className={scss.videosSection}>
            <h2>Official Videos</h2>
            <div className={scss.videosList}>
              {officialVideos.map((video: any) => (
                <div
                  key={video.id}
                  className={`${scss.videoCard} ${
                    selectedVideo?.id === video.id ? scss.active : ""
                  }`}
                  onClick={() => openModal(video)}
                >
                  <div className={scss.videoThumbnail}>
                    <Image
                      src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                      alt={video.name}
                      fill
                      sizes="280px"
                      quality={75}
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                    />
                    <div className={scss.playIcon}>
                      <PiPlayCircle size={50} />
                    </div>
                  </div>
                  <p className={scss.videoName}>{video.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {similar && similar.length > 0 && (
          <div className={scss.similarSection}>
            <h2>Similar</h2>
            <div className={scss.similarList}>
              <Suspense fallback={<CardSkeleton count={6} />}>
                {similar.slice(0, 20).map((item: any) => (
                  <Card key={item.id} movie={item} selected="movie" />
                ))}
              </Suspense>
            </div>
          </div>
        )}

        {recommendations && recommendations.length > 0 && (
          <div className={scss.recommendationsSection}>
            <h2>Recommendations</h2>
            <div className={scss.recommendationsList}>
              <Suspense fallback={<CardSkeleton count={6} />}>
                {recommendations.slice(0, 20).map((item: any) => (
                  <Card key={item.id} movie={item} selected="movie" />
                ))}
              </Suspense>
            </div>
          </div>
        )}

        <div className={scss.castSection}>
          <h2>Top Cast</h2>
          <div className={scss.casts}>
            {credits.map((actor: any) => (
              <div key={actor.id} className={scss.cast}>
                <Image
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : "/no-image.jpg"
                  }
                  alt={actor.name}
                  width={150}
                  height={150}
                  quality={75}
                  loading="lazy"
                  style={{ borderRadius: "50%", objectFit: "cover" }}
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
