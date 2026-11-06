# Forge Sales — E-Commerce Service Sales Page

Live: **https://forgesales.pages.dev**

A sales landing page for an e-commerce website development service in Malaysia.
Built to convert Facebook-ad traffic into WhatsApp enquiries.

It also ships a **live, fully functional Malaysian beauty & wellness demo
store** at `/demo/seri-cantik/` — 18 products, real cart, search, filters,
variants, discount codes, delivery calculation and a complete simulated
checkout. See `docs/DEMO-STORE.md` for that subsystem.

**Stack:** plain HTML + CSS + vanilla JS. No build step, no framework, no dependencies.
Deploys to Cloudflare Pages by pointing at the folder.

---

## Quick start

```bash
# from the project root
python -m http.server 8790
# open http://127.0.0.1:8790/index.html
```

`file://` works too, but a local server is closer to production.

---

## What's in the box

```
storefront-my/
├── index.html              sales page (all sections)
├── privacy/index.html      Privacy Policy (PDPA 2010 template)
├── terms/index.html        Terms & Conditions (template)
├── demo/seri-cantik/       ★ live demo store (see docs/DEMO-STORE.md)
├── assets/
│   ├── css/app.css         design system + all sections (~3k lines)
│   └── js/
│       ├── config.js       ★ EVERYTHING EDITABLE LIVES HERE
│       ├── render.js       builds sections from CONFIG
│       └── app.js          nav, WhatsApp, form, FAQ, reveal
├── docs/
│   ├── RESEARCH.md         competitor + conversion notes
│   ├── qa.py               landing QA (42 checks)
│   ├── qa_demo.py          demo store QA (117 checks)
│   ├── shots_demo.py       demo screenshots (32)
│   ├── shots.py            screenshot generator (26 shots)
│   ├── qa.log              latest QA run
│   └── screenshots/        desktop, tablet, mobile captures
└── README.md
```

---

## The one file you edit

**`assets/js/config.js`** drives the entire page. Nothing is hardcoded in the HTML
except the layout structure.

| What | Where in config.js |
|---|---|
| Brand name, tagline | `brand` |
| WhatsApp number, email, hours, location | `contact` |
| Facebook / Instagram / TikTok URLs | `socials` |
| Prices, package features, CTAs, badges | `pricing.packages` |
| Maintenance plan | `pricing.maintenance` |
| Feature comparison table | `comparison.rows` |
| FAQ questions and answers | `faq` |
| Page title, meta description, canonical URL | `seo` |
| Enquiry form endpoint (optional) | `formEndpoint` |

### Change the WhatsApp number

```js
// assets/js/config.js
contact: {
  whatsapp: "60123456789",        // ← your number: 60 + number, digits only
  whatsappIsPlaceholder: false,    // ← set false so the setup notice stops
  ...
}
```

Format: country code, no `+`, no spaces, no dashes. `012-345 6789` becomes `60123456789`.

> Keyed-in the wrong format? Every WhatsApp link breaks silently. Test one link
> after changing it: it should open WhatsApp with a message already typed.

### Change a price

```js
pricing: {
  packages: [
    { id: "starter",  name: "Starter",  price: 1499, ... },
    { id: "business", name: "Business", price: 2499, ... },
    { id: "premium",  name: "Premium",  price: 3999, ... },
  ]
}
```

The pricing cards, the comparison table, the form dropdown and every WhatsApp
message all read from this. Change it once, it updates everywhere.

**`id` must stay `starter` / `business` / `premium`** — those keys link the
comparison table rows to the packages.

---

## Deploy to Cloudflare Pages

### Option A — drag and drop (fastest, no account setup beyond Cloudflare)

1. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages → Upload assets**
2. Drag the **whole project folder** (not a zip of the parent folder — the folder
   itself, so `index.html` sits at the root)
3. Deploy. You get `your-project.pages.dev` immediately.

### Option B — Wrangler CLI

```bash
npm install -g wrangler
wrangler login
cd forgesales
wrangler pages project create forgesales --production-branch=main
wrangler pages deploy . --project-name=forgesales --branch=main
```

