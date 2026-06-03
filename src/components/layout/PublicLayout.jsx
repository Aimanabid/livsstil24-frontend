import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, Download, Instagram, Facebook, Youtube, Linkedin, ChevronDown } from 'lucide-react';
import AdBanner from '../public/AdBanner';

function TikTokIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.54V6.78a4.85 4.85 0 0 1-1.02-.09z" />
    </svg>
  );
}
import api from '../../utils/api';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export default function PublicLayout() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch]       = useState('');
  const [categories, setCategories] = useState([]);
  const [settings, setSettings]   = useState({});
  const [bannerVisible, setBannerVisible] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(140);
  const bannerRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get('/settings').then(r => setSettings(r.data || {})).catch(() => {});

    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('visitor_id', visitorId);
    }
    // session_id lives in sessionStorage — clears on browser close = new visit
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('session_id', sessionId);
      api.post('/articles/visit', { visitor_id: visitorId, session_id: sessionId }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!settings.favicon_url) return;
    const link = document.querySelector("link[rel='icon']") || document.createElement('link');
    link.rel  = 'icon';
    link.href = settings.favicon_url;
    document.head.appendChild(link);
  }, [settings.favicon_url]);

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [categories, settings]);

  useEffect(() => {
    const onScroll = () => {
      const bannerH = bannerRef.current?.offsetHeight ?? 0;
      setScrolled(prev => {
        if (!prev && window.scrollY >= bannerH) return true;
        if (prev && window.scrollY < bannerH - 20) return false;
        return prev;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navigate = useNavigate();
  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: sv });

  const handleSearch = e => {
    e.preventDefault();
    const q = search.trim();
    if (q) {
      navigate(`/sok?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearch('');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F0EA' }}>

      {/* ── Hero banner — normal flow, scrolls away ── */}
      <div ref={bannerRef} style={bannerVisible ? { height: `calc(100vh - ${headerHeight}px)` } : { height: 0 }} className="relative overflow-hidden transition-[height] duration-300">
        <AdBanner placement="hero_banner" className="h-full border-b border-cream-200" hideLabel />

        {/* Close button */}
        <button
          onClick={() => setBannerVisible(false)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors" style={{ backgroundColor: '#F4F0EA', color: '#0E0E0E' }}
          aria-label="Stäng annons"
        >
          <X size={15} />
        </button>

        {/* Scroll-to-navbar button */}
        <button
          onClick={() => window.scrollTo({ top: (bannerRef.current?.offsetHeight ?? 0) + 80, behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors animate-pulse" style={{ backgroundColor: '#F4F0EA', color: '#0E0E0E' }}
          aria-label="Visa navigering"
        >
          <ChevronDown size={18} style={{ animation: 'chevron-float 2s ease-in-out infinite' }} />
        </button>
      </div>

      {/* ── Sticky header ── */}
      <header ref={headerRef} className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-[0_1px_0_#E9E3DA]' : ''}`} style={{ backgroundColor: '#F4F0EA' }}>

        {/* Logo row */}
        <div className={`flex items-center px-6 md:px-16 transition-all duration-300 ${scrolled ? 'py-2 md:py-3' : 'py-5 md:py-6'}`}>

          {/* Left: search + mobile menu */}
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSearchOpen(s => !s)}
              className="transition-colors text-[#0e0e0e] hover:text-[#B89B72]" aria-label="Sök">
              <Search size={17} />
            </button>
            <button className="md:hidden" onClick={() => setMenuOpen(s => !s)} aria-label="Meny">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Center: masthead */}
          <Link to="/" className="flex-shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt="Livsstil24"
                className={`object-contain transition-all duration-300 ${scrolled ? 'h-7 md:h-8' : 'h-10 md:h-14'}`}
              />
            ) : (
              <span className={`font-display tracking-[0.12em] transition-all duration-300 block ${scrolled ? 'text-xl md:text-2xl' : 'text-3xl md:text-5xl'}`} style={{ color: '#0e0e0e' }}>
                LIVSSTIL<span style={{ color: '#B89B72' }}>24</span>
              </span>
            )}
          </Link>

          {/* Right: app link */}
          <div className="flex-1 flex justify-end">
            <Link to="/app"
              className="hidden md:flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase font-medium transition-colors text-[#0e0e0e] hover:text-[#B89B72]">
              <Download size={12} /> App
            </Link>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:block border-t border-cream-200">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-10 xl:px-16">
            <div className="flex items-center justify-center gap-6 md:gap-8 lg:gap-10 xl:gap-14 py-4 overflow-hidden">
              {categories.map(cat => (
                <NavLink key={cat.id} to={`/kategori/${cat.slug}`}
                  className={({ isActive }) => `nav-link whitespace-nowrap ${isActive ? 'active' : ''}`}>
                  {cat.name}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-cream-200 px-6 py-3 animate-slide-down" style={{ backgroundColor: '#F4F0EA' }}>
            <form onSubmit={handleSearch} className="max-w-lg mx-auto flex items-center gap-3">
              <Search size={14} className="shrink-0" style={{ color: '#A39284' }} />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Sök i Livsstil24..."
                className="flex-1 bg-transparent text-sm py-1 focus:outline-none"
                style={{ color: '#0e0e0e' }}
              />
              <button type="submit"
                className="text-[11px] tracking-[0.18em] uppercase font-medium transition-colors shrink-0 text-[#0e0e0e] hover:text-[#B89B72]">
                Sök
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-cream-200 animate-slide-down" style={{ backgroundColor: '#F4F0EA' }}>
            <div className="px-6 py-2">
              {categories.map(cat => (
                <NavLink key={cat.id} to={`/kategori/${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-4 font-sans text-base border-b border-cream-200 transition-colors ${isActive ? 'text-[#B89B72]' : 'text-[#0e0e0e] hover:text-[#B89B72]'}`
                  }>
                  {cat.name}
                </NavLink>
              ))}
              <Link to="/app" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-4 text-sm font-medium transition-colors text-[#0e0e0e] hover:text-[#B89B72]">
                <Download size={13} /> Ladda ner appen
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <div className="max-w-7xl mx-auto px-6 mb-6">
        <AdBanner placement="footer_banner" />
      </div>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: '#ddd6d0' }}>
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-14">

            <div className="col-span-2 md:col-span-1">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="Livsstil24" className="h-8 object-contain mb-4" />
              ) : (
                <span className="font-display text-2xl tracking-[0.1em] block mb-4" style={{ color: '#0E0E0E' }}>
                  LIVSSTIL<span style={{ color: '#B89B72' }}>24</span>
                </span>
              )}
              <p className="text-xs leading-relaxed mb-6 max-w-[200px]" style={{ color: '#0E0E0E' }}>
                {settings.site_description || 'Din digitala livsstilstidning för mode, skönhet och det moderna livet.'}
              </p>
              <div className="flex gap-4">
                {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-link"><Instagram size={16} /></a>}
                {settings.facebook_url  && <a href={settings.facebook_url}  target="_blank" rel="noopener noreferrer" aria-label="Facebook"  className="footer-link"><Facebook  size={16} /></a>}
                {settings.tiktok_url    && <a href={settings.tiktok_url}    target="_blank" rel="noopener noreferrer" aria-label="TikTok"    className="footer-link"><TikTokIcon size={16} /></a>}
                {settings.youtube_url   && <a href={settings.youtube_url}   target="_blank" rel="noopener noreferrer" aria-label="YouTube"   className="footer-link"><Youtube    size={16} /></a>}
                {settings.linkedin_url  && <a href={settings.linkedin_url}  target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"  className="footer-link"><Linkedin   size={16} /></a>}
              </div>
            </div>

            <div>
              <h3 className="eyebrow mb-5" style={{ color: '#0E0E0E' }}>Kategorier</h3>
              <ul className="space-y-3">
                {categories.slice(0, 6).map(cat => (
                  <li key={cat.id}>
                    <Link to={`/kategori/${cat.slug}`} className="text-xs footer-link">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="eyebrow mb-5" style={{ color: '#0E0E0E' }}>Juridiskt</h3>
              <ul className="space-y-3 text-xs">
                <li><a href="#" className="footer-link">Integritetspolicy</a></li>
                <li><a href="#" className="footer-link">Cookiepolicy</a></li>
                <li><a href="#" className="footer-link">Användarvillkor</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-3" style={{ borderColor: 'rgba(14,14,14,0.15)' }}>
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-5">
              <p className="text-[11px]" style={{ color: '#0E0E0E' }}>© 2026 Livsstil24 AB · Alla rättigheter förbehållna</p>
              {settings.chief_editor && (
                <p className="text-[11px]" style={{ color: '#0E0E0E' }}>Chefredaktör: {settings.chief_editor}</p>
              )}
              {settings.responsible_publisher && (
                <p className="text-[11px]" style={{ color: '#0E0E0E' }}>Ansvarig utgivare: {settings.responsible_publisher}</p>
              )}
            </div>
            <Link to="/admin" className="text-[11px] footer-link">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
