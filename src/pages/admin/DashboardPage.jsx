import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, TrendingUp, Megaphone, Users, DollarSign, Eye, Plus, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/stats/dashboard/overview'),
      api.get('/stats/dashboard/details'),
    ])
      .then(([ov, det]) => {
        const d = { ...ov.data, ...det.data };
        setData((d && typeof d === 'object' && d.stats) ? d : null);
      })
      .catch(err => console.error('Dashboard failed:', err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !data) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400 text-sm">Kunde inte ladda dashboard. Kontrollera backend-loggen.</p>
    </div>
  );

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-white rounded-xl" />)}
      </div>
      <div className="h-64 bg-white rounded-xl" />
    </div>
  );

  const { stats, topArticles, recentArticles, adStats, viewsByDay, categoryBreakdown } = data;

  const statCards = [
    { label: 'Publicerade artiklar', value: stats.publishedArticles, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Totala visningar', value: Number(stats.totalViews).toLocaleString('sv'), icon: Eye, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Aktiva annonser', value: stats.totalAds, icon: Megaphone, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Kunder', value: stats.totalCustomers, icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Annonsintäkter', value: `${Number(stats.adRevenue).toLocaleString('sv')} kr`, icon: DollarSign, color: 'text-gold-500', bg: 'bg-cream-100' },
  ];

  const chartColors = ['#B89B72', '#D4A5A5', '#A8C5A0', '#B8C4D4', '#C4A5C9', '#A5C4C9'];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal-800">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">{format(new Date(), 'EEEE d MMMM yyyy', { locale: sv })}</p>
        </div>
        <Link to="/admin/artiklar/ny" className="btn-primary inline-flex items-center gap-2 text-xs">
          <Plus size={14} /> Ny artikel
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`inline-flex w-9 h-9 ${bg} ${color} rounded-lg items-center justify-center mb-3`}>
              <Icon size={17} />
            </div>
            <p className="text-2xl font-semibold text-charcoal-800">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Views chart */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-medium mb-4 text-charcoal-800">Sidvisningar – 30 dagar</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={viewsByDay}>
              <defs>
                <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B89B72" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#B89B72" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickFormatter={d => { try { return format(parseISO(d), 'd/M'); } catch { return d; } }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip
                formatter={v => [`${v} visningar`]}
                labelFormatter={d => { try { return format(parseISO(d), 'd MMMM', { locale: sv }); } catch { return d; } }}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Area type="monotone" dataKey="views" stroke="#B89B72" strokeWidth={2} fill="url(#viewGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="card p-5">
          <h2 className="text-sm font-medium mb-4 text-charcoal-800">Artiklar per kategori</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                dataKey="article_count" nameKey="name">
                {categoryBreakdown.map((_, i) => (
                  <Cell key={i} fill={chartColors[i % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v} artiklar`, n]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryBreakdown.slice(0, 4).map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: chartColors[i % chartColors.length] }} />
                  <span className="text-gray-600">{c.name}</span>
                </div>
                <span className="font-medium">{c.article_count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top articles */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-charcoal-800 flex items-center gap-2">
              <TrendingUp size={15} className="text-gold-400" /> Mest lästa
            </h2>
            <Link to="/admin/statistik" className="text-xs text-gold-400 hover:text-gold-500 flex items-center gap-1">
              Mer <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {topArticles.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="font-display text-2xl text-cream-200 w-6 text-center leading-none">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gold-400 uppercase tracking-wide">{a.category_name}</p>
                  <p className="text-sm font-medium truncate">{a.title}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{Number(a.views).toLocaleString('sv')} vy</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent articles */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-charcoal-800">Senaste artiklar</h2>
            <Link to="/admin/artiklar" className="text-xs text-gold-400 hover:text-gold-500 flex items-center gap-1">
              Alla <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentArticles.map(a => (
              <Link key={a.id} to={`/admin/artiklar/${a.id}`}
                className="flex items-center gap-3 hover:bg-cream-50 rounded-lg p-2 -mx-2 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.title}</p>
                  <p className="text-xs text-gray-400">{a.category_name}</p>
                </div>
                <span className={`status-badge ${a.status === 'published' ? 'status-published' : 'status-draft'}`}>
                  {a.status === 'published' ? 'Publicerad' : 'Utkast'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>


      {/* Ad performance */}
      {adStats.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-charcoal-800">Annonsprestation</h2>
            <Link to="/admin/annonser" className="text-xs text-gold-400 hover:text-gold-500 flex items-center gap-1">
              Hantera <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs text-gray-400 font-medium">Annons</th>
                  <th className="text-left py-2 text-xs text-gray-400 font-medium">Kund</th>
                  <th className="text-left py-2 text-xs text-gray-400 font-medium">Plats</th>
                  <th className="text-right py-2 text-xs text-gray-400 font-medium">Visningar</th>
                  <th className="text-right py-2 text-xs text-gray-400 font-medium">Klick</th>
                  <th className="text-right py-2 text-xs text-gray-400 font-medium">CTR</th>
                  <th className="text-right py-2 text-xs text-gray-400 font-medium">CPM</th>
                </tr>
              </thead>
              <tbody>
                {adStats.map((a, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-cream-50">
                    <td className="py-2.5 text-sm font-medium max-w-[200px] truncate">{a.title}</td>
                    <td className="py-2.5 text-sm text-gray-500">{a.customer_name || '–'}</td>
                    <td className="py-2.5 text-xs text-gray-400">{a.placement_name}</td>
                    <td className="py-2.5 text-right text-sm">{Number(a.impressions).toLocaleString('sv')}</td>
                    <td className="py-2.5 text-right text-sm">{a.clicks}</td>
                    <td className="py-2.5 text-right text-sm font-medium text-gold-500">{parseFloat(a.ctr || 0).toFixed(2)}%</td>
                    <td className="py-2.5 text-right text-sm text-gray-500">{a.cpm_rate != null ? `${parseFloat(a.cpm_rate).toFixed(2)} kr` : '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
