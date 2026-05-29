import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import AdBanner from '../../components/public/AdBanner';
import ArticleCard from '../../components/public/ArticleCard';
import { TrendingUp, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topArticles, setTopArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [pickIndex, setPickIndex] = useState(0);
  const pickTimerRef = useRef(null);

  const PER_PAGE = 24;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/articles?featured=true&limit=10'),
      api.get(`/articles?limit=${PER_PAGE}`),
      api.get('/categories'),
      api.get('/articles?sort=views&limit=5'),
    ]).then(([featRes, allRes, catRes, topRes]) => {
      setFeatured(Array.isArray(featRes.data?.articles) ? featRes.data.articles : []);
      setArticles(Array.isArray(allRes.data?.articles) ? allRes.data.articles : []);
      setTotal(allRes.data?.total || 0);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      setTopArticles(Array.isArray(topRes.data?.articles) ? topRes.data.articles : []);
    }).catch(() => {
      setFeatured([]);
      setArticles([]);
      setCategories([]);
      setTopArticles([]);
    }).finally(() => setLoading(false));
  }, []);

  const startPickTimer = (count) => {
    clearInterval(pickTimerRef.current);
    if (count <= 1) return;
    pickTimerRef.current = setInterval(() => setPickIndex(i => (i + 1) % count), 3000);
  };

  useEffect(() => {
    const count = Math.max(0, featured.length - 4);
    setPickIndex(0);
    startPickTimer(count);
    return () => clearInterval(pickTimerRef.current);
  }, [featured.length]);

  const goToPick = (index) => {
    setPickIndex(index);
    startPickTimer(Math.max(0, featured.length - 4));
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const { data } = await api.get(`/articles?limit=${PER_PAGE}&offset=${articles.length}`);
      setArticles(prev => [...prev, ...(Array.isArray(data?.articles) ? data.articles : [])]);
      setTotal(data?.total || 0);
    } finally { setLoadingMore(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingDots />
    </div>
  );

  const hero = featured[0];
  const subFeatured = featured.slice(1, 4);
  const editorsPick = featured.slice(4);

  const chunks = [];
  for (let i = 0; i < articles.length; i += 4) chunks.push(articles.slice(i, i + 4));

  return (
    <div>
      {/* ══ HERO ══ */}
      {hero && (
        <section>
          <Link to={`/artikel/${hero.slug}`} state={{ fromApp: true }} className="group block relative">
            <div className="relative w-full overflow-hidden" style={{ height: 'min(82vh, 700px)' }}>
              <img
                src={hero.featured_image}
                alt={hero.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/25 to-black/5" />
              <div className="absolute bottom-0 left-0 px-8 md:px-16 pb-10 md:pb-16 max-w-3xl">
                <span className="eyebrow block mb-3" style={{ color: hero.category_color || '#C9A96E' }}>
                  {hero.category_name}
                </span>
                <h2 className="font-display italic text-white text-4xl md:text-6xl lg:text-7xl leading-[1.04] tracking-tight mb-4">
                  {hero.title}
                </h2>
                <p className="text-white/65 text-sm hidden md:block mb-5 max-w-lg leading-relaxed font-light">
                  {hero.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-white/45">
                  <span>{format(new Date(hero.published_at), 'd MMM yyyy', { locale: sv })}</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ══ 3-COL SECONDARY FEATURED ══ */}
      {subFeatured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12 border-b border-cream-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subFeatured.map(a => (
              <Link key={a.id} to={`/artikel/${a.slug}`} state={{ fromApp: true }} className="group">
                <div className="overflow-hidden aspect-[3/2] mb-4">
                  <img
                    src={a.featured_image}
                    alt={a.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <span className="eyebrow block mb-1.5" style={{ color: a.category_color || '#C9A96E' }}>
                  {a.category_name}
                </span>
                <h3 className="font-display text-xl md:text-2xl leading-snug group-hover:text-gold-500 transition-colors mb-2">
                  {a.title}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 font-light leading-relaxed">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ══ EDITOR'S PICK (dark carousel) ══ */}
      {editorsPick.length > 0 && (
        <section className="bg-charcoal-800 py-10 max-h-screen overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="flex items-center gap-5 mb-8">
              <div className="flex-1 h-px bg-cream-300/15" />
              <span className="eyebrow text-gold-400">Redaktionens val</span>
              <div className="flex-1 h-px bg-cream-300/15" />
            </div>

            {/* Sliding track */}
            <div className="relative">
              {editorsPick.length > 1 && (
                <button
                  onClick={() => goToPick((pickIndex - 1 + editorsPick.length) % editorsPick.length)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full z-10 w-9 h-9 flex items-center justify-center text-cream-300/60 hover:text-gold-400 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${pickIndex * 100}%)` }}
                >
                  {editorsPick.map(a => (
                    <Link
                      key={a.id}
                      to={`/artikel/${a.slug}`}
                      state={{ fromApp: true }}
                      className="group w-full shrink-0 flex flex-col md:flex-row gap-0"
                    >
                      <div className="overflow-hidden w-full md:w-[45%] aspect-[16/9] md:aspect-[4/3]">
                        <img
                          src={a.featured_image}
                          alt={a.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="md:w-[55%] px-0 md:px-10 pt-6 md:pt-0 flex flex-col justify-center">
                        <span className="eyebrow block mb-3" style={{ color: a.category_color || '#C9A96E' }}>{a.category_name}</span>
                        <h3 className="font-display italic text-3xl md:text-4xl lg:text-5xl text-cream-50 leading-snug group-hover:text-gold-400 transition-colors mb-4">
                          {a.title}
                        </h3>
                        {a.excerpt && (
                          <p className="text-sm text-cream-300/55 line-clamp-3 font-light leading-relaxed mb-6">{a.excerpt}</p>
                        )}
                        <span className="text-xs text-gold-500 tracking-[0.15em] uppercase font-medium flex items-center gap-2">
                          Läs mer <ArrowRight size={12} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {editorsPick.length > 1 && (
                <button
                  onClick={() => goToPick((pickIndex + 1) % editorsPick.length)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-10 w-9 h-9 flex items-center justify-center text-cream-300/60 hover:text-gold-400 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>

            {/* Dot indicators */}
            {editorsPick.length > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                {editorsPick.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPick(i)}
                    className={`rounded-full transition-all duration-300 ${i === pickIndex ? 'w-4 h-1.5 bg-gold-400' : 'w-1.5 h-1.5 bg-cream-300/30 hover:bg-cream-300/60'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══ SENASTE DIVIDER ══ */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-6">
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px bg-cream-200" />
          <span className="eyebrow text-gold-400">Senaste</span>
          <div className="flex-1 h-px bg-cream-200" />
        </div>
      </div>

      {/* ══ MAIN GRID + SIDEBAR ══ */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-14">

          <div className="space-y-0">
            {chunks.map((chunk, ci) => (
              <div key={ci}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 mb-12">
                  {chunk.map(a => <ArticleCard key={a.id} article={a} />)}
                </div>
                {ci < chunks.length - 1 && (
                  <div className="mb-12">
                    <AdBanner placement="article_inline" />
                  </div>
                )}
              </div>
            ))}

            {articles.length < total && (
              <div className="text-center mt-6 mb-12">
                <button onClick={loadMore} disabled={loadingMore} className="btn-outline">
                  {loadingMore ? 'Laddar...' : 'Ladda fler'}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-[120px] space-y-10">
              <AdBanner placement="sidebar_top" />

              {/* Trending */}
              <div>
                <div className="flex items-center gap-2.5 pb-3 mb-1 border-b border-cream-200">
                  <TrendingUp size={12} className="text-gold-400" />
                  <span className="eyebrow text-charcoal-800">Mest lästa</span>
                </div>
                {topArticles.map((a, i) => (
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

function LoadingDots() {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}
