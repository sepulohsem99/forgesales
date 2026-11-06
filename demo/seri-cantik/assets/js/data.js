/* ============================================================
   Seri Cantik Store — data demo
   Semua produk, harga, stok adalah FIKSYEN untuk tujuan demonstrasi.
   Tiada kaitan dengan mana-mana jenama sebenar.
   ============================================================ */

const STORE = {
  name: "Seri Cantik Store",
  tagline: "Kecantikan & kesihatan untuk rakyat Malaysia",
  phone: "012-345 6789",
  email: "hai@sericantik.demo",
  addr: "No. 12, Jalan Seri Wangi, Taman Melati, 53100 Kuala Lumpur",
  hours: "Isnin – Sabtu, 9 pagi – 7 malam",
};

/* ---------- Kategori ---------- */
const CATS = [
  { id: "wajah", name: "Penjagaan Wajah", desc: "Foundation, krim, serum dan set penjagaan harian.", icon: "face" },
  { id: "badan", name: "Penjagaan Badan", desc: "Losyen, sabun, scrub dan minyak urutan.", icon: "body" },
  { id: "wellness", name: "Pelangsingan & Wellness", desc: "Serat, minuman kesihatan dan penjagaan bentuk.", icon: "leaf" },
  { id: "intim", name: "Penjagaan Intim", desc: "Penjagaan diri wanita, pasangan dan lelaki.", icon: "drop" },
];

