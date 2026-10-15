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
  api: '', 
  wa: '923278081874', 
  currency: 'Rs.',
  shippingFee: 200,
  freeShippingOver: 4999,
  adminEmail: 'hshussnain41@gmail.com',
  adminPass: 'Keven1062&'
};

const formatMoney = n => CFG.currency + ' ' + Number(n).toLocaleString('en-PK');

/* Initial Collections State with Dropdown Subcategories */
let CATEGORIES = storage.get('tryzn_categories', [
  { name: 'Men', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80', count: 'Polos, Chinos & Tees', subcategories: ['Knitted Polos', 'Slim-Fit Chinos', 'Boxy T-Shirts', 'Linen Shirts'] },
  { name: 'Women', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80', count: 'Suits, Kurtis & Totes', subcategories: ['3-Piece Suits', 'Tote Bags', 'Digital Kurtis', 'Hoop Earrings'] },
  { name: 'Footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80', count: 'Monaco Slides & Boots', subcategories: ['Monaco Slides', 'Chelsea Boots', 'Tassel Loafers', 'Cloud Sneakers'] },
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80', count: 'Earbuds, Power & Watch', subcategories: ['ANC Earbuds', 'Power Banks', 'Smartwatches', 'Fast Chargers'] },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80', count: 'Watches, Wallets & Belts', subcategories: ['Chrono Watches', 'Leather Wallets', 'Aviator Glasses', 'Leather Belts'] },
  { name: 'Fragrances', image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80', count: 'Luxury EDP & Ouds', subcategories: ['Eau De Parfum', 'Oriental Ouds'] },
  { name: 'Home', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80', count: 'Bedding & Diffusers', subcategories: ['Bed Sheets', 'Aroma Diffusers'] },
  { name: 'Combo Deals', image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=600&q=80', count: 'Bundle & Save Extra', subcategories: ['Apparel Bundles', 'Executive Boxes'] }
]);

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
let productsList = storage.get('tryzn_products', null);
if (!productsList || productsList.length < 10) {
  productsList = DEFAULT_PRODUCTS;
  storage.set('tryzn_products', productsList);
}
let ordersList = storage.get('tryzn_orders', [
  { id: 'TZ-910482', time: '2026-10-15 11:20', name: 'Hamza Malik', phone: '0301-8472910', city: 'Lahore', address: 'House 42, Block C, Model Town', items: [{ id: 'm1', name: 'Old Money Textured Knitted Polo', qty: 1, price: 2790 }], total: 2990, status: 'New' }
]);
let currentUser = storage.get('tryzn_user', null);
let registeredUsers = storage.get('tryzn_registered_users', []);
let isAdminLoggedIn = storage.get('tryzn_is_admin', false);
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
  
  // Header Nav Bar with Dropdown Submenus
  const topNav = $('#topNav');
  if (topNav) {
    topNav.innerHTML = cats.map(c => {
      const catObj = CATEGORIES.find(x => x.name === c);
      const subList = catObj && catObj.subcategories ? catObj.subcategories : [];
      const hasSubs = subList.length > 0;
      const isCatActive = c === activeCategory;

      if (!hasSubs) {
        return `
          <div class="nav-item-wrapper">
            <a href="#shop" class="header-nav-link ${isCatActive ? 'active' : ''}" data-cat="${esc(c)}">
              ${c === 'All' ? 'All Products' : esc(c)}
            </a>
          </div>
        `;
      }

      return `
        <div class="nav-item-wrapper">
          <a href="#shop" class="header-nav-link ${isCatActive ? 'active' : ''}" data-cat="${esc(c)}">
            ${esc(c)}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left:2px;"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
          <div class="nav-dropdown-menu">
            <a href="#shop" class="nav-dropdown-item" data-cat="${esc(c)}" style="font-weight:700; border-bottom: 1px solid var(--line); margin-bottom: 4px;">
              View All ${esc(c)}
            </a>
            ${subList.map(s => `
              <a href="#shop" class="nav-dropdown-item" data-cat="${esc(c)}" data-sub="${esc(s)}">
                ${esc(s)}
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
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
    colGrid.innerHTML = CATEGORIES.map(c => `
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
      <article class="product-card">
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
  return { subtotal, shipping, total: subtotal + shipping, isFree, count: items.reduce((acc, i) => acc + i.qty, 0) };
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
      <button class="btn-block btn-dark" id="submitOrderBtn" style="margin-top: 10px;">Place Order (Cash On Delivery)</button>
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

function handleCheckoutSubmit() {
  const name = ($('#uName').value || '').trim();
  const phone = ($('#uPhone').value || '').trim();
  const city = ($('#uCity').value || '').trim();
  const address = ($('#uAddress').value || '').trim();
  const err = $('#checkoutErr');

  if (name.length < 2) { err.textContent = 'Please enter your full name.'; return; }
  if (phone.length < 10) { err.textContent = 'Please enter a valid mobile number.'; return; }
  if (address.length < 5) { err.textContent = 'Please enter your complete address.'; return; }

  const totals = getTotals();
  const items = getCartItems();
  const orderId = 'TZ-' + Math.floor(100000 + Math.random() * 900000);
  
  const order = {
    id: orderId,
    time: new Date().toISOString().replace('T', ' ').slice(0, 16),
    name,
    phone,
    city,
    address,
    items: items.map(i => ({ id: i.product.id, name: i.product.name, qty: i.qty, price: i.product.price })),
    total: totals.total,
    status: 'New'
  };

  ordersList.unshift(order);
  storage.set('tryzn_orders', ordersList);
  lastPlacedOrder = order;

  cart = {};
  storage.set('tryzn_cart', cart);
  updateCartBadge();
  closeDrawer();
  renderAdmin();

  showToast('Order #' + orderId + ' received! Opening WhatsApp confirmation...');
  const waMsg = buildWhatsAppMessage(order);
  setTimeout(() => {
    window.open('https://wa.me/' + CFG.wa + '?text=' + encodeURIComponent(waMsg), '_blank');
  }, 1000);
}

function buildWhatsAppMessage(order) {
  const isFree = order.total >= 4999;
  return `*🇵🇰 NEW COD ORDER - TRYZN STORE PAKISTAN*
Order ID: ${order.id}
Customer: ${order.name}
Phone: ${order.phone}
City: ${order.city}
Delivery Address: ${order.address}

*Ordered Items:*
${order.items.map(i => `• ${i.qty}x ${i.name} (${formatMoney(i.price)})`).join('\n')}

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

function handleUnifiedSignIn() {
  const email = ($('#loginEmail').value || '').trim();
  const pass = ($('#loginPass').value || '').trim();
  const err = $('#signInError');

  if (!email || !pass) { 
    err.textContent = 'Please enter both your email address and password.'; 
    return; 
  }

  // 1. Strict Administrator Authentication
  if (email.toLowerCase() === CFG.adminEmail.toLowerCase()) {
    if (pass === CFG.adminPass) {
      err.textContent = '';
      isAdminLoggedIn = true;
      storage.set('tryzn_is_admin', true);
      updateUserUI();
      closeAuth();
      openAdminModal();
      showToast('Welcome back, Store Administrator!');
      return;
    } else {
      err.textContent = 'Incorrect password for administrator account.';
      return;
    }
  }

  // 2. Strict Customer Authentication
  const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!found) {
    err.textContent = 'No account found with this email. Please click "Create Account" above to register.';
    return;
  }

  if (found.pass !== pass) {
    err.textContent = 'Incorrect password. Please verify your credentials and try again.';
    return;
  }

  currentUser = found;
  err.textContent = '';
  storage.set('tryzn_user', currentUser);
  updateUserUI();
  closeAuth();
  showToast('Welcome back, ' + (currentUser.name || 'Customer') + '!');
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
  currentUser = { name, email, pass, phone, city, address };
  registeredUsers.push(currentUser);
  storage.set('tryzn_registered_users', registeredUsers);
  storage.set('tryzn_user', currentUser);
  
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

  if ($('#discProdSelect')) {
    $('#discProdSelect').innerHTML = productsList.map(p => `
      <option value="${esc(p.id)}">${esc(p.name)} — Current: ${formatMoney(p.price)}</option>
    `).join('');
  }

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

function openAdminModal() {
  if (!isAdminLoggedIn) { openAuth('signin'); return; }
  renderAdmin();
  updateCategoryPhotoPreview();
  document.body.classList.add('admin-open');
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
  const t = e.target.closest('[data-cat], [data-sub], [data-add], [data-wa-order], [data-inc], [data-dec], [data-del], [data-msg-cust], [data-atab], [data-del-prod], [data-del-cat], [data-del-sub], [data-add-sub-cat], #cartBtn, #closeDrawerBtn, #drawerOverlay, #closeModalBtn, #modalOverlay, #openAuthBtn, #authModal, #closeAdminBtn, #heroShopBtn, #heroWhatsAppBtn, #floatingWaBtn, #gotoCheckoutBtn, #directWaCheckoutBtn, #backToCartBtn, #submitOrderBtn, #browseBtn, #footerPortalBtn, #brandHomeBtn, #tabSignInBtn, #tabRegisterBtn, #signInSubmitBtn, #regSubmitBtn, #userLogoutBtn, #adminLogoutAuthBtn, #adminLogoutBtn, #toggleAddProdFormBtn, #toggleAddCatFormBtn, #saveNewProductBtn, #saveNewCategoryBtn, #bulkDeleteProdsBtn, #applyDiscountBtn, #saveMediaChangesBtn, #openAdminModalFromAuthBtn, #saveCatImgBtn');
  if (!t) return;

  if (t.dataset.sub) {
    activeCategory = t.dataset.cat;
    activeSubcategory = t.dataset.sub;
    renderNav();
    renderProducts();
    $('#shop').scrollIntoView({ behavior: 'smooth' });
  }
  else if (t.dataset.cat) {
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
  else if (t.id === 'brandHomeBtn') { activeCategory = 'All'; activeSubcategory = null; renderNav(); renderProducts(); }
  else if (t.id === 'browseBtn') { closeDrawer(); $('#shop').scrollIntoView({ behavior: 'smooth' }); }
  else if (t.id === 'heroShopBtn') { $('#shop').scrollIntoView({ behavior: 'smooth' }); }
  else if (t.id === 'heroWhatsAppBtn' || t.id === 'floatingWaBtn') {
    e.preventDefault();
    window.open('https://wa.me/' + CFG.wa + '?text=' + encodeURIComponent('Assalam-o-Alaikum Tryzn Store! I would like to place an order with Cash on Delivery (Free delivery over Rs. 4,999). Please share available items.'), '_blank');
  }
  else if (t.id === 'gotoCheckoutBtn') openDrawer('checkout');
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
    const o = ordersList.find(x => x.id === e.target.dataset.orderStatus);
    if (o) {
      o.status = e.target.value;
      storage.set('tryzn_orders', ordersList);
      renderAdmin();
      showToast('Order #' + o.id + ' status: ' + o.status);
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

document.addEventListener('keydown', e => {
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
  updateUserUI();
  renderNav();
  renderProducts();
  updateCartBadge();
})();
