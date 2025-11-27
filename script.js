// Inventory helpers (price/stock overrides in localStorage)
function defaultInventory(){
  const inv = {};
  PRODUCTS.forEach(p=>{ inv[p.id] = { price: p.price, stock: 20 }; });
  return inv;
}
function loadInventory(){
  try{
    const v = JSON.parse(localStorage.getItem(LS_INV_KEY));
    return v && typeof v==='object' ? v : defaultInventory();
  }catch(e){ return defaultInventory(); }
}
function saveInventory(inv){ localStorage.setItem(LS_INV_KEY, JSON.stringify(inv)); }
function getPrice(p){ const inv = loadInventory(); return (inv[p.id]?.price) ?? p.price; }
function getStock(id){ const inv = loadInventory(); return (inv[id]?.stock) ?? 0; }
function setPrice(id, price){ const inv = loadInventory(); if(!inv[id]) inv[id]={price:price,stock:0}; inv[id].price = price; saveInventory(inv); }
function setStock(id, stock){ const inv = loadInventory(); if(!inv[id]) inv[id]={price:0,stock:stock}; inv[id].stock = stock; saveInventory(inv); }
// MediMart: Online Medicine Marketplace (Frontend Only)
// State and Data
const LS_CART_KEY = 'medimart_cart_v1';
const LS_ORDERS_KEY = 'medimart_orders_v1';
const LS_AUTH_KEY = 'medimart_auth_v1';
const LS_INV_KEY = 'medimart_inventory_v1';

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#7c5cff"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><rect x="20" y="40" rx="16" width="120" height="32" fill="url(#g)"/><rect x="35" y="78" rx="12" width="90" height="20" fill="#94a3b8"/></svg>');
const IMG_PILL_BLUE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#60a5fa"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><g transform="translate(20,30)"><rect rx="18" width="120" height="40" fill="url(#g)"/><rect rx="18" x="24" y="46" width="96" height="28" fill="#cbd5e1"/></g></svg>');
const IMG_PILL_RED = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><g transform="translate(20,30)"><rect rx="18" width="120" height="40" fill="#ef4444"/><rect rx="18" x="24" y="46" width="96" height="28" fill="#fecaca"/></g></svg>');
const IMG_BOTTLE_SYRUP = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><g transform="translate(50,18)"><rect x="10" y="0" width="40" height="12" rx="3" fill="#94a3b8"/><rect x="0" y="12" width="60" height="90" rx="10" fill="#22d3ee"/><rect x="10" y="36" width="40" height="16" rx="4" fill="#0b0c10"/></g></svg>');
const IMG_STRIPS = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><g transform="translate(30,30)"><rect x="0" y="0" width="100" height="60" rx="8" fill="#f3f4f6" stroke="#cbd5e1"/><g fill="#9ca3af"><rect x="12" y="12" width="76" height="6" rx="3"/><rect x="12" y="26" width="76" height="6" rx="3"/><rect x="12" y="40" width="76" height="6" rx="3"/></g></g></svg>');
const IMG_HEART = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><path d="M80 100 C20 60, 40 20, 80 40 C120 20, 140 60, 80 100" fill="#ef4444"/></svg>');
const IMG_SUPP = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120" viewBox="0 0 160 120"><g transform="translate(40,20)"><rect x="0" y="0" width="80" height="80" rx="14" fill="#fde68a" stroke="#f59e0b"/><rect x="20" y="20" width="40" height="12" rx="6" fill="#0b0c10"/></g></svg>');
const PRODUCTS = [
  {id:'p1',  name:'Paracetamol 500mg',        brand:'MediCure',  category:'pain',       disease:'fever',    occasion:'daily',        price:29,  rating:4.6, rx:false, img: IMG_PILL_BLUE},
  {id:'p2',  name:'Ibuprofen 200mg',          brand:'HealWell',  category:'pain',       disease:'pain',     occasion:'sports',       price:45,  rating:4.5, rx:false, img: IMG_PILL_RED},
  {id:'p3',  name:'Cough Syrup 100ml',        brand:'SootheKof', category:'cold',       disease:'cold',     occasion:'seasonal',     price:120, rating:4.2, rx:false, img: IMG_BOTTLE_SYRUP},
  {id:'p4',  name:'Antihistamine Tabs',       brand:'ClearAll',  category:'cold',       disease:'cold',     occasion:'seasonal',     price:85,  rating:4.1, rx:false, img: IMG_PILL_BLUE},
  {id:'p5',  name:'Metformin 500mg',          brand:'GlucoCare', category:'diabetes',   disease:'diabetes', occasion:'daily',        price:65,  rating:4.7, rx:true,  img: IMG_PILL_BLUE},
  {id:'p6',  name:'Glucometer Strips (50)',   brand:'AccuSense', category:'diabetes',   disease:'diabetes', occasion:'daily',        price:599, rating:4.4, rx:false, img: IMG_STRIPS},
  {id:'p7',  name:'Atorvastatin 10mg',        brand:'CardioPlus',category:'heart',      disease:'cardiac',  occasion:'post-surgery', price:110, rating:4.5, rx:true,  img: IMG_HEART},
  {id:'p8',  name:'Omega-3 Capsules',         brand:'NutraBest', category:'supplement', disease:'general',  occasion:'daily',        price:399, rating:4.3, rx:false, img: IMG_SUPP},
  {id:'p9',  name:'Vitamin D3 60k IU',        brand:'SunD3',     category:'supplement', disease:'vitamins', occasion:'seasonal',     price:150, rating:4.6, rx:false, img: IMG_SUPP},
  {id:'p10', name:'Aspirin 75mg',             brand:'CardioEase',category:'heart',      disease:'cardiac',  occasion:'daily',        price:55,  rating:4.2, rx:true,  img: IMG_HEART},
  // additional SKUs
  {id:'p11', name:'Diclofenac Gel 30g',       brand:'PainAway',  category:'pain',       disease:'pain',     occasion:'sports',       price:95,  rating:4.1, rx:false, img: IMG_PILL_RED},
  {id:'p12', name:'OR Salts Sachet',          brand:'HydraPlus', category:'supplement', disease:'general',  occasion:'travel',       price:25,  rating:4.3, rx:false, img: IMG_SUPP},
  {id:'p13', name:'Cetirizine 10mg',          brand:'ClearAll',  category:'cold',       disease:'cold',     occasion:'seasonal',     price:30,  rating:4.4, rx:false, img: IMG_PILL_BLUE},
  {id:'p14', name:'Pantoprazole 40mg',        brand:'GastroFix', category:'supplement', disease:'general',  occasion:'post-surgery', price:70,  rating:4.2, rx:true,  img: IMG_PILL_BLUE},
  {id:'p15', name:'Multivitamin Tabs',        brand:'VitaMax',   category:'supplement', disease:'vitamins', occasion:'daily',        price:220, rating:4.5, rx:false, img: IMG_SUPP},
  {id:'p16', name:'Nasal Decongestant Spray', brand:'BreatheEZ', category:'cold',       disease:'cold',     occasion:'travel',       price:140, rating:4.0, rx:false, img: IMG_BOTTLE_SYRUP},
  {id:'p17', name:'ORS+Zinc Kit',             brand:'HydraPlus', category:'supplement', disease:'general',  occasion:'travel',       price:65,  rating:4.1, rx:false, img: IMG_SUPP},
  {id:'p18', name:'Losartan 50mg',            brand:'CardioPlus',category:'heart',      disease:'cardiac',  occasion:'daily',        price:95,  rating:4.6, rx:true,  img: IMG_HEART}
];