/* ---------- Produk ----------
   img: jenis packshot (lihat packshot.js)
   palette: 1–6
   stock: 'in' | 'low' | 'out'
   variants: { label, options: [{ id, name, delta }] }
--------------------------------- */
const PRODUCTS = [
  /* ===== A. PENJAGAAN WAJAH ===== */
  {
    sku: "SC-FDN-01",
    name: "Diamond Foundation",
    cat: "wajah",
    price: 89,
    compareAt: 119,
    img: "foundation",
    palette: 1,
    badge: "best",
    short: "Foundation cecair tekstur ringan dengan hasil akhir satin. Meliputi kemerahan tanpa rasa berat.",
    details: [
      "Tekstur cecair ringan, mudah dibaur dengan jari atau span",
      "Hasil akhir satin — tidak terlalu matte, tidak terlalu berkilat",
      "Pilihan 6 nada kulit daripada cerah sejuk hingga sawo matang",
      "Saiz 30ml, botol pam kaca",
    ],
    stock: "in",
    variants: {
      label: "Nada",
      options: [
        { id: "n01", name: "N01 Ivory Sejuk", delta: 0 },
        { id: "n02", name: "N02 Beige Asli", delta: 0 },
        { id: "n03", name: "N03 Sand Hangat", delta: 0 },
        { id: "n04", name: "N04 Golden Sawo", delta: 0 },
        { id: "n05", name: "N05 Tan Malaya", delta: 0 },
        { id: "n06", name: "N06 Deep Bronze", delta: 0 },
      ],
    },
    tags: ["best", "promo"],
  },
  {
    sku: "SC-TNT-02",
    name: "Tinted Moisturizer SPF50",
    cat: "wajah",
    price: 75,
    compareAt: 95,
    img: "tube",
    palette: 2,
    badge: "best",
    short: "Pelembap berwarna dengan perlindungan SPF50 PA++++. Satu langkah untuk lembap, warna sekata dan perlindungan matahari.",
    details: [
      "SPF50 PA++++ untuk cuaca Malaysia",
      "Formula ringan, tidak lengkap berminyak pada kulit kombinasi",
      "Boleh dipakai bersendirian atau sebagai base foundation",
      "Saiz 40ml, tiub mudah dibawa",
    ],
    stock: "in",
    variants: {
      label: "Nada",
      options: [
        { id: "light", name: "Light", delta: 0 },
        { id: "medium", name: "Medium", delta: 0 },
        { id: "tan", name: "Tan", delta: 0 },
      ],
    },
    tags: ["best"],
  },
  {
    sku: "SC-KRM-03",
    name: "Krim Madu Propolis",
    cat: "wajah",
    price: 65,
    compareAt: 85,
    img: "jar",
    palette: 3,
    short: "Krim malam berasaskan madu dan propolis. Melembap kulit kering dan menenangkan kulit yang meradang.",
    details: [
      "Tekstur krim pekat tetapi cepat meresap",
      "Sesuai untuk kulit kering dan kulit sensitif",
      "Dipakai sebagai langkah terakhir rutin malam",
      "Saiz 50g, balang kaca",
    ],
    stock: "in",
    variants: null,
    tags: ["promo"],
  },
  {
    sku: "SC-SET-04",
    name: "Set Penjagaan Wajah 5 Langkah",
    cat: "wajah",
    price: 199,
    compareAt: 259,
    img: "box",
    palette: 4,
    badge: "bundle",
    short: "Set lengkap pencuci, toner, serum, pelembap dan krim malam. Rutin penuh untuk pemula yang tak tahu nak mula dari mana.",
    details: [
      "5 produk dalam satu kotak: pencuci 100ml, toner 120ml, serum 30ml, pelembap 50ml, krim malam 30g",
      "Disusun ikut urutan penggunaan — ada kad panduan dalam kotak",
      "Jimat RM60 berbanding beli berasingan",
      "Kotak hadiah sesuai untuk hadiah",
    ],
    stock: "in",
    variants: null,
    tags: ["bundle", "best"],
  },
  {
    sku: "SC-SRM-05",
    name: "Serum Vitamin C",
    cat: "wajah",
    price: 79,
    img: "serum",
    palette: 5,
    badge: "new",
    short: "Serum pencerah dengan vitamin C stabil. Membantu kusam dan warna kulit tidak sekata nampak lebih cerah.",
    details: [
      "Vitamin C 10% dalam formula stabil",
      "Tekstur ringan, tiada rasa melekit",
      "Dipakai pagi sebelum pelembap dan sunscreen",
      "Saiz 30ml, botol penitis kaca gelap",
    ],
    stock: "in",
    variants: {
      label: "Saiz",
      options: [
        { id: "15", name: "15ml", delta: -30 },
        { id: "30", name: "30ml", delta: 0 },
      ],
    },
    tags: ["new"],
  },
  {
    sku: "SC-TNR-06",
    name: "Toner Mawar Menenangkan",
    cat: "wajah",
    price: 45,
    img: "toner",
    palette: 6,
    short: "Toner air mawar tanpa alkohol. Menyegarkan dan mengimbangi pH kulit selepas mencuci muka.",
    details: [
      "Tanpa alkohol, tanpa pewarna",
      "Boleh disapu dengan kapas atau ditepuk dengan tangan",
      "Sesuai untuk semua jenis kulit",
      "Saiz 150ml, botol plastik kitar semula",
    ],
    stock: "in",
    variants: null,
    tags: [],
  },
  {
    sku: "SC-CLN-07",
    name: "Pencuci Wajah Lembut",
    cat: "wajah",
    price: 39,
    img: "tube",
    palette: 3,
    short: "Pencuci muka busa halus. Membersih tanpa rasa ketat atau kering selepas dibilas.",
    details: [
      "Busa halus, sesuai untuk kulit sensitif",
      "pH seimbang, tiada sulfat keras",
      "Pagi dan malam",
      "Saiz 120ml",
    ],
    stock: "low",
    variants: null,
    tags: [],
  },

  /* ===== B. PENJAGAAN BADAN ===== */
  {
    sku: "SC-LSN-08",
    name: "Losyen Badan Susu Kambing",
    cat: "badan",
    price: 55,
    compareAt: 69,
    img: "pump",
    palette: 4,
    badge: "best",
    short: "Losyen pekat berasaskan susu kambing. Melembap kulit kering berjam-jam, wangi lembut.",
    details: [
      "Tekstur pekat tetapi tidak melekit",
      "Wangi susu dan vanila yang lembut",
      "Sesuai untuk kulit sangat kering dan eczema ringan",
      "Saiz 250ml, botol pam",
    ],
    stock: "in",
    variants: {
      label: "Saiz",
      options: [
        { id: "150", name: "150ml", delta: -15 },
        { id: "250", name: "250ml", delta: 0 },
        { id: "500", name: "500ml (isi semula)", delta: 30 },
      ],
    },
    tags: ["best"],
  },
  {
    sku: "SC-SBN-09",
    name: "Sabun Mandian Herba",
    cat: "badan",
    price: 29,
    img: "soap",
    palette: 2,
    short: "Sabun bar herba dengan serai wangi dan pegaga. Menyegarkan tanpa rasa kesat.",
    details: [
      "Sabun bar 100g, dibungkus kertas tahan lembap",
      "Aroma herba semula jadi",
      "Sesuai untuk mandi pagi dan malam",
      "Dijual sekotak 3 bar juga tersedia",
    ],
    stock: "in",
    variants: {
      label: "Pek",
      options: [
        { id: "1", name: "1 bar", delta: 0 },
        { id: "3", name: "3 bar (jimat)", delta: 49 },
      ],
    },
    tags: [],
  },
  {
    sku: "SC-SCR-10",
    name: "Body Scrub Kopi Arabika",
    cat: "badan",
    price: 49,
    img: "jar",
    palette: 5,
    short: "Scrub kopi kasar sederhana untuk meluluhkan kulit mati. Kulit rasa lebih licin selepas dibilas.",
    details: [
      "Butiran kopi sebenar, bukan mikroplastik",
      "Minyak kelapa sebagai base — lembap selepas dibilas",
      "Guna 2–3 kali seminggu",
      "Saiz 200g, balang plastik",
    ],
    stock: "in",
    variants: null,
    tags: ["promo"],
  },
  {
    sku: "SC-MNY-11",
    name: "Minyak Urutan Herba",
    cat: "badan",
    price: 59,
    img: "bottle",
    palette: 6,
    short: "Minyak urutan hangat untuk lenguh badan dan kaki selepas kerja. Aroma halia dan serai.",
    details: [
      "Campuran minyak kelapa, halia dan serai",
      "Rasa hangat sederhana, sesuai untuk urutan sendiri",
      "Boleh juga digunakan sebelum tidur pada kaki lenguh",
      "Saiz 100ml, botol kaca",
    ],
    stock: "in",
    variants: null,
    tags: ["best"],
  },

  /* ===== C. PELANGSINGAN & WELLNESS ===== */
  {
    sku: "SC-FBR-12",
    name: "Serat Fiber Minuman",
    cat: "wellness",
    price: 89,
    compareAt: 109,
    img: "sachet",
    palette: 1,
    badge: "best",
    short: "Serbuk serat larut untuk dicampur air. Membantu rasa kenyang lebih lama dan penghadaman lebih teratur.",
    details: [
      "30 sachet dalam sekotak (1 bulan)",
      "Rasa laici, larut dalam air biasa atau sejuk",
      "Minum 1 sachet sebelum makan malam",
      "Bukan ubat. Bukan pengganti makanan seimbang.",
    ],
    stock: "in",
    variants: {
      label: "Perisa",
      options: [
        { id: "lychee", name: "Laici", delta: 0 },
        { id: "lemon", name: "Lemon", delta: 0 },
        { id: "grape", name: "Anggur", delta: 0 },
      ],
    },
    tags: ["best", "promo"],
  },
  {
    sku: "SC-KLG-13",
    name: "Minuman Kolagen Peptida",
    cat: "wellness",
    price: 129,
    compareAt: 159,
    img: "sachet",
    palette: 3,
    badge: "new",
    short: "Serbuk kolagen peptida dengan vitamin C. Untuk sokongan keanjalan kulit dari dalam.",
    details: [
      "28 sachet dalam sekotak",
      "Kolagen peptida saiz kecil — mudah larut",
      "Rasa campuran buah oren",
      "Bukan ubat. Hasil berbeza mengikut individu.",
    ],
    stock: "in",
    variants: null,
    tags: ["new"],
  },
  {
    sku: "SC-KRM-14",
    name: "Krim Bentuk Badan",
    cat: "wellness",
    price: 79,
    img: "jar",
    palette: 2,
    short: "Krim urutan untuk kawasan perut dan peha. Dipakai bersama urutan, bukan pengganti senaman.",
    details: [
      "Krim urutan dengan rasa hangat ringan",
      "Dipakai 2 kali sehari selepas mandi",
      "Saiz 150g",
      "Bukan ubat. Tiada jaminan penurunan berat badan.",
    ],
    stock: "in",
    variants: null,
    tags: [],
  },
  {
    sku: "SC-TEH-15",
    name: "Teh Herba Detox",
    cat: "wellness",
    price: 39,
    img: "box",
    palette: 4,
    short: "Campuran teh herba untuk minuman malam. Membantu rasa lebih ringan selepas makan berat.",
    details: [
      "25 uncang dalam sekotak",
      "Campuran senna, halia dan pudina",
      "Minum 1 cawan sebelum tidur, tidak lebih",
      "Tidak sesuai untuk ibu mengandung atau menyusu",
    ],
    stock: "low",
    variants: null,
    tags: [],
  },

  /* ===== D. PENJAGAAN INTIM ===== */
  {
    sku: "SC-INT-16",
    name: "Pencuci Intim Wanita",
    cat: "intim",
    price: 35,
    img: "pump",
    palette: 5,
    short: "Pencuci kawasan intim dengan pH seimbang. Formula lembut tanpa wangian kuat.",
    details: [
      "pH 4.5, seimbang dengan kawasan intim",
      "Tanpa sabun keras dan tanpa paraben",
      "Dipakai di luar sahaja, bilas dengan air",
      "Saiz 200ml, botol pam",
    ],
    stock: "in",
    variants: null,
    tags: ["best"],
  },
  {
    sku: "SC-INT-17",
    name: "Losyen Urutan Pasangan",
    cat: "intim",
    price: 69,
    img: "tube",
    palette: 6,
    short: "Losyen urutan berasaskan air untuk pasangan dewasa. Mudah dibasuh, tiada bau kuat.",
    details: [
      "Formula berasaskan air, mudah dibasuh",
      "Tiada paraben, tiada gliserin berlebihan",
      "Tiub 100ml, penutup flip",
      "Untuk dewasa 18 tahun ke atas",
    ],
    stock: "in",
    variants: null,
    tags: [],
  },
  {
    sku: "SC-INT-18",
    name: "Sabun Penjagaan Lelaki",
    cat: "intim",
    price: 32,
    img: "bottle",
    palette: 1,
    short: "Pencuci badan dan kawasan intim lelaki. Formula sejuk dengan mentol ringan.",
    details: [
      "Sesuai untuk kulit lelaki yang mudah berpeluh",
      "Mentol ringan, tidak pedih",
      "Boleh digunakan setiap hari",
      "Saiz 250ml",
    ],
    stock: "in",
    variants: null,
    tags: [],
  },
];

