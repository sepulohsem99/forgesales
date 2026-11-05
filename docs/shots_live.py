import asyncio, os
from playwright.async_api import async_playwright

URL = "https://forgesales.pages.dev/"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "live")
os.makedirs(OUT, exist_ok=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()

        ctx = await b.new_context(viewport={"width": 1440, "height": 900})
        pg = await ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)

        await pg.goto(URL, wait_until="networkidle")
        await pg.wait_for_timeout(2000)
        await pg.screenshot(path=f"{OUT}/live-01-hero.png")

        for name, sel in [("live-06-pricing", "#pricing"), ("live-10-comparison", ".cmp-wrap"), ("live-07-demo", "#demo")]:
            await pg.locator(sel).scroll_into_view_if_needed()
            await pg.wait_for_timeout(900)
            if sel == ".cmp-wrap":
                await pg.locator(sel).screenshot(path=f"{OUT}/{name}.png")
            else:
                await pg.screenshot(path=f"{OUT}/{name}.png")

        await pg.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await pg.wait_for_timeout(900)
        await pg.screenshot(path=f"{OUT}/live-09b-footer.png")

        m = await b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        mp = await m.new_page()
        await mp.goto(URL, wait_until="networkidle")
        await mp.wait_for_timeout(2000)
        await mp.screenshot(path=f"{OUT}/live-20-mobile-hero.png")
        await mp.locator("#pricing").scroll_into_view_if_needed()
        await mp.wait_for_timeout(900)
        await mp.screenshot(path=f"{OUT}/live-24-mobile-pricing.png")

        await b.close()
        print(f"OK — {len(os.listdir(OUT))} live screenshots")
        for f in sorted(os.listdir(OUT)):
            print(" ", f)
        print("console/page errors:", errs if errs else "none")

asyncio.run(main())