### Option C — Git (recommended for ongoing edits)

```bash
git init
git add .
git commit -m "Initial sales page"
gh repo create forgesales --public --source=. --remote=origin --push
```

Then in Cloudflare Pages: **Connect to Git → select repo →**
- Framework preset: **None**
- Build command: *(leave empty)*
- Build output directory: `/`

Every push to `main` redeploys automatically.

### Custom domain

Cloudflare Pages → your project → **Custom domains → Set up a domain**.
If the domain is on Cloudflare already it's one click. Otherwise add a CNAME
record pointing to `your-project.pages.dev`.

Then update `seo.url` in `config.js` to the real domain.

---

## The enquiry form (read this before promising leads)

The form is **honest by design**. There is no backend, so it does not pretend to
save anything.

**Default behaviour (no `formEndpoint` set):**
1. Validates name and Malaysian phone number
2. Builds a WhatsApp message from the filled fields
3. Shows: *"This form isn't connected to a server yet, so nothing is stored.
   Tap the WhatsApp button below to send these details."*
4. Repoints the WhatsApp button with the data pre-filled and pulses it

The lead still reaches you — through WhatsApp, which actually works. Nothing is
faked, nothing is silently dropped.

**To store leads in a database**, set `formEndpoint`:

```js
formEndpoint: "https://your-worker.your-subdomain.workers.dev/enquiry"
```

The form POSTs JSON:

```json
{
  "name": "Aisyah Rahman",
  "phone": "012-345 6789",
  "business": "Aisyah Bakes",
  "package": "business",
  "message": "Custom cakes...",
  "submittedAt": "2026-11-05T08:12:00.000Z",
  "page": "https://..."
}
```

Minimal Cloudflare Worker + D1 to receive it:

```js
export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": "https://your-domain.pages.dev",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });

    const d = await req.json();
    if (!d.name || !d.phone) return new Response("Missing fields", { status: 400, headers: cors });

    await env.DB.prepare(
      "INSERT INTO leads (name, phone, business, package, message, page, created_at) VALUES (?,?,?,?,?,?,?)"
    ).bind(d.name, d.phone, d.business ?? "", d.package ?? "", d.message ?? "", d.page ?? "", new Date().toISOString()).run();

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};
```

```sql
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  business TEXT,
  package TEXT,
  message TEXT,
  page TEXT,
  created_at TEXT
);
```

Only add this when you actually want to store leads. Until then the
WhatsApp fallback is better than a form that lies.

---

## QA

```bash
python docs/qa.py      # 42 automated checks
python docs/shots.py   # regenerate 26 screenshots
```

Latest run: **42/42 passed**, exit 0.

What it covers: section rendering, every in-page anchor, dead-link scan, all
WhatsApp links pre-filled, package CTAs naming the package and price, FAQ
accordion open/close, form validation (empty, bad phone, valid), honest
no-backend messaging, horizontal overflow at 320/360/390/414/768/1024/1280/1920,
mobile burger + drawer open/close, scrim dimming + scroll lock, legal pages,
console errors, page errors, failed network requests.

---

## Screenshots

`docs/screenshots/` — 27 captures.

| File | Shows |
|---|---|
| `01-hero.png` | Desktop hero |
| `02-problem.png` | Problem section |
| `03-solution.png` | Solution + customer journey |
| `04-features.png` | Features grid |
| `05-process.png` | 5-step process |
| `06-pricing.png` | Three pricing cards |
| `07-demo.png` | Sample storefront |
| `08-faq.png` | FAQ |
| `09-cta.png` | Final CTA |
| `09b-footer.png` | Footer |
| `10-comparison.png` | Feature comparison table |
| `11-enquiry-modal.png` | Enquiry form |
| `12-faq-open.png` | FAQ expanded |
| `20-mobile-hero.png` | Mobile hero |
| `21-mobile-full.png` | Full mobile page |
| `22`–`25-mobile-*.png` | Mobile sections |
| `26-mobile-menu.png` | Mobile nav drawer |
| `27-mobile-sticky-cta.png` | Sticky WhatsApp bar |
| `28-mobile-form.png` | Mobile enquiry form |
| `30`–`31-tablet-*.png` | Tablet layouts |
| `40-privacy.png` | Privacy Policy |
| `41-terms.png` | Terms & Conditions |

