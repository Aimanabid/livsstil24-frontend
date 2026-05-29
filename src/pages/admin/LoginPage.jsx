import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, loading, user, initialized } = useAuthStore();
  const navigate = useNavigate();

  if (initialized && user) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Inloggning misslyckades');
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-1/2 bg-charcoal-800 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute text-cream-50 font-display text-6xl opacity-20"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, transform: 'rotate(-15deg)' }}>
              ✦
            </div>
          ))}
        </div>
        <div className="relative text-center text-white">
          <h1 className="font-display text-5xl tracking-wide mb-4">
            LIVSSTIL<span className="text-gold-400">24</span>
          </h1>
          <div className="w-12 h-px bg-gold-400 mx-auto mb-4" />
          <p className="text-cream-200 text-sm tracking-widest uppercase">Adminpanel</p>
          <p className="text-cream-300/60 text-xs mt-8 max-w-xs leading-relaxed">
            Hantera artiklar, annonser, kunder och statistik på ett och samma ställe.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-10">
            <h1 className="font-display text-3xl">LIVSSTIL<span className="text-gold-400">24</span></h1>
            <p className="text-sm text-gray-400 mt-1">Adminpanel</p>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl text-charcoal-800">Välkommen</h2>
            <p className="text-gray-500 text-sm mt-1">Logga in för att fortsätta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">E-postadress</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@livsstil24.se"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Lösenord</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loggar in...' : 'Logga in'}
            </button>
          </form>

          <Link to="/" className="block text-center text-xs text-gray-400 mt-4 hover:text-gold-400 transition-colors">
            ← Tillbaka till sajten
          </Link>
        </div>
      </div>
    </div>
  );
}
