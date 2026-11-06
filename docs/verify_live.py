import asyncio, os
from playwright.async_api import async_playwright

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "live")
os.makedirs(OUT, exist_ok=True)
B = "https://forgesales.pages.dev/demo/seri-cantik"

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": 390, "height": 844},
                                  device_scale_factor=2, is_mobile=True, has_touch=True)
        pg = await ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)

        await pg.goto(B + "/", wait_until="networkidle"); await pg.wait_for_timeout(2000)
        print("home title:", await pg.title())
        print("h1 size:", await pg.evaluate("getComputedStyle(document.querySelector('.h-display')).fontSize"))
        print("overflow:", await pg.evaluate("document.documentElement.scrollWidth + '/' + innerWidth"))
        await pg.screenshot(path=os.path.join(OUT, "live-m01-home.png"))

        await pg.goto(B + "/shop/", wait_until="networkidle"); await pg.wait_for_timeout(2200)
        print("\nshop cards:", await pg.evaluate("document.querySelectorAll('#grid .pcard').length"))
        print("hidden reveal:", await pg.evaluate("document.querySelectorAll('.reveal:not(.is-in)').length"))
        await pg.screenshot(path=os.path.join(OUT, "live-m10-shop.png"))

        await pg.goto(B + "/produk/?sku=SC-FDN-01", wait_until="networkidle"); await pg.wait_for_timeout(1800)
        print("\npdp title:", await pg.evaluate("document.querySelector('.pdp__title')?.innerText"))
        await pg.evaluate("window.scrollTo(0,1400)"); await pg.wait_for_timeout(1200)
        print("buybar on:", await pg.evaluate("document.getElementById('buybar').classList.contains('is-on')"))
        print("bb price:", await pg.evaluate("document.getElementById('bbNow')?.innerText"))
        print("mobar vis:", await pg.evaluate("getComputedStyle(document.getElementById('mobar')).visibility"))
        await pg.screenshot(path=os.path.join(OUT, "live-m20-pdp-buybar.png"))

        await pg.click("#bbAdd"); await pg.wait_for_timeout(1400)
        print("cart after add:", await pg.evaluate("localStorage.getItem('sericantik.cart.v1')"))

        await pg.goto(B + "/checkout/", wait_until="networkidle"); await pg.wait_for_timeout(1800)
        print("\ncheckout form visible:", await pg.is_visible("#coForm"))
        print("summary rows:", await pg.evaluate("document.querySelectorAll('.sum__row').length"))
        await pg.screenshot(path=os.path.join(OUT, "live-m40-checkout.png"))

        print("\nerrors:", errs[:5])
        await b.close()
asyncio.run(main())
