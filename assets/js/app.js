/* ============================================================
   app.js — behaviour: nav, WhatsApp links, form, FAQ, reveal
   ============================================================ */

(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ============================================================
     BOOT
     ============================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof CONFIG === "undefined") {
      console.error("config.js failed to load");
      return;
    }
    if (window.__render) {
      Object.values(window.__render).forEach((fn) => {
        try {
          fn();
        } catch (e) {
          console.error("render error:", e);
        }
      });
    }

    wireWhatsApp();
    wireNav();
    wireFaq();
    wireForm();
    wireReveal();
    wireStickyCta();
    wireDevWarning();
  });

  /* ============================================================
     WHATSAPP — every CTA gets a prefilled message
     ============================================================ */
  function wireWhatsApp() {
    // general links
    $$("[data-wa]").forEach((el) => {
      el.setAttribute("href", waLink());
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    // package-specific links
    $$("[data-wa-pkg]").forEach((el) => {
      const pkg = el.dataset.waPkg;
      el.setAttribute("href", waLink(pkg));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    // custom message links
    $$("[data-wa-msg]").forEach((el) => {
      el.setAttribute("href", waLinkCustom(el.dataset.waMsg));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    // form modal WA button reflects selected package
    const sel = $("#f-package");
    const modalWa = $("#modalWa");
    if (sel && modalWa) {
      const sync = () => {
        modalWa.setAttribute("href", waLink(sel.value || null));
        modalWa.setAttribute("target", "_blank");
        modalWa.setAttribute("rel", "noopener noreferrer");
      };
      sel.addEventListener("change", sync);
      sync();
    }

    // auto-select package when a pricing CTA is clicked
    $$("[data-wa-pkg]").forEach((el) => {
      el.addEventListener("click", () => {
        if (sel) sel.value = el.dataset.waPkg;
        if (modalWa) modalWa.setAttribute("href", waLink(el.dataset.waPkg));
      });
    });
  }

  /* ============================================================
     NAV — sticky state, mobile drawer, active section
     ============================================================ */
  function wireNav() {
    const nav = $("#nav");
    const burger = $("#burger");
    const drawer = $("#drawer");

    const onScroll = () => {
      if (!nav) return;
      nav.classList.toggle("is-stuck", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (burger && drawer) {
      const scrim = $("#navScrim");

      const setScrim = (on) => {
        if (!scrim) return;
        scrim.classList.toggle("is-on", on);
      };

      const close = () => {
        drawer.classList.remove("is-open");
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Open menu");
        document.body.style.overflow = "";
        setScrim(false);
      };

      const open = () => {
        drawer.classList.add("is-open");
        nav.classList.add("is-open");
        burger.setAttribute("aria-expanded", "true");
        burger.setAttribute("aria-label", "Close menu");
        document.body.style.overflow = "hidden";
        setScrim(true);
      };

      burger.addEventListener("click", () => {
        drawer.classList.contains("is-open") ? close() : open();
      });

      drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
      if (scrim) scrim.addEventListener("click", close);

      window.addEventListener("resize", () => {
        if (window.innerWidth > 880) close();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
    }
  }

  /* ============================================================
     FAQ — accordion
     ============================================================ */
  function wireFaq() {
    $$(".faq__q").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq__item");
        const isOpen = item.classList.contains("is-open");

        // close all
        $$(".faq__item").forEach((i) => {
          i.classList.remove("is-open");
          const b = i.querySelector(".faq__q");
          if (b) b.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ============================================================
     FORM — validation + honest submit
     ============================================================ */
  function wireForm() {
    const modal = $("#enquiryModal");
    const form = $("#enquiryForm");
    const status = $("#formStatus");
    const submitBtn = $("#submitBtn");

    if (!modal || !form) return;

    const open = () => {
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
      setTimeout(() => $("#f-name")?.focus(), 120);
    };
    const close = () => {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
      hideStatus();
    };

    $$("[data-open-form]").forEach((b) => b.addEventListener("click", open));
    $$("[data-close-form]").forEach((b) => b.addEventListener("click", close));

    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });

    /* --- validation helpers --- */
    const setError = (field, show, msg) => {
      const wrap = field.closest(".field");
      if (!wrap) return;
      wrap.classList.toggle("has-error", show);
      if (msg) {
        const e = wrap.querySelector(".field__err");
        if (e) e.textContent = msg;
      }
    };

    const validPhone = (v) => {
      const digits = v.replace(/[^\d]/g, "");
      // Malaysian: 10-11 digits local, or 60 + 9-10
      if (digits.startsWith("60")) return digits.length >= 11 && digits.length <= 12;
      return digits.length >= 9 && digits.length <= 11;
    };

    const showStatus = (msg, kind) => {
      if (!status) return;
      status.textContent = msg;
      status.className = "form-status" + (kind ? " is-" + kind : "");
    };
    const hideStatus = () => {
      if (status) status.className = "form-status";
    };

    // live clear of errors
    ["f-name", "f-phone"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", () => setError(el, false));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideStatus();

      const name = $("#f-name");
      const phone = $("#f-phone");
      let ok = true;

      if (!name.value.trim() || name.value.trim().length < 2) {
        setError(name, true, "Please enter your name.");
        ok = false;
      } else setError(name, false);

      if (!phone.value.trim() || !validPhone(phone.value)) {
        setError(phone, true, "Please enter a valid Malaysian phone number.");
        ok = false;
      } else setError(phone, false);

      if (!ok) {
        (name.closest(".field").classList.contains("has-error") ? name : phone).focus();
        return;
      }

      const payload = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        business: $("#f-business")?.value.trim() || "",
        package: $("#f-package")?.value || "",
        message: $("#f-message")?.value.trim() || "",
        submittedAt: new Date().toISOString(),
        page: location.href,
      };

      /* ---------- No endpoint configured ---------- */
      if (!CONFIG.formEndpoint) {
        // Honest behaviour: no backend exists, so we do not pretend to save.
        // Hand the enquiry to WhatsApp instead — that channel genuinely works.
        const pkg = CONFIG.pricing.packages.find((p) => p.id === payload.package);
        let txt = `Hi ${CONFIG.brand.name}, I'd like to enquire about an online store.\n\n`;
        txt += `Name: ${payload.name}\n`;
        txt += `WhatsApp: ${payload.phone}\n`;
        if (payload.business) txt += `Business: ${payload.business}\n`;
        if (pkg) txt += `Package: ${pkg.name} (${money(pkg.price)})\n`;
        if (payload.message) txt += `\n${payload.message}`;

        showStatus(
          "This form isn't connected to a server yet, so nothing is stored. Tap the WhatsApp button below to send these details — it's pre-filled and ready.",
          "info"
        );

        // Repoint the WA button with the filled details
        const modalWa = $("#modalWa");
        if (modalWa) {
          modalWa.setAttribute("href", waLinkCustom(txt));
          modalWa.classList.add("btn--pulse");
          modalWa.focus();
        }
        return;
      }

      /* ---------- With an endpoint ---------- */
      submitBtn.disabled = true;
      const original = submitBtn.textContent;
      submitBtn.textContent = "Sending…";

      try {
        const res = await fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        form.reset();
        showStatus(
          "Thanks — your enquiry was received. We'll reply on WhatsApp within one working day.",
          "ok"
        );
        setTimeout(close, 3600);
      } catch (err) {
        showStatus(
          "Couldn't send right now. Please WhatsApp us instead — the button below is pre-filled.",
          "error"
        );
        console.error("Enquiry submit failed:", err);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      }
    });
  }

  /* ============================================================
     REVEAL ON SCROLL
     ============================================================ */
  function wireReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = $$(
      ".problem-card, .feature, .step, .price-card, .journey__step, .section-head, .demo, .maint, .faq__item"
    );
    targets.forEach((t) => t.classList.add("reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    targets.forEach((t) => io.observe(t));
  }

  /* ============================================================
     STICKY MOBILE CTA
     ============================================================ */
  function wireStickyCta() {
    const bar = $("#stickyCta");
    if (!bar) return;

    const pricing = $("#pricing");
    const isMobile = () => window.innerWidth <= 760;

    const update = () => {
      if (!isMobile()) {
        bar.classList.remove("is-on");
        return;
      }
      const past = window.scrollY > 620;
      const nearPricing = pricing
        ? (() => {
            const r = pricing.getBoundingClientRect();
            return r.top < window.innerHeight * 0.75 && r.bottom > 100;
          })()
        : false;
      bar.classList.toggle("is-on", past && !nearPricing);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ============================================================
     DEV WARNING — placeholder contact details
     ============================================================ */
  function wireDevWarning() {
    const needsWa = CONFIG.contact.whatsappIsPlaceholder;
    const needsEmail = CONFIG.contact.emailIsPlaceholder;
    if (!needsWa && !needsEmail) return;

    // Only surface this on a dev host — never on a live domain.
    const host = location.hostname;
    const isDev = host === "localhost" || host === "127.0.0.1" || host === "" || location.protocol === "file:";
    if (new URLSearchParams(location.search).has("preview")) return;
    if (!isDev) {
      console.warn(
        "[Forge] Placeholder contact details still in use. Edit CONFIG.contact in assets/js/config.js."
      );
      return;
    }

    const box = document.createElement("div");
    box.className = "dev-warn";
    box.innerHTML = `
      <button aria-label="Dismiss">×</button>
      <b>Setup needed:</b> replace the placeholder contact details in
      <code>assets/js/config.js</code> before going live.
      ${needsWa ? " WhatsApp number is not set." : ""}
      ${needsEmail ? " Email is not set." : ""}
    `;
    document.body.appendChild(box);
    box.querySelector("button").addEventListener("click", () => box.remove());

    console.warn(
      "[Forge] Placeholder contact details in use. Edit CONFIG.contact in assets/js/config.js."
    );
  }
})();
