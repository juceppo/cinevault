import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('movie_favorites') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('movie_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggle = (movie) => {
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, {
          id:           movie.id,
          title:        movie.title,
          poster_path:  movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          genre_ids:    movie.genre_ids ?? movie.genres?.map((g) => g.id) ?? [],
        }]
    );
  };

  const isFavorite = (id) => favorites.some((m) => m.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
