import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Search, Edit, Trash2, Eye, Star, X } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
const PAGE_SIZE = 20;

const toSlug = (str) =>
  str.toLowerCase().trim()
    .replace(/[åä]/g, 'a').replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const PRESET_COLORS = [
  '#B89B72', '#D4A5A5', '#A8C5A0', '#B8C4D4',
  '#C4A5C9', '#A5C4C9', '#E8C4B8', '#B8A5C4',
];

// ── Categories tab ─────────────────────────────────────────────

function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', color: '#B89B72' });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', slug: '', color: '#B89B72' });
    setModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, color: c.color || '#B89B72' });
    setModal(true);
  };

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleNameChange = (v) => {
    setField('name', v);
    if (!editing) setField('slug', toSlug(v));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Namn krävs'); return; }
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, form);
        toast.success('Kategori uppdaterad');
      } else {
        await api.post('/categories', form);
        toast.success('Kategori skapad');
      }
      setModal(false);
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.error || 'Något gick fel'); }
  };

  const handleDelete = async (c) => {
    if (!confirm(`Ta bort "${c.name}"?`)) return;
    try {
      await api.delete(`/categories/${c.id}`);
      toast.success('Kategori borttagen');
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.error || 'Kunde inte ta bort kategori'); }
  };

  if (loading) return <div className="p-8 text-center text-[#A39284] text-sm">Laddar...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#A39284]">{categories.length} kategorier</p>
        <button onClick={openNew} className="btn-primary inline-flex items-center gap-2 text-xs">
          <Plus size={14} /> Ny kategori
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="font-display text-xl text-[#A39284] mb-4">Inga kategorier ännu</p>
          <button onClick={openNew} className="btn-primary inline-flex items-center gap-2 text-xs">
            <Plus size={14} /> Skapa kategori
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-[#A39284] font-medium">Kategori</th>
                <th className="text-left px-4 py-3 text-xs text-[#A39284] font-medium hidden sm:table-cell">Slug</th>
                <th className="text-right px-4 py-3 text-xs text-[#A39284] font-medium">Artiklar</th>
                <th className="text-right px-5 py-3 text-xs text-[#A39284] font-medium">Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-cream-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                      <span className="text-sm font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <code className="text-xs text-[#A39284] bg-[#F4F0EA] px-2 py-1 rounded">{c.slug}</code>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-[#A39284]">{c.article_count}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(c)}
                        className="p-1.5 rounded text-[#A39284] hover:text-charcoal-800 hover:bg-cream-100 transition-colors">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleDelete(c)}
                        className="p-1.5 rounded text-[#A39284] hover:text-red-500 hover:bg-red-50 transition-colors"
                        title={c.article_count > 0 ? 'Kan inte tas bort — har artiklar kopplade' : 'Ta bort'}>
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-display text-lg">{editing ? 'Redigera kategori' : 'Ny kategori'}</h2>
              <button onClick={() => setModal(false)} className="text-[#A39284] hover:text-charcoal-800">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Namn *</label>
                <input value={form.name} onChange={e => handleNameChange(e.target.value)} className="input-field" placeholder="t.ex. Mode" />
              </div>
              <div>
                <label className="label">Slug</label>
                <input value={form.slug} onChange={e => setField('slug', e.target.value)} className="input-field font-mono text-xs" />
                <p className="text-xs text-[#A39284] mt-1">Används i URL:er — ändra med försiktighet</p>
              </div>
              <div>
                <label className="label">Färg</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {PRESET_COLORS.map(color => (
                    <button key={color} type="button" onClick={() => setField('color', color)}
                      className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                      style={{ background: color, borderColor: form.color === color ? '#0E0E0E' : 'transparent' }} />
                  ))}
                  <input type="color" value={form.color} onChange={e => setField('color', e.target.value)}
                    className="w-7 h-7 rounded-full border border-gray-200 cursor-pointer bg-transparent p-0" title="Anpassad färg" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: form.color + '30', color: form.color }}>
                    {form.name || 'Förhandsgranskning'}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="btn-outline text-xs py-2 px-4">Avbryt</button>
              <button onClick={handleSave} className="btn-primary text-xs py-2 px-4">Spara</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Articles tab ────────────────────────────────────────────────

