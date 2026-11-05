import asyncio, json, sys
from playwright.async_api import async_playwright

BASE = "http://127.0.0.1:8790"
results = []
def ok(name, cond, extra=""):
    results.append(("PASS" if cond else "FAIL", name, extra))

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": 1440, "height": 900})
        pg = await ctx.new_page()

        console_errs, page_errs, failed_req = [], [], []
        pg.on("console", lambda m: console_errs.append(f"{m.type}: {m.text}") if m.type == "error" else None)
        pg.on("pageerror", lambda e: page_errs.append(str(e)))
        pg.on("requestfailed", lambda r: failed_req.append(f"{r.url} :: {r.failure}"))

        await pg.goto(BASE + "/index.html?preview=1", wait_until="networkidle")
        await pg.wait_for_timeout(1500)

        # ---------- structure ----------
        counts = await pg.evaluate("""() => ({
          pricing: document.querySelectorAll('.price-card').length,
          features: document.querySelectorAll('.feature').length,
          steps: document.querySelectorAll('.step').length,
          faq: document.querySelectorAll('.faq__item').length,
          cmp: document.querySelectorAll('.cmp tbody tr').length,
          demo: document.querySelectorAll('.pcard').length,
          journey: document.querySelectorAll('.journey__step').length,
          wa: document.querySelectorAll('a[href*="wa.me"]').length,
        })""")
        ok("3 pricing cards", counts["pricing"] == 3, str(counts["pricing"]))
        ok("7 features", counts["features"] == 7, str(counts["features"]))
        ok("5 process steps", counts["steps"] == 5, str(counts["steps"]))
        ok("FAQ items", counts["faq"] >= 7, str(counts["faq"]))
        ok("comparison rows", counts["cmp"] >= 8, str(counts["cmp"]))
        ok("8 demo products", counts["demo"] == 8, str(counts["demo"]))
        ok("4 journey steps", counts["journey"] == 4, str(counts["journey"]))
        ok("WhatsApp links wired", counts["wa"] >= 10, str(counts["wa"]))

        # ---------- anchors ----------
        bad_anchors = await pg.evaluate("""() => {
          const bad = [];
          document.querySelectorAll('a[href^="#"]').forEach(a => {
            const id = a.getAttribute('href').slice(1);
            if (id && !document.getElementById(id)) bad.push(a.getAttribute('href'));
          });
          return bad;
        }""")
        ok("all in-page anchors resolve", len(bad_anchors) == 0, str(bad_anchors))

        dead = await pg.evaluate("""() => document.querySelectorAll('a[href=""], a[href="#"]').length""")
        ok("no dead placeholder links", dead == 0, str(dead))

        # ---------- every WA link has a message ----------
        empty_wa = await pg.evaluate("""() => {
          const bad = [];
          document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
            const h = a.getAttribute('href');
            if (!h.includes('?text=') || h.length < 40) bad.push(h);
          });
          return bad;
        }""")
        ok("all WA links prefilled", len(empty_wa) == 0, str(empty_wa))

        # ---------- package-specific CTAs ----------
        pkg_links = await pg.evaluate("""() => [...document.querySelectorAll('[data-wa-pkg]')].map(a => ({
          pkg: a.dataset.waPkg,
          hasName: decodeURIComponent(a.href).includes(a.dataset.waPkg === 'starter' ? 'Starter' : a.dataset.waPkg === 'business' ? 'Business' : 'Premium'),
          hasPrice: decodeURIComponent(a.href).match(/RM[\\d,]+/) !== null
        }))""")
        ok("3 package CTAs", len(pkg_links) == 3, str(len(pkg_links)))
        ok("package CTAs name the package", all(x["hasName"] for x in pkg_links), str(pkg_links))
        ok("package CTAs include price", all(x["hasPrice"] for x in pkg_links), str(pkg_links))

        # ---------- FAQ accordion ----------
        await pg.click(".faq__q")
        await pg.wait_for_timeout(500)
        opened = await pg.evaluate("""() => {
          const it = document.querySelector('.faq__item');
          return { open: it.classList.contains('is-open'),
                   aria: it.querySelector('.faq__q').getAttribute('aria-expanded'),
                   h: it.querySelector('.faq__a').getBoundingClientRect().height };
        }""")
        ok("FAQ opens", opened["open"] and opened["aria"] == "true" and opened["h"] > 10, str(opened))
        await pg.click(".faq__q")
        await pg.wait_for_timeout(400)
        closed = await pg.evaluate("""() => !document.querySelector('.faq__item').classList.contains('is-open')""")
        ok("FAQ closes on second click", closed)

        # ---------- form validation ----------
        await pg.click("[data-open-form]")
        await pg.wait_for_timeout(500)
        await pg.click("#submitBtn")
        await pg.wait_for_timeout(400)
        errs = await pg.evaluate("""() => document.querySelectorAll('.field.has-error').length""")
        ok("empty form blocked (2 errors)", errs == 2, str(errs))

        await pg.fill("#f-name", "Aisyah Rahman")
        await pg.fill("#f-phone", "123")
        await pg.click("#submitBtn")
        await pg.wait_for_timeout(400)
        phone_err = await pg.evaluate("""() => document.querySelector('#f-phone').closest('.field').classList.contains('has-error')""")
        ok("invalid phone rejected", phone_err)

        await pg.fill("#f-phone", "012-345 6789")
        await pg.select_option("#f-package", "business")
        await pg.wait_for_timeout(400)
        await pg.click("#submitBtn")
        await pg.wait_for_timeout(800)
        status = await pg.evaluate("""() => {
          const s = document.getElementById('formStatus');
          return { cls: s.className, visible: getComputedStyle(s).display, text: s.textContent.trim().slice(0,60) };
        }""")
        ok("form status visible", status["visible"] == "block", str(status))
        ok("honest no-backend message", ("isn't connected to a server" in status["text"]) or ("not connected" in status["text"]), status["text"])

        wa_href = await pg.evaluate("""() => document.getElementById('modalWa').getAttribute('href')""")
        ok("modal WA carries form data", "Aisyah" in wa_href and "Business" in wa_href, wa_href[:80])

        await pg.click("[data-close-form]")
        await pg.wait_for_timeout(300)

        # ---------- responsive: 320px ----------
        for w in [320, 360, 390, 414, 768, 1024, 1280, 1920]:
            await pg.set_viewport_size({"width": w, "height": 900})
            await pg.wait_for_timeout(350)
            over = await pg.evaluate("""() => document.documentElement.scrollWidth > window.innerWidth + 1""")
            ok(f"no h-overflow @{w}px", not over)

        # ---------- mobile nav ----------
        await pg.set_viewport_size({"width": 390, "height": 844})
        await pg.wait_for_timeout(400)
        burger_vis = await pg.evaluate("""() => getComputedStyle(document.getElementById('burger')).display !== 'none'""")
        ok("burger visible on mobile", burger_vis)
        await pg.click("#burger")
        await pg.wait_for_timeout(500)
        drawer = await pg.evaluate("""() => ({
          open: document.getElementById('drawer').classList.contains('is-open'),
          aria: document.getElementById('burger').getAttribute('aria-expanded'),
          links: document.querySelectorAll('#drawer a').length })""")
        ok("drawer opens", drawer["open"] and drawer["aria"] == "true" and drawer["links"] >= 7, str(drawer))

        scrim = await pg.evaluate("""() => {
          const s = document.getElementById('navScrim');
          return { disp: getComputedStyle(s).display, z: getComputedStyle(s).zIndex,
                   h: s.getBoundingClientRect().height };
        }""")
        ok("scrim dims page behind drawer", scrim["disp"] == "block" and scrim["h"] > 400, str(scrim))

        locked = await pg.evaluate("""() => document.body.style.overflow""")
        ok("background scroll locked", locked == "hidden", locked)

        # click the part of the scrim that the drawer doesn't cover
        await pg.mouse.click(195, 800)
        await pg.wait_for_timeout(500)
        scrim_off = await pg.evaluate("""() => getComputedStyle(document.getElementById('navScrim')).display""")
        ok("scrim click closes drawer", scrim_off == "none", scrim_off)

        await pg.click("#burger")
        await pg.wait_for_timeout(500)
        await pg.click("#drawer a")
        await pg.wait_for_timeout(600)
        closed = await pg.evaluate("""() => !document.getElementById('drawer').classList.contains('is-open')""")
        ok("drawer closes on link click", closed)

        # ---------- legal pages ----------
        for path, needle in [("/privacy", "Privacy Policy"), ("/terms", "Terms & Conditions")]:
            r = await pg.goto(BASE + "/" + path, wait_until="networkidle")
            ok(f"{path} loads", r.status == 200, str(r.status))
            t = await pg.title()
            ok(f"{path} title", needle in t, t)
        await ctx.close()

        # ---------- console clean ----------
        ok("no console errors", len(console_errs) == 0, "; ".join(console_errs[:3]))
        ok("no page errors", len(page_errs) == 0, "; ".join(page_errs[:3]))
        ok("no failed requests", len(failed_req) == 0, "; ".join(failed_req[:3]))

        await b.close()

    fails = [r for r in results if r[0] == "FAIL"]
    for s, n, e in results:
        print(f"{s}  {n}" + (f"   [{e}]" if e and s == "FAIL" else ""))
    print(f"\n{len(results)-len(fails)}/{len(results)} passed")
    if fails:
        sys.exit(1)

asyncio.run(main())