let cart = loadCart();

// Utilities
function formatINR(n){
  return '₹' + n.toFixed(2);
}
function saveCart(){
  localStorage.setItem(LS_CART_KEY, JSON.stringify(cart));
}
function loadCart(){
  try{ return JSON.parse(localStorage.getItem(LS_CART_KEY)) || {}; }catch(e){ return {}; }
}
function cartCount(){
  return Object.values(cart).reduce((a,b)=>a+b,0);
}
function cartSubtotal(){
  return Object.entries(cart).reduce((sum,[id,qty])=>{
    const p = PRODUCTS.find(x=>x.id===id);
    return sum + (p? p.price*qty : 0);
  },0);
}

// DOM refs
const gridEl = document.getElementById('grid');
const qEl = document.getElementById('q');
const searchBtn = document.getElementById('searchBtn');
const catEl = document.getElementById('category');
const sortEl = document.getElementById('sort');
const rxOnlyEl = document.getElementById('rxOnly');
const brandEl = document.getElementById('brand');
const ratingMinEl = document.getElementById('ratingMin');
const priceMinEl = document.getElementById('priceMin');
const priceMaxEl = document.getElementById('priceMax');
const cartBtn = document.getElementById('openCart');
const cartCountEl = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsEl = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const deliveryEl = document.getElementById('delivery');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout');
const checkoutDialog = document.getElementById('checkoutDialog');
const checkoutForm = document.getElementById('checkoutForm');
const placeOrderBtn = document.getElementById('placeOrder');
const orderDialog = document.getElementById('orderDialog');
const orderMsg = document.getElementById('orderMsg');
const closeOrderBtn = document.getElementById('closeOrder');
const loginLinkEl = document.getElementById('loginLink');
const ordersLinkEl = document.getElementById('ordersLink');
const adminLinkEl = document.getElementById('adminLink');
const diseaseEl = document.getElementById('disease');
const occasionEl = document.getElementById('occasion');

