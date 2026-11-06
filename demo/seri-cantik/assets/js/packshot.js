/* ============================================================
   packshot.js — packshot SVG generik (FIKSYEN)
   Semua bentuk dan label adalah rekaan. Tiada logo jenama sebenar,
   tiada reproduksi pembungkusan produk sebenar.
   ============================================================ */

/* Palet lembut: pink / cream / champagne / sage */
const PAL = {
  1: { body: "#f3d4dd", cap: "#c96b86", ink: "#7d3450", label: "#fff8fa", band: "#e8aec0" },
  2: { body: "#f7e6d8", cap: "#b8895f", ink: "#6d4a2c", label: "#fffaf5", band: "#e6c8ac" },
  3: { body: "#e8e3d3", cap: "#8c8264", ink: "#565033", label: "#fdfcf7", band: "#d2cab2" },
  4: { body: "#fae7d0", cap: "#c9a06a", ink: "#6f5227", label: "#fffdf8", band: "#ecd0aa" },
  5: { body: "#efdfe6", cap: "#9d6b82", ink: "#5f3a4a", label: "#fff9fb", band: "#dfc0ce" },
  6: { body: "#e5e9dd", cap: "#7a8b6c", ink: "#455239", label: "#fcfff7", band: "#cbd5bd" },
};

const BRAND_LINE = "SERI CANTIK";
const SMALL_LINE = "DEMO · BUKAN PRODUK SEBENAR";

function labelBlock(x, y, w, p, name, size = 7) {
  return `
    <text x="${x}" y="${y}" font-family="Georgia,serif" font-size="${size}" fill="${p.ink}" letter-spacing="1.6" text-anchor="middle">${BRAND_LINE}</text>
    <text x="${x}" y="${y + 9}" font-family="Helvetica,Arial,sans-serif" font-size="${size * 0.52}" fill="${p.ink}" opacity="0.62" letter-spacing="0.9" text-anchor="middle">${name}</text>
    <text x="${x}" y="${y + 16}" font-family="Helvetica,Arial,sans-serif" font-size="${size * 0.4}" fill="${p.ink}" opacity="0.4" letter-spacing="0.6" text-anchor="middle">${SMALL_LINE}</text>
  `;
}

