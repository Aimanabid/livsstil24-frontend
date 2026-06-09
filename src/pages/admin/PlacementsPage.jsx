import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const PLACEMENT_ICONS = {
  hero_banner:    '🖼️',
  sidebar_top:    '📌',
  sidebar_mid:    '📌',
  article_inline: '📄',
  article_mid:    '📰',
}

const POSITION_KEYS = [
  { key: 'hero_banner',    label: 'Hero Banner',    description: 'Startsida — stor hero-bild överst' },
  { key: 'article_inline', label: 'Article Inline', description: 'Artikelsidor — video/banner efter texten' },
  { key: 'article_mid',    label: 'Article Mid',    description: 'Artikelsidor — annons mitt i artikeln' },
  { key: 'sidebar_top',    label: 'Sidebar Top',    description: 'Sidopanel — övre annonsplats' },
  { key: 'sidebar_mid',    label: 'Sidebar Mid',    description: 'Sidopanel — nedre annonsplats' },
]

export default function PlacementsPage() {
  const [placements, setPlacements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '', key: '', description: '', cpm_rate: '', max_ads: 1, is_active: true
  })

  useEffect(() => { fetchPlacements() }, [])

  async function fetchPlacements() {
    try {
      const res = await api.get('/ads/placements')
      setPlacements(res.data)
    } catch {
      toast.error('Kunde inte hämta placeringar')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditing(null)
    setForm({ name: '', key: '', description: '', cpm_rate: '', max_ads: 1, is_active: true })
    setShowModal(true)
  }

  function openEdit(p) {
    setEditing(p)
    setForm({
      name: p.name, key: p.key, description: p.description || '',
      cpm_rate: p.cpm_rate, max_ads: p.max_ads, is_active: p.is_active === 1 || p.is_active === true
    })
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (editing) {
        await api.put(`/ads/placements/${editing.id}`, form)
        toast.success('Placering uppdaterad!')
      } else {
        await api.post('/ads/placements', form)
        toast.success('Placering skapad!')
      }
      setShowModal(false)
      fetchPlacements()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Ett fel uppstod')
    }
  }

  async function toggleActive(p) {
    try {
      await api.put(`/ads/placements/${p.id}`, { name: p.name, key: p.key || p.position_key, description: p.description, cpm_rate: p.cpm_rate || 0, max_ads: p.max_ads, is_active: !p.is_active })
      fetchPlacements()
    } catch {
      toast.error('Kunde inte uppdatera status')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400"></div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-charcoal-800">Annonsplatser</h1>
          <p className="text-sm text-[#A39284] mt-1">Hantera tillgängliga platser för annonsering</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ny placering
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-[#A39284] uppercase tracking-wider">Totalt platser</p>
          <p className="text-3xl font-display font-bold text-charcoal-800 mt-1">{placements.length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-[#A39284] uppercase tracking-wider">Aktiva platser</p>
          <p className="text-3xl font-display font-bold text-[#5A5B46] mt-1">{placements.filter(p => p.is_active).length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-[#A39284] uppercase tracking-wider">Högsta CPM</p>
          <p className="text-3xl font-display font-bold text-[#B89B72] mt-1">
            {placements.length ? Math.max(...placements.map(p => Number(p.cpm_rate || 0))).toLocaleString('sv-SE') : 0} kr
          </p>
        </div>
      </div>

      {/* Placements grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {placements.map(p => (
          <div key={p.id} className={`bg-white border rounded-xl overflow-hidden transition-all ${p.is_active ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cream-100 rounded-lg flex items-center justify-center text-xl">
                    {PLACEMENT_ICONS[p.key] || '📍'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-800">{p.name}</h3>
                    <code className="text-xs text-[#A39284] bg-[#F4F0EA] px-1.5 py-0.5 rounded">{p.key}</code>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.is_active ? 'bg-[#5A5B46]/10 text-[#5A5B46]' : 'bg-[#F4F0EA] text-[#A39284]'}`}>
                  {p.is_active ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>

              {p.description && (
                <p className="text-sm text-[#A39284] mt-3">{p.description}</p>
              )}

              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="text-[#A39284]">
                  <span className="text-[#A39284]">Max annonser:</span> {p.max_ads}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-display font-bold text-charcoal-800">
                    {Number(p.cpm_rate || 0).toLocaleString('sv-SE')} kr
                  </span>
                  <span className="text-sm text-[#A39284]">/ 1 000 vis.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(p)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      p.is_active
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'border-green-200 text-[#5A5B46] hover:bg-[#5A5B46]/10'
                    }`}
                  >
                    {p.is_active ? 'Inaktivera' : 'Aktivera'}
                  </button>
                  <button
                    onClick={() => openEdit(p)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-[#A39284] hover:bg-[#F4F0EA] transition-colors"
                  >
                    Redigera
                  </button>
                </div>
              </div>
            </div>

            {/* Active ads count bar */}
            <div className="h-1 bg-[#F4F0EA]">
              <div
                className="h-full bg-gold-400 transition-all"
                style={{ width: `${Math.min(100, ((p.active_ads || 0) / p.max_ads) * 100)}%` }}
              />
            </div>
            <div className="px-5 py-2 bg-[#F4F0EA] text-xs text-[#A39284]">
              {p.active_ads || 0} av {p.max_ads} annonsplatser används
            </div>
          </div>
        ))}
      </div>

      {/* Pricing table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-charcoal-800">Prislista</h2>
          <p className="text-xs text-[#A39284] mt-0.5">Översikt av alla annonsplatser och priser</p>
        </div>
        <table className="w-full">
          <thead className="bg-[#F4F0EA]">
            <tr>
              <th className="text-left text-xs font-medium text-[#A39284] uppercase tracking-wider px-6 py-3">Placering</th>
              <th className="text-left text-xs font-medium text-[#A39284] uppercase tracking-wider px-6 py-3">Max annonser</th>
              <th className="text-right text-xs font-medium text-[#A39284] uppercase tracking-wider px-6 py-3">CPM (kr / 1 000 vis.)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {placements.filter(p => p.is_active).map(p => (
              <tr key={p.id} className="hover:bg-[#F4F0EA]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-charcoal-800 text-sm">{p.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-[#A39284]">{p.max_ads}</td>
                <td className="px-6 py-4 text-right font-semibold text-charcoal-800">
                  {Number(p.cpm_rate || 0).toLocaleString('sv-SE')} kr
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-display font-bold text-charcoal-800">
                {editing ? 'Redigera placering' : 'Ny annonsplats'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#A39284] hover:text-[#A39284]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Namn *</label>
                <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="t.ex. Hero Banner" />
              </div>
              <div>
                <label className="label">Position (key) *</label>
                <select className="input-field" value={form.key} onChange={e => setForm({...form, key: e.target.value})} required>
                  <option value="">Välj position...</option>
                  {POSITION_KEYS.map(({ key, label, description }) => (
                    <option key={key} value={key}>{label} — {description}</option>
                  ))}
                </select>
                {form.key && <p className="text-xs text-[#A39284] mt-1 font-mono">{form.key}</p>}
              </div>
              <div>
                <label className="label">Beskrivning</label>
                <textarea className="input-field" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Kort beskrivning av placeringsplatsen" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">CPM-pris (kr / 1 000 vis.) *</label>
                  <input className="input-field" type="number" step="0.01" value={form.cpm_rate} onChange={e => setForm({...form, cpm_rate: e.target.value})} required placeholder="69.00" />
                </div>
                <div>
                  <label className="label">Max annonser</label>
                  <input className="input-field" type="number" min="1" value={form.max_ads} onChange={e => setForm({...form, max_ads: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={e => setForm({...form, is_active: e.target.checked})}
                  className="w-4 h-4 accent-gold-400"
                />
                <label htmlFor="is_active" className="text-sm text-mocha-500">Aktiv (visas som tillgänglig)</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-[#A39284] hover:bg-[#F4F0EA] text-sm font-medium transition-colors">
                  Avbryt
                </button>
                <button type="submit" className="flex-1 btn-primary text-sm">
                  {editing ? 'Spara ändringar' : 'Skapa placering'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

