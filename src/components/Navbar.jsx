import { Link, useLocation } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

function VaultLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="36" height="36" rx="10" fill="#0e1117"/>
      {/* Outer ring — film reel / vault wheel */}
      <circle cx="18" cy="18" r="12" stroke="#f59e0b" strokeWidth="2.2" fill="none"/>
      {/* Hub center */}
      <circle cx="18" cy="18" r="4.5" fill="#f59e0b"/>
      {/* Main 4 spokes */}
      <line x1="18" y1="6"  x2="18" y2="12.5" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="18" y1="23.5" x2="18" y2="30" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="6"  y1="18" x2="12.5" y2="18" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
      <line x1="23.5" y1="18" x2="30" y2="18" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
      {/* Diagonal spokes — softer */}
      <line x1="9.5"  y1="9.5"  x2="13.4" y2="13.4" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="22.6" y1="22.6" x2="26.5" y2="26.5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="26.5" y1="9.5"  x2="22.6" y2="13.4" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="9.5"  y1="26.5" x2="13.4" y2="22.6" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      {/* Film sprocket holes at 12, 3, 6, 9 o'clock */}
      <circle cx="18" cy="7.5"  r="1.3" fill="#0e1117"/>
      <circle cx="18" cy="28.5" r="1.3" fill="#0e1117"/>
      <circle cx="7.5"  cy="18" r="1.3" fill="#0e1117"/>
      <circle cx="28.5" cy="18" r="1.3" fill="#0e1117"/>
    </svg>
  );
}

export default function Navbar() {
  const { favorites } = useFavorites();
  const { pathname }  = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <VaultLogo />
          <div className="navbar__wordmark">
            <span className="navbar__title">CineVault</span>
            <span className="navbar__tagline">Tu catálogo de cine</span>
          </div>
        </Link>
        <div className="navbar__links">
          <Link to="/" className={`nav-link ${pathname === '/' ? 'nav-link--active' : ''}`}>
            Descubrir
          </Link>
          <Link to="/favorites" className={`nav-link ${pathname === '/favorites' ? 'nav-link--active' : ''}`}>
            Mis favoritos
            {favorites.length > 0 && <span className="nav-badge">{favorites.length}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
