export default function LoadingSpinner({ text = 'Cargando…' }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
      <p className="spinner-text">{text}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton--poster" />
      <div className="skeleton-body">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--meta" />
      </div>
    </div>
  );
}
