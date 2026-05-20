import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export default function ArticleCard({ article }) {
  const { title, slug, excerpt, featured_image, category_name, category_color, author_name, read_time, published_at } = article;
  const fallback = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800';
  const date = published_at ? format(new Date(published_at), 'd MMM yyyy', { locale: sv }) : '';

  return (
    <Link to={`/artikel/${slug}`} state={{ fromApp: true }} className="article-card group block">
      <div className="overflow-hidden aspect-[4/3] mb-4">
        <img
          src={featured_image || fallback}
          alt={title}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = fallback; }}
        />
      </div>
      <div>
        <span className="eyebrow block mb-2" style={{ color: category_color || '#C9A96E' }}>
          {category_name}
        </span>
        <h3 className="font-display text-xl md:text-2xl leading-snug mb-2 group-hover:text-gold-500 transition-colors duration-200">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3 font-light">{excerpt}</p>
        )}
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          {author_name && <span className="font-medium text-gray-500">{author_name}</span>}
          {author_name && <span className="text-gray-300">·</span>}
          <span>{date}</span>
          {read_time && <><span className="text-gray-300">·</span><span>{read_time} min</span></>}
        </div>
      </div>
    </Link>
  );
}
