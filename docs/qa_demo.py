import asyncio, sys, os
from playwright.async_api import async_playwright

BASE = "http://127.0.0.1:8790"
D = BASE + "/demo/seri-cantik"

results = []
def ok(name, cond, extra=""):
    results.append(("PASS" if cond else "FAIL", name, extra))

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": 1440, "height": 900})
        pg = await ctx.new_page()

        errs, pageerrs, failed = [], [], []
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: pageerrs.append(str(e)))
        pg.on("requestfailed", lambda r: failed.append(r.url + " :: " + str(r.failure)))

        # ============ 1. HOMEPAGE ============
        r = await pg.goto(D + "/", wait_until="networkidle")
        ok("demo homepage loads", r.status == 200, str(r.status))
        await pg.wait_for_timeout(1200)

        c = await pg.evaluate("""() => ({
          cats: document.querySelectorAll('#catGrid .cat').length,
          best: document.querySelectorAll('#bestRail .pcard').length,
          newg: document.querySelectorAll('#newGrid .pcard').length,
          revs: document.querySelectorAll('#revList .rev').length,
          faq: document.querySelectorAll('#faqList .faq__item').length,
          promos: document.querySelectorAll('#promoGrid .promo-card').length,
          packs: document.querySelectorAll('.pk').length,
          hdr: !!document.getElementById('hdr'),
          cart: !!document.getElementById('cartBg'),
          forgeCta: !!document.querySelector('.forge-cta'),
          disclaimer: !!document.querySelector('.disclaimer')
        })""")
        ok("4 category tiles", c["cats"] == 4, str(c["cats"]))
        ok("best sellers rendered", c["best"] >= 4, str(c["best"]))
        ok("new arrivals rendered", c["newg"] == 4, str(c["newg"]))
        ok("6 demo reviews", c["revs"] == 6, str(c["revs"]))
        ok("6 FAQ items", c["faq"] == 6, str(c["faq"]))
        ok("3 promo cards", c["promos"] == 3, str(c["promos"]))
        ok("packshot SVGs rendered", c["packs"] >= 8, str(c["packs"]))
        ok("header mounted", c["hdr"])
        ok("cart drawer mounted", c["cart"])
        ok("Forge CTA present", c["forgeCta"])
        ok("brand disclaimer present", c["disclaimer"])

        # disclaimer content check
        disc = await pg.inner_text(".disclaimer")
        ok("disclaimer names no real affiliation",
           all(w in disc.lower() for w in ["bukan", "rekaan", "tiada"]), disc[:80])

        # ============ 2. FORGE CTA LINK ============
        forge = await pg.get_attribute(".forge-cta__btns a[data-forge-cta]", "href")
        ok("demo→forge CTA links to #start", "../../#start" in forge or "/#start" in forge, forge)

        # ============ 3. SHOP ============
        await pg.goto(D + "/shop/", wait_until="networkidle")
        await pg.wait_for_timeout(1000)
        ok("shop loads 18 products",
           await pg.evaluate("document.querySelectorAll('#grid .pcard').length") == 18)

        # search
        await pg.fill("#q", "serum")
        await pg.wait_for_timeout(500)
        n = await pg.inner_text("#nResults")
        names = await pg.evaluate("[...document.querySelectorAll('#grid .pcard__name')].map(e=>e.innerText)")
        ok("search 'serum' narrows results", n == "2" and any("Serum" in x for x in names), f"{n} -> {names}")
        ok("search updates URL", "q=serum" in pg.url, pg.url)

        # clear
        await pg.click("#qClear")
        await pg.wait_for_timeout(400)
        ok("search clear restores 18", await pg.inner_text("#nResults") == "18")

        # empty state
        await pg.fill("#q", "zzzznothing")
        await pg.wait_for_timeout(500)
        ok("empty state shows for no match", await pg.is_visible("#empty"))
        await pg.click("#resetBtn")
        await pg.wait_for_timeout(400)

        # category filter
        await pg.click('[data-cat="wellness"]')
        await pg.wait_for_timeout(400)
        ok("wellness filter → 4 items", await pg.inner_text("#nResults") == "4")
        ok("filter updates heading", "Wellness" in await pg.inner_text("#shopTitle"))
        ok("filter updates URL", "cat=wellness" in pg.url, pg.url)

        # sort
        await pg.click('[data-cat="all"]')
        await pg.wait_for_timeout(300)
        await pg.select_option("#sort", "price-asc")
        await pg.wait_for_timeout(400)
        prices = await pg.evaluate("""() => [...document.querySelectorAll('#grid .pcard__now')]
            .map(e => parseFloat(e.innerText.replace(/[^\\d.]/g,'')))""")
        ok("sort price ascending correct", prices == sorted(prices), str(prices[:5]))

        await pg.select_option("#sort", "price-desc")
        await pg.wait_for_timeout(400)
        prices = await pg.evaluate("""() => [...document.querySelectorAll('#grid .pcard__now')]
            .map(e => parseFloat(e.innerText.replace(/[^\\d.]/g,'')))""")
        ok("sort price descending correct", prices == sorted(prices, reverse=True))

        # ============ 4. PRODUCT DETAIL ============
        await pg.goto(D + "/produk/?sku=SC-FDN-01", wait_until="networkidle")
        await pg.wait_for_timeout(900)
        ok("PDP title correct", "Diamond Foundation" in await pg.inner_text(".pdp__title"))
        ok("PDP has 6 variants", await pg.evaluate("document.querySelectorAll('[data-var]').length") == 6)
        ok("PDP shows SKU", "SC-FDN-01" in await pg.inner_text(".pdp__sku"))
        ok("PDP shows details list", await pg.evaluate("document.querySelectorAll('.pdp__details li').length") >= 3)
        ok("PDP demo note present", await pg.is_visible(".pdp__note"))

        # variant select changes price
        await pg.click('[data-var="n04"]')
        await pg.wait_for_timeout(300)
        ok("variant selection marks active",
           await pg.get_attribute('[data-var="n04"]', "aria-checked") == "true")

        # qty
        await pg.click("#qInc")
        await pg.click("#qInc")
        await pg.wait_for_timeout(200)
        ok("qty increment works", await pg.input_value("#qIn") == "3")

        # add to cart
        await pg.click("#addBtn")
        await pg.wait_for_timeout(900)
        cart = await pg.evaluate("JSON.parse(localStorage.getItem('sericantik.cart.v1')||'[]')")
        ok("add to cart writes storage", len(cart) == 1 and cart[0]["qty"] == 3, str(cart))
        ok("cart drawer opens after add", await pg.is_visible(".cart-bg.is-open"))
        ok("cart badge shows 3", await pg.inner_text("#cartCount") == "3")

        # ============ 5. CART OPS ============
        total = await pg.inner_text(".cart-line--total")
        ok("cart total = 3 x RM89 = RM267", "267" in total.replace(",", ""), total)

        await pg.click("[data-qty-inc]")
        await pg.wait_for_timeout(500)
        ok("qty increment in cart", "356" in (await pg.inner_text(".cart-line--total")).replace(",", ""))

        await pg.click("[data-qty-dec]")
        await pg.wait_for_timeout(500)
        ok("qty decrement in cart", "267" in (await pg.inner_text(".cart-line--total")).replace(",", ""))

        # add a second product via shop
        await pg.goto(D + "/shop/?cat=wellness", wait_until="networkidle")
        await pg.wait_for_timeout(900)
        await pg.click('[data-add="SC-TEH-15"]')
        await pg.wait_for_timeout(900)
        ok("second product added", await pg.inner_text("#cartCount") == "4")

        # remove — assert the item count drops, not a guessed badge total
        before_n = await pg.evaluate("document.querySelectorAll('.citem').length")
        before_badge = int(await pg.inner_text("#cartCount"))
        await pg.click("[data-del]")
        await pg.wait_for_timeout(700)
        after_n = await pg.evaluate("document.querySelectorAll('.citem').length")
        after_badge = int(await pg.inner_text("#cartCount"))
        ok("remove item works",
           after_n == before_n - 1 and after_badge < before_badge,
           f"rows {before_n}->{after_n}, badge {before_badge}->{after_badge}")

        # ============ 6. PERSISTENCE ============
        before = await pg.evaluate("localStorage.getItem('sericantik.cart.v1')")
        await pg.goto(D + "/shop/", wait_until="networkidle")
        await pg.wait_for_timeout(1200)
        after = await pg.evaluate("localStorage.getItem('sericantik.cart.v1')")
        ok("cart persists after reload", before == after and before is not None, before)
        remaining = await pg.evaluate("JSON.parse(localStorage.getItem('sericantik.cart.v1')||'[]').reduce((s,i)=>s+i.qty,0)")
        ok("badge restored after reload",
           int(await pg.inner_text("#cartCount")) == remaining, f"badge vs {remaining}")

        # ============ 7. CHECKOUT ============
        await pg.goto(D + "/checkout/", wait_until="networkidle")
        await pg.wait_for_timeout(1200)
        ok("checkout form visible", await pg.is_visible("#coForm"))
        sum_items = await pg.evaluate("document.querySelectorAll('.sum__item').length")
        cart_rows = await pg.evaluate("JSON.parse(localStorage.getItem('sericantik.cart.v1')||'[]').length")
        ok("checkout summary matches cart rows", sum_items == cart_rows, f"{sum_items} vs {cart_rows}")
        ok("16 Malaysian states loaded", await pg.evaluate("document.getElementById('fState').options.length") == 17)

        # discount: valid
        await pg.fill("#codeInput", "SERI10")
        await pg.click("#codeBtn")
        await pg.wait_for_timeout(600)
        ok("discount SERI10 applies", "digunakan" in await pg.inner_text("#codeMsg"))
        ok("discount row appears", await pg.is_visible(".sum__row--disc"))

        disc_row = await pg.inner_text(".sum__row--disc")
        sub_txt = await pg.inner_text(".sum__row:first-child")
        sub_val = float(sub_txt.split("RM")[-1].replace(",", ""))
        disc_val = float(disc_row.split("RM")[-1].replace("\u2212", "").replace(",", ""))
        ok("discount = 10% of subtotal",
           abs(disc_val - round(sub_val * 0.10, 2)) < 0.02,
           f"sub={sub_val} disc={disc_val}")

        # discount: invalid
        await pg.fill("#codeInput", "NOPE")
        await pg.click("#codeBtn")
        await pg.wait_for_timeout(500)
        ok("invalid code rejected", "tidak sah" in await pg.inner_text("#codeMsg"))

        # minimum spend rule
        await pg.goto(D + "/shop/", wait_until="networkidle")
        await pg.wait_for_timeout(800)
        await pg.evaluate("Cart.clear()")
        await pg.click('[data-add="SC-CLN-07"]')   # RM39, no variant
        await pg.wait_for_timeout(700)
        await pg.goto(D + "/checkout/", wait_until="networkidle")
        await pg.wait_for_timeout(900)
        await pg.fill("#codeInput", "CANTIK20")
        await pg.click("#codeBtn")
        await pg.wait_for_timeout(600)
        msg = await pg.inner_text("#codeMsg")
        ok("min-spend code rejected below threshold", "minima" in msg, msg)

        # shipping below free threshold
        ship = await pg.inner_text(".sum__rows")
        ok("shipping charged under RM100", "RM8" in ship, ship[-90:])

        # validation
        await pg.click("#payBtn")
        await pg.wait_for_timeout(600)
        ok("empty form blocks submit (6 errors)",
           await pg.evaluate("document.querySelectorAll('.field.has-error').length") == 6)
        ok("still on checkout after invalid", "checkout" in pg.url)

        await pg.fill("#fEmail", "bad")
        await pg.click("#payBtn")
        await pg.wait_for_timeout(400)
        ok("invalid email rejected", await pg.is_visible("#fEmail ~ .field__err"))

        # fill valid
        await pg.fill("#fName", "Nurul Aisyah binti Rahman")
        await pg.fill("#fEmail", "nurul@example.com")
        await pg.fill("#fPhone", "012-345 6789")
        await pg.fill("#fAddr", "No 12, Jalan Seri Wangi, Taman Melati")
        await pg.fill("#fPost", "53100")
        await pg.select_option("#fState", "Kuala Lumpur")
        await pg.wait_for_timeout(300)
        ok("all errors cleared with valid data",
           await pg.evaluate("document.querySelectorAll('.field.has-error').length") == 0)

        # submit
        await pg.click("#payBtn")
        await pg.wait_for_timeout(1800)
        ok("redirects to order confirmation", "/order/" in pg.url, pg.url)
        h1 = await pg.inner_text(".confirm h1")
        ok("confirmation greets customer", "Nurul" in h1, h1)
        ok("order number generated",
           (await pg.inner_text(".order-num b")).startswith("SC-"))
        ok("simulation notice shown", await pg.is_visible(".sim-notice"))
        ok("cart cleared after order",
           await pg.evaluate("localStorage.getItem('sericantik.cart.v1')") == "[]")
        ok("badge reset to 0", await pg.inner_text("#cartCount") == "0")

        # ============ 8. FORGE LANDING INTEGRATION ============
        r = await pg.goto(BASE + "/index.html?preview=1", wait_until="networkidle")
        await pg.wait_for_timeout(1500)
        ok("forge landing loads", r.status == 200)

        integ = await pg.evaluate("""() => ({
          studio: document.body.innerText.includes('Studio Rumah'),
          seri: document.body.innerText.includes('Seri Cantik'),
          demoCards: document.querySelectorAll('[data-demo-products] .pcard').length,
          beautyArt: !!document.querySelector('[data-beauty-art] svg'),
          ctaLinks: [...document.querySelectorAll('a')].filter(a=>a.innerText.includes('Cuba Live Demo')).map(a=>a.getAttribute('href')),
          binCta: [...document.querySelectorAll('.demo-cta a')].some(a=>a.innerText.includes('Bina Kedai')),
          pricing: document.querySelectorAll('.price-card').length
        })""")
        ok("Studio Rumah fully replaced", not integ["studio"])
        ok("Seri Cantik appears on landing", integ["seri"])
        ok("preview shows 8 beauty products", integ["demoCards"] == 8, str(integ["demoCards"]))
        ok("beauty packshot in preview", integ["beautyArt"])
        ok("Cuba Live Demo → /demo/seri-cantik/",
           integ["ctaLinks"] and all("/demo/seri-cantik/" in l for l in integ["ctaLinks"]), str(integ["ctaLinks"]))
        ok("Bina Kedai Online CTA present", integ["binCta"])
        ok("existing pricing preserved (3 cards)", integ["pricing"] == 3, str(integ["pricing"]))
        await pg.click("[data-open-form]")
        await pg.wait_for_timeout(600)
        ok("existing enquiry form intact", await pg.is_visible("#enquiryForm"))
        await pg.click(".modal__close")
        await pg.wait_for_timeout(400)

        # ============ 9. RESPONSIVE ============
        for w in [320, 375, 414, 768, 1024, 1440]:
            await pg.set_viewport_size({"width": w, "height": 900})
            for path in ["/", "/shop/", "/produk/?sku=SC-SET-04", "/checkout/"]:
                await pg.goto(D + path, wait_until="networkidle")
                await pg.wait_for_timeout(400)
                over = await pg.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
                ok(f"no h-overflow {w}px {path}", not over)

        # mobile nav
        await pg.set_viewport_size({"width": 390, "height": 844})
        await pg.goto(D + "/", wait_until="networkidle")
        await pg.wait_for_timeout(800)
        ok("burger visible on mobile",
           await pg.evaluate("getComputedStyle(document.getElementById('burger')).display !== 'none'"))
        await pg.click("#burger")
        await pg.wait_for_timeout(600)
        ok("mobile drawer opens", await pg.is_visible(".mdrawer.is-open"))
        ok("scroll locked when drawer open",
           await pg.evaluate("document.body.classList.contains('no-scroll')"))
        await pg.click(".mdrawer__close")
        await pg.wait_for_timeout(400)
        ok("mobile drawer closes", not await pg.is_visible(".mdrawer.is-open"))

        # ============ 9b. PERSISTENT FORGE CTA ============
        await pg.set_viewport_size({"width": 390, "height": 844})
        # seed a cart so checkout renders its form and has scroll height
        await pg.goto(D + "/shop/", wait_until="networkidle")
        await pg.evaluate("Cart.clear(); Cart.add('SC-KRM-03', null, 1);")
        await pg.wait_for_timeout(400)
        for path in ["/shop/", "/produk/?sku=SC-FDN-01", "/checkout/"]:
            await pg.goto(D + path, wait_until="networkidle")
            await pg.wait_for_timeout(700)
            await pg.mouse.wheel(0, 800)
            await pg.wait_for_timeout(600)
            st = await pg.evaluate("""() => {
              const m = document.getElementById('mobar');
              if (!m) return null;
              const b = m.getBoundingClientRect();
              return { on: m.classList.contains('is-on'),
                       visible: b.top < innerHeight && b.bottom > 0,
                       href: m.querySelector('a').getAttribute('href') };
            }""")
            ok(f"persistent Forge CTA shows on {path}",
               st and st["on"] and st["visible"], str(st))
            ok(f"persistent CTA links to Forge on {path}",
               st and "#start" in st["href"], str(st))

        # must be hidden on desktop (no duplicate floating buttons)
        await pg.set_viewport_size({"width": 1440, "height": 900})
        await pg.goto(D + "/shop/", wait_until="networkidle")
        await pg.wait_for_timeout(500)
        ok("persistent CTA hidden on desktop",
           await pg.evaluate("getComputedStyle(document.getElementById('mobar')).display") == "none")

        # ============ 9c. MOBILE NATIVENESS ============
        await pg.set_viewport_size({"width": 390, "height": 844})
        await pg.goto(D + "/", wait_until="networkidle")
        await pg.wait_for_timeout(900)
        mob = await pg.evaluate("""() => {
          const fs = (s) => { const e = document.querySelector(s); return e ? parseFloat(getComputedStyle(e).fontSize) : 0; };
          const pad = (s) => { const e = document.querySelector(s); return e ? parseFloat(getComputedStyle(e).paddingTop) : 0; };
          const b = document.querySelector('.hero__actions .btn');
          return { h1: fs('.h-display'), secPad: pad('.sec'),
                   btnH: b ? b.getBoundingClientRect().height : 0,
                   bodyFs: fs('body') };
        }""")
        # a shrunk desktop page reads at ~30px here; app-native needs >=38
        ok("mobile hero heading >= 38px", mob["h1"] >= 38, str(mob["h1"]))
        ok("mobile section padding >= 48px", mob["secPad"] >= 48, str(mob["secPad"]))
        ok("mobile primary CTA >= 48px tall", mob["btnH"] >= 48, str(mob["btnH"]))
        ok("mobile body text >= 15px", mob["bodyFs"] >= 15, str(mob["bodyFs"]))

        # sticky buy bar on the product page
        await pg.goto(D + "/produk/?sku=SC-FDN-01", wait_until="networkidle")
        await pg.wait_for_timeout(900)
        await pg.evaluate("window.scrollTo(0, 1400)")
        await pg.wait_for_timeout(800)
        bb = await pg.evaluate("""() => {
          const bar = document.getElementById('buybar');
          const r = bar.getBoundingClientRect();
          const mobar = document.getElementById('mobar');
          return { on: bar.classList.contains('is-on'),
                   visible: r.top < innerHeight && r.bottom > 0,
                   mobarHidden: !mobar || getComputedStyle(mobar).visibility === 'hidden' };
        }""")
        ok("sticky buy bar appears on scroll", bb["on"] and bb["visible"], str(bb))
        ok("only one bottom bar at a time", bb["mobarHidden"], str(bb))

        # empty cart must not render the checkout form
        await pg.evaluate("Cart.clear()")
        await pg.goto(D + "/checkout/", wait_until="networkidle")
        await pg.wait_for_timeout(700)
        ok("empty cart hides checkout form", not await pg.is_visible("#coForm"))
        ok("empty cart shows empty state", await pg.is_visible("#coEmpty"))

        # ============ 10. BROKEN ROUTES / IMAGES ============
        for page in ["/", "/shop/", "/produk/?sku=SC-FDN-01", "/checkout/", "/order/"]:
            r = await pg.goto(D + page, wait_until="networkidle")
            ok(f"route {page} → 200", r.status == 200, str(r.status))

        broken = await pg.evaluate("""() => [...document.images].filter(i=>!i.complete||i.naturalWidth===0).length""")
        ok("no broken images", broken == 0, str(broken))

        # ============ 11. A11Y TOUCH ============
        await pg.goto(D + "/", wait_until="networkidle")
        await pg.wait_for_timeout(800)
        a11y = await pg.evaluate("""() => {
          const h1 = document.querySelectorAll('h1').length;
          const skipFooter = [...document.querySelectorAll('a')].filter(a=>!a.getAttribute('aria-label') && !a.innerText.trim()).length;
          const btnsNoLabel = [...document.querySelectorAll('button')].filter(
            b => !b.getAttribute('aria-label') && !b.innerText.trim()).length;
          const lang = document.documentElement.lang;
          const unlabeledInputs = [...document.querySelectorAll('input,select,textarea')]
            .filter(i => !i.getAttribute('aria-label') && !document.querySelector(`label[for="${i.id}"]`)).length;
          return { h1, skipFooter, btnsNoLabel, lang, unlabeledInputs };
        }""")
        ok("exactly one h1", a11y["h1"] == 1, str(a11y["h1"]))
        ok("html lang is ms-MY", a11y["lang"] == "ms-MY", a11y["lang"])
        ok("no unlabeled form inputs", a11y["unlabeledInputs"] == 0, str(a11y["unlabeledInputs"]))
        ok("no unlabeled buttons", a11y["btnsNoLabel"] == 0, str(a11y["btnsNoLabel"]))

        # ============ 12. CONSOLE CLEAN ============
        ok("no console errors", len(errs) == 0, "; ".join(errs[:4]))
        ok("no page errors", len(pageerrs) == 0, "; ".join(pageerrs[:4]))
        ok("no failed requests", len(failed) == 0, "; ".join(failed[:3]))

        await b.close()

    fails = [r for r in results if r[0] == "FAIL"]
    for s, n, e in results:
        print(f"{s}  {n}" + (f"   [{e}]" if e and s == "FAIL" else ""))
    print(f"\n{len(results)-len(fails)}/{len(results)} passed")
    if fails:
        sys.exit(1)

asyncio.run(main())
