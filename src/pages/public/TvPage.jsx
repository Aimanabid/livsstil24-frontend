import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import api from '../../utils/api';

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
  const [articles, setArticles]     = useState([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/articles?category=livsstil24-tv&limit=${PER_PAGE}&offset=0`)
      .then(({ data }) => {
        setArticles(Array.isArray(data?.articles) ? data.articles : []);
        setTotal(data?.total || 0);
      })
      .catch(() => setArticles([]))
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

      {/* ── Page header ── */}
      <div className="border-b border-cream-200">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-6 h-px bg-red-500" />
          </div>
          <p className="eyebrow text-red-500 mb-4">Kanal</p>
          <h1 className="font-display italic text-5xl md:text-7xl tracking-tight text-charcoal-800 mb-3">
            Livsstil24 TV
          </h1>
          <p className="text-xs text-gray-400 tracking-widest">{total} videor</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 pb-20">

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
            <p className="font-display italic text-3xl text-gray-300 mb-3">Inga videor ännu</p>
            <p className="text-sm text-gray-400">Kom tillbaka snart!</p>
          </div>
        ) : (
          <div className="space-y-10">
            {articles.map(article => (
              <Link
                key={article.id}
                to={`/artikel/${article.slug}`}
                state={{ fromApp: true }}
                className="group block"
              >
                {/* Thumbnail */}
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

                  {/* Permanent dark overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-300" />

                  {/* Play button — only when video exists */}
                  {article.video_url && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300 group-hover:scale-110">
                        <Play size={22} fill="white" className="text-white ml-1" />
                      </div>
                    </div>
                  )}

                  {/* VIDEO badge — only when video exists */}
                  {article.video_url && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] tracking-widest uppercase px-2.5 py-1 font-semibold">
                      VIDEO
                    </div>
                  )}

                  {/* Bottom gradient + title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent px-5 pb-4 pt-10">
                    <span className="text-[10px] tracking-widest uppercase text-red-400 font-medium block mb-1">
                      {article.category_name || 'Livsstil24 TV'}
                    </span>
                    <h2 className="font-display italic text-xl md:text-2xl text-white leading-snug group-hover:text-gold-300 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                  </div>
                </div>

                {/* Meta below thumbnail */}
                <div className="flex items-start justify-between gap-4">
                  {article.excerpt && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
                      {article.excerpt}
                    </p>
                  )}
                  {article.published_at && (
                    <p className="text-[11px] text-gray-400 shrink-0 mt-0.5">
                      {format(new Date(article.published_at), 'd MMM yyyy', { locale: sv })}
                    </p>
                  )}
                </div>
              </Link>
            ))}

            {articles.length < total && (
              <div className="text-center pt-4">
                <button onClick={loadMore} disabled={loadingMore} className="btn-outline">
                  {loadingMore ? 'Laddar...' : 'Ladda fler'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
