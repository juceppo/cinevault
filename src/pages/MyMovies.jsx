import { useState, useEffect } from 'react';
import { Link }              from 'react-router-dom';
import { useMovieStatus }    from '../context/MovieStatusContext';
import { discoverByGenre, IMG } from '../api/tmdb';
import MovieCard             from '../components/MovieCard';
import { SkeletonCard }      from '../components/LoadingSpinner';

const PLACEHOLDER = 'https://via.placeholder.com/300x450/1c2333/f59e0b?text=Sin+imagen';

const STATUS_TABS = [
  { key: 'all',      label: 'Todas',      icon: '🎬' },
  { key: 'want',     label: 'Quiero ver', icon: '🔖' },
  { key: 'watching', label: 'Viendo',     icon: '▶'  },
  { key: 'watched',  label: 'Vistas',     icon: '✓'  },
  { key: 'dropped',  label: 'Dejadas',    icon: '✕'  },
];

const STATUS_COLORS = {
  want: '#f59e0b', watching: '#3b82f6', watched: '#22c55e', dropped: '#6b7280',
};
const STATUS_LABELS = {
  want: 'Quiero ver', watching: 'Viendo', watched: 'Vista', dropped: 'Lo dejé',
};

const MOODS = [
  { id: 'accion',    label: 'Acción',        emoji: '💥', genreId: 28  },
  { id: 'comedia',   label: 'Comedia',        emoji: '😂', genreId: 35  },
  { id: 'terror',    label: 'Terror',         emoji: '👻', genreId: 27  },
  { id: 'romance',   label: 'Romance',        emoji: '❤️',  genreId: 10749 },
  { id: 'scifi',     label: 'Sci-Fi',         emoji: '🚀', genreId: 878 },
  { id: 'animacion', label: 'Animación',      emoji: '🎨', genreId: 16  },
  { id: 'drama',     label: 'Drama',          emoji: '🎭', genreId: 18  },
  { id: 'documental',label: 'Documental',     emoji: '🎥', genreId: 99  },
  { id: 'thriller',  label: 'Thriller',       emoji: '😰', genreId: 53  },
];

