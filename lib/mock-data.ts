export type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
};

export type KpiCard = {
  title: string;
  value: string;
  change: string;
  detail: string;
};

export type Customer = {
  name: string;
  segment: string;
  contact: string;
  products: string;
  renewal: string;
  owner: string;
};

export type Policy = {
  customer: string;
  branch: string;
  insurer: string;
  expiry: string;
  status: string;
  premium: string;
};

export type Lead = {
  name: string;
  source: string;
  score: string;
  product: string;
  action: string;
  owner: string;
};

export type TeamMember = {
  name: string;
  role: string;
  sales: string;
  conversion: string;
  focus: string;
};

export type Message = {
  from: string;
  topic: string;
  body: string;
  time: string;
};

export type TaskCard = {
  title: string;
  text: string;
};

export type Agency = {
  slug: string;
  name: string;
  city: string;
  users: string;
  products: string;
  monthlyPremium: string;
  themeLabel: string;
  kpis: KpiCard[];
  customers: Customer[];
  policies: Policy[];
  leads: Lead[];
  teamMembers: TeamMember[];
  messages: Message[];
  operationCards: TaskCard[];
};

export const navItems: NavItem[] = [
  { href: "#genel-bakis", label: "Ana Panel", shortLabel: "Panel" },
  { href: "#musteri-yonetimi", label: "Musteriler", shortLabel: "Musteri" },
  { href: "#police-yonetimi", label: "Policeler", shortLabel: "Police" },
  { href: "#lead-akisi", label: "Lead Merkezi", shortLabel: "Lead" },
  { href: "#ekip", label: "Ekip ve Satis", shortLabel: "Ekip" },
  { href: "#operasyon", label: "Operasyon", shortLabel: "Ops" },
];

