import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail } from 'lucide-react';
import api from '../../utils/api';

const FORMATS = [
  {
    id: 'hero_banner',
    name: 'Heroannons',
    description: 'Helskärmsformat som dominerar startsidan direkt vid besökarens ankomst — maximal synlighet och genomslagskraft. Stöder både bild och video.',
    placement: 'Startsida — ovanför navigationsmenyn',
    dimensions: '1920 × 1080 px',
    formats: 'JPG, PNG, WebP · MP4 (video)',
    maxSize: 'Bild 10 MB · Video 200 MB',
  },
  {
    id: 'article_inline',
    name: 'Artikelbanner — övre',
    description: 'Visas på startsidan efter var fjärde artikel i flödet — och återigen direkt när läsaren avslutat en artikels beskrivning. Når besökaren i två kritiska engagemangspunkter med naturligt hög uppmärksamhet.',
    placement: 'Artikelsidor — övre del av brödtexten',
    dimensions: '1000 × 600 px',
    formats: 'JPG, PNG, WebP · MP4 (video)',
    maxSize: 'Bild 10 MB · Video 200 MB',
  },
  {
    id: 'article_mid',
    name: 'Artikelbanner — mitten',
    description: 'Banner mitt i artikeln. Fångar läsaren i hög engagemangsfas när denne är helt inne i innehållet.',
    placement: 'Artikelsidor — mitten av brödtexten',
    dimensions: '1000 × 300 px',
    formats: 'JPG, PNG, WebP · MP4 (video)',
    maxSize: 'Bild 10 MB · Video 200 MB',
  },
  {
    id: 'sidebar_top',
    name: 'Sidofält — övre',
    description: 'Syns i höger sidofält när besökaren scrollar igenom artikelflödet, navigerar till en kategorisida eller läser en enskild artikel. Bred räckvidd tack vare närvaro på samtliga primära sidor — startsida, kategorier och artiklar.',
    placement: 'Artikelsidor — övre del av höger sidofält',
    dimensions: '250 × 600 px',
    formats: 'JPG, PNG, WebP · MP4 (video)',
    maxSize: 'Bild 10 MB · Video 200 MB',
  },
  {
    id: 'sidebar_mid',
    name: 'Sidofält — botten',
    description: 'Aktiveras när besökaren scrollat ned till slutet av artikelflödet, avslutat en artikelläsning eller befinner sig i kategorisidans sidofält. Fångar läsaren i ett högt engagemangsläge — precis när innehållet tagit slut och uppmärksamheten är fri.',
    placement: 'Artikelsidor — nedre del av höger sidofält',
    dimensions: '250 × 600 px',
    formats: 'JPG, PNG, WebP · MP4 (video)',
    maxSize: 'Bild 10 MB · Video 200 MB',
  },
];

// ── SVG wireframe mockups ──────────────────────────────────────────

function useAdImage(placementKey) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    api.get(`/ads/placement/${placementKey}`).then(({ data }) => {
      if (!Array.isArray(data) || data.length === 0) return;
      const ad = data[0];
      const url = ad.image_url || null;
      if (url) setSrc(url);
    }).catch(() => {});
  }, [placementKey]);
  return src;
}

const W = 320, H = 200;
const BG    = '#EDE8E1';
const HDR   = '#5A5B46';
const NAV   = '#8a8b7a';
const TXT   = 'rgba(163,146,132,0.38)';
const SIDE  = 'rgba(163,146,132,0.22)';
const AD    = '#B89B72';
const CY    = 28; // content starts after header+nav
const LC    = { x: 4,   w: 192 }; // left col
const RC    = { x: 202, w: 114 }; // right col

function TextRows({ x, y, w, count = 5, rowH = 6, gap = 4 }) {
  return Array.from({ length: count }, (_, i) => (
    <rect
      key={i}
      x={x}
      y={y + i * (rowH + gap)}
      width={w * (i === count - 1 ? 0.6 : 1)}
      height={rowH}
      fill={TXT}
      rx={1}
    />
  ));
}

function AdRect({ x, y, w, h, label = 'ANNONS', sub }) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={AD} rx={2} />
      <text x={cx} y={sub ? cy - 5 : cy} dominantBaseline="middle" textAnchor="middle"
        fill="rgba(255,255,255,0.9)" fontSize={8} fontWeight={700} letterSpacing={1.5}
        fontFamily="Arial, sans-serif">{label}</text>
      {sub && (
        <text x={cx} y={cy + 8} dominantBaseline="middle" textAnchor="middle"
          fill="rgba(255,255,255,0.65)" fontSize={6.5} fontFamily="Arial, sans-serif">{sub}</text>
      )}
    </g>
  );
}

