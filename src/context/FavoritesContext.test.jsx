import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from './FavoritesContext';

const wrap = ({ children }) => <FavoritesProvider>{children}</FavoritesProvider>;

const movie1 = { id: 1, title: 'Inception',       poster_path: '/a.jpg', vote_average: 8.8, release_date: '2010-07-16', genre_ids: [28, 878] };
const movie2 = { id: 2, title: 'The Dark Knight',  poster_path: '/b.jpg', vote_average: 9.0, release_date: '2008-07-18', genre_ids: [28, 80]  };

describe('FavoritesContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with no favorites', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper: wrap });
    expect(result.current.favorites).toHaveLength(0);
  });

  it('adds a movie when toggled for the first time', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper: wrap });

    act(() => { result.current.toggle(movie1); });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].id).toBe(1);
  });

  it('removes a movie when toggled a second time', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper: wrap });

    act(() => { result.current.toggle(movie1); });
    act(() => { result.current.toggle(movie1); });

    expect(result.current.favorites).toHaveLength(0);
  });

  it('isFavorite returns true after adding', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper: wrap });

    act(() => { result.current.toggle(movie1); });

    expect(result.current.isFavorite(1)).toBe(true);
  });

  it('isFavorite returns false for a movie not added', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper: wrap });

    act(() => { result.current.toggle(movie1); });

    expect(result.current.isFavorite(2)).toBe(false);
  });

  it('isFavorite returns false after removing', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper: wrap });

    act(() => { result.current.toggle(movie1); });
    act(() => { result.current.toggle(movie1); });

    expect(result.current.isFavorite(1)).toBe(false);
  });

  it('saves genre_ids when adding a favorite', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper: wrap });

    act(() => { result.current.toggle(movie1); });

    expect(result.current.favorites[0].genre_ids).toEqual([28, 878]);
  });

  it('extracts genre_ids from genres array when genre_ids is absent', () => {
    const detailMovie = { id: 3, title: 'Se7en', poster_path: '/c.jpg', vote_average: 8.6, release_date: '1995-09-22',
      genres: [{ id: 80, name: 'Crimen' }, { id: 9648, name: 'Misterio' }] };
    const { result } = renderHook(() => useFavorites(), { wrapper: wrap });

    act(() => { result.current.toggle(detailMovie); });

    expect(result.current.favorites[0].genre_ids).toEqual([80, 9648]);
  });

  it('can hold multiple favorites at once', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper: wrap });

    act(() => {
      result.current.toggle(movie1);
      result.current.toggle(movie2);
    });

    expect(result.current.favorites).toHaveLength(2);
  });

  it('persists favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper: wrap });

    act(() => { result.current.toggle(movie1); });

    const stored = JSON.parse(localStorage.getItem('movie_favorites'));
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(1);
  });

  it('reads existing favorites from localStorage on mount', () => {
    localStorage.setItem('movie_favorites', JSON.stringify([movie1]));

    const { result } = renderHook(() => useFavorites(), { wrapper: wrap });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.isFavorite(1)).toBe(true);
  });
});
