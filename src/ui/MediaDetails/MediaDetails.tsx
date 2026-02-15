"use client";

import { PiPlayCircle } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import scss from "./mediaDetails.module.scss";
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

interface BaseMedia {
  backdrop_path: string;
  poster_path: string;
  genres: Genre[];
  vote_average: number;
  overview: string;
  status: string;
}

interface Movie extends BaseMedia {
  title: string;
  release_date: string;
  runtime: number;
}

interface TvShow extends BaseMedia {
  name: string;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
}

interface MediaData {
  media: Movie | TvShow;
  credits: Cast[];
  videos: Video[];
  similar: any[];
  recommendations: any[];
}

interface MediaDetailsProps {
  data: MediaData | undefined;
  isLoading: boolean;
  isError: boolean;
  mediaType: "movie" | "tv";
}

// Constants
const YOUTUBE_THUMBNAIL_BASE = "https://img.youtube.com/vi";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
const PLACEHOLDER_AVATAR = "/no-avatar.jpg";

// Helper functions
const filterYoutubeVideos = (videos: Video[]) =>
  videos?.filter((video) => video.site === "YouTube") || [];

const filterOfficialVideos = (videos: Video[]) =>
  videos?.filter((video) => video.official === true) || [];

const findMainTrailer = (officialVideos: Video[], youtubeVideos: Video[]) =>
  officialVideos.find((video) => video.type === "Trailer") ||
  youtubeVideos.find((video) => video.type === "Trailer");

