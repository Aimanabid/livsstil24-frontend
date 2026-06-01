import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import api from '../../utils/api';
import AdBanner from '../../components/public/AdBanner';

const PER_PAGE = 12;

function VideoThumbnail({ src, alt, className }) {
  const [thumb, setThumb] = useState(null);
  useEffect(() => {
    if (!src) return;
    const vid = document.createElement('video');
    vid.preload = 'metadata';
    vid.muted = true;
    vid.src = src;
    vid.onloadedmetadata = () => { vid.currentTime = Math.min(1, vid.duration * 0.1); };
    vid.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = vid.videoWidth;
        canvas.height = vid.videoHeight;
        canvas.getContext('2d').drawImage(vid, 0, 0);
        setThumb(canvas.toDataURL('image/jpeg'));
      } catch { }
    };
  }, [src]);
  if (!thumb) return null;
  return <img src={thumb} alt={alt} className={className} />;
}

export default function TvPage() {
  const [articles, setArticles]       = useState([]);
  const [total, setTotal]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [topVideos, setTopVideos]     = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/articles?category=livsstil24-tv&limit=${PER_PAGE}&offset=0`),
      api.get(`/articles?category=livsstil24-tv&sort=views&limit=5&offset=0`),
    ]).then(([mainRes, topRes]) => {
      setArticles(Array.isArray(mainRes.data?.articles) ? mainRes.data.articles : []);
      setTotal(mainRes.data?.total || 0);
      setTopVideos(Array.isArray(topRes.data?.articles) ? topRes.data.articles : []);
    }).catch(() => { setArticles([]); setTopVideos([]); })
      .finally(() => setLoading(false));
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const { data } = await api.get(`/articles?category=livsstil24-tv&limit=${PER_PAGE}&offset=${articles.length}`);
      setArticles(prev => [...prev, ...(Array.isArray(data?.articles) ? data.articles : [])]);
      setTotal(data?.total || 0);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen">

      {/* â”€â”€ Page header â”€â”€ */}
      <div className="border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-6 h-px bg-red-500" />
          </div>
          <p className="eyebrow text-red-500 mb-4">Kanal</p>
          <h1 className="font-display text-5xl md:text-7xl tracking-tight text-charcoal-800 mb-3">
            Livsstil24 TV
          </h1>
          <p className="text-xs text-[#A39284] tracking-widest">{total} videor</p>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-14">

          {/* â”€â”€ Main content â”€â”€ */}
          <div className="max-w-[680px] mx-auto">
            {loading ? (
              <div className="space-y-10">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-cream-200 aspect-video mb-4 w-full" />
                    <div className="bg-cream-200 h-2 w-1/4 mb-3 rounded" />
                    <div className="bg-cream-200 h-5 w-full mb-2 rounded" />
                    <div className="bg-cream-200 h-5 w-2/3 rounded" />
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-display text-3xl text-gray-300 mb-3">Inga videor Ã¤nnu</p>
                <p className="text-sm text-[#A39284]">Kom tillbaka snart!</p>
              </div>
            ) : (
              <>
              <div className="space-y-10">
                {articles.map(article => (
                  <Link
                    key={article.id}
                    to={`/artikel/${article.slug}`}
                    state={{ fromApp: true }}
                    className="group block"
                  >
                    <div className="relative overflow-hidden aspect-video bg-charcoal-900 mb-4">
                      {article.featured_image ? (
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : article.video_url ? (
                        <VideoThumbnail
                          src={article.video_url}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : null}

                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-300" />

                      {article.video_url && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300 group-hover:scale-110">
                            <Play size={22} fill="white" className="text-white ml-1" />
                          </div>
                        </div>
                      )}

                      {article.video_url && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] tracking-widest uppercase px-2.5 py-1 font-semibold">
                          VIDEO
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent px-5 pb-4 pt-10">
                        <span className="text-[10px] tracking-widest uppercase text-red-400 font-medium block mb-1">
                          {article.category_name || 'Livsstil24 TV'}
                        </span>
                        <h2 className="font-display text-xl md:text-2xl leading-snug group-hover:text-[#B89B72] transition-colors line-clamp-2" style={{ color: '#F4F0EA' }}>
                          {article.title}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      {article.excerpt && (
                        <p className="text-sm text-[#A39284] leading-relaxed line-clamp-2 flex-1">
                          {article.excerpt}
                        </p>
                      )}
                      {article.published_at && (
                        <p className="text-[11px] text-[#A39284] shrink-0 mt-0.5">
                          {format(new Date(article.published_at), 'd MMM yyyy', { locale: sv })}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}

              </div>
              {articles.length < total && (
                <div className="text-center mt-14">
                  <button onClick={loadMore} disabled={loadingMore} className="btn-outline">
                    {loadingMore ? 'Laddar...' : 'Ladda fler'}
                  </button>
                </div>
              )}
              </>
            )}
          </div>

          {/* â”€â”€ Sidebar â”€â”€ */}
          <aside className="hidden lg:block">
            <div className="sticky top-[120px] space-y-10">
              <AdBanner placement="sidebar_top" />

              <div>
                <div className="flex items-center gap-2.5 pb-3 mb-1 border-b border-cream-200">
                  <TrendingUp size={12} className="text-gold-400" />
                  <span className="eyebrow text-charcoal-800">Mest sedda</span>
                </div>
                {topVideos.map((a, i) => (
                  <Link key={a.id} to={`/artikel/${a.slug}`} state={{ fromApp: true }} className="group flex gap-4 py-4 border-b border-cream-100 last:border-0">
                    <span className="font-display text-4xl text-[#A39284] leading-none w-8 shrink-0 select-none">{i + 1}</span>
                    <div className="min-w-0">
                      <span className="eyebrow block mb-1 text-red-500">Livsstil24 TV</span>
                      <h4 className="text-sm font-medium leading-snug group-hover:text-[#B89B72] transition-colors line-clamp-2">{a.title}</h4>
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

