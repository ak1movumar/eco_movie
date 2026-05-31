import axios from "axios";
import { API_KEY, BASE_HOST } from "@/constants/api";

export type MediaType = "movie" | "tv";

export interface MediaDetailsResponse {
  media: any;
  credits: any[];
  videos: any[];
  similar: any[];
  recommendations: any[];
}

async function tryFetch(url: string): Promise<any> {
  try {
    const res = await axios.get(url, { timeout: 8000 });
    return res.data;
  } catch {
    return null;
  }
}

export async function fetchMediaData(
  id: string | number,
  type: MediaType,
): Promise<MediaDetailsResponse> {
  const base = `${BASE_HOST}/${type}/${id}`;
  const q = `api_key=${API_KEY}&language=en-US`;

  const [media, credits, videos, similar, recommendations] = await Promise.all([
    tryFetch(`${base}?${q}`),
    tryFetch(`${base}/credits?${q}`),
    tryFetch(`${base}/videos?${q}`),
    tryFetch(`${base}/similar?${q}&page=1`),
    tryFetch(`${base}/recommendations?${q}&page=1`),
  ]);

  if (!media) throw new Error(`Failed to fetch ${type} ${id}`);

  return {
    media,
    credits: credits?.cast?.slice(0, 8) || [],
    videos: videos?.results || [],
    similar: similar?.results || [],
    recommendations: recommendations?.results || [],
  };
}