function SideRect({ x, y, w, h }) {
  return <rect x={x} y={y} width={w} height={h} fill={SIDE} rx={1} />;
}

// ── Animated hero banner mockup ───────────────────────────────────

function HeroBannerMockup() {
  const [active, setActive] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const heroAdSrc = useAdImage('hero_banner');
  const ref = useRef(null);

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      if (data?.logo_url) setLogoUrl(data.logo_url);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { setActive(entry.isIntersecting); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      width: '100%',
      aspectRatio: '3/2',
      position: 'relative',
      border: '1px solid rgba(14,14,14,0.08)',
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#EDE8E1',
    }}>
      {/* Hero fills the entire viewport */}
      <img
        src={heroAdSrc || 'https://picsum.photos/seed/hero-lifestyle/1920/1080'}
        alt="Heroannons"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Header + nav slides up from the bottom */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        height: '22%',
        transform: active ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: active ? '0.55s' : '0s',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -6px 24px rgba(0,0,0,0.15)',
      }}>
        {/* Logo bar — cream background, search | LIVSSTIL24 | APP */}
        <div style={{
          flex: '0 0 55%', backgroundColor: '#F4F0EA',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 10px',
        }}>
          {/* Search icon — magnifying glass */}
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4.5" cy="4.5" r="3.2" stroke="rgba(14,14,14,0.55)" strokeWidth="1.3"/>
            <line x1="7" y1="7" x2="10" y2="10" stroke="rgba(14,14,14,0.55)" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          {/* Logo */}
          {logoUrl
            ? <img src={logoUrl} alt="Livsstil24" style={{ height: 22, objectFit: 'contain' }} />
            : <span style={{ color: '#0E0E0E', fontSize: 17, letterSpacing: '0.12em', fontFamily: '"Playfair Display", serif' }}>
                LIVSSTIL<span style={{ color: '#B89B72' }}>24</span>
              </span>
          }
          {/* APP link */}
          <span style={{ color: '#0E0E0E', fontSize: 7, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif', opacity: 0.5 }}>APP</span>
        </div>

        {/* Nav row — actual category names */}
        <div style={{
          flex: 1, backgroundColor: '#F4F0EA',
          borderTop: '1px solid rgba(14,14,14,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 8px',
          overflow: 'hidden',
        }}>
          {['Mat & Dryck', 'Mode & Skönhet', 'Träning & Hälsa', 'Resor', 'Inredning', 'Livsstil24 TV'].map((cat, i) => (
            <span key={i} style={{ fontSize: 6.5, fontFamily: 'Arial, sans-serif', fontWeight: 500, letterSpacing: '0.4px', color: 'rgba(14,14,14,0.65)', whiteSpace: 'nowrap' }}>
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Shared hook + base styles for div-based mockups ──────────────

function useInView(threshold = 0.5) {
  const [active, setActive] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { setActive(entry.isIntersecting); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, active];
}

const mockupWrap = {
  width: '100%', aspectRatio: '3/2', position: 'relative',
  border: '1px solid rgba(14,14,14,0.08)', borderRadius: 8,
  overflow: 'hidden', backgroundColor: '#EDE8E1',
};

function PageChrome() {
  return (
    <>
      <div style={{ height: 14, backgroundColor: '#5A5B46', flexShrink: 0 }} />
      <div style={{ height: 2, flexShrink: 0 }} />
      <div style={{ height: 9, backgroundColor: 'rgba(138,139,122,0.55)', flexShrink: 0 }} />
      <div style={{ height: 3, flexShrink: 0 }} />
    </>
  );
}

// ── Article Inline ────────────────────────────────────────────────
// Homepage feed layout: wide banner breaks the article card grid
// after 4 cards, with a sidebar of stacked widgets on the right.

function ArticleInlineMockup() {
  const [ref, active] = useInView();
  const inlineAdSrc = useAdImage('article_inline');

  const topCards = [
    { category: 'Mode & Skönhet',   title: 'Höstens hetaste trender att känna till' },
    { category: 'Mat & Dryck',      title: 'Hälsosam frukost på tio minuter' },
    { category: 'Träning & Hälsa',  title: 'Skapa din perfekta morgonrutin' },
    { category: 'Inredning',        title: 'Inred med naturliga material i höst' },
  ];
  const bottomCards = [
    { category: 'Resor',            title: 'De vackraste platserna i Norden' },
    { category: 'Mode & Skönhet',   title: 'Vinterkläder vi älskar just nu' },
    { category: 'Livsstil24 TV',    title: 'Veckans avsnitt ute nu' },
    { category: 'Träning & Hälsa',  title: 'Mindfulness i din vardag' },
  ];

  const ArticleCard = ({ delay, category, title }) => (
    <div style={{
      backgroundColor: 'rgba(163,146,132,0.12)', borderRadius: 2, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      opacity: active ? 1 : 0,
      transition: 'opacity 0.3s ease',
      transitionDelay: active ? `${delay}s` : '0s',
    }}>
      <div style={{ flex: '0 0 55%', backgroundColor: 'rgba(163,146,132,0.45)' }} />
      <div style={{ flex: 1, padding: '3px 4px', display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}>
        <span style={{ fontSize: 3.5, fontFamily: 'Arial, sans-serif', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#B89B72', lineHeight: 1 }}>{category}</span>
        <span style={{ fontSize: 4.5, fontFamily: 'Arial, sans-serif', fontWeight: 600, color: 'rgba(14,14,14,0.75)', lineHeight: 1.35 }}>{title}</span>
      </div>
    </div>
  );

  return (
    <div ref={ref} style={mockupWrap}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <PageChrome />
        <div style={{ flex: 1, display: 'flex', gap: '2.5%', padding: '0 2.5% 3%' }}>

          {/* Main feed column */}
          <div style={{ flex: 68, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 2 article cards above ad */}
            <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr', gap: 3 }}>
              {topCards.slice(0, 2).map((c, i) => <ArticleCard key={`t${i}`} delay={0.10 + i * 0.06} category={c.category} title={c.title} />)}
            </div>

            {/* Inline ad banner — slides down */}
            <div style={{
              flex: 3, minHeight: 0, borderRadius: 2, overflow: 'hidden', position: 'relative',
              opacity: active ? 1 : 0,
              transform: active ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              transitionDelay: active ? '0.40s' : '0s',
            }}>
              <img src={inlineAdSrc || 'https://picsum.photos/seed/nordic-banner/900/600'} alt="Annons"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
            </div>

            {/* 2 article cards below ad */}
            <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr', gap: 3 }}>
              {bottomCards.slice(0, 2).map((c, i) => <ArticleCard key={`b${i}`} delay={0.58 + i * 0.06} category={c.category} title={c.title} />)}
            </div>
          </div>

          {/* Sidebar — two content blocks */}
          <div style={{ flex: 29, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[0.12, 0.28].map((d, i) => (
              <div key={i} style={{
                flex: 1, backgroundColor: 'rgba(163,146,132,0.15)', borderRadius: 2,
                opacity: active ? 1 : 0,
                transition: 'opacity 0.3s ease',
                transitionDelay: active ? `${d}s` : '0s',
              }} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Article Mid ───────────────────────────────────────────────────
// Article reading page: title + meta + body text, wide banner ad
// in the middle of the content, plain sidebar content blocks.

function ArticleMidMockup() {
  const [ref, active] = useInView();
  const midAdSrc = useAdImage('article_mid');

  const fade = (delay) => ({
    opacity: active ? 1 : 0,
    transition: 'opacity 0.3s ease',
    transitionDelay: active ? `${delay}s` : '0s',
  });

  return (
    <div ref={ref} style={mockupWrap}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <PageChrome />
        <div style={{ flex: 1, display: 'flex', gap: '2.5%', padding: '0 2.5% 3%' }}>

          {/* Article body column — all flex so it fills full height */}
          <div style={{ flex: 68, minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Article featured image placeholder */}
            <div style={{ flex: '0 0 22%', backgroundColor: 'rgba(163,146,132,0.25)', borderRadius: 2, flexShrink: 0, ...fade(0.03) }} />
            {/* Category eyebrow */}
            <span style={{ fontSize: 4, fontFamily: 'Arial, sans-serif', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#B89B72', lineHeight: 1, flexShrink: 0, ...fade(0.05) }}>
              Fashion &amp; Beauty
            </span>
            {/* Title */}
            <span style={{ fontSize: 6.5, fontFamily: 'Arial, sans-serif', fontWeight: 700, color: 'rgba(14,14,14,0.85)', lineHeight: 1.3, flexShrink: 0, ...fade(0.10) }}>
              Fall's most beloved trends — and how to wear them
            </span>
            {/* Meta */}
            <span style={{ fontSize: 4, fontFamily: 'Arial, sans-serif', color: 'rgba(163,146,132,0.8)', flexShrink: 0, borderBottom: '1px solid rgba(163,146,132,0.25)', paddingBottom: 3, ...fade(0.15) }}>
              Anna Lindqvist · Nov 12, 2024
            </span>
            {/* Article text — above ad */}
            <p style={{ margin: 0, fontSize: 5, lineHeight: 1.7, fontFamily: 'Arial, sans-serif', color: 'rgba(14,14,14,0.65)', ...fade(0.20) }}>
              Fashion is about more than clothes — it's an expression of who you are. This season features soft lines, natural materials, and a palette inspired by Scandinavian nature.
            </p>
            <p style={{ margin: 0, fontSize: 5, lineHeight: 1.7, fontFamily: 'Arial, sans-serif', color: 'rgba(14,14,14,0.65)', ...fade(0.28) }}>
              From minimalist tanks to structured blazers — the styles vary but the essence remains the same: simplicity with character.
            </p>
            <p style={{ margin: 0, fontSize: 5, lineHeight: 1.7, fontFamily: 'Arial, sans-serif', color: 'rgba(14,14,14,0.65)', ...fade(0.35) }}>
              The timeless pieces are the ones that carry you through the seasons without losing their relevance. Choose quality over quantity and let each piece tell a story about who you want to be.
            </p>
            {/* Ad banner */}
            <div style={{
              flex: '0 0 40%', borderRadius: 2, overflow: 'hidden', position: 'relative',
              opacity: active ? 1 : 0,
              transform: active ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              transitionDelay: active ? '0.50s' : '0s',
            }}>
              <img src={midAdSrc || 'https://picsum.photos/seed/magazine-spread/900/300'} alt="Annons"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
            </div>
            {/* Article text — below ad */}
            <p style={{ margin: 0, fontSize: 5, lineHeight: 1.7, fontFamily: 'Arial, sans-serif', color: 'rgba(14,14,14,0.65)', ...fade(0.68) }}>
              De tidlösa plaggen är dem som bär dig igenom årstiderna utan att tappa sin relevans. En välskräddad kavaj, ett mjukt kashmirplagg eller en klassisk trenchcoat är investeringar som håller decennier — inte bara en säsong.
            </p>
            <p style={{ margin: 0, fontSize: 5, lineHeight: 1.7, fontFamily: 'Arial, sans-serif', color: 'rgba(14,14,14,0.65)', ...fade(0.75) }}>
              Kombinera med omtanke. En neutral bas låter accessoarerna tala — en skulpturformad väska, örhängen i guld eller ett silkesscarf knuten om handleden förvandlar det enkla till det extraordinära.
            </p>
            <p style={{ margin: 0, fontSize: 5, lineHeight: 1.7, fontFamily: 'Arial, sans-serif', color: 'rgba(14,14,14,0.65)', ...fade(0.82) }}>
              Välj plagg som talar till varandra — en monokrom look med texturskillnader skapar djup utan ansträngning. Lägg till ett statement-plagg och låt resten vara avskalat.
            </p>
            <p style={{ margin: 0, fontSize: 5, lineHeight: 1.7, fontFamily: 'Arial, sans-serif', color: 'rgba(14,14,14,0.65)', ...fade(0.88) }}>
              Höstens nyckelplagg är inte bara estetiska — de är funktionella. Lager på lager, rätt material och genomtänkta detaljer gör skillnaden mellan en look som håller hela dagen och en som faller ihop vid första vinden.
            </p>
          </div>

          {/* Sidebar — two content blocks */}
          <div style={{ flex: 29, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ flex: 1, backgroundColor: 'rgba(163,146,132,0.2)', borderRadius: 2, ...fade(0.10) }} />
            <div style={{ flex: 1, backgroundColor: 'rgba(163,146,132,0.15)', borderRadius: 2, ...fade(0.25) }} />
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Sidebar Top ───────────────────────────────────────────────────

function SidebarTopMockup() {
  const [ref, active] = useInView();
  const sidebarTopSrc = useAdImage('sidebar_top');
  const fade = (d) => ({ opacity: active ? 1 : 0, transition: 'opacity 0.3s ease', transitionDelay: active ? `${d}s` : '0s' });
  return (
    <div ref={ref} style={mockupWrap}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <PageChrome />
        <div style={{ flex: 1, display: 'flex', gap: '2.5%', padding: '0 2.5% 3%' }}>

          {/* Left — exact copy of article inline layout */}
          <div style={{ flex: 68, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3 }}>
              {[
                { category: 'Mode & Skönhet',  title: 'Höstens hetaste trender att känna till', delay: 0.08 },
                { category: 'Mat & Dryck',     title: 'Hälsosam frukost på tio minuter',        delay: 0.14 },
                { category: 'Träning & Hälsa', title: 'Skapa din perfekta morgonrutin',          delay: 0.20 },
                { category: 'Inredning',       title: 'Inred med naturliga material i höst',     delay: 0.26 },
              ].map((c, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(163,146,132,0.12)', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column', opacity: active ? 1 : 0, transition: 'opacity 0.3s ease', transitionDelay: active ? `${c.delay}s` : '0s' }}>
                  <div style={{ flex: '0 0 55%', backgroundColor: 'rgba(163,146,132,0.45)' }} />
                  <div style={{ flex: 1, padding: '3px 4px', display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}>
                    <span style={{ fontSize: 3.5, fontFamily: 'Arial, sans-serif', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#B89B72', lineHeight: 1 }}>{c.category}</span>
                    <span style={{ fontSize: 4.5, fontFamily: 'Arial, sans-serif', fontWeight: 600, color: 'rgba(14,14,14,0.75)', lineHeight: 1.35 }}>{c.title}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ flex: '0 0 22%', borderRadius: 2, backgroundColor: 'rgba(163,146,132,0.12)', border: '1px dashed rgba(163,146,132,0.35)', opacity: active ? 1 : 0, transform: active ? 'translateY(0)' : 'translateY(-6px)', transition: 'opacity 0.5s ease, transform 0.5s ease', transitionDelay: active ? '0.38s' : '0s' }} />
            <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3 }}>
              {[
                { category: 'Resor',           title: 'De vackraste platserna i Norden',  delay: 0.52 },
                { category: 'Mode & Skönhet',  title: 'Vinterkläder vi älskar just nu',   delay: 0.58 },
                { category: 'Livsstil24 TV',   title: 'Veckans avsnitt ute nu',            delay: 0.64 },
                { category: 'Träning & Hälsa', title: 'Mindfulness i din vardag',          delay: 0.70 },
              ].map((c, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(163,146,132,0.12)', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column', opacity: active ? 1 : 0, transition: 'opacity 0.3s ease', transitionDelay: active ? `${c.delay}s` : '0s' }}>
                  <div style={{ flex: '0 0 55%', backgroundColor: 'rgba(163,146,132,0.45)' }} />
                  <div style={{ flex: 1, padding: '3px 4px', display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}>
                    <span style={{ fontSize: 3.5, fontFamily: 'Arial, sans-serif', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#B89B72', lineHeight: 1 }}>{c.category}</span>
                    <span style={{ fontSize: 4.5, fontFamily: 'Arial, sans-serif', fontWeight: 600, color: 'rgba(14,14,14,0.75)', lineHeight: 1.35 }}>{c.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar — ad at top, content below */}
          <div style={{ flex: 29, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{
              flex: '0 0 58%', borderRadius: 2, overflow: 'hidden',
              opacity: active ? 1 : 0,
              transform: active ? 'translateX(0)' : 'translateX(18px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              transitionDelay: active ? '0.4s' : '0s',
            }}>
              <img src={sidebarTopSrc || 'https://picsum.photos/seed/livsstil-sidebar-top/250/600'} alt="Annons"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ flex: 1, backgroundColor: 'rgba(163,146,132,0.2)', borderRadius: 2, ...fade(0.85) }} />
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Sidebar Mid ───────────────────────────────────────────────────

function SidebarMidMockup() {
  const [ref, active] = useInView();
  const sidebarMidSrc = useAdImage('sidebar_mid');
  const fade = (d) => ({ opacity: active ? 1 : 0, transition: 'opacity 0.3s ease', transitionDelay: active ? `${d}s` : '0s' });
  return (
    <div ref={ref} style={mockupWrap}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <PageChrome />
        <div style={{ flex: 1, display: 'flex', gap: '2.5%', padding: '0 2.5% 3%' }}>

          {/* Left — exact copy of article inline layout */}
          <div style={{ flex: 68, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3 }}>
              {[
                { category: 'Mode & Skönhet',  title: 'Höstens hetaste trender att känna till', delay: 0.08 },
                { category: 'Mat & Dryck',     title: 'Hälsosam frukost på tio minuter',        delay: 0.14 },
                { category: 'Träning & Hälsa', title: 'Skapa din perfekta morgonrutin',          delay: 0.20 },
                { category: 'Inredning',       title: 'Inred med naturliga material i höst',     delay: 0.26 },
              ].map((c, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(163,146,132,0.12)', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column', opacity: active ? 1 : 0, transition: 'opacity 0.3s ease', transitionDelay: active ? `${c.delay}s` : '0s' }}>
                  <div style={{ flex: '0 0 55%', backgroundColor: 'rgba(163,146,132,0.45)' }} />
                  <div style={{ flex: 1, padding: '3px 4px', display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}>
                    <span style={{ fontSize: 3.5, fontFamily: 'Arial, sans-serif', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#B89B72', lineHeight: 1 }}>{c.category}</span>
                    <span style={{ fontSize: 4.5, fontFamily: 'Arial, sans-serif', fontWeight: 600, color: 'rgba(14,14,14,0.75)', lineHeight: 1.35 }}>{c.title}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ flex: '0 0 22%', borderRadius: 2, backgroundColor: 'rgba(163,146,132,0.12)', border: '1px dashed rgba(163,146,132,0.35)', opacity: active ? 1 : 0, transform: active ? 'translateY(0)' : 'translateY(-6px)', transition: 'opacity 0.5s ease, transform 0.5s ease', transitionDelay: active ? '0.38s' : '0s' }} />
            <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3 }}>
              {[
                { category: 'Resor',           title: 'De vackraste platserna i Norden',  delay: 0.52 },
                { category: 'Mode & Skönhet',  title: 'Vinterkläder vi älskar just nu',   delay: 0.58 },
                { category: 'Livsstil24 TV',   title: 'Veckans avsnitt ute nu',            delay: 0.64 },
                { category: 'Träning & Hälsa', title: 'Mindfulness i din vardag',          delay: 0.70 },
              ].map((c, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(163,146,132,0.12)', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column', opacity: active ? 1 : 0, transition: 'opacity 0.3s ease', transitionDelay: active ? `${c.delay}s` : '0s' }}>
                  <div style={{ flex: '0 0 55%', backgroundColor: 'rgba(163,146,132,0.45)' }} />
                  <div style={{ flex: 1, padding: '3px 4px', display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}>
                    <span style={{ fontSize: 3.5, fontFamily: 'Arial, sans-serif', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#B89B72', lineHeight: 1 }}>{c.category}</span>
                    <span style={{ fontSize: 4.5, fontFamily: 'Arial, sans-serif', fontWeight: 600, color: 'rgba(14,14,14,0.75)', lineHeight: 1.35 }}>{c.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar — content at top, ad slides in at bottom */}
          <div style={{ flex: 29, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ flex: 1, backgroundColor: 'rgba(163,146,132,0.2)', borderRadius: 2, ...fade(0.3) }} />
            <div style={{
              flex: '0 0 62%', borderRadius: 2, overflow: 'hidden',
              opacity: active ? 1 : 0,
              transform: active ? 'translateX(0)' : 'translateX(18px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              transitionDelay: active ? '0.65s' : '0s',
            }}>
              <img src={sidebarMidSrc || 'https://picsum.photos/seed/vertical-bloom/250/600'} alt="Annons"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function MockupSvg({ children }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%"
      style={{ border: '1px solid rgba(14,14,14,0.08)', borderRadius: 8, backgroundColor: BG, display: 'block' }}>
      <rect x={0} y={0} width={W} height={H} fill={BG} />
      {children}
    </svg>
  );
}

function Mockup({ id }) {
  switch (id) {
    case 'hero_banner':
      return (
        <MockupSvg>
          <AdRect x={0} y={0} w={W} h={108} label="HEROANNONS" sub="1920 × 1080 px" />
          <rect x={0} y={110} width={W} height={14} fill={HDR} />
          <rect x={0} y={126} width={W} height={9}  fill={NAV} opacity={0.55} />
          <rect x={4}   y={140} width={98} height={56} fill={SIDE} rx={2} />
          <rect x={111} y={140} width={98} height={56} fill={SIDE} rx={2} />
          <rect x={218} y={140} width={98} height={56} fill={SIDE} rx={2} />
        </MockupSvg>
      );

    case 'category_top':
      return (
        <MockupSvg>
          <rect x={0} y={0}  width={W} height={14} fill={HDR} />
          <rect x={0} y={16} width={W} height={9}  fill={NAV} opacity={0.55} />
          <AdRect x={4} y={CY} w={W - 8} h={50} label="KATEGORIBANNER" sub="970 × 250 px" />
          <rect x={4}   y={84} width={98}  height={112} fill={SIDE} rx={2} />
          <rect x={111} y={84} width={98}  height={112} fill={SIDE} rx={2} />
          <rect x={218} y={84} width={98}  height={112} fill={SIDE} rx={2} />
        </MockupSvg>
      );

    case 'article_inline':
      return (
        <MockupSvg>
          <rect x={0} y={0}  width={W} height={14} fill={HDR} />
          <rect x={0} y={16} width={W} height={9}  fill={NAV} opacity={0.55} />
          <AdRect x={LC.x} y={CY} w={LC.w} h={38} label="ARTIKELBANNER" sub="970 × 250 px" />
          <TextRows x={LC.x} y={CY + 44} w={LC.w} count={6} />
          <SideRect x={RC.x} y={CY} w={RC.w} h={168} />
        </MockupSvg>
      );

    case 'article_mid':
      return (
        <MockupSvg>
          <rect x={0} y={0}  width={W} height={14} fill={HDR} />
          <rect x={0} y={16} width={W} height={9}  fill={NAV} opacity={0.55} />
          <TextRows x={LC.x} y={CY} w={LC.w} count={3} />
          <AdRect x={LC.x} y={CY + 36} w={LC.w} h={38} label="ARTIKELBANNER" sub="970 × 250 px" />
          <TextRows x={LC.x} y={CY + 82} w={LC.w} count={5} />
          <SideRect x={RC.x} y={CY} w={RC.w} h={168} />
        </MockupSvg>
      );

    case 'sidebar_top':
      return (
        <MockupSvg>
          <rect x={0} y={0}  width={W} height={14} fill={HDR} />
          <rect x={0} y={16} width={W} height={9}  fill={NAV} opacity={0.55} />
          <TextRows x={LC.x} y={CY} w={LC.w} count={9} />
          <AdRect x={RC.x} y={CY} w={RC.w} h={88} label="SIDOFÄLT" sub="300 × 600 px" />
          <SideRect x={RC.x} y={CY + 94} w={RC.w} h={74} />
        </MockupSvg>
      );

    case 'sidebar_mid':
      return (
        <MockupSvg>
          <rect x={0} y={0}  width={W} height={14} fill={HDR} />
          <rect x={0} y={16} width={W} height={9}  fill={NAV} opacity={0.55} />
          <TextRows x={LC.x} y={CY} w={LC.w} count={9} />
          <SideRect x={RC.x} y={CY}        w={RC.w} h={64} />
          <AdRect   x={RC.x} y={CY + 70}   w={RC.w} h={56} label="SIDOFÄLT" sub="300 × 250 px" />
          <SideRect x={RC.x} y={CY + 132}  w={RC.w} h={36} />
        </MockupSvg>
      );

    case 'footer_banner':
      return (
        <MockupSvg>
          <rect x={0} y={0}  width={W} height={14} fill={HDR} />
          <rect x={0} y={16} width={W} height={9}  fill={NAV} opacity={0.55} />
          <TextRows x={4}   y={CY} w={148} count={5} />
          <TextRows x={162} y={CY} w={154} count={5} />
          <AdRect x={0} y={H - 50} w={W} h={50} label="FOOTERBANNER" sub="1920 × 300 px" />
        </MockupSvg>
      );

    default:
      return null;
  }
}

// ── Page ──────────────────────────────────────────────────────────

export default function AdvertisingFormatsPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ backgroundColor: '#F4F0EA' }}>
      <Helmet>
        <title>Annonsformat – Livsstil24</title>
        <meta name="description" content="Annonsformat and technical specifications for Livsstil24. Find the right ad placement and prepare your material." />
      </Helmet>

      {/* ── Page header ── */}
      <div className="border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-6 h-px" style={{ backgroundColor: '#B89B72' }} />
          </div>
          <p className="eyebrow mb-4" style={{ color: '#B89B72' }}>Livsstil24</p>
          <h1 className="font-sans text-5xl md:text-7xl tracking-tight mb-4 uppercase" style={{ color: '#0e0e0e' }}>
            Annonsformat
          </h1>
        </div>
      </div>

      {/* ── Intro ── */}
      <div className="border-b border-cream-200">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <h2 className="font-display text-2xl md:text-3xl mb-6" style={{ color: '#0E0E0E' }}>
            Skulle du vilja annonsera på Livsstil24?
          </h2>
          <p className="text-base leading-relaxed mb-5 font-light" style={{ color: '#0E0E0E' }}>
            Här hittar du all information du behöver för att förbereda material till dina annonser.
            Vi har samlat våra krav på format, dimensioner och leverans så att dina annonser kan
            publiceras korrekt och med hög kvalitet.
          </p>
          <p className="text-base leading-relaxed font-light" style={{ color: '#0E0E0E' }}>
            Gå igenom specifikationerna nedan innan du skickar oss ditt material. Om du har frågor
            angående justeringar eller produktion är du välkommen att kontakta vår annonsavdelning på{' '}
            <a href="mailto:annons@livsstil24gruppen.se"
              className="transition-colors underline underline-offset-2"
              style={{ color: '#B89B72' }}>
              annons@livsstil24gruppen.se
            </a>
            .
          </p>
        </div>
      </div>

      {/* ── Format cards ── */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div>
          {FORMATS.map((fmt) => (
            <div key={fmt.id}
              className="grid grid-cols-1 md:grid-cols-[5fr_4fr] gap-10 md:gap-12 items-start border-b border-cream-200 py-14 md:py-20 last:border-b-0">

              {/* Mockup */}
              <div>
                {fmt.id === 'hero_banner'    ? <HeroBannerMockup />    :
                 fmt.id === 'article_inline' ? <ArticleInlineMockup /> :
                 fmt.id === 'article_mid'    ? <ArticleMidMockup />    :
                 fmt.id === 'sidebar_top'    ? <SidebarTopMockup />    :
                                               <SidebarMidMockup />}
              </div>

              {/* Specs */}
              <div>
                <div className="w-6 h-px mb-5" style={{ backgroundColor: '#B89B72' }} />
                <p className="eyebrow mb-3" style={{ color: '#B89B72' }}>
                  {fmt.id.replace(/_/g, ' ').toUpperCase()}
                </p>
                <h2 className="font-display text-3xl md:text-4xl mb-5" style={{ color: '#0E0E0E' }}>
                  {fmt.name}
                </h2>
                <p className="text-sm leading-relaxed mb-8 font-light" style={{ color: '#0E0E0E' }}>
                  {fmt.description}
                </p>

                <div className="border-t border-cream-200">
                  {[
                    { label: 'Dimensioner', value: fmt.dimensions + (fmt.note ? ` (${fmt.note})` : '') },
                    { label: 'Filformat',   value: fmt.formats },
                    { label: 'Maxstorlek',  value: fmt.maxSize },
                    { label: 'Placering',   value: fmt.placement },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-4 border-b border-cream-200 py-3">
                      <span className="text-xs uppercase tracking-widest font-medium shrink-0 w-28"
                        style={{ color: '#A39284' }}>{label}</span>
                      <span className="text-sm font-light" style={{ color: '#0E0E0E' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="border-t border-cream-200">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <p className="eyebrow mb-4" style={{ color: '#B89B72' }}>Redo att synas?</p>
          <h2 className="font-display text-3xl md:text-4xl mb-6" style={{ color: '#0E0E0E' }}>
            Kontakta annonsavdelningen
          </h2>
          <p className="text-sm leading-relaxed mb-8 font-light max-w-md mx-auto" style={{ color: '#0E0E0E' }}>
            Skicka ditt material eller ställ dina frågor — vi hjälper dig att komma igång.
          </p>
          <a href="mailto:annons@livsstil24gruppen.se"
            className="btn-primary inline-flex items-center gap-2">
            <Mail size={13} />
            annons@livsstil24gruppen.se
          </a>
        </div>
      </div>
    </div>
  );
}