const PACKSHOT = {
  /* Botol foundation — pam, bahu lebar */
  foundation(p, name) {
    return `
      <rect x="34" y="46" width="32" height="10" rx="3" fill="${p.cap}"/>
      <rect x="45" y="34" width="10" height="14" rx="2" fill="${p.cap}" opacity="0.85"/>
      <rect x="26" y="56" width="48" height="62" rx="7" fill="${p.body}"/>
      <rect x="26" y="56" width="10" height="62" rx="7" fill="#fff" opacity="0.28"/>
      <rect x="30" y="76" width="40" height="30" rx="3" fill="${p.label}"/>
      ${labelBlock(50, 87, 40, p, name, 6.2)}
    `;
  },

  /* Tiub — crimp bawah */
  tube(p, name) {
    return `
      <rect x="44" y="26" width="12" height="9" rx="2" fill="${p.cap}"/>
      <path d="M40 35h20l6 12v58l-6 5H40l-6-5V47z" fill="${p.body}"/>
      <path d="M40 35h8l4 12v63h-8l-6-5V47z" fill="#fff" opacity="0.25"/>
      <rect x="34" y="104" width="32" height="6" rx="2" fill="${p.band}"/>
      <rect x="37" y="62" width="26" height="26" rx="2" fill="${p.label}"/>
      ${labelBlock(50, 72, 26, p, name, 4.6)}
    `;
  },

  /* Balang — penutup lebar */
  jar(p, name) {
    return `
      <rect x="24" y="26" width="52" height="15" rx="4" fill="${p.cap}"/>
      <rect x="28" y="41" width="44" height="4" fill="${p.cap}" opacity="0.5"/>
      <rect x="22" y="45" width="56" height="66" rx="9" fill="${p.body}"/>
      <rect x="22" y="45" width="12" height="66" rx="9" fill="#fff" opacity="0.3"/>
      <ellipse cx="50" cy="45" rx="28" ry="5" fill="#fff" opacity="0.35"/>
      <rect x="28" y="66" width="44" height="30" rx="3" fill="${p.label}"/>
      ${labelBlock(50, 77, 44, p, name, 6)}
    `;
  },

  /* Kotak / set */
  box(p, name) {
    return `
      <path d="M18 46l32-14 32 14v56l-32 14-32-14z" fill="${p.body}"/>
      <path d="M50 32l32 14v56l-32 14z" fill="${p.band}" opacity="0.55"/>
      <path d="M18 46l32 14 32-14" fill="none" stroke="${p.cap}" stroke-width="1.6" opacity="0.5"/>
      <path d="M50 60v56" stroke="${p.cap}" stroke-width="1" opacity="0.3"/>
      <rect x="26" y="66" width="26" height="26" rx="2" fill="${p.label}" transform="rotate(-1 39 79)"/>
      ${labelBlock(39, 76, 26, p, name, 4.4)}
      <rect x="62" y="70" width="20" height="14" rx="2" fill="${p.cap}" opacity="0.7"/>
    `;
  },

  /* Botol serum — penitis, tinggi slim */
  serum(p, name) {
    return `
      <rect x="45" y="24" width="10" height="12" rx="2" fill="${p.cap}"/>
      <path d="M47 36h6l4 8v6H43v-6z" fill="${p.cap}" opacity="0.75"/>
      <rect x="35" y="50" width="30" height="66" rx="6" fill="${p.body}"/>
      <rect x="35" y="50" width="8" height="66" rx="6" fill="#fff" opacity="0.3"/>
      <rect x="38" y="70" width="24" height="32" rx="2" fill="${p.label}"/>
      ${labelBlock(50, 81, 24, p, name, 4.6)}
    `;
  },

  /* Botol tinggi toner */
  toner(p, name) {
    return `
      <rect x="42" y="24" width="16" height="10" rx="2" fill="${p.cap}"/>
      <rect x="40" y="34" width="20" height="6" fill="${p.cap}" opacity="0.6"/>
      <rect x="32" y="40" width="36" height="76" rx="6" fill="${p.body}"/>
      <rect x="32" y="40" width="9" height="76" rx="6" fill="#fff" opacity="0.28"/>
      <rect x="35" y="66" width="30" height="34" rx="2" fill="${p.label}"/>
      ${labelBlock(50, 77, 30, p, name, 5)}
    `;
  },

  /* Botol pam — losyen */
  pump(p, name) {
    return `
      <path d="M46 20h8v6h-8z" fill="${p.cap}"/>
      <path d="M50 26v6h-6v7h12v-7h-6" fill="${p.cap}" opacity="0.9"/>
      <rect x="38" y="26" width="10" height="3" rx="1.5" fill="${p.cap}"/>
      <rect x="30" y="39" width="40" height="77" rx="8" fill="${p.body}"/>
      <rect x="30" y="39" width="10" height="77" rx="8" fill="#fff" opacity="0.26"/>
      <rect x="33" y="64" width="34" height="38" rx="3" fill="${p.label}"/>
      ${labelBlock(50, 76, 34, p, name, 5.4)}
    `;
  },

  /* Sabun bar */
  soap(p, name) {
    return `
      <rect x="22" y="52" width="56" height="50" rx="5" fill="${p.body}"/>
      <rect x="22" y="52" width="56" height="50" rx="5" fill="none" stroke="${p.cap}" stroke-width="1" opacity="0.4"/>
      <path d="M22 64h56" stroke="${p.cap}" stroke-width="1" opacity="0.25"/>
      <path d="M22 90h56" stroke="${p.cap}" stroke-width="1" opacity="0.25"/>
      <rect x="30" y="68" width="40" height="20" rx="2" fill="${p.label}"/>
      ${labelBlock(50, 75, 40, p, name, 4.8)}
      <ellipse cx="50" cy="52" rx="28" ry="4" fill="#fff" opacity="0.4"/>
    `;
  },

  /* Botol biasa — minyak urut */
  bottle(p, name) {
    return `
      <rect x="44" y="26" width="12" height="12" rx="3" fill="${p.cap}"/>
      <path d="M44 38h12v8H44z" fill="${p.cap}" opacity="0.55"/>
      <path d="M34 46h32v70H34z" fill="${p.body}"/>
      <path d="M34 46h9v70h-9z" fill="#fff" opacity="0.26"/>
      <rect x="37" y="66" width="26" height="34" rx="2" fill="${p.label}"/>
      ${labelBlock(50, 77, 26, p, name, 4.6)}
    `;
  },

  /* Sachet — pek serat / kolagen */
  sachet(p, name) {
    return `
      <path d="M22 34h56v72H22z" fill="${p.body}"/>
      <path d="M22 34h56v8H22z" fill="${p.cap}" opacity="0.5"/>
      <path d="M22 98h56v8H22z" fill="${p.cap}" opacity="0.5"/>
      <path d="M22 34h14v72H22z" fill="#fff" opacity="0.2"/>
      <rect x="30" y="54" width="40" height="32" rx="2" fill="${p.label}"/>
      ${labelBlock(50, 65, 40, p, name, 5.4)}
      <path d="M64 42l6 6-6 6" stroke="${p.cap}" stroke-width="1.2" fill="none" opacity="0.6"/>
    `;
  },
};

/**
 * Bina markup packshot sebagai string SVG.
 * @param {string} type  jenis bekas
 * @param {number} palette 1–6
 * @param {string} label  nama pendek pada label
 * @param {string} extra  kelas tambahan
 */
function packshot(type, palette = 1, label = "", extra = "") {
  const p = PAL[palette] || PAL[1];
  const draw = PACKSHOT[type] || PACKSHOT.bottle;
  const shortLabel = (label || "PRODUK").toUpperCase().slice(0, 18);

  return `<svg class="pk ${extra}" viewBox="0 0 100 130" role="img" aria-label="Ilustrasi pembungkusan ${shortLabel.toLowerCase()} (rekaan)" fill="none">
    <defs>
      <linearGradient id="sh-${type}-${palette}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity="0.07"/>
        <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="117" rx="30" ry="5" fill="url(#sh-${type}-${palette})"/>
    ${draw(p, shortLabel)}
  </svg>`;
}

/* Ikon kategori */
const CAT_ICON = {
  face: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9 15c1.6 1.2 4.4 1.2 6 0"/></svg>`,
  body: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="4.5" r="2.2"/><path d="M12 6.7v7M8 21l4-7.3L16 21M6 10.5l6-1.5 6 1.5"/></svg>`,
  leaf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 4C10 4 4 9 4 16c0 2 .6 3.4.6 3.4S6 21 12 21c7 0 8-8 8-17z"/><path d="M4.5 19.5C8 14 13 10 18 7.5"/></svg>`,
  drop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3c3.5 4.5 6 8 6 11a6 6 0 0 1-12 0c0-3 2.5-6.5 6-11z"/></svg>`,
};
