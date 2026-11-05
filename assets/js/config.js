/* ============================================================
   CENTRAL CONFIG — edit everything about the business here.
   Prices, packages, contact, socials, brand, WhatsApp number.
   ============================================================ */

const CONFIG = {
  brand: {
    name: "Forge Sales",
    tagline: "Online stores for Malaysian businesses",
    // Keep short — used in nav and footer
    short: "Forge",
  },

  contact: {
    // ⚠️ PLACEHOLDER — REPLACE WITH YOUR REAL NUMBER
    // Format: country code + number, digits only. Malaysia = 60...
    whatsapp: "60123456789",
    whatsappIsPlaceholder: true,

    email: "hello@forgesales.my",
    emailIsPlaceholder: true,

    hours: "Mon–Fri, 9am – 6pm (MYT)",
    location: "Malaysia",
  },

  socials: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
  },

  // Optional: where the enquiry form posts. Leave empty to disable the form
  // and show WhatsApp-only contact. See README for how to wire this up.
  formEndpoint: "",

  pricing: {
    currency: "RM",
    note:
      "Domain, hosting, payment gateway fees and third-party subscriptions are charged separately where applicable.",

    packages: [
      {
        id: "starter",
        name: "Starter",
        price: 1499,
        priceNote: "one-time",
        tagline: "Get online properly, without the agency price tag.",
        bestFor: "WhatsApp sellers ready for a real storefront",
        cta: "Start with Starter",
        highlighted: false,
        features: [
          "Professional e-commerce website",
          "Mobile-responsive design",
          "Product catalogue",
          "Shopping cart",
          "WhatsApp-assisted ordering or checkout",
          "Basic contact information",
          "Basic SEO setup",
        ],
        notIncluded: [
          "Customer accounts",
          "Online payment gateway",
          "Order management dashboard",
        ],
      },
      {
        id: "business",
        name: "Business",
        price: 2499,
        priceNote: "one-time",
        tagline: "Take payments online and stop chasing orders manually.",
        bestFor: "SMEs taking consistent daily orders",
        cta: "Choose Business",
        highlighted: true,
        badge: "Most chosen",
        features: [
          "Everything in Starter",
          "Enhanced storefront customisation",
          "Customer account functionality",
          "Online payment gateway integration",
          "Order management",
          "Basic sales dashboard",
        ],
        notIncluded: ["Advanced reporting", "Priority support"],
        caveat:
          "Payment gateway is subject to provider availability and approval. Some providers require a registered business (SSM) and a business bank account.",
      },
      {
        id: "premium",
        name: "Premium",
        price: 3999,
        priceNote: "one-time",
        tagline: "For stores that are already moving volume and need more control.",
        bestFor: "established businesses scaling promotions and reporting",
        cta: "Go Premium",
        highlighted: false,
        features: [
          "Everything in Business",
          "Advanced storefront customisation",
          "Enhanced promotional features",
          "Advanced reporting",
          "Priority support",
          "Additional business-specific functionality",
        ],
        notIncluded: [],
        caveat:
          "Additional business-specific functionality is subject to agreed scope before development starts.",
      },
    ],

    maintenance: {
      price: 79,
      unit: "month",
      label: "Optional maintenance",
      description:
        "Updates, backups, small content changes and technical support. Cancel anytime with 30 days notice.",
      includes: [
        "Software and security updates",
        "Regular backups",
        "Small content changes",
        "Technical support",
      ],
    },
  },

  // Shown in the comparison table. Keep rows short.
  comparison: {
    rows: [
      { label: "E-commerce website", starter: true, business: true, premium: true },
      { label: "Mobile-responsive design", starter: true, business: true, premium: true },
      { label: "Product catalogue", starter: true, business: true, premium: true },
      { label: "Shopping cart", starter: true, business: true, premium: true },
      { label: "WhatsApp-assisted checkout", starter: true, business: true, premium: true },
      { label: "Basic SEO setup", starter: true, business: true, premium: true },
      { label: "Enhanced storefront customisation", starter: false, business: true, premium: true },
      { label: "Customer accounts", starter: false, business: true, premium: true },
      { label: "Online payment gateway", starter: false, business: true, premium: true },
      { label: "Order management", starter: false, business: true, premium: true },
      { label: "Sales dashboard", starter: false, business: "Basic", premium: "Advanced" },
      { label: "Promotional features", starter: false, business: "Standard", premium: "Enhanced" },
      { label: "Advanced reporting", starter: false, business: false, premium: true },
      { label: "Priority support", starter: false, business: false, premium: true },
      { label: "Custom functionality", starter: false, business: false, premium: "By scope" },
    ],
  },

  timeline: {
    note: "Typical timelines for a standard store with your content ready. Complex requirements take longer.",
    steps: [
      {
        n: 1,
        title: "Choose your package",
        desc: "Pick the package that fits where your business is now. You can upgrade later — nothing is locked in.",
        time: "Day 0",
      },
      {
        n: 2,
        title: "Submit your business information",
        desc: "Send us your logo, product list with photos and prices, and your business details. We give you a simple checklist so nothing is missed.",
        time: "Day 1–2",
      },
      {
        n: 3,
        title: "We design and develop your store",
        desc: "We build your storefront with your branding and products. You get a private preview link to watch progress.",
        time: "Day 3–10",
      },
      {
        n: 4,
        title: "Review and approve",
        desc: "You test the store on your own phone. We fix anything that isn't right. Two rounds of revisions included.",
        time: "Day 11–14",
      },
      {
        n: 5,
        title: "Launch your online store",
        desc: "We connect your domain, run a final check and hand over. You get a short walkthrough on managing orders and products.",
        time: "Day 15",
      },
    ],
  },

  faq: [
    {
      q: "Do I need technical knowledge to use this?",
      a: "No. You manage products and orders through a simple admin panel — if you can use WhatsApp and Facebook, you can use this. We also do a short walkthrough session when we hand over the store, and you can record it for your own reference.",
    },
    {
      q: "Can I update products and prices myself?",
      a: "Yes. Adding products, changing prices, updating photos and marking items out of stock are all done by you through the admin panel. No code, no need to contact us for everyday changes.",
    },
    {
      q: "What about domain and hosting?",
      a: "Domain and hosting are charged separately because they're registered in your name — that way you own them, not us. Expect roughly RM60–120/year for a .com or .com.my domain, and RM30–80/month for hosting depending on your package and traffic. We handle the setup; you pay the provider directly.",
    },
    {
      q: "How does payment gateway setup work?",
      a: "Payment gateway integration is included in Business and Premium. Approval is decided by the provider, not by us. Most Malaysian providers require a registered business (SSM), a business bank account and a website that meets their requirements. We prepare your store to meet those requirements and guide you through the application. If a provider rejects the application, we'll suggest alternatives — but we can't guarantee approval.",
    },
    {
      q: "How long does development take?",
      a: "A standard store takes about two weeks from the day we receive your complete content. The biggest delay is usually waiting for product photos and descriptions, so we give you a checklist on day one. Complex requirements or payment gateway approval can extend the timeline.",
    },
    {
      q: "What does maintenance cover?",
      a: "RM79/month covers software and security updates, regular backups, small content changes and technical support. It's optional — the store works without it — but without maintenance you're responsible for updates and backups yourself.",
    },
    {
      q: "Can I request custom features?",
      a: "Yes, and it's priced separately based on scope. Premium includes a stated allowance for business-specific functionality, agreed in writing before development starts. For Starter and Business, custom work is quoted per request. We'll always tell you the cost before we build anything.",
    },
    {
      q: "What if I already have a domain and a logo?",
      a: "Use them. We connect your existing domain at no extra charge, and we build around your existing logo and brand colours. If your logo only exists as a low-resolution image, we'll tell you honestly whether it will look sharp on a storefront.",
    },
    {
      q: "Can I see the store before it goes live?",
      a: "Yes. You get a private preview link on a temporary address. You test it on your own phone, and we fix anything that isn't right before launch. Two rounds of revisions are included in every package.",
    },
    {
      q: "What happens to my store if I stop paying maintenance?",
      a: "Your store stays live and you keep full ownership of the code, domain and data. You just stop receiving updates, backups and support. You can resume maintenance later.",
    },
  ],

  seo: {
    title: "E-Commerce Website Development in Malaysia | From RM1,499",
    description:
      "Ready-made, customisable online stores for Malaysian SMEs. Product catalogue, cart, WhatsApp checkout and payment gateway. From RM1,499 one-time. Launch in about two weeks.",
    keywords:
      "ecommerce website malaysia, online store malaysia, website for small business, kedai online, buat website ecommerce",
    url: "https://forgesales.pages.dev/",
  },

  // Hero and section copy — edit here, not in the HTML
  copy: {
    hero: {
      eyebrow: "For Malaysian small businesses & SMEs",
      headline: "Turn your business into an online store.",
      headlineAccent: "Let customers shop anytime.",
      sub:
        "A ready-made, customisable e-commerce website built for how Malaysian businesses actually sell — catalogue, cart, WhatsApp checkout, and online payment when you're ready for it.",
      ctaPrimary: "Get Your Online Store",
      ctaSecondary: "View Packages",
      trust: [
        "From RM1,499 one-time",
        "Live in about 2 weeks",
        "You own your domain and store",
      ],
    },

    problem: {
      eyebrow: "The problem",
      title: "Selling through WhatsApp works — until it doesn't.",
      sub:
        "Every order is a manual conversation. The moment volume picks up, things start slipping through.",
      items: [
        {
          title: "Enquiries go unanswered",
          desc: "A message at 11pm gets buried under twenty others by morning. That customer already bought somewhere else.",
        },
        {
          title: "You answer the same questions daily",
          desc: "Price? Got stock? Can post to Sabah? You've typed the same replies hundreds of times.",
        },
        {
          title: "Product management is guesswork",
          desc: "Prices live in three different places. An old photo is still circulating. Someone orders something you stopped selling last month.",
        },
        {
          title: "There's nothing to send people to",
          desc: "Running a Facebook ad? You have no link to send them to except a phone number. Every visitor needs a conversation before they can buy.",
        },
      ],
    },

    solution: {
      eyebrow: "The solution",
      title: "A store that answers for you, 24 hours a day.",
      sub:
        "Customers browse your full catalogue, see real prices and stock, and check out — without waiting for you to reply.",
      journey: [
        { n: 1, title: "Browse", desc: "Full catalogue with photos, prices and descriptions. Searchable and organised by category." },
        { n: 2, title: "Add to cart", desc: "Customers pick what they want. The cart holds it while they keep shopping." },
        { n: 3, title: "Checkout", desc: "Delivery details collected once. Pay online, or send the order straight to your WhatsApp." },
        { n: 4, title: "Order confirmation", desc: "Customer gets a confirmation. You get the order in your dashboard with everything filled in." },
      ],
      note:
        "You still talk to customers — but about the things that need a human, not about whether an item is in stock.",
    },

    features: {
      eyebrow: "What you get",
      title: "Everything a real storefront needs. Nothing you'll never use.",
      items: [
        {
          title: "Product catalogue",
          desc: "Unlimited products with photos, variants, prices and stock. Organised into categories your customers can actually browse.",
          icon: "grid",
        },
        {
          title: "Shopping cart",
          desc: "A cart that holds selections across the session, calculates totals and applies delivery charges by zone.",
          icon: "cart",
        },
        {
          title: "Checkout",
          desc: "One-page checkout collecting name, phone, address and delivery preference. No account required to buy.",
          icon: "checkout",
        },
        {
          title: "Mobile-first storefront",
          desc: "Designed on a phone first, because that's where most of your customers are. Fast on Malaysian mobile data.",
          icon: "mobile",
        },
        {
          title: "Order management",
          desc: "Every order lands in one dashboard with status tracking — new, paid, packed, shipped. No more scrolling chat history.",
          icon: "orders",
        },
        {
          title: "Payment integration",
          desc: "Online payment through Malaysian gateways where your business qualifies, or WhatsApp-assisted ordering if it doesn't.",
          icon: "payment",
        },
        {
          title: "Your branding",
          desc: "Your logo, your colours, your store name on your own domain. Not a page inside someone else's marketplace.",
          icon: "brand",
        },
      ],
    },

    portfolio: {
      eyebrow: "Sample storefront",
      title: "See what your store could look like.",
      sub:
        "A demonstration storefront built with the same components included in every package. Products, prices and the business name are illustrative — not a real client.",
      disclaimer:
        "Demo only. This is an illustrative sample built to show layout and functionality. Products, prices and business details are fictional.",
    },
  },
};

/* Prefilled WhatsApp message builders */
function waLink(packageName) {
  const num = CONFIG.contact.whatsapp;
  const pkg = packageName
    ? CONFIG.pricing.packages.find((p) => p.id === packageName)
    : null;

  let msg = `Hi ${CONFIG.brand.name}, I'm interested in an e-commerce website for my business.`;
  if (pkg) {
    msg = `Hi ${CONFIG.brand.name}, I'm interested in the ${pkg.name} package (${CONFIG.pricing.currency}${pkg.price.toLocaleString("en-MY")}). Can you tell me more?`;
  } else {
    msg += ` Can you tell me more about the packages?`;
  }
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

function waLinkCustom(text) {
  return `https://wa.me/${CONFIG.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}
