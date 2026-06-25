import { Link } from 'react-router-dom';
import { IMG } from '../api/tmdb';
import { useFavorites } from '../context/FavoritesContext';

const PLACEHOLDER = 'https://via.placeholder.com/300x450/1c2333/6366f1?text=No+Image';

export default function MovieCard({ movie }) {
  const { toggle, isFavorite } = useFavorites();
  const fav = isFavorite(movie.id);
  const year = movie.release_date?.slice(0, 4) ?? '—';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '—';
  const poster = movie.poster_path ? `${IMG}${movie.poster_path}` : PLACEHOLDER;

  return (
    <article className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-card__link">
        <div className="movie-card__poster-wrap">
          <img
            className="movie-card__poster"
            src={poster}
            alt={movie.title}
            loading="lazy"
          />
          <div className="movie-card__overlay">
            <span className="movie-card__view">Ver detalles →</span>
          </div>
        </div>
      </Link>

      <div className="movie-card__body">
        <Link to={`/movie/${movie.id}`} className="movie-card__title-link">
          <h3 className="movie-card__title">{movie.title}</h3>
        </Link>
        <div className="movie-card__meta">
          <span className="movie-card__year">{year}</span>
          {movie.vote_average > 0 && (
            <span className="movie-card__rating">
              <span className="star">★</span> {rating}
            </span>
          )}
        </div>
      </div>

      <button
        className={`movie-card__fav ${fav ? 'movie-card__fav--active' : ''}`}
        onClick={() => toggle(movie)}
        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      >
        {fav ? '♥' : '♡'}
      </button>
    </article>
  );
}
