import { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import MovieCard from '../components/MovieCard';
import { SkeletonCard } from '../components/LoadingSpinner';
import { getPopular, searchMovies, getGenres, discoverByGenre } from '../api/tmdb';

const NO_KEY = !import.meta.env.VITE_TMDB_KEY || import.meta.env.VITE_TMDB_KEY === 'your_tmdb_api_key_here';

export default function Home() {
  const [movies, setMovies]           = useState([]);
  const [genres, setGenres]           = useState([]);
  const [query, setQuery]             = useState('');
  const [activeGenre, setActiveGenre] = useState(null);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  useEffect(() => {
    if (NO_KEY) return;
    getGenres().then((d) => setGenres(d.genres)).catch(() => {});
  }, []);

  const fetchMovies = useCallback(async (q, genre, p) => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (q)      data = await searchMovies(q, p);
      else if (genre) data = await discoverByGenre(genre, p);
      else        data = await getPopular(p);
      setMovies((prev) => p === 1 ? data.results : [...prev, ...data.results]);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err.message === 'NO_KEY' ? 'NO_KEY' : 'Error al cargar las películas. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setMovies([]);
    if (!NO_KEY) fetchMovies(query, activeGenre, 1);
  }, [query, activeGenre, fetchMovies]);

  useEffect(() => {
    if (page > 1) fetchMovies(query, activeGenre, page);
  }, [page, query, activeGenre, fetchMovies]);

  const handleGenre = (id) => { setQuery(''); setActiveGenre(id); };
  const handleSearch = (q) => { setActiveGenre(null); setQuery(q); };

  if (error === 'NO_KEY' || NO_KEY) {
    return (
      <div className="page">
        <div className="setup-banner">
          <div className="setup-banner__icon">🔑</div>
          <h2 className="setup-banner__title">Se necesita clave de TMDB</h2>
          <p className="setup-banner__text">Esta app usa la API de TMDB para cargar películas reales.</p>
          <ol className="setup-steps">
            <li>Crea una cuenta gratuita en <strong>themoviedb.org</strong></li>
            <li>Ve a Ajustes → API y solicita una clave</li>
            <li>Crea un archivo <code>.env</code> en la raíz del proyecto:</li>
          </ol>
          <pre className="setup-code">VITE_TMDB_KEY=tu_clave_aqui</pre>
          <p className="setup-banner__text">Luego reinicia el servidor con <code>npm run dev</code>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="hero">
        <h1 className="hero__title">Descubre tu próxima película</h1>
        <p className="hero__sub">Busca, guarda favoritos y encuentra dónde verlas.</p>
        <SearchBar onSearch={handleSearch} initialValue={query} />
      </div>

      <div className="page__content">
        {genres.length > 0 && !query && (
          <GenreFilter genres={genres} activeGenre={activeGenre} onSelect={handleGenre} />
        )}

        {error && <p className="error-msg">{error}</p>}

        {query && (
          <p className="results-label">
            {loading ? 'Buscando…' : `${movies.length} resultados para "${query}"`}
          </p>
        )}

        <div className="movie-grid">
          {loading && movies.length === 0
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map((m) => <MovieCard key={m.id} movie={m} />)
          }
        </div>

        {!loading && movies.length === 0 && !error && (
          <div className="empty-results">
            <p className="empty-results__icon">🎬</p>
            <p className="empty-results__text">No se encontraron películas.</p>
          </div>
        )}

        {!loading && page < totalPages && movies.length > 0 && (
          <button className="load-more" onClick={() => setPage((p) => p + 1)}>Cargar más</button>
        )}
        {loading && movies.length > 0 && <p className="loading-more">Cargando más…</p>}
      </div>
    </div>
  );
}
