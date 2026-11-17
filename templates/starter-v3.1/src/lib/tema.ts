/** Warna utama bawaan theme.css. */
export const WARNA_BAWAAN = '#01498b';

const KUNCI = 'dealtech_warna_tema';

export interface TurunanWarna {
  utama: string;
  gelap: string;
  lebihGelap: string;
  aksen: string;
}

// Sama persis dengan theme.css
const TURUNAN_BAWAAN: TurunanWarna = {
  utama: WARNA_BAWAAN,
  gelap: '#013a6f',
  lebihGelap: '#012c54',
  aksen: '#0a6bc4',
};

// Variabel CSS tiap turunan
const VARIABEL: Record<keyof TurunanWarna, string> = {
  utama: '--color-primary',
  gelap: '--color-primary-dark',
  lebihGelap: '--color-primary-darker',
  aksen: '--color-accent',
};

type Tiga = [number, number, number];

/** "#abc", "abc", atau "aabbcc" jadi "#aabbcc". */
export function rapikanHex(teks: string): string | null {
  const isi = teks.trim().replace(/^#/, '').toLowerCase();
  if (/^[0-9a-f]{3}$/.test(isi)) return `#${[...isi].map((c) => c + c).join('')}`;
  if (/^[0-9a-f]{6}$/.test(isi)) return `#${isi}`;
  return null;
}

const keRgb = (hex: string): Tiga => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Tiga;

const keHex = (rgb: Tiga): string =>
  `#${rgb.map((n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0')).join('')}`;

function keHsl([r, g, b]: Tiga): Tiga {
  const [rr, gg, bb] = [r / 255, g / 255, b / 255];
  const maks = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (maks + min) / 2;
  const d = maks - min;
  if (d === 0) return [0, 0, l];
  const s = l > 0.5 ? d / (2 - maks - min) : d / (maks + min);
  let h = maks === rr ? (gg - bb) / d + (gg < bb ? 6 : 0) : maks === gg ? (bb - rr) / d + 2 : (rr - gg) / d + 4;
  h *= 60;
  return [h, s, l];
}

function dariHsl([h, s, l]: Tiga): Tiga {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

/** Hover/aktif lebih gelap, aksen lebih terang. */
export function turunanWarna(hex: string): TurunanWarna {
  if (hex === WARNA_BAWAAN) return TURUNAN_BAWAAN;
  const rgb = keRgb(hex);
  const [h, s, l] = keHsl(rgb);
  return {
    utama: hex,
    gelap: keHex(rgb.map((n) => n * 0.8) as Tiga),
    lebihGelap: keHex(rgb.map((n) => n * 0.6) as Tiga),
    aksen: keHex(dariHsl([h, s * 0.92, Math.min(l + 0.13, 0.75)])),
  };
}

// Luminans relatif WCAG
function luminans(hex: string): number {
  const [r, g, b] = keRgb(hex).map((n) => {
    const c = n / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Rasio kontras teks putih di atasnya. */
export function kontrasPutih(hex: string): number {
  return 1.05 / (luminans(hex) + 0.05);
}

/** Bawaan: kembali ke theme.css. */
export function terapkanWarna(hex: string): void {
  const gaya = document.documentElement.style;
  const turunan = turunanWarna(hex);
  for (const kunci of Object.keys(VARIABEL) as (keyof TurunanWarna)[]) {
    if (hex === WARNA_BAWAAN) gaya.removeProperty(VARIABEL[kunci]);
    else gaya.setProperty(VARIABEL[kunci], turunan[kunci]);
  }
}

export function bacaWarnaTersimpan(): string {
  try {
    return rapikanHex(window.localStorage.getItem(KUNCI) ?? '') ?? WARNA_BAWAAN;
  } catch {
    return WARNA_BAWAAN;
  }
}

/** Dipakai lagi saat halaman dimuat. */
export function ingatWarna(hex: string): void {
  try {
    if (hex === WARNA_BAWAAN) window.localStorage.removeItem(KUNCI);
    else window.localStorage.setItem(KUNCI, hex);
  } catch {
    // Penyimpanan diblokir.
  }
}
