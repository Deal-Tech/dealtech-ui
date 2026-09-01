import { menu as menuBawaan, type AppMenu, type MenuItem } from './menu';

export interface JudulHalaman {
  /** Nama halaman dari menu — atau nama induknya kalau ini halaman detail. */
  label: string;
  /** Segmen terakhir jalur detail, mis. kode tour. Kosong di halaman biasa. */
  segmen?: string;
}

interface Entri {
  item: MenuItem;
  grup?: string;
}

/** Buang hash, query, dan garis miring penutup supaya jalur bisa dibandingkan. */
function rapikan(jalur: string): string {
  const bersih = jalur.split('#')[0]?.split('?')[0] ?? '';
  return bersih.length > 1 ? bersih.replace(/\/+$/, '') : bersih;
}

function daftarEntri(sumber: AppMenu): Entri[] {
  return [
    ...sumber.main.map((item) => ({ item })),
    ...sumber.groups.flatMap((g) => g.items.map((item) => ({ item, grup: g.label }))),
    ...sumber.others.map((item) => ({ item })),
  ].filter((e) => !e.item.external);
}

const BATAS_SEGMEN = 40;

/**
 * Segmen jalur datang dari URL, jadi isinya bisa apa saja: karakter kendali dan
 * format (termasuk pembalik arah teks) dibuang supaya judul tidak bisa disamarkan.
 */
function segmenAman(mentah: string): string {
  let teks = mentah;
  try {
    teks = decodeURIComponent(mentah);
  } catch {
    // Persentase yang tidak sah dibiarkan apa adanya.
  }
  teks = teks.replace(/[\p{Cc}\p{Cf}]/gu, '').trim();
  return teks.length > BATAS_SEGMEN ? `${teks.slice(0, BATAS_SEGMEN)}…` : teks;
}

/**
 * Nama halaman untuk breadcrumb topbar, dicocokkan ke `menu.ts`.
 * Jalur yang tidak ada di menu mengembalikan `null` — breadcrumb disembunyikan,
 * bukan diisi URL mentah.
 */
export function judulHalaman(pathname: string, sumber: AppMenu = menuBawaan): JudulHalaman | null {
  const jalur = rapikan(pathname);
  const entri = daftarEntri(sumber);

  const persis = entri.find((e) => rapikan(e.item.href) === jalur);
  if (persis) return { label: persis.item.label };

  const induk = entri
    .filter((e) => jalur.startsWith(`${rapikan(e.item.href)}/`))
    .sort((a, b) => rapikan(b.item.href).length - rapikan(a.item.href).length)[0];
  if (!induk) return null;

  const terakhir = jalur.split('/').filter(Boolean).pop() ?? '';
  const segmen = segmenAman(terakhir);
  if (!segmen) return { label: induk.item.label };

  // Induk halaman detail = grup sidebarnya, mis. "Tour & Paket / SNOR3GIL".
  return { label: induk.grup ?? induk.item.label, segmen };
}

export default judulHalaman;
