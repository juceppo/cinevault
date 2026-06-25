# CineVault — Tu catálogo de cine

CineVault es una aplicación que construí para explorar películas de una manera más personal que simplemente scrollear en Netflix. Puedo buscar cualquier película, ver dónde está disponible para streaming en mi región, ver el tráiler sin salir de la app y guardar mis favoritas.

---

## Qué puedo hacer con CineVault

- **Explorar películas populares** con portadas de alta calidad desde TMDB
- **Buscar películas** por nombre con resultados en tiempo real
- **Filtrar por género** (acción, terror, comedia, drama, ciencia ficción, etc.)
- Ver la **página de detalle** con sinopsis, reparto, calificación, duración y géneros
- **Ver el tráiler oficial** en YouTube directamente embebido en la página
- Consultar **dónde hacer streaming** (plataformas de flatrate, renta y compra) con datos de JustWatch via TMDB
- **Guardar favoritos** que persisten en `localStorage`
- Toda la interfaz en **español** con datos en español cuando están disponibles en TMDB

---

## Stack

| Tecnología | Uso |
|---|---|
| React 18 | UI y gestión de estado |
| React Router v6 | Navegación SPA |
| Vite 5 | Bundler y servidor de desarrollo |
| TMDB API v3 | Datos de películas, géneros, trailers, proveedores |
| Context API | Estado global de favoritos |
| `localStorage` | Persistencia de favoritos |
| CSS personalizado | Diseño dark-first sin dependencias de UI |

---

## Configuración de la API

1. Crear una cuenta en [themoviedb.org](https://www.themoviedb.org/)
2. Ir a Configuración → API y solicitar una clave API
3. En el formulario indicar que es para uso personal/educativo no comercial
4. Copiar el archivo de ejemplo y agregar tu clave:

```bash
cp .env.example .env
```

5. Editar `.env` y pegar tu API key:

```
VITE_TMDB_KEY=tu_api_key_aqui
```

6. Reiniciar el servidor de desarrollo si ya estaba corriendo

---

## Cómo correrlo localmente

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/cinevault.git
cd cinevault

# Instalar dependencias
npm install

# Configurar la API key (ver sección anterior)
cp .env.example .env
# editar .env con tu clave

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:5174](http://localhost:5174) en el navegador.

---

## Estructura del proyecto

```
src/
├── api/
│   └── tmdb.js               # Todas las llamadas a la API de TMDB
├── components/
│   ├── Navbar.jsx             # Barra de navegación con logo SVG y búsqueda
│   ├── MovieCard.jsx          # Tarjeta de película con poster y overlay
│   └── SearchBar.jsx          # Input de búsqueda
├── context/
│   └── FavoritesContext.jsx   # Estado global de favoritos
├── pages/
│   ├── Home.jsx               # Exploración + búsqueda + filtro por género
│   ├── MovieDetail.jsx        # Detalle completo, tráiler y streaming
│   └── Favorites.jsx          # Lista de favoritos guardados
└── index.css                  # Estilos globales dark-first
```

---

## Sobre los trailers y el streaming

Los trailers se cargan desde YouTube usando los datos de videos que retorna TMDB. Cuando hago clic en la miniatura, se carga el iframe de YouTube con autoplay directamente en la página — sin redireccionamientos ni popups.

Para el streaming, la app consulta el endpoint de `watch/providers` de TMDB (que usa datos de JustWatch) y muestra primero los proveedores disponibles en España, y si no hay, intenta Argentina, Colombia, México y finalmente Estados Unidos. Cada proveedor tiene su logo y lleva al link de JustWatch donde puedo ver todas las opciones disponibles en mi país.

---

## Nota sobre disponibilidad regional

La disponibilidad de streaming cambia constantemente y varía mucho por país. Los datos son en tiempo real desde TMDB/JustWatch, así que pueden diferir de lo que ves en las plataformas directamente. Si una película no aparece en ninguna plataforma es porque genuinamente no está disponible en los mercados que consulto.

---

## Despliegue

Compatible con Vercel y Netlify. Solo hay que agregar `VITE_TMDB_KEY` como variable de entorno en el dashboard del servicio antes de hacer el deploy.

```bash
npm run build
```

El build genera una carpeta `dist/` con archivos estáticos listos para servir.

---

Construido con React + Vite + TMDB API. Diseño propio, sin kits de UI.
