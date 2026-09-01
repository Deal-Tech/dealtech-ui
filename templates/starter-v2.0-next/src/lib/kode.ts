
const VOKAL = new Set(['A', 'E', 'I', 'O', 'U']);

function kataKode(nama: string): string[] {
  return nama
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean);
}

export function singkatNama(nama: string, maks: number): string {
  const kata = kataKode(nama);
  if (kata.length === 0 || maks < 1) return '';

  const utama = kata[0];
  let hasil = utama[0];
  for (let i = 1; i < utama.length && hasil.length < maks; i++) {
    if (!VOKAL.has(utama[i])) hasil += utama[i];
  }

  if (hasil.length < maks) hasil = utama.length > maks ? utama.slice(0, maks) : utama;

  for (let i = 1; i < kata.length && hasil.length < 2; i++) hasil += kata[i];

  return hasil.slice(0, maks);
}

export function pratinjauKodeKategori(nama: string): string {
  const kata = kataKode(nama);
  for (let i = kata.length - 1; i >= 0; i--) {
    if (kata[i].length >= 2) return kata[i].slice(0, 10);
  }
  return 'KTG';
}

export function pratinjauKodeSpot(nama: string): string {
  const kata = kataKode(nama);
  if (kata.length === 0) return 'SPOT';
  if (kata.length === 1) return kata[0].slice(0, 10);

  let hasil = kata[0].slice(0, 4);
  for (let i = 1; i < kata.length && hasil.length < 10; i++) hasil += kata[i].slice(0, 3);
  return hasil.slice(0, 10);
}

function seluruhKata(nama: string, cadangan: string): string {
  const kata = kataKode(nama);
  if (kata.length === 0) return cadangan;
  if (kata.length === 1) return kata[0].slice(0, 10);

  let hasil = kata[0].slice(0, 4);
  for (let i = 1; i < kata.length && hasil.length < 10; i++) hasil += kata[i].slice(0, 3);
  return hasil.slice(0, 10);
}

export function pratinjauKodeTour(nama: string): string {
  return seluruhKata(nama, 'TOUR');
}

export function pratinjauKodePaket(nama: string): string {
  return seluruhKata(nama, 'PAKET');
}

export function pratinjauKodeWarna(nama: string): string {
  const s = singkatNama(nama, 3);
  return s.length < 2 ? 'WR' : s;
}

export function pratinjauKodeBahan(nama: string): string {
  return 'BB-' + (singkatNama(nama, 3) || 'X');
}

export function pratinjauKodeSepatu(kodeYangAda: string[]): string {
  let tertinggi = 0;
  for (const k of kodeYangAda) {
    const n = Number(k.toUpperCase().replace(/^SP-/, ''));
    if (Number.isInteger(n) && n > tertinggi) tertinggi = n;
  }
  return `SP-${String(tertinggi + 1).padStart(3, '0')}`;
}
