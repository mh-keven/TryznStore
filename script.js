/* Safe LocalStorage helper */
const storage = {
  get: (k, def) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : def;
    } catch (e) {
      return def;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }
};

/* DOM Query Shortcuts */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Configuration for Pakistan Domestic Dropshipping */
const CFG = {
  // Google Apps Script web app endpoint for products, promos, orders, and customer profiles.
  api: 'https://tryzn-api-proxy.hshussnain41.workers.dev',
  wa: '923278081874',
  currency: 'Rs.',
  shippingFee: 200,
  freeShippingOver: 4999,
};

const formatMoney = n => CFG.currency + ' ' + Number(n).toLocaleString('en-PK');

/* Initial Collections State with Dropdown Subcategories */
const DEFAULT_CATEGORIES = [
  { name: 'Men', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80', count: 'Polos, Chinos & Tees', subcategories: ['Knitted Polos', 'Slim-Fit Chinos', 'Boxy T-Shirts', 'Linen Shirts'] },
  { name: 'Women', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80', count: 'Suits, Kurtis & Totes', subcategories: ['3-Piece Suits', 'Tote Bags', 'Digital Kurtis', 'Hoop Earrings'] },
  { name: 'Footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80', count: 'Monaco Slides & Boots', subcategories: ['Monaco Slides', 'Chelsea Boots', 'Tassel Loafers', 'Cloud Sneakers'] },
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80', count: 'Earbuds, Power & Watch', subcategories: ['ANC Earbuds', 'Power Banks', 'Smartwatches', 'Fast Chargers'] },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80', count: 'Watches, Wallets & Belts', subcategories: ['Chrono Watches', 'Leather Wallets', 'Aviator Glasses', 'Leather Belts'] },
  { name: 'Fragrances', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80', count: 'Luxury EDP & Ouds', subcategories: ['Eau De Parfum', 'Oriental Ouds'] },
  { name: 'Home', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80', count: 'Bedding & Diffusers', subcategories: ['Bed Sheets', 'Aroma Diffusers'] },
  { name: 'Combo Deals', image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=600&q=80', count: 'Bundle & Save Extra', subcategories: ['Apparel Bundles', 'Executive Boxes'] }
];

// Restore every original collection if old browser storage contains an incomplete list.
// Keep saved edits for existing collections and append any custom collections.
const savedCategories = storage.get('tryzn_categories', []);
const savedCategoryList = Array.isArray(savedCategories) ? savedCategories : [];
const savedByName = new Map(savedCategoryList.filter(c => c && c.name).map(c => [String(c.name).trim().toLowerCase(), c]));
const CATEGORIES = DEFAULT_CATEGORIES.map(def => {
  const saved = savedByName.get(def.name.toLowerCase());
  return saved ? { ...def, ...saved, name: def.name } : { ...def };
});
savedCategoryList.forEach(saved => {
  if (saved && saved.name && !CATEGORIES.some(c => c.name.toLowerCase() === String(saved.name).trim().toLowerCase())) {
    CATEGORIES.push(saved);
  }
});
storage.set('tryzn_categories', CATEGORIES);

/* 26 Verified Demo Products for Pakistan */
const DEFAULT_PRODUCTS = [
  // MEN
  { id: 'm1', name: 'Old Money Textured Knitted Polo', category: 'Men', subcategory: 'Knitted Polos', price: 2790, oldPrice: 3490, rating: 4.9, reviews: 64, stock: 18, badge: 'Bestseller', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=700&q=80', description: 'Crafted from breathable drop-needle knit fabric. Ribbed collar and clean minimalist aesthetic.' },
  { id: 'm2', name: 'Tailored Slim-Fit Chino Trousers', category: 'Men', subcategory: 'Slim-Fit Chinos', price: 3490, oldPrice: 4200, rating: 4.8, reviews: 42, stock: 14, badge: 'Popular', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=80', description: 'Stretch-cotton twill with wrinkle-resistant finish for daily wear.' },
  { id: 'm3', name: 'Heavyweight Relaxed Boxy T-Shirt', category: 'Men', subcategory: 'Boxy T-Shirts', price: 1990, oldPrice: 2490, rating: 4.7, reviews: 31, stock: 25, badge: 'Trending', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80', description: '240 GSM pure combed cotton with dense ribbed collar.' },
  { id: 'm4', name: 'Crisp Linen Casual Button-Down Shirt', category: 'Men', subcategory: 'Linen Shirts', price: 3290, oldPrice: 3990, rating: 4.9, reviews: 28, stock: 12, badge: 'New Season', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80', description: 'Lightweight linen blend that stays cool under warm weather.' },

  // WOMEN
  { id: 'w1', name: 'Embroidered Lawn Festive 3-Piece Suit', category: 'Women', subcategory: '3-Piece Suits', price: 4990, oldPrice: 5990, rating: 5.0, reviews: 83, stock: 8, badge: 'Limited Stock', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80', description: 'Intricate threadwork embroidery on soft premium lawn with chiffon dupatta.' },
  { id: 'w2', name: 'Everyday Structured Minimalist Tote Bag', category: 'Women', subcategory: 'Tote Bags', price: 2890, oldPrice: 3490, rating: 4.9, reviews: 44, stock: 15, badge: 'Sale', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80', description: 'Textured vegan leather with 14-inch laptop sleeve.' },
  { id: 'w3', name: 'Pure Silk Blend Digital Printed Kurti', category: 'Women', subcategory: 'Digital Kurtis', price: 2690, oldPrice: 3200, rating: 4.8, reviews: 36, stock: 11, badge: 'Festive', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80', description: 'Graceful straight-cut kurti with high-definition digital motifs.' },
  { id: 'w4', name: '18K Gold Plated Minimalist Chunky Hoops', category: 'Women', subcategory: 'Hoop Earrings', price: 1490, oldPrice: 1990, rating: 4.9, reviews: 52, stock: 20, badge: 'Accessory', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=700&q=80', description: 'Hypoallergenic stainless steel with non-tarnish 18K gold coating.' },

  // FOOTWEAR
  { id: 'f1', name: 'DN Monaco Handcrafted Soft Slides', category: 'Footwear', subcategory: 'Monaco Slides', price: 2490, oldPrice: 3200, rating: 4.9, reviews: 95, stock: 22, badge: 'Bestseller', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=700&q=80', description: 'Ultra-cushioned EVA footbed with genuine leather-feel strap.' },
  { id: 'f2', name: 'Premium Leather Chelsea Ankle Boots', category: 'Footwear', subcategory: 'Chelsea Boots', price: 5490, oldPrice: 6800, rating: 4.9, reviews: 47, stock: 9, badge: 'Old Money', image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=700&q=80', description: 'Supple full-grain finish with dual elastic side gussets.' },
  { id: 'f3', name: 'Handcrafted Tassel Leather Loafers', category: 'Footwear', subcategory: 'Tassel Loafers', price: 4890, oldPrice: 5990, rating: 4.8, reviews: 33, stock: 12, badge: 'Formal', image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=700&q=80', description: 'Classic penny silhouette with twin tassels and padded leather insole.' },
  { id: 'f4', name: 'Everyday Breathable Cloud Sneakers', category: 'Footwear', subcategory: 'Cloud Sneakers', price: 3790, oldPrice: 4500, rating: 4.7, reviews: 60, stock: 16, badge: 'Trending', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80', description: 'Ultra-lightweight knit upper with high-rebound cushioning.' },

  // ELECTRONICS
  { id: 'e1', name: 'Active Noise Cancelling True Wireless Earbuds', category: 'Electronics', subcategory: 'ANC Earbuds', price: 3990, oldPrice: 5200, rating: 4.8, reviews: 112, stock: 25, badge: 'Hot Seller', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80', description: 'Deep bass dynamic drivers with 32-hour extended battery life.' },
  { id: 'e2', name: '20,000 mAh PD 22.5W Fast Charge Power Bank', category: 'Electronics', subcategory: 'Power Banks', price: 4490, oldPrice: 5490, rating: 4.9, reviews: 58, stock: 14, badge: 'Power Pick', image: 'https://images.unsplash.com/photo-1609592426507-b08eefd20f66?auto=format&fit=crop&w=700&q=80', description: 'Triple-port smart output capable of charging phone and tablet simultaneously.' },
  { id: 'e3', name: 'Ultra-HD AMOLED Bluetooth Calling Smartwatch', category: 'Electronics', subcategory: 'Smartwatches', price: 6490, oldPrice: 7990, rating: 4.8, reviews: 73, stock: 10, badge: 'Smart Tech', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=700&q=80', description: 'Always-On Display with 100+ fitness modes and crystal clear calling.' },
  { id: 'e4', name: '15W MagSafe Fast Magnetic Wireless Charger', category: 'Electronics', subcategory: 'Fast Chargers', price: 2290, oldPrice: 2990, rating: 4.7, reviews: 39, stock: 30, badge: 'Fast Charge', image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=700&q=80', description: 'Precision snap-on magnetic alignment for iPhone and Qi devices.' },

  // ACCESSORIES
  { id: 'a1', name: 'Minimalist Steel Chronograph Watch', category: 'Accessories', subcategory: 'Chrono Watches', price: 5990, oldPrice: 7490, rating: 4.9, reviews: 77, stock: 12, badge: 'Luxury Edit', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80', description: 'Brushed stainless steel case with scratch-resistant glass.' },
  { id: 'a2', name: 'Full Grain Leather Slim Bi-Fold Wallet', category: 'Accessories', subcategory: 'Leather Wallets', price: 1890, oldPrice: 2400, rating: 4.7, reviews: 41, stock: 28, badge: 'Classic', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80', description: 'Genuine cowhide leather with RFID blocking technology.' },
  { id: 'a3', name: 'Polarized Metal Frame Aviator Sunglasses', category: 'Accessories', subcategory: 'Aviator Glasses', price: 2190, oldPrice: 2890, rating: 4.8, reviews: 55, stock: 17, badge: 'UV400', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80', description: 'Titanium alloy frame with UV400 polarized gradient lenses.' },
  { id: 'a4', name: 'Reversible Italian Top-Grain Leather Belt', category: 'Accessories', subcategory: 'Leather Belts', price: 1790, oldPrice: 2290, rating: 4.8, reviews: 34, stock: 20, badge: '2-in-1', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80', description: 'Rotatable buckle allowing instant flip between Black and Brown.' },

  // FRAGRANCES
  { id: 'p1', name: 'Perception Eau De Parfum — 100ml', category: 'Fragrances', subcategory: 'Eau De Parfum', price: 3690, oldPrice: 4500, rating: 4.9, reviews: 88, stock: 15, badge: 'Signature', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=700&q=80', description: 'Warm spicy notes of pink pepper and bergamot settling into rich cedarwood.' },
  { id: 'p2', name: 'Royal Velvet Oriental Oud Elixir — 50ml', category: 'Fragrances', subcategory: 'Oriental Ouds', price: 4290, oldPrice: 5200, rating: 5.0, reviews: 62, stock: 9, badge: 'Premium Oud', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80', description: 'Cambodian agarwood combined with smoky Damascus rose.' },

  // HOME
  { id: 'h1', name: '100% Egyptian Cotton Luxury Bed Sheet Set', category: 'Home', subcategory: 'Bed Sheets', price: 3890, oldPrice: 4800, rating: 4.9, reviews: 49, stock: 14, badge: 'Cozy Pick', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80', description: '400 thread count sateen weave with silky smooth finish.' },
  { id: 'h2', name: 'Ceramic Ultrasonic Aroma Diffuser & Humidifier', category: 'Home', subcategory: 'Aroma Diffusers', price: 3190, oldPrice: 3990, rating: 4.8, reviews: 41, stock: 11, badge: 'Wellness', image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=80', description: 'Cold mist diffusion with 7 soothing ambient LED night modes.' },

  // COMBO DEALS
  { id: 'c1', name: 'Old Money Duo: Knitted Polo + Chino Combo', category: 'Combo Deals', subcategory: 'Apparel Bundles', price: 5490, oldPrice: 7690, rating: 5.0, reviews: 104, stock: 15, badge: 'Save Rs. 2,200', image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=700&q=80', description: 'Our top-rated knitted polo paired with tailored stretch chinos.' },
  { id: 'c2', name: 'Executive Gift Box: Steel Watch + Leather Wallet', category: 'Combo Deals', subcategory: 'Executive Boxes', price: 6990, oldPrice: 9890, rating: 4.9, reviews: 79, stock: 8, badge: 'Gift Box', image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=700&q=80', description: 'Presented in a matte black embossed gift case.' }
];

const PK_CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Gujranwala', 'Sialkot', 'Quetta', 'Other City'];

let activeCategory = 'All';
let activeSubcategory = null;
let cart = storage.get('tryzn_cart', {});
let promoCodes = storage.get('tryzn_promo_codes', []);
let appliedPromoCode = storage.get('tryzn_applied_promo', null);

let productsList = storage.get('tryzn_products', null);

if (!productsList || productsList.length < 10) {
  productsList = DEFAULT_PRODUCTS;
  storage.set('tryzn_products', productsList);
}

// Google Sheets API helpers. Customer passwords must never be sent to Sheets.
async function readSheetsAction(action) {
  if (!CFG.api) return null;
  const response = await fetch(CFG.api + '?action=' + encodeURIComponent(action));
  if (!response.ok) throw new Error('Google Sheets request failed: ' + action);
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Google Sheets request failed: ' + action);
  return data;
}

async function writeSheetsAction(payload) {
  if (!CFG.api) return null;
  const response = await fetch(CFG.api, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error((data && data.error) || 'Google Sheets write failed');
  return data;
}

async function loadPromoCodesFromSheets() {
  try {
    const data = await readSheetsAction('promocodes');
    if (!Array.isArray(data.promoCodes)) return;
    promoCodes = data.promoCodes.map(p => ({
      code: String(p.promo_code || '').trim().toUpperCase(),
      percent: Number(p.discount_value) || 0,
      discountType: String(p.discount_type || 'percentage').toLowerCase(),
      minOrder: Number(p.min_order) || 0,
      maxDiscount: Number(p.max_discount) || 0,
      category: Array.isArray(p.applicable_categories) ? (p.applicable_categories[0] || '') : '',
      categories: Array.isArray(p.applicable_categories) ? p.applicable_categories : [],
      productId: Array.isArray(p.applicable_product_ids) ? (p.applicable_product_ids[0] || '') : '',
      productIds: Array.isArray(p.applicable_product_ids) ? p.applicable_product_ids : [],
      usageLimit: Number(p.usage_limit) || 0,
      usedCount: Number(p.used_count) || 0,
      active: p.active === true || String(p.active).toLowerCase() === 'true',
      startsAt: p.starts_at || '',
      expiresAt: p.expires_at || '',
      createdAt: p.created_at || ''
    })).filter(p => p.code && p.active && p.discountType === 'percentage');
    storage.set('tryzn_promo_codes', promoCodes);
    if (typeof renderPromoCodes === 'function') renderPromoCodes();
    console.log('Loaded promo codes from Google Sheets:', promoCodes.length);
  } catch (error) {
    console.warn('Google Sheets promo loading failed; using locally cached promos.', error);
  }
}

// Google Sheets product API
async function loadProductsFromSheets() {
  if (!CFG.api) return;

  try {
    const response = await fetch(CFG.api + '?action=products');
    if (!response.ok) throw new Error('Could not load products');

    const data = await response.json();
    if (!data.success || !Array.isArray(data.products)) {
      throw new Error(data.error || 'Invalid product response');
    }

    // Keep only active products and map Sheet columns to website fields.
    const sheetProducts = data.products
      .filter(p => String(p.active).trim().toLowerCase() === 'true')
      .map(p => {
        const id = String(p.product_id || '').trim();
        const name = String(p.name || '').trim();
        const category = String(p.category || '').trim();
        const rawImage = String(p.image || '').trim();
        const validImage = /^https?:\/\//i.test(rawImage);
        const categoryFallback = DEFAULT_PRODUCTS.find(item => item.category === category);
        return {
          id,
          name,
          category,
          subcategory: String(p.subcategory || '').trim(),
          price: Math.max(0, Number(p.price) || 0),
          oldPrice: Math.max(0, Number(p.old_price) || 0),
          rating: Math.max(0, Number(p.rating) || 0),
          reviews: Math.max(0, Number(p.reviews) || 0),
          stock: Math.max(0, Number(p.stock) || 0),
          badge: String(p.badge || '').trim(),
          // Ignore placeholder text such as "Leave blank" in the image column.
          image: validImage ? rawImage : (categoryFallback?.image || DEFAULT_PRODUCTS[0].image),
          description: String(p.description || '').trim()
        };
      })
      .filter(p => p.id && p.name && p.price > 0);

    // Don't replace the existing catalogue with an empty result.
    if (!sheetProducts.length) {
      console.warn('Google Sheets returned no active products; keeping existing products.');
      return;
    }

    // Merge Sheet products into the existing catalogue instead of replacing it.
    // This preserves the existing collections/categories while the Sheet is being populated.
    const productMap = new Map(DEFAULT_PRODUCTS.map(product => [String(product.id), product]));
    for (const product of sheetProducts) {
      productMap.set(String(product.id), {
        ...(productMap.get(String(product.id)) || {}),
        ...product
      });
    }
    productsList = Array.from(productMap.values());
    storage.set('tryzn_products', productsList);

    // Refresh every storefront view that depends on the product catalogue.
    if (typeof renderNav === 'function') renderNav();
    if (typeof renderProducts === 'function') renderProducts();
    if (typeof renderHomeFeatured === 'function') renderHomeFeatured();
    if (typeof updateCartBadge === 'function') updateCartBadge();
    if (typeof renderDrawer === 'function' && document.body.classList.contains('drawer-open')) renderDrawer();

    console.log('Loaded products from Google Sheets:', sheetProducts.length);
  } catch (error) {
    console.error('Google Sheets product loading failed:', error);
    // Existing local/demo products remain available.
  }
}

let ordersList = storage.get('tryzn_orders', [
  { id: 'TZ-910482', time: '2026-10-15 11:20', name: 'Hamza Malik', phone: '0301-8472910', city: 'Lahore', address: 'House 42, Block C, Model Town', items: [{ id: 'm1', name: 'Old Money Textured Knitted Polo', qty: 1, price: 2790 }], total: 2990, status: 'New' }
]);
let currentUser = storage.get('tryzn_user', null);
let registeredUsers = storage.get('tryzn_registered_users', []);
// Admin access must not be trusted from public localStorage.
let isAdminLoggedIn = false;
storage.set('tryzn_is_admin', false);
let drawerView = 'cart';
let lastPlacedOrder = null;

/* Toast helper */
function showToast(msg, isErr = false) {
  const t = $('#storeToast');
  if (!t) return;
  t.textContent = msg;
  t.className = isErr ? 'toast-visible toast-error' : 'toast-visible toast-success';
  clearTimeout(window._toastT);
  window._toastT = setTimeout(() => { t.className = ''; }, 3200);
}

function renderNav() {
  const cats = ['All', ...CATEGORIES.map(c => c.name)];
  
  // Header Nav Bar: Home | Shop | categories (no "All Products" link)
  const topNav = $('#topNav');
  if (topNav) {
    const shopOpen = document.body.classList.contains('shop-page-open');
    const homeActive = !shopOpen;
    const shopActive = shopOpen && activeCategory === 'All' && !activeSubcategory;

    const homeLink = `
      <div class="nav-item-wrapper">
        <a href="#" class="header-nav-link ${homeActive ? 'active' : ''}" data-go-home>Home</a>
      </div>`;

    const shopLink = `
      <div class="nav-item-wrapper">
        <a href="#shop" class="header-nav-link shop-nav-link ${shopActive ? 'active' : ''}" data-open-shop>Shop</a>
      </div>`;

    const catLinks = CATEGORIES.map(catObj => {
      const c = catObj.name;
      const subList = catObj.subcategories || [];
      const isCatActive = shopOpen && c === activeCategory;

      if (!subList.length) {
        return `
          <div class="nav-item-wrapper">
            <a href="#shop" class="header-nav-link ${isCatActive ? 'active' : ''}" data-cat="${esc(c)}">${esc(c)}</a>
          </div>`;
      }

      return `
        <div class="nav-item-wrapper">
          <a href="#shop" class="header-nav-link ${isCatActive ? 'active' : ''}" data-cat="${esc(c)}">
            ${esc(c)}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left:2px;"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
          <div class="nav-dropdown-menu">
            <a href="#shop" class="nav-dropdown-item" data-cat="${esc(c)}" style="font-weight:700; border-bottom: 1px solid var(--line); margin-bottom: 4px;">View All ${esc(c)}</a>
            ${subList.map(s => `<a href="#shop" class="nav-dropdown-item" data-cat="${esc(c)}" data-sub="${esc(s)}">${esc(s)}</a>`).join('')}
          </div>
        </div>`;
    }).join('');

    topNav.innerHTML = homeLink + shopLink + catLinks;
  }

  // Shop Filter Pills
  const pills = $('#filterPills');
  if (pills) {
    pills.innerHTML = cats.map(c => `
      <button type="button" class="cat-pill ${c === activeCategory && !activeSubcategory ? 'active' : ''}" data-cat="${esc(c)}">
        ${c === 'All' ? 'All Collections' : esc(c)}
      </button>
    `).join('');
  }

  // Collections Grid
  const colGrid = $('#collectionsGrid');
  if (colGrid) {
    colGrid.innerHTML = CATEGORIES.slice(0, 4).map(c => `
      <div class="col-card" data-cat="${esc(c.name)}">
        <img src="${esc(c.image)}" alt="${esc(c.name)}" class="col-card-bg" loading="lazy">
        <div class="col-card-overlay"></div>
        <div class="col-card-content">
          <h3>${esc(c.name)}</h3>
          <span>${esc(c.count || (c.subcategories ? c.subcategories.join(', ') : 'Collection'))}</span>
        </div>
      </div>
    `).join('');
  }

  // Footer Links
  const footCats = $('#footerCats');
  if (footCats) {
    footCats.innerHTML = CATEGORIES.slice(0, 6).map(c => `
      <li><a href="#shop" data-cat="${esc(c.name)}">${esc(c.name)}</a></li>
    `).join('');
  }
}

function renderProducts() {
  const q = ($('#productSearch') ? $('#productSearch').value : '').trim().toLowerCase();
  const filtered = productsList.filter(p => {
    const matchCat = (activeCategory === 'All' || p.category === activeCategory);
    const matchSub = (!activeSubcategory || p.subcategory === activeSubcategory);
    const matchQ = (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.subcategory && p.subcategory.toLowerCase().includes(q)));
    return matchCat && matchSub && matchQ;
  });

  const catTitle = $('#catalogTitle');
  if (catTitle) {
    if (activeSubcategory) {
      catTitle.textContent = `${activeCategory} › ${activeSubcategory}`;
    } else {
      catTitle.textContent = activeCategory === 'All' ? 'All Products' : activeCategory;
    }
  }

  const grid = $('#productsGrid');
  if (!grid) return;

  if (!filtered.length) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 48px 0; color: var(--ink-muted);">No products match your search. Try another category!</div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const hasDiscount = p.oldPrice && p.oldPrice > p.price;
    const pct = hasDiscount ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
    const isVideo = p.mediaType === 'video' || (typeof p.image === 'string' && (p.image.startsWith('data:video') || p.image.match(/\.(mp4|webm)($|\?)/i)));
    return `
      <article class="product-card" data-product-view="${esc(p.id)}" tabindex="0" role="link" aria-label="View ${esc(p.name)} details">
        <div class="product-thumb">
          ${isVideo ? `
            <video src="${esc(p.image)}" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;"></video>
          ` : `
            <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">
          `}
          <div class="badge-stack">
            ${p.badge ? `<span class="badge badge-sale">${esc(p.badge)}</span>` : ''}
            ${hasDiscount ? `<span class="badge badge-hot">-${pct}%</span>` : ''}
          </div>
        </div>
        <div class="product-details">
          <span class="product-cat">${esc(p.category)} ${p.subcategory ? '• ' + esc(p.subcategory) : ''}</span>
          <h3 class="product-title">${esc(p.name)}</h3>
          <div class="product-rating">
            ★★★★★ <span style="color: var(--ink-muted); font-size: 11px;">(${p.reviews || 24})</span>
          </div>
          <div class="product-price-row">
            <span class="curr-price">${formatMoney(p.price)}</span>
            ${hasDiscount ? `<span class="old-price">${formatMoney(p.oldPrice)}</span>` : ''}
            ${hasDiscount ? `<span class="save-badge">Save ${pct}%</span>` : ''}
          </div>
          <div class="product-card-actions">
            <button class="btn-add" data-add="${esc(p.id)}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Add to Cart
            </button>
            <button class="btn-quick-wa" data-wa-order="${esc(p.id)}" title="Order on WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
  renderHomeFeatured();
}

let currentDetailProductId = null;
let recommendationTimer = null;

function productCardMarkup(p, compact = false) {
  const hasDiscount = p.oldPrice && p.oldPrice > p.price;
  const pct = hasDiscount ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
  return `<article class="${compact ? 'recommend-product-card' : 'product-card'}" data-product-view="${esc(p.id)}" tabindex="0" role="link" aria-label="View ${esc(p.name)} details">
    <div class="${compact ? 'recommend-product-image' : 'product-thumb'}"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">${p.badge ? `<span class="recommend-badge">${esc(p.badge)}</span>` : ''}</div>
    <div class="${compact ? 'recommend-product-info' : 'product-details'}"><span class="product-cat">${esc(p.category)}</span><h3 class="product-title">${esc(p.name)}</h3><div class="product-rating">★★★★★ <span>(${p.reviews || 24})</span></div><div class="product-price-row"><span class="curr-price">${formatMoney(p.price)}</span>${hasDiscount ? `<span class="old-price">${formatMoney(p.oldPrice)}</span>` : ''}</div><button type="button" class="btn-add" data-view-add="${esc(p.id)}">Add to Cart</button></div>
  </article>`;
}

function renderHomeFeatured() {
  const grid = $('#homeFeaturedGrid');
  if (!grid) return;
  // Show a compact selection from different categories; the full catalogue lives on the Shop page.
  const picks = [];
  const seen = new Set();
  for (const product of productsList) {
    if (!seen.has(product.category)) {
      picks.push(product);
      seen.add(product.category);
    }
    if (picks.length >= 4) break;
  }
  grid.innerHTML = picks.map(p => productCardMarkup(p, false)).join('');
}

function openShopPage(category = 'All', subcategory = null) {
  document.body.classList.remove('product-page-open', 'checkout-page-open');
  document.body.classList.add('shop-page-open');
  activeCategory = category || 'All';
  activeSubcategory = subcategory || null;
  const search = $('#productSearch');
  if (search) search.value = '';
  renderNav();
  renderProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openProductPage(id) {
  const p = productsList.find(x => x.id === id);
  if (!p) return;
  currentDetailProductId = id;
  document.body.classList.remove('checkout-page-open');
  document.body.classList.add('shop-page-open', 'product-page-open');
  renderProductDetail();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderProductDetail() {
  const p = productsList.find(x => x.id === currentDetailProductId);
  const target = $('#productDetailContent');
  if (!p || !target) return;
  const hasDiscount = p.oldPrice && p.oldPrice > p.price;
  const pct = hasDiscount ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
  target.innerHTML = `<div class="product-detail-layout">
    <div class="product-detail-gallery"><div class="product-detail-main-image"><img src="${esc(p.image)}" alt="${esc(p.name)}"></div><div class="product-gallery-caption">${p.badge ? `<span class="detail-badge">${esc(p.badge)}</span>` : ''}<span>Product code: ${esc(p.id.toUpperCase())}</span></div></div>
    <div class="product-detail-info"><div class="detail-category">${esc(p.category)}${p.subcategory ? ' / ' + esc(p.subcategory) : ''}</div><h1>${esc(p.name)}</h1><div class="detail-rating"><span>★★★★★</span> ${Number(p.rating || 4.8).toFixed(1)} <span class="detail-reviews">(${p.reviews || 24} reviews)</span></div><div class="detail-price-row"><strong>${formatMoney(p.price)}</strong>${hasDiscount ? `<del>${formatMoney(p.oldPrice)}</del><span class="detail-discount">${pct}% OFF</span>` : ''}</div><p class="detail-description">${esc(p.description || 'A carefully selected product from Tryzn Store. Designed for everyday use with quality and value in mind.')}</p><div class="detail-stock-note">✓ ${p.stock > 0 ? 'Available to order' : 'Check availability'} <span>·</span> Cash on Delivery across Pakistan</div><div class="detail-benefits"><div><span>🚚</span><div><b>Delivery in 2–7 days</b><small>TCS, Leopards or PostEx</small></div></div><div><span>💵</span><div><b>Cash on Delivery</b><small>Pay when your parcel arrives</small></div></div><div><span>🔄</span><div><b>7-day easy returns</b><small>Contact support for assistance</small></div></div></div><div class="detail-actions"><button type="button" class="btn-primary" data-detail-add="${esc(p.id)}">Add to Cart</button><button type="button" class="btn-dark detail-buy-now" data-buy-now="${esc(p.id)}">Order Now</button></div><button type="button" class="detail-whatsapp" data-wa-order="${esc(p.id)}">Order or ask on WhatsApp</button></div>
  </div>
  <section class="product-reviews-section" aria-labelledby="customerReviewsHeading">
    <div class="reviews-section-heading"><div><p class="eyebrow">REAL FEEDBACK</p><h2 id="customerReviewsHeading">Customer Reviews</h2><p>Share your experience with this product, including photos or a video.</p></div><span class="reviews-count-pill" id="productReviewsCount">Loading reviews…</span></div>
    <div class="reviews-layout">
      <form class="review-form-card" id="productReviewForm">
        <h3>Write a review</h3><p class="review-form-intro">Tell other shoppers what you think.</p>
        <label for="reviewerName">Your name</label><input id="reviewerName" name="reviewerName" maxlength="70" required placeholder="Enter your name" autocomplete="name">
        <label for="reviewRating">Your rating</label><select id="reviewRating" name="reviewRating" required><option value="5">★★★★★ — Excellent</option><option value="4">★★★★☆ — Good</option><option value="3">★★★☆☆ — Average</option><option value="2">★★☆☆☆ — Poor</option><option value="1">★☆☆☆☆ — Very poor</option></select>
        <label for="reviewTitle">Review title</label><input id="reviewTitle" name="reviewTitle" maxlength="100" required placeholder="Summarize your experience">
        <label for="reviewText">Your review</label><textarea id="reviewText" name="reviewText" rows="4" maxlength="1500" required placeholder="What did you like or dislike?"></textarea>
        <label for="reviewMedia">Add photos or a video (optional)</label><input id="reviewMedia" name="reviewMedia" type="file" accept="image/*,video/*" multiple><small class="review-upload-help">Up to 3 files. Photos up to 3 MB each; videos up to 8 MB each.</small>
        <p class="review-form-feedback" id="reviewFormFeedback" aria-live="polite"></p>
        <button class="btn-primary review-submit-btn" type="submit">Submit Review</button>
      </form>
      <div class="customer-review-list" id="customerReviewList" aria-live="polite"><div class="reviews-empty-state">Loading customer reviews…</div></div>
    </div>
  </section>`;
  renderRecommendations();
  loadProductReviews(p.id);
  if (recommendationTimer) clearInterval(recommendationTimer);
  recommendationTimer = setInterval(() => {
    if (document.body.classList.contains('product-page-open')) renderRecommendations();
    else { clearInterval(recommendationTimer); recommendationTimer = null; }
  }, 9000);
}

/* Customer reviews: stored in IndexedDB on this browser. A shared backend is needed for cross-device reviews. */
let reviewDatabasePromise = null;
let reviewObjectUrls = [];
function openReviewDatabase() {
  if (reviewDatabasePromise) return reviewDatabasePromise;
  reviewDatabasePromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) { reject(new Error('This browser does not support local review storage.')); return; }
    const request = indexedDB.open('tryzn_customer_reviews', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('reviews')) {
        const store = db.createObjectStore('reviews', { keyPath: 'id', autoIncrement: true });
        store.createIndex('productId', 'productId', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not open review storage.'));
  });
  return reviewDatabasePromise;
}
async function getReviewsForProduct(productId) {
  const db = await openReviewDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('reviews', 'readonly');
    const req = tx.objectStore('reviews').index('productId').getAll(String(productId));
    req.onsuccess = () => resolve((req.result || []).sort((a, b) => b.createdAt - a.createdAt));
    req.onerror = () => reject(req.error || new Error('Could not load reviews.'));
  });
}
async function saveProductReview(review) {
  const db = await openReviewDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('reviews', 'readwrite');
    tx.objectStore('reviews').add(review);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('Could not save your review.'));
    tx.onabort = () => reject(tx.error || new Error('Could not save your review.'));
  });
}
function revokeReviewObjectUrls() {
  reviewObjectUrls.forEach(url => URL.revokeObjectURL(url));
  reviewObjectUrls = [];
}
async function loadProductReviews(productId) {
  const list = $('#customerReviewList');
  const count = $('#productReviewsCount');
  if (!list || !count) return;
  revokeReviewObjectUrls();
  list.innerHTML = '<div class="reviews-empty-state">Loading customer reviews…</div>';
  try {
    const reviews = await getReviewsForProduct(productId);
    if (currentDetailProductId !== productId) return;
    count.textContent = `${reviews.length} customer ${reviews.length === 1 ? 'review' : 'reviews'}`;
    if (!reviews.length) {
      list.innerHTML = '<div class="reviews-empty-state"><span>☆</span><h3>Be the first to review this product</h3><p>Your feedback helps other shoppers make a choice.</p></div>';
      return;
    }
    list.innerHTML = reviews.map(review => {
      const media = (review.media || []).map(item => {
        const url = URL.createObjectURL(item.blob);
        reviewObjectUrls.push(url);
        return item.type.startsWith('video/')
          ? `<video class="customer-review-media" src="${url}" controls preload="metadata" aria-label="Customer review video"></video>`
          : `<img class="customer-review-media" src="${url}" alt="Photo attached to customer review" loading="lazy">`;
      }).join('');
      return `<article class="customer-review-card"><div class="customer-review-top"><div class="review-avatar">${esc((review.name || 'C').trim().charAt(0).toUpperCase())}</div><div class="review-author-block"><strong>${esc(review.name)}</strong><span>${new Date(review.createdAt).toLocaleDateString()}</span></div><span class="customer-review-stars" aria-label="${review.rating} out of 5 stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span></div><h4>${esc(review.title)}</h4><p class="customer-review-text">${esc(review.text)}</p>${media ? `<div class="customer-review-media-grid">${media}</div>` : ''}</article>`;
    }).join('');
  } catch (error) {
    count.textContent = 'Reviews';
    list.innerHTML = '<div class="reviews-empty-state"><h3>Reviews could not be loaded</h3><p>Please check your browser storage settings and try again.</p></div>';
  }
}
document.addEventListener('submit', async event => {
  const form = event.target;
  if (!form.matches('#productReviewForm')) return;
  event.preventDefault();
  const feedback = $('#reviewFormFeedback');
  const submit = form.querySelector('[type="submit"]');
  const files = Array.from($('#reviewMedia')?.files || []);
  const name = ($('#reviewerName')?.value || '').trim();
  const title = ($('#reviewTitle')?.value || '').trim();
  const text = ($('#reviewText')?.value || '').trim();
  const rating = Number($('#reviewRating')?.value || 5);
  if (!currentDetailProductId || !name || !title || !text) {
    if (feedback) feedback.textContent = 'Please complete your name, title, and review.';
    return;
  }
  if (files.length > 3) {
    if (feedback) feedback.textContent = 'Please attach no more than 3 files.';
    return;
  }
  const media = [];
  for (const file of files) {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) { if (feedback) feedback.textContent = 'Only image or video files are supported.'; return; }
    const limit = isVideo ? 8 * 1024 * 1024 : 3 * 1024 * 1024;
    if (file.size > limit) {
      if (feedback) feedback.textContent = `${file.name} is too large. Photos must be up to 3 MB and videos up to 8 MB.`;
      return;
    }
    media.push({ name: file.name, type: file.type, blob: file });
  }
  if (submit) { submit.disabled = true; submit.textContent = 'Submitting…'; }
  if (feedback) feedback.textContent = 'Saving your review…';
  try {
    await saveProductReview({ productId: String(currentDetailProductId), name, title, text, rating, media, createdAt: Date.now() });
    form.reset();
    if (feedback) feedback.textContent = 'Thanks! Your review has been added on this device.';
    await loadProductReviews(currentDetailProductId);
    showToast('Your review was submitted.');
  } catch (error) {
    if (feedback) feedback.textContent = 'Your review could not be saved. Browser storage may be full or disabled.';
  } finally {
    if (submit) { submit.disabled = false; submit.textContent = 'Submit Review'; }
  }
});

function renderRecommendations() {
  const target = $('#productRecommendations');
  if (!target) return;
  const pool = productsList.filter(p => p.id !== currentDetailProductId);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  target.innerHTML = pool.slice(0, 4).map(p => productCardMarkup(p, true)).join('');
}

function openFullCheckout() {
  const items = getCartItems();
  if (!items.length) { showToast('Your cart is empty. Add a product first.', true); openDrawer('cart'); return; }
  closeDrawer();
  document.body.classList.remove('product-page-open');
  document.body.classList.add('shop-page-open', 'checkout-page-open');
  renderCheckoutPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCheckoutPage() {
  const saved = storage.get('tryzn_saved_address', {});
  const u = currentUser || {};
  const field = (id, value) => { const el = $('#' + id); if (el && value && !el.value) el.value = value; };
  field('checkoutFullName', saved.name || u.name || '');
  field('checkoutPhone', saved.phone || u.phone || '');
  field('checkoutStreet', saved.street || '');
  field('checkoutLocality', saved.locality || '');
  field('checkoutProvince', saved.province || '');
  field('checkoutCity', saved.city || u.city || '');
  field('checkoutArea', saved.area || '');
  field('checkoutAddress', saved.notes || u.address || '');
  if (saved.label) { const radio = document.querySelector(`input[name="checkoutLabel"][value="${saved.label}"]`); if (radio) radio.checked = true; }
  const items = getCartItems();
  const totals = getTotals();
  const packageTarget = $('#checkoutPackageItems');
  if (packageTarget) packageTarget.innerHTML = items.length ? items.map(({ product: p, qty }) => `<div class="checkout-package-item"><img src="${esc(p.image)}" alt="${esc(p.name)}"><div class="checkout-package-product"><strong>${esc(p.name)}</strong><span>${esc(p.category)}${p.subcategory ? ' · ' + esc(p.subcategory) : ''}</span><small>Qty: <b>${qty}</b></small></div><div class="checkout-package-price"><strong>${formatMoney(p.price * qty)}</strong>${p.oldPrice > p.price ? `<del>${formatMoney(p.oldPrice * qty)}</del>` : ''}</div></div>`).join('') : '<p>Your cart is empty.</p>';
  const totalsTarget = $('#checkoutTotals');
  if (totalsTarget) totalsTarget.innerHTML = `<div><span>Items Total (${totals.count} ${totals.count === 1 ? 'item' : 'items'})</span><strong>${formatMoney(totals.subtotal)}</strong></div>${totals.discount ? `<div><span>Promo discount (${esc(totals.promo.code)} · ${totals.promo.percent}%)</span><strong>−${formatMoney(totals.discount)}</strong></div>` : ''}<div><span>Delivery Fee</span><strong>${totals.isFree ? '<em>FREE</em>' : formatMoney(totals.shipping)}</strong></div><div class="checkout-grand-total"><span>Total <small>VAT included, where applicable</small></span><strong>${formatMoney(totals.total)}</strong></div>`;
  const promoInput = $('#checkoutPromoCode');
  if (promoInput && appliedPromoCode && !promoInput.value) promoInput.value = appliedPromoCode;
  const feedback = $('#checkoutPromoFeedback');
  if (feedback && totals.promo && totals.discount) { feedback.classList.remove('is-error'); feedback.textContent = `${totals.promo.code} applied — you save ${formatMoney(totals.discount)}.`; }
  else if (feedback && appliedPromoCode && !totals.discount) { feedback.classList.add('is-error'); feedback.textContent = 'This code does not apply to the products in your cart.'; }
}

function saveCheckoutAddress() {
  const get = id => ($('#' + id)?.value || '').trim();
  const label = document.querySelector('input[name="checkoutLabel"]:checked')?.value || 'HOME';
  const saved = { name: get('checkoutFullName'), phone: get('checkoutPhone'), street: get('checkoutStreet'), locality: get('checkoutLocality'), province: get('checkoutProvince'), city: get('checkoutCity'), area: get('checkoutArea'), notes: get('checkoutAddress'), label };
  storage.set('tryzn_saved_address', saved);
  const note = $('#saveAddressNote');
  if (note) note.textContent = '✓ Delivery details saved on this device.';
  showToast('Delivery address saved on this device.');
}

function getCartItems() {
  return Object.entries(cart)
    .map(([id, qty]) => ({ product: productsList.find(p => p.id === id), qty }))
    .filter(i => i.product && i.qty > 0);
}

function getTotals() {
  const items = getCartItems();
  const subtotal = items.reduce((acc, i) => acc + (i.product.price * i.qty), 0);
  const isFree = subtotal >= CFG.freeShippingOver || subtotal === 0;
  const shipping = isFree ? 0 : CFG.shippingFee;
  const promo = appliedPromoCode ? promoCodes.find(c => c.code === appliedPromoCode && c.active !== false) : null;
  const eligibleSubtotal = promo ? items.reduce((sum, i) => {
    const eligible = (!promo.category || i.product.category === promo.category) && (!promo.productId || i.product.id === promo.productId);
    return sum + (eligible ? i.product.price * i.qty : 0);
  }, 0) : 0;
  const discount = promo && eligibleSubtotal > 0 ? Math.round(eligibleSubtotal * promo.percent / 100) : 0;
  return { subtotal, discount, promo, shipping, total: Math.max(0, subtotal - discount) + shipping, isFree, count: items.reduce((acc, i) => acc + i.qty, 0) };
}

function updateCartBadge() {
  const { count } = getTotals();
  if ($('#cartBadge')) $('#cartBadge').textContent = count;
}

function modifyCart(id, delta) {
  cart[id] = Math.max(0, (cart[id] || 0) + delta);
  if (!cart[id]) delete cart[id];
  storage.set('tryzn_cart', cart);
  updateCartBadge();
  renderDrawer();
}

function removeCartItem(id) {
  delete cart[id];
  storage.set('tryzn_cart', cart);
  updateCartBadge();
  renderDrawer();
}

function renderDrawer() {
  const dBody = $('#drawerBody');
  const dFoot = $('#drawerFooter');
  const dHead = $('#drawerHeading');
  if (!dBody || !dFoot) return;

  const items = getCartItems();
  const totals = getTotals();

  if (drawerView === 'checkout') {
    dHead.innerHTML = `<span>Delivery & Checkout (COD Pakistan)</span>`;
    const u = currentUser || {};
    dBody.innerHTML = `
      <div style="background: var(--accent-light); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 14px; font-size: 12.5px;">
        💵 <b>Cash On Delivery:</b> Zero advance payment. Pay the rider upon parcel inspection at your doorstep.
      </div>
      <div class="form-group">
        <label for="uName">Full Name *</label>
        <input type="text" id="uName" value="${esc(u.name || '')}" placeholder="e.g. Ali Ahmed">
      </div>
      <div class="form-group">
        <label for="uPhone">Mobile / WhatsApp Number *</label>
        <input type="tel" id="uPhone" value="${esc(u.phone || '')}" placeholder="0300 1234567">
      </div>
      <div class="form-group">
        <label for="uCity">City *</label>
        <select id="uCity">${PK_CITIES.map(c => `<option value="${esc(c)}" ${u.city === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>
      </div>
      <div class="form-group">
        <label for="uAddress">Complete Delivery Address *</label>
        <textarea id="uAddress" rows="2" placeholder="House #, Street #, Sector / Area">${esc(u.address || '')}</textarea>
      </div>
      <div class="form-error" id="checkoutErr"></div>
    `;
    dFoot.innerHTML = `
      <div class="price-row total-row"><span>Total Payable (COD)</span><span>${formatMoney(totals.total)}</span></div>
      <button class="btn-block btn-dark" id="submitOrderBtn" style="margin-top: 10px;">Place Order</button>
      <button class="btn-block btn-text" id="backToCartBtn">Back to Cart</button>
    `;
    return;
  }

  // Cart View
  dHead.innerHTML = `<span>Your Shopping Cart</span>`;
  if (!items.length) {
    dBody.innerHTML = `<div style="text-align: center; padding: 40px 0; color: var(--ink-muted);">Your shopping cart is currently empty.</div>`;
    dFoot.innerHTML = `<button class="btn-block btn-dark" id="browseBtn">Shop Products</button>`;
    return;
  }

  // Free delivery progress indicator
  const freeOver = CFG.freeShippingOver;
  const away = Math.max(0, freeOver - totals.subtotal);
  const pct = Math.min(100, Math.round((totals.subtotal / freeOver) * 100));

  dBody.innerHTML = `
    <div style="background: var(--accent-light); border: 1px solid rgba(5, 150, 105, 0.2); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 14px; font-size: 12.5px;">
      ${totals.isFree 
        ? `🎉 <b>You unlocked FREE Delivery!</b> (Orders over Rs. 4,999)`
        : `🚚 Add <b>${formatMoney(away)}</b> more to unlock <b>FREE Delivery</b> across Pakistan!`
      }
      <div style="height: 6px; background: #E2E8F0; border-radius: 99px; overflow: hidden; margin-top: 8px;">
        <div style="width: ${pct}%; height: 100%; background: var(--accent); transition: width 0.3s ease;"></div>
      </div>
    </div>
  ` + items.map(({ product: p, qty }) => `
    <div class="cart-item">
      <div class="cart-item-thumb"><img src="${esc(p.image)}" alt="${esc(p.name)}"></div>
      <div>
        <h4 style="font-size: 13.5px; font-weight: 600;">${esc(p.name)}</h4>
        <div style="font-size: 13px; font-weight: 700; color: var(--primary);">${formatMoney(p.price)}</div>
        <div class="qty-controller">
          <button class="qty-btn" data-dec="${esc(p.id)}">-</button>
          <span class="qty-val">${qty}</span>
          <button class="qty-btn" data-inc="${esc(p.id)}">+</button>
        </div>
      </div>
      <button class="close-btn" data-del="${esc(p.id)}" title="Remove">&times;</button>
    </div>
  `).join('');

  dFoot.innerHTML = `
    <div class="price-row"><span>Subtotal</span><span>${formatMoney(totals.subtotal)}</span></div>
    <div class="price-row"><span>Delivery (Nationwide TCS/Leopards)</span><span>${totals.isFree ? '<b style="color:var(--accent);">FREE</b>' : formatMoney(totals.shipping)}</span></div>
    <div class="price-row total-row"><span>Total</span><span>${formatMoney(totals.total)}</span></div>
    <button class="btn-block btn-dark" id="gotoCheckoutBtn" style="margin-top: 10px;">Proceed to Checkout (COD)</button>
    <button class="btn-block btn-wa" id="directWaCheckoutBtn" style="margin-top: 8px;">Order via WhatsApp (COD)</button>
  `;
}

function openDrawer(view = 'cart') {
  drawerView = view;
  renderDrawer();
  document.body.classList.add('drawer-open');
}
function closeDrawer() { document.body.classList.remove('drawer-open'); }
function closeModal() { document.body.classList.remove('modal-open'); }

function handleCheckoutSubmit(mode = 'drawer') {
  const full = mode === 'full';
  const val = id => (($( '#' + id) || {}).value || '').trim();
  const name = val(full ? 'checkoutFullName' : 'uName');
  const phone = val(full ? 'checkoutPhone' : 'uPhone');
  const city = val(full ? 'checkoutCity' : 'uCity');
  const err = $(full ? '#fullCheckoutError' : '#checkoutErr');
  const street = full ? val('checkoutStreet') : '';
  const locality = full ? val('checkoutLocality') : '';
  const province = full ? val('checkoutProvince') : '';
  const area = full ? val('checkoutArea') : '';
  const notes = val(full ? 'checkoutAddress' : 'uAddress');
  const label = full ? (document.querySelector('input[name="checkoutLabel"]:checked')?.value || 'HOME') : '';
  const address = full ? [street, locality, area, notes, label ? `Address label: ${label}` : '', province].filter(Boolean).join(', ') : notes;
  if (err) err.textContent = '';
  if (name.length < 2) { if (err) err.textContent = 'Please enter your full name.'; return; }
  if (phone.replace(/\D/g, '').length < 10) { if (err) err.textContent = 'Please enter a valid mobile number.'; return; }
  if (!city) { if (err) err.textContent = 'Please choose your city.'; return; }
  if (full && (!province || street.length < 3 || locality.length < 2)) { if (err) err.textContent = 'Please complete your street address, locality, province and city.'; return; }
  if (address.length < 5) { if (err) err.textContent = 'Please enter your complete address.'; return; }

  const totals = getTotals();
  const items = getCartItems();
  if (!items.length) { if (err) err.textContent = 'Your cart is empty. Add a product before placing an order.'; return; }
  const orderId = 'TZ-' + Math.floor(100000 + Math.random() * 900000);
  const order = {
    id: orderId,
    time: new Date().toISOString().replace('T', ' ').slice(0, 16),
    name, phone, city, province, area, street, locality, address, addressLabel: label,
    items: items.map(i => ({ id: i.product.id, name: i.product.name, qty: i.qty, price: i.product.price })),
    subtotal: totals.subtotal, discount: totals.discount || 0, promoCode: totals.promo?.code || '', shipping: totals.shipping, total: totals.total, status: 'New'
  };
  ordersList.unshift(order);
  storage.set('tryzn_orders', ordersList);
  writeSheetsAction({
    action: 'createOrder',
    order: {
      order_id: order.id,
      customer_name: order.name,
      phone: order.phone,
      email: currentUser && currentUser.email ? currentUser.email : '',
      city: order.city,
      address: order.address,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      promo_code: order.promoCode,
      shipping_fee: order.shipping,
      total: order.total,
      payment_method: 'Cash on Delivery',
      status: order.status,
      notes: ''
    }
  }).then(() => console.log('Order synced to Google Sheets:', order.id))
    .catch(error => console.error('Order remains in local storage; Google Sheets sync failed:', error));
  lastPlacedOrder = order;
  if (full) saveCheckoutAddress();
  cart = {};
  appliedPromoCode = null;
  storage.set('tryzn_applied_promo', null);
  storage.set('tryzn_cart', cart);
  updateCartBadge();
  closeDrawer();
  document.body.classList.remove('checkout-page-open', 'product-page-open');
  renderAdmin();
  showToast('Order #' + orderId + ' received! Opening WhatsApp confirmation...');
  const waMsg = buildWhatsAppMessage(order);
  setTimeout(() => { window.open('https://wa.me/' + CFG.wa + '?text=' + encodeURIComponent(waMsg), '_blank'); }, 700);
}

function buildWhatsAppMessage(order) {
  const isFree = (order.subtotal || order.total) >= 4999;
  return `*🇵🇰 NEW COD ORDER - TRYZN STORE PAKISTAN*
Order ID: ${order.id}
Customer: ${order.name}
Phone: ${order.phone}
City: ${order.city}
Province: ${order.province || 'N/A'}
Area: ${order.area || 'N/A'}
Address label: ${order.addressLabel || 'N/A'}
Delivery Address: ${order.address}

*Ordered Items:*
${order.items.map(i => `• ${i.qty}x ${i.name} (${formatMoney(i.price)})`).join('\n')}

Subtotal: ${formatMoney(order.subtotal || order.total)}
${order.discount ? `Promo Code (${order.promoCode}): -${formatMoney(order.discount)}\n` : ''}Delivery Fee: ${order.shipping === 0 ? 'FREE' : formatMoney(order.shipping || 0)}
*Total (Cash On Delivery):* ${formatMoney(order.total)}
${isFree ? '✅ *FREE DELIVERY APPLIED (Above Rs. 4,999)*' : '🚚 Courier Fee: Rs. 200 (Nationwide TCS / Leopards)'}

Please confirm my order and share the TCS / Leopards tracking number when dispatched. Shukriya!`;
}

function updateUserUI() {
  const dot = $('#userIndicatorDot');
  if (dot) dot.style.display = (currentUser || isAdminLoggedIn) ? 'block' : 'none';

  const tabs = $('#authLoggedOutTabs');
  const signInPane = $('#signInPane');
  const regPane = $('#registerPane');
  const custView = $('#customerLoggedInView');
  const admView = $('#adminLoggedInView');

  if (isAdminLoggedIn) {
    if (tabs) tabs.style.display = 'none';
    if (signInPane) signInPane.style.display = 'none';
    if (regPane) regPane.style.display = 'none';
    if (custView) custView.style.display = 'none';
    if (admView) admView.style.display = 'block';
  } else if (currentUser) {
    if (tabs) tabs.style.display = 'none';
    if (signInPane) signInPane.style.display = 'none';
    if (regPane) regPane.style.display = 'none';
    if (admView) admView.style.display = 'none';
    if (custView) {
      custView.style.display = 'block';
      $('#loggedCustName').textContent = 'Hello, ' + currentUser.name;
      $('#loggedCustEmail').textContent = currentUser.email;
    }
  } else {
    if (tabs) tabs.style.display = 'grid';
    if (custView) custView.style.display = 'none';
    if (admView) admView.style.display = 'none';
    if ($('#tabRegisterBtn') && $('#tabRegisterBtn').classList.contains('active')) {
      if (signInPane) signInPane.style.display = 'none';
      if (regPane) regPane.style.display = 'block';
    } else {
      if (signInPane) signInPane.style.display = 'block';
      if (regPane) regPane.style.display = 'none';
    }
  }
}

async function handleUnifiedSignIn() {
  const email = ($('#loginEmail').value || '').trim();
  const pass = $('#loginPass').value || '';
  const err = $('#signInError');
  const button = $('#signInSubmitBtn');

  if (!email || !pass) {
    err.textContent = 'Please enter both your email address and password.';
    return;
  }

  err.textContent = '';
  if (button) button.disabled = true;

  try {
    // The normal sign-in form also authenticates the store administrator.
    let adminResult = null;
    let adminErrorMessage = '';
    try {
      adminResult = await writeSheetsAction({
        action: 'adminLogin',
        email: email.toLowerCase(),
        password: pass
      });
    } catch (adminError) {
      // Preserve the server response so an admin can see configuration or credential errors.
      adminErrorMessage = adminError && adminError.message ? adminError.message : 'Admin sign-in request failed.';
    }

    if (adminResult && adminResult.success && adminResult.admin) {
      adminCredentials = { email: email.toLowerCase(), password: pass };
      isAdminLoggedIn = true;
      currentUser = null;
      storage.set('tryzn_user', null);
      storage.set('tryzn_is_admin', false);
      updateUserUI();
      closeAuth();

      try {
        await refreshAdminOrders();
        openAdminModal();
        showToast('Admin signed in. Orders are connected to Google Sheets.');
      } catch (adminError) {
        isAdminLoggedIn = false;
        adminCredentials = null;
        updateUserUI();
        openAuth('signin');
        err.textContent = adminError.message || 'Admin signed in, but the orders could not be loaded. Please try again.';
      }
      return;
    }

    const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      err.textContent = adminErrorMessage || 'No account found with this email. Please check your details or create an account.';
      return;
    }

    if (found.pass !== pass) {
      err.textContent = 'Incorrect password. Please verify your credentials and try again.';
      return;
    }

    currentUser = found;
    storage.set('tryzn_user', currentUser);
    updateUserUI();
    closeAuth();
    showToast('Welcome back, ' + (currentUser.name || 'Customer') + '!');
  } finally {
    if (button) button.disabled = false;
  }
}

function handleCustomerRegister() {
  const name = ($('#regName').value || '').trim();
  const email = ($('#regEmail').value || '').trim();
  const pass = ($('#regPass').value || '').trim();
  const phone = ($('#regPhone').value || '').trim();
  const city = ($('#regCity').value || '').trim();
  const address = ($('#regAddress').value || '').trim();
  const err = $('#registerError');

  if (name.length < 2) { err.textContent = 'Please enter your full legal name.'; return; }
  if (!email.includes('@') || !email.includes('.')) { err.textContent = 'Please enter a valid email address.'; return; }
  if (pass.length < 6) { err.textContent = 'Password must be at least 6 characters long.'; return; }
  if (phone.length < 10) { err.textContent = 'Please enter a valid mobile number (e.g. 0300 1234567).'; return; }
  if (!city) { err.textContent = 'Please select your delivery city.'; return; }
  if (address.length < 6) { err.textContent = 'Please provide your full physical delivery address.'; return; }

  const existing = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    err.textContent = 'An account already exists with this email address. Please switch to "Sign In".';
    return;
  }

  err.textContent = '';
  // Passwords stay in this browser only; never send them to Google Sheets.
  currentUser = { name, email, pass, phone, city, address };
  registeredUsers.push(currentUser);
  storage.set('tryzn_registered_users', registeredUsers);
  storage.set('tryzn_user', currentUser);

  writeSheetsAction({
    action: 'upsertCustomer',
    customer: { full_name: name, email, phone, default_city: city, default_address: address, active: true }
  }).then(() => console.log('Customer profile synced to Google Sheets:', email))
    .catch(error => console.error('Customer profile remains local; Google Sheets sync failed:', error));

  updateUserUI();
  closeAuth();
  showToast('Account successfully created and signed in!');
}

function renderAdminCategories() {
  const container = $('#adminCategoriesList');
  if (!container) return;

  if (!CATEGORIES.length) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--ink-muted); padding: 30px;">No categories found. Create your first category above!</div>`;
    return;
  }

  container.innerHTML = CATEGORIES.map((c, idx) => {
    const subList = c.subcategories || [];
    const subBadges = subList.length 
      ? subList.map(sub => `
          <span style="display: inline-flex; align-items: center; gap: 5px; background: var(--surface-subtle); border: 1px solid var(--line); border-radius: 99px; padding: 3px 10px; font-size: 11.5px; font-weight: 600; color: var(--ink);">
            ${esc(sub)}
            <button type="button" data-del-sub="${esc(sub)}" data-parent-cat="${esc(c.name)}" style="background: none; border: 0; color: var(--danger); font-size: 12px; cursor: pointer; padding: 0 2px; line-height: 1;" title="Remove subcategory">&times;</button>
          </span>
        `).join('')
      : `<span style="font-size: 12px; color: var(--ink-muted); font-style: italic;">No subcategories yet</span>`;

    return `
      <div style="background: #FFFFFF; border: 1px solid var(--line); border-radius: var(--radius); padding: 18px; display: flex; flex-direction: column; gap: 12px; box-shadow: var(--card-shadow);">
        <div style="display: flex; gap: 12px; align-items: center;">
          <img src="${esc(c.image)}" alt="${esc(c.name)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--line); flex-shrink: 0;">
          <div style="flex: 1; min-width: 0;">
            <h4 style="font-size: 16px; font-weight: 700; color: var(--primary); margin-bottom: 2px;">${esc(c.name)}</h4>
            <span style="font-size: 12px; color: var(--ink-muted);">${subList.length} Subcategories</span>
          </div>
          <button type="button" class="btn-outline" data-del-cat="${esc(c.name)}" style="color: var(--danger); border-color: rgba(220,38,38,0.3); padding: 6px 10px; font-size: 11.5px; border-radius: 4px;" title="Delete this entire category">
            Delete
          </button>
        </div>

        <div style="border-top: 1px solid var(--line); padding-top: 10px;">
          <label style="font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ink-secondary); display: block; margin-bottom: 6px;">Subcategories</label>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;">
            ${subBadges}
          </div>
          <div style="display: flex; gap: 6px;">
            <input type="text" id="newSubInput_${idx}" placeholder="Add subcategory (e.g. Polos)" style="flex: 1; padding: 6px 10px; font-size: 12px; border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--surface);">
            <button type="button" class="btn-primary" data-add-sub-cat="${esc(c.name)}" data-input-id="newSubInput_${idx}" style="padding: 6px 12px; font-size: 12px;">+ Add</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Synchronize category dropdowns
  const prodCatSelect = $('#newProdCat');
  if (prodCatSelect) {
    const currVal = prodCatSelect.value;
    prodCatSelect.innerHTML = CATEGORIES.map(c => `<option value="${esc(c.name)}" ${c.name === currVal ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
  }
  const catPhotoSelect = $('#catPhotoSelect');
  if (catPhotoSelect) {
    const currCat = catPhotoSelect.value;
    catPhotoSelect.innerHTML = CATEGORIES.map(c => `<option value="${esc(c.name)}" ${c.name === currCat ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
  }
}

function refreshDiscountProductOptions() {
  const category = $('#discCategoryFilter')?.value || '';
  const query = ($('#discProductSearch')?.value || '').trim().toLowerCase();
  const select = $('#discProdSelect');
  if (select) {
    const filtered = productsList.filter(p => (!category || p.category === category) && (!query || p.name.toLowerCase().includes(query)));
    const current = select.value;
    select.innerHTML = filtered.map(p => `<option value="${esc(p.id)}">${esc(p.name)} — ${formatMoney(p.price)}</option>`).join('') || '<option value="">No matching products</option>';
    if (filtered.some(p => p.id === current)) select.value = current;
  }
  const promoCategory = $('#promoAdminCategory')?.value || '';
  const promoQuery = ($('#promoAdminProductSearch')?.value || '').trim().toLowerCase();
  const promoSelect = $('#promoAdminProduct');
  if (promoSelect) {
    const current = promoSelect.value;
    const filtered = productsList.filter(p => (!promoCategory || p.category === promoCategory) && (!promoQuery || p.name.toLowerCase().includes(promoQuery)));
    promoSelect.innerHTML = '<option value="">All products</option>' + filtered.map(p => `<option value="${esc(p.id)}">${esc(p.name)} — ${esc(p.category)}</option>`).join('');
    if (filtered.some(p => p.id === current)) promoSelect.value = current;
  }
}

function renderPromoCodes() {
  const target = $('#adminPromoCodesList');
  if (!target) return;
  if (!promoCodes.length) { target.innerHTML = '<p class="muted">No promo codes created yet.</p>'; return; }
  target.innerHTML = `<div class="promo-table-wrap"><table class="promo-table"><thead><tr><th>Code</th><th>Discount</th><th>Applies to</th><th>Created</th><th>Action</th></tr></thead><tbody>${promoCodes.map(c => {
    const product = c.productId ? productsList.find(p => p.id === c.productId) : null;
    const applies = product ? product.name : (c.category ? `${c.category} category` : 'All products');
    return `<tr><td><span class="promo-code-chip">${esc(c.code)}</span></td><td><b>${Number(c.percent)}%</b></td><td>${esc(applies)}</td><td>${esc(c.createdAt || '—')}</td><td><button type="button" class="promo-delete-btn" data-delete-promo="${esc(c.code)}">Delete</button></td></tr>`;
  }).join('')}</tbody></table></div>`;
}

function renderAdmin() {
  $('#admTotalOrders').textContent = ordersList.length;
  const rev = ordersList.reduce((acc, o) => acc + (o.total || 0), 0);
  $('#admTotalRev').textContent = formatMoney(rev);
  const pendingCount = ordersList.filter(o => o.status === 'New').length;
  $('#admPendingOrders').textContent = pendingCount;
  if ($('#sidePendingCount')) $('#sidePendingCount').textContent = pendingCount;
  $('#admDispatchedOrders').textContent = ordersList.filter(o => o.status === 'Dispatched').length;

  renderAdminCategories();

  const tbody = $('#adminOrdersTbody');
  if (tbody) {
    if (!ordersList.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--ink-muted); padding: 30px;">No orders recorded yet.</td></tr>`;
    } else {
      tbody.innerHTML = ordersList.map(o => {
        const itemsSummary = o.items.map(i => `${i.qty}x ${esc(i.name)}`).join('<br>');
        return `
          <tr>
            <td><b>${esc(o.id)}</b><br><small style="color: var(--ink-muted);">${esc(o.time)}</small></td>
            <td><b>${esc(o.name)}</b></td>
            <td><a href="https://wa.me/${esc(o.phone.replace(/[^0-9]/g, ''))}" target="_blank" style="color: var(--accent); font-weight: 600;">${esc(o.phone)}</a></td>
            <td><b>${esc(o.city)}</b><br><small style="color: var(--ink-muted);">${esc(o.address)}</small></td>
            <td style="font-size: 12px;">${itemsSummary}</td>
            <td><b>${formatMoney(o.total)}</b></td>
            <td>
              <select data-order-status="${esc(o.id)}" style="padding: 6px 8px; font-size: 12px; border-radius: 4px; border: 1px solid var(--line);">
                <option value="New" ${o.status === 'New' ? 'selected' : ''}>New (Pending)</option>
                <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="Dispatched" ${o.status === 'Dispatched' ? 'selected' : ''}>Dispatched</option>
                <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
            </td>
            <td>
              <button class="cat-pill" data-msg-cust="${esc(o.id)}" style="padding: 4px 10px; font-size: 11px;">WhatsApp</button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  const pbody = $('#adminProductsTbody');
  if (pbody) {
    pbody.innerHTML = productsList.map(p => {
      const isVideo = p.mediaType === 'video' || (typeof p.image === 'string' && (p.image.startsWith('data:video') || p.image.match(/\.(mp4|webm)($|\?)/i)));
      return `
      <tr>
        <td style="text-align: center;"><input type="checkbox" class="prod-chk" data-chk-id="${esc(p.id)}"></td>
        <td>
          ${isVideo ? `
            <video src="${esc(p.image)}" autoplay loop muted playsinline style="width: 44px; height: 50px; object-fit: cover; border-radius: 4px;"></video>
          ` : `
            <img src="${esc(p.image)}" alt="${esc(p.name)}" style="width: 44px; height: 50px; object-fit: cover; border-radius: 4px;">
          `}
        </td>
        <td><b>${esc(p.name)}</b>${p.badge ? `<br><small class="save-badge" style="font-size: 10px;">${esc(p.badge)}</small>` : ''}</td>
        <td><b>${formatMoney(p.price)}</b></td>
        <td>
          <select data-move-cat="${esc(p.id)}" style="padding: 4px 8px; font-size: 12px; border-radius: 4px; border: 1px solid var(--line); font-weight: 600;">
            ${CATEGORIES.map(c => `<option value="${esc(c.name)}" ${p.category === c.name ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
          </select>
        </td>
        <td>${p.stock}</td>
        <td>
          <button class="btn-outline" data-del-prod="${esc(p.id)}" style="color: var(--danger); border-color: var(--danger); padding: 4px 10px; font-size: 11.5px; border-radius: 4px;">Delete</button>
        </td>
      </tr>
    `}).join('');
    updateBulkDelCount();
  }

  const categoryOptions = '<option value="">All categories</option>' + CATEGORIES.map(c => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
  ['discCategoryFilter', 'promoAdminCategory'].forEach(id => {
    const el = $('#' + id);
    if (el) { const previous = el.value; el.innerHTML = categoryOptions; if ([...el.options].some(o => o.value === previous)) el.value = previous; }
  });
  refreshDiscountProductOptions();
  renderPromoCodes();

  if ($('#editHeroTitle')) $('#editHeroTitle').value = $('#heroHeading').textContent;
  if ($('#editHeroSub')) $('#editHeroSub').value = $('#heroSubheading').textContent;
  if ($('#editHeroImg')) {
    $('#editHeroImg').value = $('#heroMainImg').src;
    if ($('#adminHeroImgPreview')) $('#adminHeroImgPreview').src = $('#heroMainImg').src;
  }
}

function updateCategoryPhotoPreview() {
  const selCat = $('#catPhotoSelect').value;
  const catObj = CATEGORIES.find(c => c.name === selCat);
  if (catObj) {
    if ($('#adminCatPreview')) $('#adminCatPreview').src = catObj.image;
    if ($('#editCatImgUrl')) $('#editCatImgUrl').value = catObj.image;
  }
}

function updateBulkDelCount() {
  const count = document.querySelectorAll('.prod-chk:checked').length;
  if ($('#bulkDelCount')) $('#bulkDelCount').textContent = count;
}

let adminCredentials = null; // Keep admin credentials in memory only; never store them in localStorage.

async function handleAdminLogin() {
  const email = ($('#adminLoginEmail').value || '').trim().toLowerCase();
  const password = $('#adminLoginPass').value || '';
  const err = $('#adminLoginError');
  if (err) err.textContent = '';
  if (!email || !password) {
    if (err) err.textContent = 'Enter your admin email and password.';
    return;
  }
  const button = $('#adminLoginBtn');
  if (button) button.disabled = true;
  try {
    const result = await writeSheetsAction({action:'adminLogin', email:email, password:password});
    if (!result || !result.success || !result.admin) throw new Error('Admin login was not accepted.');
    adminCredentials = {email:email, password:password};
    isAdminLoggedIn = true;
    currentUser = null;
    storage.set('tryzn_user', null);
    storage.set('tryzn_is_admin', false);
    updateUserUI();
    closeAuth();
    await refreshAdminOrders();
    openAdminModal();
    showToast('Admin signed in. Orders are connected to Google Sheets.');
  } catch (error) {
    adminCredentials = null;
    isAdminLoggedIn = false;
    if (err) err.textContent = error.message || 'Admin login failed. Check credentials and Apps Script settings.';
  } finally {
    if (button) button.disabled = false;
  }
}

async function refreshAdminOrders() {
  if (!adminCredentials) throw new Error('Admin session is missing. Sign in again.');
  const data = await writeSheetsAction({action:'adminGetOrders', email:adminCredentials.email, password:adminCredentials.password});
  if (!data || !Array.isArray(data.orders)) throw new Error('The server returned invalid order data.');
  ordersList = data.orders.map(o => ({
    id:String(o.id || ''), time:String(o.time || ''), name:String(o.name || ''),
    phone:String(o.phone || ''), email:String(o.email || ''), city:String(o.city || ''),
    address:String(o.address || ''), items:Array.isArray(o.items) ? o.items : [],
    subtotal:Number(o.subtotal)||0, discount:Number(o.discount)||0,
    shipping:Number(o.shipping)||0, total:Number(o.total)||0,
    status:String(o.status || 'New'), tracking_number:String(o.tracking_number || ''), notes:String(o.notes || '')
  }));
  storage.set('tryzn_orders', ordersList);
  return ordersList;
}

async function openAdminModal() {
  if (!isAdminLoggedIn || !adminCredentials) { openAuth('signin'); return; }
  try {
    await refreshAdminOrders();
    renderAdmin();
    updateCategoryPhotoPreview();
    document.body.classList.add('admin-open');
  } catch (error) {
    isAdminLoggedIn = false;
    adminCredentials = null;
    updateUserUI();
    openAuth('signin');
    showToast(error.message || 'Admin session could not be verified.', true);
  }
}
function closeAdminModal() { document.body.classList.remove('admin-open'); }
function openAuth(tab = 'signin') {
  if (tab === 'register') {
    $('#tabSignInBtn').classList.remove('active');
    $('#tabRegisterBtn').classList.add('active');
    $('#signInPane').style.display = 'none';
    $('#registerPane').style.display = 'block';
  } else {
    $('#tabRegisterBtn').classList.remove('active');
    $('#tabSignInBtn').classList.add('active');
    $('#registerPane').style.display = 'none';
    $('#signInPane').style.display = 'block';
  }
  updateUserUI();
  document.body.classList.add('auth-open');
}
function closeAuth() { document.body.classList.remove('auth-open'); }

document.addEventListener('click', e => {
  const t = e.target.closest('[data-cat], [data-sub], [data-add], [data-product-view], [data-view-add], [data-detail-add], [data-buy-now], [data-wa-order], [data-inc], [data-dec], [data-del], [data-msg-cust], [data-atab], [data-del-prod], [data-del-cat], [data-del-sub], [data-add-sub-cat], #cartBtn, #closeDrawerBtn, #drawerOverlay, #closeModalBtn, #modalOverlay, #openAuthBtn, #authModal, #closeAdminBtn, #heroShopBtn, #heroWhatsAppBtn, #floatingWaBtn, #gotoCheckoutBtn, #directWaCheckoutBtn, #backToCartBtn, #submitOrderBtn, #browseBtn, #footerPortalBtn, #brandHomeBtn, #tabSignInBtn, #tabRegisterBtn, #signInSubmitBtn, #adminLoginBtn, #regSubmitBtn, #userLogoutBtn, #adminLogoutAuthBtn, #adminLogoutBtn, #toggleAddProdFormBtn, #toggleAddCatFormBtn, #saveNewProductBtn, #saveNewCategoryBtn, #bulkDeleteProdsBtn, #applyDiscountBtn, #createPromoCodeBtn, [data-delete-promo], #saveMediaChangesBtn, #openAdminModalFromAuthBtn, #saveCatImgBtn, #productBackBtn, #checkoutBackBtn, #placeFullOrderBtn, [data-open-shop], [data-go-home], #saveCheckoutAddressBtn, #applyCheckoutPromo, #editCheckoutInfo');
  if (!t) return;

  if (t.hasAttribute('data-open-shop')) { e.preventDefault(); openShopPage('All'); }
  else if (t.hasAttribute('data-go-home')) { e.preventDefault(); document.body.classList.remove('shop-page-open', 'product-page-open', 'checkout-page-open'); activeCategory = 'All'; activeSubcategory = null; renderNav(); renderProducts(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  else if (t.dataset.productView) {
    if (t.matches('article') || !t.dataset.add) openProductPage(t.dataset.productView);
  }
  else if (t.dataset.viewAdd || t.dataset.detailAdd) {
    const id = t.dataset.viewAdd || t.dataset.detailAdd;
    modifyCart(id, 1);
    showToast('Added to your cart.');
    if (t.dataset.viewAdd) openDrawer('cart');
  }
  else if (t.dataset.buyNow) {
    modifyCart(t.dataset.buyNow, 1);
    openFullCheckout();
  }
  else if (t.id === 'productBackBtn') {
    document.body.classList.remove('product-page-open');
    if (recommendationTimer) clearInterval(recommendationTimer);
    $('#shop').scrollIntoView({ behavior: 'smooth' });
  }
  else if (t.id === 'checkoutBackBtn') {
    document.body.classList.remove('checkout-page-open');
    openDrawer('cart');
  }
  else if (t.id === 'placeFullOrderBtn') handleCheckoutSubmit('full');
  else if (t.id === 'saveCheckoutAddressBtn') saveCheckoutAddress();
  else if (t.id === 'applyCheckoutPromo') {
    const code = ($('#checkoutPromoCode')?.value || '').trim().toUpperCase();
    const feedback = $('#checkoutPromoFeedback');
    const promo = promoCodes.find(c => c.code === code && c.active !== false);
    if (!code) { appliedPromoCode = null; storage.set('tryzn_applied_promo', null); if (feedback) { feedback.classList.remove('is-error'); feedback.textContent = 'Enter a promo code first.'; } showToast('Enter a promo code first.', true); renderCheckoutPage(); return; }
    if (!promo) { appliedPromoCode = null; storage.set('tryzn_applied_promo', null); if (feedback) { feedback.classList.add('is-error'); feedback.textContent = 'That promo code is invalid or inactive.'; } showToast('Invalid promo code.', true); renderCheckoutPage(); return; }
    const items = getCartItems();
    const eligible = (!promo.category && !promo.productId && !(promo.categories || []).length && !(promo.productIds || []).length) || items.some(i => {
      const categories = promo.categories || (promo.category ? [promo.category] : []);
      const productIds = promo.productIds || (promo.productId ? [promo.productId] : []);
      return (!categories.length || categories.includes(i.product.category)) && (!productIds.length || productIds.includes(i.product.id));
    });
    if (!eligible) { appliedPromoCode = null; storage.set('tryzn_applied_promo', null); if (feedback) { feedback.classList.add('is-error'); feedback.textContent = 'This code is only valid for its selected product/category.'; } showToast('Promo code does not apply to these items.', true); renderCheckoutPage(); return; }
    if (promo.minOrder && getTotals().subtotal < promo.minOrder) { if (feedback) { feedback.classList.add('is-error'); feedback.textContent = 'This code requires a minimum order of ' + formatMoney(promo.minOrder) + '.'; } showToast('Minimum order not reached for this code.', true); return; }
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) { if (feedback) { feedback.classList.add('is-error'); feedback.textContent = 'This promo code has reached its usage limit.'; } showToast('This promo code has reached its usage limit.', true); return; }
    const now = Date.now();
    if (promo.startsAt && Date.parse(promo.startsAt) > now) { showToast('This promo code is not active yet.', true); return; }
    if (promo.expiresAt && Date.parse(promo.expiresAt) < now) { showToast('This promo code has expired.', true); return; }
    appliedPromoCode = promo.code; storage.set('tryzn_applied_promo', appliedPromoCode); renderCheckoutPage(); showToast('Promo code applied successfully!');
  }
  else if (t.id === 'createPromoCodeBtn') {
    const code = ($('#promoAdminCode')?.value || '').trim().toUpperCase().replace(/\s+/g, '');
    const percent = Number($('#promoAdminPercent')?.value || 0);
    const category = $('#promoAdminCategory')?.value || '';
    const productId = $('#promoAdminProduct')?.value || '';
    if (!/^[A-Z0-9_-]{3,24}$/.test(code)) { showToast('Use 3–24 letters, numbers, hyphens or underscores for the code.', true); return; }
    if (!Number.isFinite(percent) || percent < 1 || percent > 90) { showToast('Enter a discount between 1% and 90%.', true); return; }
    if (promoCodes.some(c => c.code === code)) { showToast('That promo code already exists.', true); return; }
    const product = productId ? productsList.find(p => p.id === productId) : null;
    promoCodes.unshift({ code, percent, category: product ? '' : category, productId: product ? product.id : '', createdAt: new Date().toLocaleDateString('en-GB'), active: true });
    storage.set('tryzn_promo_codes', promoCodes); renderPromoCodes();
    $('#promoAdminCode').value = ''; $('#promoAdminPercent').value = ''; $('#promoAdminProductSearch').value = ''; $('#promoAdminProduct').value = '';
    showToast('Promo code ' + code + ' created!');
  }
  else if (t.dataset.deletePromo) {
    const code = t.dataset.deletePromo;
    promoCodes = promoCodes.filter(c => c.code !== code); storage.set('tryzn_promo_codes', promoCodes);
    if (appliedPromoCode === code) { appliedPromoCode = null; storage.set('tryzn_applied_promo', null); }
    renderPromoCodes(); showToast('Promo code ' + code + ' deleted.');
  }
  else if (t.id === 'editCheckoutInfo') { $('#checkoutFullName')?.focus(); $('#fullCheckoutForm')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  else if (t.dataset.sub) {
    document.body.classList.remove('product-page-open', 'checkout-page-open');
    document.body.classList.add('shop-page-open');
    activeCategory = t.dataset.cat;
    activeSubcategory = t.dataset.sub;
    renderNav();
    renderProducts();
    $('#shop').scrollIntoView({ behavior: 'smooth' });
  }
  else if (t.dataset.cat) {
    document.body.classList.remove('product-page-open', 'checkout-page-open');
    document.body.classList.add('shop-page-open');
    activeCategory = t.dataset.cat;
    activeSubcategory = null;
    renderNav();
    renderProducts();
    if (t.classList.contains('col-card') || t.tagName === 'A' || t.tagName === 'BUTTON') {
      $('#shop').scrollIntoView({ behavior: 'smooth' });
    }
  }
  else if (t.dataset.add) { modifyCart(t.dataset.add, 1); openDrawer('cart'); }
  else if (t.dataset.waOrder) {
    const p = productsList.find(x => x.id === t.dataset.waOrder);
    if (p) {
      const msg = `Assalam-o-Alaikum Tryzn Store! I want to order *${p.name}* (${formatMoney(p.price)} Cash On Delivery). Please confirm if delivery to my city is available. (Free delivery nationwide on orders above Rs. 4,999).`;
      window.open('https://wa.me/' + CFG.wa + '?text=' + encodeURIComponent(msg), '_blank');
    }
  }
  else if (t.dataset.inc) modifyCart(t.dataset.inc, 1);
  else if (t.dataset.dec) modifyCart(t.dataset.dec, -1);
  else if (t.dataset.del) removeCartItem(t.dataset.del);
  else if (t.dataset.delProd) {
    productsList = productsList.filter(x => x.id !== t.dataset.delProd);
    storage.set('tryzn_products', productsList);
    renderProducts();
    renderAdmin();
    showToast('Product deleted.');
  }
  else if (t.dataset.msgCust) {
    const o = ordersList.find(x => x.id === t.dataset.msgCust);
    if (o) {
      const ph = o.phone.replace(/[^0-9]/g, '');
      const cleanPhone = ph.startsWith('0') ? '92' + ph.slice(1) : ph;
      const msg = `Assalam-o-Alaikum ${o.name}! This is Tryzn Store confirming your order #${o.id} (${formatMoney(o.total)} COD). Status: ${o.status}.`;
      window.open('https://wa.me/' + cleanPhone + '?text=' + encodeURIComponent(msg), '_blank');
    }
  }
  else if (t.dataset.atab) {
    $$('.admin-nav-item').forEach(b => b.classList.remove('active'));
    $$('.admin-tab-pane').forEach(p => p.classList.remove('active'));
    t.classList.add('active');
    const tabName = t.dataset.atab;
    if (tabName === 'orders') $('#paneOrders').classList.add('active');
    else if (tabName === 'categories') $('#paneCategories').classList.add('active');
    else if (tabName === 'products') $('#paneProducts').classList.add('active');
    else if (tabName === 'discounts') $('#paneDiscounts').classList.add('active');
    else if (tabName === 'media') $('#paneMedia').classList.add('active');
  }
  else if (t.id === 'toggleAddCatFormBtn') {
    const f = $('#newCatFormContainer');
    f.style.display = f.style.display === 'none' ? 'block' : 'none';
  }
  else if (t.id === 'saveNewCategoryBtn') {
    const title = ($('#newCatTitleInput').value || '').trim();
    const subsStr = ($('#newCatSubInput').value || '').trim();
    const urlImg = ($('#newCatImgUrlInput').value || '').trim();
    const coverSource = window._uploadedCatCoverData || urlImg || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80';
    const err = $('#newCatError');

    if (title.length < 2) {
      if (err) err.textContent = 'Please enter a valid category name (min 2 characters).';
      return;
    }
    if (CATEGORIES.some(c => c.name.toLowerCase() === title.toLowerCase())) {
      if (err) err.textContent = 'A category with this name already exists.';
      return;
    }

    const subcategories = subsStr ? subsStr.split(',').map(s => s.trim()).filter(Boolean) : [];
    CATEGORIES.push({
      name: title,
      image: coverSource,
      count: subcategories.join(', ') || 'New Collection',
      subcategories: subcategories
    });

    storage.set('tryzn_categories', CATEGORIES);
    renderNav();
    renderAdminCategories();
    showToast('Category "' + title + '" created!');

    $('#newCatTitleInput').value = '';
    $('#newCatSubInput').value = '';
    $('#newCatImgUrlInput').value = '';
    if ($('#newCatFileInput')) $('#newCatFileInput').value = '';
    window._uploadedCatCoverData = null;
    if ($('#newCatMediaPreviewWrapper')) $('#newCatMediaPreviewWrapper').style.display = 'none';
    $('#newCatFormContainer').style.display = 'none';
    if (err) err.textContent = '';
  }
  else if (t.dataset.addSubCat) {
    const catName = t.dataset.addSubCat;
    const inputEl = $('#' + t.dataset.inputId);
    const val = (inputEl.value || '').trim();
    if (!val) return;
    const catObj = CATEGORIES.find(c => c.name === catName);
    if (catObj) {
      catObj.subcategories = catObj.subcategories || [];
      if (!catObj.subcategories.includes(val)) {
        catObj.subcategories.push(val);
        catObj.count = catObj.subcategories.join(', ');
        storage.set('tryzn_categories', CATEGORIES);
        renderNav();
        renderAdminCategories();
        showToast('Added subcategory "' + val + '" to ' + catName + '!');
      }
    }
    inputEl.value = '';
  }
  else if (t.dataset.delSub) {
    const subName = t.dataset.delSub;
    const parentCat = t.dataset.parentCat;
    const catObj = CATEGORIES.find(c => c.name === parentCat);
    if (catObj && catObj.subcategories) {
      catObj.subcategories = catObj.subcategories.filter(s => s !== subName);
      catObj.count = catObj.subcategories.join(', ');
      storage.set('tryzn_categories', CATEGORIES);
      renderNav();
      renderAdminCategories();
      showToast('Removed subcategory "' + subName + '"');
    }
  }
  else if (t.dataset.delCat) {
    const catName = t.dataset.delCat;
    if (CATEGORIES.length <= 1) {
      showToast('You must keep at least one category.', true);
      return;
    }
    CATEGORIES = CATEGORIES.filter(c => c.name !== catName);
    storage.set('tryzn_categories', CATEGORIES);
    if (activeCategory === catName) activeCategory = 'All';
    renderNav();
    renderProducts();
    renderAdminCategories();
    showToast('Deleted category "' + catName + '"');
  }
  else if (t.id === 'toggleAddProdFormBtn') {
    const f = $('#newProductFormContainer');
    f.style.display = f.style.display === 'none' ? 'block' : 'none';
  }
  else if (t.id === 'bulkDeleteProdsBtn') {
    const checkedBoxes = $$('.prod-chk:checked');
    if (!checkedBoxes.length) { showToast('Select products first.', true); return; }
    const idsToDelete = Array.from(checkedBoxes).map(cb => cb.dataset.chkId);
    productsList = productsList.filter(p => !idsToDelete.includes(p.id));
    storage.set('tryzn_products', productsList);
    renderProducts();
    renderAdmin();
    showToast('Deleted ' + idsToDelete.length + ' products.');
  }
  else if (t.id === 'cartBtn') openDrawer('cart');
  else if (t.id === 'closeDrawerBtn' || t.id === 'drawerOverlay') closeDrawer();
  else if (t.id === 'closeModalBtn' || t.id === 'modalOverlay') closeModal();
  else if (t.id === 'authModal' && e.target === t) closeAuth();
  else if (t.id === 'openAuthBtn' || t.id === 'footerPortalBtn') {
    if (isAdminLoggedIn) openAdminModal();
    else openAuth('signin');
  }
  else if (t.id === 'openAdminModalFromAuthBtn') { closeAuth(); openAdminModal(); }
  else if (t.id === 'closeAdminBtn') closeAdminModal();
  else if (t.id === 'tabSignInBtn') openAuth('signin');
  else if (t.id === 'tabRegisterBtn') openAuth('register');
  else if (t.id === 'signInSubmitBtn') handleUnifiedSignIn();
  else if (t.id === 'regSubmitBtn') handleCustomerRegister();
  else if (t.id === 'userLogoutBtn') {
    currentUser = null;
    storage.set('tryzn_user', null);
    updateUserUI();
    closeAuth();
    showToast('Logged out.');
  }
  else if (t.id === 'adminLogoutBtn' || t.id === 'adminLogoutAuthBtn') {
    isAdminLoggedIn = false;
    adminCredentials = null;
    storage.set('tryzn_is_admin', false);
    
    updateUserUI();
    closeAdminModal();
    closeAuth();
    showToast('Admin logged out.');
  }
  else if (t.id === 'saveNewProductBtn') {
    const title = ($('#newProdTitle').value || '').trim();
    const cat = $('#newProdCat').value;
    const price = parseInt($('#newProdPrice').value, 10);
    const oldPrice = parseInt($('#newProdOldPrice').value, 10) || 0;
    const stock = parseInt($('#newProdStock').value, 10) || 10;
    const badge = ($('#newProdBadge').value || '').trim();
    const linkImg = ($('#newProdImg').value || '').trim();
    const desc = ($('#newProdDesc').value || '').trim();

    const mediaSource = window._uploadedMediaData || linkImg || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
    const mediaType = window._uploadedMediaType || (mediaSource.match(/\.(mp4|webm)($|\?)/i) ? 'video' : 'image');

    if (title.length < 3 || isNaN(price) || price <= 0) {
      $('#newProdError').textContent = 'Please enter product title and valid price.';
      return;
    }
    const newP = { id: 'p_' + Date.now(), name: title, category: cat, price, oldPrice, stock, badge, image: mediaSource, mediaType, description: desc, rating: 5.0, reviews: 1 };
    productsList.unshift(newP);
    storage.set('tryzn_products', productsList);
    renderProducts();
    renderAdmin();
    showToast('Product published to ' + cat + '!');

    $('#newProdTitle').value = '';
    $('#newProdPrice').value = '';
    $('#newProdOldPrice').value = '';
    $('#newProdStock').value = '15';
    $('#newProdBadge').value = '';
    $('#newProdImg').value = '';
    $('#newProdDesc').value = '';
    if ($('#newProdFileInput')) $('#newProdFileInput').value = '';
    window._uploadedMediaData = null;
    window._uploadedMediaType = null;
    if ($('#newProdMediaPreviewWrapper')) $('#newProdMediaPreviewWrapper').style.display = 'none';
    $('#newProductFormContainer').style.display = 'none';
  }
  else if (t.id === 'applyDiscountBtn') {
    const pid = $('#discProdSelect').value;
    const pct = parseInt($('#discPercentInput').value, 10);
    if (!pid || isNaN(pct) || pct <= 0 || pct > 90) { showToast('Enter valid percentage (1-90%).', true); return; }
    const p = productsList.find(x => x.id === pid);
    if (p) {
      p.oldPrice = p.oldPrice || p.price;
      p.price = Math.round(p.oldPrice * (1 - pct / 100));
      p.badge = 'Sale ' + pct + '% OFF';
      storage.set('tryzn_products', productsList);
      renderProducts();
      renderAdmin();
      showToast('Discount applied to ' + p.name + '!');
    }
  }
  else if (t.id === 'saveMediaChangesBtn') {
    const title = $('#editHeroTitle').value.trim();
    const sub = $('#editHeroSub').value.trim();
    const img = $('#editHeroImg').value.trim();
    if (title) $('#heroHeading').textContent = title;
    if (sub) $('#heroSubheading').textContent = sub;
    if (img) {
      $('#heroMainImg').src = img;
      if ($('#adminHeroImgPreview')) $('#adminHeroImgPreview').src = img;
    }
    showToast('Hero picture & text updated!');
  }
  else if (t.id === 'saveCatImgBtn') {
    const selCat = $('#catPhotoSelect').value;
    const newUrl = $('#editCatImgUrl').value.trim();
    const catObj = CATEGORIES.find(c => c.name === selCat);
    if (catObj && newUrl) {
      catObj.image = newUrl;
      storage.set('tryzn_categories', CATEGORIES);
      renderNav();
      if ($('#adminCatPreview')) $('#adminCatPreview').src = newUrl;
      showToast('Cover updated for ' + selCat + '!');
    }
  }
  else if (t.id === 'brandHomeBtn') { document.body.classList.remove('shop-page-open', 'product-page-open', 'checkout-page-open'); activeCategory = 'All'; activeSubcategory = null; renderNav(); renderProducts(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  else if (t.id === 'browseBtn') { closeDrawer(); openShopPage('All'); }
  else if (t.id === 'heroShopBtn') { e.preventDefault(); openShopPage('All'); }
  else if (t.id === 'heroWhatsAppBtn' || t.id === 'floatingWaBtn') {
    e.preventDefault();
    window.open('https://wa.me/' + CFG.wa + '?text=' + encodeURIComponent('Assalam-o-Alaikum Tryzn Store! I would like to place an order with Cash on Delivery (Free delivery over Rs. 4,999). Please share available items.'), '_blank');
  }
  else if (t.id === 'gotoCheckoutBtn') openFullCheckout();
  else if (t.id === 'backToCartBtn') openDrawer('cart');
  else if (t.id === 'submitOrderBtn') handleCheckoutSubmit();
  else if (t.id === 'directWaCheckoutBtn') {
    const totals = getTotals();
    const items = getCartItems();
    const isFree = totals.subtotal >= CFG.freeShippingOver;
    const msg = `*Assalam-o-Alaikum Tryzn Store Pakistan!*
I want to order via WhatsApp (Cash On Delivery):

${items.map(i => `• ${i.qty}x ${i.product.name} (${formatMoney(i.product.price)})`).join('\n')}

*Subtotal:* ${formatMoney(totals.subtotal)}
*Delivery:* ${isFree ? 'FREE (Above Rs. 4,999)' : 'Rs. 200 (Nationwide TCS / Leopards Courier)'}
*Total COD Payable:* ${formatMoney(totals.total)}

Kindly confirm my order and let me know when it will be dispatched via TCS / Leopards.`;
    window.open('https://wa.me/' + CFG.wa + '?text=' + encodeURIComponent(msg), '_blank');
  }
});

document.addEventListener('change', e => {
  if (e.target.id === 'catPhotoSelect') updateCategoryPhotoPreview();
  else if (e.target.dataset.moveCat) {
    const p = productsList.find(x => x.id === e.target.dataset.moveCat);
    if (p) {
      p.category = e.target.value;
      storage.set('tryzn_products', productsList);
      renderProducts();
      showToast('Moved "' + p.name + '" to ' + p.category + '!');
    }
  }
  else if (e.target.id === 'selectAllProds') {
    $$('.prod-chk').forEach(cb => cb.checked = e.target.checked);
    updateBulkDelCount();
  }
  else if (e.target.classList.contains('prod-chk')) updateBulkDelCount();
  else if (e.target.dataset.orderStatus) {
    const select = e.target;
    const o = ordersList.find(x => x.id === select.dataset.orderStatus);
    if (o) {
      const previousStatus = o.status;
      const requestedStatus = select.value;
      select.disabled = true;
      if (!isAdminLoggedIn || !adminCredentials) {
        select.value = previousStatus;
        select.disabled = false;
        showToast('Admin session expired. Sign in again.', true);
        return;
      }
      writeSheetsAction({
        action:'adminUpdateOrderStatus',
        email:adminCredentials.email,
        password:adminCredentials.password,
        order_id:o.id,
        status:requestedStatus
      }).then(result => {
        if (!result || !result.success) throw new Error('The server did not save this status.');
        o.status = result.status;
        storage.set('tryzn_orders', ordersList);
        renderAdmin();
        showToast('Order #' + o.id + ' status saved to Google Sheets.');
      }).catch(error => {
        select.value = previousStatus;
        showToast(error.message || 'Order status could not be saved.', true);
      }).finally(() => { select.disabled = false; });
    }
  }
  else if (e.target.id === 'themeSelect') document.body.setAttribute('data-theme', e.target.value);
});

// Live image URL preview inputs
const editHero = $('#editHeroImg');
if (editHero) editHero.addEventListener('input', e => { if (e.target.value && $('#adminHeroImgPreview')) $('#adminHeroImgPreview').src = e.target.value; });
const editCat = $('#editCatImgUrl');
if (editCat) editCat.addEventListener('input', e => { if (e.target.value && $('#adminCatPreview')) $('#adminCatPreview').src = e.target.value; });

// Computer File Upload Handler (Image / Video) for Add Product
const newProdFileInput = $('#newProdFileInput');
if (newProdFileInput) {
  newProdFileInput.addEventListener('change', e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();

    reader.onload = evt => {
      window._uploadedMediaData = evt.target.result;
      window._uploadedMediaType = isVideo ? 'video' : 'image';

      const previewContainer = $('#newProdMediaPreviewContainer');
      const previewWrapper = $('#newProdMediaPreviewWrapper');
      const mediaNameEl = $('#newProdMediaName');

      if (previewContainer && previewWrapper) {
        if (isVideo) {
          previewContainer.innerHTML = `<video src="${window._uploadedMediaData}" autoplay loop muted playsinline style="width:100%;height:100%;object-fit:cover;"></video>`;
        } else {
          previewContainer.innerHTML = `<img src="${window._uploadedMediaData}" alt="Uploaded preview" style="width:100%;height:100%;object-fit:cover;">`;
        }
        if (mediaNameEl) mediaNameEl.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
        previewWrapper.style.display = 'flex';
      }
      showToast('Media loaded from computer!');
    };

    reader.readAsDataURL(file);
  });
}

// Category File Upload Handler from Computer
const newCatFileInput = $('#newCatFileInput');
if (newCatFileInput) {
  newCatFileInput.addEventListener('change', e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      window._uploadedCatCoverData = evt.target.result;
      const previewContainer = $('#newCatMediaPreviewContainer');
      const previewWrapper = $('#newCatMediaPreviewWrapper');
      const mediaNameEl = $('#newCatMediaName');

      if (previewContainer && previewWrapper) {
        previewContainer.innerHTML = `<img src="${window._uploadedCatCoverData}" alt="Category Cover Preview" style="width:100%;height:100%;object-fit:cover;">`;
        if (mediaNameEl) mediaNameEl.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
        previewWrapper.style.display = 'flex';
      }
      showToast('Category cover loaded from computer!');
    };
    reader.readAsDataURL(file);
  });
}

const clearUploadedCatMediaBtn = $('#clearUploadedCatMediaBtn');
if (clearUploadedCatMediaBtn) {
  clearUploadedCatMediaBtn.addEventListener('click', () => {
    window._uploadedCatCoverData = null;
    if ($('#newCatFileInput')) $('#newCatFileInput').value = '';
    if ($('#newCatMediaPreviewWrapper')) $('#newCatMediaPreviewWrapper').style.display = 'none';
    showToast('Cover photo removed.');
  });
}

const clearMediaBtn = $('#clearUploadedMediaBtn');
if (clearMediaBtn) {
  clearMediaBtn.addEventListener('click', () => {
    window._uploadedMediaData = null;
    window._uploadedMediaType = null;
    if ($('#newProdFileInput')) $('#newProdFileInput').value = '';
    if ($('#newProdMediaPreviewWrapper')) $('#newProdMediaPreviewWrapper').style.display = 'none';
    showToast('Uploaded media removed.');
  });
}

const searchInput = $('#productSearch');
if (searchInput) searchInput.addEventListener('input', renderProducts);
$('#discCategoryFilter')?.addEventListener('change', refreshDiscountProductOptions);
$('#discProductSearch')?.addEventListener('input', refreshDiscountProductOptions);
$('#promoAdminCategory')?.addEventListener('change', refreshDiscountProductOptions);
$('#promoAdminProductSearch')?.addEventListener('input', refreshDiscountProductOptions);

document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-product-view]')) { e.preventDefault(); openProductPage(e.target.dataset.productView); }
  if (e.key === 'Escape') {
    closeDrawer();
    closeModal();
    closeAuth();
    closeAdminModal();
  }
});

// Boot Store
(() => {
  if ($('#regCity')) $('#regCity').innerHTML = '<option value="">Select your city...</option>' + PK_CITIES.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  if ($('#checkoutCity')) $('#checkoutCity').innerHTML = '<option value="">Please choose your city</option>' + PK_CITIES.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  const announcements = [...document.querySelectorAll('.top-notice > span')];
  if (announcements.length) {
    announcements.forEach((item, index) => { item.classList.toggle('is-active', index === 0); });
    let announcementIndex = 0;
    setInterval(() => { announcements[announcementIndex].classList.remove('is-active'); announcementIndex = (announcementIndex + 1) % announcements.length; announcements[announcementIndex].classList.add('is-active'); }, 4000);
  }
  updateUserUI();
  renderNav();
  renderProducts();
  renderHomeFeatured();
  updateCartBadge();
  loadProductsFromSheets();
  loadPromoCodesFromSheets();
})();
