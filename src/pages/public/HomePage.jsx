import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import AdBanner from '../../components/public/AdBanner';
import ArticleCard from '../../components/public/ArticleCard';
import { TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');

  useEffect(() => {
    setLoading(true);
    if (search) {
      api.get(`/articles?search=${encodeURIComponent(search)}&limit=50`)
        .then(({ data }) => { setArticles(Array.isArray(data?.articles) ? data.articles : []); setFeatured([]); })
        .catch(() => setArticles([]))
        .finally(() => setLoading(false));
    } else {
      Promise.all([
        api.get('/articles?featured=true&limit=6'),
        api.get('/articles?limit=24'),
        api.get('/categories'),
      ]).then(([featRes, allRes, catRes]) => {
        setFeatured(Array.isArray(featRes.data?.articles) ? featRes.data.articles : []);
        setArticles(Array.isArray(allRes.data?.articles) ? allRes.data.articles : []);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      }).catch(() => {
        setFeatured([]);
        setArticles([]);
        setCategories([]);
      }).finally(() => setLoading(false));
    }
  }, [search]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingDots />
    </div>
  );

  // ── Search results ──
  if (search) return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="mb-10 border-b border-cream-200 pb-8">
        <p className="eyebrow text-gold-400 mb-2">Sökresultat</p>
        <h1 className="font-display italic text-4xl md:text-5xl">"{search}"</h1>
        <p className="text-xs text-gray-400 mt-3 tracking-wide">{articles.length} artiklar hittades</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
        {articles.map(a => <ArticleCard key={a.id} article={a} />)}
      </div>
    </div>
  );

  const hero = featured[0];
  const subFeatured = featured.slice(1, 4);
  const editorsPick = featured.slice(4, 6);

  const chunks = [];
  for (let i = 0; i < articles.length; i += 4) chunks.push(articles.slice(i, i + 4));

  return (
    <div>
      <AdBanner placement="hero_banner" className="border-b border-cream-200 pb-4" />

      {/* ══ HERO ══ */}
      {hero && (
        <section>
          <Link to={`/artikel/${hero.slug}`} className="group block relative">
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
                  <span className="font-medium text-white/70">{hero.author_name}</span>
                  <span>·</span>
                  <span>{hero.read_time} min läsning</span>
                  <span>·</span>
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
              <Link key={a.id} to={`/artikel/${a.slug}`} className="group">
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

      {/* ══ EDITOR'S PICK (dark band) ══ */}
      {editorsPick.length > 0 && (
        <section className="bg-charcoal-800 py-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-5 mb-8">
              <div className="flex-1 h-px bg-cream-300/15" />
              <span className="eyebrow text-gold-400">Redaktionens val</span>
              <div className="flex-1 h-px bg-cream-300/15" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {editorsPick.map(a => (
                <Link key={a.id} to={`/artikel/${a.slug}`} className="group flex gap-5 items-start">
                  <div className="overflow-hidden w-32 md:w-40 shrink-0 aspect-[4/3]">
                    <img
                      src={a.featured_image}
                      alt={a.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="py-1 min-w-0">
                    <span className="eyebrow block mb-2" style={{ color: a.category_color || '#C9A96E' }}>{a.category_name}</span>
                    <h3 className="font-display text-lg md:text-xl text-cream-50 leading-snug group-hover:text-gold-400 transition-colors mb-2">
                      {a.title}
                    </h3>
                    <p className="text-[11px] text-cream-300/45">{a.author_name} · {a.read_time} min</p>
                  </div>
                </Link>
              ))}
            </div>
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
                {[...articles].sort((a, b) => b.views - a.views).slice(0, 5).map((a, i) => (
                  <Link key={a.id} to={`/artikel/${a.slug}`} className="group flex gap-4 py-4 border-b border-cream-100 last:border-0">
                    <span className="font-display text-4xl text-cream-200 leading-none w-8 shrink-0 select-none">{i + 1}</span>
                    <div className="min-w-0">
                      <span className="eyebrow block mb-1" style={{ color: a.category_color }}>{a.category_name}</span>
                      <h4 className="text-sm font-medium leading-snug group-hover:text-gold-500 transition-colors line-clamp-2">{a.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>

              <AdBanner placement="sidebar_mid" />

              {/* Categories */}
              <div>
                <div className="eyebrow text-charcoal-800 pb-3 mb-1 border-b border-cream-200">
                  Kategorier
                </div>
                {categories.map(c => (
                  <Link key={c.id} to={`/kategori/${c.slug}`}
                    className="flex items-center justify-between py-3 border-b border-cream-100 last:border-0 group">
                    <span className="text-sm group-hover:text-gold-500 transition-colors">{c.name}</span>
                    <span className="text-xs text-gray-300 group-hover:text-gold-400 transition-colors">{c.article_count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <AdBanner placement="footer_banner" className="border-t border-cream-200 py-6 bg-cream-100" />
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
