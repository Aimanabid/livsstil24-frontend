import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import AdBanner from '../../components/public/AdBanner';
import ArticleCard from '../../components/public/ArticleCard';
import { Clock, ArrowLeft, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const tags = Array.isArray(article.tags) ? article.tags : [];

  return (
    <div>
      {article.featured_image && (
        <div className="relative w-full overflow-hidden" style={{ height: 'min(62vh, 540px)' }}>
          <img
            src={article.featured_image}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-50 via-cream-50/10 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-2 pt-6 mb-7">
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

        <span className="eyebrow block mb-4" style={{ color: article.category_color || '#C9A96E' }}>
          {article.category_name}
        </span>

        <h1 className="font-display italic text-4xl md:text-6xl leading-[1.04] tracking-tight mb-5">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-lg text-gray-500 leading-relaxed mb-7 font-light border-l-2 border-gold-400 pl-4">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between py-5 border-y border-cream-200 mb-12">
          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            <span className="font-semibold text-charcoal-800">{article.author_name}</span>
            <span className="text-gray-300">·</span>
            <span>{publishDate}</span>
            <span className="text-gray-300">·</span>
            <span className="flex items-center gap-1"><Clock size={11} /> {article.read_time} min läsning</span>
          </div>
          <button
            onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
            className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-gray-400 hover:text-gold-400 transition-colors shrink-0 ml-4"
          >
            <Share2 size={13} /> Dela
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_256px] gap-16">
          <article className="max-w-2xl">
            <div className="article-body"
              dangerouslySetInnerHTML={{ __html: article.content || '<p>Innehåll saknas.</p>' }} />

            <div className="my-12">
              <AdBanner placement="article_inline" />
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-cream-200">
                {tags.map(tag => (
                  <span key={tag}
                    className="text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 bg-cream-100 text-gray-500 hover:bg-cream-200 transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-[120px] space-y-8">
              <AdBanner placement="sidebar_top" />
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

      <AdBanner placement="footer_banner" className="border-t border-cream-200 py-6 bg-cream-50" />
    </div>
  );
}