function buildAgency(
  slug: string,
  name: string,
  city: string,
  users: string,
  products: string,
  monthlyPremium: string,
  themeLabel: string,
  offset: number,
): Agency {
  return {
    slug,
    name,
    city,
    users,
    products,
    monthlyPremium,
    themeLabel,
    kpis: [
      {
        title: "Aktif Police",
        value: `${1284 + offset}`,
        change: `+%${8 + offset}`,
        detail: "Bu ay yeni police hareketi var",
      },
      {
        title: "Bugun Gelen Lead",
        value: `${74 + offset}`,
        change: `+${12 + offset}`,
        detail: "Meta Ads ve web formlari bagli",
      },
      {
        title: "Yenileme Riski",
        value: `${38 - Math.min(offset, 9)}`,
        change: `-${3 + offset}`,
        detail: "7 gun icinde donus bekleyen kayitlar",
      },
      {
        title: "Aylik Prim Uretimi",
        value: monthlyPremium,
        change: `+%${11 + offset}`,
        detail: "Tum police dallarinin toplami",
      },
    ],
    customers: [
      {
        name: `${name} Portfoy / Deniz Lojistik`,
        segment: "Kurumsal",
        contact: "Selim Karahan / 0532 455 11 90",
        products: "Filo kasko, trafik, isyeri",
        renewal: "12 Nisan 2026",
        owner: "Melis Kaya",
      },
      {
        name: `${name} Portfoy / Ayse Yildiz`,
        segment: "Bireysel",
        contact: "0541 212 08 53 / ayse@ornek.com",
        products: "TSS, konut, DASK",
        renewal: "14 Nisan 2026",
        owner: "Emre Acar",
      },
      {
        name: `${name} Portfoy / Mavi Yapi Ltd.`,
        segment: "KOBI",
        contact: "0212 555 40 12 / Hakan Mert",
        products: "Isyeri paket, muhendislik",
        renewal: "16 Nisan 2026",
        owner: "Seda Cetin",
      },
    ],
    policies: [
      {
        customer: "Deniz Lojistik A.S.",
        branch: "Filo Kasko",
        insurer: "Anadolu Sigorta",
        expiry: "12 Nisan 2026",
        status: "Teklif gonderildi",
        premium: `TL${486000 + offset * 10000}`,
      },
      {
        customer: "Ayse Yildiz",
        branch: "Tamamlayici Saglik",
        insurer: "Allianz",
        expiry: "14 Nisan 2026",
        status: "Donus bekleniyor",
        premium: `TL${18400 + offset * 500}`,
      },
      {
        customer: "Mavi Yapi Ltd.",
        branch: "Isyeri Paket",
        insurer: "Aksigorta",
        expiry: "16 Nisan 2026",
        status: "Evrak eksik",
        premium: `TL${62750 + offset * 1300}`,
      },
    ],
    leads: [
      {
        name: "Elif Karatas",
        source: "Meta Ads / Kasko",
        score: `${89 - offset}`,
        product: "Kasko",
        action: "2 dk once arandi",
        owner: "Melis Kaya",
      },
      {
        name: "Rota Nakliyat",
        source: "Meta Ads / Filo",
        score: `${93 - offset}`,
        product: "Filo",
        action: "WhatsApp teklif paylasildi",
        owner: "Emre Acar",
      },
      {
        name: "Tuna Apartmani",
        source: "Landing Page / DASK",
        score: `${75 + offset}`,
        product: "DASK",
        action: "PDF teklif indirildi",
        owner: "Seda Cetin",
      },
    ],
    teamMembers: [
      {
        name: "Melis Kaya",
        role: "Kurumsal Satis",
        sales: `TL${1240000 + offset * 40000}`,
        conversion: `%${31 + offset}`,
        focus: "Filo ve isyeri police yenileme",
      },
      {
        name: "Emre Acar",
        role: "Bireysel Satis",
        sales: `TL${920000 + offset * 35000}`,
        conversion: `%${28 + offset}`,
        focus: "Kasko ve saglik lead donusumu",
      },
      {
        name: "Seda Cetin",
        role: "Yenileme Uzmani",
        sales: `TL${810000 + offset * 30000}`,
        conversion: `%${42 - Math.min(offset, 6)}`,
        focus: "Bitise yakin police aksiyonu",
      },
    ],
    messages: [
      {
        from: "Operasyon",
        topic: `${name} filo yenileme`,
        body: "Ruhsat listesi guncellendi, son fiyat teklifi bekleniyor.",
        time: "09:40",
      },
      {
        from: "Muhasebe",
        topic: "Tahsilat kontrolu",
        body: "Kredi karti provizyonu tamamlandi, police kesime hazir.",
        time: "10:15",
      },
      {
        from: "Pazarlama",
        topic: "Meta Ads kalite uyarisi",
        body: "Kasko kampanyasinda CPL oynuyor, yeni hedef kitle test ediliyor.",
        time: "11:05",
      },
    ],
    operationCards: [
      {
        title: "PDF Kayit Merkezi",
        text: "Teklif formlari, police kopyalari ve tahsilat dokumleri musteri kartina baglanir.",
      },
      {
        title: "Hasar Dosya Akisi",
        text: "Eksper atamasi ve odeme sureci tek akista izlenir.",
      },
      {
        title: "Gorev Motoru",
        text: "Yenileme tarihine 30-15-7 gun kala otomatik gorev uretilir.",
      },
      {
        title: "Mobil PWA Deneyimi",
        text: "Saha ve merkez ekipleri ayni paneli telefonunda da kullanir.",
      },
    ],
  };
}

export const agencies: Agency[] = [
  buildAgency(
    "adn-grup-sigorta",
    "ADN Grup Sigorta",
    "Istanbul",
    "adnsigorta kullanicisi",
    "Kasko, trafik, saglik, DASK",
    "TL4,8 Mn",
    "Tek merkezli ADN operasyon yapisi",
    2,
  ),
];

export function getAgencyBySlug(slug: string) {
  return agencies.find((agency) => agency.slug === slug);
}
