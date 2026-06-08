import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <Helmet>
        <title>404 – Sidan hittades inte – Livsstil24</title>
      </Helmet>
      <div className="flex justify-center mb-8">
        <div className="w-8 h-px" style={{ backgroundColor: '#B89B72' }} />
      </div>
      <p className="eyebrow mb-4" style={{ color: '#B89B72' }}>404</p>
      <h1 className="font-display text-5xl md:text-7xl tracking-tight mb-4" style={{ color: '#0e0e0e' }}>
        Sidan hittades inte
      </h1>
      <p className="text-sm mb-10 max-w-sm leading-relaxed" style={{ color: '#A39284' }}>
        Sidan du letar efter finns inte eller har flyttats.
      </p>
      <Link to="/" className="btn-outline inline-block">
        ← Tillbaka till start
      </Link>
    </div>
  );
}