// Auth helpers
function getAuth(){ try{return JSON.parse(localStorage.getItem(LS_AUTH_KEY))||null;}catch(e){return null;} }
function setAuth(a){ localStorage.setItem(LS_AUTH_KEY, JSON.stringify(a)); }
function logout(){ localStorage.removeItem(LS_AUTH_KEY); location.href = 'index.html'; }
function updateAuthUI(){
  const auth = getAuth();
  if(loginLinkEl){
    if(auth){
      loginLinkEl.textContent = 'Logout ('+auth.user+')';
      loginLinkEl.addEventListener('click', function(e){ e.preventDefault(); logout(); });
    }
  }
  if(adminLinkEl){
    adminLinkEl.style.display = (auth && auth.role==='admin') ? '' : 'none';
  }
}

// Render products
function renderGrid(){
  const query = (qEl?.value || '').trim().toLowerCase();
  const cat = catEl?.value || 'all';
  const rxOnly = !!rxOnlyEl?.checked;
  const brand = brandEl?.value || 'all';
  const ratingMin = parseFloat(ratingMinEl?.value || '0');
  const pmin = parseFloat(priceMinEl?.value || '');
  const pmax = parseFloat(priceMaxEl?.value || '');
  const disease = diseaseEl?.value || 'all';
  const occasion = occasionEl?.value || 'all';
  let list = PRODUCTS.filter(p=>{
    const matchesQ = !query || p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query);
    const matchesCat = cat==='all' || p.category===cat;
    const matchesRx = !rxOnly || p.rx;
    const matchesBrand = brand==='all' || p.brand===brand;
    const matchesRating = p.rating >= (isNaN(ratingMin)?0:ratingMin);
    const matchesMin = isNaN(pmin) || p.price >= pmin;
    const matchesMax = isNaN(pmax) || p.price <= pmax;
    const matchesDisease = disease==='all' || p.disease===disease;
    const matchesOccasion = occasion==='all' || p.occasion===occasion;
    return matchesQ && matchesCat && matchesRx && matchesBrand && matchesRating && matchesMin && matchesMax && matchesDisease && matchesOccasion;
  });
  switch(sortEl?.value){
    case 'price-asc': list = list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list = list.sort((a,b)=>b.price-a.price); break;
    case 'rating-desc': list = list.sort((a,b)=>b.rating-a.rating); break;
    default: break; // relevance: keep current order
  }
  gridEl.innerHTML = list.map(p=>cardHTML(p)).join('') || '<p class="muted">No results. Try different filters.</p>';
  // attach add handlers
  list.forEach(p=>{
    const btn = document.getElementById('add-'+p.id);
    if(btn){
      btn.addEventListener('click', (e)=>{
        addToCart(p.id);
        animateAdd(e.currentTarget, p.id);
      });
    }
  });
}

