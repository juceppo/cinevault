export default function GenreFilter({ genres, activeGenre, onSelect }) {
  return (
    <div className="genre-filter">
      <button
        className={`genre-chip ${activeGenre === null ? 'genre-chip--active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          className={`genre-chip ${activeGenre === g.id ? 'genre-chip--active' : ''}`}
          onClick={() => onSelect(g.id)}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
