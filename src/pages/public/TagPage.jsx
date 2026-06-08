import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import ArticleCard from '../../components/public/ArticleCard';
import AdBanner from '../../components/public/AdBanner';

const PER_PAGE = 12;

export default function TagPage() {
  const { tag } = useParams();
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setArticles([]);
    api.get(`/articles?tag=${encodeURIComponent(tag)}&limit=${PER_PAGE}&offset=0`)
      .then(({ data }) => {
        setArticles(Array.isArray(data?.articles) ? data.articles : []);
        setTotal(data?.total || 0);
      })
      .catch(() => { setArticles([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [tag]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const { data } = await api.get(`/articles?tag=${encodeURIComponent(tag)}&limit=${PER_PAGE}&offset=${articles.length}`);
      setArticles(prev => [...prev, ...(Array.isArray(data?.articles) ? data.articles : [])]);
      setTotal(data?.total || 0);
    } finally { setLoadingMore(false); }
  };

  const hasMore = articles.length < total;

  return (
    <div>
      <Helmet>
        <title>{tag ? `#${tag} – Livsstil24` : 'Livsstil24'}</title>
        <meta name="description" content={`Artiklar taggade med ${tag} på Livsstil24.`} />
      </Helmet>
      <div className="border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-6 h-px" style={{ backgroundColor: '#B89B72' }} />
          </div>
          <p className="eyebrow mb-4" style={{ color: '#B89B72' }}>Tagg</p>
          <h1 className="font-display text-5xl md:text-7xl tracking-tight mb-4" style={{ color: '#0e0e0e' }}>
            {tag}
          </h1>
          <p className="text-xs tracking-widest" style={{ color: '#0E0E0E' }}>{total} artiklar</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 pb-20">
        <div className="mb-10">
          <AdBanner placement="category_top" noFallback />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_256px] gap-14">
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
                <p className="font-sans text-3xl mb-3" style={{ color: '#A39284' }}>Inga artiklar med denna tagg</p>
                <p className="text-sm" style={{ color: '#A39284' }}>Prova att söka efter något annat.</p>
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
            <div className="sticky top-[120px] space-y-8">
              <AdBanner placement="sidebar_top" />
              <AdBanner placement="sidebar_mid" />
            </div>
          </aside>
        </div>
      </div>

    </div>
  );
}
