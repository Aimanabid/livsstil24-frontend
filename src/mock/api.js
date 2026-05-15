import {
  MOCK_USER, MOCK_CATEGORIES, MOCK_ARTICLES, MOCK_CUSTOMERS,
  MOCK_PLACEMENTS, MOCK_ADS, MOCK_SETTINGS, MOCK_VIEWS_BY_DAY,
} from './data.js';

// ── Mutable in-memory state (persists for the browser session) ────────────────
let articles   = MOCK_ARTICLES.map(a => ({ ...a }));
let categories = MOCK_CATEGORIES.map(c => ({ ...c }));
let customers  = MOCK_CUSTOMERS.map(c => ({ ...c }));
let placements = MOCK_PLACEMENTS.map(p => ({ ...p }));
let ads        = MOCK_ADS.map(a => ({ ...a }));
let settings   = { ...MOCK_SETTINGS };

// ── Helpers ───────────────────────────────────────────────────────────────────
const delay = (ms = 180) => new Promise(r => setTimeout(r, ms));
const ok    = data => Promise.resolve({ data });
const fail  = (msg, status = 400) => Promise.reject({ response: { data: { error: msg }, status } });
const uid   = () => (Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10)).slice(0, 16);

function parseUrl(url) {
  const [path, qs = ''] = url.split('?');
  const params = {};
  qs.split('&').forEach(pair => {
    const [k, v] = pair.split('=');
    if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
  });
  return { path, params };
}

function buildStats() {
  const published = articles.filter(a => a.status === 'published');
  return {
    stats: {
      publishedArticles: published.length,
      totalViews: articles.reduce((s, a) => s + (a.views || 0), 0),
      totalAds:   ads.filter(a => a.status === 'active').length,
      totalCustomers: customers.length,
      adRevenue:  placements.reduce((s, p) => s + (p.price_monthly || 0), 0),
    },
    topArticles: [...published]
      .sort((a, b) => b.views - a.views).slice(0, 5)
      .map(a => ({ title: a.title, views: a.views, category_name: a.category_name, category_color: a.category_color })),
    recentArticles: [...articles]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
      .map(a => ({ id: a.id, title: a.title, category_name: a.category_name, status: a.status })),
    adStats: ads.map(a => ({
      title:          a.title,
      customer_name:  customers.find(c => c.id === a.customer_id)?.company ?? null,
      placement_name: placements.find(p => p.id === a.placement_id)?.name ?? null,
      impressions:    a.impressions || 0,
      clicks:         a.clicks || 0,
      ctr:            a.impressions ? ((a.clicks / a.impressions) * 100).toFixed(2) : '0.00',
    })),
    viewsByDay:        MOCK_VIEWS_BY_DAY,
    categoryBreakdown: categories.map(cat => ({
      name:          cat.name,
      article_count: articles.filter(a => a.category_id === cat.id).length,
      total_views:   articles.filter(a => a.category_id === cat.id).reduce((s, a) => s + (a.views || 0), 0),
    })),
  };
}

function enrichAd(a) {
  return {
    ...a,
    placement_name: placements.find(p => p.id === a.placement_id)?.name ?? null,
    position_key:   placements.find(p => p.id === a.placement_id)?.position_key ?? null,
    customer_name:  customers.find(c => c.id === a.customer_id)?.company ?? null,
  };
}

function enrichPlacement(p) {
  return {
    ...p,
    key:            p.position_key,
    price_per_month: p.price_monthly,
    active_ads:     ads.filter(a => a.placement_id === p.id && a.status === 'active').length,
  };
}