/* ---------- Kod diskaun demo ---------- */
const CODES = {
  SERI10:  { type: "pct",  value: 10, min: 0,   label: "10% diskaun" },
  CANTIK20:{ type: "flat", value: 20, min: 150, label: "RM20 diskaun (min RM150)" },
  JIMAT30: { type: "flat", value: 30, min: 250, label: "RM30 diskaun (min RM250)" },
};

/* ---------- Penghantaran ---------- */
const SHIP = {
  semenanjung: { label: "Semenanjung Malaysia", fee: 8,  freeAt: 100, eta: "2–4 hari bekerja" },
  sabahSarawak: { label: "Sabah & Sarawak",     fee: 15, freeAt: 200, eta: "4–7 hari bekerja" },
};

const STATES = [
  "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang",
  "Perak", "Perlis", "Pulau Pinang", "Selangor", "Terengganu",
  "Kuala Lumpur", "Labuan", "Putrajaya",
  "Sabah", "Sarawak",
];

/* ---------- Testimoni (FIKSYEN) ---------- */
const REVIEWS = [
  { name: "Nurul A.", place: "Shah Alam", stars: 5, text: "Foundation dia ringan sangat, tak rasa macam pakai make-up tebal. Nada N03 padan dengan kulit saya.", item: "Diamond Foundation" },
  { name: "Siti R.", place: "Kota Bharu", stars: 5, text: "Order malam, pagi dah dapat tracking. Bubble wrap tebal, botol tak pecah.", item: "Set Penjagaan Wajah 5 Langkah" },
  { name: "Farah I.", place: "Johor Bahru", stars: 4, text: "Serat fiber rasa laici sedap, senang larut. Cuma harap ada pek besar.", item: "Serat Fiber Minuman" },
  { name: "Aisyah M.", place: "Kuching", stars: 5, text: "Losyen susu kambing memang melembap. Kulit kaki saya yang merekah dah ok lepas 2 minggu.", item: "Losyen Badan Susu Kambing" },
  { name: "Hafiz Z.", place: "Ipoh", stars: 5, text: "Minyak urutan hangat dia sedap untuk kaki lenguh lepas kerja. Beli untuk mak sekali.", item: "Minyak Urutan Herba" },
  { name: "Tan L.", place: "Penang", stars: 5, text: "Toner mawar tak pedih langsung, sesuai untuk kulit saya yang sensitif.", item: "Toner Mawar Menenangkan" },
];

