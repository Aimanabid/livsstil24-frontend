import { useEffect, useState } from 'react';
import { Download, Smartphone, Zap, Star, Bell, Wifi } from 'lucide-react';

export default function AppDownloadPage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(/iPhone|iPad|iPod/.test(navigator.userAgent));

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-charcoal-800 text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-gold-400/20 text-gold-400 text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            <Smartphone size={14} /> Mobilapp
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6">
            Livsstil24<br />
            <span className="text-gold-400">i din ficka</span>
          </h1>
          <p className="text-lg text-cream-200 max-w-lg mx-auto mb-10 leading-relaxed">
            Installera vår app direkt på din hemskärm – ingen App Store behövs. Snabb, elegant och alltid med dig.
          </p>

          {installed ? (
            <div className="inline-flex items-center gap-3 bg-green-500/20 text-green-400 px-8 py-4 rounded-full text-sm">
              <Star size={16} fill="currentColor" /> Appen är installerad! Öppna den från hemskärmen.
            </div>
          ) : isIOS ? (
            <div className="bg-white/10 rounded-2xl p-6 max-w-sm mx-auto text-left">
              <p className="text-sm font-medium mb-4 text-gold-400 tracking-wide uppercase text-xs">Installera på iPhone / iPad</p>
              <ol className="space-y-3 text-sm text-cream-200">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center text-xs font-bold">1</span>
                  Tryck på <strong>Dela</strong>-ikonen (rutan med pil) i webbläsarens verktygsfält
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center text-xs font-bold">2</span>
                  Skrolla ned och tryck på <strong>"Lägg till på hemskärm"</strong>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center text-xs font-bold">3</span>
                  Tryck på <strong>"Lägg till"</strong> – klart!
                </li>
              </ol>
            </div>
          ) : deferredPrompt ? (
            <button onClick={handleInstall} className="btn-gold inline-flex items-center gap-2 text-base px-10 py-4">
              <Download size={18} /> Installera appen gratis
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-cream-300 text-sm">Öppna den här sidan i Chrome eller Safari för att installera appen.</p>
              <div className="flex justify-center gap-4 mt-4">
                <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-cream-300 border border-cream-300/30 px-4 py-2 rounded hover:border-gold-400 hover:text-gold-400 transition-colors">
                  Google Chrome
                </a>
                <a href="https://www.apple.com/safari/" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-cream-300 border border-cream-300/30 px-4 py-2 rounded hover:border-gold-400 hover:text-gold-400 transition-colors">
                  Safari
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-3"><div className="w-8 h-px bg-gold-400" /></div>
          <h2 className="font-display text-3xl">Varför installera appen?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: 'Blixtsnabb', desc: 'Appen laddas direkt från din enhet – ingen väntetid, oavsett nätverksanslutning.' },
            { icon: Bell, title: 'Notiser', desc: 'Få en notis när vi publicerar nyheter inom dina favoritkategorier.' },
            { icon: Wifi, title: 'Offline-läsning', desc: 'Artiklar du nyligen läst är tillgängliga även utan internet.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-8 border border-cream-200 hover:border-gold-400 transition-colors group">
              <div className="inline-flex w-12 h-12 items-center justify-center bg-cream-100 group-hover:bg-gold-400/10 rounded-full mb-4 transition-colors">
                <Icon size={20} className="text-gold-400" />
              </div>
              <h3 className="font-display text-xl mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Screenshots mockup */}
        <div className="mt-20 text-center">
          <div className="inline-block relative">
            <div className="w-56 h-96 bg-charcoal-800 rounded-3xl shadow-2xl mx-auto overflow-hidden border-4 border-charcoal-800">
              <div className="bg-cream-50 h-full pt-8 px-4">
                <div className="text-center mb-4">
                  <p className="font-display text-xl text-charcoal-800">LIVSSTIL<span className="text-gold-400">24</span></p>
                </div>
                {/* Mini article cards */}
                {[
                  { cat: 'Mode', h: 'h-16', color: '#D4A5A5' },
                  { cat: 'Skönhet', h: 'h-12', color: '#E8C4B8' },
                  { cat: 'Mat & Dryck', h: 'h-12', color: '#C9A96E' },
                ].map((item, i) => (
                  <div key={i} className="mb-2">
                    <div className={`${item.h} bg-cream-200 rounded-lg mb-1`} />
                    <p className="text-xs text-left" style={{ color: item.color, fontSize: '9px' }}>{item.cat}</p>
                    <div className="h-2 bg-cream-200 rounded w-4/5 mb-0.5" />
                    <div className="h-2 bg-cream-100 rounded w-3/5" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gold-400 rounded-full flex items-center justify-center shadow-lg">
              <Smartphone size={20} className="text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-8">Livsstil24 ser ut och fungerar som en native app</p>
        </div>
      </div>
    </div>
  );
}
