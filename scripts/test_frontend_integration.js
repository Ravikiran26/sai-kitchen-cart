// scripts/test_frontend_integration.js
// Simple smoke test: fetch backend /products and map to UI Product shape

const API_BASE = process.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

function mapApiVariantToUi(v) {
  return {
    label: v.weight ?? String(v.id),
    weightGrams: parseInt(String(v.weight).replace(/[^0-9]/g, '')) || 0,
    price: v.price ?? 0,
    mrp: v.price ?? 0,
    stock: v.stock ?? 999,
  };
}

function mapApiToUi(p) {
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug || String(p.id).toLowerCase().replace(/\s+/g, '-'),
    category: p.category || 'misc',
    description: p.description || '',
    images: [p.image_url || '/placeholder.svg'],
    variants: Array.isArray(p.variants) ? p.variants.map(mapApiVariantToUi) : [],
    tags: p.tags || [],
    spiceLevel: p.spice_level || undefined,
    ingredients: p.ingredients || [],
    isBestseller: !!p.is_bestseller,
  };
}

(async () => {
  try {
    console.log('Fetching products from', API_BASE + '/products');
    const res = await fetch(API_BASE + '/products');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const api = await res.json();
    console.log('Got', api.length, 'products from backend');
    const ui = api.map(mapApiToUi);
    console.log('Mapped to UI products. Sample:');
    console.log(JSON.stringify(ui.slice(0,2), null, 2));
    // Basic assertions
    const bad = ui.filter(p => !p.id || !p.name || !Array.isArray(p.variants));
    if (bad.length) {
      console.error('Mapping errors for', bad.length, 'products');
      process.exitCode = 2;
    } else {
      console.log('Mapping looks good for all products');
    }
  } catch (err) {
    console.error('Test failed:', err.message || err);
    process.exitCode = 1;
  }
})();