/* ---------- FAQ ---------- */
const FAQ = [
  { q: "Ini kedai betul ke?", a: "Tidak. Seri Cantik Store ialah laman demonstrasi yang dibina oleh Forge Sales untuk menunjukkan fungsi kedai online. Semua produk, harga, stok, ulasan dan pesanan adalah rekaan. Tiada barang akan dihantar dan tiada bayaran diambil." },
  { q: "Ada kaitan dengan D'Herbs atau Dato' Aliff Syukri?", a: "Tiada sama sekali. Ini kedai fiksyen bebas. Kami bukan kedai rasmi, wakil, pengedar atau rakan kongsi mana-mana jenama sebenar. Semua produk di sini menggunakan nama rekaan." },
  { q: "Penghantaran berapa lama?", a: "Dalam demo ini, penghantaran tidak berlaku. Di kedai sebenar, Semenanjung biasanya 2–4 hari bekerja dan Sabah/Sarawak 4–7 hari bekerja." },
  { q: "Boleh bayar guna FPX atau e-wallet?", a: "Dalam demo, pilihan bayaran hanya simulasi — tiada transaksi sebenar dijalankan dan tiada maklumat pembayaran diambil." },
  { q: "Produk ada jaminan?", a: "Setiap kedai sebenar mempunyai polisi sendiri. Dalam demo ini tiada jaminan kerana tiada jual beli sebenar berlaku." },
  { q: "Boleh saya dapat kedai macam ini?", a: "Boleh. Klik butang \"Dapatkan Kedai Online Saya\" di bawah untuk ke Forge Sales dan lihat pakej yang tersedia." },
];

/* ---------- Helper ---------- */
function findProduct(sku) {
  return PRODUCTS.find((p) => p.sku === sku) || null;
}
function money(n) {
  return "RM" + Number(n).toFixed(2).replace(/\.00$/, "");
}
function prodById(id) {
  return PRODUCTS.find((p) => p.sku === id);
}
