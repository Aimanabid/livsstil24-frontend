import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import ArticleCard from '../../components/public/ArticleCard';
import AdBanner from '../../components/public/AdBanner';
import { TrendingUp } from 'lucide-react';

const PER_PAGE = 12;

export default function CategoryPage() {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setArticles([]);
    Promise.all([
      api.get(`/articles?category=${slug}&limit=${PER_PAGE}&offset=0`),
      api.get('/categories'),
    ]).then(([artRes, catRes]) => {
      const arts = Array.isArray(artRes.data?.articles) ? artRes.data.articles : [];
      const cats = Array.isArray(catRes.data) ? catRes.data : [];
      setArticles(arts);
      setTotal(artRes.data?.total || 0);
      setCategory(cats.find(c => c.slug === slug) || null);
    }).catch(() => {
      setArticles([]);
      setTotal(0);
    }).finally(() => setLoading(false));
  }, [slug]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const { data } = await api.get(`/articles?category=${slug}&limit=${PER_PAGE}&offset=${articles.length}`);
      const arts = Array.isArray(data?.articles) ? data.articles : [];
      setArticles(prev => [...prev, ...arts]);
      setTotal(data?.total || 0);
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMore = articles.length < total;

  return (
    <div>
      <AdBanner placement="hero_banner" className="border-b border-cream-200" />

      <div className="border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-6 h-px bg-gold-400" />
          </div>
          <p className="eyebrow text-gold-400 mb-4">Kategori</p>
          <h1 className="font-display italic text-5xl md:text-7xl tracking-tight mb-4">
            {category?.name || slug}
          </h1>
          <p className="text-xs text-gray-400 tracking-widest">
            {total} artiklar
          </p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-14">

          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-cream-200 aspect-[4/3] mb-4" />
                    <div className="bg-cream-200 h-2.5 w-1/4 mb-3 rounded" />
                    <div className="bg-cream-200 h-5 w-full mb-1.5 rounded" />
                    <div className="bg-cream-200 h-5 w-3/4 rounded" />
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display italic text-3xl text-gray-300 mb-3">Inga artiklar ännu</p>
                <p className="text-sm text-gray-400">Kom tillbaka snart!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                  {articles.map(a => <ArticleCard key={a.id} article={a} />)}
                </div>
                {hasMore && (
                  <div className="text-center mt-14">
                    <button onClick={loadMore} disabled={loadingMore} className="btn-outline">
                      {loadingMore ? 'Laddar...' : 'Ladda fler'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-[120px] space-y-10">
              <AdBanner placement="sidebar_top" />

              <div>
                <div className="flex items-center gap-2.5 pb-3 mb-1 border-b border-cream-200">
                  <TrendingUp size={12} className="text-gold-400" />
                  <span className="eyebrow text-charcoal-800">Mest lästa</span>
                </div>
                {[...articles].sort((a, b) => b.views - a.views).slice(0, 5).map((a, i) => (
                  <Link key={a.id} to={`/artikel/${a.slug}`} state={{ fromApp: true }} className="group flex gap-4 py-4 border-b border-cream-100 last:border-0">
                    <span className="font-display text-4xl text-cream-200 leading-none w-8 shrink-0 select-none">{i + 1}</span>
                    <div className="min-w-0">
                      <span className="eyebrow block mb-1" style={{ color: a.category_color }}>{a.category_name}</span>
                      <h4 className="text-sm font-medium leading-snug group-hover:text-gold-500 transition-colors line-clamp-2">{a.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>

              <AdBanner placement="sidebar_mid" />
            </div>
          </aside>

        </div>
      </section>
    </div>
  );
}
