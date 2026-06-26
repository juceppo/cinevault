import { createContext, useContext, useState } from 'react';

const KEY = 'cinevault_status_v1';

// shape: { [movieId]: { status, rating, note, title, poster, year, addedAt } }
// status: 'want' | 'watching' | 'watched' | 'dropped'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
  catch { return {}; }
}
function persist(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

const Ctx = createContext(null);

export function MovieStatusProvider({ children }) {
  const [statuses, setStatuses] = useState(load);

  const setStatus = (movie, status) => {
    setStatuses((prev) => {
      const next = {
        ...prev,
        [movie.id]: {
          ...(prev[movie.id] || {}),
          status,
          title:   movie.title,
          poster:  movie.poster_path || null,
          year:    movie.release_date?.slice(0, 4) ?? '',
          runtime: movie.runtime || null,
          genres:  movie.genres?.map((g) => g.name) || movie.genre_ids || [],
          addedAt: prev[movie.id]?.addedAt || new Date().toISOString(),
        },
      };
      if (!status) delete next[movie.id];
      persist(next);
      return next;
    });
  };

  const setRating = (movieId, rating) => {
    setStatuses((prev) => {
      if (!prev[movieId]) return prev;
      const next = { ...prev, [movieId]: { ...prev[movieId], rating } };
      persist(next); return next;
    });
  };

  const setNote = (movieId, note) => {
    setStatuses((prev) => {
      if (!prev[movieId]) return prev;
      const next = { ...prev, [movieId]: { ...prev[movieId], note } };
      persist(next); return next;
    });
  };

  const removeStatus = (movieId) => {
    setStatuses((prev) => {
      const next = { ...prev };
      delete next[movieId];
      persist(next); return next;
    });
  };

  const getStatus  = (movieId) => statuses[movieId]?.status  || null;
  const getRating  = (movieId) => statuses[movieId]?.rating  || 0;
  const getNote    = (movieId) => statuses[movieId]?.note    || '';
  const getEntry   = (movieId) => statuses[movieId]          || null;

  const byStatus = (s) => Object.entries(statuses)
    .filter(([, v]) => v.status === s)
    .map(([id, v]) => ({ id: Number(id), ...v }))
    .sort((a, b) => b.addedAt?.localeCompare(a.addedAt ?? '') ?? 0);

  const allEntries = () => Object.entries(statuses)
    .map(([id, v]) => ({ id: Number(id), ...v }));

  const stats = () => {
    const all   = allEntries();
    const watched = all.filter((e) => e.status === 'watched');
    const totalMinutes = watched.reduce((s, e) => s + (e.runtime || 0), 0);
    const genreCount  = {};
    watched.forEach((e) => {
      (Array.isArray(e.genres) ? e.genres : []).forEach((g) => {
        if (typeof g === 'string') genreCount[g] = (genreCount[g] || 0) + 1;
      });
    });
    const topGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    const ratings  = watched.filter((e) => e.rating > 0).map((e) => e.rating);
    const avgRating = ratings.length ? (ratings.reduce((s, r) => s + r, 0) / ratings.length).toFixed(1) : null;
    return {
      total:        all.length,
      watched:      watched.length,
      want:         all.filter((e) => e.status === 'want').length,
      watching:     all.filter((e) => e.status === 'watching').length,
      dropped:      all.filter((e) => e.status === 'dropped').length,
      totalMinutes,
      topGenres,
      avgRating,
    };
  };

  return (
    <Ctx.Provider value={{ statuses, setStatus, setRating, setNote, removeStatus, getStatus, getRating, getNote, getEntry, byStatus, allEntries, stats }}>
      {children}
    </Ctx.Provider>
  );
}

export const useMovieStatus = () => useContext(Ctx);