const formatRuntime = (minutes: number): string => {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

// Type guards
const isMovie = (media: Movie | TvShow): media is Movie => {
  return "title" in media;
};

const isTvShow = (media: Movie | TvShow): media is TvShow => {
  return "name" in media;
};

export default function MediaDetails({
  data,
  isLoading,
  isError,
  mediaType,
}: MediaDetailsProps) {
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
  if (isError || !data)
    return (
      <div className={scss.error}>
        <h2>{mediaType === "movie" ? "Movie" : "TV Show"} not found</h2>
        <p>The content you're looking for doesn't exist or has been removed.</p>
      </div>
    );

  const { media, credits, videos, similar, recommendations } = data;

  const youtubeVideos = filterYoutubeVideos(videos);
  const officialVideos = filterOfficialVideos(youtubeVideos);
  const mainTrailer = findMainTrailer(officialVideos, youtubeVideos);

  // Get title and date based on media type
  const title = isMovie(media) ? media.title : media.name;
  const releaseDate = isMovie(media)
    ? media.release_date
    : media.first_air_date;
  const year = releaseDate?.split("-")[0] || "N/A";

  return (
    <article className={scss.container}>
      {/* Backdrop */}
      <div className={scss.backdrop}>
        <Image
          src={`${TMDB_IMAGE_BASE}/original${media.backdrop_path}`}
          alt={`${title} backdrop`}
          fill
          priority
          quality={75}
          sizes="100vw"
          className={scss.backdropImage}
        />
        <div className={scss.backdropGradient} />
      </div>

      <div className="container">
        {/* Main Content */}
        <div className={scss.mainContent}>
          <div className={scss.posterWrapper}>
            <Image
              src={`${TMDB_IMAGE_BASE}/w500${media.poster_path}`}
              alt={`${title} poster`}
              width={300}
              height={450}
              quality={75}
              priority
              className={scss.poster}
            />
          </div>

          <div className={scss.details}>
            <h1 className={scss.mediaTitle}>
              {title}
              <span className={scss.year}>({year})</span>
            </h1>

            {media.genres && media.genres.length > 0 && (
              <div className={scss.genres}>
                {media.genres.map((genre) => (
                  <span key={genre.id} className={scss.genre}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div className={scss.metadata}>
              {media.vote_average > 0 && (
                <div className={scss.rating}>
                  <span className={scss.ratingIcon}>⭐</span>
                  <span className={scss.ratingValue}>
                    {media.vote_average.toFixed(1)}
                  </span>
                  <span className={scss.ratingMax}>/10</span>
                </div>
              )}

              {mainTrailer && (
                <button
                  type="button"
                  className={scss.trailerButton}
                  onClick={() => openModal(mainTrailer)}
                  aria-label="Watch trailer"
                >
                  <PiPlayCircle size={24} />
                  <span>Watch Trailer</span>
                </button>
              )}
            </div>

            {media.overview && (
              <div className={scss.overviewSection}>
                <h2 className={scss.sectionTitle}>Overview</h2>
                <p className={scss.overview}>{media.overview}</p>
              </div>
            )}

            <div className={scss.mediaInfo}>
              {media.status && (
                <div className={scss.infoItem}>
                  <span className={scss.infoLabel}>Status</span>
                  <span className={scss.infoValue}>{media.status}</span>
                </div>
              )}

              <div className={scss.infoItem}>
                <span className={scss.infoLabel}>
                  {mediaType === "movie" ? "Release Date" : "First Air Date"}
                </span>
                <span className={scss.infoValue}>
                  {formatDate(releaseDate)}
                </span>
              </div>

              {/* Movie-specific info */}
              {isMovie(media) && media.runtime > 0 && (
                <div className={scss.infoItem}>
                  <span className={scss.infoLabel}>Runtime</span>
                  <span className={scss.infoValue}>
                    {formatRuntime(media.runtime)}
                  </span>
                </div>
              )}

              {/* TV Show-specific info */}
              {isTvShow(media) && (
                <>
                  {media.number_of_seasons > 0 && (
                    <div className={scss.infoItem}>
                      <span className={scss.infoLabel}>Seasons</span>
                      <span className={scss.infoValue}>
                        {media.number_of_seasons}
                      </span>
                    </div>
                  )}

                  {media.number_of_episodes > 0 && (
                    <div className={scss.infoItem}>
                      <span className={scss.infoLabel}>Episodes</span>
                      <span className={scss.infoValue}>
                        {media.number_of_episodes}
                      </span>
                    </div>
                  )}

                  {media.episode_run_time?.length > 0 && (
                    <div className={scss.infoItem}>
                      <span className={scss.infoLabel}>Episode Runtime</span>
                      <span className={scss.infoValue}>
                        {formatRuntime(media.episode_run_time[0])}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Official Videos */}
        {officialVideos.length > 0 && (
          <section className={scss.section}>
            <h2 className={scss.sectionHeading}>Official Videos</h2>
            <div className={scss.horizontalScroll}>
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
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && openModal(video)
                  }
                >
                  <div className={scss.videoThumbnail}>
                    <Image
                      src={`${YOUTUBE_THUMBNAIL_BASE}/${video.key}/mqdefault.jpg`}
                      alt={video.name}
                      fill
                      sizes="(max-width: 480px) 200px, (max-width: 768px) 240px, 280px"
                      quality={75}
                      loading="lazy"
                    />
                    <div className={scss.playOverlay}>
                      <PiPlayCircle size={56} />
                    </div>
                  </div>
                  <p className={scss.videoName}>{video.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Top Cast */}
        {credits && credits.length > 0 && (
          <section className={scss.section}>
            <h2 className={scss.sectionHeading}>Top Cast</h2>
            <div className={scss.horizontalScroll}>
              {credits.slice(0, 20).map((actor) => (
                <div key={actor.id} className={scss.castCard}>
                  <div className={scss.castImage}>
                    <Image
                      src={
                        actor.profile_path
                          ? `${TMDB_IMAGE_BASE}/w185${actor.profile_path}`
                          : PLACEHOLDER_AVATAR
                      }
                      alt={actor.name}
                      width={150}
                      height={150}
                      quality={75}
                      loading="lazy"
                      unoptimized={!actor.profile_path}
                    />
                  </div>
                  <h4 className={scss.castName}>{actor.name}</h4>
                  <p className={scss.castCharacter}>{actor.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar */}
        {similar && similar.length > 0 && (
          <section className={scss.section}>
            <h2 className={scss.sectionHeading}>
              {mediaType === "movie" ? "Similar Movies" : "Similar Shows"}
            </h2>
            <div className={scss.horizontalScroll}>
              <Suspense fallback={<CardSkeleton count={6} />}>
                {similar.slice(0, 20).map((item) => (
                  <Card key={item.id} movie={item} selected={mediaType} />
                ))}
              </Suspense>
            </div>
          </section>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <section className={scss.section}>
            <h2 className={scss.sectionHeading}>Recommendations</h2>
            <div className={scss.horizontalScroll}>
              <Suspense fallback={<CardSkeleton count={6} />}>
                {recommendations.slice(0, 20).map((item) => (
                  <Card key={item.id} movie={item} selected={mediaType} />
                ))}
              </Suspense>
            </div>
          </section>
        )}
      </div>

      {/* Video Modal */}
      {isTrailerOpen && selectedVideo && (
        <div
          className={scss.modal}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="trailer-title"
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
              <IoClose size={32} />
            </button>

            <div className={scss.videoContainer}>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1&rel=0`}
                title={selectedVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <h3 id="trailer-title" className={scss.modalTitle}>
              {selectedVideo.name}
            </h3>
          </div>
        </div>
      )}
    </article>
  );
}
