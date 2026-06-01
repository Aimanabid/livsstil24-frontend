import { useEffect, useRef, useState } from 'react';
import api from '../../utils/api';

const HERO_PLACEMENT       = 'hero_banner';
const INLINE_PLACEMENTS    = new Set(['article_inline', 'article_mid']);
const SKYSCRAPER_PLACEMENTS = new Set(['sidebar_top', 'sidebar_mid']);
const BANNER_PLACEMENTS    = new Set(['footer_banner', 'category_top']);

// ── Fallbacks ──────────────────────────────────────────────────────────────

function FallbackHero({ className }) {
  return (
    <div className={`relative overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(135deg,#5A5B46,#4a4b38,#5A5B46)' }} />
  );
}

// 1000×300 — article_inline, article_mid
function FallbackInline({ className, hideLabel }) {
  return (
    <div className={className}>
      {!hideLabel && <p className="text-xs mb-1 tracking-widest uppercase text-center" style={{ color: '#A39284' }}>Annons</p>}
      <div
        className="w-full flex items-center justify-between gap-6 px-8 sm:px-12 overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#5A5B46,#4a4b38,#5A5B46)', height: 300 }}
      >
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="text-[10px] tracking-[0.2em] uppercase mb-1 text-[#B89B72]">Sponsrat</p>
          <p className="font-semibold text-[#F4F0EA] text-sm sm:text-base leading-snug truncate">Sommarens bästa erbjudanden</p>
          <p className="text-[#F4F0EA]/70 text-xs mt-0.5 hidden sm:block truncate">Upp till 50% rabatt på utvalda märken – begränsad tid</p>
        </div>
        <button className="shrink-0 text-[10px] tracking-widest uppercase font-semibold px-4 sm:px-5 py-2 sm:py-2.5 border border-[#B89B72] text-[#B89B72] whitespace-nowrap">
          Handla nu
        </button>
      </div>
    </div>
  );
}

// 250×600 — sidebar_top, sidebar_mid
function FallbackSkyscraper({ className, hideLabel }) {
  return (
    <div className={className}>
      {!hideLabel && <p className="text-xs mb-1 tracking-widest uppercase text-center" style={{ color: '#A39284' }}>Annons</p>}
      <div
        className="w-full flex flex-col items-center justify-center text-center px-6 gap-4"
        style={{ background: 'linear-gradient(160deg,#5A5B46,#4a4b38)', height: 600 }}
      >
        <p className="text-xs tracking-[0.18em] uppercase text-[#B89B72]">Sponsrat</p>
        <p className="font-semibold text-[#F4F0EA] text-lg leading-snug">Livsstil Premium</p>
        <p className="text-[#F4F0EA]/70 text-xs max-w-[180px]">Obegränsad läsning &amp; exklusivt innehåll</p>
        <button className="text-xs tracking-widest uppercase font-semibold px-5 py-2 border border-[#B89B72] text-[#B89B72] mt-1">
          Prova gratis
        </button>
      </div>
    </div>
  );
}

// footer_banner, category_top — responsive banner strip
function FallbackBanner({ className, hideLabel }) {
  return (
    <div className={className}>
      {!hideLabel && <p className="text-xs mb-1 tracking-widest uppercase text-center" style={{ color: '#A39284' }}>Annons</p>}
      <div className="flex justify-center">
        <div
          className="h-20 sm:h-24 md:h-28 flex items-center justify-between gap-6 px-8 sm:px-12 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#5A5B46,#4a4b38,#5A5B46)', width: '70%', minWidth: 0, maxWidth: '70%', flexShrink: 0 }}
        >
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-[10px] tracking-[0.2em] uppercase mb-1 text-[#B89B72]">Sponsrat</p>
            <p className="font-semibold text-[#F4F0EA] text-sm sm:text-base leading-snug truncate">Sommarens bästa erbjudanden</p>
            <p className="text-[#F4F0EA]/70 text-xs mt-0.5 hidden sm:block truncate">Upp till 50% rabatt på utvalda märken – begränsad tid</p>
          </div>
          <button className="shrink-0 text-[10px] tracking-widest uppercase font-semibold px-4 sm:px-5 py-2 sm:py-2.5 border border-[#B89B72] text-[#B89B72] whitespace-nowrap">
            Handla nu
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function AdBanner({ placement, className = '', noFallback = false, hideLabel = false }) {
  const [ad, setAd] = useState(undefined);
  const containerRef = useRef(null);
  const impressionFired = useRef(false);

  useEffect(() => {
    api.get(`/ads/placement/${placement}`)
      .then(({ data }) => setAd(Array.isArray(data) ? (data[0] ?? null) : null))
      .catch(() => setAd(null));
  }, [placement]);

  useEffect(() => {
    if (!ad?.id || impressionFired.current || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          impressionFired.current = true;
          api.post(`/ads/${ad.id}/impression`).catch(() => {});
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [ad?.id]);

  // Fallbacks
  if (ad === undefined || ad === null) {
    if (noFallback) return null;
    if (placement === HERO_PLACEMENT)          return <FallbackHero className={className} />;
    if (INLINE_PLACEMENTS.has(placement))      return <FallbackInline className={className} hideLabel={hideLabel} />;
    if (SKYSCRAPER_PLACEMENTS.has(placement))  return <FallbackSkyscraper className={className} hideLabel={hideLabel} />;
    return <FallbackBanner className={className} hideLabel={hideLabel} />;
  }

  const handleClick = () => {
    api.post(`/ads/${ad.id}/click`).catch(() => {});
    if (ad.link_url) window.open(ad.link_url, '_blank', 'noopener,noreferrer');
  };

  // ── Hero — fills viewport ────────────────────────────────────────────────
  if (placement === HERO_PLACEMENT) {
    return (
      <div className={`cursor-pointer w-full h-full overflow-hidden ${className}`} onClick={handleClick} ref={containerRef}>
        {ad.ad_type === 'video'
          ? <video src={ad.video_url} poster={ad.image_url || undefined} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          : ad.image_url
            ? <img src={ad.image_url} alt={ad.alt_text || ad.title} className="w-full h-full object-cover" />
            : <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#5A5B46,#4a4b38,#5A5B46)' }} />
        }
      </div>
    );
  }

  // ── Inline banners — 1000×300 ────────────────────────────────────────────
  if (INLINE_PLACEMENTS.has(placement)) {
    return (
      <div className={className} ref={containerRef}>
        {!hideLabel && <p className="text-xs mb-1 tracking-widest uppercase text-center" style={{ color: '#A39284' }}>Annons</p>}
        <div className="w-full overflow-hidden cursor-pointer" style={{ height: 300 }} onClick={handleClick}>
          {ad.ad_type === 'video'
            ? <video src={ad.video_url} poster={ad.image_url || undefined} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            : ad.image_url
              ? <img src={ad.image_url} alt={ad.alt_text || ad.title} className="w-full h-full object-cover" />
              : (
                <div className="w-full h-full flex items-center justify-between gap-6 px-8 sm:px-12"
                  style={{ background: 'linear-gradient(135deg,#5A5B46,#4a4b38,#5A5B46)' }}>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="text-[10px] tracking-[0.2em] uppercase mb-1 text-[#B89B72]">Sponsrat</p>
                    <p className="font-semibold text-[#F4F0EA] text-sm sm:text-base leading-snug truncate">{ad.title}</p>
                    {ad.alt_text && <p className="text-[#F4F0EA]/70 text-xs mt-0.5 hidden sm:block truncate">{ad.alt_text}</p>}
                  </div>
                  {ad.link_url && (
                    <button className="shrink-0 text-[10px] tracking-widest uppercase font-semibold px-4 sm:px-5 py-2 sm:py-2.5 border border-[#B89B72] text-[#B89B72] whitespace-nowrap">
                      Läs mer
                    </button>
                  )}
                </div>
              )
          }
        </div>
      </div>
    );
  }

  // ── Skyscrapers — 250×600 ────────────────────────────────────────────────
  if (SKYSCRAPER_PLACEMENTS.has(placement)) {
    return (
      <div className={className} ref={containerRef}>
        {!hideLabel && <p className="text-xs mb-1 tracking-widest uppercase text-center" style={{ color: '#A39284' }}>Annons</p>}
        <div className="w-full overflow-hidden cursor-pointer" style={{ height: 600 }} onClick={handleClick}>
          {ad.ad_type === 'video'
            ? <video src={ad.video_url} poster={ad.image_url || undefined} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            : ad.image_url
              ? <img src={ad.image_url} alt={ad.alt_text || ad.title} className="w-full h-full object-cover" />
              : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 gap-4"
                  style={{ background: 'linear-gradient(160deg,#5A5B46,#4a4b38)' }}>
                  <p className="text-xs tracking-[0.18em] uppercase text-[#B89B72]">Sponsrat</p>
                  <p className="font-semibold text-[#F4F0EA] text-lg leading-snug">{ad.title}</p>
                  {ad.alt_text && <p className="text-[#F4F0EA]/70 text-xs max-w-[180px]">{ad.alt_text}</p>}
                  {ad.link_url && (
                    <button className="text-xs tracking-widest uppercase font-semibold px-5 py-2 border border-[#B89B72] text-[#B89B72] mt-1">
                      Läs mer
                    </button>
                  )}
                </div>
              )
          }
        </div>
      </div>
    );
  }

  // ── Banner strip — footer_banner, category_top ───────────────────────────
  return (
    <div className={className} ref={containerRef}>
      {!hideLabel && <p className="text-xs mb-1 tracking-widest uppercase text-center" style={{ color: '#A39284' }}>Annons</p>}
      <div className="flex justify-center cursor-pointer" onClick={handleClick}>
        <div className="h-20 sm:h-24 md:h-28 overflow-hidden" style={{ width: '70%' }}>
          {ad.image_url
            ? <img src={ad.image_url} alt={ad.alt_text || ad.title} className="w-full h-full object-cover" />
            : (
              <div className="w-full h-full flex items-center justify-between gap-6 px-8 sm:px-12"
                style={{ background: 'linear-gradient(135deg,#5A5B46,#4a4b38,#5A5B46)' }}>
                <p className="font-semibold text-[#F4F0EA] text-sm truncate">{ad.title}</p>
                {ad.link_url && (
                  <button className="shrink-0 text-[10px] tracking-widest uppercase font-semibold px-4 py-2 border border-[#B89B72] text-[#B89B72] whitespace-nowrap">
                    Läs mer
                  </button>
                )}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
