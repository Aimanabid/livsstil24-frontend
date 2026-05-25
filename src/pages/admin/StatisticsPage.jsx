import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { format, parseISO, subDays } from 'date-fns';
import { sv } from 'date-fns/locale';
import { TrendingUp, Eye, MousePointer, Award, Download, Users, Building2, PieChart } from 'lucide-react';

const fmt = d => d.toISOString().split('T')[0];

const PRESETS = [
  { label: 'Idag',     days: 0 },
  { label: '7 dagar',  days: 7 },
  { label: '30 dagar', days: 30 },
];

const DetailsSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map(i => (
      <div key={i} className="card p-5 animate-pulse">
        <div className="h-4 w-40 bg-cream-200 rounded mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map(j => <div key={j} className="h-8 bg-cream-100 rounded" />)}
        </div>
      </div>
    ))}
  </div>
);

export default function StatisticsPage() {
  const [overview, setOverview] = useState(null);
  const [details, setDetails]   = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingDetails, setLoadingDetails]   = useState(true);
  const [from, setFrom] = useState(fmt(subDays(new Date(), 30)));
  const [to, setTo]     = useState(fmt(new Date()));
  const [activePreset, setActivePreset] = useState(30);

  const fetchStats = (f, t) => {
    setLoadingOverview(true);
    setLoadingDetails(true);
    const qs = `?from=${f}&to=${t}`;
    api.get(`/stats/dashboard/overview${qs}`)
      .then(r => setOverview(r.data))
      .catch(() => {})
      .finally(() => setLoadingOverview(false));
    api.get(`/stats/dashboard/details${qs}`)
      .then(r => setDetails(r.data))
      .catch(() => {})
      .finally(() => setLoadingDetails(false));
  };

  useEffect(() => { fetchStats(from, to); }, []);

  const applyPreset = (days) => {
    const t = fmt(new Date());
    const f = days === 0 ? t : fmt(subDays(new Date(), days));
    setFrom(f); setTo(t); setActivePreset(days);
    fetchStats(f, t);
  };

  const applyCustom = () => { setActivePreset(null); fetchStats(from, to); };

  if (loadingOverview) return <div className="flex items-center justify-center h-48"><div className="text-gray-400 text-sm">Laddar statistik...</div></div>;

  const { stats, topArticles, viewsByDay, categoryBreakdown, deviceBreakdown } = overview;
  const { adStats = [], articleStats = [], customerStats = [], customerAdsByDay = [], sovStats = [], ipStats = [] } = details || {};

  // Group SOV data by placement — only keep placements with 2+ competing ads
  const sovByPlacement = Object.fromEntries(
    Object.entries(
      (sovStats || []).reduce((acc, row) => {
        if (!acc[row.placement_name]) acc[row.placement_name] = [];
        acc[row.placement_name].push(row);
        return acc;
      }, {})
    ).filter(([, rows]) => rows.length > 1)
  );

  const revenues = (customerStats || []).map(c => Number(c.total_revenue));
  const n = revenues.length;
  const mean = n > 0 ? revenues.reduce((a, b) => a + b, 0) / n : 0;
  const stdDev = n > 1 ? Math.sqrt(revenues.reduce((a, b) => a + (b - mean) ** 2, 0) / n) : 0;

  const downloadPDF = () => {
    if (!details) return;
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
      <table><thead><tr><th>Annons</th><th>Kund</th><th>Annonsplats</th><th class="tr">Visningar</th><th class="tr">Cap</th><th class="tr">Klick</th><th class="tr">CTR</th><th class="tr">CPM-pris</th><th class="tr">Intäkt</th></tr></thead><tbody>
        ${adStats.map(a=>`<tr><td>${a.title}</td><td>${a.customer_name||'–'}</td><td>${a.placement_name||'–'}</td><td class="tr">${Number(a.total_impressions||0).toLocaleString('sv')}</td><td class="tr">${a.max_impressions?Number(a.max_impressions).toLocaleString('sv'):'–'}</td><td class="tr">${a.clicks}</td><td class="tr">${parseFloat(a.ctr||0).toFixed(2)}%</td><td class="tr">${a.cpm_rate!=null?parseFloat(a.cpm_rate).toFixed(2)+' kr':'–'}</td><td class="tr">${a.revenue!=null?parseFloat(a.revenue).toLocaleString('sv',{maximumFractionDigits:0})+' kr':'–'}</td></tr>`).join('')}
      </tbody></table>
      <h2>Share of Voice per annonsplats</h2>
      <table><thead><tr><th>Annonsplats</th><th>Annons</th><th>Kund</th><th class="tr">Visningar</th><th class="tr">SOV</th></tr></thead><tbody>
        ${(sovStats||[]).map(r=>`<tr><td>${r.placement_name||'–'}</td><td>${r.ad_title}</td><td>${r.customer_name||'–'}</td><td class="tr">${Number(r.impressions).toLocaleString('sv')}</td><td class="tr">${parseFloat(r.sov).toFixed(1)}%</td></tr>`).join('')}
      </tbody></table>
      ${(ipStats||[]).length>0?`<h2>Besöksfrekvens per IP</h2>
      <table><thead><tr><th>IP-adress</th><th class="tr">Sessioner</th><th class="tr">Sidvisningar</th><th class="tr">Aktiva dagar</th><th class="tr">Första besök</th><th class="tr">Senaste besök</th></tr></thead><tbody>
        ${(ipStats||[]).map(r=>`<tr><td style="font-family:monospace">${r.ip_address}</td><td class="tr">${Number(r.visits).toLocaleString('sv')}</td><td class="tr">${Number(r.page_views).toLocaleString('sv')}</td><td class="tr">${r.active_days}</td><td class="tr">${r.first_seen?new Date(r.first_seen).toLocaleDateString('sv'):'–'}</td><td class="tr">${r.last_seen?new Date(r.last_seen).toLocaleDateString('sv'):'–'}</td></tr>`).join('')}
      </tbody></table>`:''}
      <script>window.onload=()=>{window.print();window.onafterprint=()=>window.close();}<\/script>
    </body></html>`);
    win.document.close();
  };

  const downloadCSV = () => {
    if (!details) return;
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
    rows.push(['Annons', 'Kund', 'Annonsplats', 'Visningar', 'Cap', 'Klick', 'CTR (%)', 'CPM-pris (kr)', 'Intäkt (kr)']);
    adStats.forEach(a => rows.push([esc(a.title), esc(a.customer_name), esc(a.placement_name), a.total_impressions || 0, a.max_impressions || '–', a.clicks, a.ctr, a.cpm_rate != null ? parseFloat(a.cpm_rate).toFixed(2) : '–', a.revenue != null ? parseFloat(a.revenue).toFixed(0) : '–']));
    rows.push([]);
    rows.push(['Share of Voice per annonsplats']);
    rows.push(['Annonsplats', 'Annons', 'Kund', 'Visningar', 'Totalt på plats', 'SOV (%)']);
    (sovStats || []).forEach(r => rows.push([esc(r.placement_name), esc(r.ad_title), esc(r.customer_name), r.impressions, r.total_placement_impressions, parseFloat(r.sov).toFixed(1)]));
    if ((ipStats || []).length > 0) {
      rows.push([]);
      rows.push(['Besöksfrekvens per IP']);
      rows.push(['IP-adress', 'Sessioner', 'Sidvisningar', 'Aktiva dagar', 'Första besök', 'Senaste besök']);
      ipStats.forEach(r => rows.push([r.ip_address, r.visits, r.page_views, r.active_days, r.first_seen ? new Date(r.first_seen).toLocaleDateString('sv') : '–', r.last_seen ? new Date(r.last_seen).toLocaleDateString('sv') : '–']));
    }

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
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { icon: Eye,          label: 'Totala sidvisningar',  value: Number(stats.totalViews).toLocaleString('sv'),                                  color: 'text-purple-500', bg: 'bg-purple-50' },
          { icon: Users,        label: 'Unika besökare',       value: Number(stats.uniqueVisitors || 0).toLocaleString('sv'),                         color: 'text-green-500',  bg: 'bg-green-50'  },
          { icon: TrendingUp,   label: 'Publicerade artiklar', value: Number(stats.publishedArticles),                                                color: 'text-blue-500',   bg: 'bg-blue-50'   },
          { icon: MousePointer, label: 'Annonsklick totalt',   value: adStats.reduce((s, a) => s + Number(a.clicks), 0).toLocaleString('sv'),         color: 'text-amber-500',  bg: 'bg-amber-50'  },
          { icon: Award,        label: 'Genomsnittlig CTR',    value: `${avgCTR}%`,                                                                   color: 'text-gold-500',   bg: 'bg-cream-100' },
          { icon: Building2,    label: 'Antal kunder',         value: Number(stats.totalCustomers || 0).toLocaleString('sv'),                         color: 'text-rose-500',   bg: 'bg-rose-50'   },
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

      {loadingDetails ? <DetailsSkeleton /> : (<>

      {/* Customer revenue bar chart */}
      {customerStats?.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-medium mb-4 text-charcoal-800">Annonsintäkter per kund</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={customerStats} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickFormatter={v => `${Number(v).toLocaleString('sv')} kr`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} width={100} />
              <Tooltip
                formatter={(v, name) => name === 'total_revenue' ? [`${Number(v).toLocaleString('sv')} kr`, 'Intäkter'] : [v, 'Annonser']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="total_revenue" radius={[0, 4, 4, 0]}>
                {customerStats.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Customer ad activity over time */}
      {customerAdsByDay?.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-medium mb-4 text-charcoal-800">Räckvidd & engagemang</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xs font-medium mb-3 text-gray-400 uppercase tracking-wide">Visningar</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={customerAdsByDay}>
                <defs>
                  <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={d => { try { return format(parseISO(d), 'd/M'); } catch { return d; } }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={v => v.toLocaleString('sv')} />
                <Tooltip
                  labelFormatter={d => { try { return format(parseISO(d), 'd MMMM', { locale: sv }); } catch { return d; } }}
                  formatter={v => [v.toLocaleString('sv'), 'Visningar']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                <Area type="monotone" dataKey="impressions" stroke="#C9A96E" strokeWidth={2}
                  fill="url(#impGrad)" dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h2 className="text-xs font-medium mb-3 text-gray-400 uppercase tracking-wide">Klick</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={customerAdsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={d => { try { return format(parseISO(d), 'd/M'); } catch { return d; } }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} allowDecimals={false} />
                <Tooltip
                  labelFormatter={d => { try { return format(parseISO(d), 'd MMMM', { locale: sv }); } catch { return d; } }}
                  formatter={v => [v.toLocaleString('sv'), 'Klick']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                <Bar dataKey="clicks" fill="#A8C5A0" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </div>
        </div>
      )}

      {/* Device breakdown + Std deviation */}
      {(deviceBreakdown?.length > 0 || n > 1) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deviceBreakdown?.length > 0 && (
            <div className="card p-5">
              <h2 className="text-sm font-medium mb-4 text-charcoal-800">Enhetsfördelning</h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={deviceBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis dataKey="device" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} width={60} />
                  <Tooltip formatter={v => [v.toLocaleString('sv'), 'Visningar']}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="views" radius={[0, 4, 4, 0]}>
                    {deviceBreakdown.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {n > 1 && (
            <div className="card p-5 flex flex-col justify-center">
              <h2 className="text-sm font-medium mb-4 text-charcoal-800">Intäktsspridning (Std)</h2>
              <p className="text-3xl font-semibold text-charcoal-800">
                {stdDev.toLocaleString('sv', { maximumFractionDigits: 0 })} kr
              </p>
              <p className="text-xs text-gray-400 mt-1">Standardavvikelse för annonsintäkter per kund</p>
              <div className="mt-4 space-y-1">
                <p className="text-xs text-gray-400">Medel: <span className="text-charcoal-800 font-medium">{mean.toLocaleString('sv', { maximumFractionDigits: 0 })} kr</span></p>
                <p className="text-xs text-gray-400">Min: <span className="text-charcoal-800 font-medium">{Math.min(...revenues).toLocaleString('sv')} kr</span></p>
                <p className="text-xs text-gray-400">Max: <span className="text-charcoal-800 font-medium">{Math.max(...revenues).toLocaleString('sv')} kr</span></p>
              </div>
            </div>
          )}
        </div>
      )}

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

      {/* Share of Voice */}
      {Object.keys(sovByPlacement).length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-5">
            <PieChart size={15} className="text-gold-400" />
            <h2 className="text-sm font-medium text-charcoal-800">Share of Voice – per annonsplats</h2>
          </div>
          <div className="space-y-6">
            {Object.entries(sovByPlacement).map(([placement, rows]) => (
              <div key={placement}>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">{placement}</p>
                <div className="space-y-2.5">
                  {rows.map((row, i) => (
                    <div key={row.ad_id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-medium truncate max-w-[180px]">{row.ad_title}</span>
                          {row.customer_name && (
                            <span className="text-[10px] text-gray-400 shrink-0">{row.customer_name}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          <span className="text-xs text-gray-400">{Number(row.impressions).toLocaleString('sv')} vis.</span>
                          <span className="text-sm font-semibold text-charcoal-800 w-12 text-right">{parseFloat(row.sov).toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-cream-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${row.sov}%`, backgroundColor: colors[i % colors.length] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-300 mt-2">
                  Totalt {Number(rows[0]?.total_placement_impressions || 0).toLocaleString('sv')} visningar på denna plats
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IP visit frequency */}
      {ipStats?.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-medium mb-4 text-charcoal-800">Besöksfrekvens per IP</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['IP-adress', 'Sessioner', 'Sidvisningar', 'Aktiva dagar', 'Första besök', 'Senaste besök'].map(h => (
                    <th key={h} className={`py-2 text-xs text-gray-400 font-medium ${h === 'IP-adress' ? 'text-left px-2' : 'text-right px-2'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ipStats.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-cream-50">
                    <td className="py-2.5 px-2 text-sm font-mono text-gray-600">{row.ip_address}</td>
                    <td className="py-2.5 px-2 text-right text-sm font-semibold">{Number(row.visits).toLocaleString('sv')}</td>
                    <td className="py-2.5 px-2 text-right text-sm text-gray-400">{Number(row.page_views).toLocaleString('sv')}</td>
                    <td className="py-2.5 px-2 text-right text-sm text-gray-500">{row.active_days}</td>
                    <td className="py-2.5 px-2 text-right text-xs text-gray-400">{row.first_seen ? new Date(row.first_seen).toLocaleDateString('sv') : '–'}</td>
                    <td className="py-2.5 px-2 text-right text-xs text-gray-400">{row.last_seen ? new Date(row.last_seen).toLocaleDateString('sv') : '–'}</td>
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
                  {['Annons', 'Kund', 'Annonsplats', 'Visningar / Cap', 'Klick', 'CTR', 'CPM-pris', 'Intäkt'].map(h => (
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
                    <td className="py-2.5 px-2 text-right text-sm">
                      <div>{Number(a.total_impressions || 0).toLocaleString('sv')}{a.max_impressions ? ` / ${Number(a.max_impressions).toLocaleString('sv')}` : ''}</div>
                      {a.max_impressions > 0 && (
                        <div className="w-16 h-1 bg-gray-100 rounded-full ml-auto mt-1">
                          <div className="h-1 rounded-full bg-gold-400" style={{ width: `${Math.min(100, Math.round((a.total_impressions / a.max_impressions) * 100))}%` }} />
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-right text-sm">{a.clicks}</td>
                    <td className="py-2.5 px-2 text-right">
                      <span className={`text-sm font-medium ${parseFloat(a.ctr) > 2 ? 'text-green-600' : parseFloat(a.ctr) > 0.5 ? 'text-amber-600' : 'text-gray-400'}`}>
                        {parseFloat(a.ctr || 0).toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right text-sm text-gray-600">
                      {a.cpm_rate != null ? `${parseFloat(a.cpm_rate).toFixed(2)} kr` : '–'}
                    </td>
                    <td className="py-2.5 px-2 text-right text-sm font-medium">
                      {a.revenue != null ? `${parseFloat(a.revenue).toLocaleString('sv', { maximumFractionDigits: 0 })} kr` : '–'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      </>)}
    </div>
  );
}
