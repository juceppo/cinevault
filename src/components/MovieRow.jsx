import MovieCard from './MovieCard';

function SkeletonCards({ count = 6 }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className="skeleton-card movie-row__item">
      <div className="skeleton skeleton--poster" />
      <div className="skeleton-body">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--meta" />
      </div>
    </div>
  ));
}

export default function MovieRow({ title, movies, loading }) {
  if (!loading && (!movies || movies.length === 0)) return null;

  return (
    <section className="movie-row">
      <h2 className="movie-row__title">{title}</h2>
      <div className="movie-row__scroll">
        {loading
          ? <SkeletonCards />
          : movies.map((m) => (
              <div key={m.id} className="movie-row__item">
                <MovieCard movie={m} />
              </div>
            ))
        }
      </div>
    </section>
  );
}
