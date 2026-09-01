/**
 * Kebijakan kata sandi — NIST SP 800-63B Rev 4.
 *
 * Minimum 15 karakter (boleh 8 HANYA kalau sudah ada MFA — belum ada di sini),
 * dan TIDAK ADA aturan komposisi: Rev 4 melarangnya.
 *
 * Ini validasi UX saja. Pemeriksaan terhadap daftar sandi bocor wajib di
 * backend; jangan pernah menganggap berkas ini pengaman.
 */

export const PANJANG_MIN_SANDI = 15;

// Batas atas supaya input raksasa tidak jadi beban hashing di backend.
export const PANJANG_MAKS_SANDI = 128;

const SANDI_TERLARANG = [
  'password',
  'passw0rd',
  'qwerty',
  'admin',
  'administrator',
  'giligoodguide',
  'giligood',
  'gili good guide',
  'gili good',
  '123456',
  '12345678',
  '123456789',
  '1234567890',
  'iloveyou',
  'letmein',
  'welcome',
];

/** Mengembalikan pesan galat, atau null kalau sandi lolos. */
export function periksaSandi(sandi: string): string | null {
  if (!sandi) return 'Kata sandi wajib diisi.';

  if (sandi.length < PANJANG_MIN_SANDI) {
    return `Kata sandi minimal ${PANJANG_MIN_SANDI} karakter. Frasa yang mudah diingat lebih aman daripada sandi pendek yang rumit.`;
  }

  if (sandi.length > PANJANG_MAKS_SANDI) {
    return `Kata sandi maksimal ${PANJANG_MAKS_SANDI} karakter.`;
  }

  // Spasi di awal/akhir hampir selalu salah ketik dan bikin gagal login diam-diam.
  if (sandi !== sandi.trim()) {
    return 'Kata sandi tidak boleh diawali atau diakhiri spasi.';
  }

  const rendah = sandi.toLowerCase();
  if (SANDI_TERLARANG.some((s) => rendah === s || rendah.includes(s))) {
    // Kata yang cocok sengaja tidak disebut — itu membocorkan sepotong sandi.
    return (
      'Kata sandi mengandung kata yang terlalu umum ' +
      '(nama usaha, admin, password, qwerty, welcome, rahasia, atau deretan angka). ' +
      'Pilih yang lain.'
    );
  }

  // Satu karakter diulang-ulang ("aaaaaaaaaaaaaaa") lolos syarat panjang tapi tidak aman.
  if (new Set(sandi).size < 5) {
    return 'Kata sandi terlalu sedikit variasi karakternya.';
  }

  return null;
}

/** Indikator kekuatan untuk UI. Murni informatif, bukan gerbang kelulusan. */
export function kekuatanSandi(sandi: string): { nilai: 0 | 1 | 2 | 3; label: string } {
  if (sandi.length < PANJANG_MIN_SANDI) return { nilai: 0, label: 'Terlalu pendek' };
  if (periksaSandi(sandi)) return { nilai: 1, label: 'Lemah' };
  const variasi = new Set(sandi).size;
  if (sandi.length >= 20 && variasi >= 12) return { nilai: 3, label: 'Kuat' };
  return { nilai: 2, label: 'Cukup' };
}
