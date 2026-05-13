import { useEffect, useState } from 'react';
import api from '../../utils/api';

// Fallback designs shown when no real ad is configured for a placement
const VIDEO_PLACEMENTS  = new Set(['article_inline']);
const BANNER_PLACEMENTS = new Set(['hero_banner', 'footer_banner', 'category_top']);

function FallbackBanner({ className }) {
  return (
    <div className={className}>
      <p className="text-xs text-gray-300 mb-1 tracking-widest uppercase text-center">Annons</p>
      <div
        className="w-full flex items-center justify-between px-8 py-5 gap-6"
        style={{ background: 'linear-gradient(135deg,#1a1a1a,#2d2d2d,#1a1a1a)', maxWidth: 728, margin: '0 auto' }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs tracking-[0.18em] uppercase mb-1 text-gold-400">Sponsrat</p>
          <p className="text-white font-semibold text-base leading-snug truncate">Sommarens bästa erbjudanden</p>
          <p className="text-white/60 text-xs mt-0.5 hidden sm:block">Upp till 50% rabatt på utvalda märken – begränsad tid</p>
        </div>
        <button className="shrink-0 text-xs tracking-widest uppercase font-semibold px-5 py-2.5 border border-gold-400 text-gold-400">
          Handla nu
        </button>
      </div>
    </div>
  );
}

function FallbackBox({ className }) {
  return (
    <div className={className}>
      <p className="text-xs text-gray-300 mb-1 tracking-widest uppercase text-center">Annons</p>
      <div
        className="flex flex-col items-center justify-center text-center px-6 py-8 gap-4 w-full"
        style={{ background: 'linear-gradient(160deg,#2c1810,#4a2c1a)', minHeight: 200 }}
      >
        <p className="text-xs tracking-[0.18em] uppercase text-gold-400">Sponsrat</p>
        <p className="text-white font-semibold text-lg leading-snug">Livsstil Premium</p>
        <p className="text-white/60 text-xs max-w-[180px]">Obegränsad läsning &amp; exklusivt innehåll</p>
        <button className="text-xs tracking-widest uppercase font-semibold px-5 py-2 border border-gold-400 text-gold-400 mt-1">
          Prova gratis
        </button>
      </div>
    </div>
  );
}

function FallbackVideo({ className }) {
  return (
    <div className={className}>
      <p className="text-xs text-gray-300 mb-1 tracking-widest uppercase text-center">Annons</p>
      <div className="relative bg-black w-full overflow-hidden">
        <video src="/mock_ad.mp4" poster="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop"
          autoPlay muted loop playsInline className="w-full max-h-[320px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-5 py-4">
          <div>
            <p className="text-xs tracking-[0.18em] uppercase mb-1 text-gold-400">H&amp;M · Sponsrat</p>
            <p className="text-white font-semibold text-base leading-snug">Ny kollektion – Sommar 2024</p>
          </div>
          <button className="shrink-0 text-xs tracking-widest uppercase font-semibold px-4 py-2 border border-gold-400 text-gold-400">
            Upptäck kollektionen
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdBanner({ placement, className = '' }) {
  const [ad, setAd] = useState(undefined); // undefined=loading, null=no ad, object=real ad

  useEffect(() => {
    api.get(`/ads/placement/${placement}`)
      .then(({ data }) => setAd(Array.isArray(data) ? (data[0] ?? null) : null))
      .catch(() => setAd(null));
  }, [placement]);

  // Show fallback while loading or when no real ad exists
  if (ad === undefined || ad === null) {
    if (VIDEO_PLACEMENTS.has(placement))  return <FallbackVideo className={className} />;
    if (BANNER_PLACEMENTS.has(placement)) return <FallbackBanner className={className} />;
    return <FallbackBox className={className} />;
  }

  // Real ad from backend
  const handleClick = () => {
    api.post(`/ads/${ad.id}/click`).catch(() => {});
    if (ad.link_url) window.open(ad.link_url, '_blank', 'noopener,noreferrer');
  };

  if (ad.ad_type === 'video') {
    return (
      <div className={className}>
        <p className="text-xs text-gray-300 mb-1 tracking-widest uppercase text-center">Annons</p>
        <div className="relative bg-black w-full overflow-hidden cursor-pointer" onClick={handleClick}>
          <video src={ad.video_url} poster={ad.image_url || undefined}
            autoPlay muted loop playsInline className="w-full max-h-[320px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-5 py-4">
            <div>
              <p className="text-xs tracking-[0.18em] uppercase mb-1 text-gold-400">Sponsrat</p>
              <p className="text-white font-semibold text-base leading-snug">{ad.title}</p>
              {ad.alt_text && <p className="text-white/60 text-xs mt-0.5">{ad.alt_text}</p>}
            </div>
            {ad.link_url && (
              <button className="shrink-0 text-xs tracking-widest uppercase font-semibold px-4 py-2 border border-gold-400 text-gold-400">
                Läs mer
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // image (default)
  return (
    <div className={className}>
      <p className="text-xs text-gray-300 mb-1 tracking-widest uppercase text-center">Annons</p>
      {ad.image_url ? (
        <div className="cursor-pointer w-full" onClick={handleClick}>
          <img src={ad.image_url} alt={ad.alt_text || ad.title} className="w-full object-cover" />
        </div>
      ) : (
        <div
          className="w-full flex items-center justify-between px-8 py-5 gap-6 cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#1a1a1a,#2d2d2d,#1a1a1a)', maxWidth: 970, margin: '0 auto' }}
          onClick={handleClick}
        >
          <div className="flex-1 min-w-0">
            <p className="text-xs tracking-[0.18em] uppercase mb-1 text-gold-400">Sponsrat</p>
            <p className="text-white font-semibold text-base leading-snug truncate">{ad.title}</p>
            {ad.alt_text && <p className="text-white/60 text-xs mt-0.5 hidden sm:block">{ad.alt_text}</p>}
          </div>
          {ad.link_url && (
            <button className="shrink-0 text-xs tracking-widest uppercase font-semibold px-5 py-2.5 border border-gold-400 text-gold-400">
              Läs mer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
