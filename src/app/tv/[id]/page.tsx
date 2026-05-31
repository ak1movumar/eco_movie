import OneTv from "@/ui/oneTv/OneTv";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { API_KEY, BASE_HOST } from "@/constants/api";
import { fetchMediaData } from "@/lib/fetchMediaData";
import type { MediaDetailsResponse } from "@/lib/fetchMediaData";

export async function generateStaticParams() {
  try {
    const [popular, topRated] = await Promise.all([
      fetch(`${BASE_HOST}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`).then((r) => r.json()),
      fetch(`${BASE_HOST}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`).then((r) => r.json()),
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

export const dynamicParams = true;

const getTvData = unstable_cache(
  (id: string) => fetchMediaData(id, "tv").catch(() => null as MediaDetailsResponse | null),
  ["tv-details"],
  { revalidate: 3600 },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getTvData(id);
  if (!data) return { title: "TV Show Not Found" };

  const tv = data.media;
  const title = `${tv.name} (${tv.first_air_date?.split("-")[0] || ""})`;
  const description =
    tv.overview ||
    `Watch ${tv.name}, a ${tv.genres?.map((g: any) => g.name).join(", ") || "TV show"}.`;
  const imageUrl = tv.backdrop_path
    ? `https://image.tmdb.org/t/p/original${tv.backdrop_path}`
    : tv.poster_path
      ? `https://image.tmdb.org/t/p/original${tv.poster_path}`
      : "/banner.webp";

  return {
    title,
    description,
    keywords: [tv.name, ...(tv.genres?.map((g: any) => g.name) || []), "TV show", "series"],
    openGraph: {
      title,
      description,
      type: "video.tv_show",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: tv.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
    other: {
      "rating:value": tv.vote_average?.toFixed(1) || "0",
      "rating:scale": "10",
      "tv:release_date": tv.first_air_date,
      "tv:actors": data.credits.map((a: any) => a.name).join(", "),
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

  const structuredData = data?.media
    ? {
        "@context": "https://schema.org",
        "@type": "TVSeries",
        name: data.media.name,
        description: data.media.overview,
        image: data.media.backdrop_path
          ? `https://image.tmdb.org/t/p/original${data.media.backdrop_path}`
          : undefined,
        datePublished: data.media.first_air_date,
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
        numberOfSeasons: data.media.number_of_seasons,
        numberOfEpisodes: data.media.number_of_episodes,
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
      <OneTv tvId={id} initialData={data ?? undefined} />
    </>
  );
}
