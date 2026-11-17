import { menu as menuBawaan, type AppMenu, type MenuItem } from './menu';

export interface JudulHalaman {
  label: string;
  segmen?: string;
}

interface Entri {
  item: MenuItem;
  grup?: string;
}

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

function segmenAman(mentah: string): string {
  let teks = mentah;
  try {
    teks = decodeURIComponent(mentah);
  } catch {
  }
  teks = teks.replace(/[\p{Cc}\p{Cf}]/gu, '').trim();
  return teks.length > BATAS_SEGMEN ? `${teks.slice(0, BATAS_SEGMEN)}…` : teks;
}

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

  return { label: induk.grup ?? induk.item.label, segmen };
}

export default judulHalaman;
