import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MovieCard from './MovieCard';
import { FavoritesProvider } from '../context/FavoritesContext';

const wrap = ({ children }) => (
  <MemoryRouter>
    <FavoritesProvider>{children}</FavoritesProvider>
  </MemoryRouter>
);

const movie = {
  id: 550,
  title: 'Fight Club',
  poster_path: '/fc.jpg',
  vote_average: 8.8,
  release_date: '1999-10-15',
  genre_ids: [18, 53],
};

const noRating = { ...movie, id: 999, vote_average: 0 };
const noDate   = { ...movie, id: 998, release_date: undefined };

describe('MovieCard', () => {
  it('renders the movie title', () => {
    render(<MovieCard movie={movie} />, { wrapper: wrap });
    expect(screen.getByText('Fight Club')).toBeInTheDocument();
  });

  it('renders the release year from release_date', () => {
    render(<MovieCard movie={movie} />, { wrapper: wrap });
    expect(screen.getByText('1999')).toBeInTheDocument();
  });

  it('renders the rating score', () => {
    render(<MovieCard movie={movie} />, { wrapper: wrap });
    expect(screen.getByText('8.8')).toBeInTheDocument();
  });

  it('does not render rating when vote_average is 0', () => {
    render(<MovieCard movie={noRating} />, { wrapper: wrap });
    expect(screen.queryByText('0.0')).not.toBeInTheDocument();
  });

  it('shows fallback year when release_date is missing', () => {
    render(<MovieCard movie={noDate} />, { wrapper: wrap });
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('links to the correct detail route', () => {
    render(<MovieCard movie={movie} />, { wrapper: wrap });
    const links = screen.getAllByRole('link');
    expect(links.some((l) => l.getAttribute('href') === '/movie/550')).toBe(true);
  });

  it('shows the favorites button', () => {
    render(<MovieCard movie={movie} />, { wrapper: wrap });
    expect(screen.getByRole('button', { name: /favorit/i })).toBeInTheDocument();
  });

  it('toggles favorite state when button is clicked', () => {
    render(<MovieCard movie={movie} />, { wrapper: wrap });
    const btn = screen.getByRole('button', { name: /favorit/i });

    // Before: not a favorite (♡)
    expect(btn.textContent).toBe('♡');

    fireEvent.click(btn);

    // After: is a favorite (♥)
    expect(btn.textContent).toBe('♥');
  });
});
