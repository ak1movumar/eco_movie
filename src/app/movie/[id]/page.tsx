import OneMovie from "@/ui/oneMovie/OneMovie";
import type { Metadata } from "next";
import axios from "axios";
import { API_KEY } from "@/constants/api";

async function getMovieData(id: string) {
  const fetchWithRetry = async (url: string, maxRetries = 3): Promise<any> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await axios.get(url, { timeout: 10000 });
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, i) * 1000),
        );
      }
    }
    throw new Error("Max retries exceeded");
  };

  try {
    const [movie, credits, videos] = await Promise.all([
      fetchWithRetry(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`,
      ),
      fetchWithRetry(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`,
      ),
      fetchWithRetry(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`,
      ),
    ]);

    return {
      movie: movie?.data || {},
      credits: credits?.data?.cast ? credits.data.cast.slice(0, 8) : [],
      videos: videos?.data?.results || [],
    };
  } catch (error) {
    console.error("Ошибка загрузки данных фильма:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ Изменено на Promise
}): Promise<Metadata> {
  const { id } = await params; // ✅ Добавлен await
  const data = await getMovieData(id);

  if (!data || !data.movie) {
    return {
      title: "Movie Not Found",
      description: "The requested movie could not be found.",
    };
  }

  const { movie } = data;
  const title = `${movie.title} (${movie.release_date?.split("-")[0] || ""})`;
  const description =
    movie.overview ||
    `Watch ${movie.title}, a ${movie.genres?.map((g: any) => g.name).join(", ") || "movie"} released in ${movie.release_date?.split("-")[0] || ""}.`;
  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
      : "/banner.webp";

  return {
    title,
    description,
    keywords: [
      movie.title,
      ...(movie.genres?.map((g: any) => g.name) || []),
      "movie",
      "cinema",
      "film",
    ],
    openGraph: {
      title,
      description,
      type: "video.movie",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: movie.title,
        },
      ],
      releaseDate: movie.release_date,
      duration: movie.runtime,
      actors: data.credits.map((actor: any) => actor.name),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      "rating:value": movie.vote_average?.toFixed(1) || "0",
      "rating:scale": "10",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ Изменено на Promise
}) {
  const { id } = await params; // ✅ Добавлен await
  const data = await getMovieData(id);

  // Structured Data (JSON-LD) для SEO
  const structuredData =
    data && data.movie
      ? {
          "@context": "https://schema.org",
          "@type": "Movie",
          name: data.movie.title,
          description: data.movie.overview,
          image: data.movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${data.movie.backdrop_path}`
            : data.movie.poster_path
              ? `https://image.tmdb.org/t/p/original${data.movie.poster_path}`
              : undefined,
          datePublished: data.movie.release_date,
          genre: data.movie.genres?.map((g: any) => g.name) || [],
          aggregateRating: data.movie.vote_average
            ? {
                "@type": "AggregateRating",
                ratingValue: data.movie.vote_average,
                bestRating: 10,
                worstRating: 0,
                ratingCount: data.movie.vote_count || 0,
              }
            : undefined,
          duration: data.movie.runtime ? `PT${data.movie.runtime}M` : undefined,
          actor: data.credits.map((actor: any) => ({
            "@type": "Person",
            name: actor.name,
            characterName: actor.character,
          })),
        }
      : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <OneMovie movieId={id} />
    </>
  );
}
