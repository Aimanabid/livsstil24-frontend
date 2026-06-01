import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Building2, Mail, Phone, X, Globe } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ company: '', contact_name: '', email: '', phone: '', org_number: '', address: '', website: '', notes: '' });

  const fetchCustomers = async () => {
    setLoading(true);
    const { data } = await api.get('/customers');
    setCustomers(data);
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ company: '', contact_name: '', email: '', phone: '', org_number: '', address: '', website: '', notes: '' });
    setModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ company: c.company, contact_name: c.contact_name || '', email: c.email, phone: c.phone || '', org_number: c.org_number || '', address: c.address || '', website: c.website || '', notes: c.notes || '' });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.company || !form.email) { toast.error('Företag och e-post krävs'); return; }
    try {
      if (editing) {
        await api.put(`/customers/${editing.id}`, form);
        toast.success('Kund uppdaterad');
      } else {
        await api.post('/customers', form);
        toast.success('Kund skapad');
      }
      setModal(false);
      fetchCustomers();
    } catch (err) { toast.error(err.response?.data?.error || 'Fel'); }
  };

  const handleDelete = async (id, company) => {
    if (!confirm(`Ta bort ${company}?`)) return;
    await api.delete(`/customers/${id}`);
    toast.success('Kund borttagen');
    fetchCustomers();
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const totalRevenue = customers.reduce((s, c) => s + Number(c.total_revenue || 0), 0);
  const activeCustomers = customers.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal-800">Kunder</h1>
          <p className="text-sm text-[#A39284] mt-0.5">{customers.length} kunder totalt</p>
        </div>
        <button onClick={openNew} className="btn-primary inline-flex items-center gap-2 text-xs">
          <Plus size={14} /> Ny kund
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Aktiva kunder', value: activeCustomers },
          { label: 'Total omsättning', value: `${totalRevenue.toLocaleString('sv')} kr` },
          { label: 'Aktiva annonser', value: customers.reduce((s, c) => s + Number(c.ad_count || 0), 0) },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4">
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-xs text-[#A39284] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Customer grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white rounded-xl animate-pulse" />)}
        </div>
      ) : customers.length === 0 ? (
        <div className="card p-12 text-center">
          <Building2 size={32} className="mx-auto text-gray-200 mb-3" />
          <p className="font-display text-xl text-[#A39284] mb-2">Inga kunder ännu</p>
          <button onClick={openNew} className="btn-primary inline-flex items-center gap-2 text-xs mt-4">
            <Plus size={14} /> Lägg till kund
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customers.map(c => (
            <div key={c.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-[#B89B72] font-display text-lg flex-shrink-0">
                    {c.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{c.company}</h3>
                    {c.contact_name && <p className="text-xs text-[#A39284]">{c.contact_name}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded text-[#A39284] hover:text-charcoal-800 hover:bg-cream-100 transition-colors">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(c.id, c.company)} className="p-1.5 rounded text-[#A39284] hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-[#A39284]">
                  <Mail size={12} className="flex-shrink-0" /> {c.email}
                </div>
                {c.phone && <div className="flex items-center gap-2 text-xs text-[#A39284]"><Phone size={12} /> {c.phone}</div>}
                {c.website && <div className="flex items-center gap-2 text-xs text-[#B89B72]"><Globe size={12} /><a href={c.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{c.website}</a></div>}
              </div>

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-cream-100 text-xs text-[#A39284]">
                <span>{c.ad_count} annonser</span>
                <span>·</span>
                <span className="font-medium text-charcoal-800">{(c.total_revenue || 0).toLocaleString('sv')} kr</span>
                <span className={`ml-auto status-badge ${c.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                  {c.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-display text-lg">{editing ? 'Redigera kund' : 'Ny kund'}</h2>
              <button onClick={() => setModal(false)} className="text-[#A39284] hover:text-charcoal-800"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="label">Företagsnamn *</label><input value={form.company} onChange={e => set('company', e.target.value)} className="input-field" /></div>
              <div><label className="label">Kontaktperson</label><input value={form.contact_name} onChange={e => set('contact_name', e.target.value)} className="input-field" /></div>
              <div><label className="label">E-post *</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input-field" /></div>
              <div><label className="label">Telefon</label><input value={form.phone} onChange={e => set('phone', e.target.value)} className="input-field" /></div>
              <div><label className="label">Organisationsnummer</label><input value={form.org_number} onChange={e => set('org_number', e.target.value)} className="input-field" placeholder="556xxx-xxxx" /></div>
              <div><label className="label">Webbplats</label><input value={form.website} onChange={e => set('website', e.target.value)} className="input-field" placeholder="https://..." /></div>
              <div><label className="label">Adress</label><input value={form.address} onChange={e => set('address', e.target.value)} className="input-field" /></div>
              <div><label className="label">Anteckningar</label><textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="input-field resize-none" rows={3} /></div>
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