function ArticlesTab() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: PAGE_SIZE, offset: page * PAGE_SIZE });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await api.get(`/articles/admin/all?${params}`);
      setArticles(data.articles);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setPage(0); }, [search, statusFilter]);
  useEffect(() => { fetchArticles(); }, [search, statusFilter, page]);

  const handleDelete = async (id, title) => {
    if (!confirm(`Ta bort "${title}"?`)) return;
    try {
      await api.delete(`/articles/${id}`);
      toast.success('Artikel borttagen');
      fetchArticles();
    } catch { toast.error('Kunde inte ta bort artikel'); }
  };

  const toggleFeatured = async (article) => {
    try {
      await api.put(`/articles/${article.id}`, { ...article, featured: !article.featured });
      toast.success(article.featured ? 'Inte längre utvald' : 'Markerad som utvald');
      fetchArticles();
    } catch { toast.error('Misslyckades'); }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A39284]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Sök artiklar..." className="input-field pl-9" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="">Alla statusar</option>
          <option value="published">Publicerade</option>
          <option value="draft">Utkast</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#A39284] text-sm">Laddar...</div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-display text-xl text-[#A39284] mb-2">Inga artiklar</p>
            <Link to="/admin/artiklar/ny" className="btn-primary inline-flex items-center gap-2 text-xs mt-4">
              <Plus size={14} /> Skapa din första artikel
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs text-[#A39284] font-medium">Artikel</th>
                  <th className="text-left px-4 py-3 text-xs text-[#A39284] font-medium hidden md:table-cell">Kategori</th>
                  <th className="text-left px-4 py-3 text-xs text-[#A39284] font-medium hidden lg:table-cell">Publicerad</th>
                  <th className="text-right px-4 py-3 text-xs text-[#A39284] font-medium hidden sm:table-cell">Visningar</th>
                  <th className="text-center px-4 py-3 text-xs text-[#A39284] font-medium">Status</th>
                  <th className="text-right px-5 py-3 text-xs text-[#A39284] font-medium">Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article.id} className="border-b border-gray-50 hover:bg-cream-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {article.featured_image && (
                          <img src={article.featured_image} alt="" className="w-10 h-10 object-cover rounded flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate max-w-[300px]">{article.title}</p>
                          <p className="text-xs text-[#A39284] truncate max-w-[300px]">{article.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {article.category_name && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ background: article.category_color + '30', color: article.category_color }}>
                          {article.category_name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#A39284] hidden lg:table-cell">
                      {article.published_at ? format(new Date(article.published_at), 'd MMM yyyy', { locale: sv }) : '–'}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-[#A39284] hidden sm:table-cell">
                      {article.views?.toLocaleString('sv')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`status-badge ${article.status === 'published' ? 'status-published' : 'status-draft'}`}>
                        {article.status === 'published' ? 'Publicerad' : 'Utkast'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleFeatured(article)} title="Utvald"
                          className={`p-1.5 rounded hover:bg-[#B89B72]/10 transition-colors ${article.featured ? 'text-[#B89B72]' : 'text-[#A39284] hover:text-[#B89B72]'}`}>
                          <Star size={15} fill={article.featured ? 'currentColor' : 'none'} />
                        </button>
                        <Link to={`/artikel/${article.slug}`} target="_blank"
                          className="p-1.5 rounded text-[#A39284] hover:text-[#B89B72] hover:bg-[#B89B72]/10 transition-colors">
                          <Eye size={15} />
                        </Link>
                        <Link to={`/admin/artiklar/${article.id}`}
                          className="p-1.5 rounded text-[#A39284] hover:text-charcoal-800 hover:bg-cream-100 transition-colors">
                          <Edit size={15} />
                        </Link>
                        <button onClick={() => handleDelete(article.id, article.title)}
                          className="p-1.5 rounded text-[#A39284] hover:text-red-500 hover:bg-red-50 transition-colors">
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

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-[#A39284] text-xs">
            Visar {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} av {total}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-cream-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Föregående
            </button>
            <span className="text-xs text-[#A39284]">{page + 1} / {Math.ceil(total / PAGE_SIZE)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * PAGE_SIZE >= total}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-cream-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Nästa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page shell ──────────────────────────────────────────────────

export default function ArticlesPage() {
  const [tab, setTab] = useState('articles');

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-charcoal-800">Artiklar</h1>
        {tab === 'articles' && (
          <Link to="/admin/artiklar/ny" className="btn-primary inline-flex items-center gap-2 text-xs">
            <Plus size={14} /> Ny artikel
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-100">
        {[
          { key: 'articles', label: 'Artiklar' },
          { key: 'categories', label: 'Kategorier' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === key
                ? 'border-olive-500 text-charcoal-800'
                : 'border-transparent text-[#A39284] hover:text-charcoal-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'articles' ? <ArticlesTab /> : <CategoriesTab />}
    </div>
  );
}

