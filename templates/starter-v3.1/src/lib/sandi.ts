
export const PANJANG_MIN_SANDI = 15;

export const PANJANG_MAKS_SANDI = 128;

const SANDI_TERLARANG = [
  'password',
  'passw0rd',
  'qwerty',
  'admin',
  'administrator',
  'dealtech',
  'dealtechui',
  'deal tech',
  '123456',
  '12345678',
  '123456789',
  '1234567890',
  'iloveyou',
  'letmein',
  'welcome',
];

export function periksaSandi(sandi: string): string | null {
  if (!sandi) return 'Kata sandi wajib diisi.';

  if (sandi.length < PANJANG_MIN_SANDI) {
    return `Kata sandi minimal ${PANJANG_MIN_SANDI} karakter. Frasa yang mudah diingat lebih aman daripada sandi pendek yang rumit.`;
  }

  if (sandi.length > PANJANG_MAKS_SANDI) {
    return `Kata sandi maksimal ${PANJANG_MAKS_SANDI} karakter.`;
  }

  if (sandi !== sandi.trim()) {
    return 'Kata sandi tidak boleh diawali atau diakhiri spasi.';
  }

  const rendah = sandi.toLowerCase();
  if (SANDI_TERLARANG.some((s) => rendah === s || rendah.includes(s))) {
    return (
      'Kata sandi mengandung kata yang terlalu umum ' +
      '(nama usaha, admin, password, qwerty, welcome, rahasia, atau deretan angka). ' +
      'Pilih yang lain.'
    );
  }

  if (new Set(sandi).size < 5) {
    return 'Kata sandi terlalu sedikit variasi karakternya.';
  }

  return null;
}

export function kekuatanSandi(sandi: string): { nilai: 0 | 1 | 2 | 3; label: string } {
  if (sandi.length < PANJANG_MIN_SANDI) return { nilai: 0, label: 'Terlalu pendek' };
  if (periksaSandi(sandi)) return { nilai: 1, label: 'Lemah' };
  const variasi = new Set(sandi).size;
  if (sandi.length >= 20 && variasi >= 12) return { nilai: 3, label: 'Kuat' };
  return { nilai: 2, label: 'Cukup' };
}
