/**
 * Базовый интерфейс для фильма или ТВ-шоу с общими полями
 */
export interface MovieType {
  id: number;
  title?: string; // для фильмов
  name?: string; // для ТВ-шоу
  poster_path: string;
  backdrop_path?: string;
  overview: string;
  release_date?: string; // для фильмов
  first_air_date?: string; // для ТВ-шоу
  vote_average?: number; // рейтинг 0-10
  vote_count?: number; // количество голосов
  genre_ids?: number[];
  popularity?: number;
  original_language?: string;
}
