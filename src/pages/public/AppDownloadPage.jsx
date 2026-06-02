import { useEffect, useState } from 'react';
import { Download, Smartphone, Zap, Star, Bell, Wifi } from 'lucide-react';

export default function AppDownloadPage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

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
      <div style={{ backgroundColor: '#5A5B46' }}>
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(184,155,114,0.2)', color: '#B89B72' }}>
            <Smartphone size={14} /> Mobilapp
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6" style={{ color: '#0e0e0e' }}>
            Livsstil24<br />
            <span style={{ color: '#B89B72' }}>i din ficka</span>
          </h1>
          <p className="text-lg max-w-lg mx-auto mb-10 leading-relaxed" style={{ color: '#0E0E0E' }}>
            Installera vår app direkt på din hemskärm – ingen App Store behövs. Snabb, elegant och alltid med dig.
          </p>

          {installed ? (
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm" style={{ backgroundColor: 'rgba(184,155,114,0.2)', color: '#B89B72' }}>
              <Star size={16} fill="currentColor" /> Appen är installerad! Öppna den från hemskärmen.
            </div>
          ) : isIOS ? (
            <div className="rounded-2xl p-6 max-w-sm mx-auto text-left" style={{ backgroundColor: 'rgba(244,240,234,0.1)' }}>
              <p className="text-xs font-medium mb-4 tracking-wide uppercase" style={{ color: '#B89B72' }}>Installera på iPhone / iPad</p>
              <ol className="space-y-3 text-sm" style={{ color: '#0E0E0E' }}>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'rgba(184,155,114,0.2)', color: '#B89B72' }}>1</span>
                  Tryck på <strong>Dela</strong>-ikonen (rutan med pil) i webbläsarens verktygsfält
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'rgba(184,155,114,0.2)', color: '#B89B72' }}>2</span>
                  Skrolla ned och tryck på <strong>"Lägg till på hemskärm"</strong>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'rgba(184,155,114,0.2)', color: '#B89B72' }}>3</span>
                  Tryck på <strong>"Lägg till"</strong> – klart!
                </li>
              </ol>
            </div>
          ) : deferredPrompt ? (
            <button onClick={handleInstall} className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4">
              <Download size={18} /> Installera appen gratis
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm" style={{ color: '#0E0E0E' }}>Öppna den här sidan i Chrome eller Safari för att installera appen.</p>
              <div className="flex justify-center gap-4 mt-4">
                <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer"
                  className="text-xs px-4 py-2 rounded border border-[#B89B72] transition-colors"
                  style={{ color: '#0E0E0E' }}>
                  Google Chrome
                </a>
                <a href="https://www.apple.com/safari/" target="_blank" rel="noopener noreferrer"
                  className="text-xs px-4 py-2 rounded border border-[#B89B72] transition-colors"
                  style={{ color: '#0E0E0E' }}>
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
          <div className="flex justify-center mb-3"><div className="w-8 h-px" style={{ backgroundColor: '#B89B72' }} /></div>
          <h2 className="font-display text-3xl" style={{ color: '#0e0e0e' }}>Varför installera appen?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: 'Blixtsnabb', desc: 'Appen laddas direkt från din enhet – ingen väntetid, oavsett nätverksanslutning.' },
            { icon: Bell, title: 'Notiser', desc: 'Få en notis när vi publicerar nyheter inom dina favoritkategorier.' },
            { icon: Wifi, title: 'Offline-läsning', desc: 'Artiklar du nyligen läst är tillgängliga även utan internet.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-8 border border-cream-200 hover:border-[#B89B72] transition-colors group">
              <div className="inline-flex w-12 h-12 items-center justify-center rounded-full mb-4 transition-colors group-hover:bg-[#E9E3DA]" style={{ backgroundColor: '#F4F0EA' }}>
                <Icon size={20} style={{ color: '#B89B72' }} />
              </div>
              <h3 className="font-display text-xl mb-2" style={{ color: '#0e0e0e' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#A39284' }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Screenshots mockup */}
        <div className="mt-20 text-center">
          <div className="inline-block relative">
            <div className="w-56 h-96 rounded-3xl shadow-2xl mx-auto overflow-hidden border-4" style={{ backgroundColor: '#5A5B46', borderColor: '#5A5B46' }}>
              <div className="h-full pt-8 px-4" style={{ backgroundColor: '#F4F0EA' }}>
                <div className="text-center mb-4">
                  <p className="font-display text-xl" style={{ color: '#0e0e0e' }}>LIVSSTIL<span style={{ color: '#B89B72' }}>24</span></p>
                </div>
                {[
                  { cat: 'Mode', h: 'h-16', color: '#D4A5A5' },
                  { cat: 'Skönhet', h: 'h-12', color: '#E8C4B8' },
                  { cat: 'Mat & Dryck', h: 'h-12', color: '#B89B72' },
                ].map((item, i) => (
                  <div key={i} className="mb-2">
                    <div className={`${item.h} bg-cream-200 rounded-lg mb-1`} />
                    <p className="text-xs text-left" style={{ color: item.color, fontSize: '9px' }}>{item.cat}</p>
                    <div className="h-2 bg-cream-200 rounded w-4/5 mb-0.5" />
                    <div className="h-2 rounded w-3/5" style={{ backgroundColor: '#F4F0EA' }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#B89B72' }}>
              <Smartphone size={20} style={{ color: '#F4F0EA' }} />
            </div>
          </div>
          <p className="text-sm mt-8" style={{ color: '#A39284' }}>Livsstil24 ser ut och fungerar som en native app</p>
        </div>
      </div>
    </div>
  );
}
