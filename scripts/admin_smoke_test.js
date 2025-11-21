// Simple smoke test for admin endpoints
// Usage: node scripts/admin_smoke_test.js

const API_BASE = process.env.API_BASE || 'http://localhost:8000';

async function request(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch (e) { body = text; }
  return { ok: res.ok, status: res.status, body };
}

async function run() {
  console.log('API_BASE =', API_BASE);
  try {
    const list = await request('/products');
    if (!list.ok) {
      console.error('GET /products failed', list.status, list.body);
      return process.exit(1);
    }
    console.log('GET /products ->', Array.isArray(list.body) ? `${list.body.length} products` : list.body);

    const sample = {
      name: 'SmokeTest Pickle ' + Date.now(),
      category: 'pickles',
      description: 'Created by smoke test',
      image_url: null,
      variants: [ { weight: '250g', price: 99 }, { weight: '500g', price: 179 } ]
    };

    const create = await request('/admin/products', { method: 'POST', body: JSON.stringify(sample) });
    if (!create.ok) {
      console.error('POST /admin/products failed', create.status, create.body);
      return process.exit(1);
    }
    console.log('Created product:', create.body.id || create.body);

    const pid = (create.body && create.body.id) || null;
    if (!pid) {
      console.error('No product id returned; skipping delete');
      return;
    }

    const del = await request(`/admin/products/${pid}`, { method: 'DELETE' });
    if (del.status === 204 || del.ok) {
      console.log('Deleted product', pid);
    } else {
      console.error('DELETE failed', del.status, del.body);
      process.exit(1);
    }
  } catch (err) {
    console.error('Smoke test error:', err.message || err);
    process.exit(2);
  }
}

run();
