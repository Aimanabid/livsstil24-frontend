import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { getCategoryFont } from '../../utils/categoryFont';

export default function ArticleCard({ article }) {
  const { title, slug, excerpt, featured_image, category_name, category_color, category_slug, published_at } = article;
  const titleFont = getCategoryFont(category_slug || category_name);
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
        <span className="eyebrow block mb-2" style={{ color: category_color || '#B89B72' }}>
          {category_name}
        </span>
        <h3 className={`${titleFont} text-xl md:text-2xl leading-snug mb-2 transition-colors duration-200 text-[#0e0e0e] group-hover:text-[#B89B72]`}>
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm leading-relaxed line-clamp-2 mb-3 font-light" style={{ color: '#A39284' }}>{excerpt}</p>
        )}
        <div className="flex items-center gap-2 text-[11px]" style={{ color: '#A39284' }}>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
}
