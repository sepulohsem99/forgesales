import asyncio, os, json
from playwright.async_api import async_playwright

BASE = "http://127.0.0.1:8790"
D = BASE + "/demo/seri-cantik"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "demo-shots")
os.makedirs(OUT, exist_ok=True)

DESK = {"width": 1440, "height": 900}
MOB = {"width": 390, "height": 844}

async def shot(pg, name, full=False):
    if full:
        # force scroll-reveal so full-page captures aren't half-invisible
        await pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-in'))")
        await pg.wait_for_timeout(350)
    await pg.screenshot(path=os.path.join(OUT, name), full_page=full)
    print("  ", name)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()

        # ---------- DESKTOP ----------
        ctx = await b.new_context(viewport=DESK, device_scale_factor=1)
        pg = await ctx.new_page()

        async def go(path, wait=1400):
            await pg.goto(D + path, wait_until="networkidle")
            await pg.wait_for_timeout(wait)

        await go("/")
        await shot(pg, "d01-home-hero.png")
        await shot(pg, "d00-home-full.png", full=True)

        for name, sel in [("d02-categories", "#catGrid"),
                          ("d03-bestsellers", "#bestRail"),
                          ("d04-promos", "#promoGrid"),
                          ("d05-reviews", "#revList")]:
            await pg.evaluate(f"document.querySelector('{sel}').scrollIntoView({{block:'center'}})")
            await pg.wait_for_timeout(800)
            await shot(pg, name + ".png")

        # announcement + promo strip
        await pg.evaluate("window.scrollTo(0,0)")
        await pg.wait_for_timeout(500)
        await shot(pg, "d06-announcement.png")

        # forge CTA inside demo
        await pg.evaluate("document.querySelector('.forge-cta').scrollIntoView({block:'center'})")
        await pg.wait_for_timeout(700)
        await shot(pg, "d07-forge-cta.png")

        # shop
        await go("/shop/")
        await shot(pg, "d10-shop.png")
        await shot(pg, "d11-shop-full.png", full=True)

        # search state
        await pg.fill("#q", "serum")
        await pg.wait_for_timeout(700)
        await shot(pg, "d12-shop-search.png")
        await pg.click("#qClear")
        await pg.wait_for_timeout(500)

        # PDP
        await go("/produk/?sku=SC-FDN-01")
        await shot(pg, "d20-product.png")
        await pg.click('[data-var="n05"]')
        await pg.wait_for_timeout(500)
        await shot(pg, "d21-product-variant.png")

        # cart with items — seed via Cart API so variant/stock rules don't block the shot
        await pg.evaluate("Cart.clear()")
        await go("/shop/")
        await pg.evaluate("""() => {
            Cart.clear();
            Cart.add('SC-FDN-01','n03',2);
            Cart.add('SC-KRM-03',null,1);
            Cart.add('SC-SET-04',null,1);
            Cart.add('SC-SCR-10',null,1);
        }""")
        await pg.wait_for_timeout(900)
        await pg.click("#cartBtn")
        await pg.wait_for_timeout(900)
        await shot(pg, "d30-cart.png")
        await pg.click(".cart-panel__close")
        await pg.wait_for_timeout(500)

        # checkout
        await go("/checkout/")
        await shot(pg, "d40-checkout.png")
        await shot(pg, "d41-checkout-full.png", full=True)

        await pg.fill("#codeInput", "SERI10")
        await pg.click("#codeBtn")
        await pg.wait_for_timeout(800)
        await shot(pg, "d42-checkout-discount.png")

        # fill + submit
        await pg.fill("#fName", "Nurul Aisyah binti Rahman")
        await pg.fill("#fEmail", "nurul.aisyah@example.com")
        await pg.fill("#fPhone", "012-345 6789")
        await pg.fill("#fAddr", "No 12, Jalan Seri Wangi, Taman Melati")
        await pg.fill("#fPost", "53100")
        await pg.select_option("#fState", "Kuala Lumpur")
        await pg.fill("#fNote", "Rumah pagar biru, hantar waktu petang.")
        await pg.wait_for_timeout(500)
        await pg.click("#payBtn")
        await pg.wait_for_timeout(2000)
        await shot(pg, "d50-order.png")
        await shot(pg, "d51-order-full.png", full=True)

        # forge landing integration
        await pg.goto(BASE + "/index.html?preview=1", wait_until="networkidle")
        await pg.wait_for_timeout(1600)
        await pg.evaluate("document.querySelector('#demo').scrollIntoView({block:'start'})")
        await pg.wait_for_timeout(900)
        await shot(pg, "d60-forge-demo-section.png")
        await shot(pg, "d61-forge-full.png", full=True)
        await ctx.close()

        # ---------- MOBILE ----------
        mctx = await b.new_context(viewport=MOB, device_scale_factor=2, is_mobile=True,
                                   has_touch=True)
        m = await mctx.new_page()

        async def mgo(path, wait=1400):
            await m.goto(D + path, wait_until="networkidle")
            await m.wait_for_timeout(wait)

        await mgo("/")
        await m.screenshot(path=os.path.join(OUT, "m01-home-hero.png"))
        print("   m01-home-hero.png")
        # tab bar close-up
        bar = await m.query_selector("#tabbar")
        await bar.screenshot(path=os.path.join(OUT, "m04-tabbar.png"))
        print("   m04-tabbar.png")
        print("   m01-home-hero.png")
        await m.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-in'))")
        await m.wait_for_timeout(350)
        await m.screenshot(path=os.path.join(OUT, "m00-home-full.png"), full_page=True)
        print("   m00-home-full.png")

        await m.evaluate("document.querySelector('#bestRail').scrollIntoView({block:'center'})")
        await m.wait_for_timeout(700)
        await m.screenshot(path=os.path.join(OUT, "m02-bestsellers.png"))
        print("   m02-bestsellers.png")

        # drawer
        await m.evaluate("window.scrollTo(0,0)")
        await m.wait_for_timeout(400)
        await m.click('[data-tab="more"]')
        await m.wait_for_timeout(700)
        await m.screenshot(path=os.path.join(OUT, "m03-menu.png"))
        print("   m03-menu.png")
        await m.click(".mdrawer__close")
        await m.wait_for_timeout(500)

        await mgo("/shop/")
        await m.screenshot(path=os.path.join(OUT, "m10-shop.png"))
        print("   m10-shop.png")
        await m.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-in'))")
        await m.wait_for_timeout(350)
        await m.screenshot(path=os.path.join(OUT, "m11-shop-full.png"), full_page=True)
        print("   m11-shop-full.png")

        # persistent CTA visible
        await m.evaluate("window.scrollTo(0,900)")
        await m.wait_for_timeout(800)
        await m.screenshot(path=os.path.join(OUT, "m12-shop-mobar.png"))
        print("   m12-shop-mobar.png")

        await mgo("/produk/?sku=SC-FDN-01")
        await m.screenshot(path=os.path.join(OUT, "m20-product.png"))
        print("   m20-product.png")

        # cart on mobile
        await m.evaluate("Cart.clear()")
        await mgo("/shop/")
        await m.click('[data-add="SC-KRM-03"]')
        await m.wait_for_timeout(900)
        await m.screenshot(path=os.path.join(OUT, "m30-cart.png"))
        print("   m30-cart.png")
        await m.click(".cart-panel__close")
        await m.wait_for_timeout(500)

        # saved page
        await mgo("/shop/?cat=wajah")
        ws = await m.query_selector_all("[data-wish]")
        await ws[0].click(); await m.wait_for_timeout(400)
        await ws[1].click(); await m.wait_for_timeout(500)
        await mgo("/simpan/")
        await m.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-in'))")
        await m.wait_for_timeout(500)
        await m.screenshot(path=os.path.join(OUT, "m50-saved.png"))
        print("   m50-saved.png")

        await mgo("/checkout/")
        await m.screenshot(path=os.path.join(OUT, "m40-checkout.png"))
        print("   m40-checkout.png")
        await m.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-in'))")
        await m.wait_for_timeout(350)
        await m.screenshot(path=os.path.join(OUT, "m41-checkout-full.png"), full_page=True)
        print("   m41-checkout-full.png")

        await mctx.close()
        await b.close()

    files = sorted(os.listdir(OUT))
    print(f"\nOK — {len(files)} screenshots")
    for f in files:
        print("  ", f, os.path.getsize(os.path.join(OUT, f)) // 1024, "KB")

asyncio.run(main())
