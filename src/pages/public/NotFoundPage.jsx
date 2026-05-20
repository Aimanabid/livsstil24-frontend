import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="flex justify-center mb-8">
        <div className="w-8 h-px bg-gold-400" />
      </div>
      <p className="eyebrow text-gold-400 mb-4">404</p>
      <h1 className="font-display italic text-5xl md:text-7xl tracking-tight text-charcoal-800 mb-4">
        Sidan hittades inte
      </h1>
      <p className="text-sm text-gray-400 mb-10 max-w-sm leading-relaxed">
        Sidan du letar efter finns inte eller har flyttats.
      </p>
      <Link to="/" className="btn-outline inline-block">
        ← Tillbaka till start
      </Link>
    </div>
  );
}
