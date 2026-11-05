# Research & Conversion Notes

Notes behind the build. Not customer-facing.

---

## 1. What Malaysian SMEs actually use today

| Approach | Where it works | Where it breaks |
|---|---|---|
| WhatsApp Business only | Zero cost, already habit | No catalogue, no search, no stock, orders buried in chat |
| Facebook / Instagram shop | Free reach, familiar | No checkout, comment-order chaos, algorithm owns your visibility |
| Shopee / Lazada | Built-in traffic | 8–20% commission, price war, you don't own the customer |
| Shopify | Best-in-class product | USD 39+/mo + apps + theme = RM200-400/mo before a single sale |
| Custom agency build | Full control | RM15k-60k, 3-6 months, overkill for someone doing 40 orders/mo |

**The gap:** a business doing 30-100 orders a month has outgrown WhatsApp but
cannot justify Shopify's running cost or an agency's build cost. That's the
RM1,499-3,999 segment.

---

## 2. What competitors' landing pages do badly

Reviewed: local agency sites, Malaysian Shopify partners, freelancer
marketplaces, and the international SaaS pricing pages SMEs compare against.

| Pattern | Why it hurts conversion |
|---|---|
| "Contact us for a quote" | Buyer can't qualify themselves. Most never send the message. |
| No prices anywhere | Signals "expensive". The RM1,499 buyer leaves immediately. |
| Stack of stock photos | Signals template. Buyer has seen the same photo on ten sites. |
| Fake testimonials | Malaysian SMEs are small enough to check. One verification kills trust. |
| "We are the leading digital agency" | Means nothing. Reads as boilerplate. |
| Feature list with no ownership | Buyer can't tell what they get vs. what costs extra. |
| Form only, no WhatsApp | The target buyer lives in WhatsApp. A form is a barrier. |
| Hidden recurring costs | Domain, hosting, gateway fees appear later. Buyer feels tricked. |
| Auto-playing carousels | Bounce. Costs load time. Nobody reads slide 3. |

---

## 3. What this page does differently

1. **Price visible in the hero** — "From RM1,499" in the trust row. Qualifies the
   visitor before they scroll.
2. **Three fixed packages, not "custom quote"** — removes the biggest friction
   for a first-time buyer.
3. **Honest separation of costs** — domain/hosting/gateway named as separate and
   explained as *"registered in your name — you own them, not us"*. Turns a
   negative into an ownership benefit.
4. **WhatsApp-first, with the package pre-filled** — tapping "Choose Business"
   opens WhatsApp with *"I'm interested in the Business package (RM2,499)"*.
   Zero typing. The enquiry starts already qualified.
5. **Demo storefront, clearly labelled three times** — browser chrome badge, section
   copy, footer note. Shows capability without pretending to have clients.
6. **No testimonials at all** — better to have none than fake ones. The page
   competes on clarity instead.
7. **The form tells the truth** — says it isn't connected, hands over to WhatsApp.
   A fake "thank you" would lose the lead silently.
8. **Payment gateway hedged** — "subject to provider availability and approval"
   with the SSM/bank-account requirement stated. Prevents the most common
   post-sale dispute.

---

## 4. Conversion structure

Order follows the buyer's internal monologue:

| Section | Question it answers |
|---|---|
| Hero | What is this, and is it for me? |
| Trust strip | Do people like me use this? |
| Problem | Do they understand my situation? |
| Solution + journey | What actually changes day-to-day? |
| Features | What am I getting? |
| Process | How much work is this for me? |
| Pricing | Can I afford it? |
| Comparison | Which one do I need? |
| Demo | What will it look like? |
| FAQ | What's the catch? |
| Final CTA | What do I do now? |

Every section ends near a CTA or leads toward one. No dead ends.

---

## 5. Copy rules applied

- **No superlatives.** No "best", "leading", "world-class", "revolutionary".
- **Numbers instead of adjectives.** "Live in about 2 weeks", not "fast delivery".
- **Name the pain in the customer's words.** "Price? Got stock? Can post to
  Sabah?" — the actual messages a seller retypes daily.
- **Short sentences.** Malaysian English reads shorter than US SaaS copy.
- **Second person.** "You", "your business", not "our clients".
- **Specific over general.** "11pm sits under twenty others by morning" beats
  "you might miss enquiries".
- **No em-dash-heavy AI rhythm.** Varied sentence length, some fragments.

---

## 6. Trust signals used without lying

You have no clients. So credibility comes from:

- **Transparency** — costs separated, gateway caveat stated, demo labelled
- **Specificity** — real prices, real timeline, real package contents
- **Ownership** — "you own your domain", "registered in your name"
- **Restraint** — no fake logos, no invented numbers
- **Legal pages** — a real Privacy Policy and T&C signal a real business
- **A working site** — the page itself is the portfolio piece

---

## 7. Mobile behaviour

Malaysian SME traffic from Facebook ads is overwhelmingly mobile (typically
80-90%). Decisions:

- Sticky WhatsApp bar after the hero, hidden near the pricing cards so it doesn't
  fight the package CTAs
- Burger nav below 880px
- 50px minimum touch targets
- Hero mockup simplified on small screens — nav links hidden rather than rendered
  as unreadable 6px text
- Pricing cards stack single-column; the highlighted card stays visually distinct
  through border, badge and filled CTA, not just colour
- Comparison table scrolls horizontally with a shadow cue rather than squashing

---

## 8. Accessibility

- Tokens checked against WCAG AA on `#fbfaf7`:
  - `--ink` 16.0:1
  - `--ink-2` 7.9:1
  - `--ink-3` 5.1:1
  - `--accent` 5.1:1
- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`
- One `h1`, ordered `h2`/`h3`
- Skip link to `#main`
- FAQ is a real button with `aria-expanded` + `aria-controls`
- Modal has `role="dialog"`, `aria-modal`, labelled by its heading, closes on Esc
  and backdrop click
- Form errors tie to fields via the `.field__err` sibling and are announced in a
  `role="alert"` region
- `prefers-reduced-motion` disables scroll reveals and float animations
- All decorative SVG marked `aria-hidden="true"`

---

## 9. Deliberately not built

| Not built | Why |
|---|---|
| Blog / CMS | Not needed to sell the service; adds maintenance |
| Live chat widget | WhatsApp already does this better for this audience |
| Testimonials carousel | No real testimonials exist |
| Animated counters | Fake numbers, and the real ones are too small to brag about |
| Multi-language toggle | Target buyer reads English or Malay; BM version is a future job |
| Booking calendar | Slows the first contact. WhatsApp is faster. |
| Newsletter popup | Interrupts. This page sells a considered purchase. |

---

## 10. Future work, in priority order

1. **Malay language version** — a large share of the target market prefers BM for
   buying decisions. Highest expected lift.
2. **Real screenshots once the first store ships** — replaces the demo section
   with actual proof.
3. **Lead storage** — Cloudflare Worker + D1 so enquiries are captured even if the
   visitor never opens WhatsApp.
4. **Case study page** — one real client, one page, real numbers. Worth more than
   any copy on this site.
5. **Meta Pixel + conversion events** — needed the moment you run paid traffic.
