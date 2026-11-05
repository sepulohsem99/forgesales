import asyncio, os, sys
from playwright.async_api import async_playwright

URL = "http://127.0.0.1:8790/index.html?preview=1"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "screenshots")
os.makedirs(OUT, exist_ok=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()

        # ---------- DESKTOP ----------
        ctx = await b.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        pg = await ctx.new_page()
        await pg.goto(URL, wait_until="networkidle")
        await pg.wait_for_timeout(1600)

        await pg.screenshot(path=f"{OUT}/01-hero.png")
        await pg.screenshot(path=f"{OUT}/00-full-desktop.png", full_page=True)

        for name, sel in [
            ("02-problem", "#problem"),
            ("03-solution", "#solution"),
            ("04-features", "#features"),
            ("05-process", "#process"),
            ("06-pricing", "#pricing"),
            ("07-demo", "#demo"),
            ("08-faq", "#faq"),
            ("09-cta", "#start"),
        ]:
            await pg.eval_on_selector(sel, "el => el.scrollIntoView({block:'start'})")
            await pg.wait_for_timeout(900)
            await pg.screenshot(path=f"{OUT}/{name}.png")

        # footer
        await pg.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await pg.wait_for_timeout(900)
        await pg.screenshot(path=f"{OUT}/09b-footer.png")

        # comparison table — full element capture so headers are included
        await pg.eval_on_selector(".cmp-wrap", "el => el.scrollIntoView({block:'center'})")
        await pg.wait_for_timeout(700)
        await pg.locator(".cmp-wrap").screenshot(path=f"{OUT}/10-comparison.png")

        # modal
        await pg.eval_on_selector("#pricing", "el => el.scrollIntoView({block:'start'})")
        await pg.wait_for_timeout(500)
        await pg.click("[data-open-form]")
        await pg.wait_for_timeout(800)
        await pg.screenshot(path=f"{OUT}/11-enquiry-modal.png")

        # FAQ open
        await pg.click("[data-close-form]")
        await pg.wait_for_timeout(400)
        await pg.eval_on_selector("#faq", "el => el.scrollIntoView({block:'start'})")
        await pg.wait_for_timeout(500)
        await pg.click(".faq__q")
        await pg.wait_for_timeout(600)
        await pg.screenshot(path=f"{OUT}/12-faq-open.png")

        # mobile hamburger
        await pg.eval_on_selector("#top", "el => el.scrollIntoView({block:'start'})")
        await pg.wait_for_timeout(400)
        await ctx.close()

        # ---------- MOBILE (iPhone-ish) ----------
        m = await b.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        )
        mp = await m.new_page()
        await mp.goto(URL, wait_until="networkidle")
        await mp.wait_for_timeout(1600)

        await mp.screenshot(path=f"{OUT}/20-mobile-hero.png")
        await mp.screenshot(path=f"{OUT}/21-mobile-full.png", full_page=True)

        for name, sel in [
            ("22-mobile-problem", "#problem"),
            ("23-mobile-features", "#features"),
            ("24-mobile-pricing", "#pricing"),
            ("25-mobile-demo", "#demo"),
        ]:
            await mp.eval_on_selector(sel, "el => el.scrollIntoView({block:'start'})")
            await mp.wait_for_timeout(800)
            await mp.screenshot(path=f"{OUT}/{name}.png")

        # hamburger open
        await mp.eval_on_selector("#top", "el => el.scrollIntoView({block:'start'})")
        await mp.wait_for_timeout(500)
        await mp.click("#burger")
        await mp.wait_for_timeout(700)
        await mp.screenshot(path=f"{OUT}/26-mobile-menu.png")
        await mp.click("#burger")
        await mp.wait_for_timeout(400)

        # sticky CTA
        await mp.eval_on_selector("#features", "el => el.scrollIntoView({block:'start'})")
        await mp.wait_for_timeout(900)
        await mp.screenshot(path=f"{OUT}/27-mobile-sticky-cta.png")

        # mobile modal
        await mp.eval_on_selector("#start", "el => el.scrollIntoView({block:'start'})")
        await mp.wait_for_timeout(600)
        await mp.click("[data-open-form]")
        await mp.wait_for_timeout(800)
        await mp.screenshot(path=f"{OUT}/28-mobile-form.png")

        # ---------- TABLET ----------
        t = await b.new_context(viewport={"width": 820, "height": 1100}, device_scale_factor=1)
        tp = await t.new_page()
        await tp.goto(URL, wait_until="networkidle")
        await tp.wait_for_timeout(1500)
        await tp.screenshot(path=f"{OUT}/30-tablet-hero.png")
        await tp.eval_on_selector("#pricing", "el => el.scrollIntoView({block:'start'})")
        await tp.wait_for_timeout(800)
        await tp.screenshot(path=f"{OUT}/31-tablet-pricing.png")

        # ---------- LEGAL PAGES ----------
        lc = await b.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        for name, path in [("40-privacy", "privacy.html"), ("41-terms", "terms.html")]:
            lp = await lc.new_page()
            await lp.goto(URL.rsplit("/", 1)[0] + "/" + path, wait_until="networkidle")
            await lp.wait_for_timeout(1000)
            await lp.screenshot(path=f"{OUT}/{name}.png")
            await lp.close()

        await b.close()

        files = sorted(os.listdir(OUT))
        print(f"OK — {len(files)} screenshots")
        for f in files:
            print(" ", f)

asyncio.run(main())
