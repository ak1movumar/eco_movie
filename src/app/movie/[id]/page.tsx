import OneMovie from "@/ui/oneMovie/OneMovie";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { API_KEY, BASE_HOST } from "@/constants/api";
import { fetchMediaData } from "@/lib/fetchMediaData";
import type { MediaDetailsResponse } from "@/lib/fetchMediaData";

// Pre-render top popular + top-rated at build time
export async function generateStaticParams() {
  try {
    const [popular, topRated] = await Promise.all([
      fetch(`${BASE_HOST}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`).then((r) => r.json()),
      fetch(`${BASE_HOST}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`).then((r) => r.json()),
    ]);
    const all = [...(popular.results || []), ...(topRated.results || [])];
    const seen = new Set<string>();
    return all.reduce<{ id: string }[]>((acc, m) => {
      const id = String(m.id);
      if (!seen.has(id)) { seen.add(id); acc.push({ id }); }
      return acc;
    }, []);
  } catch {
    return [];
  }
}

// Non-pre-generated pages are still generated on demand
export const dynamicParams = true;

// Server-side cache shared between generateMetadata and Page (1 hour TTL)
const getMovieData = unstable_cache(
  (id: string) => fetchMediaData(id, "movie").catch(() => null as MediaDetailsResponse | null),
  ["movie-details"],
  { revalidate: 3600 },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getMovieData(id);
  if (!data) return { title: "Movie Not Found" };

  const movie = data.media;
  const title = `${movie.title} (${movie.release_date?.split("-")[0] || ""})`;
  const description =
    movie.overview ||
    `Watch ${movie.title}, a ${movie.genres?.map((g: any) => g.name).join(", ") || "movie"}.`;
  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
      : "/banner.webp";

  return {
    title,
    description,
    keywords: [movie.title, ...(movie.genres?.map((g: any) => g.name) || []), "movie", "film"],
    openGraph: {
      title,
      description,
      type: "video.movie",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: movie.title }],
      releaseDate: movie.release_date,
      duration: movie.runtime,
      actors: data.credits.map((a: any) => a.name),
    },
    twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
    other: { "rating:value": movie.vote_average?.toFixed(1) || "0", "rating:scale": "10" },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getMovieData(id);

  const structuredData = data?.media
    ? {
        "@context": "https://schema.org",
        "@type": "Movie",
        name: data.media.title,
        description: data.media.overview,
        image: data.media.backdrop_path
          ? `https://image.tmdb.org/t/p/original${data.media.backdrop_path}`
          : undefined,
        datePublished: data.media.release_date,
        genre: data.media.genres?.map((g: any) => g.name) || [],
        aggregateRating: data.media.vote_average
          ? {
              "@type": "AggregateRating",
              ratingValue: data.media.vote_average,
              bestRating: 10,
              worstRating: 0,
              ratingCount: data.media.vote_count || 0,
            }
          : undefined,
        duration: data.media.runtime ? `PT${data.media.runtime}M` : undefined,
        actor: data.credits.map((a: any) => ({ "@type": "Person", name: a.name })),
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
      <OneMovie movieId={id} initialData={data ?? undefined} />
    </>
  );
}
