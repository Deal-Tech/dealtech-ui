import type { Pengguna } from '@/services/auth';

/** Setel false saat backend siap. */
export const MODE_DEMO: boolean = true;

const KUNCI_SESI = 'dealtech_sesi_demo';

/** Jeda palsu biar tombol loading terlihat. */
export function jeda(ms = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function namaDariEmail(email: string): string {
  const depan = email.split('@')[0] ?? '';
  const nama = depan
    .split(/[._-]+/)
    .filter(Boolean)
    .map((kata) => kata.charAt(0).toUpperCase() + kata.slice(1))
    .join(' ');
  return nama || 'Pengguna';
}

export function penggunaDemo(email: string): Pengguna {
  return {
    id: 1,
    name: namaDariEmail(email),
    email,
    role: 'admin',
    is_active: true,
    zona_waktu: 'WIB',
  };
}

export function bacaSesi(): Pengguna | null {
  try {
    const mentah =
      window.localStorage.getItem(KUNCI_SESI) ?? window.sessionStorage.getItem(KUNCI_SESI);
    return mentah ? (JSON.parse(mentah) as Pengguna) : null;
  } catch {
    return null;
  }
}

/** Sesi yang sedang berjalan disimpan permanen atau tidak. */
export function sesiDiingat(): boolean {
  try {
    return window.localStorage.getItem(KUNCI_SESI) !== null;
  } catch {
    return false;
  }
}

/**
 * "Ingat saya" cuma memilih tempat: localStorage bertahan sesudah jendelanya
 * ditutup, sessionStorage ikut hilang bersama tabnya.
 *
 * Bawaan `ingat` sengaja membaca keadaan sekarang, bukan false — supaya
 * penyuntingan profil lewat ubahSesi tidak diam-diam menurunkan sesi yang sudah
 * diingat jadi sesi setab.
 */
export function simpanSesi(u: Pengguna | null, ingat: boolean = sesiDiingat()): void {
  try {
    // Dibersihkan dari dua-duanya dulu; kalau tidak, sesi lama tertinggal di
    // tempat yang satunya saat pilihannya berubah.
    window.localStorage.removeItem(KUNCI_SESI);
    window.sessionStorage.removeItem(KUNCI_SESI);
    if (u) {
      const gudang = ingat ? window.localStorage : window.sessionStorage;
      gudang.setItem(KUNCI_SESI, JSON.stringify(u));
    }
  } catch {
    // Penyimpanan diblokir.
  }
}

/** Ubah sebagian sesi, kembalikan hasilnya. */
export function ubahSesi(tambalan: Partial<Pengguna>): Pengguna {
  const kini = bacaSesi() ?? penggunaDemo('admin@dealtech-ui.com');
  const baru = { ...kini, ...tambalan };
  simpanSesi(baru);
  return baru;
}

/** Baca nilai demo dari sessionStorage. */
export function bacaData<T>(kunci: string, bawaan: T): T {
  try {
    const mentah = window.sessionStorage.getItem(kunci);
    return mentah ? (JSON.parse(mentah) as T) : bawaan;
  } catch {
    return bawaan;
  }
}

export function simpanData<T>(kunci: string, nilai: T): T {
  try {
    window.sessionStorage.setItem(kunci, JSON.stringify(nilai));
  } catch {
    // Penyimpanan diblokir.
  }
  return nilai;
}
