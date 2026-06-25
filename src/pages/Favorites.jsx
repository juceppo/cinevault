import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';
import MovieRow from '../components/MovieRow';
import { discoverByGenres } from '../api/tmdb';

function BasedOnFavorites({ favorites }) {
  const [movies,  setMovies]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) { setLoading(false); return; }

    // Count genre occurrences across all favorites
    const counts = {};
    favorites.forEach((m) => {
      (m.genre_ids ?? []).forEach((id) => {
        counts[id] = (counts[id] || 0) + 1;
      });
    });

    const topGenres = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id]) => Number(id));

    if (topGenres.length === 0) { setLoading(false); return; }

    const favIds = new Set(favorites.map((m) => m.id));

    discoverByGenres(topGenres)
      .then((data) => {
        const results = data.results?.filter((m) => !favIds.has(m.id)).slice(0, 12) ?? [];
        setMovies(results);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [favorites]);

  if (!loading && movies.length === 0) return null;

  return (
    <MovieRow
      title="Porque te gustaron tus favoritas"
      movies={movies}
      loading={loading}
    />
  );
}

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Mis favoritos</h1>
        <p className="page__sub">
          {favorites.length === 0
            ? 'Todavía no has guardado ninguna película.'
            : `${favorites.length} película${favorites.length === 1 ? '' : 's'} guardada${favorites.length === 1 ? '' : 's'}`}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-results">
          <p className="empty-results__icon">♡</p>
          <p className="empty-results__text">¡Empieza a guardar las películas que te gusten!</p>
          <Link to="/" className="empty-results__link">Explorar películas →</Link>
        </div>
      ) : (
        <div className="page__content">
          <div className="movie-grid">
            {favorites.map((m) => <MovieCard key={m.id} movie={m} />)}
          </div>

          <BasedOnFavorites favorites={favorites} />
        </div>
      )}
    </div>
  );
}
