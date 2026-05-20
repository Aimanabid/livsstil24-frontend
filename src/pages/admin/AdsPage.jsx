import { useEffect, useState, useRef } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, ExternalLink, X, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export default function AdsPage() {
  const [ads, setAds] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', ad_type: 'banner', image_url: '', video_url: '', link_url: '', alt_text: '', placement_id: '', customer_id: '', status: 'active', start_date: '', end_date: '', price_paid: '' });
  const [uploading, setUploading] = useState({ image: false, video: false });
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const fetchAds = async () => {
    setLoading(true);
    const [adsRes, placRes, custRes] = await Promise.all([
      api.get('/ads'), api.get('/ads/placements'), api.get('/customers')
    ]);
    setAds(adsRes.data);
    setPlacements(placRes.data);
    setCustomers(custRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchAds(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', ad_type: 'image', image_url: '', video_url: '', link_url: '', alt_text: '', placement_id: '', customer_id: '', status: 'active', start_date: '', end_date: '', price_paid: '' });
    setModal(true);
  };

  const openEdit = (ad) => {
    setEditing(ad);
    setForm({
      title: ad.title, ad_type: ad.ad_type || 'banner',
      image_url: ad.image_url || '', video_url: ad.video_url || '',
      link_url: ad.link_url || '', alt_text: ad.alt_text || '',
      placement_id: ad.placement_id || '', customer_id: ad.customer_id || '',
      status: ad.status, start_date: ad.start_date || '',
      end_date: ad.end_date || '', price_paid: ad.price_paid || ''
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.title) { toast.error('Titel krävs'); return; }
    try {
      if (editing) {
        await api.put(`/ads/${editing.id}`, form);
        toast.success('Annons uppdaterad');
      } else {
        await api.post('/ads', form);
        toast.success('Annons skapad');
      }
      setModal(false);
      fetchAds();
    } catch { toast.error('Något gick fel'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Ta bort annonsen?')) return;
    await api.delete(`/ads/${id}`);
    toast.success('Annons borttagen');
    fetchAds();
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const uploadImage = async (file) => {
    if (!file) return;
    setUploading(u => ({ ...u, image: true }));
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/upload', fd);
      set('image_url', data.url);
      toast.success('Bild uppladdad');
    } catch { toast.error('Kunde inte ladda upp bild'); }
    finally { setUploading(u => ({ ...u, image: false })); }
  };

  const uploadVideo = async (file) => {
    if (!file) return;
    setUploading(u => ({ ...u, video: true }));
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/upload/video', fd);
      set('video_url', data.url);
      toast.success('Video uppladdad');
    } catch { toast.error('Kunde inte ladda upp video'); }
    finally { setUploading(u => ({ ...u, video: false })); }
  };

  const totalRevenue = ads.reduce((s, a) => s + parseFloat(a.price_paid || 0), 0);
  const totalClicks = ads.reduce((s, a) => s + parseInt(a.clicks || 0), 0);
  const totalImpressions = ads.reduce((s, a) => s + parseInt(a.impressions || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal-800">Annonser</h1>
          <p className="text-sm text-gray-400 mt-0.5">{ads.length} annonser</p>
        </div>
        <button onClick={openNew} className="btn-primary inline-flex items-center gap-2 text-xs">
          <Plus size={14} /> Ny annons
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total omsättning', value: `${totalRevenue.toLocaleString('sv')} kr` },
          { label: 'Totala klick', value: totalClicks.toLocaleString('sv') },
          { label: 'Totala visningar', value: totalImpressions.toLocaleString('sv') },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4">
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Ads table */}
      <div className="card overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-400 text-sm">Laddar...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Annons</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Kund</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Plats</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-400 font-medium">Visningar</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-400 font-medium">Klick</th>
                  <th className="text-right px-4 py-3 text-xs text-gray-400 font-medium">Intäkt</th>
                  <th className="text-center px-4 py-3 text-xs text-gray-400 font-medium">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {ads.map(ad => (
                  <tr key={ad.id} className="border-b border-gray-50 hover:bg-cream-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {ad.image_url && <img src={ad.image_url} alt="" className="w-12 h-8 object-cover rounded flex-shrink-0 bg-gray-100" />}
                        <div>
                          <p className="text-sm font-medium">{ad.title}</p>
                          {ad.link_url && <a href={ad.link_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-400 flex items-center gap-0.5 hover:underline">
                            <ExternalLink size={10} /> {ad.link_url.slice(0, 30)}...
                          </a>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ad.customer_name || '–'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{ad.placement_name}</td>
                    <td className="px-4 py-3 text-right text-sm">{parseInt(ad.impressions || 0).toLocaleString('sv')}</td>
                    <td className="px-4 py-3 text-right text-sm">{parseInt(ad.clicks || 0).toLocaleString('sv')}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium">{(ad.price_paid || 0).toLocaleString('sv')} kr</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`status-badge ${ad.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                        {ad.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(ad)} className="p-1.5 rounded text-gray-400 hover:text-charcoal-800 hover:bg-cream-100 transition-colors">
                          <Edit size={15} />
                        </button>
                        <button onClick={() => handleDelete(ad.id)} className="p-1.5 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-display text-lg">{editing ? 'Redigera annons' : 'Ny annons'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-charcoal-800"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="label">Titel</label><input value={form.title} onChange={e => set('title', e.target.value)} className="input-field" placeholder="Annonsens namn" /></div>
              <div>
                <label className="label">Medietyp</label>
                <select value={form.ad_type} onChange={e => set('ad_type', e.target.value)} className="input-field">
                  <option value="image">Bild</option>
                  <option value="video">Video</option>
                </select>
              </div>
              {/* Media upload — shown based on ad_type */}
              {form.ad_type === 'image' ? (
                <div>
                  <label className="label">Bild</label>
                  <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => uploadImage(e.target.files[0])} />
                  <button type="button" onClick={() => imageInputRef.current.click()}
                    disabled={uploading.image}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-400 hover:border-gold-400 hover:text-gold-400 transition-colors disabled:opacity-50">
                    <Upload size={15} />
                    {uploading.image ? 'Laddar upp...' : 'Välj bild från datorn'}
                  </button>
                  {form.image_url && (
                    <div className="mt-2 relative">
                      <img src={form.image_url} alt="" className="w-full h-24 object-contain bg-gray-50 rounded-lg" />
                      <button type="button" onClick={() => set('image_url', '')}
                        className="absolute top-1 right-1 bg-white rounded-full p-0.5 text-gray-400 hover:text-red-500 shadow">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="label">Video</label>
                  <input ref={videoInputRef} type="file" accept="video/*" className="hidden"
                    onChange={e => uploadVideo(e.target.files[0])} />
                  <button type="button" onClick={() => videoInputRef.current.click()}
                    disabled={uploading.video}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-400 hover:border-gold-400 hover:text-gold-400 transition-colors disabled:opacity-50">
                    <Upload size={15} />
                    {uploading.video ? 'Laddar upp...' : 'Välj video från datorn'}
                  </button>
                  {form.video_url && (
                    <div className="mt-2 relative">
                      <video src={form.video_url} className="w-full h-24 rounded-lg bg-black object-contain" controls />
                      <button type="button" onClick={() => set('video_url', '')}
                        className="absolute top-1 right-1 bg-white rounded-full p-0.5 text-gray-400 hover:text-red-500 shadow">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div><label className="label">Länk-URL</label><input value={form.link_url} onChange={e => set('link_url', e.target.value)} className="input-field" placeholder="https://..." /></div>
              <div><label className="label">Undertext</label><input value={form.alt_text} onChange={e => set('alt_text', e.target.value)} className="input-field" placeholder="Kort beskrivning eller slogan" /></div>
              <div>
                <label className="label">Annonsplats</label>
                <select value={form.placement_id} onChange={e => set('placement_id', e.target.value)} className="input-field">
                  <option value="">Välj plats...</option>
                  {placements.map(p => <option key={p.id} value={p.id}>{p.name} – {Number(p.price_monthly).toLocaleString('sv')} kr/mån</option>)}
                </select>
              </div>
              <div>
                <label className="label">Kund</label>
                <select value={form.customer_id} onChange={e => set('customer_id', e.target.value)} className="input-field">
                  <option value="">Välj kund...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Startdatum</label><input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} className="input-field" /></div>
                <div><label className="label">Slutdatum</label><input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} className="input-field" /></div>
              </div>
              <div><label className="label">Betalt belopp (kr)</label><input type="number" value={form.price_paid} onChange={e => set('price_paid', e.target.value)} className="input-field" /></div>
              <div>
                <label className="label">Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)} className="input-field">
                  <option value="active">Aktiv</option>
                  <option value="inactive">Inaktiv</option>
                  <option value="paused">Pausad</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="btn-outline text-xs py-2 px-4">Avbryt</button>
              <button onClick={handleSave} className="btn-gold text-xs py-2 px-4">Spara</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
