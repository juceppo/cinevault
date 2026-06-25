import { useState } from 'react';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => { setValue(''); onSearch(''); };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <span className="search-bar__icon">🔍</span>
      <input
        className="search-bar__input"
        type="search"
        placeholder="Buscar películas…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Buscar películas"
      />
      {value && (
        <button type="button" className="search-bar__clear" onClick={handleClear} aria-label="Limpiar">✕</button>
      )}
      <button type="submit" className="search-bar__btn">Buscar</button>
    </form>
  );
}
