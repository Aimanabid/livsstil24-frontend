import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import ArticleCard from '../../components/public/ArticleCard';
import { Search } from 'lucide-react';
import FooterBanner from '../../components/public/FooterBanner';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';
  const [input, setInput] = useState(q);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setInput(q);
    if (!q) { setArticles([]); return; }
    setLoading(true);
    api.get(`/articles?search=${encodeURIComponent(q)}&limit=50`)
      .then(({ data }) => setArticles(Array.isArray(data?.articles) ? data.articles : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [q]);

  const handleSearch = e => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) navigate(`/sok?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="min-h-[60vh]">
      {/* Header */}
      <div className="border-b border-cream-200 bg-cream-50">
        <div className="max-w-2xl mx-auto px-6 py-16 md:py-20">
          <p className="eyebrow text-gold-400 mb-5 text-center">Sök</p>
          <form onSubmit={handleSearch} className="flex items-center gap-3 border-b-2 border-charcoal-800 pb-3">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              autoFocus
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Sök i Livsstil24..."
              className="flex-1 bg-transparent text-lg focus:outline-none placeholder-gray-300 text-charcoal-800 font-display"
            />
            <button
              type="submit"
              className="text-[11px] tracking-[0.2em] uppercase font-medium text-gold-500 hover:text-gold-600 transition-colors shrink-0"
            >
              Sök
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 pb-20">
        {!q ? (
          <div className="text-center py-16">
            <p className="font-display italic text-2xl text-gray-300">Skriv något för att söka</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-cream-200 aspect-[4/3] mb-4" />
                <div className="bg-cream-200 h-2.5 w-1/4 mb-3 rounded" />
                <div className="bg-cream-200 h-5 w-full mb-1.5 rounded" />
                <div className="bg-cream-200 h-5 w-3/4 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-10 pb-6 border-b border-cream-200">
              <p className="font-display italic text-3xl md:text-4xl">
                "{q}"
              </p>
              <p className="text-xs text-gray-400 mt-2 tracking-wide">
                {articles.length} {articles.length === 1 ? 'artikel hittades' : 'artiklar hittades'}
              </p>
            </div>

            {articles.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-display italic text-3xl text-gray-300 mb-3">Inga resultat</p>
                <p className="text-sm text-gray-400">Prova ett annat sökord.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                {articles.map(a => <ArticleCard key={a.id} article={a} />)}
              </div>
            )}
          </>
        )}
      </div>

      <FooterBanner />
    </div>
  );
}
