/* ============================================================
   store.js — teras demo: cart, storage, UI kongsi
   Tiada dependency. Semua state dalam localStorage.
   ============================================================ */

const LS_CART = "sericantik.cart.v1";
const LS_ORDER = "sericantik.lastorder.v1";
const LS_WISH = "sericantik.wish.v1";

/* ---------- util ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

/* RM format — buang .00 untuk harga bulat */
function rm(n) {
  const v = Math.round(Number(n) * 100) / 100;
  return "RM" + v.toLocaleString("en-MY", {
    minimumFractionDigits: v % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

const STARS = (n = 5) =>
  `<span class="stars" aria-label="${n} daripada 5 bintang">` +
  Array.from({ length: 5 }, (_, i) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true" style="opacity:${i < n ? 1 : 0.28}"><path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3 6.2 20.4l1.1-6.5L2.6 9.3l6.5-.9z"/></svg>`
  ).join("") + `</span>`;

const STOCK_LABEL = { in: "Stok tersedia", low: "Stok terhad", out: "Habis stok" };

/* ============================================================
   CART
   ============================================================ */
const Cart = {
  items: [],

  load() {
    try {
      const raw = localStorage.getItem(LS_CART);
      this.items = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(this.items)) this.items = [];
    } catch {
      this.items = [];
    }
    // buang item yang produknya dah tak wujud
    this.items = this.items.filter((i) => prodById(i.sku));
    return this.items;
  },

  save() {
    try {
      localStorage.setItem(LS_CART, JSON.stringify(this.items));
    } catch (e) {
      console.warn("cart save failed", e);
    }
    this.emit();
  },

  key(sku, variantId) {
    return variantId ? `${sku}::${variantId}` : sku;
  },

  add(sku, variantId = null, qty = 1) {
    const p = prodById(sku);
    if (!p || p.stock === "out") return false;

    const k = this.key(sku, variantId);
    const found = this.items.find((i) => this.key(i.sku, i.variantId) === k);

    if (found) {
      found.qty = Math.min(found.qty + qty, 99);
    } else {
      this.items.push({ sku, variantId, qty });
    }
    this.save();
    return true;
  },

  remove(sku, variantId = null) {
    const k = this.key(sku, variantId);
    this.items = this.items.filter((i) => this.key(i.sku, i.variantId) !== k);
    this.save();
  },

  setQty(sku, variantId = null, qty) {
    const k = this.key(sku, variantId);
    const it = this.items.find((i) => this.key(i.sku, i.variantId) === k);
    if (!it) return;
    const q = Math.max(1, Math.min(99, parseInt(qty, 10) || 1));
    it.qty = q;
    this.save();
  },

  clear() {
    this.items = [];
    this.save();
  },

  count() {
    return this.items.reduce((s, i) => s + i.qty, 0);
  },

  /* baris dengan harga penuh — variant delta dikira */
  lines() {
    return this.items.map((i) => {
      const p = prodById(i.sku);
      if (!p) return null;
      const v = p.variants?.options.find((o) => o.id === i.variantId) || null;
      const unit = p.price + (v?.delta || 0);
      return {
        sku: p.sku,
        name: p.name,
        cat: p.cat,
        img: p.img,
        palette: p.palette,
        variantName: v?.name || null,
        variantId: i.variantId,
        unit,
        qty: i.qty,
        sum: unit * i.qty,
        compareAt: p.compareAt ? p.compareAt + (v?.delta || 0) : null,
      };
    }).filter(Boolean);
  },

  subtotal() {
    return this.lines().reduce((s, l) => s + l.sum, 0);
  },

  emit() {
    document.dispatchEvent(new CustomEvent("cart:change"));
  },
};

/* ============================================================
   DISCOUNT + SHIPPING (logik tunggal, dipakai semua page)
   ============================================================ */
const Promo = {
  code: null,
  info: null,

  load() {
    try {
      const raw = sessionStorage.getItem("sericantik.promo");
      if (raw) {
        const d = JSON.parse(raw);
        if (d.code && CODES[d.code]) {
          this.code = d.code;
          this.info = CODES[d.code];
        }
      }
    } catch {
      /* ignore */
    }
  },

  save() {
    try {
      if (this.code) sessionStorage.setItem("sericantik.promo", JSON.stringify({ code: this.code }));
      else sessionStorage.removeItem("sericantik.promo");
    } catch {
      /* ignore */
    }
  },

  apply(input) {
    const code = String(input || "").trim().toUpperCase();
    if (!code) return { ok: false, msg: "Masukkan kod diskaun dulu." };
    const rule = CODES[code];
    if (!rule) return { ok: false, msg: "Kod tidak sah. Cuba SERI10." };

    const sub = Cart.subtotal();
    if (sub < rule.min) {
      return { ok: false, msg: `Kod ini perlu belanja minima ${rm(rule.min)}.` };
    }
    this.code = code;
    this.info = rule;
    this.save();
    return { ok: true, msg: `${code} digunakan — ${rule.label}.` };
  },

  clear() {
    this.code = null;
    this.info = null;
    this.save();
  },

  amount() {
    if (!this.info) return 0;
    const sub = Cart.subtotal();
    if (sub < this.info.min) return 0;
    return this.info.type === "pct"
      ? Math.round(sub * (this.info.value / 100) * 100) / 100
      : this.info.value;
  },

  /* sahkan semula bila cart berubah */
  validate() {
    if (!this.info) return;
    if (Cart.subtotal() < this.info.min) {
      this.clear();
    }
  },
};

const Shipping = {
  zone: "semenanjung",

  rule() {
    return SHIP[this.zone] || SHIP.semenanjung;
  },

  fee() {
    const r = this.rule();
    const afterDisc = Cart.subtotal() - Promo.amount();
    if (afterDisc <= 0) return 0;
    return afterDisc >= r.freeAt ? 0 : r.fee;
  },

  remainingForFree() {
    const r = this.rule();
    const afterDisc = Cart.subtotal() - Promo.amount();
    return Math.max(0, r.freeAt - afterDisc);
  },
};

/* jumlah akhir */
function totalDue() {
  const sub = Cart.subtotal();
  const disc = Promo.amount();
  const ship = Shipping.fee();
  return Math.max(0, Math.round((sub - disc + ship) * 100) / 100);
}

/* ============================================================
   WISHLIST (demo ringkas)
   ============================================================ */
const Wish = {
  ids: [],
  load() {
    try {
      this.ids = JSON.parse(localStorage.getItem(LS_WISH) || "[]");
      if (!Array.isArray(this.ids)) this.ids = [];
    } catch {
      this.ids = [];
    }
  },
  toggle(sku) {
    const i = this.ids.indexOf(sku);
    if (i >= 0) this.ids.splice(i, 1);
    else this.ids.push(sku);
    try {
      localStorage.setItem(LS_WISH, JSON.stringify(this.ids));
    } catch {
      /* ignore */
    }
    return this.ids.includes(sku);
  },
  has(sku) {
    return this.ids.includes(sku);
  },
};

/* ============================================================
   TOAST
   ============================================================ */
function toast(msg, icon = "check") {
  let wrap = $(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    wrap.setAttribute("role", "status");
    wrap.setAttribute("aria-live", "polite");
    document.body.appendChild(wrap);
  }

  const icons = {
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="m20 6-11 11-5-5"/></svg>`,
    cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9.5" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12h11L21 7H6"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>`,
  };

  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = (icons[icon] || icons.check) + `<span>${esc(msg)}</span>`;
  wrap.appendChild(el);

  setTimeout(() => {
    el.classList.add("is-out");
    setTimeout(() => el.remove(), 240);
  }, 2400);
}

/* ============================================================
   KOMPONEN: kad produk
   ============================================================ */
function productCard(p, opts = {}) {
  const out = p.stock === "out";
  const badges = [];
  if (out) badges.push('<span class="pbadge pbadge--out">Habis</span>');
  else {
    if (p.badge === "best") badges.push('<span class="pbadge pbadge--best">Best Seller</span>');
    if (p.badge === "new") badges.push('<span class="pbadge pbadge--new">Baru</span>');
    if (p.badge === "bundle") badges.push('<span class="pbadge pbadge--bundle">Bundle</span>');
    if (p.compareAt && !p.badge) {
      const off = Math.round((1 - p.price / p.compareAt) * 100);
      badges.push(`<span class="pbadge pbadge--promo">-${off}%</span>`);
    }
  }

  const cat = CATS.find((c) => c.id === p.cat);
  // BUG FIX: sku.charCodeAt(6) is the same letter for every SKU in a category
  // (SC-FDN-01 / SC-FND-02 -> both 'N'), so every card showed the same rating
  // count. Hash the whole SKU instead so each product gets a stable unique value.
  const h = [...p.sku].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const stars = (h % 2) + 4;                       // 4 or 5, stable per product
  const revCount = (h % 47) + 6;                   // 6–52, stable per product

  return `<article class="pcard reveal">
    <div class="pcard__media">
      <div class="pcard__badges">${badges.join("")}</div>
      <button class="pcard__wish ${Wish.has(p.sku) ? "is-on" : ""}" data-wish="${p.sku}"
        aria-label="Simpan ${esc(p.name)}" aria-pressed="${Wish.has(p.sku)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 20.2S3.8 15 3.8 9.4A4.6 4.6 0 0 1 12 6.4a4.6 4.6 0 0 1 8.2 3c0 5.6-8.2 10.8-8.2 10.8z"/></svg>
      </button>
      <a href="/demo/seri-cantik/produk/?sku=${p.sku}" aria-label="Lihat ${esc(p.name)}">
        ${packshot(p.img, p.palette, p.name)}
      </a>
    </div>
    <div class="pcard__body">
      <div class="pcard__cat">${esc(cat?.name || "")}</div>
      <h3 class="pcard__name"><a href="/demo/seri-cantik/produk/?sku=${p.sku}">${esc(p.name)}</a></h3>
      <div class="pcard__meta">
        ${STARS(stars)}
        <span>(${revCount})</span>
      </div>
      <div class="pcard__price">
        <span class="pcard__now">${rm(p.price)}</span>
        ${p.compareAt ? `<span class="pcard__was">${rm(p.compareAt)}</span>` : ""}
        ${p.compareAt ? `<span class="pcard__off">-${Math.round((1 - p.price / p.compareAt) * 100)}%</span>` : ""}
      </div>
      <div class="pcard__stock pcard__stock--${p.stock}">${STOCK_LABEL[p.stock]}</div>
      <button class="pcard__add" data-add="${p.sku}" ${out ? "disabled" : ""}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
        ${out ? "Habis stok" : p.variants ? "Pilih pilihan" : "Tambah ke troli"}
      </button>
    </div>
  </article>`;
}

/* ============================================================
   HEADER + DRAWER + CART DRAWER (dikongsi semua page)
   ============================================================ */
const ICONS = {
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="9.5" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12h11L21 7H6"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  chev: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m9 6 6 6-6 6"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  minus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/></svg>`,
  truck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 6h11v10H2zM13 10h5l3 3v3h-8"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z"/><path d="m9 12 2 2 4-4"/></svg>`,
  gift: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9h18v3H3zM4 12v8h16v-8M12 9v11"/><path d="M12 9c-2.5 0-4-1-4-3a2 2 0 0 1 4-.5C12 6 12 9 12 9zM12 9c2.5 0 4-1 4-3a2 2 0 0 0-4-.5C12 6 12 9 12 9z"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 4C10 4 4 9 4 16c0 2 .6 3.4.6 3.4S6 21 12 21c7 0 8-8 8-17z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m20 6-11 11-5-5"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`,
  bank: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10l9-6 9 6M5 10v9h14v-9M9 19v-5h6v5"/></svg>`,
  wallet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16 14.5h2"/></svg>`,
  cash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/></svg>`,
};

/** Bina header + drawer + cart drawer ke dalam body. */
function mountChrome(activePage = "home") {
  const catLinks = CATS.map(
    (c) => `<a href="/demo/seri-cantik/shop/?cat=${c.id}" data-catlink="${c.id}">${esc(c.name)}</a>`
  ).join("");

  const hdr = document.createElement("header");
  hdr.className = "hdr";
  hdr.id = "hdr";
  hdr.innerHTML = `
    <div class="wrap hdr__inner">
      <button class="icon-btn burger" id="burger" aria-label="Buka menu" aria-expanded="false" aria-controls="mdrawer">
        <span></span>
      </button>

      <a class="brand" href="/demo/seri-cantik/" aria-label="${esc(STORE.name)} — laman utama">
        <span class="brand__mark" aria-hidden="true">S</span>
        <span>
          <span class="brand__name">${esc(STORE.name.replace(" Store", ""))}</span>
          <span class="brand__sub">Beauty &amp; Wellness</span>
        </span>
      </a>

      <div class="hdr__search only-desktop">
        ${ICONS.search}
        <input type="search" id="hdrSearch" placeholder="Cari produk, contoh: foundation" aria-label="Cari produk">
      </div>

      <div class="hdr__actions">
        <a class="icon-btn only-mobile" href="/demo/seri-cantik/shop/" aria-label="Cari produk">${ICONS.search}</a>
        <button class="icon-btn" id="cartBtn" aria-label="Buka troli" style="position:relative">
          ${ICONS.cart}
          <span class="cart-count" id="cartCount">0</span>
        </button>
      </div>
    </div>
  `;

  const catnav = document.createElement("nav");
  catnav.className = "catnav";
  catnav.setAttribute("aria-label", "Kategori produk");
  catnav.innerHTML = `
    <div class="wrap">
      <div class="catnav__inner">
        <a href="/demo/seri-cantik/shop/" ${activePage === "shop" ? 'class="is-active"' : ""}>Semua Produk</a>
        ${catLinks}
      </div>
    </div>
  `;

  const drawer = document.createElement("div");
  drawer.className = "mdrawer";
  drawer.id = "mdrawer";
  drawer.innerHTML = `
    <div class="mdrawer__scrim" data-close-drawer></div>
    <div class="mdrawer__panel">
      <div class="mdrawer__head">
        <span style="font-family:var(--serif);font-size:19px;font-weight:600">Menu</span>
        <button class="icon-btn mdrawer__close" data-close-drawer aria-label="Tutup menu">${ICONS.close}</button>
      </div>
      <div class="mdrawer__sub">Kategori</div>
      ${CATS.map((c) => `<a class="mlink" href="/demo/seri-cantik/shop/?cat=${c.id}">${esc(c.name)}</a>`).join("")}
      <div class="mdrawer__sub">Lain-lain</div>
      <a class="mlink" href="/demo/seri-cantik/shop/">Semua Produk</a>
      <a class="mlink" href="/demo/seri-cantik/#faq">Soalan Lazim</a>
      <a class="mlink" href="/demo/seri-cantik/#forge">Bina Kedai Sendiri</a>
      <a class="btn btn--rose" href="/demo/seri-cantik/shop/" style="margin-top:20px">Mula Membeli</a>
    </div>
  `;

  const cartBg = document.createElement("div");
  cartBg.className = "cart-bg";
  cartBg.id = "cartBg";
  cartBg.innerHTML = `
    <div class="cart-bg__scrim" data-close-cart></div>
    <aside class="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
      <div class="cart-panel__head">
        <h2 id="cartTitle">Troli Anda</h2>
        <button class="icon-btn cart-panel__close" data-close-cart aria-label="Tutup troli">${ICONS.close}</button>
      </div>
      <div class="cart-panel__body" id="cartBody"></div>
      <div class="cart-panel__foot" id="cartFoot"></div>
    </aside>
  `;

  const body = document.body;
  body.insertBefore(hdr, body.firstChild);
  hdr.after(catnav);
  body.appendChild(drawer);
  body.appendChild(cartBg);

  /* --- events --- */
  const nav = $("#hdr");
  const onScroll = () => {
    nav.classList.toggle("is-stuck", window.scrollY > 8);
    /* the persistent Forge CTA is mounted in each page's markup, which can
       appear after this script — query it lazily, never cache it here */
    const mobar = $("#mobar");
    if (mobar) {
      const show = window.scrollY > 260 && window.innerWidth <= 760;
      mobar.classList.toggle("is-on", show);
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  $("#burger")?.addEventListener("click", () => {
    drawer.classList.add("is-open");
    document.body.classList.add("no-scroll");
  });
  $$("[data-close-drawer]").forEach((b) =>
    b.addEventListener("click", () => {
      drawer.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    })
  );

  $("#cartBtn")?.addEventListener("click", openCart);
  $$("[data-close-cart]").forEach((b) => b.addEventListener("click", closeCart));

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    drawer.classList.remove("is-open");
    closeCart();
  });

  const hs = $("#hdrSearch");
  if (hs) {
    hs.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && hs.value.trim()) {
        location.href = `/demo/seri-cantik/shop/?q=${encodeURIComponent(hs.value.trim())}`;
      }
    });
  }

  Cart.load();
  Wish.load();
  Promo.load();
  Promo.validate();
  syncCartUI();

  document.addEventListener("cart:change", syncCartUI);
}

function openCart() {
  renderCart();
  $("#cartBg")?.classList.add("is-open");
  document.body.classList.add("no-scroll");
}
function closeCart() {
  $("#cartBg")?.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
}

function syncCartUI() {
  const n = Cart.count();
  const el = $("#cartCount");
  if (el) {
    el.textContent = n > 99 ? "99+" : String(n);
    el.classList.toggle("is-on", n > 0);
  }
}

/* ---------- render isi troli ---------- */
function renderCart() {
  const body = $("#cartBody");
  const foot = $("#cartFoot");
  if (!body || !foot) return;

  const lines = Cart.lines();

  if (!lines.length) {
    body.innerHTML = `
      <div class="cart-empty">
        ${ICONS.bag}
        <b>Troli masih kosong</b>
        <p>Jom pilih produk dulu.</p>
        <a class="btn btn--rose btn--sm" href="/demo/seri-cantik/shop/">Lihat Produk</a>
      </div>`;
    foot.innerHTML = "";
    return;
  }

  body.innerHTML = lines.map((l) => `
    <div class="citem">
      <div class="citem__img">${packshot(l.img, l.palette, l.name)}</div>
      <div>
        <div class="citem__name">${esc(l.name)}</div>
        ${l.variantName ? `<div class="citem__var">${esc(l.variantName)}</div>` : ""}
        <div class="citem__price">${rm(l.unit)}${l.compareAt ? `<s>${rm(l.compareAt)}</s>` : ""}</div>
        <div class="qty" style="margin-top:7px">
          <button data-qty-dec="${l.sku}" data-v="${l.variantId || ""}" aria-label="Kurangkan">−</button>
          <input type="number" value="${l.qty}" min="1" max="99" data-qty-in="${l.sku}" data-v="${l.variantId || ""}" aria-label="Kuantiti ${esc(l.name)}">
          <button data-qty-inc="${l.sku}" data-v="${l.variantId || ""}" aria-label="Tambah">+</button>
        </div>
      </div>
      <div class="citem__right">
        <button class="citem__del" data-del="${l.sku}" data-v="${l.variantId || ""}" aria-label="Buang ${esc(l.name)}">${ICONS.trash}</button>
        <b style="font-size:12.5px">${rm(l.sum)}</b>
      </div>
    </div>
  `).join("");

  const sub = Cart.subtotal();
  const disc = Promo.amount();
  const ship = Shipping.fee();
  const remain = Shipping.remainingForFree();
  const pct = Math.min(100, ((Shipping.rule().freeAt - remain) / Shipping.rule().freeAt) * 100);

  foot.innerHTML = `
    ${remain > 0
      ? `<div class="ship-bar">Tambah <b>${rm(remain)}</b> lagi untuk penghantaran percuma
           <div class="ship-bar__track"><div class="ship-bar__fill" style="width:${pct}%"></div></div>
         </div>`
      : `<div class="ship-bar" style="color:var(--sage);font-weight:650">✓ Anda dapat penghantaran percuma</div>`}

    <div class="cart-line"><span>Subtotal</span><span>${rm(sub)}</span></div>
    ${disc > 0 ? `<div class="cart-line cart-line--disc"><span>Diskaun (${Promo.code})</span><span>−${rm(disc)}</span></div>` : ""}
    <div class="cart-line"><span>Penghantaran</span><span>${ship === 0 ? "Percuma" : rm(ship)}</span></div>
    <div class="cart-line cart-line--total"><span>Jumlah</span><span>${rm(totalDue())}</span></div>

    <a class="btn btn--rose btn--block" href="/demo/seri-cantik/checkout/">Teruskan ke Pembayaran ${ICONS.arrow}</a>
    <p class="tiny" style="text-align:center;margin-top:8px">Pesanan demo — tiada bayaran sebenar</p>
  `;

  /* butang kuantiti */
  $$("[data-qty-inc]", foot).forEach(() => {});
  bindCartControls();

  function bindCartControls() {
    $$("[data-qty-inc]").forEach((b) =>
      b.addEventListener("click", () => {
        const l = Cart.lines().find((x) => x.sku === b.dataset.qtyInc && (x.variantId || "") === b.dataset.v);
        Cart.setQty(b.dataset.qtyInc, b.dataset.v || null, (l?.qty || 1) + 1);
        renderCart();
      })
    );
    $$("[data-qty-dec]").forEach((b) =>
      b.addEventListener("click", () => {
        const l = Cart.lines().find((x) => x.sku === b.dataset.qtyDec && (x.variantId || "") === b.dataset.v);
        if (!l) return;
        if (l.qty <= 1) {
          Cart.remove(b.dataset.qtyDec, b.dataset.v || null);
        } else {
          Cart.setQty(b.dataset.qtyDec, b.dataset.v || null, l.qty - 1);
        }
        renderCart();
      })
    );
    $$("[data-qty-in]").forEach((inp) =>
      inp.addEventListener("change", () => {
        Cart.setQty(inp.dataset.qtyIn, inp.dataset.v || null, inp.value);
        renderCart();
      })
    );
    $$("[data-del]").forEach((b) =>
      b.addEventListener("click", () => {
        Cart.remove(b.dataset.del, b.dataset.v || null);
        renderCart();
        toast("Produk dibuang dari troli");
      })
    );
  }
}

/* ============================================================
   TINDAKAN "TAMBAH KE TROLI" GLOBAL
   ============================================================ */
function bindAddButtons(root = document) {
  $$("[data-add]", root).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const sku = btn.dataset.add;
      const p = prodById(sku);
      if (!p) return;

      // produk ada variant → pergi detail page
      if (p.variants) {
        location.href = `/demo/seri-cantik/produk/?sku=${sku}`;
        return;
      }
      if (p.stock === "out") {
        toast("Maaf, produk ini habis stok", "info");
        return;
      }
      Cart.add(sku, null, 1);
      toast(`${p.name} ditambah ke troli`, "cart");
      openCart();
    });
  });

  $$("[data-wish]", root).forEach((btn) => {
    btn.addEventListener("click", () => {
      const on = Wish.toggle(btn.dataset.wish);
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", String(on));
      toast(on ? "Disimpan ke senarai suka" : "Dibuang dari senarai suka");
    });
  });
}

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
function initReveal() {
  if (!("IntersectionObserver" in window)) {
    $$(".reveal").forEach((e) => e.classList.add("is-in"));
    return;
  }
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $$(".reveal").forEach((e) => e.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
  );
  $$(".reveal").forEach((e) => io.observe(e));

  /* Fail-safe. Content must never be permanently invisible just because the
     observer did not fire (throttled tab, print, full-page screenshot,
     programmatic scroll). Anything still hidden after 1.2s is shown. */
  setTimeout(() => {
    $$(".reveal:not(.is-in)").forEach((e) => {
      const r = e.getBoundingClientRect();
      if (r.top < window.innerHeight * 2.2) e.classList.add("is-in");
    });
  }, 1200);

  /* Observers do not run while the document is hidden; force-show on return. */
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) $$(".reveal:not(.is-in)").forEach((e) => {
      if (e.getBoundingClientRect().top < window.innerHeight * 2.2) e.classList.add("is-in");
    });
  });

  window.addEventListener("beforeprint", () =>
    $$(".reveal").forEach((e) => e.classList.add("is-in")));
}

/* ============================================================
   NO. PESANAN DEMO
   ============================================================ */
function makeOrderNo() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SC-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${rand}`;
}
