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
    const mentah = window.sessionStorage.getItem(KUNCI_SESI);
    return mentah ? (JSON.parse(mentah) as Pengguna) : null;
  } catch {
    return null;
  }
}

export function simpanSesi(u: Pengguna | null): void {
  try {
    if (u) window.sessionStorage.setItem(KUNCI_SESI, JSON.stringify(u));
    else window.sessionStorage.removeItem(KUNCI_SESI);
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
