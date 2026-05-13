import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';
import { TrendingUp, Eye, MousePointer, Award } from 'lucide-react';

export default function StatisticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stats/dashboard').then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-48"><div className="text-gray-400 text-sm">Laddar statistik...</div></div>;

  const { stats, topArticles, adStats, viewsByDay, categoryBreakdown } = data;
  const colors = ['#C9A96E', '#D4A5A5', '#A8C5A0', '#B8C4D4', '#C4A5C9', '#A5C4C9', '#E8C4B8'];
  const avgCTR = adStats.length ? (adStats.reduce((s, a) => s + a.ctr, 0) / adStats.length).toFixed(2) : 0;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-display text-2xl text-charcoal-800">Statistik</h1>
        <p className="text-sm text-gray-400 mt-0.5">Översikt och prestandadata</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Eye, label: 'Totala sidvisningar', value: stats.totalViews.toLocaleString('sv'), color: 'text-purple-500', bg: 'bg-purple-50' },
          { icon: TrendingUp, label: 'Publicerade artiklar', value: stats.publishedArticles, color: 'text-blue-500', bg: 'bg-blue-50' },
          { icon: MousePointer, label: 'Annonsklick totalt', value: adStats.reduce((s, a) => s + a.clicks, 0).toLocaleString('sv'), color: 'text-amber-500', bg: 'bg-amber-50' },
          { icon: Award, label: 'Genomsnittlig CTR', value: `${avgCTR}%`, color: 'text-gold-500', bg: 'bg-cream-100' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`inline-flex w-9 h-9 ${bg} ${color} rounded-lg items-center justify-center mb-3`}>
              <Icon size={17} />
            </div>
            <p className="text-2xl font-semibold">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Views over time */}
      <div className="card p-6">
        <h2 className="text-sm font-medium mb-5 text-charcoal-800">Sidvisningar – senaste 30 dagarna</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={viewsByDay}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickFormatter={d => { try { return format(parseISO(d), 'd/M'); } catch { return d; } }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip formatter={v => [`${v} visningar`]}
              labelFormatter={d => { try { return format(parseISO(d), 'd MMMM', { locale: sv }); } catch { return d; } }}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
            <Area type="monotone" dataKey="views" stroke="#C9A96E" strokeWidth={2.5} fill="url(#g1)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <div className="card p-5">
          <h2 className="text-sm font-medium mb-4 text-charcoal-800">Visningar per kategori</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} width={80} />
              <Tooltip formatter={v => [v.toLocaleString('sv'), 'Visningar']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="total_views" radius={[0, 4, 4, 0]}>
                {categoryBreakdown.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top articles */}
        <div className="card p-5">
          <h2 className="text-sm font-medium mb-4 text-charcoal-800">Topp 5 artiklar</h2>
          <div className="space-y-3">
            {topArticles.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="font-display text-2xl text-cream-200 w-6 leading-none flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: a.category_color + '30', color: a.category_color }}>
                      {a.category_name}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate">{a.title}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold">{a.views.toLocaleString('sv')}</p>
                  <p className="text-xs text-gray-400">visningar</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ad performance table */}
      {adStats.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-medium mb-4 text-charcoal-800">Annonsprestation</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Annons', 'Kund', 'Annonsplats', 'Visningar', 'Klick', 'CTR'].map(h => (
                    <th key={h} className={`py-2 text-xs text-gray-400 font-medium ${h === 'Annons' || h === 'Kund' || h === 'Annonsplats' ? 'text-left px-2' : 'text-right px-2'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adStats.map((a, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-cream-50">
                    <td className="py-2.5 px-2 text-sm font-medium max-w-[180px] truncate">{a.title}</td>
                    <td className="py-2.5 px-2 text-sm text-gray-500">{a.customer_name || '–'}</td>
                    <td className="py-2.5 px-2 text-xs text-gray-400">{a.placement_name}</td>
                    <td className="py-2.5 px-2 text-right text-sm">{a.impressions.toLocaleString('sv')}</td>
                    <td className="py-2.5 px-2 text-right text-sm">{a.clicks}</td>
                    <td className="py-2.5 px-2 text-right">
                      <span className={`text-sm font-medium ${a.ctr > 2 ? 'text-green-600' : a.ctr > 0.5 ? 'text-amber-600' : 'text-gray-400'}`}>
                        {a.ctr}%
                      </span>
                    </td>
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
