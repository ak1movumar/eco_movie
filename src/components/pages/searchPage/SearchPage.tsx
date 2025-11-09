"use client";
import { useSearchParams } from "next/navigation";
import { useReadMovie } from "@/hooks/read/useReadMovies";
import Card from "@/ui/card/Card";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { data: movies = [], isLoading } = useReadMovie();

  const filtered = movies.filter((movie: any) =>
    movie.title?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ padding: "100px" }}>
      <h2>Search results for "{query}"</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : filtered.length > 0 ? (
        <div style={{ display: "grid", gap: "20px", paddingTop: "20px"}}>
          {filtered.map((movie: any) => (
            <Card key={movie.id} movie={movie} selected="movie" />
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}
