import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Search, Menu, X, Download, Instagram, Facebook } from 'lucide-react';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [spacerHeight, setSpacerHeight] = useState(0);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const headerRef = useRef(null);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(Array.isArray(r.data) ? r.data : [])).catch(() => {});
    api.get('/settings').then(r => setSettings(r.data || {})).catch(() => {});
  }, []);

  useEffect(() => {
    if (!settings.favicon_url) return;
    const link = document.querySelector("link[rel='icon']") || document.createElement('link');
    link.rel  = 'icon';
    link.href = settings.favicon_url;
    document.head.appendChild(link);
  }, [settings.favicon_url]);
  const navigate = useNavigate();
  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: sv });

  // Measure the large (non-scrolled) header height once on mount for the spacer
  useLayoutEffect(() => {
    if (headerRef.current) setSpacerHeight(headerRef.current.offsetHeight);
  }, []);

  // Re-measure on resize (viewport width change can alter height)
  useEffect(() => {
    const onResize = () => {
      if (headerRef.current && !scrolled) setSpacerHeight(headerRef.current.offsetHeight);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [scrolled]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    const q = search.trim();
    if (q) {
      navigate({ pathname: '/', search: `?search=${encodeURIComponent(q)}` });
      setSearchOpen(false);
      setSearch('');
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">

      {/* ── Top microbar ── */}
      <div className="hidden md:block border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <p className="text-[11px] text-gray-400 tracking-wide capitalize">{today}</p>
          <Link to="#newsletter"
            className="text-[11px] tracking-[0.18em] uppercase font-medium text-charcoal-800 hover:text-gold-400 transition-colors">
            Prenumerera på nyhetsbrevet →
          </Link>
          <div className="flex items-center gap-4">
            {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-charcoal-800 transition-colors"><Instagram size={14} /></a>}
            {settings.facebook_url  && <a href={settings.facebook_url}  target="_blank" rel="noopener noreferrer" aria-label="Facebook"  className="text-gray-400 hover:text-charcoal-800 transition-colors"><Facebook  size={14} /></a>}
            {settings.tiktok_url    && <a href={settings.tiktok_url}    target="_blank" rel="noopener noreferrer" aria-label="TikTok"    className="text-gray-400 hover:text-charcoal-800 transition-colors"><TikTokIcon size={14} /></a>}
          </div>
        </div>
      </div>

      {/* Spacer — reserves the space the fixed header occupies */}
      <div style={{ height: spacerHeight }} />

      {/* ── Fixed header ── */}
      <header ref={headerRef} className={`fixed top-0 left-0 right-0 z-50 bg-cream-50 transition-shadow duration-300 ${scrolled ? 'shadow-[0_1px_0_#F0E6D3]' : ''}`}>

        {/* Logo row */}
        <div className={`flex items-center px-6 md:px-12 transition-all duration-300 ${scrolled ? 'py-2 md:py-3' : 'py-5 md:py-6'}`}>

          {/* Left: search + mobile menu */}
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSearchOpen(s => !s)}
              className="text-charcoal-800 hover:text-gold-400 transition-colors" aria-label="Sök">
              <Search size={17} />
            </button>
            <button className="md:hidden" onClick={() => setMenuOpen(s => !s)} aria-label="Meny">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Center: masthead */}
          <Link to="/" className="flex-shrink-0">
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt="Livsstil24"
                className={`object-contain transition-all duration-300 ${scrolled ? 'h-7 md:h-8' : 'h-10 md:h-14'}`}
              />
            ) : (
              <span className={`font-display tracking-[0.12em] text-charcoal-800 transition-all duration-300 block ${scrolled ? 'text-xl md:text-2xl' : 'text-3xl md:text-5xl'}`}>
                LIVSSTIL<span className="text-gold-400">24</span>
              </span>
            )}
          </Link>

          {/* Right: app link */}
          <div className="flex-1 flex justify-end">
            <Link to="/app"
              className="hidden md:flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase font-medium text-gold-500 hover:text-gold-600 transition-colors">
              <Download size={12} /> App
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-cream-200 bg-cream-50 px-6 py-3 animate-slide-down">
            <form onSubmit={handleSearch} className="max-w-lg mx-auto flex items-center gap-3">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Sök i Livsstil24..."
                className="flex-1 bg-transparent text-sm py-1 focus:outline-none placeholder-gray-400 text-charcoal-800"
              />
              <button type="submit"
                className="text-[11px] tracking-[0.18em] uppercase font-medium hover:text-gold-400 transition-colors shrink-0">
                Sök
              </button>
            </form>
          </div>
        )}

        {/* Desktop nav */}
        <nav className="hidden md:block border-t border-cream-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center gap-10 py-3">
              {categories.map(cat => (
                <NavLink key={cat.id} to={`/kategori/${cat.slug}`}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  {cat.name}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-cream-200 bg-cream-50 animate-slide-down">
            <div className="px-6 py-2">
              {categories.map(cat => (
                <NavLink key={cat.id} to={`/kategori/${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-4 font-display text-base border-b border-cream-100 transition-colors ${isActive ? 'text-gold-400' : 'hover:text-gold-400'}`
                  }>
                  {cat.name}
                </NavLink>
              ))}
              <Link to="/app" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-4 text-sm font-medium text-gold-500">
                <Download size={13} /> Ladda ner appen
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      {/* ── Newsletter ── */}
      <section className="bg-charcoal-800 py-16" id="newsletter">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="flex justify-center mb-5">
            <div className="w-8 h-px bg-gold-400" />
          </div>
          <h2 className="font-display italic text-3xl md:text-4xl text-cream-50 mb-3 tracking-wide">
            Håll dig inspirerad
          </h2>
          <p className="text-xs text-cream-300/60 mb-8 tracking-wide leading-relaxed">
            Mode, skönhet och livsstil – direkt i din inkorg varje vecka.
          </p>
          <form className="flex" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Din e-postadress"
              className="flex-1 bg-transparent border border-cream-300/20 border-r-0 px-4 py-3 text-sm text-cream-50 placeholder-cream-300/40 focus:outline-none focus:border-gold-400/50 transition-colors"
            />
            <button className="bg-gold-400 text-white text-[11px] tracking-[0.18em] uppercase font-medium px-5 py-3 hover:bg-gold-500 transition-colors whitespace-nowrap">
              Ja, tack
            </button>
          </form>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-charcoal-900 text-cream-50">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-14">

            <div className="col-span-2 md:col-span-1">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="Livsstil24" className="h-8 object-contain mb-4" />
              ) : (
                <span className="font-display text-2xl tracking-[0.1em] block mb-4">
                  LIVSSTIL<span className="text-gold-400">24</span>
                </span>
              )}
              <p className="text-xs text-cream-300/50 leading-relaxed mb-6 max-w-[200px]">
                {settings.site_description || 'Din digitala livsstilstidning för mode, skönhet och det moderna livet.'}
              </p>
              <div className="flex gap-4">
                {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-cream-300/40 hover:text-gold-400 transition-colors"><Instagram size={16} /></a>}
                {settings.facebook_url  && <a href={settings.facebook_url}  target="_blank" rel="noopener noreferrer" aria-label="Facebook"  className="text-cream-300/40 hover:text-gold-400 transition-colors"><Facebook  size={16} /></a>}
                {settings.tiktok_url    && <a href={settings.tiktok_url}    target="_blank" rel="noopener noreferrer" aria-label="TikTok"    className="text-cream-300/40 hover:text-gold-400 transition-colors"><TikTokIcon size={16} /></a>}
              </div>
            </div>

            <div>
              <h3 className="eyebrow text-gold-400 mb-5">Kategorier</h3>
              <ul className="space-y-3">
                {categories.slice(0, 6).map(cat => (
                  <li key={cat.id}>
                    <Link to={`/kategori/${cat.slug}`}
                      className="text-xs text-cream-300/50 hover:text-cream-50 transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="eyebrow text-gold-400 mb-5">Juridiskt</h3>
              <ul className="space-y-3 text-xs text-cream-300/50">
                <li><a href="#" className="hover:text-cream-50 transition-colors">Integritetspolicy</a></li>
                <li><a href="#" className="hover:text-cream-50 transition-colors">Cookiepolicy</a></li>
                <li><a href="#" className="hover:text-cream-50 transition-colors">Användarvillkor</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-cream-300/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[11px] text-cream-300/30">© 2026 Livsstil24 AB · Alla rättigheter förbehållna</p>
            <Link to="/admin" className="text-[11px] text-cream-300/20 hover:text-cream-300/50 transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
