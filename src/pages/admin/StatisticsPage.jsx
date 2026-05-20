import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { sv } from 'date-fns/locale';
import { TrendingUp, Eye, MousePointer, Award, Download, Users } from 'lucide-react';

const fmt = d => d.toISOString().split('T')[0];

const PRESETS = [
  { label: 'Idag',     days: 0 },
  { label: '7 dagar',  days: 7 },
  { label: '30 dagar', days: 30 },
];

export default function StatisticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(fmt(subDays(new Date(), 30)));
  const [to, setTo]     = useState(fmt(new Date()));
  const [activePreset, setActivePreset] = useState(30);

  const fetchStats = (f, t) => {
    setLoading(true);
    api.get(`/stats/dashboard?from=${f}&to=${t}`)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStats(from, to); }, []);

  const applyPreset = (days) => {
    const t = fmt(new Date());
    const f = days === 0 ? t : fmt(subDays(new Date(), days));
    setFrom(f); setTo(t); setActivePreset(days);
    fetchStats(f, t);
  };

  const applyCustom = () => { setActivePreset(null); fetchStats(from, to); };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="text-gray-400 text-sm">Laddar statistik...</div></div>;

  const { stats, topArticles, adStats, viewsByDay, categoryBreakdown, articleStats } = data;

  const downloadPDF = () => {
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
      <title>Livsstil24 – Statistik ${from} till ${to}</title>
      <style>
        body{font-family:sans-serif;color:#1C1C1C;padding:40px;font-size:13px}
        h1{font-size:22px;margin:0 0 4px}
        .period{color:#9ca3af;font-size:12px;margin-bottom:32px}
        h2{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#9ca3af;margin:28px 0 10px;border-bottom:1px solid #e5e7eb;padding-bottom:5px}
        .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:8px}
        .kpi{border:1px solid #e5e7eb;border-radius:8px;padding:14px}
        .kpi-value{font-size:20px;font-weight:600}
        .kpi-label{font-size:10px;color:#9ca3af;margin-top:3px}
        table{width:100%;border-collapse:collapse}
        th{text-align:left;padding:7px 8px;color:#9ca3af;font-weight:500;border-bottom:2px solid #e5e7eb;font-size:10px;text-transform:uppercase;letter-spacing:.05em}
        td{padding:7px 8px;border-bottom:1px solid #f3f4f6}
        .tr{text-align:right}
        @media print{body{padding:20px}}
      </style></head><body>
      <h1>Livsstil24 – Statistikrapport</h1>
      <p class="period">Period: ${from} till ${to}</p>
      <div class="kpis">
        <div class="kpi"><div class="kpi-value">${Number(stats.totalViews).toLocaleString('sv')}</div><div class="kpi-label">Sidvisningar</div></div>
        <div class="kpi"><div class="kpi-value">${stats.publishedArticles}</div><div class="kpi-label">Publicerade artiklar</div></div>
        <div class="kpi"><div class="kpi-value">${adStats.reduce((s,a)=>s+Number(a.clicks),0).toLocaleString('sv')}</div><div class="kpi-label">Annonsklick</div></div>
        <div class="kpi"><div class="kpi-value">${avgCTR}%</div><div class="kpi-label">Genomsnittlig CTR</div></div>
      </div>
      <h2>Topp artiklar</h2>
      <table><thead><tr><th>#</th><th>Titel</th><th>Kategori</th><th class="tr">Visningar</th></tr></thead><tbody>
        ${topArticles.map((a,i)=>`<tr><td>${i+1}</td><td>${a.title}</td><td>${a.category_name||'–'}</td><td class="tr">${Number(a.views).toLocaleString('sv')}</td></tr>`).join('')}
      </tbody></table>
      <h2>Visningar per kategori</h2>
      <table><thead><tr><th>Kategori</th><th class="tr">Visningar</th></tr></thead><tbody>
        ${categoryBreakdown.map(c=>`<tr><td>${c.name}</td><td class="tr">${Number(c.total_views).toLocaleString('sv')}</td></tr>`).join('')}
      </tbody></table>
      <h2>Artikelprestation</h2>
      <table><thead><tr><th>Titel</th><th>Kategori</th><th>Författare</th><th class="tr">Visningar</th></tr></thead><tbody>
        ${articleStats.map(a=>`<tr><td>${a.title}</td><td>${a.category_name||'–'}</td><td>${a.author_name||'–'}</td><td class="tr">${Number(a.period_views).toLocaleString('sv')}</td></tr>`).join('')}
      </tbody></table>
      <h2>Annonsprestation</h2>
      <table><thead><tr><th>Annons</th><th>Kund</th><th>Annonsplats</th><th class="tr">Visningar</th><th class="tr">Klick</th><th class="tr">CTR</th></tr></thead><tbody>
        ${adStats.map(a=>`<tr><td>${a.title}</td><td>${a.customer_name||'–'}</td><td>${a.placement_name||'–'}</td><td class="tr">${Number(a.impressions).toLocaleString('sv')}</td><td class="tr">${a.clicks}</td><td class="tr">${parseFloat(a.ctr||0).toFixed(2)}%</td></tr>`).join('')}
      </tbody></table>
      <script>window.onload=()=>{window.print();window.onafterprint=()=>window.close();}<\/script>
    </body></html>`);
    win.document.close();
  };

  const downloadCSV = () => {
    const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = [];

    rows.push(['Livsstil24 – Statistikrapport']);
    rows.push([`Period: ${from} till ${to}`]);
    rows.push([]);
    rows.push(['Sammanfattning']);
    rows.push(['Sidvisningar', stats.totalViews]);
    rows.push(['Publicerade artiklar', stats.publishedArticles]);
    rows.push(['Aktiva annonser', stats.totalAds]);
    rows.push(['Annonsintäkter', `${Number(stats.adRevenue).toLocaleString('sv')} kr`]);
    rows.push([]);
    rows.push(['Sidvisningar per dag']);
    rows.push(['Datum', 'Visningar']);
    viewsByDay.forEach(r => rows.push([r.date, r.views]));
    rows.push([]);
    rows.push(['Topp 5 artiklar']);
    rows.push(['Titel', 'Kategori', 'Visningar']);
    topArticles.forEach(a => rows.push([esc(a.title), esc(a.category_name), a.views]));
    rows.push([]);
    rows.push(['Visningar per kategori']);
    rows.push(['Kategori', 'Visningar']);
    categoryBreakdown.forEach(c => rows.push([esc(c.name), c.total_views]));
    rows.push([]);
    rows.push(['Artikelprestation']);
    rows.push(['Titel', 'Kategori', 'Författare', 'Visningar']);
    articleStats.forEach(a => rows.push([esc(a.title), esc(a.category_name), esc(a.author_name), a.period_views]));
    rows.push([]);
    rows.push(['Annonsprestation']);
    rows.push(['Annons', 'Kund', 'Annonsplats', 'Visningar', 'Klick', 'CTR (%)']);
    adStats.forEach(a => rows.push([esc(a.title), esc(a.customer_name), esc(a.placement_name), a.impressions, a.clicks, a.ctr]));

    const csv = '﻿' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `livsstil24-statistik-${from}-${to}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const colors = ['#C9A96E', '#D4A5A5', '#A8C5A0', '#B8C4D4', '#C4A5C9', '#A5C4C9', '#E8C4B8'];
  const totalImpressions = adStats.reduce((s, a) => s + Number(a.impressions || 0), 0);
  const totalClicks      = adStats.reduce((s, a) => s + Number(a.clicks || 0), 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : 0;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal-800">Statistik</h1>
          <p className="text-sm text-gray-400 mt-0.5">Översikt och prestandadata</p>
        </div>

        {/* Date filter + export */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map(p => (
            <button
              key={p.days}
              onClick={() => applyPreset(p.days)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${activePreset === p.days ? 'bg-charcoal-800 text-white border-charcoal-800' : 'border-gray-200 text-gray-500 hover:border-charcoal-800 hover:text-charcoal-800'}`}
            >
              {p.label}
            </button>
          ))}
          <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5">
            <input
              type="date"
              value={from}
              max={to}
              onChange={e => { setFrom(e.target.value); setActivePreset(null); }}
              className="text-xs text-gray-600 focus:outline-none bg-transparent"
            />
            <span className="text-gray-300 text-xs">→</span>
            <input
              type="date"
              value={to}
              min={from}
              max={fmt(new Date())}
              onChange={e => { setTo(e.target.value); setActivePreset(null); }}
              className="text-xs text-gray-600 focus:outline-none bg-transparent"
            />
            <button onClick={applyCustom} className="text-xs text-gold-500 hover:text-gold-600 font-medium ml-1">
              Tillämpa
            </button>
          </div>
          <button
            onClick={downloadCSV}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-charcoal-800 hover:text-charcoal-800 transition-colors"
          >
            <Download size={13} /> CSV
          </button>
          <button
            onClick={downloadPDF}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-charcoal-800 hover:text-charcoal-800 transition-colors"
          >
            <Download size={13} /> PDF
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { icon: Eye,          label: 'Totala sidvisningar', value: Number(stats.totalViews).toLocaleString('sv'),                                    color: 'text-purple-500', bg: 'bg-purple-50' },
          { icon: Users,        label: 'Unika besökare',      value: Number(stats.uniqueVisitors || 0).toLocaleString('sv'),                   color: 'text-green-500',  bg: 'bg-green-50'  },
          { icon: TrendingUp,   label: 'Publicerade artiklar', value: Number(stats.publishedArticles),                                          color: 'text-blue-500',   bg: 'bg-blue-50'   },
          { icon: MousePointer, label: 'Annonsklick totalt',   value: adStats.reduce((s, a) => s + Number(a.clicks), 0).toLocaleString('sv'),   color: 'text-amber-500',  bg: 'bg-amber-50'  },
          { icon: Award,        label: 'Genomsnittlig CTR',    value: `${avgCTR}%`,                                                             color: 'text-gold-500',   bg: 'bg-cream-100' },
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
        <h2 className="text-sm font-medium mb-5 text-charcoal-800">Sidvisningar – {from} till {to}</h2>
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
                  <p className="text-sm font-semibold">{Number(a.views).toLocaleString('sv')}</p>
                  <p className="text-xs text-gray-400">visningar</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Article performance table */}
      {articleStats?.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-medium mb-4 text-charcoal-800">Artikelprestation</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Artikel', 'Kategori', 'Författare', 'Visningar'].map(h => (
                    <th key={h} className={`py-2 text-xs text-gray-400 font-medium ${h === 'Visningar' ? 'text-right px-2' : 'text-left px-2'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {articleStats.map((a, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-cream-50">
                    <td className="py-2.5 px-2 text-sm font-medium max-w-[220px] truncate">{a.title}</td>
                    <td className="py-2.5 px-2">
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: (a.category_color || '#C9A96E') + '25', color: a.category_color || '#C9A96E' }}>
                        {a.category_name || '–'}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-sm text-gray-500">{a.author_name || '–'}</td>
                    <td className="py-2.5 px-2 text-right text-sm font-semibold">{Number(a.period_views).toLocaleString('sv')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                    <td className="py-2.5 px-2 text-right text-sm">{Number(a.impressions).toLocaleString('sv')}</td>
                    <td className="py-2.5 px-2 text-right text-sm">{a.clicks}</td>
                    <td className="py-2.5 px-2 text-right">
                      <span className={`text-sm font-medium ${parseFloat(a.ctr) > 2 ? 'text-green-600' : parseFloat(a.ctr) > 0.5 ? 'text-amber-600' : 'text-gray-400'}`}>
                        {parseFloat(a.ctr || 0).toFixed(2)}%
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
