import { useEffect, useState } from 'react';
import { UserPlus, Pencil, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuthStore } from '../../context/authStore';

const ROLES = [
  { value: 'admin',      label: 'Admin',      desc: 'Full åtkomst till allt' },
  { value: 'editor',     label: 'Redaktör',   desc: 'Artiklar och kategorier' },
  { value: 'ad_manager', label: 'Annonsör',   desc: 'Annonser, platser och kunder' },
];

const roleBadge = role => {
  const map = { admin: 'bg-[#5A5B46]/10 text-[#5A5B46]', editor: 'bg-[#B89B72]/10 text-[#B89B72]', ad_manager: 'bg-[#A39284]/15 text-[#A39284]' };
  const label = ROLES.find(r => r.value === role)?.label || role;
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${map[role] || 'bg-[#F4F0EA] text-[#A39284]'}`}>{label}</span>;
};

const emptyForm = { name: '', email: '', password: '', role: 'editor' };

export default function UsersPage() {
  const { user: me } = useAuthStore();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null); // null | 'create' | user object
  const [form, setForm]       = useState(emptyForm);
  const [saving, setSaving]   = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const fetchUsers = () => {
    api.get('/users').then(r => setUsers(r.data)).catch(() => toast.error('Kunde inte ladda användare')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => { setForm(emptyForm); setModal('create'); };
  const openEdit   = u  => { setForm({ name: u.name, email: u.email, password: '', role: u.role }); setModal(u); };
  const closeModal = () => { setModal(null); setForm(emptyForm); setShowPw(false); };

  const handleSave = async () => {
    if (!form.name || !form.email) return toast.error('Namn och e-post krävs');
    if (modal === 'create' && !form.password) return toast.error('Lösenord krävs');
    setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/users', form);
        toast.success('Användare skapad');
      } else {
        const payload = { name: form.name, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        await api.put(`/users/${modal.id}`, payload);
        toast.success('Användare uppdaterad');
      }
      fetchUsers();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Något gick fel');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async u => {
    if (!window.confirm(`Ta bort ${u.name}?`)) return;
    try {
      await api.delete(`/users/${u.id}`);
      toast.success('Användare borttagen');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Kunde inte ta bort användare');
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-charcoal-800">Team</h1>
          <p className="text-sm text-[#A39284] mt-0.5">Hantera användare och roller</p>
        </div>
        <button onClick={openCreate} className="btn-primary inline-flex items-center gap-2 text-xs">
          <UserPlus size={14} /> Ny användare
        </button>
      </div>

      {/* Role legend */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {ROLES.map(r => (
          <div key={r.value} className="card p-4">
            <div className="mb-1">{roleBadge(r.value)}</div>
            <p className="text-xs text-[#A39284] mt-1">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="card">
        {loading ? (
          <div className="p-8 text-center text-sm text-[#A39284]">Laddar...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Namn', 'E-post', 'Roll', 'Skapad', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs text-[#A39284] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-cream-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: '#B89B72', color: '#F4F0EA' }}>
                        {u.name?.charAt(0) || '?'}
                      </div>
                      <span className="text-sm font-medium">{u.name}</span>
                      {u.id === me?.id && <span className="text-[10px] text-[#A39284]">(du)</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-[#A39284]">{u.email}</td>
                  <td className="py-3 px-4">{roleBadge(u.role)}</td>
                  <td className="py-3 px-4 text-xs text-[#A39284]">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('sv') : '–'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(u)} className="text-[#A39284] hover:text-charcoal-800 transition-colors">
                        <Pencil size={14} />
                      </button>
                      {u.id !== me?.id && (
                        <button onClick={() => handleDelete(u)} className="text-[#A39284] hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-charcoal-800">
                {modal === 'create' ? 'Ny användare' : `Redigera ${modal.name}`}
              </h2>
              <button onClick={closeModal} className="text-[#A39284] hover:text-charcoal-800"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Namn</label>
                <input className="input-field w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Förnamn Efternamn" />
              </div>
              <div>
                <label className="label">E-post</label>
                <input className="input-field w-full" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="namn@livsstil24.se" />
              </div>
              <div>
                <label className="label">{modal === 'create' ? 'Lösenord' : 'Nytt lösenord (lämna tomt för oförändrat)'}</label>
                <div className="relative">
                  <input className="input-field w-full pr-10" type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39284] hover:text-charcoal-800">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Roll</label>
                <select className="input-field w-full" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={closeModal} className="btn-outline text-sm">Avbryt</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm inline-flex items-center gap-2">
                <Save size={13} /> {saving ? 'Sparar...' : 'Spara'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