function cardHTML(p){
  return `
  <article class="card" aria-label="${p.name}">
    <div class="thumb" aria-hidden="true"><img loading="lazy" src="${p.img}" alt="${p.name}" onerror="this.onerror=null; this.src='${FALLBACK_IMG}';"/></div>
    <div class="body">
      <strong>${p.name}</strong>
      <div class="meta"><span>${p.brand}</span> • <span>${p.category}</span> • <span>${p.rating}★</span> ${p.rx? '• <span>Rx</span>':''}</div>
      <div class="price">${formatINR(getPrice(p))} <span class="meta">• Stock: ${getStock(p.id)}</span></div>
      <div class="add">
        <button class="ghost" aria-label="Details" onclick="alert('Frontend demo: details not implemented')">Details</button>
        <button id="add-${p.id}" class="primary" aria-label="Add ${p.name} to cart">Add</button>
      </div>
    </div>
  </article>`;
}

// Cart logic
function openCart(){
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden','false');
  renderCart();
}
function closeCart(){
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden','true');
}
function addToCart(id, qty=1){
  const stock = getStock(id);
  const cur = cart[id]||0;
  const next = cur + qty;
  if(next < 0){ cart[id]=0; }
  else if(next === 0){ delete cart[id]; }
  else if(next > stock){
    alert('Only '+stock+' in stock for this item.');
    cart[id] = Math.max(0, stock);
  } else {
    cart[id] = next;
  }
  if(cart[id] < 1) delete cart[id];
  saveCart();
  updateCartCount();
}
function updateCartCount(){
  if(cartCountEl){ cartCountEl.textContent = String(cartCount()); }
}
function renderCart(){
  const rows = Object.entries(cart);
  if(rows.length===0){
    cartItemsEl.innerHTML = '<p class="muted">Your cart is empty.</p>';
  } else {
    cartItemsEl.innerHTML = rows.map(([id,qty])=>{
      const p = PRODUCTS.find(x=>x.id===id);
      if(!p) return '';
      return `
        <div class="cart-row">
          <div aria-hidden="true"><img loading="lazy" src="${p.img}" alt="" style="height:32px" onerror="this.onerror=null; this.src='${FALLBACK_IMG}';"/></div>
          <div>
            <div><strong>${p.name}</strong></div>
            <div class="meta">${p.brand} • ${p.category} ${p.rx? '• Rx':''}</div>
            <div class="price">${formatINR(getPrice(p))}</div>
          </div>
          <div class="qty">
            <button aria-label="Decrease" data-dec="${p.id}">−</button>
            <span aria-live="polite">${qty}</span>
            <button aria-label="Increase" data-inc="${p.id}">+</button>
          </div>
          <button class="remove" aria-label="Remove" data-rem="${p.id}">✕</button>
        </div>`;
    }).join('');
  }
  // Attach qty handlers
  cartItemsEl.querySelectorAll('[data-inc]').forEach(b=>{
    b.addEventListener('click', ()=>{ addToCart(b.getAttribute('data-inc'), 1); renderCart(); });
  });
  cartItemsEl.querySelectorAll('[data-dec]').forEach(b=>{
    b.addEventListener('click', ()=>{ addToCart(b.getAttribute('data-dec'), -1); renderCart(); });
  });
  cartItemsEl.querySelectorAll('[data-rem]').forEach(b=>{
    b.addEventListener('click', ()=>{ const id=b.getAttribute('data-rem'); delete cart[id]; saveCart(); updateCartCount(); renderCart(); });
  });

  const subtotal = cartSubtotal();
  const delivery = subtotal>499 || subtotal===0 ? 0 : 29;
  subtotalEl.textContent = formatINR(subtotal);
  deliveryEl.textContent = formatINR(delivery);
  totalEl.textContent = formatINR(subtotal+delivery);
}

