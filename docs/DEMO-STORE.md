# Seri Cantik Store — Malaysian Beauty & Wellness Demo Store

A **fictional, fully functional** Malaysian beauty and wellness e-commerce
storefront, embedded in the Forge Sales project as a live sales demo.

**Local demo:** `http://127.0.0.1:8790/demo/seri-cantik/`
**Production URL (once deployed):** `https://forgesales.pages.dev/demo/seri-cantik/`

> ⚠️ **This is a demonstration store.** Every product, price, review, stock
> level and rating is fictional. It is **not** an official D'Herbs store, not
> an authorised distributor, and has **no affiliation, partnership or
> endorsement** from Dato' Aliff Syukri or any real brand. No real payment is
> taken and no goods are shipped. This is stated on the homepage, in the
> footer of every page, in an announcement bar, on the product pages and at
> checkout.

---

## Why it exists

Forge Sales sells e-commerce websites to Malaysian SMEs. Buyers need to touch
a real store before they trust one. This demo is the proof: a complete
13-step customer journey — browse, search, filter, sort, select variants,
cart, discount codes, delivery calculation, checkout, order confirmation —
local, functional, deployed as a sub-path inside the existing site so it
adds **zero** new infrastructure cost.

---

## Quick start

```bash
cd storefront-my
python -m http.server 8790
```

| Page | URL |
|---|---|
| Demo home | http://127.0.0.1:8790/demo/seri-cantik/ |
| Shop / listing | http://127.0.0.1:8790/demo/seri-cantik/shop/ |
| Product detail | http://127.0.0.1:8790/demo/seri-cantik/produk/?sku=SC-FDN-01 |
| Checkout | http://127.0.0.1:8790/demo/seri-cantik/checkout/ |
| Order confirmation | http://127.0.0.1:8790/demo/seri-cantik/order/ |
| Forge landing | http://127.0.0.1:8790/index.html?preview=1 |

No build step. No npm. No dependencies. Open the folder and it runs.

---

## What's implemented

### Catalogue
- **18 demo products** across 4 categories: Penjagaan Wajah (7),
  Penjagaan Badan (4), Pelangsingan & Wellness (4), Penjagaan Intim (3).
- Each product has: name, category, packshot, demo price, compare-at price,
  short description, detail bullets, stock status, SKU, variants where
  applicable, badge, rating and review count.
- Packshots are **generated SVG**, drawn per product in `assets/js/packshot.js`.
  They use fictional "Seri Cantik" labelling — no real brand logo, no
  reproduced real packaging.

### Shopping
| Feature | Where |
|---|---|
| Search (name, category, description, SKU) | Shop page, header, mobile |
| Category filter with live counts | Shop page chips |
| Sort: popular / price asc / price desc / newest | Shop page |
| Product detail with variant selector | `produk/?sku=…` |
| Quantity steppers (PDP + cart) | Both |
| Add / remove / update cart | Cart drawer on every page |
| Subtotal, shipping, discount, total | Cart + checkout |
| Demo discount codes | Checkout |
| Cart persistence | `localStorage['sericantik.cart.v1']` |
| Wishlist | `localStorage['sericantik.wish.v1']` |

### Promotions (all arithmetic verified)
| Code | Rule |
|---|---|
| `SERI10` | 10% off, no minimum |
| `CANTIK20` | 20% off, minimum spend RM150 |
| `JIMAT30` | RM30 off, minimum spend RM250 |
| Free shipping | Automatic above RM100 |
| Shipping fee | RM8 (Semenanjung) / RM14 (Sabah & Sarawak) |

### Checkout (fully simulated)
1. Customer name, email, Malaysian phone (validated), address, postcode
   (5-digit), state (16 states + WP), delivery instructions.
2. Payment method: FPX (demo) / e-wallet (demo) / COD (demo).
3. Delivery zone selector affecting the shipping fee.
4. Order number generated (`SC-YYYYMMDD-XXXX`), full confirmation page,
   cart cleared on success.
5. **No payment credentials are collected or stored.** The page says so in
   three places.

---

## Files