---

## Design decisions

**Serif display + sans body.** Instrument Serif for headlines, Inter for
everything else. Most competitor pages are all-sans and look templated; the
serif gives an editorial, "real company" feel without cost.

**Warm off-white, not white.** `#fbfaf7` reads less clinical and photographs
better in screenshots.

**One accent colour.** Deep green `#0e7a5f` used for CTAs, checks, and italic
emphasis. No gradient mesh, no purple-blue AI palette.

**Illustrated product art, not stock photos.** Every product image is inline SVG.
No licensing risk, no download weight, no cheesy stock hands-holding-a-mug.

**Glassmorphism used twice.** Nav bar and floating chips. Everywhere else uses
solid surfaces. Applied sparingly it reads premium; applied everywhere it reads
like a 2021 dribbble shot.

**No fake anything.** No testimonials, no "trusted by 500+ businesses", no
invented statistics, no made-up client logos. The demo storefront is labelled
"Demo · illustrative" in the browser chrome, above it, and below it.

**Mobile-first CTAs.** Sticky bottom bar on phones appears after the hero and
hides near pricing (where the cards themselves are the CTA). Burger nav, 50px
touch targets.

**Honest form.** Explained above. This is the decision most landing pages get
wrong.

---

## Before you go live — checklist

- [ ] `contact.whatsapp` — real number, format `60XXXXXXXXX`
- [ ] `contact.whatsappIsPlaceholder` — set to `false`
- [ ] `contact.email` — real address
- [ ] `contact.emailIsPlaceholder` — set to `false`
- [ ] `brand.name` and `brand.tagline` — your business, not "Forge Sales"
- [ ] `socials` — real Facebook / Instagram / TikTok URLs
- [ ] `pricing.packages[].price` — confirm the numbers
- [ ] `seo.url` — real domain
- [ ] `seo.title` / `seo.description` — check they read well
- [ ] `privacy.html` — fill `[Business registration number]` and `[Registered address]`
- [ ] `terms.html` — same, plus review clause 8 (payment gateway) with a lawyer
- [ ] Open one WhatsApp link on a phone — confirms number + message
- [ ] Submit the form on a phone — confirms the WhatsApp fallback
- [ ] Delete or replace `docs/` if you don't want QA scripts public

> The setup notice (black bar, bottom-left) appears **only on localhost** and
> **never** on a deployed domain. It also disappears with `?preview=1`.

---

## Known limits

- **No backend.** Leads go to WhatsApp. Wire `formEndpoint` if you want storage.
- **Legal pages are templates.** Both carry a visible notice saying they need
  review before publishing. Fill the bracketed fields.
- **Demo products are fictional.** "Studio Rumah" is not a real business. Do not
  present it as a portfolio piece.
- **Payment gateway wording is deliberately hedged.** Business and Premium say
  "subject to provider availability and approval" because approval is the
  provider's decision, not yours. Don't remove that caveat.
- **Placeholder WhatsApp number is `60123456789`.** Every CTA points there until
  you change it.

---

## Assumptions made

1. **Brand name "Forge Sales"** — derived from your GitHub handle. Change in
   `brand.name` if you're trading under something else.
2. **Prices used as given** — RM1,499 / RM2,499 / RM3,999, maintenance from RM79.
3. **"About two weeks" timeline** — a reasonable SME-store estimate. Adjust in
   `timeline.note` and the hero trust row if your delivery is slower.
4. **50% deposit / 50% before launch** — standard Malaysian freelance terms,
   written into the T&C template. Change if you bill differently.
5. **Maintenance is optional and opt-out** — priced separately so the headline
   price stays honest.
6. **No testimonials** — you have no clients yet, so none were invented.
7. **Malaysian English** — "customisable", "enquiry", RM pricing, WhatsApp-first.
8. **No Cloudflare deployment performed** — the brief said not to deploy without
   explicit authorisation. Everything is ready; the commands are above.
