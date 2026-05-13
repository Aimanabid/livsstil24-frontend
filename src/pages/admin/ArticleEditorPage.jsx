import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Save, Eye, ArrowLeft, X, Image, Clock } from 'lucide-react';
import ReactQuill from 'react-quill-new';;
import 'react-quill-new/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link', 'image'],
    ['clean']
  ]
};

export default function ArticleEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'ny';

  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', featured_image: '',
    category_id: '', status: 'draft', featured: false, read_time: 5,
    seo_title: '', seo_description: '', tags: [], slug: ''
  });
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {});

    if (!isNew) {
      api.get(`/articles/admin/${id}`)
        .then(({ data }) => {
          setForm({
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            featured_image: data.featured_image || '',
            category_id: data.category_id || '',
            status: data.status || 'draft',
            featured: !!data.featured,
            read_time: data.read_time || 5,
            seo_title: data.seo_title || '',
            seo_description: data.seo_description || '',
            tags: Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags || '[]'),
            slug: data.slug || ''
          });
        })
        .catch(() => toast.error('Kunde inte hämta artikel'));
    }
  }, [id]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingImage(true);
    try {
      const { data } = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      set('featured_image', data.url);
      toast.success('Bild uppladdad');
    } catch { toast.error('Bilduppladdning misslyckades'); }
    finally { setUploadingImage(false); }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      set('tags', [...form.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSave = async (status) => {
    if (!form.title.trim()) { toast.error('Titel krävs'); return; }
    if (!form.category_id) { toast.error('Välj en kategori'); return; }
    setSaving(true);
    try {
      const payload = { ...form, status: status || form.status };
      if (isNew) {
        const { data } = await api.post('/articles', payload);
        toast.success('Artikel skapad!');
        navigate(`/admin/artiklar/${data.id}`);
      } else {
        await api.put(`/articles/${id}`, payload);
        toast.success('Sparad!');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Fel vid sparande');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-6xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/artiklar" className="p-2 hover:bg-cream-100 rounded-lg transition-colors text-gray-400 hover:text-charcoal-800">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-display text-xl text-charcoal-800">{isNew ? 'Ny artikel' : 'Redigera artikel'}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`status-badge ${form.status === 'published' ? 'status-published' : 'status-draft'}`}>
                {form.status === 'published' ? 'Publicerad' : 'Utkast'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNew && (
            <Link to={`/artikel/${form.slug}`} target="_blank"
              className="btn-outline inline-flex items-center gap-1.5 text-xs py-2 px-4">
              <Eye size={14} /> Förhandsgranska
            </Link>
          )}
          <button onClick={() => handleSave('draft')} disabled={saving}
            className="btn-outline inline-flex items-center gap-1.5 text-xs py-2 px-4 disabled:opacity-50">
            <Save size={14} /> Spara utkast
          </button>
          <button onClick={() => handleSave('published')} disabled={saving}
            className="btn-gold inline-flex items-center gap-1.5 text-xs py-2 px-4 disabled:opacity-50">
            {saving ? 'Sparar...' : '✓ Publicera'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Main editor */}
        <div className="space-y-5">
          {/* Title */}
          <div className="card p-5">
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Artikelns titel..."
              className="w-full border-none focus:outline-none text-2xl font-display text-charcoal-800 placeholder-gray-200 bg-transparent"
            />
            <div className="h-px bg-cream-200 my-3" />
            <textarea
              value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              placeholder="Kort sammanfattning (ingress)..."
              className="w-full border-none focus:outline-none text-sm text-gray-500 placeholder-gray-300 resize-none bg-transparent leading-relaxed"
              rows={3}
            />
          </div>

          {/* Featured image */}
          <div className="card p-5">
            <label className="label">Omslagsbild</label>
            {form.featured_image ? (
              <div className="relative group">
                <img src={form.featured_image} alt="" className="w-full aspect-[16/7] object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                  <button onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-charcoal-800 text-xs px-3 py-1.5 rounded font-medium">
                    Byt bild
                  </button>
                  <button onClick={() => set('featured_image', '')}
                    className="bg-red-500 text-white text-xs px-3 py-1.5 rounded font-medium">
                    Ta bort
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-cream-200 rounded-lg p-8 text-center cursor-pointer hover:border-gold-400 transition-colors"
              >
                {uploadingImage ? (
                  <p className="text-sm text-gray-400">Laddar upp...</p>
                ) : (
                  <>
                    <Image size={24} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">Klicka för att ladda upp bild</p>
                    <p className="text-xs text-gray-300 mt-1">JPG, PNG, WebP – max 10MB</p>
                  </>
                )}
              </div>
            )}
            <input
              type="text"
              value={form.featured_image}
              onChange={e => set('featured_image', e.target.value)}
              placeholder="eller klistra in bild-URL..."
              className="input-field mt-3 text-xs"
            />
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          {/* Content */}
          <div className="card p-5">
            <label className="label">Innehåll</label>
            <ReactQuill
              value={form.content}
              onChange={val => set('content', val)}
              modules={quillModules}
              theme="snow"
            />
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
          {/* Publish settings */}
          <div className="card p-4 space-y-4">
            <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Publiceringsinställningar</h3>

            <div>
              <label className="label">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className="input-field text-sm">
                <option value="draft">Utkast</option>
                <option value="published">Publicerad</option>
              </select>
            </div>

            <div>
              <label className="label">Kategori</label>
              <select value={form.category_id} onChange={e => set('category_id', e.target.value)} className="input-field text-sm">
                <option value="">Välj kategori...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="label flex items-center gap-1.5"><Clock size={12} /> Lästid (minuter)</label>
              <input type="number" min="1" max="60" value={form.read_time}
                onChange={e => set('read_time', parseInt(e.target.value))}
                className="input-field text-sm" />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
                className="w-4 h-4 accent-gold-400 rounded" />
              <span className="text-sm">Utvald artikel (visas i hero)</span>
            </label>
          </div>

          {/* Tags */}
          <div className="card p-4 space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">Taggar</h3>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Lägg till tagg..." className="input-field text-sm flex-1" />
              <button onClick={addTag} className="btn-outline text-xs py-2 px-3">+</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs bg-cream-100 px-2 py-1 rounded-full">
                    {tag}
                    <button onClick={() => set('tags', form.tags.filter(t => t !== tag))} className="text-gray-400 hover:text-red-400 transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="card p-4 space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">SEO</h3>
            <div>
              <label className="label">SEO-titel</label>
              <input value={form.seo_title} onChange={e => set('seo_title', e.target.value)}
                placeholder={form.title || 'Lämna tomt för att använda titeln'}
                className="input-field text-sm" />
              <p className="text-xs text-gray-400 mt-1">{(form.seo_title || form.title).length}/60 tecken</p>
            </div>
            <div>
              <label className="label">Meta-beskrivning</label>
              <textarea value={form.seo_description} onChange={e => set('seo_description', e.target.value)}
                placeholder={form.excerpt || 'Kort beskrivning för sökmotorer'}
                className="input-field text-sm resize-none" rows={3} />
              <p className="text-xs text-gray-400 mt-1">{(form.seo_description || form.excerpt || '').length}/160 tecken</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
