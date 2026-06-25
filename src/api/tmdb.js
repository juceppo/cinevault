const BASE = 'https://api.themoviedb.org/3';
export const IMG  = 'https://image.tmdb.org/t/p/w500';
export const BACK = 'https://image.tmdb.org/t/p/w1280';
export const LOGO = 'https://image.tmdb.org/t/p/original';

const key = import.meta.env.VITE_TMDB_KEY;

async function get(path, params = {}) {
  if (!key) throw new Error('NO_KEY');
  const url = new URL(BASE + path);
  url.searchParams.set('api_key', key);
  url.searchParams.set('language', 'es-ES');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

export const getPopular       = (page = 1)           => get('/movie/popular',          { page });
export const searchMovies     = (query, page = 1)    => get('/search/movie',           { query, page });
export const getMovieDetails  = (id)                 => get(`/movie/${id}`);
export const getMovieCredits  = (id)                 => get(`/movie/${id}/credits`);
export const getGenres        = ()                   => get('/genre/movie/list');
export const discoverByGenre  = (genreId, page = 1) => get('/discover/movie',         { with_genres: genreId, sort_by: 'popularity.desc', page });
export const getWatchProviders  = (id)                  => get(`/movie/${id}/watch/providers`);
export const getMovieVideos     = (id)                  => get(`/movie/${id}/videos`);
export const getRecommendations = (id)                  => get(`/movie/${id}/recommendations`);
export const discoverByGenres   = (genreIds, page = 1)  => get('/discover/movie', {
  with_genres:       genreIds.join('|'),
  sort_by:           'popularity.desc',
  'vote_count.gte':  80,
  page,
});
