import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../../utils/api';
import AdBanner from '../../components/public/AdBanner';
import ArticleCard from '../../components/public/ArticleCard';
import { ArrowLeft, Share2, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export default function ArticlePage() {
  const { slug } = useParams();
  const location = useLocation();
  const [article, setArticle]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [mostRead, setMostRead] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [autoThumb, setAutoThumb] = useState(null);
  const articleBodyRef = useRef(null);
  const viewFired = useRef(false);

  useEffect(() => {
    viewFired.current = false;
  }, [slug]);

  useEffect(() => {
    if (!article?.video_url || article?.featured_image) { setAutoThumb(null); return; }
    const vid = document.createElement('video');
    vid.preload = 'metadata';
    vid.muted = true;
    vid.src = article.video_url;
    vid.onloadedmetadata = () => { vid.currentTime = Math.min(1, vid.duration * 0.1); };
    vid.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = vid.videoWidth;
        canvas.height = vid.videoHeight;
        canvas.getContext('2d').drawImage(vid, 0, 0);
        setAutoThumb(canvas.toDataURL('image/jpeg'));
      } catch { setAutoThumb(null); }
    };
    vid.onerror = () => setAutoThumb(null);
  }, [article?.video_url, article?.featured_image]);

  useEffect(() => {
    if (!article || viewFired.current || !articleBodyRef.current) return;

    const fromApp = location.state?.fromApp;
    if (!fromApp) {
      const navType = performance.getEntriesByType('navigation')[0]?.type;
      if (navType === 'reload') return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          viewFired.current = true;
          let visitorId = localStorage.getItem('visitor_id');
          if (!visitorId) {
            visitorId = crypto.randomUUID();
            localStorage.setItem('visitor_id', visitorId);
          }
          api.post(`/articles/${slug}/view`, { visitor_id: visitorId }).catch(() => {});
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    observer.observe(articleBodyRef.current);
    return () => observer.disconnect();
  }, [article, slug]);

  useEffect(() => {
    api.get('/articles?limit=6').then(({ data }) => {
      const sorted = (data?.articles ?? []).sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
      setMostRead(sorted.slice(0, 5));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setRelated([]);
    api.get(`/articles/${slug}`)
      .then(({ data }) => {
        setArticle(data);
        if (data.category_slug) {
          api.get(`/articles?category=${data.category_slug}&limit=4`)
            .then(({ data: rel }) =>
              setRelated(rel.articles.filter(a => a.slug !== slug).slice(0, 3))
            );
        }
      })
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );

  if (!article) return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-center">
      <p className="eyebrow text-gold-400 mb-3">404</p>
      <h1 className="font-display italic text-5xl mb-6">Artikel hittades inte</h1>
      <Link to="/" className="btn-outline inline-block">← Tillbaka till start</Link>
    </div>
  );

  const publishDate = article.published_at
    ? format(new Date(article.published_at), 'd MMMM yyyy', { locale: sv })
    : '';

  const html = article.content || '<p>Innehåll saknas.</p>';
  const [contentTop, contentBottom] = (() => {
    if (html.length < 600) return [html, null];
    const mid = Math.floor(html.length / 2);
    const before = html.lastIndexOf('</p>', mid);
    const after  = html.indexOf('</p>', mid);
    if (before === -1 && after === -1) return [html, null];
    const splitAt = (before === -1 ? after : after === -1 ? before : (mid - before < after - mid ? before : after)) + 4;
    return [html.slice(0, splitAt), html.slice(splitAt)];
  })();

  const seoTitle = article.seo_title || article.title;
  const seoDescription = article.seo_description || article.excerpt || '';
  const seoKeywords = Array.isArray(article.tags) ? article.tags.join(', ') : '';
  const canonicalUrl = `${window.location.origin}/artikel/${article.slug}`;

  return (
    <div>
      <Helmet>
        <title>{seoTitle} – Livsstil24</title>
        <meta name="description" content={seoDescription} />
        {seoKeywords && <meta name="keywords" content={seoKeywords} />}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={canonicalUrl} />
        {article.featured_image && <meta property="og:image" content={article.featured_image} />}
        {article.published_at && <meta property="article:published_time" content={article.published_at} />}
        {article.category_name && <meta property="article:section" content={article.category_name} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        {article.featured_image && <meta name="twitter:image" content={article.featured_image} />}
      </Helmet>

      {article.video_url && article.category_slug === 'livsstil24-tv' ? (
        <div className="w-full bg-black" style={{ maxHeight: 'min(62vh, 540px)' }}>
          <video
            src={article.video_url}
            poster={article.featured_image || autoThumb || undefined}
            controls
            className="w-full object-contain"
            style={{ maxHeight: 'min(62vh, 540px)' }}
          />
        </div>
      ) : article.featured_image ? (
        <div className="relative w-full overflow-hidden" style={{ height: 'min(62vh, 540px)' }}>
          <img
            src={article.featured_image}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-50 via-cream-50/10 to-transparent" />
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 pt-2 mb-4">
            <Link to="/" className="text-[11px] text-gray-400 hover:text-gold-400 transition-colors flex items-center gap-1">
              <ArrowLeft size={11} /> Hem
            </Link>
            {article.category_name && (
              <>
                <span className="text-gray-300 text-xs">/</span>
                <Link to={`/kategori/${article.category_slug}`}
                  className="text-[11px] text-gray-400 hover:text-gold-400 transition-colors">
                  {article.category_name}
                </Link>
              </>
            )}
          </div>

          <span className="eyebrow block mb-3" style={{ color: article.category_color || '#C9A96E' }}>
            {article.category_name}
          </span>

          <h1 className="font-display italic text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.06] tracking-tight mb-5 uppercase">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg text-gray-500 leading-relaxed mb-6 font-light border-l-2 border-gold-400 pl-4">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between py-5 border-y border-cream-200 mb-12">
            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
              <span className="font-semibold text-charcoal-800">{article.author_name}</span>
              <span className="text-gray-300">·</span>
              <span>{publishDate}</span>
            </div>
            <button
              onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
              className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-gray-400 hover:text-gold-400 transition-colors shrink-0 ml-4"
            >
              <Share2 size={13} /> Dela
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_256px] gap-16">
          <article className="max-w-2xl">
            <div ref={articleBodyRef} className="article-body"
              dangerouslySetInnerHTML={{ __html: contentTop }} />
            {contentBottom && (
              <>
                <div className="my-10">
                  <AdBanner placement="article_mid" />
                </div>
                <div className="article-body"
                  dangerouslySetInnerHTML={{ __html: contentBottom }} />
              </>
            )}

            <div className="my-12">
              <AdBanner placement="article_inline" />
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-[120px] space-y-8">
              <AdBanner placement="sidebar_top" />

              {mostRead.length > 0 && (
                <div>
                  <div className="flex items-center gap-2.5 pb-3 mb-1 border-b border-cream-200">
                    <TrendingUp size={12} className="text-gold-400" />
                    <span className="eyebrow text-charcoal-800">Mest lästa</span>
                  </div>
                  {mostRead.map((a, i) => (
                    <Link key={a.id} to={`/artikel/${a.slug}`} state={{ fromApp: true }}
                      className="group flex gap-4 py-4 border-b border-cream-100 last:border-0">
                      <span className="font-display text-4xl text-cream-200 leading-none w-8 shrink-0 select-none">{i + 1}</span>
                      <div className="min-w-0">
                        <span className="eyebrow block mb-1" style={{ color: a.category_color || '#C9A96E' }}>{a.category_name}</span>
                        <h4 className="text-sm font-medium leading-snug group-hover:text-gold-500 transition-colors line-clamp-2">{a.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <AdBanner placement="sidebar_mid" />
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t border-cream-200 bg-cream-100 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-6 mb-10">
              <div className="flex-1 h-px bg-cream-200" />
              <h2 className="font-display italic text-2xl tracking-wide">Fler artiklar</h2>
              <div className="flex-1 h-px bg-cream-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {related.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
