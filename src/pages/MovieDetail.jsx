import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getMovieDetails, getMovieCredits,
  getWatchProviders, getMovieVideos, getRecommendations,
  IMG, BACK, LOGO,
} from '../api/tmdb';
import { useFavorites } from '../context/FavoritesContext';
import MovieRow from '../components/MovieRow';

const PLACEHOLDER = 'https://via.placeholder.com/300x450/1c2333/f59e0b?text=Sin+imagen';
const REGIONS = ['ES', 'AR', 'CO', 'MX', 'US'];

/* ── Trailer embed ─────────────────────────────── */
function TrailerSection({ movieId }) {
  const [trailer, setTrailer] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [backdrop, setBackdrop] = useState('');

  useEffect(() => {
    getMovieVideos(movieId)
      .then((data) => {
        // prefer official trailer, then any trailer
        const pick =
          data.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
          data.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
          data.results?.find((v) => v.site === 'YouTube');
        if (pick) setTrailer(pick);
      })
      .catch(() => {});
  }, [movieId]);

  if (!trailer) return null;

  const thumb = `https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`;

  return (
    <div className="trailer-wrap">
      {playing ? (
        <div className="trailer-frame">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
            title="Tráiler"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>
      ) : (
        <button className="trailer-thumb" onClick={() => setPlaying(true)}>
          <img src={thumb} alt="Tráiler" loading="lazy" />
          <div className="trailer-thumb__overlay">
            <div className="trailer-play-btn">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <span className="trailer-label">Ver tráiler</span>
          </div>
        </button>
      )}
    </div>
  );
}

/* ── Streaming providers ───────────────────────── */
function WatchProviders({ movieId }) {
  const [region, setRegion] = useState(null);
  const [link, setLink]     = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWatchProviders(movieId)
      .then((res) => {
        for (const r of REGIONS) {
          if (res.results?.[r]) {
            setRegion(res.results[r]);
            setLink(res.results[r].link || '');
            break;
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) return <div className="providers-loading"><div className="spinner spinner--sm" /></div>;
  if (!region)  return <p className="providers-empty">No encontrado en plataformas de streaming ahora mismo.</p>;

  const flatrate = region.flatrate || [];
  const rent     = region.rent     || [];
  const buy      = region.buy      || [];

  const ProviderGroup = ({ label, items }) =>
    items.length === 0 ? null : (
      <div className="provider-group">
        <p className="provider-group__label">{label}</p>
        <div className="provider-logos">
          {items.map((p) => (
            <a
              key={p.provider_id}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="provider-btn"
              title={`Ver en ${p.provider_name}`}
            >
              <img className="provider-logo" src={`${LOGO}${p.logo_path}`} alt={p.provider_name} />
              <span className="provider-name">{p.provider_name}</span>
            </a>
          ))}
        </div>
      </div>
    );

  return (
    <div className="providers">
      <ProviderGroup label="Incluido en suscripción" items={flatrate} />
      <ProviderGroup label="Alquiler digital"        items={rent} />
      <ProviderGroup label="Comprar"                 items={buy} />
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="justwatch-link">
          Ver disponibilidad completa en JustWatch →
        </a>
      )}
    </div>
  );
}

/* ── Similar movies row ─────────────────────────── */
function SimilarMovies({ movieId, currentId }) {
  const [movies,  setMovies]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMovies([]);
    setLoading(true);
    getRecommendations(movieId)
      .then((data) => {
        const results = data.results?.filter((m) => m.id !== Number(currentId)).slice(0, 12) ?? [];
        setMovies(results);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [movieId]);

  return (
    <MovieRow
      title="También te puede gustar"
      movies={movies}
      loading={loading}
    />
  );
}

/* ── Main page ─────────────────────────────────── */
export default function MovieDetail() {
  const { id } = useParams();
  const { toggle, isFavorite } = useFavorites();
  const [movie, setMovie]     = useState(null);
  const [cast, setCast]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    Promise.all([getMovieDetails(id), getMovieCredits(id)])
      .then(([details, credits]) => {
        setMovie(details);
        setCast(credits.cast?.slice(0, 8) ?? []);
      })
      .catch(() => setError('Error al cargar los detalles.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page page--center"><div className="spinner" /></div>;
  if (error)   return <div className="page page--center"><p className="error-msg">{error}</p></div>;
  if (!movie)  return null;

  const fav      = isFavorite(movie.id);
  const year     = movie.release_date?.slice(0, 4) ?? '—';
  const runtime  = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const poster   = movie.poster_path   ? `${IMG}${movie.poster_path}`   : PLACEHOLDER;
  const backdrop = movie.backdrop_path ? `${BACK}${movie.backdrop_path}` : null;
  const rating   = movie.vote_average  ? movie.vote_average.toFixed(1)  : null;

  return (
    <div className="detail-page">
      {backdrop && (
        <div className="detail-backdrop" style={{ backgroundImage: `url(${backdrop})` }}>
          <div className="detail-backdrop__overlay" />
        </div>
      )}

      <div className="detail-content">
        <Link to="/" className="detail-back">← Volver al catálogo</Link>

        <div className="detail-main">
          <div className="detail-left">
            <img className="detail-poster" src={poster} alt={movie.title} />
            <button className={`btn-fav ${fav ? 'btn-fav--active' : ''}`} onClick={() => toggle(movie)}>
              {fav ? '♥ Quitar de favoritos' : '♡ Añadir a favoritos'}
            </button>
          </div>

          <div className="detail-info">
            <div className="detail-info__genres">
              {movie.genres?.map((g) => <span key={g.id} className="genre-badge">{g.name}</span>)}
            </div>

            <h1 className="detail-title">{movie.title}</h1>
            {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}

            <div className="detail-stats">
              {rating && (
                <span className="stat stat--rating">
                  <span className="star">★</span> {rating}<span className="stat__sub"> / 10</span>
                </span>
              )}
              <span className="stat">{year}</span>
              {runtime && <span className="stat">{runtime}</span>}
            </div>

            {movie.overview && (
              <div className="detail-section">
                <h3 className="detail-section__title">Sinopsis</h3>
                <p className="detail-overview">{movie.overview}</p>
              </div>
            )}

            {/* ── TRAILER ── */}
            <div className="detail-section">
              <h3 className="detail-section__title">Tráiler oficial</h3>
              <TrailerSection movieId={id} />
            </div>

            {/* ── STREAMING ── */}
            <div className="detail-section">
              <h3 className="detail-section__title">Dónde ver</h3>
              <WatchProviders movieId={id} />
            </div>
          </div>
        </div>

        {cast.length > 0 && (
          <div className="detail-section detail-cast-section">
            <h3 className="detail-section__title">Reparto principal</h3>
            <div className="cast-grid">
              {cast.map((member) => (
                <div key={member.cast_id ?? member.id} className="cast-card">
                  <div className="cast-card__avatar">
                    {member.profile_path
                      ? <img src={`${IMG}${member.profile_path}`} alt={member.name} loading="lazy" />
                      : <span className="cast-card__initials">{member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                    }
                  </div>
                  <p className="cast-card__name">{member.name}</p>
                  <p className="cast-card__role">{member.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <SimilarMovies movieId={id} currentId={id} />
      </div>
    </div>
  );
}