// Orders persistence
function loadOrders(){ try{return JSON.parse(localStorage.getItem(LS_ORDERS_KEY))||[];}catch(e){return []} }
function saveOrders(list){ localStorage.setItem(LS_ORDERS_KEY, JSON.stringify(list)); }

// Checkout
function openCheckout(){
  if(typeof checkoutDialog.showModal === 'function'){
    checkoutDialog.showModal();
  } else checkoutDialog.setAttribute('open','');
}
function closeCheckout(){
  if(typeof checkoutDialog.close === 'function') checkoutDialog.close();
  else checkoutDialog.removeAttribute('open');
}
function openOrder(msg){
  orderMsg.textContent = msg;
  if(typeof orderDialog.showModal === 'function') orderDialog.showModal();
  else orderDialog.setAttribute('open','');
}
function closeOrder(){
  if(typeof orderDialog.close === 'function') orderDialog.close();
  else orderDialog.removeAttribute('open');
}

// Event bindings
if(searchBtn) searchBtn.addEventListener('click', renderGrid);
if(qEl) qEl.addEventListener('keydown', e=>{ if(e.key==='Enter') renderGrid(); });
if(catEl) catEl.addEventListener('change', renderGrid);
if(sortEl) sortEl.addEventListener('change', renderGrid);
if(rxOnlyEl) rxOnlyEl.addEventListener('change', renderGrid);
if(brandEl) brandEl.addEventListener('change', renderGrid);
if(ratingMinEl) ratingMinEl.addEventListener('change', renderGrid);
if(priceMinEl) priceMinEl.addEventListener('input', renderGrid);
if(priceMaxEl) priceMaxEl.addEventListener('input', renderGrid);
if(diseaseEl) diseaseEl.addEventListener('change', renderGrid);
if(occasionEl) occasionEl.addEventListener('change', renderGrid);
if(cartBtn) cartBtn.addEventListener('click', openCart);
if(closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if(checkoutBtn) checkoutBtn.addEventListener('click', ()=>{
  if(cartCount()===0){ alert('Your cart is empty.'); return; }
  openCheckout();
});
if(checkoutForm) checkoutForm.addEventListener('submit', (e)=>{
  e.preventDefault();
});
if(placeOrderBtn) placeOrderBtn.addEventListener('click', (e)=>{
  // basic validation by browser
  if(!checkoutForm.reportValidity()) return;
  const fd = new FormData(checkoutForm);
  const auth = getAuth();
  const order = {
    id: 'MM' + Math.floor(100000 + Math.random()*900000),
    when: new Date().toISOString(),
    user: auth? auth.user : 'guest',
    status: 'Placed',
    name: fd.get('name'),
    phone: fd.get('phone'),
    address: fd.get('address'),
    items: Object.entries(cart).map(([id,qty])=>({id, qty})),
    subtotal: cartSubtotal()
  };
  const all = loadOrders();
  all.unshift(order); // latest first
  saveOrders(all);
  // decrement stock
  const inv = loadInventory();
  order.items.forEach(it=>{
    if(inv[it.id]) inv[it.id].stock = Math.max(0, (inv[it.id].stock||0) - it.qty);
  });
  saveInventory(inv);
  cart = {}; saveCart(); updateCartCount(); renderCart();
  closeCheckout(); closeCart();
  openOrder(`Order ${order.id} placed successfully! Delivery ETA: 1–2 days.`);
});
if(closeOrderBtn) closeOrderBtn.addEventListener('click', closeOrder);

// Visual feedback: toast, badge pulse, fly-to-cart
function ensureToast(){
  let t = document.querySelector('.toast');
  if(!t){
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  return t;
}
function showToast(msg){
  const t = ensureToast();
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._hideTimer);
  t._hideTimer = setTimeout(()=>t.classList.remove('show'), 1200);
}
function pulseBadge(){
  if(!cartCountEl) return;
  cartCountEl.classList.remove('pulse');
  // force reflow to restart animation
  void cartCountEl.offsetWidth;
  cartCountEl.classList.add('pulse');
}
function animateAdd(buttonEl, pid){
  try{
    pulseBadge();
    showToast('Added to cart');
    const card = buttonEl.closest('.card');
    const srcImg = card ? card.querySelector('.thumb img') : null;
    if(!srcImg || !cartBtn) return;
    const img = document.createElement('img');
    img.src = srcImg.src;
    img.className = 'flying-img';
    img.style.opacity = '1';
    const s = srcImg.getBoundingClientRect();
    const c = cartBtn.getBoundingClientRect();
    img.style.left = s.left + 'px';
    img.style.top = s.top + 'px';
    img.style.width = s.width + 'px';
    img.style.height = s.height + 'px';
    document.body.appendChild(img);
    requestAnimationFrame(()=>{
      const dx = c.left + (c.width/2) - (s.left + s.width/2);
      const dy = c.top + (c.height/2) - (s.top + s.height/2);
      img.style.transform = `translate(${dx}px, ${dy}px) scale(.2)`;
      img.style.opacity = '.2';
    });
    setTimeout(()=>{ img.remove(); }, 650);
  }catch(e){ /* no-op */ }
}

// Orders page rendering (if present)
const ordersListEl = document.getElementById('ordersList');
const ordersEmptyEl = document.getElementById('ordersEmpty');
function renderOrders(){
  const auth = getAuth();
  const all = loadOrders();
  const visible = auth && auth.role==='admin' ? all : all.filter(o=>o.user === (auth? auth.user : 'guest'));
  if(!ordersListEl) return;
  if(visible.length===0){
    if(ordersEmptyEl) ordersEmptyEl.hidden = false;
    ordersListEl.innerHTML = '';
    return;
  }
  if(ordersEmptyEl) ordersEmptyEl.hidden = true;
  ordersListEl.innerHTML = visible.map(o=>{
    const items = o.items.map(it=>{
      const p = PRODUCTS.find(x=>x.id===it.id);
      return `${p? p.name: it.id} × ${it.qty}`;
    }).join(', ');
    const adminControls = (auth && auth.role==='admin')
      ? `<div class="row"><button class="btn" data-adv="${o.id}">Advance Status</button></div>`
      : '';
    return `
      <div class="order-card">
        <div>
          <div class="row between"><strong>${o.id}</strong><span class="badge status">${o.status}</span></div>
          <div class="meta">${new Date(o.when).toLocaleString()} • ${o.user}</div>
          <div class="meta">${items}</div>
          <div class="meta">Total: ${formatINR(o.subtotal)}</div>
        </div>
        ${adminControls}
      </div>`;
  }).join('');

  // bind admin advance
  if(auth && auth.role==='admin'){
    ordersListEl.querySelectorAll('[data-adv]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-adv');
        const list = loadOrders();
        const st = ['Placed','Processing','Out for Delivery','Delivered'];
        const idx = list.findIndex(o=>o.id===id);
        if(idx>=0){
          const cur = list[idx].status;
          const ni = Math.min(st.indexOf(cur)+1, st.length-1);
          list[idx].status = st[ni];
          saveOrders(list);
          renderOrders();
        }
      });
    });
  }
}

// Init
updateCartCount();
updateAuthUI();
if(gridEl) renderGrid();
if(ordersListEl) renderOrders();
