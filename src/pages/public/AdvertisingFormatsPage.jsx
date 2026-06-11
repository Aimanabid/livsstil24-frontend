import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail } from 'lucide-react';

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
    dimensions: '1000 × 300 px',
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
  const ref = useRef(null);

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
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: '#B89B72',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: 14, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif' }}>
          HEROANNONS
        </span>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'Arial, sans-serif' }}>
          1920 × 1080 px
        </span>
      </div>

      {/* Header + nav slides up — viewport ends at the nav bottom */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        height: '20%',
        transform: active ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: active ? '0.55s' : '0s',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -6px 24px rgba(0,0,0,0.2)',
      }}>
        {/* Header bar with logo */}
        <div style={{
          flex: '0 0 58%', backgroundColor: '#5A5B46',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: 'rgba(244,240,234,0.92)', fontSize: 9, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif' }}>
            LIVSSTIL<span style={{ color: '#B89B72' }}>24</span>
          </span>
        </div>

        {/* Nav row — bottom edge of the visible screen */}
        <div style={{
          flex: 1, backgroundColor: '#EDE8E1',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '0 8px',
        }}>
          {[28, 36, 22, 32, 28].map((w, i) => (
            <div key={i} style={{ width: w, height: 3, backgroundColor: 'rgba(90,91,70,0.3)', borderRadius: 2 }} />
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

const adLabel = (text, sub) => (
  <>
    <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Arial, sans-serif' }}>{text}</span>
    <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, fontFamily: 'Arial, sans-serif' }}>{sub}</span>
  </>
);

// ── Article Inline ────────────────────────────────────────────────

function ArticleInlineMockup() {
  const [ref, active] = useInView();
  return (
    <div ref={ref} style={mockupWrap}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <PageChrome />
        <div style={{ flex: 1, display: 'flex', gap: '2.5%', padding: '0 2.5% 3%' }}>
          {/* Left content column */}
          <div style={{ flex: 68, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* 4 article cards above — 2×2 grid */}
            <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3 }}>
              {Array.from({ length: 4 }, (_, i) => (
                <div key={`top-${i}`} style={{
                  backgroundColor: 'rgba(163,146,132,0.12)', borderRadius: 2, overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                  opacity: active ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  transitionDelay: active ? `${0.1 + i * 0.06}s` : '0s',
                }}>
                  <div style={{ flex: '0 0 50%', backgroundColor: 'rgba(163,146,132,0.48)' }} />
                  <div style={{ flex: 1, padding: '3px 4px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ flex: 1, backgroundColor: 'rgba(163,146,132,0.5)', borderRadius: 1 }} />
                    <div style={{ flex: 1, width: '68%', backgroundColor: 'rgba(163,146,132,0.4)', borderRadius: 1 }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Ad at end of article — slides down */}
            <div style={{
              flex: '0 0 18%', backgroundColor: '#B89B72', borderRadius: 2,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              opacity: active ? 1 : 0,
              transform: active ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              transitionDelay: active ? '0.45s' : '0s',
            }}>
              {adLabel('ANNONS', '1000 × 300 px')}
            </div>
            {/* 4 article cards below — 2×2 grid */}
            <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 3 }}>
              {Array.from({ length: 4 }, (_, i) => (
                <div key={`bot-${i}`} style={{
                  backgroundColor: 'rgba(163,146,132,0.12)', borderRadius: 2, overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                  opacity: active ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  transitionDelay: active ? `${0.68 + i * 0.06}s` : '0s',
                }}>
                  <div style={{ flex: '0 0 50%', backgroundColor: 'rgba(163,146,132,0.48)' }} />
                  <div style={{ flex: 1, padding: '3px 4px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ flex: 1, backgroundColor: 'rgba(163,146,132,0.5)', borderRadius: 1 }} />
                    <div style={{ flex: 1, width: '68%', backgroundColor: 'rgba(163,146,132,0.4)', borderRadius: 1 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Sidebar */}
          <div style={{ flex: 29, backgroundColor: 'rgba(163,146,132,0.2)', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}

// ── Article Mid ───────────────────────────────────────────────────

function ArticleMidMockup() {
  const [ref, active] = useInView();
  return (
    <div ref={ref} style={mockupWrap}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <PageChrome />
        <div style={{ flex: 1, display: 'flex', gap: '2.5%', padding: '0 2.5% 3%' }}>
          {/* Left content column — article reading layout */}
          <div style={{ flex: 68, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Featured article image */}
            <div style={{
              flex: '0 0 16%', backgroundColor: 'rgba(163,146,132,0.48)', borderRadius: 2,
              opacity: active ? 1 : 0,
              transition: 'opacity 0.3s ease',
              transitionDelay: active ? '0.05s' : '0s',
            }} />
            {/* Article title bar */}
            <div style={{
              flex: '0 0 6%', backgroundColor: 'rgba(90,91,70,0.3)', borderRadius: 2,
              opacity: active ? 1 : 0,
              transition: 'opacity 0.3s ease',
              transitionDelay: active ? '0.12s' : '0s',
            }} />
            {/* 3 paragraph blocks above ad — varying widths */}
            {[1, 0.88, 0.95].map((w, i) => (
              <div key={`top-${i}`} style={{
                flex: 1, backgroundColor: 'rgba(163,146,132,0.38)', borderRadius: 2,
                width: `${w * 100}%`,
                opacity: active ? 1 : 0,
                transition: 'opacity 0.3s ease',
                transitionDelay: active ? `${0.22 + i * 0.08}s` : '0s',
              }} />
            ))}
            {/* Ad in the middle — slides up */}
            <div style={{
              flex: '0 0 18%', backgroundColor: '#B89B72', borderRadius: 2,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              opacity: active ? 1 : 0,
              transform: active ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              transitionDelay: active ? '0.55s' : '0s',
            }}>
              {adLabel('ANNONS', '1000 × 300 px')}
            </div>
            {/* 3 paragraph blocks below ad — varying widths */}
            {[1, 0.9, 0.72].map((w, i) => (
              <div key={`bot-${i}`} style={{
                flex: 1, backgroundColor: 'rgba(163,146,132,0.38)', borderRadius: 2,
                width: `${w * 100}%`,
                opacity: active ? 1 : 0,
                transition: 'opacity 0.3s ease',
                transitionDelay: active ? `${0.75 + i * 0.08}s` : '0s',
              }} />
            ))}
          </div>
          {/* Sidebar */}
          <div style={{ flex: 29, backgroundColor: 'rgba(163,146,132,0.2)', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}

// ── Sidebar Top ───────────────────────────────────────────────────

function SidebarTopMockup() {
  const [ref, active] = useInView();
  return (
    <div ref={ref} style={mockupWrap}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <PageChrome />
        <div style={{ flex: 1, display: 'flex', gap: '2.5%', padding: '0 2.5% 3%' }}>
          {/* Left content column */}
          <div style={{ flex: 68, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Featured article image */}
            <div style={{
              flex: '0 0 20%', backgroundColor: 'rgba(163,146,132,0.48)', borderRadius: 2,
              opacity: active ? 1 : 0,
              transition: 'opacity 0.3s ease',
              transitionDelay: active ? '0.05s' : '0s',
            }} />
            {[1, 0.88, 1, 0.92, 1, 0.78].map((w, i) => (
              <div key={i} style={{
                flex: 1, backgroundColor: 'rgba(163,146,132,0.38)', borderRadius: 1,
                width: `${w * 100}%`,
                opacity: active ? 1 : 0,
                transition: 'opacity 0.3s ease',
                transitionDelay: active ? `${0.12 + i * 0.05}s` : '0s',
              }} />
            ))}
          </div>
          {/* Sidebar — ad at top, gray section below */}
          <div style={{ flex: 29, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{
              flex: '0 0 58%', backgroundColor: '#B89B72', borderRadius: 2,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              opacity: active ? 1 : 0,
              transform: active ? 'translateX(0)' : 'translateX(18px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              transitionDelay: active ? '0.4s' : '0s',
            }}>
              {adLabel('ANNONS', '250 × 600 px')}
            </div>
            <div style={{
              flex: 1, backgroundColor: 'rgba(163,146,132,0.2)', borderRadius: 2,
              opacity: active ? 1 : 0,
              transition: 'opacity 0.4s ease',
              transitionDelay: active ? '0.85s' : '0s',
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar Mid ───────────────────────────────────────────────────

function SidebarMidMockup() {
  const [ref, active] = useInView();
  return (
    <div ref={ref} style={mockupWrap}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <PageChrome />
        <div style={{ flex: 1, display: 'flex', gap: '2.5%', padding: '0 2.5% 3%' }}>
          {/* Left content column */}
          <div style={{ flex: 68, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Featured article image */}
            <div style={{
              flex: '0 0 20%', backgroundColor: 'rgba(163,146,132,0.48)', borderRadius: 2,
              opacity: active ? 1 : 0,
              transition: 'opacity 0.3s ease',
              transitionDelay: active ? '0.05s' : '0s',
            }} />
            {[1, 0.88, 1, 0.92, 1, 0.78].map((w, i) => (
              <div key={i} style={{
                flex: 1, backgroundColor: 'rgba(163,146,132,0.38)', borderRadius: 1,
                width: `${w * 100}%`,
                opacity: active ? 1 : 0,
                transition: 'opacity 0.3s ease',
                transitionDelay: active ? `${0.12 + i * 0.05}s` : '0s',
              }} />
            ))}
          </div>
          {/* Sidebar column */}
          <div style={{ flex: 29, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Content block at top fades in */}
            <div style={{
              flex: 1, backgroundColor: 'rgba(163,146,132,0.2)', borderRadius: 2,
              opacity: active ? 1 : 0,
              transition: 'opacity 0.4s ease',
              transitionDelay: active ? '0.3s' : '0s',
            }} />
            {/* Ad at the bottom slides in from the right */}
            <div style={{
              flex: '0 0 62%', backgroundColor: '#B89B72', borderRadius: 2,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              opacity: active ? 1 : 0,
              transform: active ? 'translateX(0)' : 'translateX(18px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              transitionDelay: active ? '0.65s' : '0s',
            }}>
              {adLabel('ANNONS', '250 × 600 px')}
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
