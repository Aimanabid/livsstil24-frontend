import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const SLIDE_DURATION  = 700;  // transition ms
const SLIDE_INTERVAL  = 4000; // pause between slides ms

export default function FooterBanner() {
  const [articles, setArticles] = useState([]);
  const [settings, setSettings] = useState({});
  const [current,  setCurrent]  = useState(0);  // visible image index
  const [incoming, setIncoming] = useState(null); // index sliding in
  const [sliding,  setSliding]  = useState(false); // animation active

  useEffect(() => {
    api.get('/articles?featured=true&limit=3')
      .then(({ data }) => setArticles(Array.isArray(data?.articles) ? data.articles.slice(0, 3) : []))
      .catch(() => {});
    api.get('/settings')
      .then(({ data }) => setSettings(data || {}))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (articles.length < 2) return;

    const t = setInterval(() => {
      const next = (current + 1) % articles.length;
      setIncoming(next);
      // small tick so browser registers the start position before we animate
      requestAnimationFrame(() => requestAnimationFrame(() => setSliding(true)));

      setTimeout(() => {
        setCurrent(next);
        setIncoming(null);
        setSliding(false);
      }, SLIDE_DURATION);
    }, SLIDE_INTERVAL);

    return () => clearInterval(t);
  }, [articles.length, current]);

  const description = settings.site_description ||
    'Din digitala livsstilstidning för mode, skönhet och det moderna livet.';

  if (!articles.length) return (
    <div className="bg-charcoal-900 border-t border-white/5 mx-auto mb-6 flex items-center justify-center py-8" style={{ width: '70%' }}>
      <div className="text-center">
        <span className="font-display text-3xl tracking-[0.1em] text-white block mb-3">
          LIVSSTIL<span className="text-gold-400">24</span>
        </span>
        <p className="text-sm text-cream-300/55 leading-relaxed max-w-xs">{description}</p>
      </div>
    </div>
  );

  const article = articles[current];

  return (
    <div className="bg-charcoal-900 border-t border-white/5 mx-auto mb-6" style={{ width: '70%' }}>
      <div className="px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12 items-center">

          {/* ── Left: sliding image ── */}
          <div className="relative overflow-hidden" style={{ height: 'min(30vh, 240px)' }}>

            {/* Current image — slides out downward when next arrives */}
            <div
              key={`cur-${current}`}
              className="absolute inset-0"
              style={{
                transform: sliding ? 'translateY(100%)' : 'translateY(0)',
                transition: sliding ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.76,0,0.24,1)` : 'none',
                zIndex: 1,
              }}
            >
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <ArticleOverlay article={article} />
            </div>

            {/* Incoming image — slides in from top */}
            {incoming !== null && (
              <div
                key={`in-${incoming}`}
                className="absolute inset-0"
                style={{
                  transform: sliding ? 'translateY(0)' : 'translateY(-100%)',
                  transition: sliding ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.76,0,0.24,1)` : 'none',
                  zIndex: 2,
                }}
              >
                <img
                  src={articles[incoming].featured_image}
                  alt={articles[incoming].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <ArticleOverlay article={articles[incoming]} />
              </div>
            )}

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              {articles.map((_, i) => (
                <span
                  key={i}
                  className={`block rounded-full transition-all duration-400 ${
                    i === current
                      ? 'w-5 h-1.5 bg-gold-400'
                      : 'w-1.5 h-1.5 bg-white/35'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── Right: branding ── */}
          <div className="lg:pl-4 lg:border-l lg:border-white/10">
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt="Livsstil24"
                className="h-10 object-contain mb-4"
              />
            ) : (
              <span className="font-display text-3xl md:text-4xl tracking-[0.1em] text-white block mb-4">
                LIVSSTIL<span className="text-gold-400">24</span>
              </span>
            )}

            <p className="text-sm text-cream-300/55 leading-relaxed max-w-xs">
              {description}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

function ArticleOverlay({ article }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 z-10">
      <span
        className="text-[10px] tracking-[0.18em] uppercase font-medium block mb-1.5"
        style={{ color: article.category_color || '#C9A96E' }}
      >
        {article.category_name}
      </span>
      <Link
        to={`/artikel/${article.slug}`}
        className="font-display italic text-white text-xl md:text-2xl leading-snug hover:text-gold-300 transition-colors line-clamp-2 block"
      >
        {article.title}
      </Link>
    </div>
  );
}
