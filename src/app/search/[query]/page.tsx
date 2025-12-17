import SearchResults from "@/components/pages/search/SearchResults";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ query: string }>;
}): Promise<Metadata> {
  const { query } = await params;
  const decodedQuery = decodeURIComponent(query);

  return {
    title: `Search results for '${decodedQuery}' - EcoMovie`,
    description: `Find movies and TV shows matching '${decodedQuery}'`,
  };
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ query: string }>;
}) {
  const { query } = await params;
  const decodedQuery = decodeURIComponent(query);

  return <SearchResults query={decodedQuery} />;
}

