import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../context/authStore';
import {
  LayoutDashboard, FileText, Megaphone, Users, BarChart2,
  MapPin, LogOut, Menu, X, Settings, Users2
} from 'lucide-react';

const allNavItems = [
  { to: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard',      roles: null },
  { to: '/admin/artiklar',     icon: FileText,        label: 'Artiklar',       roles: ['admin', 'editor'] },
  { to: '/admin/annonser',     icon: Megaphone,       label: 'Annonser',       roles: ['admin', 'ad_manager'] },
  { to: '/admin/platser',      icon: MapPin,          label: 'Annonsplatser',  roles: ['admin', 'ad_manager'] },
  { to: '/admin/kunder',       icon: Users,           label: 'Kunder',         roles: ['admin', 'ad_manager'] },
  { to: '/admin/statistik',    icon: BarChart2,       label: 'Statistik',      roles: null },
  { to: '/admin/installningar',icon: Settings,        label: 'Inställningar',  roles: ['admin'] },
  { to: '/admin/team',         icon: Users2,          label: 'Team',           roles: ['admin'] },
];

function Sidebar({ user, onLogout, onNavClick }) {
  const visibleItems = allNavItems.filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link to="/" className="block">
          <h1 className="font-display text-xl tracking-wide" style={{ color: '#0e0e0e' }}>
            LIVSSTIL<span style={{ color: '#B89B72' }}>24</span>
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#A39284' }}>Adminpanel</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavClick}
            className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-100">
        <Link
          to="/admin/profil"
          onClick={onNavClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cream-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: '#B89B72', color: '#F4F0EA' }}>
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: '#0e0e0e' }}>{user?.name}</p>
            <p className="text-xs truncate" style={{ color: '#A39284' }}>{user?.email}</p>
          </div>
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
          style={{ color: '#A39284' }}
        >
          <LogOut size={16} /> Logga ut
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F4F0EA' }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-100 flex-shrink-0">
        <Sidebar user={user} onLogout={handleLogout} onNavClick={() => {}} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-white h-full shadow-xl flex flex-col">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <span className="font-display text-lg" style={{ color: '#0e0e0e' }}>Admin</span>
              <button onClick={() => setSidebarOpen(false)} style={{ color: '#A39284' }}><X size={20} /></button>
            </div>
            <Sidebar user={user} onLogout={handleLogout} onNavClick={() => setSidebarOpen(false)} />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <button className="md:hidden" style={{ color: '#0e0e0e' }} onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#A39284' }}>
            <Link to="/" className="transition-colors hover:text-[#B89B72]" target="_blank">
              Visa sajt ↗
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
