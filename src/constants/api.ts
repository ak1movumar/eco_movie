// API ключ для The Movie Database (TMDB)
export const API_KEY = "d6b53deb2c56ef6bc4129a08f4b63ed9";

// Базовый хост API
export const BASE_HOST = "https://api.themoviedb.org/3";

/**
 * Доступные эндпоинты API TMDB:
 *
 * Фильмы:
 *  - /movie/popular - популярные фильмы
 *  - /movie/top_rated - топ-рейтинговые фильмы
 *  - /movie/{movie_id} - информация о конкретном фильме
 *  - /movie/{movie_id}/credits - актёры фильма
 *  - /movie/{movie_id}/videos - видеоклипы
 *  - /search/movie?query={query} - поиск фильмов
 *
 * ТВ-шоу:
 *  - /tv/{tv_id} - информация о ТВ-шоу
 *  - /tv/{tv_id}/credits - актёры ТВ-шоу
 *
 * Общие:
 *  - /trending/{media_type}/{time_window} - тренды (movie/tv, day/week)
 *  - /discover/{media_type} - открыть медиа с фильтрами
 */
