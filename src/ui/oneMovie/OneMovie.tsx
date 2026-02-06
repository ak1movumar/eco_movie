"use client";

import { useOneMovie } from "@/hooks/oneMovie/useOneMovie";
import { PiPlayCircle } from "react-icons/pi";
import scss from "./oneMovie.module.scss";
import { useEffect, useCallback, lazy, Suspense, useState } from "react";
import Image from "next/image";
import DetailsSkeleton from "../detailsSkeleton/DetailsSkeleton";
import CardSkeleton from "../cardSkeleton/CardSkeleton";

const Card = lazy(() => import("../card/Card"));

// Types
interface Video {
  id: string;
  name: string;
  key: string;
  site: string;
  type: string;
  official: boolean;
}

interface Genre {
  id: number;
  name: string;
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Movie {
  title: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  genres: Genre[];
  vote_average: number;
  overview: string;
  status: string;
  runtime: number;
}

interface MovieData {
  movie: Movie;
  credits: Cast[];
  videos: Video[];
  similar: any[];
  recommendations: any[];
}

interface OneMovieProps {
  movieId: string;
}

// Constants
const YOUTUBE_THUMBNAIL_BASE = "https://img.youtube.com/vi";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// Helper functions
const filterYoutubeVideos = (videos: Video[]) =>
  videos.filter((video) => video.site === "YouTube");

const filterOfficialVideos = (videos: Video[]) =>
  videos.filter((video) => video.official === true);

const findMainTrailer = (officialVideos: Video[], youtubeVideos: Video[]) =>
  officialVideos.find((video) => video.type === "Trailer") ||
  youtubeVideos.find((video) => video.type === "Trailer");

export default function OneMovie({ movieId }: OneMovieProps) {
  const { data, isLoading, isError } = useOneMovie(movieId);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const closeModal = useCallback(() => {
    setIsTrailerOpen(false);
    setSelectedVideo(null);
  }, []);

  const openModal = useCallback((video: Video) => {
    setSelectedVideo(video);
    setIsTrailerOpen(true);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    if (isTrailerOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [isTrailerOpen, closeModal]);

  if (isLoading) return <DetailsSkeleton />;
  if (isError || !data) return <h2 className={scss.error}>Movie not found</h2>;

  const { movie, credits, videos, similar, recommendations } =
    data as MovieData;

  const youtubeVideos = filterYoutubeVideos(videos);
  const officialVideos = filterOfficialVideos(youtubeVideos);
  const mainTrailer = findMainTrailer(officialVideos, youtubeVideos);

  return (
    <section className={scss.container}>
      <div className={scss.backdrop}>
        <Image
          src={`${TMDB_IMAGE_BASE}/w1280${movie.backdrop_path}`}
          alt={movie.title}
          fill
          priority
          quality={75}
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="container">
        <div className={scss.mainContent}>
          <div className={scss.poster}>
            <Image
              src={`${TMDB_IMAGE_BASE}/w500${movie.poster_path}`}
              alt={movie.title}
              width={280}
              height={420}
              quality={85}
              loading="eager"
            />
          </div>

          <div className={scss.details}>
            <h1>
              {movie.title} <span>({movie.release_date?.split("-")[0]})</span>
            </h1>

            <div className={scss.genres}>
              {movie.genres?.map((genre) => (
                <span key={genre.id}>{genre.name}</span>
              ))}
            </div>

            <div className={scss.ratingAndVideos}>
              <p>Rating: ⭐️ {movie.vote_average.toFixed(1)}</p>
              {mainTrailer && (
                <button
                  type="button"
                  className={scss.trailer}
                  onClick={() => openModal(mainTrailer)}
                  aria-label="Watch trailer"
                >
                  <PiPlayCircle size={30} /> Watch Trailer
                </button>
              )}
            </div>

            <p className={scss.overview}>{movie.overview}</p>

            <div className={scss.extraInfo}>
              <p>
                <strong>Status:</strong> {movie.status}
              </p>
              <p>
                <strong>Release Date:</strong> {movie.release_date}
              </p>
              <p>
                <strong>Runtime:</strong> {movie.runtime} min
              </p>
            </div>
          </div>
        </div>

        {officialVideos.length > 0 && (
          <div className={scss.videosSection}>
            <h2>Official Videos</h2>
            <div className={scss.videosList}>
              {officialVideos.map((video) => (
                <div
                  key={video.id}
                  className={`${scss.videoCard} ${
                    selectedVideo?.id === video.id ? scss.active : ""
                  }`}
                  onClick={() => openModal(video)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Play ${video.name}`}
                  onKeyDown={(e) => e.key === "Enter" && openModal(video)}
                >
                  <div className={scss.videoThumbnail}>
                    <Image
                      src={`${YOUTUBE_THUMBNAIL_BASE}/${video.key}/mqdefault.jpg`}
                      alt={video.name}
                      fill
                      sizes="280px"
                      quality={75}
                      loading="lazy"
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
            <h2>Similar Movies</h2>
            <div className={scss.similarList}>
              <Suspense fallback={<CardSkeleton count={6} />}>
                {similar.slice(0, 20).map((item) => (
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
                {recommendations.slice(0, 20).map((item) => (
                  <Card key={item.id} movie={item} selected="movie" />
                ))}
              </Suspense>
            </div>
          </div>
        )}

        {credits.length > 0 && (
          <div className={scss.castSection}>
            <h2>Top Cast</h2>
            <div className={scss.casts}>
              {credits.map((actor) => (
                <div key={actor.id} className={scss.cast}>
                  <Image
                    src={
                      actor.profile_path
                        ? `${TMDB_IMAGE_BASE}/w185${actor.profile_path}`
                        : "/no-image.jpg"
                    }
                    alt={actor.name}
                    width={150}
                    height={150}
                    quality={75}
                    loading="lazy"
                  />
                  <h4>{actor.name}</h4>
                  <p>{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isTrailerOpen && selectedVideo && (
        <div
          className={scss.modalOverlay}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={scss.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={scss.modalClose}
              onClick={closeModal}
              aria-label="Close trailer"
              type="button"
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
            <p className={scss.videoTitle}>{selectedVideo.name}</p>
          </div>
        </div>
      )}
    </section>
  );
}
