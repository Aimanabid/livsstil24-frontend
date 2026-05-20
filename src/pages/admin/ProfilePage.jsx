import { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../context/authStore';
import { Lock, Save, Eye, EyeOff } from 'lucide-react';

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field pr-10"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal-800 transition-colors"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const saveProfile = async () => {
    if (!profile.name || !profile.email) { toast.error('Namn och e-post krävs'); return; }
    setSavingProfile(true);
    try {
      await api.put('/auth/me', profile);
      await fetchMe();
      toast.success('Profil uppdaterad');
    } catch (err) { toast.error(err.response?.data?.error || 'Fel'); }
    finally { setSavingProfile(false); }
  };

  const savePassword = async () => {
    if (!pw.current || !pw.next) { toast.error('Fyll i alla lösenordsfält'); return; }
    if (pw.next !== pw.confirm) { toast.error('Lösenorden matchar inte'); return; }
    if (pw.next.length < 8) { toast.error('Lösenordet måste vara minst 8 tecken'); return; }
    setSavingPw(true);
    try {
      await api.put('/auth/password', { current: pw.current, next: pw.next });
      setPw({ current: '', next: '', confirm: '' });
      toast.success('Lösenord uppdaterat');
    } catch (err) { toast.error(err.response?.data?.error || 'Fel'); }
    finally { setSavingPw(false); }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="font-display text-2xl text-charcoal-800">Mitt konto</h1>
        <p className="text-sm text-gray-400 mt-0.5">Hantera din profil och lösenord</p>
      </div>

      {/* Profile card */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-gold-400 flex items-center justify-center text-white font-display text-xl">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="font-medium text-sm">{user?.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${user?.role === 'admin' ? 'bg-gold-100 text-gold-600' : 'bg-cream-100 text-charcoal-800'}`}>
              {user?.role === 'admin' ? 'Administratör' : 'Redaktör'}
            </span>
          </div>
        </div>

        <div>
          <label className="label">Namn</label>
          <input
            value={profile.name}
            onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
            className="input-field"
          />
        </div>
        <div>
          <label className="label">E-post</label>
          <input
            type="email"
            value={profile.email}
            onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
            className="input-field"
          />
        </div>
        <div className="flex justify-end">
          <button onClick={saveProfile} disabled={savingProfile} className="btn-gold text-xs py-2 px-4 inline-flex items-center gap-2">
            <Save size={14} /> {savingProfile ? 'Sparar...' : 'Spara profil'}
          </button>
        </div>
      </div>

      {/* Password card */}
      <div className="card p-6 space-y-4">
        <h2 className="font-medium text-sm text-charcoal-800 flex items-center gap-2">
          <Lock size={15} /> Ändra lösenord
        </h2>
        <div>
          <label className="label">Nuvarande lösenord</label>
          <PasswordInput value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} />
        </div>
        <div>
          <label className="label">Nytt lösenord</label>
          <PasswordInput value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))} />
        </div>
        <div>
          <label className="label">Bekräfta nytt lösenord</label>
          <PasswordInput value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} />
        </div>
        <div className="flex justify-end">
          <button onClick={savePassword} disabled={savingPw} className="btn-gold text-xs py-2 px-4 inline-flex items-center gap-2">
            <Lock size={14} /> {savingPw ? 'Sparar...' : 'Uppdatera lösenord'}
          </button>
        </div>
      </div>
    </div>
  );
}