```
storefront-my/
├── demo/seri-cantik/
│   ├── index.html              storefront home (11 sections)
│   ├── shop/index.html         listing: search, filter, sort
│   ├── produk/index.html       product detail (reads ?sku=)
│   ├── checkout/index.html     simulated checkout
│   ├── order/index.html        order confirmation (reads session)
│   └── assets/
│       ├── css/store.css       design system (~2.4k lines)
│       └── js/
│           ├── data.js         18 products, 4 categories, promos, reviews, FAQ
│           ├── packshot.js     generated SVG packshots (9 forms × 5 palettes)
│           └── store.js        cart, storage, chrome, PDP, checkout
├── docs/
│   ├── qa_demo.py              117 automated checks
│   ├── shots_demo.py           32 screenshots (desktop + mobile)
│   ├── demo-shots/             screenshot output
│   └── DEMO-STORE.md           this file
├── assets/js/config.js         Forge Sales central config (pricing, WhatsApp)
└── index.html                  Forge landing — preview now shows Seri Cantik
```

---

## Forge Sales integration

On the existing landing page (`index.html`):

- The demo storefront preview now shows **Seri Cantik Store** with 8 real
  beauty packshots, replacing the old "Studio Rumah" ceramics store.
- **"Cuba Live Demo"** (`/demo/seri-cantik/`) and **"Bina Kedai Online Anda"**
  (WhatsApp enquiry) sit side by side under the preview.
- All existing pricing, WhatsApp CTAs and the enquiry form are untouched.
  `docs/qa.py` still passes **42/42**.

Inside the demo, a persistent CTA — *"Mahukan kedai online seperti ini untuk
bisnes anda?"* → **"Dapatkan Kedai Online Saya"** — appears in the footer of
every page and as a sticky bar on mobile (visible after 260px of scroll,
hidden on desktop, body padding reserves its height so it never covers
content).

---

## Running QA

```bash
# Windows: use the native interpreter, not the Hermes venv
"C:/Users/mrsai/AppData/Local/Programs/Python/Python311/python.exe" docs/qa_demo.py
"C:/Users/mrsai/AppData/Local/Programs/Python/Python311/python.exe" docs/qa.py

# screenshots
"C:/Users/mrsai/AppData/Local/Programs/Python/Python311/python.exe" docs/shots_demo.py
```

Requires a local server on port 8790 with Playwright installed.

**Current result: 117/117 demo checks, 42/42 landing checks.**

---

## Deploying to Cloudflare Pages

No config changes are needed — the demo is plain static files under a
sub-path of the existing project.

```bash
cd storefront-my
wrangler pages deploy . --project-name=forgesales --branch=master --commit-dirty=true
```

Then verify:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://forgesales.pages.dev/demo/seri-cantik/
curl -s -o /dev/null -w "%{http_code}\n" https://forgesales.pages.dev/demo/seri-cantik/shop/
curl -s -o /dev/null -w "%{http_code}\n" https://forgesales.pages.dev/demo/seri-cantik/checkout/
```

Trailing slashes matter — every internal link uses `/demo/seri-cantik/.../`
form so Pages serves the directory index with zero redirect hops (the same
lesson learned from the `privacy.html` redirect loop).

---

## Before this becomes a real store

The demo is honest about what it is. To turn it into a real shop you would
need, at minimum:

| Gap | What's required |
|---|---|
| No payment gateway | Real FPX/card integration, merchant account, PCI scope |
| No backend | Order storage (D1/Supabase), inventory sync, email receipts |
| No real stock | Live inventory, oversell protection |
| Fake reviews | Real, verifiable reviews — or remove the section entirely |
| Fake prices | Real supplier costs and margins |
| No shipping API | Courier integration (J&T, Ninja Van, PosLaju) |
| No PDPA compliance | Privacy notice, consent capture, data retention policy |
| No real products | Licensed product photography and authorised brand assets |

The disclaimer and the "demo" labelling must stay until every row above is
genuinely resolved — removing them while the store is still simulated would
be misleading to customers.

---

## Design decisions

- **Same stack as the parent site** — plain HTML/CSS/JS, no framework. The
  brief said reuse the existing architecture; introducing React for a demo
  would have doubled the deploy surface for no user benefit.
- **Absolute paths for demo routes** (`/demo/seri-cantik/...`) so pages work
  identically on `python -m http.server` and Cloudflare Pages.
- **`localStorage` over cookies** — no server, so the cart is client-only by
  design. The key is versioned (`v1`) so a schema change can't corrupt an
  old cart.
- **Generated SVG packshots** — the brief forbade copying real packaging. SVG
  keeps the repo tiny (no binary assets) and renders crisp at every size.
- **Discounts computed in one place** (`Promo` in `store.js`) so the cart,
  checkout and confirmation page can never disagree.
- **Fail-safe scroll reveal** — content fades in on scroll, but anything still
  hidden after 1.2s is force-shown. Without this, a throttled tab or a
  full-page screenshot leaves most of the catalogue at `opacity: 0`.
