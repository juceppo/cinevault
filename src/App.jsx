import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesProvider }    from './context/FavoritesContext';
import { MovieStatusProvider }  from './context/MovieStatusContext';
import Navbar      from './components/Navbar';
import Home        from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Favorites   from './pages/Favorites';
import MyMovies    from './pages/MyMovies';

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <MovieStatusProvider>
          <Navbar />
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/my-movies" element={<MyMovies />} />
          </Routes>
        </MovieStatusProvider>
      </FavoritesProvider>
    </BrowserRouter>
  );
}
