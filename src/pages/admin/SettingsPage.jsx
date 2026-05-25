import { useEffect, useRef, useState } from 'react';
import { Settings, Instagram, Facebook, Youtube, Linkedin, Save, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

function TikTokIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.79 1.54V6.78a4.85 4.85 0 0 1-1.02-.09z" />
    </svg>
  );
}

function ImageUploadField({ label, hint, value, onChange, previewSize = 'h-20', accept = 'image/*', defaultPreview = null }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/upload', fd);
      onChange(data.url);
    } catch {
      toast.error('Uppladdningen misslyckades');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="label">{label}</label>
      <div className="border border-dashed border-cream-200 rounded-lg p-4 bg-cream-50">
        {value ? (
          <div className="relative inline-block">
            <img src={value} alt={label} className={`${previewSize} w-auto object-contain rounded`} />
            <button
              onClick={() => onChange('')}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X size={11} />
            </button>
          </div>
        ) : defaultPreview ? (
          <div className={`${previewSize} flex items-center`}>
            {defaultPreview}
          </div>
        ) : (
          <div className={`${previewSize} flex items-center justify-center text-xs text-gray-300`}>
            Ingen bild vald
          </div>
        )}
        <div className="mt-3">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={e => handleFile(e.target.files[0])}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 text-xs px-3 py-1.5 border border-cream-200 rounded hover:border-gold-400 hover:text-gold-500 transition-colors text-gray-500"
          >
            <Upload size={12} />
            {uploading ? 'Laddar upp...' : value ? 'Byt bild' : 'Välj bild'}
          </button>
        </div>
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function SettingsPage() {
  const [form, setForm] = useState({
    site_description: '',
    instagram_url:    '',
    facebook_url:     '',
    tiktok_url:       '',
    youtube_url:      '',
    linkedin_url:     '',
    logo_url:         '',
    favicon_url:      '',
  });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => setForm(f => ({ ...f, ...data })))
      .catch(() => toast.error('Kunde inte ladda inställningar'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', form);
      toast.success('Inställningar sparade');
    } catch {
      toast.error('Kunde inte spara inställningar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex gap-2">
        {[0,1,2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <Settings size={20} className="text-gold-400" />
        <h1 className="text-xl font-semibold text-charcoal-800">Sidinställningar</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">

        {/* ── Left column ── */}
        <div className="space-y-6">

          <div className="card p-6">
            <h2 className="text-sm font-semibold text-charcoal-800 mb-4">Footer</h2>
            <div>
              <label className="label">Beskrivning under logotyp</label>
              <textarea
                name="site_description"
                value={form.site_description}
                onChange={handleChange}
                rows={3}
                className="input-field w-full resize-none"
                placeholder="Din digitala livsstilstidning..."
              />
              <p className="text-xs text-gray-400 mt-1">Visas i footern under LIVSSTIL24-logotypen.</p>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-semibold text-charcoal-800 mb-4">Sociala medier</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="label flex items-center gap-2"><Instagram size={14} /> Instagram</label>
                <input type="url" name="instagram_url" value={form.instagram_url} onChange={handleChange}
                  className="input-field w-full" placeholder="https://instagram.com/livsstil24" />
              </div>
              <div>
                <label className="label flex items-center gap-2"><Youtube size={14} /> YouTube</label>
                <input type="url" name="youtube_url" value={form.youtube_url} onChange={handleChange}
                  className="input-field w-full" placeholder="https://youtube.com/livsstil24" />
              </div>
              <div>
                <label className="label flex items-center gap-2"><Facebook size={14} /> Facebook</label>
                <input type="url" name="facebook_url" value={form.facebook_url} onChange={handleChange}
                  className="input-field w-full" placeholder="https://facebook.com/livsstil24" />
              </div>
              <div>
                <label className="label flex items-center gap-2"><Linkedin size={14} /> LinkedIn</label>
                <input type="url" name="linkedin_url" value={form.linkedin_url} onChange={handleChange}
                  className="input-field w-full" placeholder="https://linkedin.com/livsstil24" />
              </div>
              <div>
                <label className="label flex items-center gap-2"><TikTokIcon size={14} /> TikTok</label>
                <input type="url" name="tiktok_url" value={form.tiktok_url} onChange={handleChange}
                  className="input-field w-full" placeholder="https://tiktok.com/livsstil24" />
              </div>
            </div>
          </div>

        </div>

        {/* ── Right column ── */}
        <div className="space-y-6">

          <div className="card p-6">
            <h2 className="text-sm font-semibold text-charcoal-800 mb-4">Logotyp</h2>
            <ImageUploadField
              label="Sideslogotyp"
              hint="Visas i headern och footern. Om ingen bild väljs visas textlogotypen."
              value={form.logo_url}
              onChange={val => setField('logo_url', val)}
              previewSize="h-12"
              defaultPreview={
                <span className="font-display text-2xl tracking-[0.1em] text-charcoal-800">
                  LIVSSTIL<span className="text-gold-400">24</span>
                </span>
              }
            />
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-semibold text-charcoal-800 mb-4">Favicon</h2>
            <ImageUploadField
              label="Favicon"
              hint="Visas i webbläsarens flik. Rekommenderad storlek: 32×32 eller 64×64 px."
              value={form.favicon_url}
              onChange={val => setField('favicon_url', val)}
              previewSize="h-8"
              defaultPreview={
                <img src="/favicon.svg" alt="Standard favicon" className="h-8 w-8 object-contain" />
              }
            />
          </div>

        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={15} />
          {saving ? 'Sparar...' : 'Spara inställningar'}
        </button>
      </div>
    </div>
  );
}
