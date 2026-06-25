import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Favorites from './pages/Favorites';

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Navbar />
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  );
}
