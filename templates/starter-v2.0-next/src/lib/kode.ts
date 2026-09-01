/**
 * Pratinjau kode barang — cerminan `backend/internal/store/kode.go`, yang jadi
 * satu-satunya pembuat kode sungguhan. Hasil di sini tidak pernah dikirim.
 *
 * Bisa meleset kalau kode dasarnya sudah dipakai (server menambah pembeda),
 * karena itu ditampilkan sebagai perkiraan. **Kalau aturan di server berubah,
 * berkas ini ikut diubah.**
 */

const VOKAL = new Set(['A', 'E', 'I', 'O', 'U']);

/** Memecah nama jadi kata berisi A–Z dan 0–9 saja; selain itu jadi pemisah. */
function kataKode(nama: string): string[] {
  return nama
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter(Boolean);
}

/**
 * Singkatan dari kata pertama sebuah nama.
 *
 *   Hitam              → HTM   huruf awal + konsonan berikutnya
 *   Biru               → BIR   konsonannya kurang, jadi huruf awalnya apa adanya
 *   Lem Kuning         → LEM
 *   Kulit Sapi Grade A → KLT
 */
export function singkatNama(nama: string, maks: number): string {
  const kata = kataKode(nama);
  if (kata.length === 0 || maks < 1) return '';

  const utama = kata[0];
  let hasil = utama[0];
  for (let i = 1; i < utama.length && hasil.length < maks; i++) {
    if (!VOKAL.has(utama[i])) hasil += utama[i];
  }

  if (hasil.length < maks) hasil = utama.length > maks ? utama.slice(0, maks) : utama;

  // Kata pertama satu huruf: sambung kata berikutnya, biar tidak menabrak.
  for (let i = 1; i < kata.length && hasil.length < 2; i++) hasil += kata[i];

  return hasil.slice(0, maks);
}

/** Kata terakhir nama kategori — "Sepatu Formal" → FORMAL. Maks 10, selebar kolomnya. */
export function pratinjauKodeKategori(nama: string): string {
  const kata = kataKode(nama);
  for (let i = kata.length - 1; i >= 0; i--) {
    if (kata[i].length >= 2) return kata[i].slice(0, 10);
  }
  return 'KTG';
}

/**
 * Cerminan `dasarSpot` di store/kode.go: 4 huruf kata pertama + 3 huruf
 * tiap kata berikutnya, maks 10. "Gili Trawangan" → GILITRA.
 */
export function pratinjauKodeSpot(nama: string): string {
  const kata = kataKode(nama);
  if (kata.length === 0) return 'SPOT';
  if (kata.length === 1) return kata[0].slice(0, 10);

  let hasil = kata[0].slice(0, 4);
  for (let i = 1; i < kata.length && hasil.length < 10; i++) hasil += kata[i].slice(0, 3);
  return hasil.slice(0, 10);
}

/**
 * Sama seperti spot: 4 huruf kata pertama + 3 huruf tiap kata berikutnya, maks 10.
 * Cerminan `dasarSeluruhKata` di store/kode.go — kalau salah satunya berubah, yang
 * lain WAJIB ikut, kalau tidak kode di layar beda dari yang ditulis server.
 */
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

/** 3 huruf — kode warna ikut menyusun kode varian yang dicetak jadi QR. */
export function pratinjauKodeWarna(nama: string): string {
  const s = singkatNama(nama, 3);
  return s.length < 2 ? 'WR' : s;
}

/** BB- + singkatan, supaya kode bahan langsung beda bentuk dari kode model sepatu. */
export function pratinjauKodeBahan(nama: string): string {
  return 'BB-' + (singkatNama(nama, 3) || 'X');
}

/**
 * Nomor urut model berikutnya. Bukan singkatan nama: kode ini jadi awalan kode
 * varian di QR (SP-001-40-HTM), dan nomor urut membuat panjang labelnya tetap.
 */
export function pratinjauKodeSepatu(kodeYangAda: string[]): string {
  let tertinggi = 0;
  for (const k of kodeYangAda) {
    const n = Number(k.toUpperCase().replace(/^SP-/, ''));
    if (Number.isInteger(n) && n > tertinggi) tertinggi = n;
  }
  return `SP-${String(tertinggi + 1).padStart(3, '0')}`;
}
