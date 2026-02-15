import OneTv from "@/ui/oneTv/OneTv";
import type { Metadata } from "next";
import axios from "axios";
import { API_KEY } from "@/constants/api";

async function getTvData(id: string) {
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
    const [tv, credits, videos] = await Promise.all([
      fetchWithRetry(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`,
      ),
      fetchWithRetry(
        `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}&language=en-US`,
      ),
      fetchWithRetry(
        `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}&language=en-US`,
      ),
    ]);

    return {
      tv: tv?.data || {},
      credits: credits?.data?.cast ? credits.data.cast.slice(0, 8) : [],
      videos: videos?.data?.results || [],
    };
  } catch (error) {
    console.error("Ошибка загрузки данных ТВ-шоу:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getTvData(id);

  if (!data || !data.tv) {
    return {
      title: "TV Show Not Found",
      description: "The requested TV show could not be found.",
    };
  }

  const { tv } = data;
  const title = `${tv.name} (${tv.first_air_date?.split("-")[0] || ""})`;
  const description =
    tv.overview ||
    `Watch ${tv.name}, a ${tv.genres?.map((g: any) => g.name).join(", ") || "TV show"} that first aired in ${tv.first_air_date?.split("-")[0] || ""}.`;
  const imageUrl = tv.backdrop_path
    ? `https://image.tmdb.org/t/p/original${tv.backdrop_path}`
    : tv.poster_path
      ? `https://image.tmdb.org/t/p/original${tv.poster_path}`
      : "/banner.webp";

  return {
    title,
    description,
    keywords: [
      tv.name,
      ...(tv.genres?.map((g: any) => g.name) || []),
      "TV show",
      "television",
      "series",
    ],
    openGraph: {
      title,
      description,
      type: "video.tv_show",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: tv.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      "rating:value": tv.vote_average?.toFixed(1) || "0",
      "rating:scale": "10",
      "tv:release_date": tv.first_air_date,
      "tv:actors": data.credits.map((actor: any) => actor.name).join(", "),
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getTvData(id);

  // Structured Data (JSON-LD) для SEO
  const structuredData =
    data && data.tv
      ? {
          "@context": "https://schema.org",
          "@type": "TVSeries",
          name: data.tv.name,
          description: data.tv.overview,
          image: data.tv.backdrop_path
            ? `https://image.tmdb.org/t/p/original${data.tv.backdrop_path}`
            : data.tv.poster_path
              ? `https://image.tmdb.org/t/p/original${data.tv.poster_path}`
              : undefined,
          datePublished: data.tv.first_air_date,
          genre: data.tv.genres?.map((g: any) => g.name) || [],
          aggregateRating: data.tv.vote_average
            ? {
                "@type": "AggregateRating",
                ratingValue: data.tv.vote_average,
                bestRating: 10,
                worstRating: 0,
                ratingCount: data.tv.vote_count || 0,
              }
            : undefined,
          numberOfSeasons: data.tv.number_of_seasons,
          numberOfEpisodes: data.tv.number_of_episodes,
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
      <OneTv tvId={id} />
    </>
  );
}
