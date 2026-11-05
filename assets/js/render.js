/* ============================================================
   render.js — builds sections from CONFIG
   All copy lives in config.js, not here.
   ============================================================ */

/* ---------- Product illustration SVGs (no stock photos) ---------- */
const ART = {
  mug: `<svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <path d="M26 32h40v30a20 20 0 0 1-20 20 20 20 0 0 1-20-20V32z" fill="#e8dfd2"/>
    <path d="M26 32h40v10H26z" fill="#d9cdba"/>
    <path d="M66 40h6a9 9 0 0 1 0 18h-6" stroke="#c9b9a1" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="46" cy="32" rx="20" ry="4.5" fill="#f2ece2"/>
  </svg>`,
  vase: `<svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <path d="M44 20h12v10c9 5 15 14 15 25 0 13-9 23-21 23s-21-10-21-23c0-11 6-20 15-25V20z" fill="#cfd8cd"/>
    <path d="M38 44c4-3 10-4 14-2" stroke="#b4c2b2" stroke-width="3" stroke-linecap="round"/>
    <path d="M50 20v-6" stroke="#9aa89a" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="11" r="4" fill="#c2b09a"/>
  </svg>`,
  bag: `<svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <path d="M22 36h56l-5 44a6 6 0 0 1-6 5H33a6 6 0 0 1-6-5L22 36z" fill="#dcc3b0"/>
    <path d="M36 36V26a14 14 0 0 1 28 0v10" stroke="#c4a691" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M34 50h32" stroke="#c4a691" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  candle: `<svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <rect x="32" y="40" width="36" height="42" rx="6" fill="#efe3d0"/>
    <rect x="32" y="40" width="36" height="8" rx="4" fill="#e2d2b9"/>
    <path d="M50 30c4-6 6-10 6-14 0-3-2-5-6-5s-6 2-6 5c0 4 2 8 6 14z" fill="#f2b872"/>
    <path d="M50 34v6" stroke="#8d7b66" stroke-width="2.6" stroke-linecap="round"/>
  </svg>`,
  plate: `<svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <circle cx="50" cy="50" r="30" fill="#e6ded1"/>
    <circle cx="50" cy="50" r="20" fill="#f4efe6"/>
    <circle cx="50" cy="50" r="7" fill="#d8cbB8"/>
  </svg>`,
  bowl: `<svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <path d="M20 44h60c0 16-13 28-30 28S20 60 20 44z" fill="#cdd6ce"/>
    <ellipse cx="50" cy="44" rx="30" ry="6" fill="#e3eae2"/>
    <path d="M34 78h32" stroke="#b6c2b6" stroke-width="3.5" stroke-linecap="round"/>
  </svg>`,
  teapot: `<svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <ellipse cx="50" cy="56" rx="26" ry="21" fill="#d9c8b4"/>
    <path d="M76 48c8 2 11 8 9 15" stroke="#c3ae97" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M50 35c0-6 5-9 5-13" stroke="#b9a78f" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="55" cy="21" r="3.4" fill="#c3ae97"/>
    <ellipse cx="50" cy="36" rx="12" ry="3.4" fill="#e8dccb"/>
  </svg>`,
  towel: `<svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
    <rect x="24" y="26" width="52" height="48" rx="7" fill="#d6dcd4"/>
    <path d="M24 40h52M24 56h52" stroke="#bcc5bb" stroke-width="3"/>
    <rect x="24" y="26" width="52" height="8" rx="4" fill="#c2cbc0"/>
  </svg>`,
};

/* ---------- Mock hero products (tiny cards in the browser mock) ---------- */
const MOCK_PRODUCTS = [
  { name: "Stoneware mug", price: "RM38", art: "mug" },
  { name: "Bud vase", price: "RM52", art: "vase" },
  { name: "Soy candle", price: "RM45", art: "candle" },
];

/* ---------- Demo storefront products (illustrative) ---------- */
const DEMO_PRODUCTS = [
  { name: "Ridged Mug — Cream", cat: "Ceramics", price: 38, art: "mug", tag: "New" },
  { name: "Bud Vase — Sage", cat: "Ceramics", price: 52, art: "vase" },
  { name: "Soy Candle — Cedar", cat: "Home", price: 45, art: "candle" },
  { name: "Linen Tote — Clay", cat: "Textiles", price: 89, art: "bag", tag: "Bestseller" },
  { name: "Serving Plate", cat: "Tableware", price: 74, art: "plate" },
  { name: "Nesting Bowl Set", cat: "Tableware", price: 128, art: "bowl" },
  { name: "Stoneware Teapot", cat: "Ceramics", price: 165, art: "teapot" },
  { name: "Waffle Hand Towel", cat: "Textiles", price: 34, art: "towel" },
];

/* ---------- Feature icons ---------- */
const FEATURE_ICONS = {
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="9.5" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12h11L21 7H6"/></svg>`,
  checkout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h4"/></svg>`,
  mobile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 19h2"/></svg>`,
  orders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>`,
  payment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="2.5" y="6" width="19" height="13" rx="2.5"/><path d="M2.5 10.5h19M6 15h3"/></svg>`,
  brand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18 4.5 4.5 0 0 0 0-9 4.5 4.5 0 0 1 0-9z"/></svg>`,
};

const CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>`;
const CROSS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>`;
const PLUS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`;

/* ---------- helpers ---------- */
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const money = (n) => CONFIG.pricing.currency + n.toLocaleString("en-MY");

/* ---------- mock hero products ---------- */
function renderMockProducts() {
  const desk = document.querySelector("[data-mock-products]");
  const phone = document.querySelector("[data-mock-products-mobile]");

  if (desk) {
    desk.innerHTML = MOCK_PRODUCTS.map(
      (p) => `<div class="sf-card">
        <div class="sf-thumb">${ART[p.art]}</div>
        <div class="sf-body">
          <div class="nm">${esc(p.name)}</div>
          <div class="pr">${esc(p.price)}</div>
        </div>
      </div>`
    ).join("");
  }

  if (phone) {
    phone.innerHTML = MOCK_PRODUCTS.slice(0, 4)
      .concat(MOCK_PRODUCTS[0])
      .slice(0, 4)
      .map(
        (p) => `<div class="ph-card">
          <div class="ph-thumb">${ART[p.art]}</div>
          <div class="ph-body">
            <div class="nm">${esc(p.name)}</div>
            <div class="pr">${esc(p.price)}</div>
          </div>
        </div>`
      )
      .join("");
  }
}

/* ---------- journey ---------- */
function renderJourney() {
  const el = document.querySelector("[data-journey]");
  if (!el) return;
  el.innerHTML = CONFIG.copy.solution.journey
    .map(
      (s) => `<div class="journey__step">
        <div class="journey__dot">${s.n}</div>
        <div>
          <h4>${esc(s.title)}</h4>
          <p>${esc(s.desc)}</p>
        </div>
      </div>`
    )
    .join("");
}

/* ---------- features ---------- */
function renderFeatures() {
  const el = document.querySelector("[data-features]");
  if (!el) return;
  el.innerHTML = CONFIG.copy.features.items
    .map(
      (f) => `<article class="feature">
        <div class="feature__ico">${FEATURE_ICONS[f.icon] || FEATURE_ICONS.grid}</div>
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.desc)}</p>
      </article>`
    )
    .join("");
}

/* ---------- steps ---------- */
function renderSteps() {
  const el = document.querySelector("[data-steps]");
  if (!el) return;
  el.innerHTML = CONFIG.timeline.steps
    .map(
      (s) => `<div class="step">
        <div class="step__n">${String(s.n).padStart(2, "0")}</div>
        <div>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.desc)}</p>
        </div>
        <span class="step__time">${esc(s.time)}</span>
      </div>`
    )
    .join("");

  const note = document.querySelector("[data-timeline-note]");
  if (note) note.textContent = CONFIG.timeline.note;
}

/* ---------- pricing ---------- */
function renderPricing() {
  const el = document.querySelector("[data-pricing]");
  if (!el) return;

  el.innerHTML = CONFIG.pricing.packages
    .map((p) => {
      const featured = p.highlighted;
      return `<article class="price-card ${featured ? "price-card--hl" : ""}">
        ${p.badge ? `<span class="price-badge">${esc(p.badge)}</span>` : ""}
        <div class="price-card__name">${esc(p.name)}</div>
        <div class="price-card__tag">${esc(p.tagline)}</div>

        <div class="price-card__amount">
          <span class="price-card__cur">${CONFIG.pricing.currency}</span>
          <span class="price-card__num">${p.price.toLocaleString("en-MY")}</span>
          <span class="price-card__per">${esc(p.priceNote)}</span>
        </div>

        <div class="price-card__best">Best for <b>${esc(p.bestFor)}</b></div>

        <a class="btn ${featured ? "btn--primary" : "btn--ghost"}" href="#" data-wa-pkg="${esc(p.id)}">
          ${esc(p.cta)}
        </a>

        <ul class="price-feats">
          ${p.features.map((f) => `<li>${CHECK}<span>${esc(f)}</span></li>`).join("")}
          ${(p.notIncluded || []).map((f) => `<li class="is-off">${CROSS}<span>${esc(f)}</span></li>`).join("")}
        </ul>

        ${p.caveat ? `<p class="price-card__caveat">${esc(p.caveat)}</p>` : ""}
      </article>`;
    })
    .join("");

  // maintenance strip
  const m = document.querySelector("[data-maintenance]");
  if (m) {
    const mn = CONFIG.pricing.maintenance;
    m.innerHTML = `
      <div class="maint__price">
        <span class="price-card__cur">${CONFIG.pricing.currency}</span>
        <b>${mn.price}</b>
        <span class="price-card__per">/${esc(mn.unit)}</span>
      </div>
      <div class="maint__body">
        <h4>${esc(mn.label)}</h4>
        <p>${esc(mn.description)}</p>
      </div>
      <a class="btn btn--ghost btn--sm" href="#" data-wa-msg="Hi, I'd like to ask about the optional maintenance plan.">Ask about it</a>
    `;
  }

  const pn = document.querySelector("[data-price-note]");
  if (pn) {
    pn.textContent = `${CONFIG.pricing.note} All prices are in Malaysian Ringgit and exclude any applicable taxes.`;
  }
}

/* ---------- comparison table ---------- */
function renderComparison() {
  const table = document.querySelector("[data-comparison]");
  if (!table) return;

  const pkgs = CONFIG.pricing.packages;
  const cell = (v) => {
    if (v === true) return `<span class="yes">${CHECK}</span>`;
    if (v === false) return `<span class="no">—</span>`;
    return `<span class="val">${esc(v)}</span>`;
  };

  table.innerHTML = `
    <thead>
      <tr>
        <th scope="col">Feature</th>
        ${pkgs.map((p) => `<th scope="col" class="${p.highlighted ? "is-hl" : ""}">
          ${esc(p.name)}${p.highlighted ? `<span class="cmp-rec">Recommended</span>` : ""}
        </th>`).join("")}
      </tr>
    </thead>
    <tbody>
      ${CONFIG.comparison.rows
        .map(
          (r) => `<tr>
            <td>${esc(r.label)}</td>
            ${pkgs.map((p) => `<td class="${p.highlighted ? "is-hl" : ""}">${cell(r[p.id])}</td>`).join("")}
          </tr>`
        )
        .join("")}
    </tbody>
  `;
}

/* ---------- demo storefront ---------- */
function renderDemo() {
  const grid = document.querySelector("[data-demo-products]");
  if (grid) {
    grid.innerHTML = DEMO_PRODUCTS.map(
      (p) => `<div class="pcard">
        <div class="pcard__img">
          ${p.tag ? `<span class="pcard__tag ${p.tag === "New" ? "pcard__tag--new" : ""}">${esc(p.tag)}</span>` : ""}
          ${ART[p.art]}
        </div>
        <div class="pcard__body">
          <div class="pcard__cat">${esc(p.cat)}</div>
          <div class="pcard__name">${esc(p.name)}</div>
          <div class="pcard__row">
            <span class="pcard__price">${money(p.price)}</span>
            <span class="pcard__add">Add</span>
          </div>
        </div>
      </div>`
    ).join("");
  }

  const art = document.querySelector(".ds__art");
  if (art) art.innerHTML = ART.teapot;
}

/* ---------- FAQ ---------- */
function renderFaq() {
  const el = document.querySelector("[data-faq]");
  if (!el) return;

  el.innerHTML = CONFIG.faq
    .map(
      (f, i) => `<div class="faq__item">
        <button class="faq__q" aria-expanded="false" aria-controls="faq-a-${i}">
          <span>${esc(f.q)}</span>
          <span class="faq__ico" aria-hidden="true">${PLUS}</span>
        </button>
        <div class="faq__a" id="faq-a-${i}">
          <div><p>${esc(f.a)}</p></div>
        </div>
      </div>`
    )
    .join("");
}

/* ---------- config-driven text ---------- */
function renderConfigText() {
  // brand name everywhere
  document.querySelectorAll("[data-brand-name]").forEach((el) => {
    el.textContent = CONFIG.brand.name;
  });

  const tag = document.querySelector("[data-brand-tagline]");
  if (tag) tag.textContent = CONFIG.brand.tagline;

  // page title + meta
  document.title = CONFIG.seo.title;
  const setMeta = (sel, attr, val) => {
    const el = document.querySelector(sel);
    if (el) el.setAttribute(attr, val);
  };
  setMeta('meta[name="description"]', "content", CONFIG.seo.description);
  setMeta('meta[name="keywords"]', "content", CONFIG.seo.keywords);
  setMeta('meta[property="og:title"]', "content", CONFIG.seo.title);
  setMeta('meta[property="og:description"]', "content", CONFIG.seo.description);
  setMeta('meta[property="og:url"]', "content", CONFIG.seo.url);
  setMeta('meta[name="twitter:title"]', "content", CONFIG.seo.title);
  setMeta('meta[name="twitter:description"]', "content", CONFIG.seo.description);
  setMeta('link[rel="canonical"]', "href", CONFIG.seo.url);

  // contact
  document.querySelectorAll("[data-hours]").forEach((el) => {
    el.textContent = CONFIG.contact.hours;
  });
  document.querySelectorAll("[data-location]").forEach((el) => {
    el.textContent = CONFIG.contact.location;
  });
  document.querySelectorAll("[data-email]").forEach((el) => {
    el.setAttribute("href", `mailto:${CONFIG.contact.email}`);
    if (el.tagName === "A" && el.children.length === 0) {
      el.textContent = CONFIG.contact.email;
    } else if (el.tagName === "A") {
      const span = el.querySelector("span");
      if (span) span.textContent = CONFIG.contact.email;
    }
  });

  // socials
  document.querySelectorAll("[data-social]").forEach((a) => {
    const key = a.dataset.social;
    if (CONFIG.socials[key]) a.setAttribute("href", CONFIG.socials[key]);
  });

  // year
  const yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();

  // package dropdown in the form
  const sel = document.querySelector("#f-package");
  if (sel) {
    sel.innerHTML =
      `<option value="">Not sure yet — help me choose</option>` +
      CONFIG.pricing.packages
        .map(
          (p) =>
            `<option value="${p.id}">${esc(p.name)} — ${money(p.price)}</option>`
        )
        .join("");
  }
}

/* ---------- expose ---------- */
window.__render = {
  renderMockProducts,
  renderJourney,
  renderFeatures,
  renderSteps,
  renderPricing,
  renderComparison,
  renderDemo,
  renderFaq,
  renderConfigText,
};