// ── GET ───────────────────────────────────────────────────────────────────────
async function handleGet(url) {
  await delay();
  const { path, params } = parseUrl(url);
  const seg = path.split('/').filter(Boolean);

  if (path === '/categories')      return ok(categories);
  if (path === '/settings')        return ok(settings);
  if (path === '/auth/me')         return ok(MOCK_USER);
  if (path === '/stats/dashboard') return ok(buildStats());
  if (path === '/customers')       return ok(customers);

  if (path === '/ads/placements')  return ok(placements.map(enrichPlacement));

  // /ads/placement/:key  (public – returns active ads for that slot)
  if (seg[0] === 'ads' && seg[1] === 'placement' && seg[2]) {
    const pl = placements.find(p => p.position_key === seg[2] && p.is_active);
    if (!pl) return ok([]);
    const today = new Date().toISOString().split('T')[0];
    const result = ads.filter(a => {
      if (a.placement_id !== pl.id || a.status !== 'active') return false;
      if (a.start_date && a.start_date > today) return false;
      if (a.end_date   && a.end_date   < today) return false;
      return true;
    }).slice(0, pl.max_ads || 1);
    return ok(result.map(a => ({ ...a, placement_name: pl.name })));
  }

  if (path === '/ads') return ok(ads.map(enrichAd));

  // /articles/admin/all
  if (path === '/articles/admin/all') {
    let result = [...articles];
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(a => a.title.toLowerCase().includes(q));
    }
    if (params.status) result = result.filter(a => a.status === params.status);
    const total  = result.length;
    const limit  = parseInt(params.limit)  || 20;
    const offset = parseInt(params.offset) || 0;
    return ok({ articles: result.slice(offset, offset + limit), total });
  }

  // /articles/admin/:id
  if (seg[0] === 'articles' && seg[1] === 'admin' && seg[2]) {
    return ok(articles.find(a => a.id === seg[2]) ?? null);
  }

  // /articles  (with query params)
  if (path === '/articles') {
    let result = params.status === 'all'
      ? [...articles]
      : articles.filter(a => a.status === 'published');

    if (params.featured === 'true') result = result.filter(a => a.featured);
    if (params.category) result = result.filter(a => a.category_slug === params.category);
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) || (a.excerpt || '').toLowerCase().includes(q)
      );
    }

    const total  = result.length;
    const limit  = parseInt(params.limit)  || 20;
    const offset = parseInt(params.offset) || 0;
    return ok({ articles: result.slice(offset, offset + limit), total });
  }

  // /articles/:slug
  if (seg[0] === 'articles' && seg[1]) {
    return ok(articles.find(a => a.slug === seg[1]) ?? null);
  }

  return ok(null);
}