// ── My list movie card ────────────────────────────────────────────
function MyMovieCard({ entry, onChangeStatus }) {
  const ms     = useMovieStatus();
  const rating = ms.getRating(entry.id);
  const note   = ms.getNote(entry.id);
  const poster = entry.poster ? `${IMG}${entry.poster}` : PLACEHOLDER;

  return (
    <div className="my-movie-card">
      <Link to={`/movie/${entry.id}`} className="my-movie-card__poster-link">
        <img src={poster} alt={entry.title} loading="lazy" className="my-movie-card__poster" />
        <div className="my-movie-card__status-badge" style={{ background: STATUS_COLORS[entry.status] }}>
          {STATUS_LABELS[entry.status]}
        </div>
      </Link>
      <div className="my-movie-card__body">
        <Link to={`/movie/${entry.id}`} className="my-movie-card__title">{entry.title}</Link>
        <p className="my-movie-card__year">{entry.year}</p>
        {rating > 0 && (
          <div className="my-movie-card__rating">
            {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
          </div>
        )}
        {note && <p className="my-movie-card__note">"{note}"</p>}
        <select className="my-movie-card__select"
          value={entry.status}
          onChange={(e) => onChangeStatus(entry.id, e.target.value)}
        >
          <option value="want">🔖 Quiero ver</option>
          <option value="watching">▶ Viendo</option>
          <option value="watched">✓ Vista</option>
          <option value="dropped">✕ Lo dejé</option>
        </select>
      </div>
    </div>
  );
}

// ── Stats section ─────────────────────────────────────────────────
function MyStats({ stats }) {
  const hrs = Math.floor(stats.totalMinutes / 60);
  const min = stats.totalMinutes % 60;

  return (
    <div className="my-stats">
      <div className="my-stats__grid">
        <div className="my-stat">
          <span className="my-stat__num">{stats.watched}</span>
          <span className="my-stat__label">Películas vistas</span>
        </div>
        <div className="my-stat">
          <span className="my-stat__num">{stats.want}</span>
          <span className="my-stat__label">Quiero ver</span>
        </div>
        <div className="my-stat">
          <span className="my-stat__num">{stats.watching}</span>
          <span className="my-stat__label">Viendo ahora</span>
        </div>
        {stats.totalMinutes > 0 && (
          <div className="my-stat">
            <span className="my-stat__num">{hrs > 0 ? `${hrs}h` : `${min}m`}</span>
            <span className="my-stat__label">Horas de cine</span>
          </div>
        )}
        {stats.avgRating && (
          <div className="my-stat">
            <span className="my-stat__num">★ {stats.avgRating}</span>
            <span className="my-stat__label">Puntuación media</span>
          </div>
        )}
      </div>
      {stats.topGenres.length > 0 && (
        <div className="my-stats__genres">
          <p className="my-stats__genres-label">Géneros favoritos</p>
          <div className="my-stats__genre-pills">
            {stats.topGenres.map((g, i) => (
              <span key={g.name} className="my-stats__genre-pill" style={{ opacity: 1 - i * 0.15 }}>
                {g.name} <span>({g.count})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Mood discovery ────────────────────────────────────────────────
function MoodDiscovery() {
  const [activeMood, setActiveMood] = useState(null);
  const [movies, setMovies]   = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeMood) return;
    setLoading(true); setMovies([]);
    discoverByGenre(activeMood.genreId)
      .then((d) => setMovies(d.results?.slice(0, 12) || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeMood]);

  return (
    <div className="mood-section">
      <div className="mood-header">
        <h2 className="mood-title">¿Cómo te sientes hoy?</h2>
        <p className="mood-sub">Elige un estado de ánimo y te recomendamos películas</p>
      </div>
      <div className="mood-chips">
        {MOODS.map((m) => (
          <button key={m.id}
            className={`mood-chip ${activeMood?.id === m.id ? 'mood-chip--active' : ''}`}
            onClick={() => setActiveMood(activeMood?.id === m.id ? null : m)}
          >
            <span className="mood-chip__emoji">{m.emoji}</span>
            <span className="mood-chip__label">{m.label}</span>
          </button>
        ))}
      </div>
      {(activeMood && (loading || movies.length > 0)) && (
        <div className="mood-results">
          <h3 className="mood-results__title">
            {loading ? 'Buscando…' : `${activeMood.emoji} ${activeMood.label} — películas para ti`}
          </h3>
          <div className="movie-grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : movies.map((m) => <MovieCard key={m.id} movie={m} />)
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function MyMovies() {
  const ms = useMovieStatus();
  const [activeTab, setActiveTab] = useState('all');

  const myStats  = ms.stats();
  const entries  = activeTab === 'all' ? ms.allEntries() : ms.byStatus(activeTab);
  const isEmpty  = ms.allEntries().length === 0;

  const handleChangeStatus = (movieId, newStatus) => {
    const entry = ms.getEntry(movieId);
    if (!entry) return;
    ms.setStatus({ id: movieId, title: entry.title, poster_path: entry.poster, release_date: entry.year, genres: entry.genres, runtime: entry.runtime }, newStatus);
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Mi lista de películas</h1>
        <p className="page__sub">{myStats.total} películas en tu lista</p>
      </div>

      {isEmpty ? (
        <div className="page__content">
          <div className="empty-results" style={{ padding: '60px 20px' }}>
            <p className="empty-results__icon">🎬</p>
            <p className="empty-results__text">Tu lista está vacía</p>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 8 }}>
              Abre cualquier película y márcala como "Quiero ver", "Viendo" o "Vista"
            </p>
            <Link to="/" className="empty-results__link" style={{ marginTop: 16, display: 'inline-block' }}>
              Ir a descubrir →
            </Link>
          </div>
          <MoodDiscovery />
        </div>
      ) : (
        <div className="page__content">
          {/* Stats */}
          {myStats.watched > 0 && <MyStats stats={myStats} />}

          {/* Tabs */}
          <div className="my-tabs">
            {STATUS_TABS.map((t) => {
              const count = t.key === 'all' ? myStats.total : myStats[t.key] ?? 0;
              return (
                <button key={t.key}
                  className={`my-tab-btn ${activeTab === t.key ? 'my-tab-btn--active' : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.icon} {t.label}
                  {count > 0 && <span className="my-tab-count">{count}</span>}
                </button>
              );
            })}
          </div>

          {/* Movie grid */}
          {entries.length === 0 ? (
            <div className="empty-results">
              <p className="empty-results__text">No tienes películas en esta categoría.</p>
            </div>
          ) : (
            <div className="my-movie-grid">
              {entries.map((entry) => (
                <MyMovieCard key={entry.id} entry={entry} onChangeStatus={handleChangeStatus} />
              ))}
            </div>
          )}

          {/* Mood discovery at bottom */}
          <MoodDiscovery />
        </div>
      )}
    </div>
  );
}