// ── POST ──────────────────────────────────────────────────────────────────────
async function handlePost(url, body = {}) {
  await delay();
  const { path } = parseUrl(url);
  const seg = path.split('/').filter(Boolean);

  // Auth
  if (path === '/auth/login') {
    if (body.email === 'admin@livsstil24.se' && body.password === 'admin123') {
      return ok({ user: MOCK_USER });
    }
    return fail('Fel e-postadress eller lösenord', 401);
  }
  if (path === '/auth/logout') return ok({ success: true });

  // Tracking (fire-and-forget)
  if (seg[2] === 'view' || seg[2] === 'impression' || seg[2] === 'click') return ok({ success: true });

  // /upload  – return a placeholder image URL
  if (path === '/upload' || path === '/upload/video') {
    return ok({ url: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&auto=format&fit=crop' });
  }

  // /articles
  if (path === '/articles') {
    const cat  = categories.find(c => c.id === body.category_id);
    const newA = {
      id: uid(), views: 0, impressions: 0,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      category_name: cat?.name ?? null, category_slug: cat?.slug ?? null, category_color: cat?.color ?? null,
      author_name: MOCK_USER.name, author_id: MOCK_USER.id,
      tags: [], status: 'draft', featured: false, ...body,
    };
    articles.push(newA);
    return ok(newA);
  }

  // /categories
  if (path === '/categories') {
    const newC = { id: uid(), sort_order: categories.length + 1, article_count: 0, ...body };
    categories.push(newC);
    return ok(newC);
  }

  // /ads/placements
  if (path === '/ads/placements') {
    const newP = {
      id: uid(), is_active: true, max_ads: 1,
      position_key: body.key || body.position_key,
      price_monthly: body.price_per_month || 0,
      ...body,
    };
    placements.push(newP);
    return ok(enrichPlacement(newP));
  }

  // /ads
  if (path === '/ads') {
    const newA = { id: uid(), clicks: 0, impressions: 0, status: 'active', ...body };
    ads.push(newA);
    return ok(enrichAd(newA));
  }

  // /customers
  if (path === '/customers') {
    const newC = { id: uid(), status: 'active', created_at: new Date().toISOString(), ...body };
    customers.push(newC);
    return ok(newC);
  }

  return ok({ success: true });
}

// ── PUT ───────────────────────────────────────────────────────────────────────
async function handlePut(url, body = {}) {
  await delay();
  const { path } = parseUrl(url);
  const seg = path.split('/').filter(Boolean);

  if (path === '/settings') {
    Object.assign(settings, body);
    return ok({ success: true });
  }

  // /auth/me  (profile update)
  if (path === '/auth/me') {
    Object.assign(MOCK_USER, body);
    return ok(MOCK_USER);
  }

  // /ads/placements/:id
  if (seg[0] === 'ads' && seg[1] === 'placements' && seg[2]) {
    const idx = placements.findIndex(p => p.id === seg[2]);
    if (idx >= 0) {
      Object.assign(placements[idx], {
        ...body,
        position_key:  body.key || body.position_key || placements[idx].position_key,
        price_monthly: body.price_per_month || placements[idx].price_monthly,
      });
    }
    return ok({ success: true });
  }

  // /ads/:id
  if (seg[0] === 'ads' && seg[1]) {
    const idx = ads.findIndex(a => a.id === seg[1]);
    if (idx >= 0) Object.assign(ads[idx], body);
    return ok({ success: true });
  }

  // /articles/:id
  if (seg[0] === 'articles' && seg[1]) {
    const idx = articles.findIndex(a => a.id === seg[1]);
    if (idx >= 0) {
      const cat = categories.find(c => c.id === (body.category_id || articles[idx].category_id));
      Object.assign(articles[idx], {
        ...body,
        category_name:  cat?.name  ?? articles[idx].category_name,
        category_slug:  cat?.slug  ?? articles[idx].category_slug,
        category_color: cat?.color ?? articles[idx].category_color,
        updated_at: new Date().toISOString(),
      });
    }
    return ok({ success: true });
  }

  // /customers/:id
  if (seg[0] === 'customers' && seg[1]) {
    const idx = customers.findIndex(c => c.id === seg[1]);
    if (idx >= 0) Object.assign(customers[idx], body);
    return ok(customers[idx] ?? { success: true });
  }

  // /categories/:id
  if (seg[0] === 'categories' && seg[1]) {
    const idx = categories.findIndex(c => c.id === seg[1]);
    if (idx >= 0) Object.assign(categories[idx], body);
    return ok(categories[idx] ?? { success: true });
  }

  return ok({ success: true });
}

// ── DELETE ────────────────────────────────────────────────────────────────────
async function handleDelete(url) {
  await delay();
  const { path } = parseUrl(url);
  const seg = path.split('/').filter(Boolean);

  if (seg[0] === 'articles'   && seg[1]) { articles   = articles.filter(a => a.id !== seg[1]); }
  if (seg[0] === 'ads'        && seg[1]) { ads        = ads.filter(a => a.id !== seg[1]); }
  if (seg[0] === 'customers'  && seg[1]) { customers  = customers.filter(c => c.id !== seg[1]); }
  if (seg[0] === 'categories' && seg[1]) { categories = categories.filter(c => c.id !== seg[1]); }

  return ok({ success: true });
}

// ── Export axios-compatible mock ──────────────────────────────────────────────
const mockApi = {
  get:    (url)          => handleGet(url),
  post:   (url, body)    => handlePost(url, body),
  put:    (url, body)    => handlePut(url, body),
  delete: (url)          => handleDelete(url),
  patch:  (url, body)    => handlePut(url, body),
};

export default mockApi;
